
W1
Phase 0 — Environment Setup
1. Install Node.js 18+, Git, VS Code, PostgreSQL
2. Create accounts: Vercel, Supabase, OpenAI, Lemon Squeezy, Payoneer, Upstash (Redis)
3. Initialize: npx create-next-app@latest icebreaker-saas --typescript --tailwind --app
4. Install: prisma, @supabase/supabase-js, openai, @upstash/redis
5. Setup .env.local with all API keys
6. Push to GitHub repo


Phase 0: Environment Setup & Project Initialization
Goal: Establish your local development environment, register all required third-party services, initialize the Next.js application, and set up version control safely.

1. Install Node.js 18+, Git, VS Code, PostgreSQL
The "Why": These are your core local development tools. Node.js (v18 or higher) is required to run the Next.js framework. Git is your version control system, ensuring you never lose your work. VS Code is the industry standard editor. PostgreSQL is the database engine Supabase runs on; installing it locally gives you command-line tools (like psql) to inspect your remote database if needed.

The Dev Task: Download and install these from their official websites. Open your terminal and run node -v and git --version to verify they are installed correctly.

2. Create accounts: Vercel, Supabase, OpenAI, Lemon Squeezy, Payoneer, Upstash (Redis)
The "Why": These six services form your entire SaaS infrastructure.

Vercel: Hosts your frontend and serverless functions.

Supabase: Provides your PostgreSQL database and User Authentication.

OpenAI: Powers the GPT-4o-mini icebreaker engine.

Lemon Squeezy & Payoneer: Your Merchant of Record (handles global taxes) and your payout pipeline.

Upstash: Provides the serverless Redis database necessary for your CSV background queue.

The Dev Task: Sign up for all these accounts now. Create a secure note in your password manager to store the login credentials and API keys you generate.

3. Initialize: npx create-next-app@latest
The "Why": This single command bootstraps your entire frontend architecture.

--typescript enforces strict typing, preventing massive bugs later.

--tailwind sets up your utility-first CSS framework for rapid UI building.

--app configures the modern Next.js App Router (which you need for your SEO pages and API routes).

The Dev Task: Run this exact command in your terminal. When it finishes, navigate into the folder:

npx create-next-app@latest icebreaker-saas --typescript --tailwind --app
cd icebreaker-saas


4. Install Dependencies (Core + Front-loaded)
The "Why": These libraries allow your Next.js app to talk to your infrastructure, parse CSVs, and scrape websites. By installing them all now, you won't have to interrupt your workflow during Phases 2 and 3.

The Dev Task: Run the following commands to install your production and development dependencies, then initialize Prisma:

# Install core and feature dependencies
npm install @prisma/client @supabase/supabase-js openai @upstash/redis papaparse react-dropzone cheerio axios

# Install development tools and types
npm install -D prisma @types/papaparse @types/cheerio

# Initialize Prisma ORM
npx prisma init


5. Setup .env.local with all API keys
The "Why": API keys must be kept out of your application code, or bots will scrape them from GitHub and steal your money/data. Next.js automatically loads variables from .env.local securely.

The Dev Task: 1. When you ran npx prisma init in Step 4, it automatically created a generic .env file. Rename this file to .env.local to avoid environment variable collisions.
2. Paste your API keys into this .env.local file using the template below.
3. Crucial: Ensure your DATABASE_URL uses port 6543 and ?pgbouncer=true for connection pooling, while DIRECT_URL uses port 5432.

# SUPABASE (Database & Auth)
# IMPORTANT: Use the pooled connection URL (port 6543) with ?pgbouncer=true for Prisma
DATABASE_URL="postgresql://postgres.[YOUR_PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
# Use the direct connection URL (port 5432) for Prisma migrations
DIRECT_URL="postgresql://postgres.[YOUR_PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR_PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"

# OPENAI
OPENAI_API_KEY="sk-your-openai-api-key"

