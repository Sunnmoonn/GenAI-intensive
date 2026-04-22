export interface FetchResult {
  html: string;
  usedPlaywright: boolean;
}

const TIMEOUT_MS = 15_000;
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

export async function fetchPage(url: string): Promise<FetchResult> {
  let html: string;

  try {
    html = await fetchWithHttp(url);
  } catch (err: any) {
    // HTTP failed — try Playwright before giving up
    try {
      return await fetchWithPlaywright(url);
    } catch {
      throw err; // Re-throw the original HTTP error
    }
  }

  // If the page looks like a JS-only shell, upgrade to Playwright
  if (looksEmpty(html)) {
    try {
      return await fetchWithPlaywright(url);
    } catch {
      // Playwright not available or failed — return the thin HTML we have
    }
  }

  return { html, usedPlaywright: false };
}

async function fetchWithHttp(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
      },
      signal: controller.signal,
      redirect: 'follow',
    });

    if (!res.ok) {
      const err = new Error(`HTTP ${res.status} ${res.statusText}`);
      (err as any).code =
        res.status === 403 || res.status === 401 ? 'BLOCKED' : 'FETCH_FAILED';
      throw err;
    }

    const contentType = res.headers.get('content-type') ?? '';
    if (!contentType.includes('html') && !contentType.includes('text')) {
      const err = new Error('Response is not an HTML page');
      (err as any).code = 'FETCH_FAILED';
      throw err;
    }

    return await res.text();
  } catch (err: any) {
    if (err.name === 'AbortError') {
      const e = new Error('Request timed out after 15 seconds');
      (e as any).code = 'TIMEOUT';
      throw e;
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Returns true when the page body is almost certainly a JS-rendered shell
 * with no useful static text.
 */
function looksEmpty(html: string): boolean {
  const withoutNoise = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '');
  const text = withoutNoise.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length < 300;
}

async function fetchWithPlaywright(url: string): Promise<FetchResult> {
  const { loadPlaywright } = await import('./playwright-loader');
  const pw = loadPlaywright();

  if (!pw) {
    throw new Error(
      'Playwright is not installed. Run: npm install playwright && npx playwright install chromium',
    );
  }

  const browser = await pw.chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({ 'User-Agent': USER_AGENT });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 20_000 });
    const html = await page.content();
    return { html, usedPlaywright: true };
  } finally {
    await browser.close();
  }
}
