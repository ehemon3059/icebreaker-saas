# IcebreakerAI

AI-powered cold email icebreaker generator. Upload a CSV of leads, and get unique, personalized opening lines for every prospect — powered by Google Gemini and scraped company context.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Database | Prisma + Supabase (PostgreSQL) |
| AI | Google Gemini |
| Queue & Rate Limiting | Upstash Redis |
| Billing | Lemon Squeezy |
| Auth | Supabase Auth (Google OAuth + email) |
| Error Tracking | Sentry |
| Analytics | PostHog |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- [Supabase](https://supabase.com) account (free tier works)
- [Upstash](https://upstash.com) account (free tier works)
- [Google AI Studio](https://aistudio.google.com) API key

### Local Development

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/icebreaker-saas.git
cd icebreaker-saas

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Fill in all values in .env.local

# 4. Push schema to your dev Supabase database
npx prisma db push

# 5. Generate Prisma client
npx prisma generate

# 6. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Deployment

```bash
# 1. Push to GitHub — Vercel detects Next.js and auto-deploys
git push origin main

# 2. In Vercel dashboard → Project Settings → Environment Variables
#    Copy every key from .env.local into Vercel

# 3. Push Prisma schema to production Supabase (run locally)
bash scripts/deploy-db.sh

# 4. In Lemon Squeezy dashboard → Webhooks
#    Add webhook URL: https://your-domain.com/api/webhooks/lemonsqueezy
#    Events: subscription_created, subscription_updated,
#            subscription_cancelled, subscription_payment_success,
#            subscription_payment_failed

# 5. Cron jobs are configured automatically via vercel.json
```

## Project Structure

```
icebreaker-saas/
├── prisma/
│   └── schema.prisma          # Database schema
├── scripts/
│   ├── deploy-db.sh           # Production DB migration helper
│   └── seed.ts                # Dev seed data
├── src/
│   ├── app/
│   │   ├── (auth)/            # OAuth callback route
│   │   ├── (dashboard)/       # /generate page
│   │   ├── (legal)/           # /terms, /privacy pages
│   │   ├── api/               # All API route handlers
│   │   │   ├── generate/      # Single icebreaker generation
│   │   │   ├── generate-demo/ # Public demo (rate limited)
│   │   │   ├── jobs/          # Bulk job submit/worker/status/results
│   │   │   ├── health/        # Health check endpoint
│   │   │   ├── webhooks/      # Lemon Squeezy billing webhooks
│   │   │   └── user/          # Credits & profile
│   │   ├── dashboard/         # Dashboard pages (main, csv, jobs, settings)
│   │   ├── icebreakers/       # Programmatic SEO pages by industry
│   │   ├── login/             # Auth pages
│   │   ├── signup/
│   │   ├── pricing/
│   │   ├── page.tsx           # Landing page
│   │   └── layout.tsx         # Root layout (Navbar, Footer, PostHog)
│   ├── components/
│   │   ├── billing/           # CheckoutButton, CreditsIndicator, UpgradeModal
│   │   ├── csv/               # CsvUploader, CsvColumnMapper, ResultsTable, etc.
│   │   ├── landing/           # LiveDemo, PricingSection, FaqSection
│   │   ├── layout/            # Navbar, Footer
│   │   └── providers/         # PostHogProvider
│   ├── data/
│   │   └── industries.ts      # Hardcoded SEO example icebreakers
│   ├── features/
│   │   ├── ai/                # Gemini service, spam checker, prompt builder
│   │   ├── scraper/           # Website scraper + Redis cache
│   │   ├── billing/           # Billing service, usage tracker
│   │   └── queue/             # CSV processor, queue service
│   ├── hooks/                 # useJobProgress, use-credits, use-auth
│   ├── lib/
│   │   ├── billing/           # Plan definitions
│   │   ├── queue/             # Redis client
│   │   ├── supabase/          # Browser/server Supabase clients
│   │   ├── env.ts             # Startup env validation
│   │   ├── prisma.ts          # Prisma client singleton
│   │   └── rate-limit.ts      # Upstash rate limiters
│   └── types/                 # Shared TypeScript types
├── .env.example               # Required environment variables (no secrets)
├── vercel.json                # Cron jobs, security headers, region config
├── next.config.ts             # Next.js + Sentry config
├── proxy.ts                   # Auth middleware (Supabase session refresh)
└── sentry.*.config.ts         # Sentry client/server/edge configs
```

## Environment Variables

See [.env.example](.env.example) for all required variables with descriptions.

Key variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Supabase pooled connection (port 6543) |
| `DIRECT_URL` | Supabase direct connection (port 5432, migrations only) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `GOOGLE_AI_API_KEY` | Google Gemini API key |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | Lemon Squeezy webhook signing secret |
| `CRON_SECRET` | Bearer token for authenticating Vercel cron requests |
| `NEXT_PUBLIC_APP_URL` | Your production domain |

## API Routes

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/generate` | Required | Single lead icebreaker generation |
| `POST` | `/api/generate-demo` | None | Public demo — 2 requests / 24h per IP |
| `POST` | `/api/jobs/submit` | Required | Submit CSV batch job |
| `POST` | `/api/jobs/worker` | Cron secret | Background queue processor |
| `GET` | `/api/jobs/[id]/status` | Required | Job progress polling |
| `GET` | `/api/jobs/[id]/results` | Required | Fetch completed results |
| `POST` | `/api/jobs/[id]/regenerate` | Required | Regenerate single lead |
| `GET` | `/api/user/credits` | Required | Credit usage and limit |
| `POST` | `/api/webhooks/lemonsqueezy` | HMAC sig | Billing event handler |
| `GET` | `/api/health` | None | Database + Redis health check |

## Plans & Credits

| Plan | Credits / month | Price |
|---|---|---|
| Free | 10 | $0 |
| Pro | 500 | Configured in Lemon Squeezy |
| Scale | 5,000 | Configured in Lemon Squeezy |

Credits reset on each billing cycle via the `subscription_payment_success` webhook.

## License

MIT
