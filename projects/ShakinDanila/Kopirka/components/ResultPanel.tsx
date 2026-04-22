'use client';

import { useMemo } from 'react';
import type { ScrapeResult } from '@/lib/types';
import { generateClonePrompt } from '@/lib/clone-prompt';
import ClonePanel from './ClonePanel';

interface Props {
  result: ScrapeResult;
  onClear: () => void;
}

export default function ResultPanel({ result, onClear }: Props) {
  const clonePrompt = useMemo(() => generateClonePrompt(result), [result]);

  return (
    <div className="mt-8 bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-4 py-3 border-b border-zinc-800/60">
        <div className="min-w-0 flex-1 pr-4">
          <p className="text-sm font-medium text-zinc-200 truncate leading-snug">
            {result.title}
          </p>
          <p className="text-xs text-zinc-600 truncate mt-0.5">{result.url}</p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          {result.usedPlaywright && (
            <span className="text-[11px] text-amber-400/80 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              JS rendered
            </span>
          )}
          <span className="text-xs text-zinc-600">
            {result.wordCount.toLocaleString()} words
          </span>
          <button
            onClick={onClear}
            className="text-zinc-700 hover:text-zinc-400 text-sm transition-colors leading-none"
            aria-label="Clear result"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Clone panel */}
      <div className="p-4">
        <ClonePanel prompt={clonePrompt} result={result} />
      </div>
    </div>
  );
}
