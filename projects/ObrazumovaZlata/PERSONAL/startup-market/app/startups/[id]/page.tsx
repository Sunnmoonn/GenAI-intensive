import { db } from '@/db';
import { startups } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { SourceBadge } from '@/components/SourceBadge';
import { LogoImage } from '@/components/LogoImage';
import { TaxonomyBadges } from '@/components/TaxonomyBadges';
import { ScoreBar } from '@/components/ScoreBar';
import { getResearch, hasResearch } from '@/lib/research';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

function MetaCell({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-white/4 rounded-lg p-3 border border-white/6">
      <div className="text-xs text-slate-600 mb-1">{label}</div>
      <div className="font-medium text-slate-200 text-sm">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-3">{title}</div>
      {children}
    </div>
  );
}

function ResearchBlock({ label, text, accent }: { label: string; text: string; accent?: string }) {
  const lines = text.split('\n').filter(Boolean);
  const [first, ...rest] = lines;
  return (
    <div className="px-4 py-4 border-b border-white/5 last:border-0">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">{label}</div>
      {accent && first && (
        <div className={`inline-block text-xs font-bold px-2 py-0.5 rounded mb-2 ${
          first.includes('ДА') ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/40' :
          first.includes('НЕТ') ? 'bg-red-900/40 text-red-300 border border-red-700/40' :
          'bg-yellow-900/40 text-yellow-300 border border-yellow-700/40'
        }`}>{first}</div>
      )}
      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
        {accent && first ? rest.join('\n') : text}
      </p>
    </div>
  );
}

