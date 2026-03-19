System Architecture
How all the pieces connect end-to-end
The architecture follows a standard modern SaaS pattern: a Next.js frontend talks to API routes that coordinate between Supabase (data), OpenAI (AI), and Lemon Squeezy (billing). Here is the complete data flow:
Global Customers (US, UK, CA, IN, BR, PH)
          |
          v
   Next.js Frontend (Vercel)
   Landing Page + Dashboard
          |
          v
   Supabase Backend
   Auth + PostgreSQL + File Storage
      |              |
      v              v
  GPT-4o-mini    Lemon Squeezy
  Icebreaker     Payments &
  Engine         Billing
                    |
                    v
              Payoneer (2% fee)
                    |
                    v
         BRAC Bank / bKash (BDT)



# 📁 File Structure Guide
## Where to place each auth-related file

```

Complete Folder Map
icebreaker-saas/
├── app/
│   ├── api/
│   │   ├── auth/           ← Supabase Auth callback routes
│   │   ├── generate/       ← POST: AI icebreaker generation endpoint
│   │   ├── leads/          ← CRUD for leads + CSV upload handler
│   │   ├── queue/          ← Background job processor (Upstash)
│   │   ├── jobs/           ← GET: Job status polling for progress UI
│   │   └── webhooks/       ← POST: Lemon Squeezy payment webhooks
│   ├── dashboard/          ← Protected user area (leads, results, billing)
│   ├── login/              ← Auth pages (Google + GitHub OAuth)
│   ├── pricing/            ← Public pricing page with checkout
│   ├── layout.tsx          ← Root layout with providers
│   └── page.tsx            ← Landing page (hero, demo, pricing, FAQ)
├── components/
│   ├── ui/                 ← Reusable UI: buttons, modals, progress bars
│   ├── CSVUploader.tsx     ← Drag-and-drop CSV upload + column mapper
│   ├── LeadForm.tsx        ← Single lead input form
│   ├── ResultsTable.tsx    ← Generated icebreakers with copy/export
│   └── ProgressTracker.tsx ← Real-time CSV processing progress
├── lib/
│   ├── supabase.ts         ← Supabase client (browser + server)
│   ├── ai.ts               ← GPT-4o-mini integration + prompt builder
│   ├── queue.ts            ← Upstash Redis queue push/pop helpers
│   ├── cache.ts            ← Scraper cache layer (24hr TTL)
│   ├── scraper.ts          ← Cheerio website scraper with fallback
│   ├── lemonsqueezy.ts     ← Billing helpers + webhook verification
│   └── utils.ts            ← Shared utilities (validation, formatting)
├── prisma/
│   └── schema.prisma       ← Database models (User, Lead, Message, etc.)
├── middleware.ts            ← Auth guard for /dashboard routes
├── .env.local              ← All API keys (NEVER commit this file)
├── .gitignore
└── package.json


```

---

Environment Variables (.env.local)
Create this file in your project root. Never commit it to Git.
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key


# OpenAI
OPENAI_API_KEY=sk-your-openai-key


# Lemon Squeezy
LEMONSQUEEZY_API_KEY=your-ls-api-key
LEMONSQUEEZY_WEBHOOK_SECRET=your-webhook-secret
LEMONSQUEEZY_STORE_ID=your-store-id


# Upstash Redis
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token


# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
IMPORTANT
Add .env.local to your .gitignore immediately. Leaking API keys is the #1 security mistake beginners make. On Vercel, set these same variables in your project’s Settings → Environment Variables panel.




Database Schema Design
The Prisma models that power your entire application
Your database has 6 core models. Here is each one with its purpose and fields explained:

Model 1: User
Stores account info, subscription plan, and credit usage. Connected to Supabase Auth.
model User {
  id             String    @id @default(cuid())
  email          String    @unique
  name           String?
  plan           String    @default("free")  // free | pro_us | pro_in | scale
  creditLimit    Int       @default(10)       // 10 | 500 | 5000
  creditsUsed    Int       @default(0)
  lastResetDate  DateTime  @default(now())
  leads          Lead[]
  messages       GeneratedMessage[]
  jobs           ProcessingJob[]
  usageLogs      UsageLog[]
  createdAt      DateTime  @default(now())


}


Model 2: Lead
Each lead a user wants to generate an icebreaker for.
model Lead {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  name      String
  company   String
  title     String?
  website   String?
  email     String?
  messages  GeneratedMessage[]
  createdAt DateTime @default(now())
}

