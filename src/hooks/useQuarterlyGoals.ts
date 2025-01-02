import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';
import { handleSingleRecordError } from '../utils/error';
import { Priority } from '../types/priorities';

export interface QuarterlyGoals {
  id: string;
  quarterStart: string;
  goals: Priority[];
  userId: string;
  is_visible: boolean;
}

export function useQuarterlyGoals(selectedDate: Date = new Date()) {
  const [goals, setGoals] = useState<QuarterlyGoals | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisibleState, setLastVisibleState] = useState<boolean | null>(null);

  const getQuarterStart = (date: Date) => {
    const year = date.getFullYear();
    const quarter = Math.floor(date.getMonth() / 3);
    return new Date(year, quarter * 3, 1).toISOString();
  };

  const loadGoals = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      const quarterStart = getQuarterStart(selectedDate);

      const { data, error: fetchError } = await supabase
        .from('quarterly_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('quarter_start', quarterStart)
        .maybeSingle();

      handleSingleRecordError(fetchError);

      // Only update visibility if it hasn't been explicitly set
      const isVisible = lastVisibleState !== null ? lastVisibleState : data?.is_visible ?? false;

      setGoals(data ? {
        id: data.id,
        quarterStart: data.quarter_start,
        goals: data.goals || [],
        userId: data.user_id,
        is_visible: isVisible,
      } : null);

      setIsLoading(false);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  }, [selectedDate, lastVisibleState]);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const updateGoals = async (newGoals: Priority[]) => {
    try {
      const user = await getCurrentUser();
      const quarterStart = getQuarterStart(selectedDate);

      const { data, error: upsertError } = await supabase
        .from('quarterly_goals')
        .upsert({
          quarter_start: quarterStart,
          user_id: user.id,
          goals: newGoals,
          is_visible: lastVisibleState ?? goals?.is_visible ?? false,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,quarter_start'
        })
        .select()
        .single();

      if (upsertError) throw upsertError;

      setGoals({
        id: data.id,
        quarterStart: data.quarter_start,
        goals: data.goals || [],
        userId: data.user_id,
        is_visible: lastVisibleState ?? data.is_visible,
      });

      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const toggleVisibility = async (visible: boolean) => {
    try {
      const user = await getCurrentUser();
      const quarterStart = getQuarterStart(selectedDate);

      // Update local state immediately
      setLastVisibleState(visible);
      setGoals(goals => goals ? { ...goals, is_visible: visible } : null);

      // First, ensure a record exists
      const { data: existingData } = await supabase
        .from('quarterly_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('quarter_start', quarterStart)
        .maybeSingle();

      // If no record exists, create one with default values
      const recordToUpsert = existingData ? {
        ...existingData,
        is_visible: visible,
        updated_at: new Date().toISOString(),
      } : {
        quarter_start: quarterStart,
        user_id: user.id,
        goals: [],
        is_visible: visible,
        updated_at: new Date().toISOString(),
      };

      const { data, error: upsertError } = await supabase
        .from('quarterly_goals')
        .upsert(recordToUpsert)
        .select()
        .single();

      if (upsertError) throw upsertError;

      // Don't update the visibility from the response
      setGoals({
        id: data.id,
        quarterStart: data.quarter_start,
        goals: data.goals || [],
        userId: data.user_id,
        is_visible: visible,
      });

      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const updateGoal = async (goalId: string, completed: boolean) => {
    if (!goals) return;

    const updatedGoals = goals.goals.map(goal =>
      goal.id === goalId ? { ...goal, completed } : goal
    );

    await updateGoals(updatedGoals);
  };

  return {
    goals,
    isLoading,
    error,
    updateGoals,
    updateGoal,
    toggleVisibility,
  };
} 