# UPSTASH REDIS (For Queue)
UPSTASH_REDIS_REST_URL="https://your-database.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"

# LEMON SQUEEZY
LEMONSQUEEZY_API_KEY="your-lemon-squeezy-api-key"
LEMONSQUEEZY_WEBHOOK_SECRET="your-webhook-secret-phrase"

6. Security Check & Push to GitHub
The "Why": Version control protects your code, and Vercel watches your GitHub repository to automatically deploy new changes to the live internet.

The Dev Task: 1. Sanity Check: Open your .gitignore file and manually verify that .env.local is listed inside it.
2. Go to github.com and create a new repository called icebreaker-saas.
3. In your local terminal, run the following to commit and push your code:

git add .
git commit -m "Initial project setup and dependency installation"
git branch -M main
git remote add origin https://github.com/[YOUR_USERNAME]/icebreaker-saas.git
git push -u origin main

Gemini said
Here is the completely refined, developer-ready Phase 0 guide. This version includes the updated dependency list, the .env collision fix, and the .gitignore security check so you can set up your foundation flawlessly.

Phase 0: Environment Setup & Project Initialization
Goal: Establish your local development environment, register all required third-party services, initialize the Next.js application, and set up version control safely.

1. Install Node.js 18+, Git, VS Code, PostgreSQL
The "Why": These are your core local development tools. Node.js (v18 or higher) is required to run the Next.js framework. Git is your version control system, ensuring you never lose your work. VS Code is the industry standard editor. PostgreSQL is the database engine Supabase runs on; installing it locally gives you command-line tools (like psql) to inspect your remote database if needed.

The Dev Task: Download and install these from their official websites. Open your terminal and run node -v and git --version to verify they are installed correctly.

2. Create accounts: Vercel, Supabase, OpenAI, Lemon Squeezy, Payoneer, Upstash (Redis)
The "Why": These six services form your entire SaaS infrastructure.

Vercel: Hosts your frontend and serverless functions.

Supabase: Provides your PostgreSQL database and User Authentication.

OpenAI: Powers the GPT-4o-mini icebreaker engine.

Lemon Squeezy & Payoneer: Your Merchant of Record (handles global taxes) and your payout pipeline.

Upstash: Provides the serverless Redis database necessary for your CSV background queue.

The Dev Task: Sign up for all these accounts now. Create a secure note in your password manager to store the login credentials and API keys you generate.

3. Initialize: npx create-next-app@latest
The "Why": This single command bootstraps your entire frontend architecture.

--typescript enforces strict typing, preventing massive bugs later.

--tailwind sets up your utility-first CSS framework for rapid UI building.

--app configures the modern Next.js App Router (which you need for your SEO pages and API routes).

The Dev Task: Run this exact command in your terminal. When it finishes, navigate into the folder:

Bash
npx create-next-app@latest icebreaker-saas --typescript --tailwind --app
cd icebreaker-saas
4. Install Dependencies (Core + Front-loaded)
The "Why": These libraries allow your Next.js app to talk to your infrastructure, parse CSVs, and scrape websites. By installing them all now, you won't have to interrupt your workflow during Phases 2 and 3.

The Dev Task: Run the following commands to install your production and development dependencies, then initialize Prisma:

Bash
# Install core and feature dependencies
npm install @prisma/client @supabase/supabase-js openai @upstash/redis papaparse react-dropzone cheerio axios

# Install development tools and types
npm install -D prisma @types/papaparse @types/cheerio

# Initialize Prisma ORM
npx prisma init
5. Setup .env.local with all API keys
The "Why": API keys must be kept out of your application code, or bots will scrape them from GitHub and steal your money/data. Next.js automatically loads variables from .env.local securely.

