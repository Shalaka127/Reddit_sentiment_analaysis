const positiveWords = new Set([
  'good', 'great', 'awesome', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love',
  'best', 'perfect', 'beautiful', 'brilliant', 'outstanding', 'superb', 'happy', 'joy',
  'pleased', 'delighted', 'thrilled', 'excited', 'impressed', 'recommend', 'favorable',
  'positive', 'beneficial', 'valuable', 'helpful', 'useful', 'effective', 'successful'
]);

const negativeWords = new Set([
  'bad', 'terrible', 'awful', 'horrible', 'poor', 'worst', 'hate', 'disappointing',
  'disappointed', 'sad', 'angry', 'annoying', 'frustrating', 'useless', 'worthless',
  'broken', 'fail', 'failed', 'problem', 'issue', 'bug', 'error', 'wrong', 'negative',
  'harmful', 'waste', 'pathetic', 'ridiculous', 'stupid', 'dumb'
]);

const intensifiers = new Set([
  'very', 'extremely', 'absolutely', 'completely', 'totally', 'really', 'incredibly',
  'exceptionally', 'remarkably', 'utterly', 'particularly'
]);

const negators = new Set([
  'not', 'no', 'never', 'neither', 'nobody', 'nothing', 'nowhere', 'none', "n't", 'dont'
]);

export function calculateSentiment(text: string): { polarity: number; subjectivity: number } {
  if (!text || typeof text !== 'string') {
    return { polarity: 0.0, subjectivity: 0.0 };
  }

  const words = text.toLowerCase().match(/\b[\w']+\b/g) || [];

  let positiveScore = 0;
  let negativeScore = 0;
  let intensity = 1.0;
  let isNegated = false;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    if (negators.has(word)) {
      isNegated = true;
      continue;
    }

    if (intensifiers.has(word)) {
      intensity = 1.5;
      continue;
    }

    if (positiveWords.has(word)) {
      if (isNegated) {
        negativeScore += intensity;
      } else {
        positiveScore += intensity;
      }
      isNegated = false;
      intensity = 1.0;
    } else if (negativeWords.has(word)) {
      if (isNegated) {
        positiveScore += intensity;
      } else {
        negativeScore += intensity;
      }
      isNegated = false;
      intensity = 1.0;
    } else {
      isNegated = false;
      intensity = 1.0;
    }
  }

  const totalScore = positiveScore + negativeScore;
  const polarity = totalScore > 0
    ? (positiveScore - negativeScore) / totalScore
    : 0;

  const subjectivity = Math.min(totalScore / Math.max(words.length, 1), 1.0);

  return {
    polarity: Math.max(-1, Math.min(1, polarity)),
    subjectivity: Math.max(0, Math.min(1, subjectivity))
  };
}

export function getSentimentLabel(score: number): 'Positive' | 'Neutral' | 'Negative' {
  if (score >= 0.05) return 'Positive';
  if (score <= -0.05) return 'Negative';
  return 'Neutral';
}
