'use client';

interface ScoreBarProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
}

export function ScoreBar({ label, value, max = 100, color }: ScoreBarProps) {
  const pct = Math.min(100, (value / max) * 100);
  const barColor = color ?? (pct >= 70 ? 'bg-emerald-500' : pct >= 45 ? 'bg-yellow-500' : 'bg-red-500');

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-28 text-slate-500 shrink-0">{label}</span>
      <div className="flex-1 bg-white/6 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-6 text-right font-mono text-slate-500">{Math.round(value)}</span>
    </div>
  );
}

// Compact factor dot for showing M/T/A/B/P inline
interface FactorDotProps {
  label: string;
  value: number;
}

export function FactorDot({ label, value }: FactorDotProps) {
  const color = value >= 7 ? 'text-emerald-400' : value >= 5 ? 'text-yellow-400' : 'text-red-400';
  return (
    <span className="inline-flex items-center gap-0.5 text-xs">
      <span className="text-slate-600 font-medium">{label}</span>
      <span className={`font-bold ${color}`}>{value}</span>
    </span>
  );
}

interface TotalScoreBadgeProps {
  scoreV2?: number | null;
}

export function TotalScoreBadge({ scoreV2 }: TotalScoreBadgeProps) {
  if (scoreV2 != null && scoreV2 > 0) {
    const color = scoreV2 >= 70
      ? 'bg-emerald-900/50 text-emerald-300 border-emerald-700/50'
      : scoreV2 >= 50
      ? 'bg-yellow-900/40 text-yellow-300 border-yellow-700/40'
      : 'bg-white/5 text-slate-400 border-white/10';
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${color}`}>
        {scoreV2.toFixed(0)}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border bg-white/5 text-slate-500 border-white/10">
      -/100
    </span>
  );
}
