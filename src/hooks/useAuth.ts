import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    session: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      setState(prev => ({
        ...prev,
        session,
        isLoading: false,
        error: error?.message || null,
      }));
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setState(prev => ({
        ...prev,
        session,
        isLoading: false,
      }));

      // If this is a new signup, trigger the welcome sequence
      if (_event === 'SIGNED_IN' && session?.user.user_metadata?.is_new_user) {
        try {
          await supabase.functions.invoke('welcome-sequence', {
            body: {
              email: session.user.email,
              firstName: session.user.user_metadata?.first_name,
            },
          });
        } catch (error) {
          console.error('Failed to trigger welcome sequence:', error);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            is_new_user: true,
          },
        },
      });
      if (error) throw error;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message,
      }));
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message,
      }));
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message,
      }));
    }
  };

  return {
    ...state,
    signUp,
    signIn,
    signOut,
  };
}