import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';

interface MonthlyGoal {
  id: string;
  text: string;
  completed: boolean;
}

export function useMonthlyGoals(selectedDate: Date = new Date()) {
  const [goals, setGoals] = useState<MonthlyGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGoals();
  }, [selectedDate]);

  const loadGoals = async () => {
    try {
      const user = await getCurrentUser();
      
      // Format date to YYYY-MM-01 for consistent month comparison
      const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      const monthStartStr = monthStart.toISOString().split('T')[0];
      
      const { data, error: fetchError } = await supabase
        .from('monthly_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('month_of', monthStartStr)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      setGoals(data?.goals || []);
      setError(null);
    } catch (err) {
      console.error('Error loading goals:', err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateGoals = async (newGoals: MonthlyGoal[] | string[]) => {
    try {
      const user = await getCurrentUser();
      const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      const monthStartStr = monthStart.toISOString().split('T')[0];
      
      // Format goals consistently
      const formattedGoals = Array.isArray(newGoals) && typeof newGoals[0] === 'string'
        ? (newGoals as string[]).filter(text => text.trim()).map(text => ({
            id: crypto.randomUUID(),
            text,
            completed: false
          }))
        : newGoals;

      const { error: upsertError } = await supabase
        .from('monthly_goals')
        .upsert({
          user_id: user.id,
          month_of: monthStartStr,
          goals: formattedGoals,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,month_of'
        });

      if (upsertError) throw upsertError;

      setGoals(formattedGoals as MonthlyGoal[]);
      setError(null);
    } catch (err) {
      console.error('Error updating goals:', err);
      setError((err as Error).message);
      await loadGoals(); // Reload goals to ensure we have the latest data
    }
  };

  return {
    goals,
    isLoading,
    error,
    updateGoals,
  };
}