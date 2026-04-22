/**
 * Generates human-readable explanations for startup scores based on the
 * same signals used by the scoring algorithm in lib/scoring.ts.
 * No external API needed — purely deterministic.
 */

import type { Startup } from '@/db/schema';

// ─── Tag translations ─────────────────────────────────────────────────────────
const TAG_RU: Record<string, string> = {
  'Artificial Intelligence': 'Искусственный интеллект',
  'Machine Learning': 'Машинное обучение',
  'Generative AI': 'Генеративный AI',
  'Robotics': 'Робототехника',
  'Hard Tech': 'Hard Tech',
  'Deep Tech': 'Deep Tech',
  'Biotech': 'Биотехнологии',
  'Gene Therapy': 'Генная терапия',
  'Drug Discovery': 'Drug Discovery',
  'Quantum Computing': 'Квантовые вычисления',
  'Fusion Energy': 'Термоядерная энергетика',
  'Space': 'Космос',
  'Climate Tech': 'Climate Tech',
  'Energy': 'Энергетика',
  'Fintech': 'Финтех',
  'Blockchain': 'Блокчейн',
  'Web3': 'Web3',
  'Developer Tools': 'Developer Tools',
  'Infrastructure': 'Инфраструктура',
  'API': 'API',
  'Computer Vision': 'Компьютерное зрение',
  'NLP': 'Обработка языка (NLP)',
  'Automation': 'Автоматизация',
  'AgriTech': 'AgriTech',
  'FoodTech': 'FoodTech',
  'PropTech': 'PropTech',
  'HealthTech': 'HealthTech',
  'MedTech': 'MedTech',
  'Mental Health': 'Ментальное здоровье',
  'EdTech': 'EdTech',
  'LegalTech': 'LegalTech',
  'HRTech': 'HRTech',
  'B2B SaaS': 'B2B SaaS',
  'SaaS': 'SaaS',
  'B2B': 'B2B',
  'Marketplace': 'Маркетплейс',
  'Platform': 'Платформа',
  'Open Source': 'Open Source',
  'Enterprise': 'Enterprise',
  'Consumer': 'B2C',
  'E-Commerce': 'E-Commerce',
  'Healthcare': 'Здравоохранение',
  'Education': 'Образование',
  'Legal': 'Юриспруденция',
  'HR': 'HR',
  'Recruiting': 'Рекрутинг',
  'Real Estate': 'Недвижимость',
  'ConstructionTech': 'ConstructionTech',
  'Manufacturing': 'Производство',
  'Logistics': 'Логистика',
  'Supply Chain': 'Цепочки поставок',
  'Defense': 'Оборонка',
  'Defense Tech': 'Defense Tech',
  'Government': 'Государство',
  'GovTech': 'GovTech',
  'Banking': 'Банкинг',
  'Payments': 'Платежи',
  'Crypto': 'Крипто',
  'Nuclear': 'Атомная энергетика',
  'Cybersecurity': 'Кибербезопасность',
  'Industrial': 'Промышленность',
  'Telemedicine': 'Телемедицина',
  'E-Learning': 'E-Learning',
  'Import Substitution': 'Импортозамещение',
};

function tagRu(tag: string): string {
  return TAG_RU[tag] ?? tag;
}

// ─── Tag maps (mirrored from scoring.ts) ─────────────────────────────────────
const DISRUPTION_TAGS: Record<string, number> = {
  'Artificial Intelligence': 20, 'Machine Learning': 18, 'Generative AI': 20,
  'Robotics': 18, 'Hard Tech': 17, 'Deep Tech': 17,
  'Biotech': 16, 'Gene Therapy': 16, 'Drug Discovery': 15,
  'Quantum Computing': 15, 'Fusion Energy': 15,
  'Space': 12, 'Climate Tech': 12, 'Energy': 10,
  'Fintech': 10, 'Blockchain': 8, 'Web3': 6,
  'Developer Tools': 12, 'Infrastructure': 11, 'API': 10,
  'Computer Vision': 14, 'NLP': 14, 'Automation': 13,
  'AgriTech': 12, 'FoodTech': 10, 'PropTech': 9,
  'HealthTech': 12, 'MedTech': 13, 'Mental Health': 8,
  'EdTech': 8, 'LegalTech': 9, 'HRTech': 8,
};

