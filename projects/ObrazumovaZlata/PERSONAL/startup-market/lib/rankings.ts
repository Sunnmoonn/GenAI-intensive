import { db } from '../db';
import { startups, weeklyTop, monthlyTop } from '../db/schema';
import { desc, eq, sql } from 'drizzle-orm';

function getWeekLabel(date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

function getMonthLabel(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * "Russia Opportunity Score" — a composite metric specifically for finding
 * startups worth cloning in Russia. Weights barriers and timing more heavily
 * than the general score, since the goal is to find ideas where:
 * (1) the Western original can't easily enter Russia, and
 * (2) the niche is hot in Russia right now.
 *
 * Formula: barriers*0.30 + timing*0.30 + disruption*0.20 + scalability*0.20
 * Minimum barriers threshold: 30 (filters out truly open/accessible products)
 */
function russiaOpportunityScore(s: typeof startups.$inferSelect): number {
  const barriers  = s.scoreRussiaBarriers  ?? 0;
  const timing    = s.scoreTimingRussia    ?? 0;
  const disruption = s.scoreDisruption     ?? 0;
  const scalability = s.scoreScalability   ?? 0;
  return barriers * 0.30 + timing * 0.30 + disruption * 0.20 + scalability * 0.20;
}

export async function computeWeeklyTop(limit = 10) {
  const label = getWeekLabel();
  db.delete(weeklyTop).where(eq(weeklyTop.weekLabel, label)).run();

  // Pull a wider pool (top 200 by total score) then re-rank by Russia opportunity
  const pool = db.select().from(startups)
    .where(sql`${startups.scoreRussiaBarriers} >= 30`)
    .orderBy(desc(startups.scoreTotal))
    .limit(200)
    .all();

  const ranked = pool
    .map(s => ({ s, opp: russiaOpportunityScore(s) }))
    .sort((a, b) => b.opp - a.opp)
    .slice(0, limit);

  for (let i = 0; i < ranked.length; i++) {
    db.insert(weeklyTop).values({
      startupId: ranked[i].s.id,
      weekLabel: label,
      rank: i + 1,
      scoreSnapshot: Math.round(ranked[i].opp * 10) / 10,
    }).run();
  }

  console.log(`[rankings] Weekly top ${limit} (Russia opportunity) computed for ${label}`);
  return ranked.map(r => r.s);
}

export async function computeMonthlyTop(limit = 10) {
  const label = getMonthLabel();
  db.delete(monthlyTop).where(eq(monthlyTop.monthLabel, label)).run();

  const pool = db.select().from(startups)
    .where(sql`${startups.scoreRussiaBarriers} >= 30`)
    .orderBy(desc(startups.scoreTotal))
    .limit(200)
    .all();

  const ranked = pool
    .map(s => ({ s, opp: russiaOpportunityScore(s) }))
    .sort((a, b) => b.opp - a.opp)
    .slice(0, limit);

  for (let i = 0; i < ranked.length; i++) {
    db.insert(monthlyTop).values({
      startupId: ranked[i].s.id,
      monthLabel: label,
      rank: i + 1,
      scoreSnapshot: Math.round(ranked[i].opp * 10) / 10,
    }).run();
  }

  console.log(`[rankings] Monthly top ${limit} (Russia opportunity) computed for ${label}`);
  return ranked.map(r => r.s);
}

export function getCurrentWeeklyTop(limit = 10) {
  const label = getWeekLabel();
  return db.select({
    rank: weeklyTop.rank,
    scoreSnapshot: weeklyTop.scoreSnapshot,
    startup: startups,
  })
    .from(weeklyTop)
    .innerJoin(startups, eq(weeklyTop.startupId, startups.id))
    .where(eq(weeklyTop.weekLabel, label))
    .orderBy(weeklyTop.rank)
    .limit(limit)
    .all();
}

export function getCurrentMonthlyTop(limit = 10) {
  const label = getMonthLabel();
  return db.select({
    rank: monthlyTop.rank,
    scoreSnapshot: monthlyTop.scoreSnapshot,
    startup: startups,
  })
    .from(monthlyTop)
    .innerJoin(startups, eq(monthlyTop.startupId, startups.id))
    .where(eq(monthlyTop.monthLabel, label))
    .orderBy(monthlyTop.rank)
    .limit(limit)
    .all();
}
