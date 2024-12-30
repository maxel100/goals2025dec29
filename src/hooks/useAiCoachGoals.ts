import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';

interface AiCoachGoal {
  goals: string[];
  importance: string;
  period?: string;
  year?: number;
}

export function useAiCoachGoals(timeframe: string, period?: string, year?: number) {
  const [data, setData] = useState<AiCoachGoal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGoals();
  }, [timeframe, period, year]);

  const loadGoals = async () => {
    try {
      const user = await getCurrentUser();
      
      let query = supabase
        .from('ai_coach_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('timeframe', timeframe);

      if (period && year) {
        query = query
          .eq('period', period)
          .eq('year', year);
      }

      const { data: goals, error: fetchError } = await query.single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (goals) {
        setData({
          goals: goals.goals,
          importance: goals.importance,
          period: goals.period,
          year: goals.year,
        });
      } else {
        setData(null);
      }

      setIsLoading(false);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  };

  const saveGoals = async (goals: string[], importance: string, period?: string, year?: number) => {
    try {
      const user = await getCurrentUser();
      
      const { error: upsertError } = await supabase
        .from('ai_coach_goals')
        .upsert({
          user_id: user.id,
          timeframe,
          goals,
          importance,
          period,
          year,
          updated_at: new Date().toISOString(),
        });

      if (upsertError) throw upsertError;

      setData({ goals, importance, period, year });
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return {
    data,
    isLoading,
    error,
    saveGoals,
  };
}