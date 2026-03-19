const requiredEnvVars = [
  'DATABASE_URL',
  'DIRECT_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'GOOGLE_AI_API_KEY',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'LEMONSQUEEZY_WEBHOOK_SECRET',
  'CRON_SECRET',
] as const

export function validateEnv() {
  const missing = requiredEnvVars.filter((key) => !process.env[key])
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.join('\n')}`
    )
  }
}
