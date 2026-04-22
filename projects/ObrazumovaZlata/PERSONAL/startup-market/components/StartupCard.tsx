'use client';

import Link from 'next/link';
import type { Startup } from '@/db/schema';
import { SourceBadge } from './SourceBadge';
import { TotalScoreBadge, FactorDot } from './ScoreBar';
import { TaxonomyBadges } from './TaxonomyBadges';

interface StartupCardProps {
  startup: Startup;
  rank?: number;
  activeTech?: string[];
  activeDomain?: string[];
  hasResearch?: boolean;
}

export function StartupCard({ startup, rank, activeTech = [], activeDomain = [], hasResearch = false }: StartupCardProps) {
  const name = startup.name;
  const tagline = startup.taglineRu ?? startup.tagline ?? '';
  const rawTags = [...((startup.tags ?? []) as string[]), ...((startup.industries ?? []) as string[])];

  const hasAnalysis = startup.problemStatement || startup.solutionText || startup.targetUser;
  const hasFactors = startup.scoreM != null && startup.scoreT != null && startup.scoreA != null && startup.scoreB != null && startup.scoreP != null;

  return (
    <Link
      href={`/startups/${startup.id}`}
      className="group block bg-[#0b1225] rounded-xl border border-[rgba(99,130,210,0.13)] p-4 hover:border-[rgba(79,130,255,0.38)] hover:bg-[#0f1830] hover:shadow-lg hover:shadow-blue-950/40 transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          {rank && (
            <span className="text-base font-bold text-orange-400 w-6 shrink-0">#{rank}</span>
          )}
          {startup.logoUrl && (
            <img
              src={startup.logoUrl}
              alt={name}
              className="w-8 h-8 rounded object-contain shrink-0 opacity-90"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="font-semibold text-slate-100 truncate group-hover:text-blue-300 transition-colors text-sm">
                {name}
              </h3>
              {hasResearch && (
                <span className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded bg-violet-900/50 text-violet-300 border border-violet-700/40 leading-none">
                  Глубокий анализ
                </span>
              )}
            </div>
            {startup.batch && (
              <span className="text-xs text-slate-600">{startup.batch}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <SourceBadge source={startup.source} sources={startup.sources as string[] | undefined} />
          <TotalScoreBadge scoreV2={startup.scoreV2} />
        </div>
      </div>

      {/* Tagline */}
      <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">{tagline}</p>

      {/* Taxonomy tags */}
      <div className="mb-3">
        <TaxonomyBadges
          rawTags={rawTags}
          activeTech={activeTech}
          activeDomain={activeDomain}
          maxEach={2}
        />
      </div>

      {/* Problem / Solution block (when analysis is available) */}
      {hasAnalysis && (
        <div className="space-y-1.5 pt-2 border-t border-white/6">
          {startup.targetUser && (
            <div className="flex gap-1.5 text-xs">
              <span className="text-slate-600 shrink-0 mt-0.5">Для кого:</span>
              <span className="text-slate-400 line-clamp-1">{startup.targetUser}</span>
            </div>
          )}
          {startup.problemStatement && (
            <div className="flex gap-1.5 text-xs">
              <span className="text-slate-600 shrink-0 mt-0.5">Проблема:</span>
              <span className="text-slate-400 line-clamp-2">{startup.problemStatement}</span>
            </div>
          )}
          {startup.solutionText && (
            <div className="flex gap-1.5 text-xs">
              <span className="text-slate-600 shrink-0 mt-0.5">Решение:</span>
              <span className="text-slate-400 line-clamp-2">{startup.solutionText}</span>
            </div>
          )}
        </div>
      )}

      {/* V2 factor scores (M T A B P) */}
      {hasFactors && (
        <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/6">
          <FactorDot label="M" value={startup.scoreM!} />
          <FactorDot label="T" value={startup.scoreT!} />
          <FactorDot label="A" value={startup.scoreA!} />
          <FactorDot label="B" value={startup.scoreB!} />
          <FactorDot label="P" value={startup.scoreP!} />
        </div>
      )}

      {/* PH votes */}
      {startup.votesCount != null && startup.votesCount > 0 && (
        <div className="mt-2 text-xs text-slate-600">
          ▲ {startup.votesCount.toLocaleString('ru')} голосов
        </div>
      )}

      {/* Funding */}
      {startup.fundingTotal != null && startup.fundingTotal > 0 && (
        <div className="mt-1 text-xs text-slate-600">
          Инвестиции: ${(startup.fundingTotal / 1e6).toFixed(1)}M
        </div>
      )}
    </Link>
  );
}
