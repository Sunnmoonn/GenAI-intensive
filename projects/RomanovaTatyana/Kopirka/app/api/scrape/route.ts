import { validateUrl } from '@/lib/validate';
import { fetchPage } from '@/lib/fetcher';
import { extractContent } from '@/lib/extractor';
import { toMarkdown } from '@/lib/transformer';
import { generateSummary } from '@/lib/summarizer';
import type { ScrapeResult, ScrapeError } from '@/lib/types';

// Allow up to 30 s on serverless (Vercel etc.)
export const maxDuration = 30;

export async function POST(request: Request) {
  // --- Parse body ---
  let rawUrl: unknown;
  try {
    const body = await request.json();
    rawUrl = body?.url;
  } catch {
    return err('Invalid request body.', 'UNKNOWN', 400);
  }

  // --- Validate URL ---
  const url = validateUrl(rawUrl);
  if (!url) {
    return err(
      'Invalid URL. Please enter a valid http or https address.',
      'INVALID_URL',
      400,
    );
  }

  // --- Fetch ---
  let fetchResult: { html: string; usedPlaywright: boolean };
  try {
    fetchResult = await fetchPage(url);
  } catch (e: any) {
    const code = e?.code ?? 'FETCH_FAILED';
    let message: string;
    if (code === 'TIMEOUT') {
      message = 'The page took too long to respond. Try again or use a different URL.';
    } else if (code === 'BLOCKED') {
      message = 'Access was blocked (HTTP 403/401). The site does not allow automated requests.';
    } else {
      message = `Could not fetch the page: ${e?.message ?? 'unknown error'}`;
    }
    return err(message, code, 422);
  }

  // --- Extract ---
  const extracted = extractContent(fetchResult.html, url);

  if (!extracted.textContent || extracted.textContent.length < 50) {
    return err(
      'No meaningful content found. The page may require login or be mostly visual.',
      'EMPTY_CONTENT',
      422,
    );
  }

  // --- Transform ---
  const markdown = toMarkdown(extracted.mainHtml);
  const summary = generateSummary(extracted.textContent);

  const result: ScrapeResult = {
    url,
    title: extracted.title,
    description: extracted.description,
    markdown,
    // Cap content string to avoid very large payloads
    content: extracted.textContent.slice(0, 12_000),
    headings: extracted.headings,
    links: extracted.links,
    summary,
    wordCount: countWords(extracted.textContent),
    fetchedAt: new Date().toISOString(),
    usedPlaywright: fetchResult.usedPlaywright,
    designContext: extracted.designContext,
  };

  return Response.json(result);
}

// --- Helpers ---

function err(message: string, code: ScrapeError['code'], status: number) {
  return Response.json({ error: message, code } satisfies ScrapeError, { status });
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}
