/**
 * Restores original YC tags for all startups that have source='yc'.
 * Fetches fresh data from YC API in batches and overwrites tags/industries.
 */
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { startups } from '@/db/schema';
import { eq, like } from 'drizzle-orm';
import { computeScore } from '@/lib/scoring';

export const runtime = 'nodejs';
export const maxDuration = 300;

const BASE_URL = 'https://api.ycombinator.com/v0.1/companies';

async function fetchBatch(batch: string): Promise<Array<{ id: number; tags: string[]; industries: string[] }>> {
  const res = await fetch(`${BASE_URL}?batch=${batch}&page=1`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; StartupMarket/1.0)' },
  });
  if (!res.ok) throw new Error(`YC API ${res.status}`);
  const data = await res.json() as { companies: Array<{ id: number; tags: string[]; industries: string[] }>; totalPages: number };

  const all = [...data.companies];
  for (let p = 2; p <= data.totalPages; p++) {
    const r2 = await fetch(`${BASE_URL}?batch=${batch}&page=${p}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!r2.ok) break;
    const d2 = await r2.json() as { companies: typeof data.companies };
    all.push(...d2.companies);
    await new Promise(r => setTimeout(r, 300));
  }
  return all;
}

export async function POST(req: Request) {
  const secret = req.headers.get('x-sync-secret');
  if (secret !== process.env.SYNC_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const BATCHES = ['W25', 'S24', 'W24', 'S23', 'W23', 'W22', 'S22'];
  let restored = 0;

  for (const batch of BATCHES) {
    try {
      const companies = await fetchBatch(batch);
      for (const c of companies) {
        const id = `yc_${c.id}`;
        const tags = c.tags ?? [];
        const industries = c.industries ?? [];
        const existing = db.select().from(startups).where(eq(startups.id, id)).get();
        if (!existing) continue;

        const scores = computeScore({
          tags, industries,
          teamSize: existing.teamSize ?? undefined,
          batch: existing.batch ?? undefined,
          status: existing.status ?? undefined,
          locations: (existing.locations ?? []) as string[],
          votesCount: existing.votesCount ?? undefined,
        });

        db.update(startups).set({
          tags,
          industries,
          scoreTotal: scores.total,
          scoreDisruption: scores.disruption,
          scoreScalability: scores.scalability,
          scoreMarketSize: scores.marketSize,
          scoreTraction: scores.traction,
          scoreRussiaBarriers: scores.russiaBarriers,
          scoreTimingRussia: scores.timingRussia,
          scoredAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }).where(eq(startups.id, id)).run();

        restored++;
      }
      console.log(`[restore-tags] ${batch}: ${companies.length} companies`);
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      console.error(`[restore-tags] ${batch} failed:`, err);
    }
  }

  return NextResponse.json({ ok: true, restored });
}
