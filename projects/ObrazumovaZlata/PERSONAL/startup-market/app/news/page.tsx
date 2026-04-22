import { db } from '@/db';
import { news } from '@/db/schema';
import { desc, eq, sql, gte } from 'drizzle-orm';
import { channelLabel, TELEGRAM_CHANNELS } from '@/scrapers/telegram';
import { LogoImage } from '@/components/LogoImage';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const CHANNEL_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  businessincognita: { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-500' },
  ventureinpics:     { bg: 'bg-blue-100',   text: 'text-blue-800',   dot: 'bg-blue-500'   },
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'long',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function formatDateShort(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  } catch {
    return iso;
  }
}

function truncateText(text: string, max = 400): { short: string; truncated: boolean } {
  if (text.length <= max) return { short: text, truncated: false };
  const cut = text.slice(0, max).lastIndexOf(' ');
  return { short: text.slice(0, cut > 0 ? cut : max), truncated: true };
}

interface Props {
  searchParams: Promise<{ channel?: string }>;
}

export default async function NewsPage({ searchParams }: Props) {
  const { channel: filterChannel } = await searchParams;

  // Last 7 days — for the digest block
  const since = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const weeklyPosts = db
    .select()
    .from(news)
    .where(gte(news.publishedAt, since))
    .orderBy(desc(news.publishedAt))
    .limit(5)
    .all();

  const weeklyCount = db
    .select({ cnt: sql<number>`count(*)` })
    .from(news)
    .where(gte(news.publishedAt, since))
    .get()?.cnt ?? 0;

  // Main feed
  const items = filterChannel
    ? db.select().from(news).where(eq(news.channel, filterChannel)).orderBy(desc(news.publishedAt)).limit(100).all()
    : db.select().from(news).orderBy(desc(news.publishedAt)).limit(100).all();

  // Count per channel for filter pills
  const counts = db
    .select({ channel: news.channel, cnt: sql<number>`count(*)` })
    .from(news)
    .groupBy(news.channel)
    .all();
  const countMap = Object.fromEntries(counts.map(r => [r.channel, r.cnt]));

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Новости</h1>
        <p className="text-sm text-slate-500">Дайджест из Telegram-каналов о стартапах и венчурном рынке</p>
      </div>

      {/* Weekly digest */}
      {weeklyPosts.length > 0 && (
        <div className="bg-gradient-to-br from-blue-950/40 to-indigo-950/30 rounded-2xl border border-blue-800/30 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-base">📋</span>
              <h2 className="font-bold text-white">Сводка за неделю</h2>
            </div>
            <span className="text-xs text-slate-500">
              {weeklyCount} публикаций · {formatDateShort(since)} — сегодня
            </span>
          </div>
          <div className="space-y-3">
            {weeklyPosts.map(post => {
              const cfg = CHANNEL_COLORS[post.channel] ?? { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-400' };
              const { short, truncated } = truncateText(post.text, 150);
              return (
                <a
                  key={post.id}
                  href={post.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 group"
                >
                  <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
                  <div className="min-w-0">
                    <p className="text-sm text-slate-300 group-hover:text-blue-300 leading-snug line-clamp-2 transition-colors">
                      {short}{truncated && '…'}
                    </p>
                    <span className={`text-xs font-medium ${cfg.text}`}>
                      {channelLabel(post.channel)} · {formatDateShort(post.publishedAt)}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
          {weeklyCount > 5 && (
            <p className="text-xs text-slate-600 mt-4 pt-3 border-t border-white/8">
              Ещё {weeklyCount - 5} публикаций ниже
            </p>
          )}
        </div>
      )}

      {/* Channel filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/news"
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !filterChannel
              ? 'bg-slate-800 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Все ({counts.reduce((a, b) => a + b.cnt, 0)})
        </Link>
        {TELEGRAM_CHANNELS.map(ch => {
          const cfg = CHANNEL_COLORS[ch] ?? { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-400' };
          const active = filterChannel === ch;
          return (
            <Link
              key={ch}
              href={active ? '/news' : `/news?channel=${ch}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                active ? `${cfg.bg} ${cfg.text} ring-2 ring-offset-1 ring-current` : `${cfg.bg} ${cfg.text} hover:opacity-80`
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
              @{ch}
              {countMap[ch] ? ` (${countMap[ch]})` : ''}
            </Link>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="text-center py-20 text-slate-600">
          <p className="text-base mb-2">Новостей пока нет</p>
          <p className="text-sm">Синхронизация запустится автоматически</p>
        </div>
      )}

      {/* News feed */}
      <div className="space-y-4">
        {items.map(item => {
          const cfg = CHANNEL_COLORS[item.channel] ?? { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-400' };
          const { short, truncated } = truncateText(item.text);

          return (
            <article
              key={item.id}
              className="bg-[#0b1225] rounded-xl border border-white/8 p-5 hover:border-white/15 transition-colors"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {channelLabel(item.channel)}
                </span>
                <time className="text-xs text-slate-400 shrink-0" dateTime={item.publishedAt}>
                  {formatDate(item.publishedAt)}
                </time>
              </div>

              {item.imageUrl && (
                <div className="mb-3 rounded-lg overflow-hidden bg-slate-100">
                  <LogoImage
                    src={item.imageUrl}
                    alt=""
                    className="w-full max-h-64 object-cover"
                  />
                </div>
              )}

              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {short}{truncated && '…'}
              </p>

              <div className="mt-3 pt-3 border-t border-white/6 flex items-center justify-between">
                {truncated && (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    Читать полностью →
                  </a>
                )}
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-600 hover:text-slate-400 ml-auto transition-colors"
                >
                  Открыть в Telegram ↗
                </a>
              </div>
            </article>
          );
        })}
      </div>

      {items.length > 0 && (
        <p className="text-center text-xs text-slate-600 mt-8">
          Показано последних {items.length} публикаций
        </p>
      )}
    </div>
  );
}
