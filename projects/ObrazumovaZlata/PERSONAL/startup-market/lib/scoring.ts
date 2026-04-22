/**
 * Scoring algorithm for startup relevance to Russian market
 * Total score: 0–100 (weighted sum of 6 dimensions)
 */

export interface ScoringInput {
  tags: string[];
  industries: string[];
  teamSize?: number;
  fundingTotal?: number;
  fundingStage?: string;
  votesCount?: number;
  weeklyRank?: number;
  foundedYear?: number;
  locations?: string[];
  batch?: string; // YC batch e.g. 'W25'
  description?: string;
  status?: string;
}

export interface ScoreResult {
  total: number;
  disruption: number;
  scalability: number;
  marketSize: number;
  traction: number;
  russiaBarriers: number; // 100 = нет барьеров, 0 = максимальные барьеры
  timingRussia: number;   // насколько идея актуальна для России прямо сейчас
}

// ─── Weights (must sum to 1.0) ───────────────────────────────────────────────
const WEIGHTS = {
  disruption:     0.25, // Дизрапт эффективности
  scalability:    0.20, // Масштабируемость
  marketSize:     0.20, // Рынок: большой для нас, маленький для Googlе
  traction:       0.15, // Трекшн и интерес рынка
  russiaBarriers: 0.10, // Барьеры для западных аналогов в РФ
  timingRussia:   0.10, // Тайминг и актуальность для РФ прямо сейчас
};

// ─── Disruptive technology tags ──────────────────────────────────────────────
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

// ─── Scalable business models ─────────────────────────────────────────────────
const SCALABILITY_TAGS: Record<string, number> = {
  'B2B SaaS': 25, 'SaaS': 22, 'B2B': 20,
  'Developer Tools': 20, 'Infrastructure': 20, 'API': 18,
  'Marketplace': 15, 'Platform': 18, 'Open Source': 16,
  'Consumer': 10, 'E-Commerce': 8, 'D2C': 7,
  'Enterprise': 18, 'SMB': 12,
  'Healthcare': 12, 'Education': 12, 'Fintech': 14,
};

// ─── Medium-sized markets (not dominated by Big Tech) ─────────────────────────
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

// ─── Russia-specific barrier scoring ─────────────────────────────────────────
// Высокий балл = мало барьеров = хорошо для нас (западные конкуренты не придут)
const HIGH_BARRIER_TAGS: Record<string, number> = {
  // Санкционные/регуляторные барьеры (высокий скор = много барьеров)
  'Defense': 35, 'Defense Tech': 35,
  'Government': 25, 'GovTech': 22,
  'Fintech': 20, 'Banking': 22, 'Payments': 18,
  'Blockchain': 15, 'Crypto': 18, 'Web3': 15,
  'Healthcare': 15, 'MedTech': 15, 'Drug Discovery': 18,
  'Nuclear': 25, 'Space': 15,
};
const LOW_BARRIER_TAGS: Record<string, number> = {
  // Эти технологии легко проникают = нам нужно быстро строить аналог
  'B2B SaaS': 20, 'Developer Tools': 22, 'API': 18,
  'EdTech': 15, 'Education': 15,
  'Open Source': 25, 'Consumer': 12,
  'E-Commerce': 12, 'Marketplace': 15,
};

// ─── Russia timing tags (актуальные ниши прямо сейчас) ───────────────────────
const RUSSIA_TIMING_TAGS: Record<string, number> = {
  'Import Substitution': 30, // прямо в тему
  'HealthTech': 20, 'Healthcare': 18, 'Telemedicine': 22,
  'AgriTech': 20, 'FoodTech': 18,
  'EdTech': 20, 'Education': 18, 'E-Learning': 20,
  'HRTech': 18, 'HR': 16, 'Recruiting': 16,
  'LegalTech': 18, 'Legal': 16,
  'ConstructionTech': 16, 'PropTech': 15,
  'Logistics': 18, 'Supply Chain': 15,
  'Manufacturing': 16, 'Industrial': 15,
  'B2B SaaS': 15, 'Enterprise': 14,
  'Fintech': 10, // барьеры есть, но ниша огромная
  'AI': 18, 'Artificial Intelligence': 18,
  'Cybersecurity': 20,
};

// ─── Helper: lookup score from tag map ───────────────────────────────────────
function tagScore(
  tags: string[],
  scoreMap: Record<string, number>,
  maxScore = 100,
): number {
  let score = 0;
  for (const tag of tags) {
    score += scoreMap[tag] ?? 0;
  }
  return Math.min(score, maxScore);
}

// ─── YC batch recency score ───────────────────────────────────────────────────
function batchScore(batch?: string): number {
  if (!batch) return 0;
  const year = parseInt(batch.slice(1), 10); // 'W25' → 25
  const season = batch[0]; // 'W' or 'S'
  if (isNaN(year)) return 0;
  const fullYear = year > 50 ? 1900 + year : 2000 + year;
  const currentYear = new Date().getFullYear();
  const diff = currentYear - fullYear;
  if (diff === 0) return season === 'W' ? 30 : 25;
  if (diff === 1) return season === 'W' ? 20 : 15;
  if (diff <= 3) return 10;
  return 5;
}

