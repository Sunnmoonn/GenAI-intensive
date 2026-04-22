import Anthropic from '@anthropic-ai/sdk';
import { db } from '../db';
import { news, newsSummaries } from '../db/schema';
import { gte, desc } from 'drizzle-orm';
import { channelLabel } from '../scrapers/telegram';

const client = new Anthropic();

function currentWeekLabel(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  // ISO week number
  const start = new Date(Date.UTC(year, 0, 1));
  const week = Math.ceil(((now.getTime() - start.getTime()) / 86_400_000 + start.getUTCDay() + 1) / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

export async function generateWeeklySummary(): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set');

  // Last 7 days of posts
  const since = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const posts = db
    .select({ channel: news.channel, text: news.text, publishedAt: news.publishedAt })
    .from(news)
    .where(gte(news.publishedAt, since))
    .orderBy(desc(news.publishedAt))
    .all();

  if (posts.length === 0) return '';

  const weekLabel = currentWeekLabel();

  // Format posts for Claude
  const postsText = posts
    .map(p => `[${channelLabel(p.channel)}, ${p.publishedAt.slice(0, 10)}]\n${p.text}`)
    .join('\n\n---\n\n');

  const prompt = `Ты аналитик венчурного рынка. Ниже — посты из Telegram-каналов о стартапах и венчурных инвестициях за последнюю неделю.

Напиши краткий дайджест на русском языке. Структура:

**Главные темы недели**
— 3–5 ключевых тренда или события одной строкой каждый

**Что обсуждали**
2–3 абзаца: о чём шла речь, какие компании упоминались, что примечательно

**Настроение рынка**
1–2 предложения: общий тон (оптимистичный / осторожный / неопределённый) и почему

Пиши лаконично, без воды. Не используй заголовки с ## или ###, только жирный текст (**).

ПОСТЫ:
${postsText}`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 800,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type');

  const summaryText = content.text.trim();

  // Save to DB (upsert by week label — delete old, insert new)
  db.delete(newsSummaries).run(); // keep only latest summary (one row)
  db.insert(newsSummaries).values({
    periodLabel: weekLabel,
    content: summaryText,
    postsCount: posts.length,
  }).run();

  return summaryText;
}

export function getLatestSummary() {
  return db.select().from(newsSummaries).orderBy(desc(newsSummaries.generatedAt)).get() ?? null;
}
