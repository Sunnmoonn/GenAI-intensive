/**
 * Telegram public channel scraper
 * Uses t.me/s/{channel} web preview — no API token needed
 * Only works with public channels
 */

import { parse } from 'node-html-parser';
import { db } from '../db';
import { news } from '../db/schema';

export const TELEGRAM_CHANNELS = ['businessincognita', 'ventureinpics'];

const CHANNEL_LABELS: Record<string, string> = {
  businessincognita: 'Business Incognita',
  ventureinpics:     'Venture in Pics',
};

export function channelLabel(channel: string): string {
  return CHANNEL_LABELS[channel] ?? channel;
}

async function scrapeChannel(channel: string): Promise<number> {
  const url = `https://t.me/s/${channel}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; StartupMarketBot/1.0)',
      'Accept-Language': 'ru,en;q=0.9',
    },
  });

  if (!res.ok) throw new Error(`[tg] ${channel}: HTTP ${res.status}`);

  const html = await res.text();
  const root = parse(html);

  const messages = root.querySelectorAll('.tgme_widget_message');
  let added = 0;

  for (const msg of messages) {
    const dataPost = msg.getAttribute('data-post'); // e.g. 'businessincognita/42'
    if (!dataPost) continue;

    const parts = dataPost.split('/');
    const externalId = parts[parts.length - 1];

    // Text content — skip media-only posts
    const textEl = msg.querySelector('.tgme_widget_message_text');
    const text = textEl?.innerText?.trim() ?? '';
    if (!text) continue;

    // Datetime
    const timeEl = msg.querySelector('time');
    const publishedAt = timeEl?.getAttribute('datetime') ?? new Date().toISOString();

    // Optional image (background-image in style attr)
    const photoWrap = msg.querySelector('.tgme_widget_message_photo_wrap');
    const style = photoWrap?.getAttribute('style') ?? '';
    const imageMatch = style.match(/url\(['"]?([^'")\s]+)['"]?\)/);
    const imageUrl = imageMatch?.[1] ?? null;

    const sourceUrl = `https://t.me/${channel}/${externalId}`;

    try {
      db.insert(news).values({
        channel,
        externalId,
        text,
        imageUrl,
        sourceUrl,
        publishedAt,
      }).run();
      added++;
    } catch {
      // UNIQUE constraint violation = already saved, skip
    }
  }

  return added;
}

export async function syncTelegram(): Promise<Record<string, number>> {
  const results: Record<string, number> = {};

  for (const channel of TELEGRAM_CHANNELS) {
    try {
      console.log(`[tg] Scraping @${channel}...`);
      const count = await scrapeChannel(channel);
      results[channel] = count;
      console.log(`[tg] @${channel}: +${count} new posts`);
      // Small delay between channels
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error(`[tg] @${channel} failed:`, err);
      results[channel] = 0;
    }
  }

  return results;
}