const SCALABILITY_TAGS: Record<string, number> = {
  'B2B SaaS': 25, 'SaaS': 22, 'B2B': 20,
  'Developer Tools': 20, 'Infrastructure': 20, 'API': 18,
  'Marketplace': 15, 'Platform': 18, 'Open Source': 16,
  'Consumer': 10, 'E-Commerce': 8, 'D2C': 7,
  'Enterprise': 18, 'SMB': 12,
  'Healthcare': 12, 'Education': 12, 'Fintech': 14,
};

const MARKET_SIZE_TAGS: Record<string, number> = {
  'Healthcare': 20, 'HealthTech': 20, 'Mental Health': 18,
  'EdTech': 18, 'Education': 18,
  'LegalTech': 18, 'Legal': 18,
  'HRTech': 17, 'HR': 17, 'Recruiting': 15,
  'PropTech': 17, 'Real Estate': 15,
  'AgriTech': 16, 'FoodTech': 14,
  'ConstructionTech': 16, 'Manufacturing': 14,
  'Logistics': 15, 'Supply Chain': 14,
  'Climate Tech': 13, 'Energy': 13,
  'B2B SaaS': 16, 'Developer Tools': 12,
  'Defense Tech': 10, 'GovTech': 12,
};

const HIGH_BARRIER_TAGS: Record<string, number> = {
  'Defense': 35, 'Defense Tech': 35,
  'Government': 25, 'GovTech': 22,
  'Fintech': 20, 'Banking': 22, 'Payments': 18,
  'Blockchain': 15, 'Crypto': 18, 'Web3': 15,
  'Healthcare': 15, 'MedTech': 15, 'Drug Discovery': 18,
  'Nuclear': 25, 'Space': 15,
};

const LOW_BARRIER_TAGS: Record<string, number> = {
  'B2B SaaS': 20, 'Developer Tools': 22, 'API': 18,
  'EdTech': 15, 'Education': 15,
  'Open Source': 25, 'Consumer': 12,
  'E-Commerce': 12, 'Marketplace': 15,
};

const RUSSIA_TIMING_TAGS: Record<string, number> = {
  'Import Substitution': 30,
  'HealthTech': 20, 'Healthcare': 18, 'Telemedicine': 22,
  'AgriTech': 20, 'FoodTech': 18,
  'EdTech': 20, 'Education': 18, 'E-Learning': 20,
  'HRTech': 18, 'HR': 16, 'Recruiting': 16,
  'LegalTech': 18, 'Legal': 16,
  'ConstructionTech': 16, 'PropTech': 15,
  'Logistics': 18, 'Supply Chain': 15,
  'Manufacturing': 16, 'Industrial': 15,
  'B2B SaaS': 15, 'Enterprise': 14,
  'Fintech': 10,
  'AI': 18, 'Artificial Intelligence': 18,
  'Cybersecurity': 20,
};

// ─── Types ────────────────────────────────────────────────────────────────────
export type ScoreLevel = 'high' | 'medium' | 'low';

