import { useState } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import SentimentChart from './SentimentChart';
import DataTable from './DataTable';
import { SentimentData } from '../types/reddit';
import { calculateSentiment, getSentimentLabel } from '../utils/sentiment';

interface AnalysisSectionProps {
  username: string;
  subreddits: string[];
}

const sampleTexts = [
  "This is absolutely amazing! I love how well this works. Great job!",
  "This is terrible and disappointing. Really bad experience overall.",
  "I think this is okay. Nothing special but not bad either.",
  "Incredible work! Best thing I've seen in a while. Highly recommend!",
  "Not impressed at all. Waste of time and effort.",
  "Pretty good overall. Has some nice features that work well.",
  "Awful experience. Terrible implementation and horrible results.",
  "Decent enough for basic use. Could be better but functional.",
  "Outstanding! Exceeded all my expectations. Absolutely brilliant!",
  "Broken and useless. Nothing works as advertised."
];

const generateMockComments = (username: string, count: number): SentimentData[] => {
  const subreddits = ['technology', 'programming', 'webdev', 'reactjs', 'javascript', 'artificial'];
  const comments: SentimentData[] = [];

  for (let i = 0; i < count; i++) {
    const text = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    const sentiment = calculateSentiment(text);
    comments.push({
      type: 'Comment',
      subreddit: subreddits[Math.floor(Math.random() * subreddits.length)],
      text,
      polarity: sentiment.polarity,
      subjectivity: sentiment.subjectivity,
      sentiment: getSentimentLabel(sentiment.polarity)
    });
  }

  return comments;
};

const generateMockSubredditPosts = (subreddit: string, count: number): SentimentData[] => {
  const posts: SentimentData[] = [];

  for (let i = 0; i < count; i++) {
    const text = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    const sentiment = calculateSentiment(text);
    posts.push({
      type: 'Subreddit Post',
      subreddit,
      text,
      polarity: sentiment.polarity,
      subjectivity: sentiment.subjectivity,
      sentiment: getSentimentLabel(sentiment.polarity)
    });
  }

  return posts;
};

export default function AnalysisSection({ username, subreddits }: AnalysisSectionProps) {
  const [selectedSubreddit, setSelectedSubreddit] = useState(subreddits[0] || '');
  const [userActivity, setUserActivity] = useState<SentimentData[]>([]);
  const [subredditPosts, setSubredditPosts] = useState<SentimentData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleRunAnalysis = async () => {
    if (!selectedSubreddit) return;

    setIsAnalyzing(true);
    setHasAnalyzed(false);

    setTimeout(() => {
      const mockUserActivity = generateMockComments(username, 50);
      const mockSubredditPosts = generateMockSubredditPosts(selectedSubreddit, 30);

      setUserActivity(mockUserActivity);
      setSubredditPosts(mockSubredditPosts);
      setIsAnalyzing(false);
      setHasAnalyzed(true);
    }, 2000);
  };

  const calculateStats = (data: SentimentData[]) => {
    if (data.length === 0) return { positive: 0, neutral: 0, negative: 0, avgPolarity: 0 };

    const positive = data.filter(d => d.sentiment === 'Positive').length;
    const neutral = data.filter(d => d.sentiment === 'Neutral').length;
    const negative = data.filter(d => d.sentiment === 'Negative').length;
    const avgPolarity = data.reduce((sum, d) => sum + d.polarity, 0) / data.length;

    return { positive, neutral, negative, avgPolarity };
  };

  const userStats = calculateStats(userActivity);
  const subredditStats = calculateStats(subredditPosts);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-semibold text-gray-900">Run Sentiment Analysis</h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Subreddit
            </label>
            <select
              value={selectedSubreddit}
              onChange={(e) => setSelectedSubreddit(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              disabled={isAnalyzing}
            >
              {subreddits.map((sub) => (
                <option key={sub} value={sub}>
                  r/{sub}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleRunAnalysis}
          disabled={isAnalyzing || !selectedSubreddit}
          className="w-full px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <TrendingUp className="w-5 h-5" />
          {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
        </button>

        {isAnalyzing && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {hasAnalyzed && !isAnalyzing && (
          <div className="space-y-8 mt-8">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">User</p>
                  <p className="text-xl font-bold text-gray-900">u/{username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Subreddit</p>
                  <p className="text-xl font-bold text-gray-900">r/{selectedSubreddit}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Activity Analysis</h3>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Positive</p>
                  <p className="text-2xl font-bold text-green-700">{userStats.positive}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Neutral</p>
                  <p className="text-2xl font-bold text-gray-700">{userStats.neutral}</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Negative</p>
                  <p className="text-2xl font-bold text-red-700">{userStats.negative}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Avg Score</p>
                  <p className="text-2xl font-bold text-blue-700">{userStats.avgPolarity.toFixed(2)}</p>
                </div>
              </div>
              <SentimentChart data={userActivity} title={`u/${username}'s Activity Sentiment`} />
              <div className="mt-6">
                <DataTable data={userActivity} />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Subreddit Analysis</h3>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Positive</p>
                  <p className="text-2xl font-bold text-green-700">{subredditStats.positive}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Neutral</p>
                  <p className="text-2xl font-bold text-gray-700">{subredditStats.neutral}</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Negative</p>
                  <p className="text-2xl font-bold text-red-700">{subredditStats.negative}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Avg Score</p>
                  <p className="text-2xl font-bold text-blue-700">{subredditStats.avgPolarity.toFixed(2)}</p>
                </div>
              </div>
              <SentimentChart data={subredditPosts} title={`r/${selectedSubreddit} Sentiment`} />
              <div className="mt-6">
                <DataTable data={subredditPosts} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
