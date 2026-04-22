import Link from 'next/link';

export const metadata = {
  title: 'Методология VENTURE-SCAN RF 2.0 | Рынок стартапов',
};

const FACTORS = [
  {
    key: 'M',
    name: 'Ёмкость российского рынка',
    weight: 'двойной вес',
    accent: 'text-blue-300',
    bar: 'bg-blue-500',
    borderAccent: 'border-l-blue-500',
    question: 'Насколько велик адресный рынок в России для данного продукта/ниши?',
    rows: [
      { score: '9–10', desc: 'Рынок огромный, массовый (десятки миллионов пользователей или миллиарды ₽ потенциала)' },
      { score: '7–8',  desc: 'Крупный B2B или широкий B2C сегмент в РФ' },
      { score: '5–6',  desc: 'Средний рынок, специализированный сегмент' },
      { score: '3–4',  desc: 'Узкая ниша или слабо развитый спрос в РФ' },
      { score: '1–2',  desc: 'Продукт заточен под другой регион/рынок, в РФ практически неприменим' },
    ],
  },
  {
    key: 'T',
    name: 'Воспроизводимость технологии',
    weight: 'одинарный вес',
    accent: 'text-purple-300',
    bar: 'bg-purple-500',
    borderAccent: 'border-l-purple-500',
    question: 'Насколько легко российской команде воспроизвести или адаптировать технологию?',
    note: 'Логика перевёрнута: высокий балл означает простую для копирования технологию — это хорошо с точки зрения российского предпринимателя.',
    rows: [
      { score: '9–10', desc: 'Стандартный стек, нет патентов, open-source компоненты — легко воспроизвести' },
      { score: '7–8',  desc: 'Реализуемо за 6–18 месяцев командой из 5–10 человек' },
      { score: '5–6',  desc: 'Требует значительных R&D-ресурсов, есть нетривиальные технические аспекты' },
      { score: '3–4',  desc: 'Глубокая техническая инфраструктура, сложные алгоритмы, накопленные данные' },
      { score: '1–2',  desc: 'Запатентованные технологии, уникальные данные, hardware — копирование крайне затруднено' },
    ],
  },
  {
    key: 'A',
    name: 'Свободное место на рынке РФ',
    weight: 'одинарный вес',
    accent: 'text-emerald-300',
    bar: 'bg-emerald-500',
    borderAccent: 'border-l-emerald-500',
    question: 'Есть ли в России аналоги? Насколько ниша пустая?',
    rows: [
      { score: '9–10', desc: 'Ниша абсолютно пустая, прямых аналогов нет вообще' },
      { score: '7–8',  desc: 'Российских аналогов нет или они очень слабые; западный игрок ушёл из РФ' },
      { score: '5–6',  desc: 'Есть 1–2 российских игрока, но рынок не насыщен' },
      { score: '3–4',  desc: 'Сильные российские конкуренты присутствуют' },
      { score: '1–2',  desc: 'Рынок насыщен российскими решениями или продукт неприменим в РФ' },
    ],
  },
  {
    key: 'B',
    name: 'Барьеры для иностранных конкурентов',
    weight: 'одинарный вес',
    accent: 'text-red-300',
    bar: 'bg-red-500',
    borderAccent: 'border-l-red-500',
    question: 'Насколько защищён российский рынок от возвращения западных игроков?',
    rows: [
      { score: '9–10', desc: 'Полный запрет, санкции, регуляторный барьер — возврат невозможен' },
      { score: '7–8',  desc: 'Высокие политические и операционные барьеры; возврат маловероятен в горизонте 5+ лет' },
      { score: '5–6',  desc: 'Умеренные барьеры; теоретически возможен возврат при изменении геополитики' },
      { score: '3–4',  desc: 'Слабые барьеры; иностранные игроки потенциально могут вернуться' },
      { score: '1–2',  desc: 'Иностранные конкуренты активно работают в РФ или легко могут вернуться' },
    ],
  },
  {
    key: 'P',
    name: 'Доказанность бизнес-модели',
    weight: 'одинарный вес',
    accent: 'text-yellow-300',
    bar: 'bg-yellow-500',
    borderAccent: 'border-l-yellow-500',
    question: 'Насколько подтверждена модель тракшном, выручкой, клиентами?',
    rows: [
      { score: '9–10', desc: 'Зрелый бизнес: $10M+ ARR, тысячи клиентов, понятная unit-экономика' },
      { score: '7–8',  desc: 'Чёткий PMF: сотни клиентов, стабильный рост, $1M–10M ARR' },
      { score: '5–6',  desc: 'Ранний тракшн: десятки платящих клиентов, есть повторные продажи' },
      { score: '3–4',  desc: 'MVP или первые пилоты; модель не подтверждена масштабом' },
      { score: '1–2',  desc: 'Идея или pre-revenue; нет значимых доказательств работоспособности' },
    ],
  },
];

