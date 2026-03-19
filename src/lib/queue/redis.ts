import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Queue key convention:
//   "queue:jobs"          — list of pending jobIds (LPUSH / RPOP)
//   "queue:icebreaker:{jobId}" — reserved for per-job metadata if needed
export const QUEUE_KEY = 'queue:jobs'
