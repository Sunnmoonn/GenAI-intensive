/**
 * Cron scheduler — run as background process
 * Usage: npx tsx cron/scheduler.ts
 * Or with PM2: pm2 start "npx tsx cron/scheduler.ts" --name startup-cron
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import cron from 'node-cron';
import { syncYC } from '../scrapers/yc';
import { syncProductHunt } from '../scrapers/producthunt';
import { syncCrunchbase } from '../scrapers/crunchbase';
import { translateBatch } from '../lib/translator';
import { computeWeeklyTop, computeMonthlyTop } from '../lib/rankings';
import { db } from '../db';
import { startups } from '../db/schema';
import { isNull, eq } from 'drizzle-orm';

async function translatePending() {
  const untranslated = db.select({
    id: startups.id,
    tagline: startups.tagline,
    description: startups.description,
    tags: startups.tags,
  })
    .from(startups)
    .where(isNull(startups.translatedAt))
    .limit(100) // translate up to 100 per run
    .all();

  if (untranslated.length === 0) return;
  console.log(`[cron] Translating ${untranslated.length} items...`);

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
    300,
  );
}

// Daily at 06:00 Moscow time (UTC+3 = 03:00 UTC)
cron.schedule('0 3 * * *', async () => {
  console.log('[cron] Daily sync started');
  try {
    await syncYC();
    await syncProductHunt({ daysBack: 1 });
    await translatePending();
    await computeWeeklyTop();
    console.log('[cron] Daily sync complete');
  } catch (err) {
    console.error('[cron] Daily sync error:', err);
  }
});

// Weekly on Monday at 04:00 UTC — full YC sync + Crunchbase
cron.schedule('0 4 * * 1', async () => {
  console.log('[cron] Weekly sync started');
  try {
    await syncYC({ fullSync: false });
    await syncCrunchbase();
    await translatePending();
    await computeWeeklyTop();
    console.log('[cron] Weekly sync complete');
  } catch (err) {
    console.error('[cron] Weekly sync error:', err);
  }
});

// Monthly on 1st at 05:00 UTC
cron.schedule('0 5 1 * *', async () => {
  console.log('[cron] Monthly rankings computed');
  try {
    await computeMonthlyTop();
  } catch (err) {
    console.error('[cron] Monthly rankings error:', err);
  }
});

console.log('[cron] Scheduler started. Waiting for jobs...');
console.log('[cron] Jobs: daily 06:00 MSK, weekly Mon 07:00 MSK, monthly 1st 08:00 MSK');
