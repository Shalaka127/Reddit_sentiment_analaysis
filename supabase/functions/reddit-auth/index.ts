import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const CLIENT_ID = 'tDU-wQyVJLp0jUjYbEW5-A';
const CLIENT_SECRET = 'YVhBNOfqvDxG8Xk-6VJGmtx71q14ig';
const REDIRECT_URI = 'http://localhost:8080';

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { code } = await req.json();

    if (!code) {
      return new Response(
        JSON.stringify({ error: 'Authorization code is required' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      return new Response(
        JSON.stringify({ error: 'Failed to get access token', details: error }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    const userResponse = await fetch('https://oauth.reddit.com/api/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'sentiment-app/1.0',
      },
    });

    if (!userResponse.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to get user info' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const userData = await userResponse.json();

    const commentsResponse = await fetch(`https://oauth.reddit.com/user/${userData.name}/comments?limit=100`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'sentiment-app/1.0',
      },
    });

    const subreddits = new Set<string>();
    
    if (commentsResponse.ok) {
      const commentsData = await commentsResponse.json();
      if (commentsData.data && commentsData.data.children) {
        commentsData.data.children.forEach((child: any) => {
          if (child.data.subreddit) {
            subreddits.add(child.data.subreddit);
          }
        });
      }
    }

    return new Response(
      JSON.stringify({
        username: userData.name,
        subreddits: Array.from(subreddits).sort(),
        accessToken: accessToken,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});