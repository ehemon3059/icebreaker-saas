Phase 3 — CSV Upload & Queue System (CRITICAL)
1. Build drag-and-drop CSV upload component
2. Parse CSV with papaparse + column mapping UI
3. Preview & validate leads before processing
4. Implement Upstash Redis queue for background processing (DO NOT skip this)
5. Process CSV rows asynchronously via queue workers
6. Real-time progress updates using websockets or polling
7. Results table with copy/export/regenerate
8. Export results as downloadable CSV

Here is Details Explanation

Phase 3: CSV Upload & Background Queue System
1. Build Drag-and-Drop CSV Upload Component
You will build a React component (using a library like react-dropzone or native HTML5 drag events) that accepts .csv files. This is the entry point for your bulk feature.

2. Parse CSV with Papaparse + Column Mapping UI
Do not send the raw CSV file to your server. Use the papaparse library to parse the CSV entirely on the client-side (in the browser). Since every user has a different CSV structure, you must build a UI that asks them: "Which column contains the Name? Which column contains the Website?" so you can map their messy data to your strict database schema.
Risk: If a user uploads a 50MB CSV with 50,000 rows (even if they only have 500 credits), the browser tab might crash.
Advice: Implement a file size limit (e.g., 5MB) on the frontend react-dropzone before parsing begins.

3. Preview & Validate Leads
Before charging credits or starting the engine, render a table showing the first 5 rows of their parsed data. Run a validation check to strip out empty rows, remove duplicates, and ensure every lead has at least a Name and a Company/Website. If it's broken, let them fix it here, not after they've wasted credits.

4. Implement Upstash Redis Queue (CRITICAL)
If you try to process 200 leads in a standard Vercel API route, Vercel will kill your function after 10 to 60 seconds, and the user will get a 504 Gateway Timeout error.

The Fix: When the user hits "Start", your Next.js API simply pushes a JSON string of those 200 leads into an Upstash Redis List (e.g., redis.lpush), creates a ProcessingJob record in your database with status: 'pending', and immediately returns a 200 OK to the frontend.

5. Process Rows Asynchronously via Queue Workers
You will create a background worker (either a Vercel Cron Job, an Inngest function, or a separate worker route) that constantly pulls leads out of the Upstash Redis queue. For each lead, it runs your Cheerio scraper and GPT-4o-mini prompt, saves the resulting icebreaker to the database, and increments the processedLeads count in your ProcessingJob table.

6. Real-Time Progress Updates (Polling)
Since the server is processing leads in the background, the frontend needs to know what's happening. You will set up a simple setInterval on the frontend that hits a /api/jobs/[id]/status route every 3 seconds. It reads processedLeads out of the database and updates a visual progress bar (e.g., "Generated 45 / 200 Icebreakers").

7. Results Table with Copy/Regenerate
Once the job status hits 'completed', render a data table showing all the successful icebreakers. Include a "Copy" button for quick pasting, and a "Regenerate" button that runs a single lead through the AI again in case the prompt hallucinated or output something weird.

8. Export Results as Downloadable CSV
Salespeople need to load these icebreakers into tools like Lemlist or Instantly. You will use papaparse.unparse() to convert your database JSON back into a CSV format, create a Blob in the browser, and trigger an automatic file download containing their original data plus a new "Icebreaker" column.



1. The "Closed Tab" Problem

The Issue: Your frontend is polling for progress every 3 seconds. What happens if the user gets bored, closes the browser tab, and comes back 10 minutes later?

The Fix: The background worker is still processing the job (which is great!), but the user needs a way to find their results. Make sure your Dashboard has a "Recent Jobs" or "History" tab that fetches all ProcessingJob records for that user, so they can download their completed CSVs even if they closed the window during processing.

2. The Redis Payload Size Limit

The Issue: In Step 4, if you push a JSON string of 200 leads into Redis, it's totally fine. But your "Scale" plan allows 5,000 credits. Pushing an array of 5,000 lead objects into a single Redis message might hit payload size limits or cause memory spikes.