Model 3: GeneratedMessage
The AI-generated icebreakers with cost tracking for analytics.
model GeneratedMessage {
  id             String   @id @default(cuid())
  userId         String
  leadId         String
  icebreaker     String
  tokensUsed     Int
  estimatedCost  Float    // USD cost of this generation
  model          String   @default("gpt-4o-mini")
  createdAt      DateTime @default(now())
}


Model 4: ProcessingJob
Tracks bulk CSV processing jobs so the frontend can show real-time progress.
model ProcessingJob {
  id              String   @id @default(cuid())
  userId          String
  status          String   // pending | processing | completed | failed
  totalLeads      Int
  processedLeads  Int      @default(0)
  failedLeads     Int      @default(0)
  results         Json[]
  createdAt       DateTime @default(now())
}


Model 5: ScraperCache
Caches scraped company data for 24 hours to avoid IP blocking and speed up processing.
model ScraperCache {
  id        String   @id @default(cuid())
  domain    String   @unique
  content   String
  scrapedAt DateTime @default(now())
  expiresAt DateTime // scrapedAt + 24 hours
}

Model 6: UsageLog
Detailed per-generation logging for cost analytics and abuse detection.
model UsageLog {
  id             String   @id @default(cuid())
  userId         String
  action         String   // "icebreaker_generated"
  creditsUsed    Int      @default(1)
  tokensUsed     Int
  estimatedCost  Float
  model          String   // "gpt-4o-mini"
  metadata       Json?
  createdAt      DateTime @default(now())
}


## 🔧 Installation Commands (Run in order)

### 1. Install Supabase packages
```bash
npm install @supabase/supabase-js @supabase/ssr @supabase/auth-ui-react @supabase/auth-ui-shared
```

### 2. Install Prisma
```bash
npm install @prisma/client
npm install -D prisma
```

### 3. Initialize Prisma (if not done)
```bash
npx prisma init
```

### 4. Setup environment variables (.env file)
```bash
# Copy from Supabase dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Copy from Supabase dashboard → Settings → Database → Connection String → URI
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres

# Your site URL (for redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Run Prisma migration
```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## 📂 How to Use These Files

All files are named simply. Create the folders and rename files like this:

**Example: lib-prisma.ts → lib/prisma.ts**

1. Create folder: `mkdir -p lib`
2. Move file: `mv lib-prisma.ts lib/prisma.ts`

Do this for all files following the structure above.

---

## ✅ Verification Checklist

After setting up files, verify:

- [ ] `.env` file exists with all variables filled
- [ ] `prisma/schema.prisma` exists
- [ ] `lib/prisma.ts` exists
- [ ] `lib/supabase/` folder has 3 files (client.ts, server.ts, middleware.ts)
- [ ] `middleware.ts` exists at project root
- [ ] `components/LogoutButton.tsx` exists
- [ ] `app/auth/login/page.tsx` exists
- [ ] `app/auth/callback/route.ts` exists
- [ ] `app/dashboard/page.tsx` exists
- [ ] All npm packages installed
- [ ] Prisma migration completed successfully

---

## 🚀 Test Your Setup

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Visit login page**:
   ```
   http://localhost:3000/auth/login
   ```

3. **Expected behavior**:
   - See "Welcome to IcebreakerAI" page
   - See "Continue with Google" button
   - Click button → redirects to Google login
   - After login → redirects to `/dashboard`
   - Dashboard shows your stats (all zeros initially)

4. **Test logout**:
   - Click "Sign out" button in dashboard
   - Should redirect to `/auth/login`

5. **Test protected routes**:
   - While logged out, try visiting `/dashboard`
   - Should auto-redirect to `/auth/login`

---

## 🐛 Common Issues & Fixes

### Issue: "Module not found: @/lib/supabase/client"
**Fix**: Make sure files are in correct folders matching the import paths

### Issue: "Invalid redirect URL"
**Fix**: Check Google Cloud Console → Credentials → Authorized redirect URIs matches your Supabase URL exactly

### Issue: Database connection failed
**Fix**: 
- Verify DATABASE_URL has correct password
- Check if you need to URL-encode special characters in password
- Example: `p@ssw0rd` becomes `p%40ssw0rd`

---

**Need help?** Check the SUPABASE_AUTH_SETUP_GUIDE.md first!
