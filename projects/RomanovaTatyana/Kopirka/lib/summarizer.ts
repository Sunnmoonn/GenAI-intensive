/**
 * Extractive summariser — no LLM key required.
 *
 * Algorithm:
 *  1. Split text into sentences.
 *  2. Score each sentence by average word frequency (minus stop-words),
 *     with a position boost for the first two sentences.
 *  3. Return the top N sentences in their original order as bullet points.
 *
 * To swap in an LLM later, replace this function's body with an API call
 * and keep the same signature: (text: string) => Promise<string> | string.
 */

const STOP_WORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','for','of','with',
  'by','from','is','was','are','were','be','been','being','have','has',
  'had','do','does','did','will','would','could','should','may','might',
  'this','that','these','those','it','its','you','your','we','our',
  'they','their','he','she','his','her','not','as','if','so','when',
  'where','what','which','who','how','all','also','can','just','than',
  'then','into','about','over','after','before','some','such','more',
  'very','even','only','both','each','other','than','too','up','down',
]);

export function generateSummary(text: string, sentenceCount = 5): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length < 80) return cleaned;

  const sentences = splitSentences(cleaned).filter(
    (s) => s.length > 30 && s.length < 600 && !isCitationNoise(s),
  );

  if (sentences.length === 0) return cleaned.slice(0, 500);
  if (sentences.length <= sentenceCount) return sentences.join(' ');

  // Word frequency across all sentences
  const freq: Record<string, number> = {};
  for (const sentence of sentences) {
    for (const word of tokenise(sentence)) {
      freq[word] = (freq[word] ?? 0) + 1;
    }
  }

  // Score + position boost
  const scored = sentences.map((sentence, index) => {
    const words = tokenise(sentence);
    const wordScore =
      words.length > 0
        ? words.reduce((sum, w) => sum + (freq[w] ?? 0), 0) / words.length
        : 0;
    const posBoost = index === 0 ? 1.8 : index === 1 ? 1.4 : 1.0;
    return { sentence, score: wordScore * posBoost, index };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, sentenceCount)
    .sort((a, b) => a.index - b.index)
    .map((s) => `• ${s.sentence}`)
    .join('\n\n');
}

function splitSentences(text: string): string[] {
  // Split on sentence-ending punctuation followed by optional whitespace + capital.
  // \s* (not \s+) handles cases where a heading runs directly into the preceding sentence.
  // The 30-char minimum in the caller already filters out accidental 2-letter fragments.
  return text
    .split(/(?<=[.!?])\s*(?=[A-Z"'])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function tokenise(text: string): string[] {
  return text
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));
}

/** Filter out noisy sentences: citations, footnotes, code snippets. */
function isCitationNoise(s: string): boolean {
  // Bibliographic / citation patterns
  if (/Retrieved \d{4}/i.test(s)) return true;
  if (/^\^/.test(s.trimStart())) return true;
  if (/\b(doi|isbn|issn|pmid|arxiv):/i.test(s)) return true;
  if (/^\s*\[\d+\]/.test(s)) return true;
  if (/^\w[\w\s,.-]{0,40}\(\d{4}\)\.$/.test(s)) return true;

  // Code-like sentences (many curly braces, brackets, pipes — probably code)
  const codeChars = (s.match(/[{}\[\]<>|\\=;]/g) ?? []).length;
  if (codeChars / s.length > 0.08) return true;

  return false;
}
