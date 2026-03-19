import { Ratelimit } from '@upstash/ratelimit'
import { redis } from '@/lib/queue/redis'

// 2 requests per 24 hours per IP — used by the public /api/generate-demo endpoint
export const demoRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(2, '24 h'),
  prefix: 'ratelimit:demo',
})

// 30 requests per minute per user — used by authenticated API routes
export const apiRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, '1 m'),
  prefix: 'ratelimit:api',
})

// ─── Helper ────────────────────────────────────────────────────────────────────

export async function checkRateLimit(
  limiter: Ratelimit,
  identifier: string
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const result = await limiter.limit(identifier)
  return {
    allowed: result.success,
    remaining: result.remaining,
    resetAt: new Date(result.reset),
  }
}
