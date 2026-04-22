'use client';

import { useState } from 'react';

interface Props {
  text: string;
  label?: string;
}

export default function CopyButton({ text, label = 'Copy' }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available — silently fail
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-150 ${
        copied
          ? 'border-green-500/40 text-green-400 bg-green-500/10'
          : 'border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 bg-zinc-800/80'
      }`}
    >
      {copied ? '✓ Copied' : `⎘ ${label}`}
    </button>
  );
}
