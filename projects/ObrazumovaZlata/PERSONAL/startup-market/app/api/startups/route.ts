import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { startups } from '@/db/schema';
import { desc, asc, like, eq, and, sql, or } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const q         = searchParams.get('q') ?? '';
  const source    = searchParams.get('source') ?? '';
  const tag       = searchParams.get('tag') ?? '';
  const batch     = searchParams.get('batch') ?? '';
  const sort      = searchParams.get('sort') ?? 'score'; // score | traction | recent | votes
  const page      = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const limit     = Math.min(50, parseInt(searchParams.get('limit') ?? '24'));
  const offset    = (page - 1) * limit;

  try {
    // Build conditions
    const conditions = [];

    if (source) conditions.push(eq(startups.source, source));
    if (batch)  conditions.push(eq(startups.batch, batch));

    if (q) {
      conditions.push(
        or(
          like(startups.name, `%${q}%`),
          like(startups.taglineRu, `%${q}%`),
          like(startups.tagline, `%${q}%`),
          like(startups.descriptionRu, `%${q}%`),
        )!
      );
    }

    if (tag) {
      // JSON array contains tag — SQLite json_each approach
      conditions.push(
        sql`EXISTS (
          SELECT 1 FROM json_each(${startups.tags})
          WHERE json_each.value LIKE ${`%${tag}%`}
        )`
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    // Sort
    const orderBy = {
      score:   desc(startups.scoreTotal),
      traction: desc(startups.scoreTraction),
      recent:  desc(startups.launchedAt),
      votes:   desc(startups.votesCount),
    }[sort] ?? desc(startups.scoreTotal);

    const [rows, countRows] = await Promise.all([
      db.select().from(startups)
        .where(where)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset)
        .all(),
      db.select({ count: sql<number>`count(*)` })
        .from(startups)
        .where(where)
        .get(),
    ]);

    const total = countRows?.count ?? 0;

    return NextResponse.json({
      data: rows,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('[api/startups]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
