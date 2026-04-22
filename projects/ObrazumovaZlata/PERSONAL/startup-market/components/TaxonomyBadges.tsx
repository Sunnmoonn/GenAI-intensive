'use client';

import { getTechLabels, getDomainLabels } from '@/lib/tag-taxonomy';

interface TaxonomyBadgesProps {
  rawTags: string[];
  onTechClick?: (label: string) => void;
  onDomainClick?: (label: string) => void;
  activeTech?: string[];
  activeDomain?: string[];
  maxEach?: number;
}

const TECH_COLORS = 'bg-blue-900/35 text-blue-300 border-blue-700/40 hover:bg-blue-800/50';
const TECH_ACTIVE = 'bg-blue-600 text-white border-blue-500';
const DOMAIN_COLORS = 'bg-emerald-900/35 text-emerald-300 border-emerald-700/40 hover:bg-emerald-800/50';
const DOMAIN_ACTIVE = 'bg-emerald-600 text-white border-emerald-500';

export function TaxonomyBadges({
  rawTags,
  onTechClick,
  onDomainClick,
  activeTech = [],
  activeDomain = [],
  maxEach = 2,
}: TaxonomyBadgesProps) {
  const techLabels = getTechLabels(rawTags).slice(0, maxEach);
  const domainLabels = getDomainLabels(rawTags).slice(0, maxEach);

  if (techLabels.length === 0 && domainLabels.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {techLabels.map(label => (
        <button
          key={label}
          type="button"
          onClick={e => { e.preventDefault(); onTechClick?.(label); }}
          className={`text-xs px-2 py-0.5 rounded-full border font-medium transition-colors cursor-default
            ${activeTech.includes(label) ? TECH_ACTIVE : TECH_COLORS}
            ${onTechClick ? 'cursor-pointer' : ''}`}
        >
          ⚡ {label}
        </button>
      ))}
      {domainLabels.map(label => (
        <button
          key={label}
          type="button"
          onClick={e => { e.preventDefault(); onDomainClick?.(label); }}
          className={`text-xs px-2 py-0.5 rounded-full border font-medium transition-colors cursor-default
            ${activeDomain.includes(label) ? DOMAIN_ACTIVE : DOMAIN_COLORS}
            ${onDomainClick ? 'cursor-pointer' : ''}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
