import Link from 'next/link';
import { getCurrentWeeklyTop, getCurrentMonthlyTop } from '@/lib/rankings';
import { StartupCard } from '@/components/StartupCard';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ period?: string }>;
}

export default async function TopPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const period = resolvedParams.period ?? 'week';

  let weekly: ReturnType<typeof getCurrentWeeklyTop> = [];
  let monthly: ReturnType<typeof getCurrentMonthlyTop> = [];

  try {
    weekly = getCurrentWeeklyTop(10);
    monthly = getCurrentMonthlyTop(10);
  } catch {
    // DB not ready
  }

  const list = period === 'month' ? monthly : weekly;
  const label = period === 'month' ? 'месяца' : 'недели';

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">Топ-10 для аналога в России</h1>
        <p className="text-slate-500 text-sm leading-relaxed">
          Стартапы с наибольшим потенциалом для создания российского аналога — отбираются по высоким барьерам для Запада и актуальности ниши для РФ прямо сейчас
        </p>
      </div>

      {/* Period toggle */}
      <div className="flex gap-2 mb-8">
        <Link
          href="/top?period=week"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            period === 'week'
              ? 'bg-blue-600 text-white'
              : 'border border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
          }`}
        >
          Эта неделя
        </Link>
        <Link
          href="/top?period=month"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            period === 'month'
              ? 'bg-blue-600 text-white'
              : 'border border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
          }`}
        >
          Этот месяц
        </Link>
      </div>

      {list.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {list.map(({ rank, startup }) => (
            <StartupCard key={startup.id} startup={startup} rank={rank} />
          ))}
        </div>
      ) : (
        <div className="bg-[#0b1225] rounded-xl border border-dashed border-white/10 p-16 text-center text-slate-500">
          <p className="mb-2">Данные для топа {label} ещё не сформированы.</p>
          <code className="text-xs bg-white/5 rounded px-2 py-1 mt-2 inline-block text-slate-400">
            npx tsx cron/run-sync.ts --compute-rankings
          </code>
        </div>
      )}

      {/* Scoring explanation */}
      <div className="mt-12 bg-[#0b1225] rounded-2xl p-6 border border-blue-900/30">
        <h2 className="font-bold text-base mb-4 text-white">Как считается скор</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {[
            { name: 'Дизрапт эффективности', weight: '25%', desc: 'Насколько технология меняет правила игры в отрасли' },
            { name: 'Масштабируемость', weight: '20%', desc: 'Возможность роста без пропорционального увеличения затрат' },
            { name: 'Размер рынка', weight: '20%', desc: 'Достаточно большой для нас, но не для Google/Яндекс' },
            { name: 'Трекшн', weight: '15%', desc: 'Интерес рынка: голоса, инвестиции, размер команды' },
            { name: 'Барьеры для Запада', weight: '10%', desc: 'Санкции, регулирование — чем выше, тем лучше для нас' },
            { name: 'Тайминг для РФ', weight: '10%', desc: 'Насколько ниша актуальна для России прямо сейчас' },
          ].map(item => (
            <div key={item.name} className="flex gap-3">
              <span className="font-mono text-xs bg-blue-900/40 text-blue-300 px-2 py-1 rounded h-fit shrink-0 border border-blue-700/30">
                {item.weight}
              </span>
              <div>
                <div className="font-medium text-slate-200 text-sm">{item.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-4 border-t border-white/6">
          <Link href="/methodology" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            Подробная методология →
          </Link>
        </div>
      </div>
    </div>
  );
}