export interface DimensionReport {
  label: string;
  weight: string;
  score: number;
  level: ScoreLevel;
  levelLabel: string;
  summary: string;
  signals: { text: string; positive: boolean }[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function level(score: number): ScoreLevel {
  if (score >= 65) return 'high';
  if (score >= 35) return 'medium';
  return 'low';
}

function levelLabel(l: ScoreLevel): string {
  return l === 'high' ? 'Высокий' : l === 'medium' ? 'Средний' : 'Низкий';
}

function matchedTagsSorted(allTags: string[], map: Record<string, number>): string[] {
  return allTags
    .filter(t => (map[t] ?? 0) > 0)
    .sort((a, b) => (map[b] ?? 0) - (map[a] ?? 0));
}

function batchLabel(batch?: string): string | null {
  if (!batch) return null;
  const year = parseInt(batch.slice(1), 10);
  if (isNaN(year)) return null;
  const fullYear = year > 50 ? 1900 + year : 2000 + year;
  const diff = new Date().getFullYear() - fullYear;
  if (diff === 0) return `очень свежий батч ${batch} — максимальный сигнал активности`;
  if (diff === 1) return `недавний батч ${batch} — хороший сигнал активности`;
  if (diff <= 3) return `батч ${batch} — умеренно свежий`;
  return `батч ${batch} — достаточно старый, рост неочевиден`;
}

// ─── Dimension: Disruption ────────────────────────────────────────────────────
function explainDisruption(allTags: string[], score: number): DimensionReport {
  const matched = matchedTagsSorted(allTags, DISRUPTION_TAGS);
  const lv = level(score);
  const signals: { text: string; positive: boolean }[] = [];

  const aiTags = matched.filter(t => ['Artificial Intelligence', 'Machine Learning', 'Generative AI', 'Computer Vision', 'NLP'].includes(t));
  const deepTags = matched.filter(t => ['Hard Tech', 'Deep Tech', 'Quantum Computing', 'Fusion Energy', 'Robotics', 'Biotech'].includes(t));
  const autoTags = matched.filter(t => ['Automation', 'Infrastructure', 'Developer Tools', 'API'].includes(t));

  if (aiTags.length > 0) {
    signals.push({ text: `Применяет ${aiTags.map(tagRu).join(', ')} — наиболее дизруптивный технологический стек`, positive: true });
  }
  if (deepTags.length > 0) {
    signals.push({ text: `Работает в области ${deepTags.map(tagRu).join(', ')} — устойчивое технологическое преимущество`, positive: true });
  }
  if (autoTags.length > 0) {
    signals.push({ text: `Автоматизация через ${autoTags.map(tagRu).join(', ')} — снижение операционных затрат`, positive: true });
  }

  const remaining = matched.filter(t => !aiTags.includes(t) && !deepTags.includes(t) && !autoTags.includes(t));
  if (remaining.length > 0) {
    signals.push({ text: `Дополнительные технологические сигналы: ${remaining.map(tagRu).join(', ')}`, positive: true });
  }

  if (matched.length === 0) {
    signals.push({ text: 'Дизруптивные технологические теги не обнаружены — продукт не меняет правил игры кардинально', positive: false });
  }

  const summaries: Record<ScoreLevel, string> = {
    high: 'Сильный технологический дизрапт — продукт делает что-то в разы лучше или дешевле существующих решений.',
    medium: 'Умеренный дизрапт — есть технологическая новизна, но не кардинальная смена правил рынка.',
    low: 'Слабый дизруптивный потенциал — скорее улучшение существующего, чем революционное изменение.',
  };

  return {
    label: 'Дизрапт эффективности',
    weight: '25%',
    score,
    level: lv,
    levelLabel: levelLabel(lv),
    summary: summaries[lv],
    signals,
  };
}

// ─── Dimension: Scalability ───────────────────────────────────────────────────
function explainScalability(allTags: string[], score: number): DimensionReport {
  const matched = matchedTagsSorted(allTags, SCALABILITY_TAGS);
  const lv = level(score);
  const signals: { text: string; positive: boolean }[] = [];

  if (matched.includes('B2B SaaS') || matched.includes('SaaS')) {
    signals.push({ text: 'SaaS-модель — предельные затраты на каждого нового клиента близки к нулю', positive: true });
  }
  if (matched.includes('Marketplace') || matched.includes('Platform')) {
    const t = matched.filter(x => ['Marketplace', 'Platform'].includes(x)).map(tagRu).join(', ');
    signals.push({ text: `${t} — сетевой эффект ускоряет рост без пропорциональных затрат`, positive: true });
  }
  if (matched.includes('API') || matched.includes('Developer Tools') || matched.includes('Infrastructure')) {
    const t = matched.filter(x => ['API', 'Developer Tools', 'Infrastructure'].includes(x)).map(tagRu).join(', ');
    signals.push({ text: `${t} — органическая интеграция в другие продукты, developer-led growth`, positive: true });
  }
  if (matched.includes('Open Source')) {
    signals.push({ text: 'Open Source ядро + коммерческая надстройка — классическая высокомаржинальная модель', positive: true });
  }
  if (matched.includes('Enterprise')) {
    signals.push({ text: 'Enterprise-сегмент — высокий LTV, низкий churn при правильном продукте', positive: true });
  }
  if (matched.includes('Consumer') || matched.includes('E-Commerce')) {
    signals.push({ text: 'B2C/e-commerce модель — масштабируется, но требует высоких маркетинговых расходов', positive: false });
  }

  if (matched.length === 0) {
    signals.push({ text: 'Бизнес-модель не предполагает высокой масштабируемости без пропорционального роста затрат', positive: false });
  }

  const summaries: Record<ScoreLevel, string> = {
    high: 'Высокомасштабируемая модель — рост выручки не требует пропорционального увеличения затрат.',
    medium: 'Умеренная масштабируемость — есть потенциал роста, но без эффекта полностью цифрового SaaS.',
    low: 'Бизнес-модель ограниченно масштабируется — каждый новый клиент требует значительных операционных затрат.',
  };

  return {
    label: 'Масштабируемость',
    weight: '20%',
    score,
    level: lv,
    levelLabel: levelLabel(lv),
    summary: summaries[lv],
    signals,
  };
}

// ─── Dimension: Market Size ───────────────────────────────────────────────────
function explainMarketSize(allTags: string[], score: number): DimensionReport {
  const matched = matchedTagsSorted(allTags, MARKET_SIZE_TAGS);
  const lv = level(score);
  const signals: { text: string; positive: boolean }[] = [];

  const verticals = matched.filter(t =>
    ['Healthcare', 'HealthTech', 'EdTech', 'Education', 'LegalTech', 'Legal',
     'HRTech', 'HR', 'Recruiting', 'PropTech', 'Real Estate', 'AgriTech',
     'ConstructionTech', 'Manufacturing', 'Logistics', 'Supply Chain', 'GovTech'].includes(t)
  );

  if (verticals.length > 0) {
    signals.push({
      text: `Вертикальный рынок: ${verticals.map(tagRu).join(', ')} — достаточно большой для регионального игрока, слишком специфичный для BigTech`,
      positive: true,
    });
  }

  if (matched.includes('B2B SaaS') || matched.includes('Developer Tools')) {
    signals.push({ text: 'B2B инструменты — BigTech редко строит специализированные решения для бизнеса в таких нишах', positive: true });
  }

  if (matched.includes('Defense Tech') || matched.includes('GovTech')) {
    signals.push({ text: 'Государственный/оборонный сектор — локальный рынок с высокими барьерами входа для глобальных игроков', positive: true });
  }

  if (matched.includes('Climate Tech') || matched.includes('Energy')) {
    signals.push({ text: 'Энергетика/Climate Tech — растущий рынок с умеренной конкуренцией со стороны BigTech', positive: true });
  }

  if (matched.length === 0) {
    signals.push({ text: 'Стартап работает на горизонтальном или нишевом рынке без явного "правильного" размера для стратегии аналога в РФ', positive: false });
  }

  const summaries: Record<ScoreLevel, string> = {
    high: 'Оптимальный размер рынка — достаточно большой для построения серьёзного бизнеса в России, но слишком специфичный для доминирования Яндекса или Mail.',
    medium: 'Рынок приемлемого размера, но либо слишком горизонтальный (риск конкуренции с BigTech), либо слишком нишевый.',
    low: 'Рынок либо слишком мал для полноценного бизнеса в России, либо уже занят крупными игроками.',
  };

  return {
    label: 'Размер рынка',
    weight: '20%',
    score,
    level: lv,
    levelLabel: levelLabel(lv),
    summary: summaries[lv],
    signals,
  };
}

// ─── Dimension: Traction ──────────────────────────────────────────────────────
function explainTraction(startup: Startup, score: number): DimensionReport {
  const lv = level(score);
  const signals: { text: string; positive: boolean }[] = [];

  // YC batch
  const bl = batchLabel(startup.batch ?? undefined);
  if (bl) {
    signals.push({ text: `YC ${bl}`, positive: !bl.includes('старый') });
  }

  // Team size
  if (startup.teamSize) {
    if (startup.teamSize >= 50) {
      signals.push({ text: `Команда ${startup.teamSize} чел. — крупная, признак серьёзного роста`, positive: true });
    } else if (startup.teamSize >= 20) {
      signals.push({ text: `Команда ${startup.teamSize} чел. — масштабируется`, positive: true });
    } else if (startup.teamSize >= 10) {
      signals.push({ text: `Команда ${startup.teamSize} чел. — умеренный рост`, positive: true });
    } else {
      signals.push({ text: `Команда ${startup.teamSize} чел. — ранняя стадия`, positive: false });
    }
  }

  // Product Hunt votes
  if (startup.votesCount) {
    if (startup.votesCount >= 1000) {
      signals.push({ text: `▲ ${startup.votesCount.toLocaleString('ru')} голосов на Product Hunt — вирусный запуск`, positive: true });
    } else if (startup.votesCount >= 500) {
      signals.push({ text: `▲ ${startup.votesCount.toLocaleString('ru')} голосов на Product Hunt — сильный интерес`, positive: true });
    } else if (startup.votesCount >= 200) {
      signals.push({ text: `▲ ${startup.votesCount.toLocaleString('ru')} голосов на Product Hunt — хороший показатель`, positive: true });
    } else {
      signals.push({ text: `▲ ${startup.votesCount.toLocaleString('ru')} голосов на Product Hunt — умеренный интерес`, positive: false });
    }
  }

  // Funding stage
  if (startup.fundingStage) {
    const stageComments: Record<string, { text: string; positive: boolean }> = {
      'Pre-Seed': { text: 'Стадия Pre-Seed — только начинает', positive: false },
      'Seed': { text: 'Стадия Seed — есть первые инвестиции, идея проверяется', positive: true },
      'Angel': { text: 'Angel-раунд — ранняя стадия с поддержкой частных инвесторов', positive: true },
      'Series A': { text: 'Series A — подтверждённая бизнес-модель, масштабирование', positive: true },
      'Series B': { text: 'Series B — активная экспансия, высокий интерес рынка', positive: true },
      'Series C': { text: 'Series C и выше — зрелый рост, проверенная модель', positive: true },
      'Late Stage': { text: 'Поздняя стадия — устоявшийся бизнес с высоким трекшном', positive: true },
      'IPO': { text: 'IPO или около него — максимальная зрелость и трекшн', positive: true },
    };
    const comment = stageComments[startup.fundingStage];
    if (comment) {
      signals.push(comment);
    }
  }

  // Funding amount
  if (startup.fundingTotal && startup.fundingTotal > 0) {
    const m = (startup.fundingTotal / 1e6).toFixed(1);
    if (startup.fundingTotal >= 50e6) {
      signals.push({ text: `Привлечено $${m}M — значительные инвестиции, подтверждающие потенциал`, positive: true });
    } else if (startup.fundingTotal >= 10e6) {
      signals.push({ text: `Привлечено $${m}M — серьёзные инвестиции`, positive: true });
    } else if (startup.fundingTotal >= 1e6) {
      signals.push({ text: `Привлечено $${m}M — начальное финансирование получено`, positive: true });
    }
  }

  if (signals.length === 0) {
    signals.push({ text: 'Публичных данных о трекшне (YC-батч, голоса PH, инвестиции) не обнаружено', positive: false });
  }

  const summaries: Record<ScoreLevel, string> = {
    high: 'Сильный рыночный трекшн — есть чёткие признаки, что продукт работает и рынок платит.',
    medium: 'Умеренный трекшн — некоторые позитивные сигналы есть, но не хватает публичных метрик роста.',
    low: 'Слабые или отсутствующие публичные признаки трекшна — риск, что спрос не подтверждён.',
  };

  return {
    label: 'Трекшн',
    weight: '15%',
    score,
    level: lv,
    levelLabel: levelLabel(lv),
    summary: summaries[lv],
    signals,
  };
}

// ─── Dimension: Russia Barriers ───────────────────────────────────────────────
function explainRussiaBarriers(startup: Startup, allTags: string[], score: number): DimensionReport {
  const lv = level(score);
  const signals: { text: string; positive: boolean }[] = [];

  const highBarrier = matchedTagsSorted(allTags, HIGH_BARRIER_TAGS);
  const lowBarrier = matchedTagsSorted(allTags, LOW_BARRIER_TAGS);

  if (highBarrier.includes('Defense') || highBarrier.includes('Defense Tech')) {
    signals.push({ text: 'Оборонная сфера — иностранные компании практически заблокированы санкциями и регулированием', positive: true });
  }
  if (highBarrier.includes('Government') || highBarrier.includes('GovTech')) {
    signals.push({ text: 'Гостех — государственные закупки закрыты для иностранных участников', positive: true });
  }
  if (highBarrier.includes('Fintech') || highBarrier.includes('Banking') || highBarrier.includes('Payments')) {
    const t = highBarrier.filter(x => ['Fintech', 'Banking', 'Payments'].includes(x)).map(tagRu).join(', ');
    signals.push({ text: `${t} — платёжная инфраструктура (SWIFT, Stripe, Visa) недоступна в России`, positive: true });
  }
  if (highBarrier.includes('Healthcare') || highBarrier.includes('MedTech')) {
    signals.push({ text: 'Здравоохранение — регуляторные требования к сертификации и хранению медданных в РФ', positive: true });
  }
  if (highBarrier.includes('Crypto') || highBarrier.includes('Blockchain') || highBarrier.includes('Web3')) {
    signals.push({ text: 'Крипто/Блокчейн — регуляторные ограничения в обе стороны', positive: true });
  }

  if (lowBarrier.includes('Open Source')) {
    signals.push({ text: 'Open Source продукт — любой может задеплоить самостоятельно без западного вендора', positive: false });
  }
  if (lowBarrier.includes('Developer Tools') || lowBarrier.includes('API')) {
    const t = lowBarrier.filter(x => ['Developer Tools', 'API'].includes(x)).map(tagRu).join(', ');
    signals.push({ text: `${t} — технические инструменты обычно не имеют санкционных ограничений`, positive: false });
  }
  if (lowBarrier.includes('Marketplace') || lowBarrier.includes('E-Commerce')) {
    signals.push({ text: 'Маркетплейс/e-commerce — при желании может работать без российской прописки', positive: false });
  }
  if (lowBarrier.includes('EdTech') || lowBarrier.includes('Education')) {
    signals.push({ text: 'EdTech — онлайн-образование легко доступно без локального присутствия', positive: false });
  }

  // Geo bonus
  const usLocs = (startup.locations ?? []).filter(l =>
    /usa|united states|san francisco|new york|silicon valley/i.test(l)
  );
  if (usLocs.length > 0) {
    signals.push({ text: `Компания из США — усиленный санкционный режим для американских технологических компаний`, positive: true });
  }

  if (signals.length === 0) {
    signals.push({ text: 'Нет явных сигналов ни о барьерах, ни о лёгком доступе западных конкурентов', positive: false });
  }

  const summaries: Record<ScoreLevel, string> = {
    high: 'Западный оригинал столкнётся с серьёзными барьерами в России — санкции, регулирование или платёжная инфраструктура делают его выход маловероятным.',
    medium: 'Умеренные барьеры — западный конкурент может зайти, но с трудностями. Важно скорость и локализация.',
    low: 'Барьеры для западного конкурента невысоки — он может зайти в Россию без особых препятствий. Нужно торопиться или искать другое преимущество.',
  };

  return {
    label: 'Барьеры для западных конкурентов',
    weight: '10%',
    score,
    level: lv,
    levelLabel: levelLabel(lv),
    summary: summaries[lv],
    signals,
  };
}

// ─── Dimension: Russia Timing ─────────────────────────────────────────────────
function explainTimingRussia(allTags: string[], score: number): DimensionReport {
  const matched = matchedTagsSorted(allTags, RUSSIA_TIMING_TAGS);
  const lv = level(score);
  const signals: { text: string; positive: boolean }[] = [];

  if (matched.includes('Import Substitution')) {
    signals.push({ text: 'Прямое импортозамещение — максимальная актуальность для российского рынка после 2022', positive: true });
  }
  if (matched.includes('Cybersecurity')) {
    signals.push({ text: 'Кибербезопасность — один из топ-приоритетов РФ после отключения западных решений', positive: true });
  }
  if (matched.includes('HealthTech') || matched.includes('Healthcare') || matched.includes('Telemedicine')) {
    signals.push({ text: 'HealthTech/медицина — государственный приоритет, ушли западные медицинские платформы', positive: true });
  }
  if (matched.includes('EdTech') || matched.includes('Education') || matched.includes('E-Learning')) {
    signals.push({ text: 'EdTech — активная господдержка, ушли Coursera, LinkedIn Learning и другие', positive: true });
  }
  if (matched.includes('HRTech') || matched.includes('HR') || matched.includes('Recruiting')) {
    signals.push({ text: 'HRTech/рекрутинг — острый дефицит кадров в России делает этот рынок горячим', positive: true });
  }
  if (matched.includes('LegalTech') || matched.includes('Legal')) {
    signals.push({ text: 'LegalTech — ушли западные юридические платформы, специфика российского права', positive: true });
  }
  if (matched.includes('AgriTech') || matched.includes('FoodTech')) {
    signals.push({ text: 'AgriTech/FoodTech — продовольственная безопасность в приоритете, западные решения ушли', positive: true });
  }
  if (matched.includes('Logistics') || matched.includes('Supply Chain')) {
    signals.push({ text: 'Логистика — перестройка цепочек поставок после санкций открыла новый спрос', positive: true });
  }
  if (matched.includes('Manufacturing') || matched.includes('Industrial')) {
    signals.push({ text: 'Производство/промышленность — замещение SAP, Siemens и других промышленных платформ', positive: true });
  }
  if (matched.includes('Artificial Intelligence') || matched.includes('AI')) {
    signals.push({ text: 'AI — государственная стратегия развития ИИ, высокий спрос на отечественные решения', positive: true });
  }
  if (matched.includes('B2B SaaS') || matched.includes('Enterprise')) {
    signals.push({ text: 'B2B/Enterprise SaaS — массовый уход западных вендоров (Salesforce, Oracle, SAP) создал вакуум', positive: true });
  }
  if (matched.includes('Fintech')) {
    signals.push({ text: 'Финтех — отрезанность от SWIFT создала спрос, но сам сектор под ограничениями', positive: true });
  }

  if (matched.length === 0) {
    signals.push({ text: 'Ниша не входит в число приоритетных для импортозамещения в РФ на текущем этапе', positive: false });
  }

  const summaries: Record<ScoreLevel, string> = {
    high: 'Актуальная для России прямо сейчас ниша — спрос пиковый, западные игроки ушли, государство поддерживает.',
    medium: 'Умеренная актуальность — ниша интересна, но не входит в число первоочередных приоритетов импортозамещения.',
    low: 'Ниша пока не в фокусе российского рынка — либо конкуренция уже сильная, либо спрос не сформировался.',
  };

  return {
    label: 'Тайминг для России',
    weight: '10%',
    score,
    level: lv,
    levelLabel: levelLabel(lv),
    summary: summaries[lv],
    signals,
  };
}

// ─── Actionable next steps by profile ────────────────────────────────────────
function buildActionPlan(startup: Startup, tags: string[]): string[] {
  const actions: string[] = [];
  const barriers  = startup.scoreRussiaBarriers  ?? 0;
  const timing    = startup.scoreTimingRussia    ?? 0;
  const traction  = startup.scoreTraction        ?? 0;
  const disruption = startup.scoreDisruption     ?? 0;
  const total     = startup.scoreTotal           ?? 0;

  // First action always — check if Russian analogues already exist
  actions.push('Проверить существующих игроков в России: поиск в vc.ru, Rusbase, Сбер500, ФРИИ по ключевым словам из ниши');

  if (traction >= 50) {
    actions.push('Изучить публичные кейсы и отзывы клиентов оригинала — понять реальную ценность для пользователей, а не маркетинг');
  }

  if (disruption >= 60) {
    actions.push('Оценить техническую воспроизводимость: есть ли open-source аналоги компонентов? Нужны ли уникальные датасеты или специалисты?');
  }

  if (barriers >= 60) {
    actions.push('Провести интервью с 5–10 потенциальными B2B-клиентами в России — подтвердить, что западный оригинал им недоступен и они ищут замену');
  }

  if (timing >= 50) {
    actions.push('Изучить программы государственного финансирования (Сколково, РФРИТ, Фонд Бортника) — ниша может попасть под гранты на импортозамещение');
  }

  if (total >= 60 && barriers >= 40) {
    actions.push('Оценить команду: нужны ли редкие специалисты (ML-инженеры, регуляторные эксперты) — это может быть критическим ограничением');
  }

  if (tags.some(t => ['Fintech', 'Banking', 'Healthcare', 'MedTech', 'Defense', 'GovTech'].includes(t))) {
    actions.push('Проконсультироваться с юристом по регуляторным требованиям в данной отрасли — лицензии, сертификации, требования к данным');
  }

  // Risk flags
  if (barriers < 40) {
    actions.push('⚠ Риск: западный оригинал или его open-source версия теоретически доступны — нужно найти уникальное преимущество российского продукта (локализация, интеграции, поддержка)');
  }
  if (traction < 30) {
    actions.push('⚠ Риск: у оригинала слабый трекшн — возможно, проблема не достаточно острая. Нужна дополнительная валидация спроса перед инвестированием в разработку');
  }

  return actions;
}

// ─── Main export ──────────────────────────────────────────────────────────────
export interface ScoreReport {
  verdict: string;
  verdictColor: 'green' | 'yellow' | 'orange' | 'red';
  recommendation: string;
  actionPlan: string[];
  dimensions: DimensionReport[];
}

export function generateScoreReport(startup: Startup): ScoreReport {
  const tags = [...(startup.tags ?? []), ...(startup.industries ?? [])] as string[];
  const total     = startup.scoreTotal           ?? 0;
  const barriers  = startup.scoreRussiaBarriers  ?? 0;
  const timing    = startup.scoreTimingRussia    ?? 0;

  let verdict: string;
  let verdictColor: ScoreReport['verdictColor'];
  let recommendation: string;

  if (total >= 60 && barriers >= 40) {
    verdict = 'Приоритетная ниша для аналога в России';
    verdictColor = 'green';
    recommendation = `Высокий потенциал: западный оригинал не зайдёт в Россию, ниша ${timing >= 50 ? 'горячая прямо сейчас' : 'перспективная'}. Рекомендуется перейти к активной фазе — интервью с клиентами и технический анализ.`;
  } else if (total >= 60) {
    verdict = 'Сильная идея, барьеры умеренные';
    verdictColor = 'yellow';
    recommendation = 'Идея доказана рынком, но западный конкурент теоретически может зайти. Ключевой вопрос: есть ли у российского продукта уникальные преимущества — интеграции с локальными системами, знание регулирования, скорость поддержки?';
  } else if (total >= 45 && barriers >= 40) {
    verdict = 'Интересная ниша с хорошими барьерами';
    verdictColor = 'yellow';
    recommendation = 'Барьеры для западного конкурента высокие, но сам стартап пока не показал сильного трекшна или дизрапт-эффекта. Стоит следить за развитием оригинала и проверить российский спрос.';
  } else if (total >= 40) {
    verdict = 'Средний потенциал — требует уточнения';
    verdictColor = 'orange';
    recommendation = 'Ниша интересная, но недостаточно сигналов для уверенного решения. Рекомендуется провести 5–7 интервью с потенциальными клиентами в России прежде чем инвестировать время.';
  } else {
    verdict = 'Низкий приоритет на текущий момент';
    verdictColor = 'red';
    recommendation = 'Либо западный оригинал легко доступен в России, либо ниша слишком мала/неактуальна. Можно вернуться к этой теме через 6–12 месяцев, если ситуация изменится.';
  }

  return {
    verdict,
    verdictColor,
    recommendation,
    actionPlan: buildActionPlan(startup, tags),
    dimensions: [
      explainDisruption(tags, startup.scoreDisruption ?? 0),
      explainScalability(tags, startup.scoreScalability ?? 0),
      explainMarketSize(tags, startup.scoreMarketSize ?? 0),
      explainTraction(startup, startup.scoreTraction ?? 0),
      explainRussiaBarriers(startup, tags, startup.scoreRussiaBarriers ?? 0),
      explainTimingRussia(tags, startup.scoreTimingRussia ?? 0),
    ],
  };
}
