Phase 6 — Deploy, Test & GO LIVE 🚀
1. Push to GitHub → auto-deploy on Vercel
2. Set all env variables on Vercel dashboard (including Upstash Redis)
3. Run prisma db push on production Supabase
4. Activate Lemon Squeezy live mode
5. Full end-to-end test: signup → generate → pay → verify webhook
6. Test CSV upload with 10, 100, 500 row files — verify queue processing
7. Mobile responsiveness check
8. Test Lemon Squeezy → Payoneer → bKash flow


1. Push to GitHub → auto-deploy on Vercel
The Action: Commit all your final code and push it to your main branch on GitHub.

The Dev Task: Go to your Vercel dashboard, click "Add New Project," and import your icebreaker-saas GitHub repository. Vercel is deeply integrated with Next.js, so it will automatically detect the framework and configure the build settings. Once you click "Deploy," Vercel will attempt to build the app (this will fail initially because we haven't set the environment variables yet—which leads to step 2).

2. Set all env variables on Vercel dashboard
The Action: Go to your Vercel Project Settings > Environment Variables.

The Dev Task: Copy every key from your local .env.local file into Vercel.

CRITICAL CHECK: Ensure your production DATABASE_URL uses the pooled connection string (port 6543 with ?pgbouncer=true). If you paste the direct connection string here, your app will crash under load.

Add your Upstash Redis URL and Token, your OpenAI API key, and your Supabase URL/Anon key.

3. Run prisma db push on production Supabase
The Action: Your production database is currently empty. You need to push your Prisma schema to it.

The Dev Task: Do not try to run this from Vercel. Instead, temporarily replace the DIRECT_URL in your local .env file with your production Supabase direct connection string. Open your local terminal and run npx prisma db push. This creates all the tables (User, Lead, ProcessingJob, etc.) in your live database. Once it finishes, change your local .env back to your local/development database.

4. Activate Lemon Squeezy live mode
The Action: Switch your billing from "Test Mode" to "Live Mode."

The Dev Task: 1. Toggle "Live Mode" in the Lemon Squeezy dashboard.
2. Create a new Live API Key and a new Webhook Secret.
3. Update these new live keys in your Vercel Environment Variables and trigger a redeploy.
4. Create a new Webhook endpoint in Lemon Squeezy pointing to your live production URL (e.g., https://icebreakerai.com/api/webhooks/lemonsqueezy).

5. Full end-to-end test: signup → generate → pay → verify webhook
The Action: You must test the app exactly as a real customer would.

The Dev Task: Go to your live .vercel.app URL (or custom domain). Sign up with a personal Google account. Use the live demo. Then, click "Upgrade." To test the live payment gateway without losing money to fees, create a 100% off discount code in Lemon Squeezy, apply it at checkout, and complete the transaction. Verify that your webhook successfully catches the event and updates your user database record to the "Pro" plan.

6. Test CSV upload with 10, 100, 500 row files
The Action: Stress-test the Upstash Redis queue in the production serverless environment.

The Dev Task: Upload a CSV with 10 leads. Watch the UI polling. Does it complete? Now, upload a CSV with 500 leads. Because you are on Vercel, the browser connection might idle, but your Upstash queue workers should quietly process all 500 in the background. Check your Supabase database to confirm all 500 GeneratedMessage records were created successfully without any Vercel 504 Timeout errors.

7. Mobile responsiveness check
The Action: Open the live website on your actual phone.

The Dev Task: Don't just rely on Chrome DevTools. Test the UI on a real mobile device.

Does the CSV "drag-and-drop" zone elegantly fall back to a "Tap to browse files" button?

Does the data preview table scroll horizontally without breaking the page layout?

Does the Lemon Squeezy checkout modal render correctly on smaller screens?

8. Test Lemon Squeezy → Payoneer → bKash flow
The Action: Verify the final leg of the money flow.

The Dev Task: As noted in the blueprint, you won't see the money immediately due to the standard 13-day hold for new sellers. However, you must verify the connections today. Ensure your Payoneer account is successfully linked and verified as the payout method in Lemon Squeezy. Then, open your bKash app, navigate to the Remittance section, and ensure your Payoneer account is successfully linked so you are ready to withdraw instantly when the first payout drops on the 1st or 15th of the month.