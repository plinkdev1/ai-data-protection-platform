import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { exchangeCodeForSessionToken, fetchUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const oauthError = searchParams.get('error');
        const code = searchParams.get('code');

        if (oauthError) {
          console.error('OAuth error:', oauthError);
          setError('Authentication failed. Please try again.');
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        if (!code) {
          console.error('No authorization code received');
          setError('No authorization code received. Please try again.');
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        // Exchange code for session using the hook
        await exchangeCodeForSessionToken();
        
        // Fetch user data after successful exchange
        await fetchUser();
        
        // Redirect to dashboard after successful authentication
        navigate('/dashboard');
      } catch (error) {
        console.error('Auth callback error:', error);
        setError('Authentication failed. Please try again.');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, exchangeCodeForSessionToken, fetchUser]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Authentication Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-sm text-red-500">Redirecting to homepage...</p>
          </div>
        </div>
      </div>
    );
  }

  return <LoadingSpinner />;
}
