import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { startups } from '@/db/schema';
import { computeScore } from '@/lib/scoring';
import { computeWeeklyTop, computeMonthlyTop } from '@/lib/rankings';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export const runtime = 'nodejs';
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-sync-secret');
  if (secret !== process.env.SYNC_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const all = db.select().from(startups).all();
  let updated = 0;

  for (const s of all) {
    const tags       = (s.tags ?? []) as string[];
    const industries = (s.industries ?? []) as string[];
    const locations  = (s.locations ?? []) as string[];

    const scores = computeScore({
      tags,
      industries,
      teamSize:      s.teamSize       ?? undefined,
      fundingTotal:  s.fundingTotal   ?? undefined,
      fundingStage:  s.fundingStage   ?? undefined,
      votesCount:    s.votesCount     ?? undefined,
      weeklyRank:    s.weeklyRank     ?? undefined,
      foundedYear:   s.foundedYear    ?? undefined,
      locations,
      batch:         s.batch          ?? undefined,
      description:   s.description    ?? undefined,
      status:        s.status         ?? undefined,
    });

    db.update(startups).set({
      scoreTotal:          scores.total,
      scoreDisruption:     scores.disruption,
      scoreScalability:    scores.scalability,
      scoreMarketSize:     scores.marketSize,
      scoreTraction:       scores.traction,
      scoreRussiaBarriers: scores.russiaBarriers,
      scoreTimingRussia:   scores.timingRussia,
      scoredAt:            new Date().toISOString(),
    }).where(eq(startups.id, s.id)).run();

    updated++;
  }

  await computeWeeklyTop();
  await computeMonthlyTop();

  return NextResponse.json({ ok: true, rescored: updated });
}
