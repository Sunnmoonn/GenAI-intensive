'use client';

import { useState } from 'react';
import type { ScrapeResult } from '@/lib/types';
import CopyButton from './ui/CopyButton';

interface Props {
  prompt: string;
  result: ScrapeResult;
}

const AI_TARGETS = [
  { label: 'Claude Code', href: 'https://claude.ai/code' },
  { label: 'Claude', href: 'https://claude.ai' },
  { label: 'ChatGPT', href: 'https://chatgpt.com' },
];

export default function ClonePanel({ prompt, result }: Props) {
  const [expanded, setExpanded] = useState(false);
  const dc = result.designContext;

  const preview = prompt.slice(0, 700);
  const isLong = prompt.length > 700;

  // Build design badge list
  const badges: { label: string; color: string }[] = [];
  if (dc.colorScheme !== 'unknown') {
    badges.push({
      label: dc.colorScheme === 'dark' ? '🌙 Dark mode' : '☀️ Light mode',
      color: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    });
  }
  if (dc.themeColor) {
    badges.push({ label: dc.themeColor, color: 'bg-zinc-800 text-zinc-300 border-zinc-700' });
  }
  if (dc.tailwindDetected) {
    badges.push({ label: 'Tailwind CSS', color: 'bg-cyan-950 text-cyan-300 border-cyan-800' });
  } else if (dc.bootstrapDetected) {
    badges.push({ label: 'Bootstrap', color: 'bg-purple-950 text-purple-300 border-purple-800' });
  }
  if (dc.layoutType !== 'unknown') {
    badges.push({ label: dc.layoutType, color: 'bg-zinc-800 text-zinc-400 border-zinc-700' });
  }
  for (const font of dc.fontFamilies.slice(0, 2)) {
    badges.push({ label: font, color: 'bg-zinc-800 text-zinc-400 border-zinc-700' });
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-200 mb-1">Claude Code Prompt</p>
          <p className="text-xs text-zinc-500 leading-relaxed max-w-lg">
            Copy and paste into{' '}
            <span className="text-zinc-400">Claude Code</span> — it will recreate{' '}
            <span className="font-mono text-[11px] text-zinc-400">
              {new URL(result.url).hostname}
            </span>{' '}
            as a full Next.js project with matching design.
          </p>
        </div>
        <CopyButton text={prompt} label="Copy Prompt" />
      </div>

      {/* Design context badges */}
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {badges.map((b) => (
            <span
              key={b.label}
              className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-mono ${b.color}`}
            >
              {b.label}
            </span>
          ))}
        </div>
      )}

      {/* Open in */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-zinc-600">Open in:</span>
        {AI_TARGETS.map((ai) => (
          <a
            key={ai.label}
            href={ai.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 bg-zinc-800/80 transition-all duration-150"
          >
            {ai.label} ↗
          </a>
        ))}
      </div>

      {/* Prompt preview */}
      <div className="relative">
        <pre
          className={`bg-zinc-950 rounded-lg border border-zinc-800 p-4 text-[12.5px] font-mono text-zinc-300 overflow-auto leading-relaxed whitespace-pre-wrap break-words transition-all duration-200 ${
            expanded ? 'max-h-[700px]' : 'max-h-[280px]'
          }`}
        >
          {expanded ? prompt : preview}
          {!expanded && isLong && '…'}
        </pre>

        {isLong && (
          <div className={`${expanded ? '' : 'absolute bottom-0 left-0 right-0'} flex justify-center pt-2 pb-1`}>
            {!expanded && (
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-zinc-950 to-transparent rounded-b-lg pointer-events-none" />
            )}
            <button
              onClick={() => setExpanded((v) => !v)}
              className="relative z-10 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 bg-zinc-900 hover:border-zinc-600 transition-all duration-150"
            >
              {expanded ? '↑ Collapse' : '↓ Show full prompt'}
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <p className="mt-3 text-[11px] text-zinc-700">
        {prompt.length.toLocaleString()} characters ·{' '}
        {Math.ceil(prompt.length / 4).toLocaleString()} tokens (approx)
        {dc.cssVariables.length > 0 && ` · ${dc.cssVariables.length} CSS tokens extracted`}
      </p>
    </div>
  );
}
