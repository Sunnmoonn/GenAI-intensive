/**
 * Crunchbase scraper — uses Playwright for browser-based scraping
 * Note: Crunchbase ToS prohibits commercial scraping. Use for personal/research only.
 * Alternative: register for free Crunchbase Basic API (200 requests/month)
 */

import { db } from '../db';
import { startups, syncLog } from '../db/schema';
import { eq } from 'drizzle-orm';
import { computeScore } from '../lib/scoring';

const CB_URL = 'https://www.crunchbase.com/discover/organization.companies/d2c7d32a7ca46d4a24adea9f0d9861e7';

interface CBCompany {
  name: string;
  description: string;
  fundingTotal?: number;
  fundingStage?: string;
  foundedYear?: number;
  employeeRange?: string;
  categories: string[];
  location?: string;
  website?: string;
  cbUrl: string;
}

async function scrapeWithPlaywright(): Promise<CBCompany[]> {
  // Dynamic import to avoid loading Playwright when not needed
  const { chromium } = await import('playwright');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
  });

  const page = await context.newPage();
  const companies: CBCompany[] = [];

  try {
    await page.goto(CB_URL, { waitUntil: 'networkidle', timeout: 60000 });

    // Wait for company cards to load
    await page.waitForSelector('[class*="component--card"]', { timeout: 30000 }).catch(() => {
      console.warn('[cb] Card selector timeout — page may have changed');
    });

    // Extract data from cards
    const extracted = await page.evaluate(() => {
      const cards = document.querySelectorAll('[class*="component--card"], [data-testid="card"]');
      const results: Array<{
        name: string;
        description: string;
        fundingTotal?: string;
        fundingStage?: string;
        foundedYear?: string;
        employeeRange?: string;
        categories: string[];
        location?: string;
        website?: string;
        cbUrl: string;
      }> = [];

      cards.forEach(card => {
        const name = card.querySelector('[class*="title"], h3, h4')?.textContent?.trim() ?? '';
        if (!name) return;

        const description = card.querySelector('[class*="description"], p')?.textContent?.trim() ?? '';
        const fundingEl = card.querySelector('[class*="funding"], [data-field="funding_total"]');
        const stageEl = card.querySelector('[class*="stage"], [data-field="last_funding_type"]');
        const foundedEl = card.querySelector('[class*="founded"], [data-field="founded_on"]');
        const employeeEl = card.querySelector('[class*="employee"], [data-field="num_employees_enum"]');
        const locationEl = card.querySelector('[class*="location"], [data-field="location_identifiers"]');
        const linkEl = card.querySelector('a[href*="/organization/"]');
        const categoryEls = card.querySelectorAll('[class*="category"], [class*="tag"]');
        const categories = Array.from(categoryEls).map(el => el.textContent?.trim() ?? '').filter(Boolean);

        results.push({
          name,
          description,
          fundingTotal: fundingEl?.textContent?.trim(),
          fundingStage: stageEl?.textContent?.trim(),
          foundedYear: foundedEl?.textContent?.trim(),
          employeeRange: employeeEl?.textContent?.trim(),
          location: locationEl?.textContent?.trim(),
          cbUrl: linkEl ? `https://www.crunchbase.com${linkEl.getAttribute('href')}` : CB_URL,
          categories,
        });
      });

      return results;
    });

    for (const item of extracted) {
      // Parse funding amount (e.g. "$1.2M" → 1200000)
      let fundingTotal: number | undefined;
      if (item.fundingTotal) {
        const match = item.fundingTotal.match(/[\d.]+([KMB]?)/i);
        if (match) {
          const n = parseFloat(match[0]);
          const mult = match[1]?.toUpperCase();
          fundingTotal = mult === 'B' ? n * 1e9 : mult === 'M' ? n * 1e6 : mult === 'K' ? n * 1e3 : n;
        }
      }

      companies.push({
        name: item.name,
        description: item.description,
        fundingTotal,
        fundingStage: item.fundingStage,
        foundedYear: item.foundedYear ? parseInt(item.foundedYear) : undefined,
        employeeRange: item.employeeRange,
        categories: item.categories,
        location: item.location,
        cbUrl: item.cbUrl,
      });
    }

    // Scroll and load more (max 5 scrolls)
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await new Promise(r => setTimeout(r, 2000));
    }

  } finally {
    await browser.close();
  }

  return companies;
}

function cbToStartup(c: CBCompany) {
  const id = `cb_${c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const scoreInput = {
    tags: c.categories,
    industries: c.categories,
    fundingTotal: c.fundingTotal,
    fundingStage: c.fundingStage,
    foundedYear: c.foundedYear,
    locations: c.location ? [c.location] : [],
  };
  const scores = computeScore(scoreInput);

  return {
    id,
    source: 'crunchbase' as const,
    externalId: id,
    name: c.name,
    slug: c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    website: c.website ?? null,
    sourceUrl: c.cbUrl,
    tagline: null,
    description: c.description ?? null,
    tags: c.categories,
    industries: c.categories,
    fundingTotal: c.fundingTotal ?? null,
    fundingStage: c.fundingStage ?? null,
    foundedYear: c.foundedYear ?? null,
    employeeRange: c.employeeRange ?? null,
    locations: c.location ? [c.location] : [],
    scoreTotal: scores.total,
    scoreDisruption: scores.disruption,
    scoreScalability: scores.scalability,
    scoreMarketSize: scores.marketSize,
    scoreTraction: scores.traction,
    scoreRussiaBarriers: scores.russiaBarriers,
    scoreTimingRussia: scores.timingRussia,
    scoredAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function syncCrunchbase() {
  const startedAt = new Date().toISOString();
  let added = 0;
  let updated = 0;

  console.log('[cb] Starting Crunchbase scrape...');

  try {
    const companies = await scrapeWithPlaywright();
    console.log(`[cb] Scraped ${companies.length} companies`);

    for (const c of companies) {
      if (!c.name) continue;
      const record = cbToStartup(c);
      const existing = db.select({ id: startups.id }).from(startups)
        .where(eq(startups.id, record.id)).get();

      if (existing) {
        db.update(startups).set(record).where(eq(startups.id, record.id)).run();
        updated++;
      } else {
        db.insert(startups).values(record).run();
        added++;
      }
    }

    db.insert(syncLog).values({
      source: 'crunchbase',
      status: 'success',
      recordsAdded: added,
      recordsUpdated: updated,
      startedAt,
      finishedAt: new Date().toISOString(),
    }).run();

    console.log(`[cb] Done: +${added} added, ~${updated} updated`);
    return { added, updated };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    db.insert(syncLog).values({
      source: 'crunchbase',
      status: 'failed',
      errorMessage: msg,
      startedAt,
      finishedAt: new Date().toISOString(),
    }).run();
    throw err;
  }
}
