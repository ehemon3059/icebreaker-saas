Phase 4 — Billing (Lemon Squeezy) + Usage Caps
1. Create products & variants in Lemon Squeezy dashboard
2. Free ($0), Pro ($29/mo), Scale ($79/mo) plans
3. Integrate Lemon Squeezy checkout overlay on pricing page
4. Build POST /api/webhooks/lemonsqueezy — handle subscription events
5. Events: subscription_created, subscription_updated, subscription_cancelled
6. Update user plan in database on webhook trigger
7. Build usage tracking with hard caps per plan (Free: 10, Pro: 500, Scale: 5,000)
8. Implement fair use policy enforcement — block over-limit usage
9. Setup Payoneer as payout destination in Lemon Squeezy

1. Create products & variants in Lemon Squeezy dashboard
The Config: You do not write code for this step. Log into your Lemon Squeezy dashboard, go to Store > Products, and create a new product called "IcebreakerAI".

The Dev Task: Under this single product, you will create "Variants." Think of the Product as the app itself, and the Variants as the pricing tiers. After you create them, look at the URL or the API settings to find the specific Variant IDs (they are usually numbers). You will copy these IDs and paste them into your Next.js .env.local file so your frontend knows which checkout to open.

2. Free ($0), Pro ($29/mo), Scale ($79/mo) plans
The Config: When setting up the variants, configure "Pro" as a recurring $29/month subscription and "Scale" as $79/month.

The Dev Task: Pro tip: You actually don't need to create a "Free" product in Lemon Squeezy. The "Free" plan is simply the default state of a user in your Supabase database when they sign up. Lemon Squeezy is only triggered when money needs to change hands.

3. Integrate Lemon Squeezy checkout overlay on pricing page
The Code: Add the Lemon.js script to your application. Bind an onClick event to your "Upgrade" buttons on the pricing cards.

The Dev Task: When calling the LemonSqueezy.Url.Open() function, you must pass a custom_data object containing the user's Supabase ID (e.g., custom_data: { user_id: user.id }). If you forget this step, a user will pay you $29, but your backend won't know which account to upgrade!

4. Build POST /api/webhooks/lemonsqueezy
The Code: Create a new Next.js App Router endpoint at app/api/webhooks/lemonsqueezy/route.ts.

The Dev Task: This is a major security checkpoint. Anyone can send a POST request to this URL to try and fake a payment. You must read the x-signature header from the incoming request and use Node's crypto module to hash the raw request body with your LEMONSQUEEZY_WEBHOOK_SECRET. If the hashes match, the request is legitimately from Lemon Squeezy.

5. Events: subscription_created, subscription_updated, subscription_cancelled
The Code: Inside your verified webhook route, parse the JSON body and write a switch statement based on payload.meta.event_name.

The Dev Task: Lemon Squeezy sends dozens of event types, but you only care about these three to manage access. Extract the custom_data.user_id and the variant_id from the payload so you know exactly who the user is and what plan they interacted with.

6. Update user plan in database on webhook trigger
The Code: Inside the switch statement cases, write your Prisma queries.

The Dev Task: * If subscription_created or updated: await db.user.update({ where: { id: userId }, data: { plan: 'pro', creditLimit: 500 } }). Also, create/update a record in your Subscription table so you have a history of their billing status.

If subscription_cancelled: Update the user's plan back to 'free' and their limit back to 10.

7. Build usage tracking with hard caps per plan
The Code: This happens in your core AI generation route (e.g., app/api/generate/route.ts), not the webhook.

The Dev Task: Before making the call to OpenAI, use Prisma to check the user: const user = await db.user.findUnique(...). If they generate an icebreaker successfully, wrap your Prisma calls in a transaction (db.$transaction) to log the generated message and increment their creditsUsed count by 1 at the exact same time.

8. Implement fair use policy enforcement
The Code: A simple if statement right after you fetch the user in Step 7.

The Dev Task: if (user.creditsUsed >= user.creditLimit) { return NextResponse.json({ error: "Limit reached" }, { status: 403 }) }. On the frontend, catch this 403 error and display a beautiful Tailwind modal that says, "You've hit your limit! Upgrade to Pro to keep generating." This is the friction point that drives revenue.

9. Setup Payoneer as payout destination in Lemon Squeezy
The Config: This is pure business administration. In your Lemon Squeezy dashboard, navigate to Settings > Payouts.

The Dev Task: Select Payoneer as your payout method and link your account. Remember the reality check from the blueprint: Lemon Squeezy holds funds for your first few sales for about 13 days to prevent fraud. After that, payouts will flow automatically to your Payoneer on the 1st and 15th of the month.

// Example logic inside /api/generate
const user = await db.user.findUnique({ where: { id: userId } });

if (user.creditsUsed >= user.creditLimit) {
  return NextResponse.json(
    { error: "Credit limit reached. Please upgrade your plan." },
    { status: 403 }
  );
}

// If they have credits, proceed with GPT-4o-mini generation...
// Then update the database:
await db.user.update({
  where: { id: userId },
  data: { creditsUsed: { increment: 1 } }
});



LEMON SQUEEZY WEBHOOK EVENTS TO HANDLE

subscription_created → activate user plan
subscription_updated → upgrade/downgrade plan
subscription_cancelled → revert to free
subscription_payment_success → log payment
subscription_payment_failed → notify user, grace period

Checkpoint: Users can pay, subscribe, and access gated features. You have a monetizable product!