import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, ArrowLeft, Mail, Lock, AlertCircle, Rocket } from 'lucide-react';
import { useWizardCompletion } from '../../hooks/useWizardCompletion';

interface AuthFormProps {
  onBack?: () => void;
}

export function AuthForm({ onBack }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const resetWizard = useWizardCompletion(state => state.reset);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isResetMode) {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`
        });
        if (resetError) throw resetError;
        setResetSent(true);
        return;
      }

      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });
        if (error) throw error;
        
        resetWizard();
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }

      window.location.href = '/';
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (resetSent) {
    return (
      <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Check your email</h2>
          <p className="text-gray-600 text-center">
            We've sent you a password reset link. Please check your inbox.
          </p>
          <button
            onClick={() => {
              setIsResetMode(false);
              setResetSent(false);
            }}
            className="w-full flex items-center justify-center gap-2 text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg relative z-10">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        )}

        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {isResetMode ? 'Reset Password' : isSignUp ? 'Start Your Journey' : 'Welcome Back'}
          </h2>
          <p className="mt-3 text-gray-600">
            {isResetMode
              ? 'Enter your email to receive a reset link'
              : isSignUp
              ? 'Join thousands achieving their dream goals with AI-powered guidance'
              : 'Continue your path to success'}
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1 relative">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {!isResetMode && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isResetMode ? (
                'Send Reset Link'
              ) : isSignUp ? (
                'Start Achieving Goals'
              ) : (
                'Continue Your Journey'
              )}
            </button>
          </div>
        </form>

        <div className="text-center space-y-2">
          {!isResetMode && (
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              {isSignUp
                ? 'Already achieving goals? Sign in'
                : "Ready to start achieving? Sign up"}
            </button>
          )}
          
          <button
            onClick={() => setIsResetMode(!isResetMode)}
            className="block w-full text-sm text-primary-600 hover:text-primary-700"
          >
            {isResetMode ? 'Back to sign in' : 'Forgot your password?'}
          </button>
        </div>
      </div>
    </div>
  );
}