const EXAMPLES = [
  {
    name: 'Checkr',
    score: '74.6',
    factors: 'M=7, T=7, A=7, B=8, P=9',
    formula: '(7² × 7 × 7 × 8 × 9)^(1/6) × 10 = (17 640 768)^(1/6) × 10 ≈ 74.6',
    comment: 'Фоновые проверки сотрудников — большой рынок в РФ, западный игрок ушёл, российских аналогов с таким масштабом нет, бизнес зрелый.',
    color: 'bg-emerald-900/30 border-emerald-700/40 text-emerald-300',
  },
  {
    name: 'Openroll',
    score: '59.4',
    factors: 'M=7, T=7, A=8, B=8, P=2',
    formula: '(7² × 7 × 8 × 8 × 2)^(1/6) × 10 = (43 904)^(1/6) × 10 ≈ 59.4',
    comment: 'Идеальная ниша (A=8, B=8), большой рынок — но P=2 тянет скор вниз. При появлении тракшна скор вырастет до ~73.',
    color: 'bg-yellow-900/30 border-yellow-700/40 text-yellow-300',
  },
  {
    name: 'Edyst',
    score: '30.7',
    factors: 'M=2, T=7, A=2, B=5, P=3',
    formula: '(2² × 7 × 2 × 5 × 3)^(1/6) × 10 = (840)^(1/6) × 10 ≈ 30.7',
    comment: 'Индийская peer-to-peer платформа онлайн-обучения — в РФ нет ни рынка, ни свободной ниши для этого формата.',
    color: 'bg-red-900/30 border-red-700/40 text-red-300',
  },
];

