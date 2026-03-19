import axios from 'axios'
import * as cheerio from 'cheerio'

export interface ScrapeResult {
  success: boolean
  context: string | null
  source: 'cheerio' | 'fallback' | 'cache' | 'skipped'
  reason?: string
}

const MAX_CONTEXT_LENGTH = 1500
const REQUEST_TIMEOUT_MS = 5000
const MIN_PARAGRAPH_LENGTH = 20
const MAX_PARAGRAPHS = 3

const USER_AGENT = 'Mozilla/5.0 (compatible; IcebreakerBot/1.0)'

// ─── Tier 1: Lightweight Cheerio scrape ───────────────────────────────────────

async function scrapeWithCheerio(url: string): Promise<ScrapeResult> {
  const response = await axios.get(url, {
    timeout: REQUEST_TIMEOUT_MS,
    headers: { 'User-Agent': USER_AGENT },
    // Follow redirects but cap at 3 hops
    maxRedirects: 3,
  })

  const $ = cheerio.load(response.data)

  const title = $('title').first().text().trim()

  const metaDescription =
    $('meta[name="description"]').attr('content')?.trim() ??
    $('meta[property="og:description"]').attr('content')?.trim() ??
    ''

  const paragraphs: string[] = []
  $('p').each((_, el) => {
    if (paragraphs.length >= MAX_PARAGRAPHS) return false
    const text = $(el).text().trim()
    if (text.length >= MIN_PARAGRAPH_LENGTH) {
      paragraphs.push(text)
    }
  })

  const combined = [title, metaDescription, ...paragraphs]
    .filter(Boolean)
    .join(' ')
    .slice(0, MAX_CONTEXT_LENGTH)

  if (!combined) {
    return { success: false, context: null, source: 'fallback', reason: 'no_content_extracted' }
  }

  return { success: true, context: combined, source: 'cheerio' }
}

// ─── Tier 2: Fallback for blocked / SPA sites ─────────────────────────────────

function buildFallbackResult(reason: string): ScrapeResult {
  // TODO: Integrate Firecrawl or Browserless.io here for JS-rendered SPAs
  // and sites that block simple HTTP scrapers.
  // Example: https://www.firecrawl.dev/
  console.warn(`[scraper] Falling back — reason: ${reason}`)
  return { success: false, context: null, source: 'fallback', reason }
}

// ─── LinkedIn guard ────────────────────────────────────────────────────────────

function isLinkedInUrl(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.toLowerCase()
    return hostname.includes('linkedin.com')
  } catch {
    return false
  }
}

// ─── Public entry point ────────────────────────────────────────────────────────

export async function scrapeWebsite(url: string): Promise<ScrapeResult> {
  if (!url) {
    return { success: false, context: null, source: 'skipped', reason: 'no_url_provided' }
  }

  // LinkedIn bans scrapers aggressively — skip and let AI use name/title/company only
  if (isLinkedInUrl(url)) {
    return { success: true, context: null, source: 'skipped', reason: 'linkedin' }
  }

  try {
    const result = await scrapeWithCheerio(url)

    // If Cheerio extracted nothing, fall back
    if (!result.success || !result.context) {
      return buildFallbackResult(result.reason ?? 'empty_content')
    }

    return result
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      const code = err.code

      if (code === 'ECONNABORTED') return buildFallbackResult('timeout')
      if (status === 403) return buildFallbackResult('blocked_403')
      if (status === 401) return buildFallbackResult('blocked_401')
      if (status === 404) return buildFallbackResult('not_found_404')

      return buildFallbackResult(`http_error_${status ?? code ?? 'unknown'}`)
    }

    return buildFallbackResult('unexpected_error')
  }
}
