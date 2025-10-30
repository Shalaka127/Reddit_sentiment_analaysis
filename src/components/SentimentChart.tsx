import { SentimentData } from '../types/reddit';

interface SentimentChartProps {
  data: SentimentData[];
  title: string;
}

export default function SentimentChart({ data, title }: SentimentChartProps) {
  const positive = data.filter(d => d.sentiment === 'Positive').length;
  const neutral = data.filter(d => d.sentiment === 'Neutral').length;
  const negative = data.filter(d => d.sentiment === 'Negative').length;
  const total = data.length;

  const positivePercent = (positive / total) * 100;
  const neutralPercent = (neutral / total) * 100;
  const negativePercent = (negative / total) * 100;

  const subredditStats = data.reduce((acc, item) => {
    if (!acc[item.subreddit]) {
      acc[item.subreddit] = { sum: 0, count: 0 };
    }
    acc[item.subreddit].sum += item.polarity;
    acc[item.subreddit].count += 1;
    return acc;
  }, {} as Record<string, { sum: number; count: number }>);

  const subredditAverages = Object.entries(subredditStats)
    .map(([subreddit, stats]) => ({
      subreddit,
      average: stats.sum / stats.count
    }))
    .sort((a, b) => b.average - a.average)
    .slice(0, 8);

  const maxAbsAvg = Math.max(...subredditAverages.map(s => Math.abs(s.average)));

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">{title}</h4>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-700">Positive</span>
              <span className="text-sm font-semibold text-green-700">{positive} ({positivePercent.toFixed(1)}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
              <div
                className="bg-green-500 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${positivePercent}%` }}
              >
                {positivePercent > 5 && (
                  <span className="text-xs font-medium text-white">{positivePercent.toFixed(0)}%</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Neutral</span>
              <span className="text-sm font-semibold text-gray-700">{neutral} ({neutralPercent.toFixed(1)}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
              <div
                className="bg-gray-500 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${neutralPercent}%` }}
              >
                {neutralPercent > 5 && (
                  <span className="text-xs font-medium text-white">{neutralPercent.toFixed(0)}%</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-red-700">Negative</span>
              <span className="text-sm font-semibold text-red-700">{negative} ({negativePercent.toFixed(1)}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
              <div
                className="bg-red-500 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${negativePercent}%` }}
              >
                {negativePercent > 5 && (
                  <span className="text-xs font-medium text-white">{negativePercent.toFixed(0)}%</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {subredditAverages.length > 1 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Average Sentiment by Subreddit</h4>
          <div className="space-y-3">
            {subredditAverages.map((item) => {
              const barWidth = (Math.abs(item.average) / maxAbsAvg) * 100;
              const isPositive = item.average >= 0;

              return (
                <div key={item.subreddit}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">r/{item.subreddit}</span>
                    <span className={`text-sm font-semibold ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
                      {item.average.toFixed(3)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden">
                    <div
                      className={`h-5 rounded-full transition-all duration-500 ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