export default async function StartupDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { tab } = await searchParams;
  const startup = db.select().from(startups).where(eq(startups.id, id)).get();
  if (!startup) notFound();

  const research = hasResearch(startup.name) ? getResearch(startup.name) : null;
  const activeTab = research ? (tab === 'research' ? 'research' : 'overview') : 'overview';

  const tags = (startup.tagsRu ?? startup.tags ?? []) as string[];
  const rawTags = [...((startup.tags ?? []) as string[]), ...((startup.industries ?? []) as string[])];
  const tagline = startup.taglineRu ?? startup.tagline ?? '';
  const description = startup.descriptionRu ?? startup.description ?? '';

  const hasV2Score = startup.scoreV2 != null && startup.scoreV2 > 0;
  const hasFactors = startup.scoreM != null && startup.scoreT != null;
  const hasAnalysis = startup.problemStatement || startup.solutionText || startup.targetUser;
  const hasBusiness = startup.investorsText || startup.fundingRounds || startup.revenueText || startup.audienceText;
  const hasFounders = startup.foundersText;

  const scoreColor = hasV2Score
    ? startup.scoreV2! >= 70
      ? 'bg-emerald-900/40 border-emerald-700/40 text-emerald-300'
      : startup.scoreV2! >= 50
      ? 'bg-yellow-900/40 border-yellow-700/40 text-yellow-300'
      : 'bg-white/4 border-white/10 text-slate-400'
    : 'bg-white/4 border-white/10';

  const baseHref = `/startups/${id}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/startups" className="text-sm text-blue-400 hover:text-blue-300 mb-6 inline-flex items-center gap-1 transition-colors">
        ← Все стартапы
      </Link>

      {/* Main card */}
      <div className="bg-[#0b1225] rounded-2xl border border-white/8 p-8 mb-5">

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          {startup.logoUrl && (
            <LogoImage
              src={startup.logoUrl}
              alt={startup.name}
              className="w-16 h-16 rounded-xl object-contain border border-white/10 shrink-0 opacity-90"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <h1 className="text-2xl font-bold text-white">{startup.name}</h1>
              <SourceBadge source={startup.source} sources={startup.sources as string[] | undefined} />
              {startup.batch && (
                <span className="text-xs bg-orange-900/40 text-orange-300 px-2 py-0.5 rounded font-medium border border-orange-700/40">
                  {startup.batch}
                </span>
              )}
            </div>
            <p className="text-slate-400 leading-relaxed">{tagline}</p>
          </div>
          <div className={`text-center shrink-0 rounded-xl p-3 border ${scoreColor}`}>
            <div className={`text-3xl font-bold ${hasV2Score ? '' : 'text-slate-500'}`}>
              {hasV2Score ? startup.scoreV2!.toFixed(0) : '—'}
            </div>
            <div className="text-xs text-slate-600">/ 100</div>
          </div>
        </div>

        {/* Tabs — only shown when research exists */}
        {research && (
          <div className="flex gap-1 mb-6 border-b border-white/8 -mx-8 px-8">
            <Link
              href={baseHref}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-white'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              Обзор
            </Link>
            <Link
              href={`${baseHref}?tab=research`}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors flex items-center gap-1.5 ${
                activeTab === 'research'
                  ? 'border-blue-500 text-white'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              Глубокий ресёрч
              <span className="text-xs bg-blue-900/40 text-blue-300 border border-blue-700/40 px-1.5 py-0.5 rounded">РФ</span>
            </Link>
          </div>
        )}

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <>
            {description && (
              <Section title="О компании">
                <p className="text-slate-300 leading-relaxed text-sm">{description}</p>
              </Section>
            )}

            <div className="mb-4">
              <TaxonomyBadges rawTags={rawTags} maxEach={6} />
            </div>
            {tags.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Link
                    key={tag}
                    href={`/startups?tag=${encodeURIComponent(tag)}`}
                    className="text-xs bg-white/5 hover:bg-blue-900/40 text-slate-400 hover:text-blue-300 px-3 py-1 rounded-full border border-white/8 hover:border-blue-700/40 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {hasAnalysis && (
              <Section title="Анализ продукта">
                <div className="bg-white/3 rounded-xl border border-white/6 divide-y divide-white/5">
                  {startup.targetUser && (
                    <div className="px-4 py-3 grid grid-cols-[120px_1fr] gap-3 text-sm">
                      <span className="text-slate-600 text-xs font-medium uppercase tracking-wide pt-0.5">Для кого</span>
                      <span className="text-slate-300 leading-relaxed">{startup.targetUser}</span>
                    </div>
                  )}
                  {startup.problemStatement && (
                    <div className="px-4 py-3 grid grid-cols-[120px_1fr] gap-3 text-sm">
                      <span className="text-slate-600 text-xs font-medium uppercase tracking-wide pt-0.5">Проблема</span>
                      <span className="text-slate-300 leading-relaxed">{startup.problemStatement}</span>
                    </div>
                  )}
                  {startup.solutionText && (
                    <div className="px-4 py-3 grid grid-cols-[120px_1fr] gap-3 text-sm">
                      <span className="text-slate-600 text-xs font-medium uppercase tracking-wide pt-0.5">Решение</span>
                      <span className="text-slate-300 leading-relaxed">{startup.solutionText}</span>
                    </div>
                  )}
                  {startup.audienceText && (
                    <div className="px-4 py-3 grid grid-cols-[120px_1fr] gap-3 text-sm">
                      <span className="text-slate-600 text-xs font-medium uppercase tracking-wide pt-0.5">Аудитория</span>
                      <span className="text-slate-300 leading-relaxed">{startup.audienceText}</span>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {hasFactors && (
              <Section title="Скоринг VENTURE-SCAN RF 2.0">
                <div className="bg-white/3 rounded-xl border border-white/6 p-4">
                  <div className="space-y-2 mb-4">
                    <ScoreBar label="M — Рынок РФ ×2" value={(startup.scoreM ?? 0) * 10} max={100} />
                    <ScoreBar label="T — Воспроизв." value={(startup.scoreT ?? 0) * 10} max={100} />
                    <ScoreBar label="A — Свободн. ниша" value={(startup.scoreA ?? 0) * 10} max={100} />
                    <ScoreBar label="B — Барьеры" value={(startup.scoreB ?? 0) * 10} max={100} />
                    <ScoreBar label="P — Доказанность" value={(startup.scoreP ?? 0) * 10} max={100} />
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/6">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      {[
                        { l: 'M', v: startup.scoreM },
                        { l: 'T', v: startup.scoreT },
                        { l: 'A', v: startup.scoreA },
                        { l: 'B', v: startup.scoreB },
                        { l: 'P', v: startup.scoreP },
                      ].map(({ l, v }) => (
                        <span key={l} className="flex items-center gap-0.5">
                          <span className="text-slate-600">{l}=</span>
                          <span className={`font-bold ${(v ?? 0) >= 7 ? 'text-emerald-400' : (v ?? 0) >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>{v}</span>
                        </span>
                      ))}
                    </div>
                    {hasV2Score && (
                      <span className="font-mono font-bold text-base text-blue-300">
                        {startup.scoreV2!.toFixed(1)}/100
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-2 text-right">
                  <Link href="/methodology" className="text-xs text-slate-600 hover:text-blue-400 underline transition-colors">
                    Методология скоринга →
                  </Link>
                </div>
              </Section>
            )}

            {hasBusiness && (
              <Section title="Бизнес-данные">
                <div className="bg-white/3 rounded-xl border border-white/6 divide-y divide-white/5">
                  {startup.investorsText && (
                    <div className="px-4 py-3 grid grid-cols-[120px_1fr] gap-3 text-sm">
                      <span className="text-slate-600 text-xs font-medium uppercase tracking-wide pt-0.5">Инвесторы</span>
                      <span className="text-slate-300 leading-relaxed">{startup.investorsText}</span>
                    </div>
                  )}
                  {startup.fundingRounds && (
                    <div className="px-4 py-3 grid grid-cols-[120px_1fr] gap-3 text-sm">
                      <span className="text-slate-600 text-xs font-medium uppercase tracking-wide pt-0.5">Раунды</span>
                      <span className="text-slate-300 leading-relaxed">{startup.fundingRounds}</span>
                    </div>
                  )}
                  {startup.revenueText && (
                    <div className="px-4 py-3 grid grid-cols-[120px_1fr] gap-3 text-sm">
                      <span className="text-slate-600 text-xs font-medium uppercase tracking-wide pt-0.5">MRR / ARR</span>
                      <span className="text-slate-300 leading-relaxed">{startup.revenueText}</span>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {hasFounders && (
              <Section title="Основатели">
                <div className="bg-white/3 rounded-xl border border-white/6 px-4 py-3">
                  <p className="text-slate-300 text-sm leading-relaxed">{startup.foundersText}</p>
                  {startup.foundersLinks && (
                    <p className="text-xs text-slate-500 mt-2">{startup.foundersLinks}</p>
                  )}
                </div>
              </Section>
            )}

            <div className="grid grid-cols-2 gap-2.5 text-sm mb-6">
              {startup.teamSize && <MetaCell label="Команда" value={`${startup.teamSize} чел.`} />}
              {startup.foundedYear && <MetaCell label="Год основания" value={startup.foundedYear} />}
              {startup.fundingTotal && <MetaCell label="Инвестиции" value={`$${(startup.fundingTotal / 1e6).toFixed(1)}M`} />}
              {startup.fundingStage && <MetaCell label="Стадия" value={startup.fundingStage} />}
              {startup.votesCount && <MetaCell label="Голоса PH" value={`▲ ${startup.votesCount.toLocaleString('ru')}`} />}
              {startup.status && <MetaCell label="Статус" value={startup.status} />}
            </div>

            <div className="flex gap-3">
              <a
                href={startup.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center px-4 py-2.5 border border-white/12 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:border-white/25 transition-colors"
              >
                Открыть в {startup.source === 'yc' ? 'YC' : startup.source === 'producthunt' ? 'Product Hunt' : 'Crunchbase'} →
              </a>
              {startup.website && (
                <a
                  href={startup.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/40"
                >
                  Сайт компании →
                </a>
              )}
            </div>
          </>
        )}

        {/* ── RESEARCH TAB ── */}
        {activeTab === 'research' && research && (
          <div>
            {/* Research header */}
            <div className="mb-6 p-4 bg-blue-950/30 rounded-xl border border-blue-900/40">
              <div className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-1">Глубокий ресёрч · Применимость в России</div>
              {research.industry && (
                <div className="text-sm text-slate-400">{research.industry}</div>
              )}
            </div>

            {/* Research sections */}
            <div className="bg-white/3 rounded-xl border border-white/6 mb-6 overflow-hidden">
              {research.problem_rf && (
                <ResearchBlock label="🇷🇺 Актуальность проблемы в РФ" text={research.problem_rf} accent="true" />
              )}
              {research.solution_rf && (
                <ResearchBlock label="🔍 Российские аналоги" text={research.solution_rf} accent="true" />
              )}
              {research.barriers && (
                <ResearchBlock label="🚧 Барьеры для западной технологии" text={research.barriers} />
              )}
              {research.market_size && (
                <ResearchBlock label="📊 Объём рынка РФ" text={research.market_size} />
              )}
              {research.market_players && (
                <ResearchBlock label="🏆 Текущие игроки" text={research.market_players} />
              )}
              {research.strategy && (
                <ResearchBlock label="⚡ Стратегия дизрапта" text={research.strategy} />
              )}
            </div>

            {/* Original product context */}
            {(research.problem || research.solution) && (
              <Section title="Контекст: оригинальный продукт">
                <div className="bg-white/3 rounded-xl border border-white/6 divide-y divide-white/5">
                  {research.problem && (
                    <div className="px-4 py-3 grid grid-cols-[100px_1fr] gap-3 text-sm">
                      <span className="text-slate-600 text-xs font-medium uppercase tracking-wide pt-0.5">Проблема</span>
                      <span className="text-slate-300 leading-relaxed">{research.problem}</span>
                    </div>
                  )}
                  {research.solution && (
                    <div className="px-4 py-3 grid grid-cols-[100px_1fr] gap-3 text-sm">
                      <span className="text-slate-600 text-xs font-medium uppercase tracking-wide pt-0.5">Решение</span>
                      <span className="text-slate-300 leading-relaxed">{research.solution}</span>
                    </div>
                  )}
                </div>
              </Section>
            )}

            <div className="text-right">
              <Link href={baseHref} className="text-sm text-slate-500 hover:text-blue-400 transition-colors">
                ← Вернуться к обзору
              </Link>
            </div>
          </div>
        )}
      </div>

      {!hasFactors && activeTab === 'overview' && (
        <div className="text-center text-xs text-slate-600 mt-2">
          <Link href="/methodology" className="hover:text-blue-400 underline transition-colors">
            Подробнее о методологии скоринга →
          </Link>
        </div>
      )}
    </div>
  );
}