The Fix: Instead of putting all the lead data inside the Redis message, save the parsed leads to your Supabase Lead table first. Then, just push the jobId and an array of leadIds into the Redis queue. The background worker can then pull the actual lead data from Supabase one by one.



 WHY QUEUE SYSTEM IS MANDATORY IN PHASE 3

Vercel serverless functions timeout after 10-60 seconds depending on your plan. Processing 200-500 leads synchronously will always fail. You must implement a background queue (Upstash Redis, Inngest, or Vercel Background Functions) in this phase, not later. The queue allows you to process leads asynchronously in the background while showing real-time progress to the user. This is not optional.



✓ QUEUE PROGRESS UI — KEEP USERS INFORMED

Users need real-time feedback while their CSV processes in the background. Implement a polling mechanism where the frontend checks job status every 3 seconds and updates a progress bar.

// Database schema for job tracking
model ProcessingJob {
  id            String   @id @default(cuid())
  userId         String
  status         String   // "pending", "processing", "completed", "failed"
  totalLeads     Int
  processedLeads Int     @default(0)
  failedLeads    Int     @default(0)
  results        Json[]  // Array of generated icebreakers
  createdAt      DateTime @default(now())
}

// Frontend: Poll for progress every 3 seconds
const pollJobStatus = async (jobId: string) => {
  const interval = setInterval(async () => {
    const res = await fetch(`/api/jobs/${jobId}/status`);
    const job = await res.json();

    // Update progress bar
    const progress = (job.processedLeads / job.totalLeads) * 100;
    setProgressPercent(progress);
    setStatus(`Processing ${job.processedLeads}/${job.totalLeads} leads...`);

    if (job.status === "completed" || job.status === "failed") {
      clearInterval(interval);
      displayResults(job.results);
    }
  }, 3000); // Poll every 3 seconds
};

// Backend: Update job progress after each lead
await db.processingJob.update({
  where: { id: jobId },
  data: {
    processedLeads: { increment: 1 },
    results: { push: generatedIcebreaker }
  }
});


⚠️ HANDLE SCRAPER FAILURES GRACEFULLY

Some websites block scrapers with Cloudflare's "I am human" checks or WAF protection. Your AI prompt must work even when scraping fails. Generate a generic icebreaker based only on name and job title.

// Scraper with fallback handling
async function getCompanyContext(domain: string) {
  try {
    // 1. Check cache first
    const cached = await db.scraperCache.findUnique({ where: { domain } });
    if (cached && cached.expiresAt > new Date()) return cached.content;

    // 2. Attempt scrape
    const response = await axios.get(`https://${domain}`, {
      timeout: 5000,
      headers: { 'User-Agent': 'Mozilla/5.0...' }
    });

    const $ = cheerio.load(response.data);
    const content = $('meta[name="description"]').attr('content') ||
                   $('p').first().text() || "";

    // 3. Cache the result
    if (content) {
      await db.scraperCache.create({ data: { domain, content, ... } });
    }

    return content || null;

  } catch (error) {
    // Scraper failed (Cloudflare, timeout, 403, etc.)
    console.error(`Scrape failed for ${domain}:`, error.message);
    return null; // Return null, not an error
  }
}

// AI Prompt Builder — works with or without company context
function buildPrompt(lead, companyContext) {
  if (companyContext) {
    // Full personalized icebreaker
    return `Generate a personalized icebreaker for ${lead.name},
      ${lead.title} at ${lead.company}.
      Company context: ${companyContext}
      Make it specific and relevant.`;
  } else {
    // Generic but professional icebreaker (scrape failed)
    return `Generate a professional icebreaker for ${lead.name},
      ${lead.title} at ${lead.company}.
      Focus on their role and industry. Be warm and relevant
      even without specific company details.`;
  }
}

// Main generation flow
const companyContext = await getCompanyContext(lead.website);
const prompt = buildPrompt(lead, companyContext);
const icebreaker = await openai.chat.completions.create({ ... });
Result: If the scraper fails, the AI still generates a solid icebreaker based on job title and company name. The user gets value even when scraping is blocked.

Checkpoint: Upload CSV → bulk icebreakers (via queue) → export. This is the paid feature.