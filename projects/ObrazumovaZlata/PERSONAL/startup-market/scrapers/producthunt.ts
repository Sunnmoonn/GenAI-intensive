/**
 * Product Hunt scraper — uses official GraphQL API
 * Register at: https://www.producthunt.com/v2/oauth/applications
 * Set PH_DEV_TOKEN in .env.local
 *
 * Deduplication strategy:
 *  1. Normalize names (lowercase, strip punctuation/suffixes)
 *  2. If normalized PH name matches an existing startup → MERGE (enrich, add 'producthunt' to sources)
 *  3. If no match → INSERT as new 'producthunt' card
 */

import { db } from '../db';
import { startups, syncLog } from '../db/schema';
import { eq } from 'drizzle-orm';
import { computeScore } from '../lib/scoring';

const PH_API = 'https://api.producthunt.com/v2/api/graphql';

const POSTS_QUERY = `
query GetPosts($after: String, $postedAfter: DateTime) {
  posts(order: VOTES, postedAfter: $postedAfter, first: 20, after: $after) {
    edges {
      node {
        id name tagline description url
        votesCount commentsCount dailyRank weeklyRank createdAt website
        topics { edges { node { name slug } } }
        thumbnail { url }
      }
    }
    pageInfo { hasNextPage endCursor }
  }
}`;

interface PHPost {
  id: string;
  name: string;
  tagline: string;
  description?: string;
  url: string;
  votesCount: number;
  commentsCount: number;
  dailyRank?: number;
  weeklyRank?: number;
  createdAt: string;
  website?: string;
  topics: { edges: Array<{ node: { name: string; slug: string } }> };
  thumbnail?: { url: string };
}

// ─── Fuzzy name matching ──────────────────────────────────────────────────────

const STRIP_SUFFIXES = /\b(inc|llc|corp|ltd|co|ai|io|com|app|hq|labs|technologies|technology|software|platform|systems|solutions|group)\b/g;

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')   // punctuation → space
    .replace(STRIP_SUFFIXES, ' ')   // strip common suffixes
    .replace(/\s+/g, ' ')
    .trim();
}

function isNameMatch(a: string, b: string): boolean {
  const na = normalizeName(a);
  const nb = normalizeName(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  // One contains the other (e.g. "Notion" vs "Notion – The all-in-one workspace")
  if (na.includes(nb) || nb.includes(na)) return true;
  // At least 2 meaningful words in common
  const wordsA = na.split(' ').filter(w => w.length > 2);
  const wordsB = new Set(nb.split(' ').filter(w => w.length > 2));
  const common = wordsA.filter(w => wordsB.has(w));
  return common.length >= 2;
}

// ─── Build an in-memory name index from all existing startups ─────────────────

function buildNameIndex(): Map<string, typeof startups.$inferSelect> {
  const all = db.select().from(startups).all();
  const index = new Map<string, typeof startups.$inferSelect>();
  for (const s of all) {
    index.set(normalizeName(s.name), s);
  }
  return index;
}

function findExisting(
  phName: string,
  index: Map<string, typeof startups.$inferSelect>,
): typeof startups.$inferSelect | null {
  const normalized = normalizeName(phName);
  // Exact normalized match
  if (index.has(normalized)) return index.get(normalized)!;
  // Fuzzy scan
  for (const [key, startup] of index) {
    if (isNameMatch(phName, startup.name)) return startup;
  }
  return null;
}

// ─── API fetch ────────────────────────────────────────────────────────────────

async function fetchPosts(postedAfter: string, cursor?: string): Promise<{
  posts: PHPost[];
  hasNextPage: boolean;
  endCursor: string | null;
}> {
  const token = process.env.PH_DEV_TOKEN;
  if (!token) throw new Error('PH_DEV_TOKEN not configured');

  const res = await fetch(PH_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: POSTS_QUERY,
      variables: { postedAfter, after: cursor ?? null },
    }),
  });

  if (!res.ok) throw new Error(`PH API error: ${res.status}`);

  const json = await res.json() as {
    data?: { posts: { edges: Array<{ node: PHPost }>; pageInfo: { hasNextPage: boolean; endCursor: string | null } } };
    errors?: Array<{ message: string }>;
  };

  if (json.errors?.length) throw new Error(json.errors[0].message);

  const { edges, pageInfo } = json.data!.posts;
  return {
    posts: edges.map(e => e.node),
    hasNextPage: pageInfo.hasNextPage,
    endCursor: pageInfo.endCursor,
  };
}

// ─── Build a new PH-only record ───────────────────────────────────────────────

