'use client';

import { useState, useEffect, useCallback } from 'react';
import UrlInput from '@/components/UrlInput';
import ResultPanel from '@/components/ResultPanel';
import HistoryPanel from '@/components/HistoryPanel';
import type { ScrapeResult, ScrapeError, HistoryEntry } from '@/lib/types';

const HISTORY_KEY = 'kopirka-history';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScrapeResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [lastUrl, setLastUrl] = useState<string | undefined>(undefined);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch {
      localStorage.removeItem(HISTORY_KEY);
    }
  }, []);

  const handleSubmit = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);
    setLastUrl(url);

    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data: ScrapeResult | ScrapeError = await res.json();

      if (!res.ok) {
        setError((data as ScrapeError).error ?? 'Something went wrong.');
        setResult(null);
        return;
      }

      const scraped = data as ScrapeResult;
      setResult(scraped);
      setError(null);

      // Update history (dedupe by URL, newest first, max 10)
      setHistory((prev) => {
        const entry: HistoryEntry = {
          url,
          title: scraped.title || url,
          timestamp: new Date().toISOString(),
        };
        const next = [entry, ...prev.filter((h) => h.url !== url)].slice(0, 10);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
        return next;
      });
    } catch {
      setError('Network error. Check your connection and try again.');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  function handleClear() {
    setResult(null);
    setError(null);
    setLastUrl(undefined);
  }

  function handleClearHistory() {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20">

        {/* Header */}
        <header className="mb-12 text-center">
              <div className="inline-flex items-center gap-2.5 mb-3">
            <span className="text-xl select-none">⚡</span>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-50">
              Копирка
            </h1>
          </div>
          <p className="text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed">
            Paste a URL — get a Claude Code prompt to recreate the site as a
            full Next.js project.
          </p>
        </header>

        {/* Input */}
        <UrlInput
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error ?? undefined}
          initialUrl={lastUrl}
        />

        {/* Empty state */}
        {!isLoading && !result && !error && <EmptyState />}

        {/* Result */}
        {result && <ResultPanel result={result} onClear={handleClear} />}

        {/* History */}
        {history.length > 0 && (
          <HistoryPanel
            history={history}
            onSelect={handleSubmit}
            onClear={handleClearHistory}
          />
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-16 text-center select-none">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 text-2xl mb-4">
        🔗
      </div>
      <p className="text-sm text-zinc-600">
        Enter a URL to generate a clone prompt.
      </p>
    </div>
  );
}
