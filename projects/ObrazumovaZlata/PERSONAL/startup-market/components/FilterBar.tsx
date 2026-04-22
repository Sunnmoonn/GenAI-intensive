'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { TECH_TAGS, DOMAIN_TAGS } from '@/lib/tag-taxonomy';

const SOURCES = [
  { value: '', label: 'Все источники' },
  { value: 'yc', label: 'Y Combinator' },
  { value: 'producthunt', label: 'Product Hunt' },
  { value: 'crunchbase', label: 'Crunchbase' },
];

const SORTS = [
  { value: 'score', label: 'По скору' },
  { value: 'traction', label: 'По трекшну' },
  { value: 'recent', label: 'По дате' },
  { value: 'votes', label: 'По голосам' },
];

const YC_BATCHES = ['W25', 'S24', 'W24', 'S23', 'W23'];

const ALL_TECH   = Object.keys(TECH_TAGS);
const ALL_DOMAIN = Object.keys(DOMAIN_TAGS);

const selectCls = 'px-3 py-2 text-sm rounded-lg border border-white/10 bg-[#0b1225] text-slate-300 focus:outline-none focus:border-blue-500/60 transition-colors';

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [showTechTags, setShowTechTags]     = useState(false);
  const [showDomainTags, setShowDomainTags] = useState(false);

  const update = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  const getMulti = (key: string): string[] => {
    const v = searchParams.get(key);
    return v ? v.split(',').filter(Boolean) : [];
  };

  const toggleMulti = useCallback((key: string, value: string) => {
    const current = getMulti(key);
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    const params = new URLSearchParams(searchParams.toString());
    if (next.length > 0) params.set(key, next.join(','));
    else params.delete(key);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  const clearMulti = useCallback((key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  const q         = searchParams.get('q') ?? '';
  const source    = searchParams.get('source') ?? '';
  const sort      = searchParams.get('sort') ?? 'score';
  const batch     = searchParams.get('batch') ?? '';
  const techSel   = getMulti('tech');
  const domainSel = getMulti('domain');
  const hasTagFilters = techSel.length > 0 || domainSel.length > 0;

  return (
    <div className="space-y-3">
      {/* Row 1: search + dropdowns */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="search"
          placeholder="Поиск по названию или описанию..."
          defaultValue={q}
          onChange={e => update('q', e.target.value)}
          className="flex-1 min-w-48 px-3 py-2 text-sm rounded-lg border border-white/10 bg-[#0b1225] text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/60 transition-colors"
        />

        <select value={source} onChange={e => update('source', e.target.value)} className={selectCls}>
          {SOURCES.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <select value={sort} onChange={e => update('sort', e.target.value)} className={selectCls}>
          {SORTS.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {(source === 'yc' || source === '') && (
          <select value={batch} onChange={e => update('batch', e.target.value)} className={selectCls}>
            <option value="">Все батчи YC</option>
            {YC_BATCHES.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        )}

        <button
          type="button"
          onClick={() => { setShowTechTags(v => !v); setShowDomainTags(false); }}
          className={`px-3 py-2 text-sm rounded-lg border font-medium transition-colors
            ${showTechTags || techSel.length > 0
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'}`}
        >
          ⚡ Технология{techSel.length > 0 ? ` (${techSel.length})` : ''}
        </button>

        <button
          type="button"
          onClick={() => { setShowDomainTags(v => !v); setShowTechTags(false); }}
          className={`px-3 py-2 text-sm rounded-lg border font-medium transition-colors
            ${showDomainTags || domainSel.length > 0
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'}`}
        >
          Отрасль{domainSel.length > 0 ? ` (${domainSel.length})` : ''}
        </button>

        {hasTagFilters && (
          <button
            type="button"
            onClick={() => { clearMulti('tech'); clearMulti('domain'); }}
            className="px-3 py-2 text-sm rounded-lg border border-red-900/50 text-red-400 hover:bg-red-900/20 transition-colors"
          >
            ✕ Сбросить теги
          </button>
        )}
      </div>

      {/* Tech tag pills */}
      {showTechTags && (
        <div className="bg-blue-950/30 rounded-xl p-3 border border-blue-900/30">
          <div className="text-xs font-semibold text-blue-400 mb-2 uppercase tracking-wide">Технология</div>
          <div className="flex flex-wrap gap-1.5">
            {ALL_TECH.map(label => (
              <button
                key={label}
                type="button"
                onClick={() => toggleMulti('tech', label)}
                className={`text-xs px-3 py-1 rounded-full border font-medium transition-colors
                  ${techSel.includes(label)
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-blue-900/30 text-blue-300 border-blue-700/40 hover:bg-blue-800/50'}`}
              >
                ⚡ {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Domain tag pills */}
      {showDomainTags && (
        <div className="bg-emerald-950/20 rounded-xl p-3 border border-emerald-900/30">
          <div className="text-xs font-semibold text-emerald-400 mb-2 uppercase tracking-wide">Отрасль</div>
          <div className="flex flex-wrap gap-1.5">
            {ALL_DOMAIN.map(label => (
              <button
                key={label}
                type="button"
                onClick={() => toggleMulti('domain', label)}
                className={`text-xs px-3 py-1 rounded-full border font-medium transition-colors
                  ${domainSel.includes(label)
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-emerald-900/25 text-emerald-300 border-emerald-700/40 hover:bg-emerald-800/40'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active filter chips */}
      {hasTagFilters && (
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-xs text-slate-600">Активные фильтры:</span>
          {techSel.map(label => (
            <button
              key={label}
              type="button"
              onClick={() => toggleMulti('tech', label)}
              className="text-xs px-2 py-0.5 rounded-full bg-blue-600 text-white border border-blue-500 hover:bg-blue-700 transition-colors"
            >
              ⚡ {label} ✕
            </button>
          ))}
          {domainSel.map(label => (
            <button
              key={label}
              type="button"
              onClick={() => toggleMulti('domain', label)}
              className="text-xs px-2 py-0.5 rounded-full bg-emerald-600 text-white border border-emerald-500 hover:bg-emerald-700 transition-colors"
            >
              {label} ✕
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
