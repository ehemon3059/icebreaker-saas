W1-2
1. Phase 1 — Database & Auth (Supabase)
2. Design Prisma schema: User, Lead, GeneratedMessage, Subscription,ScraperCache
3. Configure Supabase Auth (Google + GitHub OAuth)
4. Build login/signup pages with Supabase Auth UI
5. Protect dashboard routes with middleware
6. Run npx prisma db push to sync schema
7. Setup Prisma with Supabase's pooled connection URL (PgBouncer) — NOT direct connection
8. use Prisma Accelerate for serverless connection pooling.
9. Prisma Singleton in Next.js

Phase 1: Database & Authentication Foundation
1. Design Prisma Schema (schema.prisma)
This is where you define the blueprint for your PostgreSQL database. Instead of writing raw SQL, you model your data using Prisma.

User: Tracks your customers, their current credit limits, and subscription tiers.

Lead: Stores the prospect data (name, company, role, website) uploaded from the CSV.

GeneratedMessage: Logs the AI outputs, including token usage and estimated API costs to track your profit margins.

Subscription: Links to Lemon Squeezy to track active, canceled, or past-due billing states.

ScraperCache: Temporarily stores scraped website text (with a 24-hour expiration) to prevent your app from getting IP-banned for repeatedly scraping the same domain.

2. Configure Supabase Auth (Google + GitHub OAuth)
Before writing frontend code, you need to go into your Supabase dashboard, navigate to the Authentication settings, and enable the Google and GitHub providers. This involves getting OAuth client IDs and secrets from Google Cloud Console and GitHub Developer Settings so users can log in with one click.

3. Build Login/Signup Pages
Create the frontend routes (e.g., /login and /signup). You can either build custom forms using Supabase's client library (supabase.auth.signInWithOAuth) or use Supabase's pre-built Auth UI components to get secure login screens up and running in minutes.

4. Protect Dashboard Routes with Middleware
You must secure the app so unauthenticated users cannot access the core tool. In Next.js, you will create a middleware.ts file at the root of your project. This middleware intercepts requests to /dashboard or /api/generate, checks Supabase for an active session token, and redirects users back to /login if they aren't authenticated.

5. Run npx prisma db push
Once your schema.prisma file is written, running this command tells Prisma to connect to your Supabase database and automatically create or update the actual SQL tables to match your schema. It syncs your code with your database.

6 & 7. Implement Connection Pooling (CRITICAL)
Serverless environments (like Vercel) spin up a new function instance for every incoming request. If 100 people hit your app, it creates 100 separate database connections. A direct connection (port 5432) will quickly exhaust Supabase's connection limits and crash your app.

The Fix: You must use Supabase's built-in PgBouncer (port 6543 with ?pgbouncer=true in your connection string) or use Prisma Accelerate. These tools act as a traffic cop, pooling and reusing database connections so your app remains stable even when a background queue is processing thousands of CSV rows.

9. ensure your src/lib/db/prisma.ts uses the global singleton pattern. In Next.js "Dev Mode," every time you save a file, the server restarts and creates a new Prisma client. Without the singleton, you will hit your Supabase connection limit in 10 minutes just by coding.

// src/lib/db/prisma.ts
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma


⚠️ CRITICAL: SUPABASE CONNECTION POOLING GOTCHA

You are using Prisma with Next.js Serverless functions. Every time a serverless function spins up, it creates a new database connection. Under heavy load (like a queue processing 500 leads), you will quickly exhaust your Supabase connection limits and get too many connections errors.

// .env.local — USE POOLED CONNECTION (port 6543), NOT direct (port 5432)

✘ WRONG (direct connection — will exhaust limits):
DATABASE_URL="postgresql://user:pass@db.xxx.supabase.co:5432/postgres"

✔ CORRECT (pooled via PgBouncer):
DATABASE_URL="postgresql://user:pass@db.xxx.supabase.co:6543/postgres?pgbouncer=true"

// For Prisma migrations, you still need the direct URL:
DIRECT_URL="postgresql://user:pass@db.xxx.supabase.co:5432/postgres"

// prisma/schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")      // Pooled for queries
  directUrl = env("DIRECT_URL")       // Direct for migrations
}

// Alternative: Use Prisma Accelerate (managed connection pooling)
npm install @prisma/extension-accelerate
// DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=YOUR_KEY"
Bottom line: Always use port 6543 (pooled) for your app, and port 5432 (direct) only for migrations. This one change prevents the #1 cause of Supabase crashes in serverless apps.