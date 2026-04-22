import Link from 'next/link';
import { getCurrentWeeklyTop } from '@/lib/rankings';
import { StartupCard } from '@/components/StartupCard';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  let weeklyTop: ReturnType<typeof getCurrentWeeklyTop> = [];
  try {
    weeklyTop = getCurrentWeeklyTop(6);
  } catch {
    // DB might not be initialized yet
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center mb-16">
        <div className="inline-block text-xs font-semibold tracking-widest text-blue-400 uppercase mb-4 px-3 py-1 rounded-full border border-blue-500/25 bg-blue-500/8">
          Аналитика · Скоринг · Мониторинг
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-5 tracking-tight text-white leading-tight">
          Мировой рынок стартапов<br />
          <span className="text-blue-400">для российского контекста</span>
        </h1>
        <p className="text-slate-400 text-base max-w-2xl mx-auto mb-8 leading-relaxed">
          Отслеживаем стартапы с Y Combinator, Product Hunt и Crunchbase.
          Каждый оценивается по потенциалу для российского рынка.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/startups"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/40"
          >
            Все стартапы →
          </Link>
          <Link
            href="/top"
            className="px-6 py-2.5 border border-white/15 text-slate-300 rounded-lg text-sm font-semibold hover:bg-white/6 hover:text-white transition-colors"
          >
            Топ-10 недели
          </Link>
        </div>
      </section>

      {/* Stats row */}
      <section className="grid grid-cols-3 gap-4 mb-16">
        {[
          { label: 'Источников данных', value: '3' },
          { label: 'Обновление', value: 'Ежедневно' },
          { label: 'Критериев скоринга', value: '6' },
        ].map(stat => (
          <div key={stat.label} className="bg-[#0b1225] rounded-xl border border-white/8 p-6 text-center">
            <div className="text-3xl font-bold mb-1 text-blue-400">{stat.value}</div>
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Weekly top */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Топ недели</h2>
          <Link href="/top" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            Полный топ →
          </Link>
        </div>

        {weeklyTop.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {weeklyTop.map(({ rank, startup }) => (
              <StartupCard key={startup.id} startup={startup} rank={rank} />
            ))}
          </div>
        ) : (
          <div className="bg-[#0b1225] rounded-xl border border-dashed border-white/10 p-10 text-center text-slate-500">
            <p className="mb-2">Данные ещё не загружены.</p>
            <code className="text-xs bg-white/5 rounded px-2 py-1 mt-2 inline-block text-slate-400">
              npx tsx cron/run-sync.ts --source yc --full
            </code>
          </div>
        )}
      </section>

      {/* Sources */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            name: 'Y Combinator',
            desc: 'Лучший акселератор мира. 7000+ стартапов, данные через публичный API.',
            accent: 'border-orange-500/20 hover:border-orange-500/40',
            label: 'text-orange-400',
          },
          {
            name: 'Product Hunt',
            desc: 'Главная площадка для запуска продуктов. Ежедневные голосования за новые стартапы.',
            accent: 'border-rose-500/20 hover:border-rose-500/40',
            label: 'text-rose-400',
          },
          {
            name: 'Crunchbase',
            desc: 'База данных инвестиций. Раунды, оценки компаний, данные о фаундерах.',
            accent: 'border-blue-500/20 hover:border-blue-500/40',
            label: 'text-blue-400',
          },
        ].map(src => (
          <div key={src.name} className={`bg-[#0b1225] rounded-xl border p-5 transition-colors ${src.accent}`}>
            <div className={`text-sm font-semibold mb-2 ${src.label}`}>{src.name}</div>
            <p className="text-sm text-slate-500 leading-relaxed">{src.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
