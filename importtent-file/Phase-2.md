W2-3
Phase 2 — Core AI Icebreaker Engine + Caching
1. Build scraper with Cheerio to extract company context from websites
2. Add LinkedIn URL detection — bypass scraper for linkedin.com URLs NEW
3. Implement 24-hour cache layer for scraped company data (prevent IP blocking)
4. Build GPT-4o-mini integration — personalized icebreaker prompts
5. Create single lead form — manual input UI
6. Display generated icebreaker → copy to clipboard
7. Add spam word checker — flag deliverability risks before displaying NEW
8. Test with 50+ real leads — refine prompts

Here below Details 

1. Core AI Engine & Caching Logic
 Multi-Tier Scraper Architecture (Cheerio + Plan B)
Instead of relying on a single, heavy browser automation tool, you will implement a waterfall scraping strategy to balance speed, cost, and success rates.

Tier 1: Lightweight Scrape (Cheerio): Use axios or fetch to grab raw HTML and pass it to Cheerio to extract the <meta name="description">, <title>, and the first <p> tag for company context.

Tier 2: The "Plan B" Fallback: If Tier 1 returns an empty string or a 403/401 error (common with React/Next.js sites or Cloudflare), trigger a fallback to a headless service like Firecrawl or Browserless.io.

Context Extraction: This logic is housed in src/features/scraper/scraper.service.ts, ensuring the AI always has enough context to understand the company's value proposition.




2. Add LinkedIn URL Detection
LinkedIn aggressively blocks scrapers. If your server tries to fetch a linkedin.com profile, your server's IP will get banned almost instantly. You will write a simple guard clause: if (url.includes('linkedin.com')) return null;. This bypasses the scraper entirely and sends just the prospect's job title and company name to the AI.

3. Implement 24-Hour Cache Layer
Before scraping any website, you will query your ScraperCache table in Prisma.

Cache Hit: If the domain exists and expiresAt is in the future, return the text instantly. (0 latency, 0 bandwidth).

Cache Miss: Scrape the website, save the text to the database with tomorrow's timestamp, and then pass it to the AI. This prevents you from hammering the same company's website 100 times if a user uploads a list of 100 employees from the same company.

4. Build GPT-4o-mini Integration
This is your core API route (e.g., POST /api/generate). You will use the official OpenAI SDK. You need to craft a highly specific "System Prompt" that forces GPT-4o-mini to write short, natural, non-salesy opening lines using the variables you pass it (Name, Title, Company, Scraped Context).

5. Create Single Lead Form (UI)
Before building complex CSV uploads, build a simple React Client Component with four inputs: Name, Title, Company, and Website. This gives you a fast UI to manually test your scraper and AI prompt in real-time.

6. Copy to Clipboard
A tiny but critical UX feature. Use the native navigator.clipboard.writeText() API. Salespeople want to generate the text, click a button, and paste it straight into their Gmail or outreach tool.

7. Add Spam Word Checker
You will write a utility function containing an array of toxic sales words (e.g., ['guarantee', 'free', 'buy now', 'act fast']). Before your API returns the generated icebreaker to the frontend, you run the text through this checker. If it triggers a match, you send a flag to the frontend to render a yellow warning badge so the user knows to regenerate it.

8. Test with 50+ Real Leads (Prompt Engineering)
Code works exactly how you tell it to; AI does not. You must manually run 50 real salespeople, CEOs, and developers through your form. You will notice the AI sometimes hallucinates or sounds robotic. You will spend a lot of time tweaking your OpenAI prompt instructions (e.g., "Never use exclamation marks," "Keep it under 15 words") until the outputs are consistently excellent.