The Dev Task: 1. When you ran npx prisma init in Step 4, it automatically created a generic .env file. Rename this file to .env.local to avoid environment variable collisions.
2. Paste your API keys into this .env.local file using the template below.
3. Crucial: Ensure your DATABASE_URL uses port 6543 and ?pgbouncer=true for connection pooling, while DIRECT_URL uses port 5432.

Code snippet
# SUPABASE (Database & Auth)
# IMPORTANT: Use the pooled connection URL (port 6543) with ?pgbouncer=true for Prisma
DATABASE_URL="postgresql://postgres.[YOUR_PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
# Use the direct connection URL (port 5432) for Prisma migrations
DIRECT_URL="postgresql://postgres.[YOUR_PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR_PROJECT_REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"

# OPENAI
OPENAI_API_KEY="sk-your-openai-api-key"

# UPSTASH REDIS (For Queue)
UPSTASH_REDIS_REST_URL="https://your-database.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"

# LEMON SQUEEZY
LEMONSQUEEZY_API_KEY="your-lemon-squeezy-api-key"
LEMONSQUEEZY_WEBHOOK_SECRET="your-webhook-secret-phrase"
6. Security Check & Push to GitHub
The "Why": Version control protects your code, and Vercel watches your GitHub repository to automatically deploy new changes to the live internet.

The Dev Task: 1. Sanity Check: Open your .gitignore file and manually verify that .env.local is listed inside it.
2. Go to github.com and create a new repository called icebreaker-saas.
3. In your local terminal, run the following to commit and push your code:

Bash
git add .
git commit -m "Initial project setup and dependency installation"
git branch -M main
git remote add origin https://github.com/[YOUR_USERNAME]/icebreaker-saas.git
git push -u origin main
Your environment is now completely locked in, secure, and ready for development.



