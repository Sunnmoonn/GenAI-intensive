const SOURCE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  yc:          { label: 'YC',         color: 'text-orange-300', bg: 'bg-orange-900/40' },
  producthunt: { label: 'PH',         color: 'text-rose-300',   bg: 'bg-rose-900/40'   },
  crunchbase:  { label: 'Crunchbase', color: 'text-blue-300',   bg: 'bg-blue-900/40'   },
};

interface SourceBadgeProps {
  source: string;
  sources?: string[];
}

export function SourceBadge({ source, sources }: SourceBadgeProps) {
  const list = sources && sources.length > 0
    ? [...new Set(sources)]
    : [source];

  return (
    <span className="inline-flex items-center gap-0.5">
      {list.map(s => {
        const cfg = SOURCE_CONFIG[s] ?? { label: s, color: 'text-slate-400', bg: 'bg-white/8' };
        return (
          <span
            key={s}
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cfg.bg} ${cfg.color}`}
          >
            {cfg.label}
          </span>
        );
      })}
    </span>
  );
}
