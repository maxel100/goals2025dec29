import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useUser } from './useUser';

export function useWeeklyFocus(selectedWeek: Date) {
  const [focus, setFocus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const fetchFocus = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('weekly_focus')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_start', selectedWeek.toISOString().split('T')[0])
        .single();

      if (error) throw error;
      setFocus(data?.focus || null);
    } catch (error) {
      console.error('Error fetching weekly focus:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewFocus = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-weekly-focus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          weekStart: selectedWeek.toISOString().split('T')[0],
        }),
      });

      if (!response.ok) throw new Error('Failed to generate focus');
      
      const data = await response.json();
      setFocus(data.focus);

      // Save to database
      await supabase
        .from('weekly_focus')
        .upsert({
          user_id: user.id,
          week_start: selectedWeek.toISOString().split('T')[0],
          focus: data.focus,
        });
    } catch (error) {
      console.error('Error generating weekly focus:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFocus();
  }, [user, selectedWeek]);

  return {
    focus,
    isLoading,
    generateNewFocus,
  };
} 