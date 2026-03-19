import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { scrapeWithCache } from '@/features/scraper/cache.service'
import { generateIcebreaker } from '@/features/ai/gemini.service'
import { checkForSpam } from '@/features/ai/spam-checker'
import { checkCredits, deductCredit } from '@/lib/billing/usage'
import { apiRateLimiter, checkRateLimit } from '@/lib/rate-limit'

// ─── Response helpers ─────────────────────────────────────────────────────────

type ErrorCode =
  | 'AUTH_REQUIRED'
  | 'CREDITS_EXHAUSTED'
  | 'VALIDATION_ERROR'
  | 'GENERATION_FAILED'

function errorResponse(error: string, code: ErrorCode, status: number) {
  return NextResponse.json({ success: false, error, code }, { status })
}

// ─── POST /api/generate ───────────────────────────────────────────────────────

export async function POST(request: Request) {
  // ── 1. Validate inputs ────────────────────────────────────────────────────
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorResponse('Invalid JSON body', 'VALIDATION_ERROR', 400)
  }

  const { name, title, company, website } = body as Record<string, string>

  if (!name?.trim() || !title?.trim() || !company?.trim()) {
    return errorResponse('name, title, and company are required', 'VALIDATION_ERROR', 400)
  }

  // ── 2. Auth check ─────────────────────────────────────────────────────────
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return errorResponse('Authentication required', 'AUTH_REQUIRED', 401)
  }

  // ── 3. Rate limit check ───────────────────────────────────────────────────
  const rateCheck = await checkRateLimit(apiRateLimiter, user.id)
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: 'Too many requests. Please wait a moment and try again.',
        code: 'RATE_LIMITED',
      },
      { status: 429 }
    )
  }

  // ── 4. Credit check ───────────────────────────────────────────────────────
  const creditStatus = await checkCredits(user.id)

  if (!creditStatus.hasCredits) {
    return NextResponse.json({
      success: false,
      error: 'Credit limit reached. Please upgrade your plan.',
      code: 'CREDITS_EXHAUSTED',
      credits: {
        used: creditStatus.used,
        limit: creditStatus.limit,
        remaining: 0,
        plan: creditStatus.plan,
      },
    }, { status: 403 })
  }

  // ── 5. Scrape website (optional) ──────────────────────────────────────────
  let companyContext: string | null = null
  if (website?.trim()) {
    const scrapeResult = await scrapeWithCache(website.trim())
    companyContext = scrapeResult.context
  }

  // ── 6. Generate icebreaker via GPT-4o-mini ────────────────────────────────
  let generated: { message: string; tokensUsed: number; estimatedCost: number }
  try {
    generated = await generateIcebreaker({ name, title, company, companyContext })
  } catch (err) {
    console.error('[api/generate] OpenAI error:', err)
    return errorResponse('AI generation failed. Please try again.', 'GENERATION_FAILED', 502)
  }

  if (!generated.message) {
    return errorResponse('AI returned an empty response.', 'GENERATION_FAILED', 502)
  }

  // ── 7. Spam check ─────────────────────────────────────────────────────────
  const spamCheck = checkForSpam(generated.message)

  // ── 8. Save Lead + GeneratedMessage ──────────────────────────────────────
  const lead = await prisma.lead.create({
    data: {
      name: name.trim(),
      company: company.trim(),
      title: title.trim(),
      website: website?.trim() || null,
      source: 'manual',
      userId: user.id,
    },
  })

  await prisma.generatedMessage.create({
    data: {
      content: generated.message,
      tokensUsed: generated.tokensUsed,
      estimatedCost: generated.estimatedCost,
      isClean: spamCheck.isClean,
      flaggedWords: spamCheck.flaggedWords,
      leadId: lead.id,
      userId: user.id,
    },
  })

  // ── 9. Deduct credit ──────────────────────────────────────────────────────
  await deductCredit(user.id)

  // ── 10. Return structured success response ────────────────────────────────
  return NextResponse.json({
    success: true,
    data: {
      message: generated.message,
      spamCheck: {
        isClean: spamCheck.isClean,
        flaggedWords: spamCheck.flaggedWords,
        severity: spamCheck.severity,
      },
      credits: {
        used: creditStatus.used + 1,
        limit: creditStatus.limit,
        remaining: creditStatus.remaining - 1,
        plan: creditStatus.plan,
      },
    },
  })
}
