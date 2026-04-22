/**
 * Import analyzed startup data from VENTURE-SCAN RF 2.0 Excel export.
 * Matches by startup name (case-insensitive), updates non-null fields.
 * If startup is not found in DB, inserts a new record.
 *
 * Usage:
 *   npx tsx cron/import-xlsx.ts
 *   npx tsx cron/import-xlsx.ts --dry-run   (show what would be updated/inserted)
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { db } from '../db';
import { startups } from '../db/schema';
import { eq, like } from 'drizzle-orm';
import { readFileSync } from 'fs';
import { join } from 'path';

const isDryRun = process.argv.includes('--dry-run');

interface XlsxRow {
  name: string;
  source?: string;
  batch?: string;
  description_en?: string;
  technologies?: string;
  industry?: string;
  description_ru?: string;
  target_user?: string;
  problem?: string;
  solution?: string;
  founded_year?: number;
  founders?: string;
  founders_links?: string;
  investors?: string;
  funding_rounds?: string;
  mrr_arr?: string;
  audience?: string;
  score_m?: number;
  score_t?: number;
  score_a?: number;
  score_b?: number;
  score_p?: number;
  url?: string;
}

function computeScoreV2(m: number, t: number, a: number, b: number, p: number): number {
  // Formula: (M² × T × A × B × P)^(1/6) × 10
  const product = Math.pow(m, 2) * t * a * b * p;
  return Math.pow(product, 1 / 6) * 10;
}

async function main() {
  const dataPath = join(__dirname, 'xlsx-import.json');
  const rows: XlsxRow[] = JSON.parse(readFileSync(dataPath, 'utf-8'));

  console.log(`Loaded ${rows.length} rows from xlsx-import.json`);
  if (isDryRun) console.log('DRY RUN — no changes will be saved\n');

  let matched = 0;
  let updated = 0;
  let notFound = 0;

  for (const row of rows) {
    if (!row.name) continue;

    // Find startup by exact name first, then fuzzy
    let startup = db
      .select({ id: startups.id, name: startups.name })
      .from(startups)
      .where(like(startups.name, row.name))
      .get();

    if (!startup) {
      // Try case-insensitive partial match
      const nameLower = row.name.toLowerCase();
      const all = db
        .select({ id: startups.id, name: startups.name })
        .from(startups)
        .all();
      startup = all.find(s => s.name.toLowerCase() === nameLower);
    }

    if (!startup) {
      // INSERT new record
      notFound++;
      const slug = row.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const id = `xlsx_${slug}`;
      const now = new Date().toISOString();
      const scoreV2 = (row.score_m && row.score_t && row.score_a && row.score_b && row.score_p)
        ? computeScoreV2(row.score_m, row.score_t, row.score_a, row.score_b, row.score_p)
        : null;
      const newRecord = {
        id,
        source: 'yc' as const,
        sources: ['yc'],
        externalId: slug,
        name: row.name,
        slug,
        sourceUrl: row.url ?? `https://www.ycombinator.com/companies/${slug}`,
        tagline: row.description_en ?? null,
        description: row.description_en ?? null,
        descriptionRu: row.description_ru ?? null,
        tags: row.technologies ? row.technologies.split(',').map((t: string) => t.trim()) : [],
        industries: row.industry ? [row.industry] : [],
        batch: row.batch ?? null,
        foundedYear: row.founded_year ?? null,
        targetUser: row.target_user ?? null,
        problemStatement: row.problem ?? null,
        solutionText: row.solution ?? null,
        foundersText: row.founders ?? null,
        foundersLinks: row.founders_links ?? null,
        investorsText: row.investors ?? null,
        fundingRounds: row.funding_rounds ?? null,
        revenueText: row.mrr_arr ?? null,
        audienceText: row.audience ?? null,
        scoreM: row.score_m ?? null,
        scoreT: row.score_t ?? null,
        scoreA: row.score_a ?? null,
        scoreB: row.score_b ?? null,
        scoreP: row.score_p ?? null,
        scoreV2,
        createdAt: now,
        updatedAt: now,
        scoredAt: scoreV2 != null ? now : null,
      };

      if (isDryRun) {
        const score = scoreV2 ? ` [V2: ${scoreV2.toFixed(1)}]` : '';
        console.log(`  WOULD INSERT: ${row.name}${score}`);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        db.insert(startups).values(newRecord as any).run();
        console.log(`  INSERTED: ${row.name}${scoreV2 ? ` [V2: ${scoreV2.toFixed(1)}]` : ''}`);
      }
      updated++;
      continue;
    }

    matched++;

    // Build update object — only include non-null fields
    const updates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (row.target_user) updates.targetUser = row.target_user;
    if (row.problem) updates.problemStatement = row.problem;
    if (row.solution) updates.solutionText = row.solution;
    if (row.founders) updates.foundersText = row.founders;
    if (row.founders_links) updates.foundersLinks = row.founders_links;
    if (row.investors) updates.investorsText = row.investors;
    if (row.funding_rounds) updates.fundingRounds = row.funding_rounds;
    if (row.mrr_arr) updates.revenueText = row.mrr_arr;
    if (row.audience) updates.audienceText = row.audience;
    if (row.description_ru) updates.descriptionRu = row.description_ru;

    // V2 scoring factors
    if (row.score_m != null) updates.scoreM = row.score_m;
    if (row.score_t != null) updates.scoreT = row.score_t;
    if (row.score_a != null) updates.scoreA = row.score_a;
    if (row.score_b != null) updates.scoreB = row.score_b;
    if (row.score_p != null) updates.scoreP = row.score_p;

    // Compute V2 score if all factors are present
    if (row.score_m && row.score_t && row.score_a && row.score_b && row.score_p) {
      updates.scoreV2 = computeScoreV2(row.score_m, row.score_t, row.score_a, row.score_b, row.score_p);
    }

    if (Object.keys(updates).length <= 1) continue; // only updatedAt, skip

    if (isDryRun) {
      const score = updates.scoreV2 ? ` [V2: ${(updates.scoreV2 as number).toFixed(1)}]` : '';
      console.log(`  WOULD UPDATE: ${startup.name}${score} — fields: ${Object.keys(updates).filter(k => k !== 'updatedAt').join(', ')}`);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      db.update(startups).set(updates as any).where(eq(startups.id, startup.id)).run();
    }

    updated++;
  }

  console.log(`\nResults:`);
  console.log(`  Matched in DB: ${matched}`);
  console.log(`  ${isDryRun ? 'Would update' : 'Updated'}: ${updated}`);
  console.log(`  Not found in DB: ${notFound}`);
}

main().catch(console.error);
