/**
 * YC scraper — uses the public REST API at api.ycombinator.com/v0.1/companies
 * No auth required. Returns paginated JSON.
 */

import { db } from '../db';
import { startups, syncLog } from '../db/schema';
import { eq } from 'drizzle-orm';
import { computeScore } from '../lib/scoring';

const BASE_URL = 'https://api.ycombinator.com/v0.1/companies';
const DELAY_MS = 500;

interface YCCompany {
  id: number;
  name: string;
  slug: string;
  website: string;
  oneLiner: string;
  longDescription: string;
  teamSize: number;
  batch: string;
  status: string;
  tags: string[];
  industries: string[];
  regions: string[];
  locations: string[];
  smallLogoUrl?: string;
  url: string;
  badges?: string[];
}

async function fetchPage(page: number, batch?: string): Promise<{ companies: YCCompany[]; total: number }> {
  const params = new URLSearchParams({ page: String(page) });
  if (batch) params.set('batch', batch);

  const res = await fetch(`${BASE_URL}?${params}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; StartupMarket/1.0)' },
  });

  if (!res.ok) throw new Error(`YC API error: ${res.status} ${res.statusText}`);

  const data = await res.json() as { companies: YCCompany[]; page: number; totalPages: number; totalCount: number };
  return { companies: data.companies, total: data.totalPages };
}

function ycToStartup(c: YCCompany) {
  const id = `yc_${c.id}`;
  const scoreInput = {
    tags: c.tags ?? [],
    industries: c.industries ?? [],
    teamSize: c.teamSize,
    batch: c.batch,
    status: c.status,
    locations: c.locations ?? [],
  };
  const scores = computeScore(scoreInput);

  return {
    id,
    source: 'yc' as const,
    externalId: String(c.id),
    name: c.name,
    slug: c.slug,
    website: c.website ?? null,
    sourceUrl: `https://www.ycombinator.com/companies/${c.slug}`,
    logoUrl: c.smallLogoUrl ?? null,
    tagline: c.oneLiner ?? null,
    description: c.longDescription ?? null,
    tags: c.tags ?? [],
    industries: c.industries ?? [],
    batch: c.batch ?? null,
    teamSize: c.teamSize ?? null,
    status: c.status ?? null,
    locations: c.locations ?? [],
    regions: c.regions ?? [],
    scoreTotal: scores.total,
    scoreDisruption: scores.disruption,
    scoreScalability: scores.scalability,
    scoreMarketSize: scores.marketSize,
    scoreTraction: scores.traction,
    scoreRussiaBarriers: scores.russiaBarriers,
    scoreTimingRussia: scores.timingRussia,
    scoredAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function syncYC(options: { fullSync?: boolean; batch?: string } = {}) {
  const startedAt = new Date().toISOString();
  let added = 0;
  let updated = 0;
  let page = 1;

  console.log('[yc] Starting sync...', options);

  try {
    const { total } = await fetchPage(1, options.batch);
    const totalPages = options.fullSync ? total : Math.min(total, 3); // incremental: only last 3 pages

    while (page <= totalPages) {
      const { companies } = await fetchPage(page, options.batch);
      console.log(`[yc] Page ${page}/${totalPages} — ${companies.length} companies`);

      for (const c of companies) {
        const record = ycToStartup(c);
        const existing = db.select({ id: startups.id }).from(startups)
          .where(eq(startups.id, record.id)).get();

        if (existing) {
          db.update(startups).set(record).where(eq(startups.id, record.id)).run();
          updated++;
        } else {
          db.insert(startups).values(record).run();
          added++;
        }
      }

      page++;
      if (page <= totalPages) await new Promise(r => setTimeout(r, DELAY_MS));
    }

    db.insert(syncLog).values({
      source: 'yc',
      status: 'success',
      recordsAdded: added,
      recordsUpdated: updated,
      startedAt,
      finishedAt: new Date().toISOString(),
    }).run();

    console.log(`[yc] Done: +${added} added, ~${updated} updated`);
    return { added, updated };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    db.insert(syncLog).values({
      source: 'yc',
      status: 'failed',
      recordsAdded: added,
      recordsUpdated: updated,
      errorMessage: msg,
      startedAt,
      finishedAt: new Date().toISOString(),
    }).run();
    throw err;
  }
}