function buildPhRecord(p: PHPost) {
  const tags = p.topics.edges.map(e => e.node.name);
  const scores = computeScore({ tags, industries: tags, votesCount: p.votesCount, weeklyRank: p.weeklyRank ?? undefined });

  return {
    id: `ph_${p.id}`,
    source: 'producthunt' as const,
    sources: ['producthunt'],
    externalId: p.id,
    name: p.name,
    slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    website: p.website ?? p.url,
    sourceUrl: p.url,
    logoUrl: p.thumbnail?.url ?? null,
    tagline: p.tagline ?? null,
    description: p.description ?? null,
    tags,
    industries: tags,
    votesCount: p.votesCount,
    commentsCount: p.commentsCount,
    dailyRank: p.dailyRank ?? null,
    weeklyRank: p.weeklyRank ?? null,
    launchedAt: p.createdAt,
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

// ─── Merge PH data into an existing record ────────────────────────────────────

function buildMergeUpdate(existing: typeof startups.$inferSelect, p: PHPost) {
  const existingSources = (existing.sources ?? []) as string[];
  const newSources = existingSources.includes('producthunt')
    ? existingSources
    : [...existingSources, 'producthunt'];

  // Keep original tags — PH topics are not merged to avoid pollution from wrong matches
  const existingTags = (existing.tags ?? []) as string[];

  // Re-score with existing data + PH traction
  const scores = computeScore({
    tags: existingTags,
    industries: existingTags,
    teamSize: existing.teamSize ?? undefined,
    fundingTotal: existing.fundingTotal ?? undefined,
    fundingStage: existing.fundingStage ?? undefined,
    votesCount: p.votesCount,
    weeklyRank: p.weeklyRank ?? undefined,
    foundedYear: existing.foundedYear ?? undefined,
    locations: (existing.locations ?? []) as string[],
    batch: existing.batch ?? undefined,
    status: existing.status ?? undefined,
  });

  return {
    sources: newSources,
    description: existing.description,
    votesCount: p.votesCount,
    commentsCount: p.commentsCount,
    dailyRank: p.dailyRank ?? existing.dailyRank,
    weeklyRank: p.weeklyRank ?? existing.weeklyRank,
    logoUrl: existing.logoUrl ?? p.thumbnail?.url ?? null,
    // Update scores with enriched data
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

// ─── Main sync ────────────────────────────────────────────────────────────────

export async function syncProductHunt(options: { daysBack?: number } = {}) {
  const startedAt = new Date().toISOString();
  let added = 0;
  let merged = 0;
  let updated = 0;

  const daysBack = options.daysBack ?? 30; // default: last 30 days for a meaningful initial load
  const postedAfter = new Date(Date.now() - daysBack * 86_400_000).toISOString();

  console.log(`[ph] Fetching posts since ${postedAfter} (${daysBack} days back)...`);

  // Build name index once before processing
  console.log('[ph] Building name index from existing startups...');
  const nameIndex = buildNameIndex();
  console.log(`[ph] Index built: ${nameIndex.size} existing startups`);

  try {
    let cursor: string | undefined;
    let hasMore = true;

    while (hasMore) {
      const { posts, hasNextPage, endCursor } = await fetchPosts(postedAfter, cursor);
      console.log(`[ph] Got ${posts.length} posts`);

      for (const p of posts) {
        const existing = findExisting(p.name, nameIndex);

        if (existing) {
          // MERGE: enrich existing card with PH data
          const update = buildMergeUpdate(existing, p);
          db.update(startups).set(update).where(eq(startups.id, existing.id)).run();
          // Update index with merged name (in case of future duplicates in this batch)
          nameIndex.set(normalizeName(existing.name), { ...existing, ...update });
          merged++;
          console.log(`[ph] Merged: "${p.name}" → "${existing.name}" (${existing.source})`);
        } else {
          // NEW: check by PH id first to avoid re-inserting
          const phId = `ph_${p.id}`;
          const byId = db.select({ id: startups.id }).from(startups).where(eq(startups.id, phId)).get();
          const record = buildPhRecord(p);

          if (byId) {
            db.update(startups).set(record).where(eq(startups.id, phId)).run();
            updated++;
          } else {
            db.insert(startups).values(record).run();
            nameIndex.set(normalizeName(p.name), record as unknown as typeof startups.$inferSelect);
            added++;
          }
        }
      }

      hasMore = hasNextPage;
      cursor = endCursor ?? undefined;
      if (hasMore) await new Promise(r => setTimeout(r, 500));
    }

    db.insert(syncLog).values({
      source: 'producthunt',
      status: 'success',
      recordsAdded: added,
      recordsUpdated: merged + updated,
      startedAt,
      finishedAt: new Date().toISOString(),
    }).run();

    console.log(`[ph] Done: +${added} new, ${merged} merged with existing, ${updated} updated`);
    return { added, merged, updated };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    db.insert(syncLog).values({
      source: 'producthunt',
      status: 'failed',
      recordsAdded: added,
      recordsUpdated: merged + updated,
      errorMessage: msg,
      startedAt,
      finishedAt: new Date().toISOString(),
    }).run();
    throw err;
  }
}
