export interface SentimentData {
  type: string;
  subreddit: string;
  text: string;
  polarity: number;
  subjectivity: number;
  sentiment?: 'Positive' | 'Neutral' | 'Negative';
}

export interface AuthState {
  status: boolean;
  username: string | null;
  subreddits: string[];
}

export interface AnalysisResult {
  userActivity: SentimentData[];
  subredditPosts: SentimentData[];
}
