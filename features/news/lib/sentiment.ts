const positiveWords = ['beat', 'growth', 'surge', 'record', 'profit', 'upgrade', 'strong', 'improves'];
const negativeWords = ['miss', 'loss', 'fall', 'drop', 'downgrade', 'weak', 'lawsuit', 'pressure'];

export function scoreSentiment(text: string) {
  const lower = text.toLowerCase();
  let score = 0;
  for (const word of positiveWords) if (lower.includes(word)) score += 1;
  for (const word of negativeWords) if (lower.includes(word)) score -= 1;
  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  return 'neutral';
}
