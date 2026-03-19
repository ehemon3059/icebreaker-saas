import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { scrapeWithCache } from '@/features/scraper/cache.service'
import { generateIcebreaker } from '@/features/ai/gemini.service'
import { checkForSpam } from '@/features/ai/spam-checker'
import { demoRateLimiter, checkRateLimit } from '@/lib/rate-limit'

function getClientIp(headersList: Awaited<ReturnType<typeof headers>>): string {
  return (
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headersList.get('x-real-ip') ??
    'unknown'
  )
}

// ─── POST /api/generate-demo ──────────────────────────────────────────────────

export async function POST(request: Request) {
  // ── 1. Rate limit check ───────────────────────────────────────────────────
  const headersList = await headers()
  const ip = getClientIp(headersList)

  const { allowed } = await checkRateLimit(demoRateLimiter, ip)

  if (!allowed) {
    return NextResponse.json(
      {
        success: false,
        error: "You've reached the demo limit. Sign up for free to keep generating.",
        code: 'RATE_LIMITED',
      },
      { status: 429 }
    )
  }

  // ── 2. Validate inputs ────────────────────────────────────────────────────
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body', code: 'VALIDATION_ERROR' },
      { status: 400 }
    )
  }

  const { name, jobTitle, company, website } = body as Record<string, string>

  if (!name?.trim() || !jobTitle?.trim() || !company?.trim()) {
    return NextResponse.json(
      { success: false, error: 'name, jobTitle, and company are required', code: 'VALIDATION_ERROR' },
      { status: 400 }
    )
  }

  // ── 3. Scrape website (optional) ──────────────────────────────────────────
  let companyContext: string | null = null
  if (website?.trim()) {
    const scrapeResult = await scrapeWithCache(website.trim())
    companyContext = scrapeResult.context
  }

  // ── 4. Generate icebreaker ────────────────────────────────────────────────
  let generated: { message: string; tokensUsed: number; estimatedCost: number }
  try {
    generated = await generateIcebreaker({
      name: name.trim(),
      title: jobTitle.trim(),
      company: company.trim(),
      companyContext,
    })
  } catch (err) {
    console.error('[api/generate-demo] generation error:', err)
    return NextResponse.json(
      { success: false, error: 'AI generation failed. Please try again.', code: 'GENERATION_FAILED' },
      { status: 502 }
    )
  }

  if (!generated.message) {
    return NextResponse.json(
      { success: false, error: 'AI returned an empty response.', code: 'GENERATION_FAILED' },
      { status: 502 }
    )
  }

  // ── 5. Spam check ─────────────────────────────────────────────────────────
  const spamCheck = checkForSpam(generated.message)

  // ── 6. Return result — no DB save, no credit deduction ───────────────────
  return NextResponse.json({
    success: true,
    icebreaker: generated.message,
    data: {
      message: generated.message,
      spamCheck: {
        isClean: spamCheck.isClean,
        flaggedWords: spamCheck.flaggedWords,
        severity: spamCheck.severity,
      },
    },
  })
}
