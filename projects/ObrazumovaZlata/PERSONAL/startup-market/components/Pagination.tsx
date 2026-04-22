'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PaginationProps {
  page: number;
  totalPages: number;
  searchParamsStr: string;
}

const btnBase = 'px-3 py-2 rounded-lg text-sm border border-white/10 text-slate-400 hover:text-white hover:border-white/25 transition-colors';
const btnActive = 'px-3 py-2 rounded-lg text-sm bg-blue-600 text-white border border-blue-500';

export function Pagination({ page, totalPages, searchParamsStr }: PaginationProps) {
  const router = useRouter();
  const [inputVal, setInputVal] = useState('');

  function buildUrl(n: number) {
    const p = new URLSearchParams(searchParamsStr);
    p.set('page', String(n));
    return `/startups?${p.toString()}`;
  }

  const jump = () => {
    const n = parseInt(inputVal, 10);
    if (!isNaN(n) && n >= 1 && n <= totalPages) {
      router.push(buildUrl(n));
      setInputVal('');
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
      {page > 2 && (
        <Link href={buildUrl(1)} className={btnBase}>« 1</Link>
      )}
      {page > 1 && (
        <Link href={buildUrl(page - 1)} className={btnBase}>← Назад</Link>
      )}
      <span className={btnActive}>{page} / {totalPages}</span>
      {page < totalPages && (
        <Link href={buildUrl(page + 1)} className={btnBase}>Вперёд →</Link>
      )}
      {page < totalPages - 1 && (
        <Link href={buildUrl(totalPages)} className={btnBase}>{totalPages} »</Link>
      )}
      <div className="flex items-center gap-1.5 ml-2">
        <span className="text-xs text-slate-600">стр.</span>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && jump()}
          placeholder="№"
          className="w-14 px-2 py-2 text-sm rounded-lg border border-white/10 bg-[#0b1225] text-slate-300 focus:outline-none focus:border-blue-500/60"
        />
        <button
          onClick={jump}
          className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-500 transition-colors"
        >
          →
        </button>
      </div>
    </div>
  );
}
