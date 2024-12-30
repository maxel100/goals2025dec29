import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';

export function useEmailPreferences() {
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEmailPreference();
  }, []);

  const loadEmailPreference = async () => {
    try {
      const user = await getCurrentUser();
      
      const { data, error } = await supabase
        .from('user_preferences')
        .select('email')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      setEmailEnabled(data?.email ?? false);
      setError(null);
    } catch (err) {
      console.error('Load email preferences error:', err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmailPreference = async (enabled: boolean) => {
    try {
      const user = await getCurrentUser();
      
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          email: enabled,
        });

      if (error) throw error;

      setEmailEnabled(enabled);
      setError(null);
    } catch (err) {
      console.error('Update email preferences error:', err);
      setError((err as Error).message);
      throw err;
    }
  };

  const sendTestEmail = async () => {
    try {
      const { data, error: functionError } = await supabase.functions.invoke('test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (functionError) {
        console.error('Edge Function error:', functionError);
        throw new Error(functionError.message || 'Failed to send test email');
      }

      // Check if the response contains an error
      if (data?.error) {
        console.error('Test email error:', data.error);
        throw new Error(data.error);
      }

      // Check for success flag
      if (!data?.success) {
        throw new Error('Failed to send test email');
      }

      setError(null);
      return true;
    } catch (err) {
      console.error('Send test email error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to send test email';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    emailEnabled,
    isLoading,
    error,
    updateEmailPreference,
    sendTestEmail
  };
}