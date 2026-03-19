# 🚀 Quick Start - Supabase Auth Setup

## What You Got

✅ **2 Setup Guides** - Complete instructions  
✅ **9 Code Files** - Ready to use  
✅ **1 Database Schema** - Prisma schema  

---

## 📋 Step-by-Step Instructions

### Step 1: Read the Setup Guide
Open `SUPABASE_AUTH_SETUP_GUIDE.md` and follow ALL steps (takes 30-40 min)

This will help you:
- Create Supabase project
- Setup Google OAuth
- Get all credentials
- Configure everything

### Step 2: Install Dependencies
```bash
npm install @supabase/supabase-js @supabase/ssr @supabase/auth-ui-react @supabase/auth-ui-shared
npm install @prisma/client
npm install -D prisma
```

### Step 3: Setup Your Project Files

**Create these folders:**
```bash
mkdir -p lib/supabase
mkdir -p components
mkdir -p app/auth/login
mkdir -p app/auth/callback
mkdir -p app/dashboard
```

**Move files to correct locations:**
```
middleware.ts           → (project root)/middleware.ts
lib-prisma.ts          → lib/prisma.ts
lib-supabase-client.ts → lib/supabase/client.ts
lib-supabase-server.ts → lib/supabase/server.ts
lib-supabase-middleware.ts → lib/supabase/middleware.ts
LogoutButton.tsx       → components/LogoutButton.tsx
login-page.tsx         → app/auth/login/page.tsx
auth-callback.ts       → app/auth/callback/route.ts
dashboard-page.tsx     → app/dashboard/page.tsx
schema.prisma          → prisma/schema.prisma
```

### Step 4: Create .env File
```bash
# Create .env in project root
touch .env
```

Add this content (get values from Supabase dashboard):
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 5: Run Database Migration
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Step 6: Test It!
```bash
npm run dev
```

Visit: `http://localhost:3000/auth/login`

---

## ✅ What Should Happen

1. **Login Page** - Beautiful Google OAuth button
2. **Click "Continue with Google"** - Redirects to Google
3. **Sign in with Google** - Use your test user email
4. **Redirect to Dashboard** - See your stats (all zeros)
5. **Test Logout** - Click "Sign out", back to login

---

## 🐛 Common Issues

**"Module not found"**
- Check file locations match the structure guide
- Make sure folder names are correct

**"Invalid redirect URL"**  
- Verify Google Cloud Console redirect URI matches Supabase exactly

**"Database error"**
- Check DATABASE_URL password is correct
- Try URL encoding special characters

**"Access blocked"**
- Add your email as test user in Google OAuth consent screen

---

## 📚 Documentation Files

1. **SUPABASE_AUTH_SETUP_GUIDE.md** - Complete Supabase + Google OAuth setup
2. **FILE_STRUCTURE_GUIDE.md** - Where to put each file
3. **This file (README.md)** - Quick reference

---

## 🎯 What's Next?

After auth is working:
1. Build CSV upload feature
2. Create lead management
3. Add Claude AI icebreaker generation
4. Setup Lemon Squeezy payments
5. Deploy to production

---

## 💡 Tips

- Follow the guides in order
- Don't skip steps in SUPABASE_AUTH_SETUP_GUIDE.md
- Save all credentials securely
- Test each step before moving forward

---

**Questions?** Check the troubleshooting sections in the setup guides!

Good luck! 🚀