// ─── DISRUPTION SCORE (0–100) ──────────────────────────────────────────────
function computeDisruption(input: ScoringInput): number {
  return tagScore([...input.tags, ...input.industries], DISRUPTION_TAGS, 100);
}

// ─── SCALABILITY SCORE (0–100) ────────────────────────────────────────────────
function computeScalability(input: ScoringInput): number {
  return tagScore([...input.tags, ...input.industries], SCALABILITY_TAGS, 100);
}

// ─── MARKET SIZE SCORE (0–100) ────────────────────────────────────────────────
function computeMarketSize(input: ScoringInput): number {
  return tagScore([...input.tags, ...input.industries], MARKET_SIZE_TAGS, 100);
}

// ─── TRACTION SCORE (0–100) ───────────────────────────────────────────────────
function computeTraction(input: ScoringInput): number {
  let score = 0;

  // YC: batch recency
  score += batchScore(input.batch);

  // YC: team size growth signal
  if (input.teamSize) {
    if (input.teamSize >= 50) score += 20;
    else if (input.teamSize >= 20) score += 15;
    else if (input.teamSize >= 10) score += 10;
    else if (input.teamSize >= 3) score += 5;
  }

  // Product Hunt: votes
  if (input.votesCount) {
    if (input.votesCount >= 1000) score += 25;
    else if (input.votesCount >= 500) score += 20;
    else if (input.votesCount >= 200) score += 15;
    else if (input.votesCount >= 100) score += 10;
    else score += 5;
  }

  // Crunchbase: funding stage
  if (input.fundingStage) {
    const stageScores: Record<string, number> = {
      'Seed': 10, 'Pre-Seed': 8, 'Angel': 6,
      'Series A': 20, 'Series B': 28, 'Series C': 32,
      'Series D+': 35, 'Late Stage': 35, 'IPO': 40,
    };
    score += stageScores[input.fundingStage] ?? 0;
  }

  // Active status bonus
  if (input.status === 'Active') score += 5;

  return Math.min(score, 100);
}

// ─── RUSSIA BARRIERS SCORE (0–100, higher = fewer barriers = better for us) ──
function computeRussiaBarriers(input: ScoringInput): number {
  const allTags = [...input.tags, ...input.industries];

  // Post-2022 baseline: ALL Western companies face baseline barriers (sanctions,
  // payment infrastructure, data localization). Start at 35 instead of 0.
  let barriers = 35;

  for (const tag of allTags) {
    barriers += HIGH_BARRIER_TAGS[tag] ?? 0;
    // LOW_BARRIER_TAGS reduce the score but floor is 20 — even "easy" products
    // still face payment/legal/infra barriers in Russia post-2022
    barriers -= Math.min(LOW_BARRIER_TAGS[tag] ?? 0, 10);
  }

  // US/Western geo = more barriers (OFAC sanctions apply directly)
  const usLocations = input.locations?.filter(l =>
    /usa|united states|san francisco|new york|silicon valley|boston|seattle/i.test(l)
  ) ?? [];
  barriers += usLocations.length * 8;

  return Math.max(20, Math.min(100, barriers));
}

// ─── TIMING RUSSIA SCORE (0–100) ──────────────────────────────────────────────
function computeTimingRussia(input: ScoringInput): number {
  return tagScore([...input.tags, ...input.industries], RUSSIA_TIMING_TAGS, 100);
}

// ─── MAIN SCORE FUNCTION ──────────────────────────────────────────────────────
export function computeScore(input: ScoringInput): ScoreResult {
  const disruption    = computeDisruption(input);
  const scalability   = computeScalability(input);
  const marketSize    = computeMarketSize(input);
  const traction      = computeTraction(input);
  const russiaBarriers = computeRussiaBarriers(input);
  const timingRussia  = computeTimingRussia(input);

  const total =
    disruption     * WEIGHTS.disruption +
    scalability    * WEIGHTS.scalability +
    marketSize     * WEIGHTS.marketSize +
    traction       * WEIGHTS.traction +
    russiaBarriers * WEIGHTS.russiaBarriers +
    timingRussia   * WEIGHTS.timingRussia;

  return {
    total: Math.round(total * 10) / 10,
    disruption:     Math.round(disruption),
    scalability:    Math.round(scalability),
    marketSize:     Math.round(marketSize),
    traction:       Math.round(traction),
    russiaBarriers: Math.round(russiaBarriers),
    timingRussia:   Math.round(timingRussia),
  };
}

// ─── Score label helper ───────────────────────────────────────────────────────
export function scoreLabel(score: number): string {
  if (score >= 70) return 'Высокий';
  if (score >= 45) return 'Средний';
  return 'Низкий';
}

export function scoreColor(score: number): string {
  if (score >= 70) return 'text-green-600';
  if (score >= 45) return 'text-yellow-600';
  return 'text-red-500';
}
