# 🔐 Supabase Auth Setup Guide
## Cold Email Icebreaker Generator - Google OAuth Only

---

## **PART 1: Configure Supabase Project**

### Step 1: Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"New Project"**
3. Fill in:
   - **Project Name**: `icebreaker-ai` (or your choice)
   - **Database Password**: Generate a strong password (SAVE THIS!)
   - **Region**: Choose closest to your users (e.g., `Southeast Asia (Singapore)` for Bangladesh)
   - **Pricing Plan**: Free tier is fine to start
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup to complete

### Step 2: Get Your Supabase Credentials
1. In your Supabase project dashboard, click **"Settings"** (gear icon in sidebar)
2. Go to **"API"** section
3. Copy these values (you'll need them later):
   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (keep secret!)
   ```

---

## **PART 2: Setup Google OAuth**

### Step 3: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click **"Select a project"** → **"New Project"**
3. Enter:
   - **Project Name**: `IcebreakerAI`
   - **Location**: Leave default
4. Click **"Create"**
5. Wait for project creation, then **select the project**

### Step 4: Enable Google+ API
1. In your Google Cloud project, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"**
3. Click on it, then click **"Enable"**

### Step 5: Configure OAuth Consent Screen
1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"** (unless you have Google Workspace)
3. Click **"Create"**
4. Fill in the form:
   
   **App information:**
   - **App name**: `IcebreakerAI`
   - **User support email**: your email
   - **App logo**: (optional, upload your logo if you have one)
   
   **App domain:**
   - **Application home page**: `https://yourdomain.com` (or leave blank for now)
   - **Authorized domains**: (leave blank for now, add later when you have a domain)
   
   **Developer contact information:**
   - **Email addresses**: your email
   
5. Click **"Save and Continue"**

6. **Scopes page**:
   - Click **"Add or Remove Scopes"**
   - Select these scopes:
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
     - `openid`
   - Click **"Update"** → **"Save and Continue"**

7. **Test users** (while in development):
   - Click **"Add Users"**
   - Add your email and team members' emails
   - Click **"Save and Continue"**

8. Click **"Back to Dashboard"**

### Step 6: Create OAuth Credentials
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. Select:
   - **Application type**: `Web application`
   - **Name**: `IcebreakerAI Web Client`

4. **Authorized JavaScript origins**:
   - Click **"Add URI"**
   - Add: `http://localhost:3000` (for local development)
   - Add: `https://yourdomain.com` (when you deploy)

5. **Authorized redirect URIs**:
   - Click **"Add URI"**
   - Add: `https://xxxxxxxxxxxxx.supabase.co/auth/v1/callback`
     - ⚠️ Replace `xxxxxxxxxxxxx` with your actual Supabase project URL
   - For local testing, also add: `http://localhost:54321/auth/v1/callback`

6. Click **"Create"**
7. **SAVE THESE CREDENTIALS**:
   ```
   Client ID: 1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
   Client secret: GOCSPX-xxxxxxxxxxxxxxxxxxxxx
   ```

---

## **PART 3: Configure Supabase Auth Provider**

### Step 7: Enable Google Provider in Supabase
1. Go to your Supabase project dashboard
2. Click **"Authentication"** in the sidebar
3. Click **"Providers"** tab
4. Find **"Google"** in the list
5. Toggle it **ON** (enabled)
6. Paste your Google credentials:
   - **Client ID**: (paste from Step 6)
   - **Client Secret**: (paste from Step 6)
7. Click **"Save"**

### Step 8: Configure Auth Settings
1. Still in **Authentication** → **"Settings"** tab
2. Find **"Site URL"**:
   - For development: `http://localhost:3000`
   - For production: `https://yourdomain.com`
3. Find **"Redirect URLs"**:
   - Add: `http://localhost:3000/**` (for development)
   - Add: `https://yourdomain.com/**` (for production)
4. Click **"Save"**

---

## **PART 4: Setup Database Schema**

### Step 9: Run Prisma Migration
Now that Supabase is configured, let's create the database tables.

1. **Create `.env` file** in your project root:
   ```bash
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   # Database (from Supabase Settings → Database)
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
   DIRECT_URL=postgresql://postgres:[PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
   
   # Lemon Squeezy (add later)
   LEMON_SQUEEZY_API_KEY=
   LEMON_SQUEEZY_STORE_ID=
   LEMON_SQUEEZY_WEBHOOK_SECRET=
   
   # Claude AI (add later)
   ANTHROPIC_API_KEY=
   ```

2. **Get your Database URL**:
   - In Supabase, go to **"Settings"** → **"Database"**
   - Scroll to **"Connection string"**
   - Select **"URI"** tab
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your database password from Step 1
   - Paste into `.env` as `DATABASE_URL`

3. **Install dependencies**:
   ```bash
   npm install @prisma/client
   npm install -D prisma
   ```

4. **Initialize Prisma** (if not done):
   ```bash
   npx prisma init
   ```

5. **Copy your schema.prisma** file to `prisma/schema.prisma`

6. **Run migration**:
   ```bash
   npx prisma migrate dev --name init
   ```
   This creates all your database tables!

7. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

---

## **PART 5: Install Supabase Auth Dependencies**

### Step 10: Install Required Packages
```bash
npm install @supabase/supabase-js @supabase/ssr @supabase/auth-ui-react @supabase/auth-ui-shared
```

---

## **VERIFICATION CHECKLIST**

Before moving to code, verify you have:

- ✅ Supabase project created
- ✅ Supabase URL and keys saved in `.env`
- ✅ Google Cloud project created
- ✅ Google OAuth credentials created
- ✅ Google provider enabled in Supabase
- ✅ Redirect URLs configured in both Google and Supabase
- ✅ Database URL in `.env`
- ✅ Prisma migration completed successfully
- ✅ All npm packages installed

---

## **TROUBLESHOOTING**

### Issue: "Invalid redirect URL"
**Solution**: Make sure the redirect URL in Google Cloud Console exactly matches:
```
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

### Issue: "OAuth consent screen not configured"
**Solution**: Complete Step 5 (OAuth consent screen setup) before creating credentials

### Issue: "Access blocked: This app's request is invalid"
**Solution**: 
- Check that you added test users in OAuth consent screen
- Make sure you're using an email added as a test user
- Verify your app is in "Testing" mode (not "In production" yet)

### Issue: Database connection failed
**Solution**:
- Check password in DATABASE_URL is correct
- Verify no special characters need URL encoding
- Make sure connection string format is correct

---

**Ready to proceed?** Once you complete these steps, use the code files provided! 🚀



<!-- eh.emon3059@gmail.com's Org
Cold Email Icebreaker
Mylife@3059Year2026 -->