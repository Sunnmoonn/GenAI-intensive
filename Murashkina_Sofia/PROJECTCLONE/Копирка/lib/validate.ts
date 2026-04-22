/**
 * Validates and normalises a URL string.
 * Returns the normalised URL on success, null if invalid.
 * Accepts URLs without a protocol by prepending https://.
 */
export function validateUrl(input: unknown): string | null {
  if (typeof input !== 'string' || !input.trim()) return null;

  const raw = input.trim();

  // Try parsing as-is
  try {
    const url = new URL(raw);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    if (!url.hostname || url.hostname.length < 2) return null;
    return url.toString();
  } catch {
    // Fall through
  }

  // Try prepending https://
  try {
    const url = new URL(`https://${raw}`);
    if (!url.hostname || url.hostname.length < 2) return null;
    // Sanity check: hostname must have at least one dot
    if (!url.hostname.includes('.')) return null;
    return url.toString();
  } catch {
    return null;
  }
}
