Phase 5 — Landing Page & Launch Prep
1. Hero section — clear value prop + CTA
2. "How It Works" — 3-step visual
3. Live demo — 1 free generation for visitors
4. Pricing section — show 3 plans
5. FAQ + social proof section
6. SEO meta tags + Open Graph
7. Build programmatic SEO pages: /icebreakers/[industry] NEW
8. Generate static content for 8-10 industry landing pages with GPT-4o-mini NEW
9. Error tracking (Sentry) + Analytics (PostHog)
10. Rate limiting on API routes
11. Terms of Service + Privacy Policy pages
12. Custom domain on Vercel


Here Is details Explanation 


1. Hero section — clear value prop + CTA
The Code: Build this at the top of app/page.tsx. Use Tailwind CSS to create a massive h1 headline, a sub-headline, and a primary Call To Action (CTA) button.

The Dev Task: Don't build complex animations here. Your CTA button should either scroll the user down to the Live Demo or route them straight to /signup. Keep the UI entirely focused on getting that first click.

2. "How It Works" — 3-step visual
The Code: Create a simple 3-column grid (grid-cols-1 md:grid-cols-3) using Tailwind.

The Dev Task: Use a library like lucide-react for clean icons (Upload, Sparkles, Download). Keep the text incredibly brief. Users don't read; they scan.

3. Live demo — 1 free generation for visitors
The Code: Build a Client Component form (<form>) with inputs for Name, Role, and Company.

The Dev Task: Create a new API route specifically for this: POST /api/generate-demo. It should run the Cheerio scraper and GPT-4o-mini prompt just like your main app, but without requiring Supabase authentication. Render the result right there on the page so the user experiences the "aha!" moment instantly.

4. Pricing section — show 3 plans
The Code: Build three pricing cards (Free, Pro, Scale). Highlight the Pro plan with a distinct border or background color (e.g., border-green-500).

The Dev Task: Wire up the "Upgrade" buttons. If they are logged out, route them to /signup. If they are logged in, trigger the Lemon Squeezy checkout overlay (using Lemon.js), passing their Supabase user.id in the custom_data object so your webhook knows who paid.

5. FAQ + social proof section
The Code: Build a simple accordion component using React state (useState) to toggle open/closed answers.

The Dev Task: Hardcode the answers to the biggest objections (e.g., "Do you charge for failed scrapes?", "How do credits work?"). For social proof, since you have no users yet, use quotes from friends you let beta test it, or simply leave the social proof section out until week 2.

6. SEO meta tags + Open Graph
The Code: Utilize the Next.js Metadata API. In your layout.tsx and page.tsx, export a metadata object.

The Dev Task: Define the title, description, and openGraph properties. Create a 1200x630 image (even just a screenshot of your hero section) and put it in your public folder. Link it in the metadata so when people share your site on Twitter or LinkedIn, a massive, clickable preview image appears.

7. Build programmatic SEO pages: /icebreakers/[industry]
The Code: Create a new dynamic folder structure: app/icebreakers/[industry]/page.tsx.

The Dev Task: Use the Next.js generateStaticParams() function to return an array of industries (e.g., ['saas', 'real-estate', 'agencies']). This forces Next.js to pre-render static HTML pages for each industry at build time, making them lightning-fast and perfectly indexed by Google.

8. Generate static content for 8-10 industry landing pages
The Code: Create a data/industries.json file in your repository.

The Dev Task: You don't want to call GPT-4o-mini every time someone loads these SEO pages—that costs money. Instead, write a quick local Node script (or just use ChatGPT manually) to generate 5 perfect icebreaker examples for each industry. Save them in the JSON file. Your dynamic page from Step 7 simply imports this JSON and maps over the examples.

9. Error tracking (Sentry) + Analytics (PostHog)
The Code: Run npx @sentry/wizard@latest -i nextjs in your terminal. Then, npm install posthog-js.

The Dev Task: Sentry's wizard will automatically wrap your Next.js config so any database crashes or server timeouts instantly ping your email. For PostHog, wrap your root layout in a <PostHogProvider> so you can see heatmaps and track exactly where users click.

10. Rate limiting on API routes
The Code: Use @upstash/ratelimit (you already have Upstash for the Redis queue).

The Dev Task: This is mandatory for your Live Demo endpoint. Write a middleware or put logic directly in /api/generate-demo that tracks the user's IP address. Limit it to 2 requests per 24 hours. If they hit a 3rd, return a 429 Too Many Requests status with a message telling them to sign up.

11. Terms of Service + Privacy Policy pages
The Code: Create basic static pages: app/terms/page.tsx and app/privacy/page.tsx.

The Dev Task: Do not overthink or over-engineer this. Google "free SaaS privacy policy generator." Copy the text, paste it into your Next.js components, and link them in your footer. Both Google OAuth and Lemon Squeezy require these links to exist before they approve your production accounts.

12. Custom domain on Vercel
The Code: Zero code required.

The Dev Task: Buy a domain on Namecheap or Cloudflare. Go to your Vercel Project Dashboard -> Settings -> Domains. Add your domain. Vercel will give you a specific A record and CNAME to copy/paste into your domain registrar. Wait 5 minutes, and Vercel automatically secures it with a free SSL certificate.
