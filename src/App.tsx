import { useState } from 'react';
import { Brain } from 'lucide-react';
import AuthSection from './components/AuthSection';
import AnalysisSection from './components/AnalysisSection';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [subreddits, setSubreddits] = useState<string[]>([]);

  const handleAuthSuccess = (user: string, subs: string[]) => {
    setUsername(user);
    setSubreddits(subs);
    setIsAuthenticated(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Reddit Sentiment Analyzer
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Analyze sentiment patterns across your Reddit activity and explore subreddit trends
          </p>
        </header>

        <div className="max-w-6xl mx-auto space-y-8">
          {!isAuthenticated ? (
            <AuthSection onAuthSuccess={handleAuthSuccess} />
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Authenticated as</p>
                    <p className="text-xl font-semibold text-gray-900">u/{username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Active in {subreddits.length} subreddits</p>
                    <button
                      onClick={() => setIsAuthenticated(false)}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Switch Account
                    </button>
                  </div>
                </div>
              </div>

              <AnalysisSection username={username} subreddits={subreddits} />
            </>
          )}
        </div>

        <footer className="text-center mt-16 pb-8">
          <p className="text-sm text-gray-500">
            Powered by sentiment analysis technology
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
