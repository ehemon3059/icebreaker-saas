import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Claude Haiku 4.5 pricing
const INPUT_COST_PER_TOKEN  = 0.80 / 1_000_000  // $0.80 per 1M input tokens
const OUTPUT_COST_PER_TOKEN = 4.00 / 1_000_000  // $4.00 per 1M output tokens

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

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 60,
    temperature: 0.8,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const content = response.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type from Claude')

  const message = content.text.trim()
  const inputTokens  = response.usage.input_tokens
  const outputTokens = response.usage.output_tokens
  const tokensUsed   = inputTokens + outputTokens
  const estimatedCost =
    inputTokens * INPUT_COST_PER_TOKEN + outputTokens * OUTPUT_COST_PER_TOKEN

  return { message, tokensUsed, estimatedCost }
}
