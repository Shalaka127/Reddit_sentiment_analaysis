import { useState } from 'react';
import { AlertCircle, CheckCircle, Key } from 'lucide-react';

interface AuthSectionProps {
  onAuthSuccess: (username: string, subreddits: string[]) => void;
}

const CLIENT_ID = 'tDU-wQyVJLp0jUjYbEW5-A';
const REDIRECT_URI = 'http://localhost:8080';
const SCOPES = 'identity,history,read';

export default function AuthSection({ onAuthSuccess }: AuthSectionProps) {
  const [authCode, setAuthCode] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=code&state=state123&redirect_uri=${REDIRECT_URI}&duration=permanent&scope=${SCOPES}`;

  const handleAuthenticate = async () => {
    if (!authCode.trim()) {
      setMessage('Please enter an authorization code');
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setMessage('Authenticating...');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/reddit-auth`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ code: authCode.trim() }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || 'Authentication failed');
        setIsSuccess(false);
        setIsLoading(false);
        return;
      }

      setMessage(`Successfully authenticated as u/${data.username}`);
      setIsSuccess(true);
      setIsLoading(false);
      onAuthSuccess(data.username, data.subreddits);
    } catch (error) {
      setMessage('Network error. Please try again.');
      setIsSuccess(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="flex items-center gap-3 mb-6">
        <Key className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-semibold text-gray-900">Authenticate with Reddit</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-700 mb-3">
            <span className="font-medium">Step 1:</span> Click the link below to authorize this app with your Reddit account
          </p>
          <a
            href={authUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Authorize Reddit Access
          </a>
        </div>

        <div>
          <label htmlFor="authCode" className="block text-sm font-medium text-gray-700 mb-2">
            <span className="font-medium">Step 2:</span> Paste the authorization code here
          </label>
          <input
            id="authCode"
            type="text"
            value={authCode}
            onChange={(e) => setAuthCode(e.target.value)}
            placeholder="Enter authorization code..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            disabled={isLoading}
          />
        </div>

        <button
          onClick={handleAuthenticate}
          disabled={isLoading || !authCode.trim()}
          className="w-full px-4 py-3 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          {isLoading ? 'Authenticating...' : 'Authenticate'}
        </button>

        {message && (
          <div className={`flex items-start gap-3 p-4 rounded-lg ${isSuccess ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
            {isSuccess ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            )}
            <p className={`text-sm ${isSuccess ? 'text-green-800' : 'text-orange-800'}`}>
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
