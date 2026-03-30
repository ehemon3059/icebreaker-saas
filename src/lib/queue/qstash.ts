import { Client } from '@upstash/qstash'

// Trigger the worker via QStash — QStash will POST to the worker URL
// with the CRON_SECRET header, fitting within Vercel Hobby's 10s limit
// by processing 1 lead per invocation and re-triggering itself.
export async function triggerWorker() {
  const token = process.env.QSTASH_TOKEN
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const cronSecret = process.env.CRON_SECRET

  if (!token || !cronSecret) {
    console.warn('[qstash] Missing QSTASH_TOKEN or CRON_SECRET — skipping trigger')
    return
  }

  const client = new Client({ token })

  await client.publish({
    url: `${siteUrl}/api/jobs/worker`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cronSecret}`,
    },
  })
}
