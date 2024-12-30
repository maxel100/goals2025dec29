import React, { useEffect, useState } from 'react';
import { handleAuthCallback } from '../../lib/auth';
import { LoadingScreen } from '../ui/LoadingScreen';

export function AuthCallback() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const success = await handleAuthCallback();
        if (success) {
          window.location.href = '/';
        } else {
          setError('Authentication failed');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('Authentication failed');
      }
    };

    processCallback();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <a href="/" className="text-primary-600 hover:text-primary-700">
            Back to login
          </a>
        </div>
      </div>
    );
  }

  return <LoadingScreen message="Completing authentication..." />;
}