export default function MethodologyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/" className="text-sm text-blue-400 hover:text-blue-300 mb-6 inline-flex items-center gap-1 transition-colors">
        ← На главную
      </Link>

      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="text-3xl font-bold text-white">VENTURE-SCAN RF 2.0</h1>
        <span className="shrink-0 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/25 px-3 py-1 rounded-full mt-1">
          Методология
        </span>
      </div>
      <p className="text-slate-500 mb-10 text-sm leading-relaxed">
        Методология оценки зарубежных стартапов с точки зрения перспективности для российского рынка —
        как объект для копирования, адаптации или инвестиции.
      </p>

      {/* Goal */}
      <section className="rounded-2xl p-6 mb-10 bg-gradient-to-br from-blue-900/60 to-indigo-900/40 border border-blue-700/40">
        <h2 className="font-bold text-lg mb-3 text-white">Цель анализа</h2>
        <p className="text-slate-300 leading-relaxed text-sm">
          Методология не оценивает глобальный потенциал компании, а фокусируется исключительно
          на <strong className="text-white">релевантности для РФ</strong> — насколько стартап перспективен
          для российского рынка как объект для копирования, адаптации или инвестиции.
        </p>
      </section>

      {/* Formula */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-5 text-white">Формула</h2>
        <div className="bg-[#0b1225] rounded-2xl border border-white/8 p-6">
          <div className="text-center mb-5">
            <div className="inline-block font-mono text-lg text-blue-300 bg-blue-900/30 border border-blue-700/30 rounded-xl px-6 py-3">
              Score = (M² × T × A × B × P)^(1/6) × 10
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            Это <strong className="text-slate-200">взвешенное геометрическое среднее</strong> пяти факторов.
            Фактор <strong className="text-blue-300">M</strong> имеет двойной вес (возводится в квадрат),
            остальные — одинарный. Результат нормируется на шкалу 0–100.
          </p>
          <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-xl p-4 text-sm text-yellow-200">
            <strong>Важно:</strong> геометрическое среднее очень чувствительно к слабым факторам.
            Один фактор со значением 2 может опустить итоговый скор на 20–30 пунктов даже при высоких остальных.
            Это сделано намеренно — «дыры» в профиле должны быть видны.
          </div>
        </div>
      </section>

      {/* Factors */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-5 text-white">5 факторов оценки</h2>
        <p className="text-sm text-slate-500 mb-5">Каждый фактор оценивается по шкале <strong className="text-slate-300">1–10</strong>.</p>
        <div className="space-y-4">
          {FACTORS.map((factor) => (
            <div key={factor.key} className={`bg-[#0b1225] rounded-2xl border border-white/8 overflow-hidden border-l-4 ${factor.borderAccent}`}>
              <div className="px-5 py-4 bg-white/2">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div className="flex items-center gap-3">
                    <span className={`text-3xl font-black ${factor.accent}`}>{factor.key}</span>
                    <div>
                      <h3 className="font-bold text-white text-sm">{factor.name}</h3>
                      <p className="text-xs text-slate-500 italic mt-0.5">{factor.question}</p>
                    </div>
                  </div>
                  <span className={`shrink-0 text-xs font-medium ${factor.accent} bg-white/5 border border-white/10 px-2.5 py-1 rounded-full`}>
                    {factor.weight}
                  </span>
                </div>
                {factor.note && (
                  <div className="mt-3 text-xs text-orange-300 bg-orange-900/20 border border-orange-700/30 rounded-lg px-3 py-2">
                    ⚠ {factor.note}
                  </div>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <tbody>
                    {factor.rows.map((row) => (
                      <tr key={row.score} className="border-t border-white/5">
                        <td className={`px-5 py-2.5 font-mono font-bold shrink-0 w-12 ${factor.accent}`}>{row.score}</td>
                        <td className="px-5 py-2.5 text-slate-400 pr-5">{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Color coding */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-5 text-white">Цветовая маркировка</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#0b1225] rounded-2xl border border-white/8 p-5">
            <h3 className="font-semibold text-slate-300 text-sm mb-3 uppercase tracking-wide">Итоговый скор</h3>
            <div className="space-y-2">
              {[
                { range: '≥ 70', label: 'Высокий приоритет', desc: 'стартап очень перспективен для РФ', color: 'bg-emerald-500' },
                { range: '50–69', label: 'Средний приоритет', desc: 'есть потенциал, требует анализа', color: 'bg-yellow-500' },
                { range: '< 50', label: 'Низкий приоритет', desc: 'слабая применимость к рынку РФ', color: 'bg-red-500' },
              ].map(item => (
                <div key={item.range} className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full shrink-0 ${item.color}`} />
                  <span className="font-mono text-xs text-slate-400 w-12 shrink-0">{item.range}</span>
                  <span className="text-xs text-slate-400">{item.label} — {item.desc}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#0b1225] rounded-2xl border border-white/8 p-5">
            <h3 className="font-semibold text-slate-300 text-sm mb-3 uppercase tracking-wide">Отдельные факторы</h3>
            <div className="space-y-2">
              {[
                { range: '≥ 7', color: 'bg-emerald-500', label: 'Зелёный' },
                { range: '5–6', color: 'bg-yellow-500', label: 'Оранжевый' },
                { range: '≤ 4', color: 'bg-red-500', label: 'Красный' },
              ].map(item => (
                <div key={item.range} className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full shrink-0 ${item.color}`} />
                  <span className="font-mono text-xs text-slate-400 w-12 shrink-0">{item.range}</span>
                  <span className="text-xs text-slate-400">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Decision thresholds */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 text-white">Пороговые значения</h2>
        <div className="bg-[#0b1225] rounded-2xl border border-white/8 overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/4 border-b border-white/8">
                <th className="text-left px-4 py-3 font-semibold text-slate-300">Скор</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-300">Рекомендация</th>
              </tr>
            </thead>
            <tbody>
              {[
                { score: '≥ 70',   action: 'Смотреть в первую очередь', color: 'text-emerald-400' },
                { score: '60–69',  action: 'Смотреть обязательно, особенно если M=7+ и A=7+', color: 'text-yellow-400' },
                { score: '50–59',  action: 'Смотреть при наличии стратегического интереса к нише', color: 'text-orange-400' },
                { score: '< 50',   action: 'Пропустить (если только нет специфического запроса)', color: 'text-red-400' },
              ].map(row => (
                <tr key={row.score} className="border-b border-white/6 last:border-0">
                  <td className={`px-4 py-3 font-mono font-bold ${row.color}`}>{row.score}</td>
                  <td className="px-4 py-3 text-slate-400 text-sm">{row.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Рекомендуемый порог для детального изучения: ≥ 60 баллов. Порог 70 слишком жёсткий из-за геометрического среднего —
          ранний стартап с сильным рынком и свободной нишей, но P=4 (нет выручки), получит ~65, хотя стратегически
          он может быть интереснее зрелого игрока с P=9 в слабой нише.
        </p>
      </section>

      {/* Examples */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-5 text-white">Примеры расчёта</h2>
        <div className="space-y-3">
          {EXAMPLES.map(ex => (
            <div key={ex.name} className={`rounded-2xl border p-5 ${ex.color}`}>
              <div className="flex items-center justify-between gap-4 mb-2">
                <div>
                  <span className="font-bold text-base">{ex.name}</span>
                  <span className="text-xs ml-2 opacity-70">{ex.factors}</span>
                </div>
                <span className="font-mono font-black text-2xl shrink-0">{ex.score}</span>
              </div>
              <div className="font-mono text-xs opacity-60 mb-2">{ex.formula}</div>
              <p className="text-xs opacity-80 leading-relaxed">{ex.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Record structure */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 text-white">Структура записи по каждому стартапу</h2>
        <div className="bg-[#0b1225] rounded-2xl border border-white/8 overflow-hidden">
          <table className="w-full text-xs">
            <tbody>
              {[
                ['Название', 'Оригинальное название стартапа'],
                ['Источник', 'Откуда взят (YC, Crunchbase, и др.)'],
                ['Батч YC', 'Если применимо (S24, W25, и т.д.)'],
                ['Скор v2', 'Итоговый балл по формуле'],
                ['Описание EN', 'Оригинальное описание'],
                ['Технологии', 'Ключевые технологии (AI/ML, Blockchain, и др.)'],
                ['Отрасль', 'Категория (FinTech, HR/Рекрутинг, и др.)'],
                ['Описание RU', 'Краткое описание сути на русском'],
                ['M / T / A / B / P', 'Оценки по каждому из пяти факторов'],
                ['Инвесторы', 'Кто проинвестировал'],
                ['MRR/ARR', 'Если известно'],
                ['Ссылка', 'Сайт стартапа'],
              ].map(([field, desc]) => (
                <tr key={field} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-2.5 font-semibold text-slate-300 w-44 shrink-0">{field}</td>
                  <td className="px-4 py-2.5 text-slate-500">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Limitations */}
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4 text-white">Ограничения методологии</h2>
        <div className="space-y-3">
          {[
            ['Субъективность факторов', 'Оценки основаны на экспертном суждении, не на точных данных. Разные эксперты могут дать M±1–2 балла.'],
            ['Статичность', 'Скор отражает момент оценки. P особенно быстро меняется: стартап может вырасти с P=3 до P=7 за год.'],
            ['Отсутствие весов по отрасли', 'Методология единая для всех категорий, хотя динамика рынков (FinTech vs HR-tech vs HealthTech) существенно различается.'],
            ['Геополитическая неопределённость', 'Фактор B оценивается в текущих условиях; изменение геополитики может резко изменить картину.'],
            ['Нет поправки на команду', 'Методология оценивает продукт и рынок, а не качество фаундеров — намеренно.'],
          ].map(([title, desc], i) => (
            <div key={i} className="bg-[#0b1225] rounded-xl border border-white/8 p-4 flex gap-3">
              <span className="text-slate-600 font-mono text-sm shrink-0 mt-0.5">{i + 1}.</span>
              <div>
                <div className="font-semibold text-slate-300 text-sm mb-1">{title}</div>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="text-center">
        <Link
          href="/startups"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/40"
        >
          Смотреть все стартапы →
        </Link>
      </div>
    </div>
  );
}