PROJECT STRUCTURE

                icebreaker-saas/

                    │
                    ├── src/                                      ← all source code
                    │   │
                    │   ├── app/                                  ← Next.js App Router
                    │   │   │
                    │   │   ├── (marketing)/                  ← public pages (no auth required)
                    │   │   │   ├── page.tsx                  landing page (hero, demo, pricing)
                    │   │   │   ├── pricing/page.tsx
                    │   │   │   ├── icebreakers/[industry]/page.tsx   programmatic SEO pages
                    │   │   │   ├── terms/page.tsx
                    │   │   │   └── privacy/page.tsx
                    │   │   │
                    │   │   ├── (auth)/                       ← authentication pages
                    │   │   │   ├── login/page.tsx
                    │   │   │   ├── signup/page.tsx
                    │   │   │   └── callback/route.ts       Supabase OAuth callback
                    │   │   │
                    │   │   ├── (dashboard)/                  ← protected area (requires auth)
                    │   │   │   ├── layout.tsx                sidebar + auth guard
                    │   │   │   ├── dashboard/page.tsx       usage stats, recent icebreakers
                    │   │   │   ├── generate/page.tsx        single lead form
                    │   │   │   ├── bulk/page.tsx            CSV upload & bulk processing
                    │   │   │   ├── results/page.tsx         view, export, regenerate
                    │   │   │   ├── billing/page.tsx         plan management, invoices
                    │   │   │   └── settings/page.tsx
                    │   │   │
                    │   │   ├── api/                              ← API route handlers
                    │   │   │   ├── generate/route.ts        single icebreaker generation
                    │   │   │   ├── leads/
                    │   │   │   │   ├── route.ts              CRUD operations
                    │   │   │   │   └── upload/route.ts      CSV upload & queue dispatch
                    │   │   │   ├── queue/
                    │   │   │   │   ├── process/route.ts     queue worker endpoint
                    │   │   │   │   └── status/[jobId]/route.ts  job progress polling
                    │   │   │   ├── webhooks/
                    │   │   │   │   └── lemonsqueezy/route.ts payment webhook handler
                    │   │   │   └── cron/
                    │   │   │       ├── reset-credits/route.ts  monthly credit reset
                    │   │   │       └── cleanup-cache/route.ts  purge expired scraper cache
                    │   │   │
                    │   │   ├── layout.tsx                    root layout (fonts, providers)
                    │   │   └── globals.css
                    │   │
                    │   ├── features/                             ← domain logic (by feature)
                    │   │   │
                    │   │   ├── ai/
                    │   │   │   ├── ai.service.ts             GPT-4o-mini integration
                    │   │   │   ├── prompt-builder.ts         dynamic prompt construction
                    │   │   │   └── spam-checker.ts           spam word detection
                    │   │   │
                    │   │   ├── scraper/
                    │   │   │   ├── scraper.service.ts        Cheerio scraper + fallback
                    │   │   │   ├── linkedin-detector.ts      LinkedIn URL bypass
                    │   │   │   └── cache.service.ts          24hr domain cache layer
                    │   │   │
                    │   │   ├── billing/
                    │   │   │   ├── billing.service.ts        Lemon Squeezy helpers
                    │   │   │   ├── usage-tracker.ts          credit tracking & enforcement
                    │   │   │   └── plans.config.ts           plan definitions & limits
                    │   │   │
                    │   │   ├── queue/
                    │   │   │   ├── queue.service.ts          Upstash Redis queue manager
                    │   │   │   └── csv-processor.ts          bulk CSV processing logic
                    │   │   │
                    │   │   └── seo/
                    │   │       ├── industries.config.ts      industry list & metadata
                    │   │       └── example-generator.ts      build-time icebreaker examples
                    │   │
                    │   ├── components/                           ← shared React components
                    │   │   ├── ui/                               Button, Input, Card, Modal
                    │   │   ├── layout/                           Navbar, Sidebar, Footer
                    │   │   ├── forms/                            LeadForm, CSVUploader, ColumnMapper
                    │   │   ├── results/                          IcebreakerCard, ResultsTable, SpamBadge
                    │   │   └── billing/                          PricingTable, UsageMeter, UpgradePrompt
                    │   │
                    │   ├── lib/                                  ← infrastructure & utilities
                    │   │   ├── db/
                    │   │   │   ├── prisma.ts                 singleton Prisma client (pooled)
                    │   │   │   └── queries.ts                reusable DB queries
                    │   │   ├── auth/
                    │   │   │   ├── supabase-client.ts        browser client
                    │   │   │   ├── supabase-server.ts        server-side client
                    │   │   │   └── middleware.ts              auth guard logic
                    │   │   ├── redis/
                    │   │   │   └── upstash.ts                Upstash Redis client
                    │   │   ├── validations.ts                Zod schemas for API inputs
                    │   │   ├── rate-limiter.ts               API rate limiting
                    │   │   ├── constants.ts                  app-wide constants
                    │   │   └── utils.ts                      helpers (formatCurrency, etc.)
                    │   │
                    │   ├── hooks/                                ← custom React hooks
                    │   │   ├── use-auth.ts
                    │   │   ├── use-credits.ts
                    │   │   └── use-job-status.ts             poll queue job progress
                    │   │
                    │   ├── types/                                ← TypeScript definitions
                    │   │   ├── lead.ts
                    │   │   ├── subscription.ts
                    │   │   └── api.ts
                    │   │
                    │   └── middleware.ts                      Next.js middleware (auth redirect)
                    │
                    ├── prisma/
                    │   ├── schema.prisma                      complete data model
                    │   └── migrations/
                    │
                    ├── public/
                    │   ├── images/
                    │   └── favicon.ico
                    │
                    ├── scripts/                                  ← dev & build scripts
                    │   ├── seed.ts                            seed database with test data
                    │   └── generate-seo-content.ts            pre-generate SEO page content
                    │
                    ├── .env.local                                all API keys & secrets
                    ├── .env.example                              template with key names
                    ├── next.config.js
                    ├── tailwind.config.ts
                    ├── tsconfig.json
                    └── package.json