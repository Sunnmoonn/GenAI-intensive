'use client';

import type { HistoryEntry } from '@/lib/types';

interface Props {
  history: HistoryEntry[];
  onSelect: (url: string) => void;
  onClear: () => void;
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60_000);
  const hr = Math.floor(diffMs / 3_600_000);
  const day = Math.floor(diffMs / 86_400_000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  if (hr < 24) return `${hr}h ago`;
  return `${day}d ago`;
}

export default function HistoryPanel({ history, onSelect, onClear }: Props) {
  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
          Recent
        </h2>
        <button
          onClick={onClear}
          className="text-[11px] text-zinc-700 hover:text-zinc-500 transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="space-y-0.5">
        {history.map((entry, i) => (
          <button
            key={i}
            onClick={() => onSelect(entry.url)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-900 group text-left transition-colors"
          >
            <span className="text-zinc-700 group-hover:text-zinc-500 shrink-0 text-sm leading-none transition-colors">
              ↺
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-zinc-500 group-hover:text-zinc-300 truncate leading-snug transition-colors">
                {entry.title || entry.url}
              </p>
              <p className="text-[11px] text-zinc-700 truncate leading-snug mt-0.5">
                {entry.url}
              </p>
            </div>
            <span className="text-[11px] text-zinc-700 shrink-0">
              {timeAgo(entry.timestamp)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
