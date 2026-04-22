import researchData from './research.json';

export interface StartupResearch {
  name: string;
  tagline?: string;
  score?: number;
  site?: string;
  industry?: string;
  problem?: string;
  solution?: string;
  problem_rf?: string;
  solution_rf?: string;
  barriers?: string;
  market_size?: string;
  market_players?: string;
  strategy?: string;
}

const data = researchData as Record<string, StartupResearch>;

export function getResearch(startupName: string): StartupResearch | null {
  // Exact match
  if (data[startupName]) return data[startupName];

  // Case-insensitive match
  const nameLower = startupName.toLowerCase();
  for (const [key, val] of Object.entries(data)) {
    if (key.toLowerCase() === nameLower) return val;
  }

  // Partial match: DB name starts with research name or vice versa
  for (const [key, val] of Object.entries(data)) {
    const kl = key.toLowerCase().replace(/[,.\s]+/g, '');
    const nl = nameLower.replace(/[,.\s]+/g, '');
    if (kl === nl || kl.startsWith(nl) || nl.startsWith(kl)) return val;
  }

  return null;
}

export function hasResearch(startupName: string): boolean {
  const r = getResearch(startupName);
  if (!r) return false;
  // Only count as "has research" if there's actual content, not just metadata
  return !!(r.problem || r.solution || r.problem_rf || r.solution_rf || r.barriers);
}
