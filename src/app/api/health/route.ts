import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { redis } from '@/lib/queue/redis'

export async function GET() {
  const timestamp = new Date().toISOString()
  const version = process.env.VERCEL_GIT_COMMIT_SHA ?? 'local'

  // ── Check database ──────────────────────────────────────────────────────────
  let dbStatus: 'up' | 'down' = 'down'
  let dbLatencyMs = 0
  try {
    const dbStart = Date.now()
    await prisma.$queryRaw`SELECT 1`
    dbLatencyMs = Date.now() - dbStart
    dbStatus = 'up'
  } catch {
    // db unreachable
  }

  // ── Check Redis ─────────────────────────────────────────────────────────────
  let redisStatus: 'up' | 'down' = 'down'
  let redisLatencyMs = 0
  try {
    const redisStart = Date.now()
    await redis.ping()
    redisLatencyMs = Date.now() - redisStart
    redisStatus = 'up'
  } catch {
    // redis unreachable
  }

  // ── Derive overall status ───────────────────────────────────────────────────
  const overallStatus =
    dbStatus === 'down'
      ? 'unhealthy'
      : redisStatus === 'down'
        ? 'degraded'
        : 'healthy'

  const httpStatus = overallStatus === 'unhealthy' ? 503 : 200

  return NextResponse.json(
    {
      status: overallStatus,
      timestamp,
      services: {
        database: { status: dbStatus, latencyMs: dbLatencyMs },
        redis: { status: redisStatus, latencyMs: redisLatencyMs },
      },
      version,
    },
    { status: httpStatus }
  )
}
