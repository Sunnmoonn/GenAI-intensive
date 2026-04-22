/**
 * Optional Playwright loader.
 *
 * Uses eval('require') to prevent Turbopack / webpack from statically
 * resolving 'playwright' at build time. The module is loaded lazily at
 * runtime only when this function is called and playwright is installed.
 *
 * To enable JS-rendered page support:
 *   npm install playwright
 *   npx playwright install chromium
 */

export interface PlaywrightBrowser {
  newPage(): Promise<PlaywrightPage>;
  close(): Promise<void>;
}

export interface PlaywrightPage {
  setExtraHTTPHeaders(headers: Record<string, string>): Promise<void>;
  goto(url: string, opts?: { waitUntil?: string; timeout?: number }): Promise<unknown>;
  content(): Promise<string>;
}

export function loadPlaywright(): { chromium: { launch(opts?: { headless?: boolean }): Promise<PlaywrightBrowser> } } | null {
  try {
    // eval('require') prevents the bundler from statically resolving this
    // module at build time — it only runs at Node.js runtime.
    // eslint-disable-next-line no-eval
    return eval('require')('playwright');
  } catch {
    return null;
  }
}
