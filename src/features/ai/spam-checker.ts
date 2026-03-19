// Words and phrases that hurt cold email deliverability.
// Checked against every generated icebreaker before saving.
const SPAM_WORDS: string[] = [
  'guarantee',
  'free',
  'buy now',
  'act fast',
  'limited time',
  'no obligation',
  'risk-free',
  'click here',
  'earn money',
  'double your',
  'congratulations',
  'winner',
  'selected',
  'exclusive deal',
  'urgent',
  "don't miss",
  '100%',
  'no cost',
  'order now',
  'subscribe',
  'dear friend',
  'once in a lifetime',
  'act immediately',
  'apply now',
  'billion',
  'million dollars',
  'cash bonus',
  'credit card',
  'incredible deal',
  'lowest price',
  'money back',
  'prize',
  'promise',
  'satisfaction guaranteed',
  'special promotion',
  "this isn't spam",
  'unsubscribe',
  "you've been selected",
]

export interface SpamCheckResult {
  isClean: boolean
  flaggedWords: string[]
  severity: 'none' | 'low' | 'high'
}

// Escape special regex characters in a literal string
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Build a whole-word regex for a word or phrase.
// \b anchors work on both sides for single words and multi-word phrases.
function buildWordPattern(word: string): RegExp {
  return new RegExp(`\\b${escapeRegex(word)}\\b`, 'i')
}

export function checkForSpam(text: string): SpamCheckResult {
  const flaggedWords = SPAM_WORDS.filter((word) => buildWordPattern(word).test(text))

  let severity: SpamCheckResult['severity'] = 'none'
  if (flaggedWords.length === 1) severity = 'low'
  else if (flaggedWords.length >= 2) severity = 'high'

  return {
    isClean: flaggedWords.length === 0,
    flaggedWords,
    severity,
  }
}

// Backwards-compatible alias used by existing imports
export const checkSpam = checkForSpam
