import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// GPT-4o-mini pricing (as of 2024)
const INPUT_COST_PER_TOKEN = 0.15 / 1_000_000  // $0.15 per 1M input tokens
const OUTPUT_COST_PER_TOKEN = 0.60 / 1_000_000 // $0.60 per 1M output tokens

const SYSTEM_PROMPT = `You are an expert B2B sales copywriter. Your job is to write a single personalized icebreaker opening line for a cold email or LinkedIn message.

Rules:
- Maximum 20 words. Shorter is better.
- Reference something SPECIFIC about their company or role. Never be generic.
- Sound like a real human, not a salesperson. No corporate buzzwords.
- Never use exclamation marks.
- Never start with "I" — start with "you", "your", or their name.
- Never use these words: synergy, leverage, circle back, touch base, game-changer, revolutionary.
- Never compliment them directly (no "impressive", "amazing work").
- If company context is provided, reference a specific detail from it.
- If no company context, use their job title and company name creatively.
- Output ONLY the icebreaker line. No quotes, no explanation, nothing else.`

interface GenerateParams {
  name: string
  title: string
  company: string
  companyContext: string | null
}

interface GenerateResult {
  message: string
  tokensUsed: number
  estimatedCost: number
}

export async function generateIcebreaker(params: GenerateParams): Promise<GenerateResult> {
  const { name, title, company, companyContext } = params

  const contextLine = companyContext
    ? companyContext
    : 'No website data available — use their title and company name.'

  const userPrompt = `Write a cold email icebreaker for ${name}, who is ${title} at ${company}.\nCompany context: ${contextLine}`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.8,
    max_tokens: 60,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
  })

  const message = completion.choices[0]?.message?.content?.trim() ?? ''
  const promptTokens = completion.usage?.prompt_tokens ?? 0
  const completionTokens = completion.usage?.completion_tokens ?? 0
  const tokensUsed = promptTokens + completionTokens
  const estimatedCost =
    promptTokens * INPUT_COST_PER_TOKEN + completionTokens * OUTPUT_COST_PER_TOKEN

  return { message, tokensUsed, estimatedCost }
}
