'use client';

import { useState, useRef, useEffect } from 'react';

const EXAMPLES = [
  'https://en.wikipedia.org/wiki/Web_scraping',
  'https://nextjs.org/docs',
  'https://github.com/mendableai/firecrawl',
];

interface Props {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  error?: string;
  initialUrl?: string;
}

export default function UrlInput({
  onSubmit,
  isLoading,
  error,
  initialUrl,
}: Props) {
  const [url, setUrl] = useState(initialUrl ?? '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialUrl !== undefined) setUrl(initialUrl);
  }, [initialUrl]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed);
  }

  function handleExample(ex: string) {
    setUrl(ex);
    inputRef.current?.focus();
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2.5">
        <input
          ref={inputRef}
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/article"
          autoComplete="off"
          spellCheck={false}
          disabled={isLoading}
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600/50 disabled:opacity-50 transition-all duration-150"
        />
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-all duration-150 whitespace-nowrap flex items-center gap-2 shrink-0"
        >
          {isLoading ? (
            <>
              <span className="block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Fetching…
            </>
          ) : (
            'Convert →'
          )}
        </button>
      </form>

      {error && (
        <div className="mt-3 flex items-start gap-2 text-sm text-red-400">
          <span className="shrink-0 mt-0.5">⚠</span>
          <span>{error}</span>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-zinc-600">
        <span>Try:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => handleExample(ex)}
            className="text-zinc-500 hover:text-indigo-400 transition-colors truncate max-w-[260px] text-left"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
