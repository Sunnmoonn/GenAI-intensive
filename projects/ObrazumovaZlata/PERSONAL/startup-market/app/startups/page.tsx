import { Suspense } from 'react';
import { db } from '@/db';
import { startups } from '@/db/schema';
import { desc, like, eq, and, sql, or } from 'drizzle-orm';
import { StartupCard } from '@/components/StartupCard';
import { FilterBar } from '@/components/FilterBar';
import { Pagination } from '@/components/Pagination';
import { rawTagsForTech, rawTagsForDomain } from '@/lib/tag-taxonomy';
import { hasResearch } from '@/lib/research';

export const dynamic = 'force-dynamic';

type SearchParams = {
  q?: string;
  source?: string;
  sort?: string;
  batch?: string;
  page?: string;
  tag?: string;
  tech?: string;    // comma-separated canonical tech labels
  domain?: string;  // comma-separated canonical domain labels
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const PAGE_SIZE = 24;

async function getStartups(params: SearchParams) {
  const q        = params.q ?? '';
  const source   = params.source ?? '';
  const sort     = params.sort ?? 'score';
  const batch    = params.batch ?? '';
  const tag      = params.tag ?? '';
  const techLabels   = params.tech   ? params.tech.split(',').filter(Boolean)   : [];
  const domainLabels = params.domain ? params.domain.split(',').filter(Boolean) : [];
  const page     = Math.max(1, parseInt(params.page ?? '1'));
  const offset   = (page - 1) * PAGE_SIZE;

  const conditions = [];
  if (source) conditions.push(eq(startups.source, source));
  if (batch)  conditions.push(eq(startups.batch, batch));

  if (q) {
    conditions.push(
      or(
        like(startups.name, `%${q}%`),
        like(startups.taglineRu, `%${q}%`),
        like(startups.tagline, `%${q}%`),
      )!
    );
  }

  // Legacy single tag filter
  if (tag) {
    conditions.push(
      sql`EXISTS (SELECT 1 FROM json_each(${startups.tags}) WHERE json_each.value LIKE ${'%' + tag + '%'})`
    );
  }

  // Tech taxonomy filter — match ANY selected tech label (OR within tech, AND across tech+domain)
  if (techLabels.length > 0) {
    const rawTags = techLabels.flatMap(rawTagsForTech);
    const orClauses = rawTags.map(t =>
      sql`EXISTS (SELECT 1 FROM json_each(${startups.tags}) WHERE json_each.value = ${t})`
    );
    // Combine with OR: startup must match at least one raw tag from selected tech labels
    conditions.push(sql`(${sql.join(orClauses, sql` OR `)})`);
  }

  // Domain taxonomy filter
  if (domainLabels.length > 0) {
    const rawTags = domainLabels.flatMap(rawTagsForDomain);
    const orClauses = rawTags.map(t =>
      sql`EXISTS (SELECT 1 FROM json_each(${startups.tags}) WHERE json_each.value = ${t})
       OR EXISTS (SELECT 1 FROM json_each(${startups.industries}) WHERE json_each.value = ${t})`
    );
    conditions.push(sql`(${sql.join(orClauses, sql` OR `)})`);
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const baseOrder = sort === 'traction' ? [desc(startups.scoreTraction)]
    : sort === 'recent'   ? [desc(startups.launchedAt)]
    : sort === 'votes'    ? [desc(startups.votesCount)]
    : /* score (default) */ [
        sql`CASE WHEN ${startups.scoreV2} IS NOT NULL THEN 0 ELSE 1 END`,
        desc(startups.scoreV2),
      ];

  // When searching, put name matches first, tagline matches second
  const orderBy = q
    ? [
        sql`CASE
          WHEN ${startups.name} LIKE ${'%' + q + '%'} THEN 0
          WHEN ${startups.taglineRu} LIKE ${'%' + q + '%'} OR ${startups.tagline} LIKE ${'%' + q + '%'} THEN 1
          ELSE 2
        END`,
        ...baseOrder,
      ]
    : baseOrder;

  const [rows, countRow] = await Promise.all([
    db.select().from(startups).where(where).orderBy(...orderBy).limit(PAGE_SIZE).offset(offset).all(),
    db.select({ count: sql<number>`count(*)` }).from(startups).where(where).get(),
  ]);

  return { rows, total: countRow?.count ?? 0, page };
}

export default async function StartupsPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  let data = { rows: [] as typeof startups.$inferSelect[], total: 0, page: 1 };
  try {
    data = await getStartups(resolvedParams);
  } catch {
    // DB not ready
  }

  const totalPages = Math.ceil(data.total / PAGE_SIZE);

  const baseParams = new URLSearchParams(resolvedParams as Record<string, string>);
  baseParams.delete('page');
  const searchParamsStr = baseParams.toString();

  const activeTech   = resolvedParams.tech   ? resolvedParams.tech.split(',').filter(Boolean)   : [];
  const activeDomain = resolvedParams.domain ? resolvedParams.domain.split(',').filter(Boolean) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1 text-white">Все стартапы</h1>
        <p className="text-slate-500 text-sm">
          {data.total > 0 ? `${data.total.toLocaleString('ru')} стартапов в базе` : 'Загрузите данные через sync-скрипт'}
        </p>
      </div>

      <div className="mb-6">
        <Suspense>
          <FilterBar />
        </Suspense>
      </div>

      {data.rows.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.rows.map(s => (
              <StartupCard
                key={s.id}
                startup={s}
                activeTech={activeTech}
                activeDomain={activeDomain}
                hasResearch={hasResearch(s.name)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination page={data.page} totalPages={totalPages} searchParamsStr={searchParamsStr} />
          )}
        </>
      ) : (
        <div className="bg-[#0b1225] rounded-xl border border-dashed border-white/10 p-16 text-center text-slate-500">
          <p className="mb-2">Стартапы не найдены.</p>
          <p className="text-sm">Попробуйте изменить фильтры или запустите синхронизацию данных.</p>
        </div>
      )}
    </div>
  );
}
