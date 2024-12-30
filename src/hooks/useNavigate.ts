import { useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useNavigate() {
  const navigateToOnboarding = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('No authenticated session found');
        return;
      }

      // Clear existing data
      await Promise.all([
        supabase.from('goals').delete().eq('user_id', session.user.id),
        supabase.from('life_mission').delete().eq('user_id', session.user.id),
        supabase.from('yearly_debrief').delete().eq('user_id', session.user.id),
        supabase.from('ai_coach_goals').delete().eq('user_id', session.user.id)
      ]);

      // Navigate to onboarding page
      window.location.href = '/onboarding';
    } catch (error) {
      console.error('Error navigating to onboarding:', error);
    }
  }, []);

  return { navigateToOnboarding };
}