import { prisma } from '@/lib/prisma'
import { scrapeWebsite, type ScrapeResult } from './scraper.service'

const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

// ─── URL normalization ─────────────────────────────────────────────────────────
// The schema caches by domain (unique key), not full URL.
// e.g. "https://WWW.Acme.com/about/" → "acme.com"

function normalizeDomain(url: string): string | null {
  try {
    const parsed = new URL(url)
    return parsed.hostname.toLowerCase().replace(/^www\./, '')
  } catch {
    return null
  }
}

// ─── Cache read ────────────────────────────────────────────────────────────────

async function getCachedContent(url: string): Promise<string | null> {
  const domain = normalizeDomain(url)
  if (!domain) return null

  const cached = await prisma.scraperCache.findUnique({ where: { domain } })
  if (!cached) return null

  if (cached.expiresAt > new Date()) {
    // Cache hit — rawHtml stores our scraped context string
    return cached.rawHtml ?? null
  }

  // Stale — delete and treat as miss
  await prisma.scraperCache.delete({ where: { domain } })
  return null
}

// ─── Cache write ───────────────────────────────────────────────────────────────

async function setCachedContent(url: string, context: string): Promise<void> {
  const domain = normalizeDomain(url)
  if (!domain) return

  const now = new Date()
  await prisma.scraperCache.upsert({
    where: { domain },
    update: {
      rawHtml: context,
      scrapedAt: now,
      expiresAt: new Date(now.getTime() + CACHE_TTL_MS),
    },
    create: {
      domain,
      rawHtml: context,
      scrapedAt: now,
      expiresAt: new Date(now.getTime() + CACHE_TTL_MS),
    },
  })
}

// ─── Public entry point ────────────────────────────────────────────────────────

export async function scrapeWithCache(url: string): Promise<ScrapeResult> {
  if (!url) {
    return { success: false, context: null, source: 'skipped', reason: 'no_url_provided' }
  }

  // Step 1: Check cache
  const cached = await getCachedContent(url)
  if (cached) {
    return { success: true, context: cached, source: 'cache' }
  }

  // Step 2–5: Delegate to scraper (LinkedIn guard + Tier 1 + Tier 2 are all inside)
  const result = await scrapeWebsite(url)

  // Step 4: Persist successful scrapes to cache
  if (result.success && result.context) {
    await setCachedContent(url, result.context)
  }

  return result
}
