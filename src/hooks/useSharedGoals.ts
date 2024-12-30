import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Goal } from '../types';
import { getCurrentUser } from '../lib/auth';

export function useSharedGoals(userId: string) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSharedGoals();
  }, [userId]);

  const loadSharedGoals = async () => {
    try {
      console.log('Loading shared goals for user:', userId);
      setIsLoading(true);
      setError(null);

      const currentUser = await getCurrentUser();
      console.log('Current user:', currentUser.id);

      // First verify access
      console.log('Verifying access...');
      const { data: request, error: requestError } = await supabase
        .from('sharing_requests')
        .select('*')
        .eq('status', 'accepted')
        .or(`and(from_user_id.eq.${currentUser.id},to_user_id.eq.${userId}),and(from_user_id.eq.${userId},to_user_id.eq.${currentUser.id})`);

      console.log('Access verification response:', { request, requestError });

      if (requestError) {
        console.error('Access verification error:', requestError);
        throw new Error('Access denied');
      }

      if (!request?.length) {
        console.error('No sharing relationship found between users');
        throw new Error('Access denied');
      }

      // Load goals
      console.log('Loading goals...');
      const { data: goalsData, error: goalsError } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      console.log('Goals response:', { goalsData, goalsError });

      if (goalsError) {
        console.error('Goals fetch error:', goalsError);
        throw goalsError;
      }

      setGoals(goalsData || []);
    } catch (err) {
      console.error('Error loading shared goals:', err);
      setError(err instanceof Error ? err.message : 'Failed to load goals');
    } finally {
      setIsLoading(false);
    }
  };

  return { goals, isLoading, error, refresh: loadSharedGoals };
}