/**
 * Standalone sync script — run manually or via cron
 * Usage:
 *   npx tsx cron/run-sync.ts --source yc --full
 *   npx tsx cron/run-sync.ts --source producthunt --days 7
 *   npx tsx cron/run-sync.ts --source crunchbase
 *   npx tsx cron/run-sync.ts --translate-all
 *   npx tsx cron/run-sync.ts --score-all
 *   npx tsx cron/run-sync.ts --compute-rankings
 *   npx tsx cron/run-sync.ts --all  (full daily sync)
 */

// Load .env.local
import { config } from 'dotenv';
config({ path: '.env.local' });

import { syncYC } from '../scrapers/yc';
import { syncProductHunt } from '../scrapers/producthunt';
import { syncCrunchbase } from '../scrapers/crunchbase';
import { syncTelegram } from '../scrapers/telegram';
import { generateWeeklySummary } from '../lib/news-summary';
import { translateBatch } from '../lib/translator';
import { computeWeeklyTop, computeMonthlyTop } from '../lib/rankings';
import { db } from '../db';
import { startups } from '../db/schema';
import { isNull, eq } from 'drizzle-orm';

const args = process.argv.slice(2);
const has = (flag: string) => args.includes(flag);
const get = (flag: string) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};

async function translateAll() {
  const untranslated = db.select({
    id: startups.id,
    tagline: startups.tagline,
    description: startups.description,
    tags: startups.tags,
  })
    .from(startups)
    .where(isNull(startups.translatedAt))
    .all();

  console.log(`[translate] ${untranslated.length} items to translate`);

  await translateBatch(
    untranslated as Array<{ id: string; tagline?: string | null; description?: string | null; tags?: string[] }>,
    async (id, result) => {
      db.update(startups).set({
        taglineRu: result.tagline,
        descriptionRu: result.description,
        tagsRu: result.tags,
        translatedAt: new Date().toISOString(),
      }).where(eq(startups.id, id)).run();
    },
  );
}

async function main() {
  console.log('[sync] Starting at', new Date().toISOString());

  if (has('--all') || (has('--source') && get('--source') === 'yc')) {
    await syncYC({ fullSync: has('--full'), batch: get('--batch') });
  }

  if (has('--source') && get('--source') === 'producthunt') {
    if (!process.env.PH_DEV_TOKEN) {
      console.log('[sync] Skipping Product Hunt — PH_DEV_TOKEN not set');
    } else {
      const days = has('--days') ? parseInt(get('--days') ?? '1') : 1;
      await syncProductHunt({ daysBack: days });
    }
  }

  if (has('--all') && process.env.PH_DEV_TOKEN) {
    const days = 1;
    await syncProductHunt({ daysBack: days });
  }

  if (has('--source') && get('--source') === 'crunchbase') {
    await syncCrunchbase();
  }

  if (has('--translate-all')) {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.log('[sync] Skipping translation — ANTHROPIC_API_KEY not set');
    } else {
      await translateAll();
    }
  }

  if (has('--all') && process.env.ANTHROPIC_API_KEY) {
    await translateAll();
  }

  if (has('--all') || (has('--source') && get('--source') === 'telegram')) {
    await syncTelegram();
    if (process.env.ANTHROPIC_API_KEY) {
      console.log('[sync] Generating weekly news summary...');
      await generateWeeklySummary();
    }
  }

  if (has('--all') || has('--compute-rankings')) {
    await computeWeeklyTop();
    await computeMonthlyTop();
  }

  console.log('[sync] Done at', new Date().toISOString());
  process.exit(0);
}

main().catch(err => {
  console.error('[sync] Fatal error:', err);
  process.exit(1);
});
