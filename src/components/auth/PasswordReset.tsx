import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, AlertCircle, ArrowLeft, Lock } from 'lucide-react';

export function PasswordReset() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Extract and verify the recovery token on mount
  useEffect(() => {
    const accessToken = new URLSearchParams(window.location.hash.substring(1)).get('access_token');
    if (!accessToken) {
      setError('Invalid password reset link');
      return;
    }

    // Set the access token in the session
    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: '',
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;
      
      setSuccess(true);
      
      // Clear the URL hash
      window.history.replaceState(null, '', window.location.pathname);
      
      // Redirect to home after successful password reset
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Updated</h2>
            <p className="text-gray-600">
              Your password has been successfully reset. Redirecting to login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <a 
          href="/"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </a>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Reset Your Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please enter your new password below
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 p-3 rounded-md text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Enter your new password"
                minLength={6}
              />
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Password must be at least 6 characters long
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || password.length < 6}
            className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}