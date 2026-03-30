import { NextResponse } from 'next/server'
import { processQueue } from '@/lib/queue/process-queue'

function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) return false
  return authHeader === `Bearer ${cronSecret}`
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const result = await processQueue()
  return NextResponse.json(result)
}

// Vercel Cron calls GET for scheduled runs
export const GET = POST
