import { useState, useEffect, useCallback } from 'react';
import { WeeklyPriority } from '../types';
import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';
import { startOfWeek } from '../utils/date';
import { handleSingleRecordError } from './useDataFetching';

export function useWeeklyPriorities(selectedDate: Date = new Date()) {
  const [priorities, setPriorities] = useState<WeeklyPriority | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPriorities = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      const weekStart = startOfWeek(selectedDate).toISOString();

      const { data, error: fetchError } = await supabase
        .from('weekly_priorities')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_of', weekStart)
        .maybeSingle();

      handleSingleRecordError(fetchError);

      setPriorities(data ? {
        id: data.id,
        weekOf: data.week_of,
        priorities: data.priorities || [],
        userId: data.user_id,
      } : null);

      setIsLoading(false);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadPriorities();
  }, [loadPriorities]);

  const setPrioritiesForWeek = async (texts: string[]) => {
    try {
      const user = await getCurrentUser();
      const weekStart = startOfWeek(selectedDate).toISOString();

      const newPriorities = texts.map(text => ({
        id: crypto.randomUUID(),
        text,
        completed: false,
      }));

      const { data, error: upsertError } = await supabase
        .from('weekly_priorities')
        .upsert({
          week_of: weekStart,
          user_id: user.id,
          priorities: newPriorities,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,week_of'
        })
        .select()
        .single();

      if (upsertError) throw upsertError;

      setPriorities({
        id: data.id,
        weekOf: data.week_of,
        priorities: data.priorities,
        userId: data.user_id,
      });

      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const updatePriority = async (priorityId: string, completed: boolean) => {
    if (!priorities) return;

    try {
      const updatedPriorities = priorities.priorities.map(p =>
        p.id === priorityId ? { ...p, completed } : p
      );

      setPriorities(prev => prev ? {
        ...prev,
        priorities: updatedPriorities,
      } : null);

      const { error: updateError } = await supabase
        .from('weekly_priorities')
        .update({
          priorities: updatedPriorities,
          updated_at: new Date().toISOString(),
        })
        .eq('id', priorities.id)
        .eq('user_id', priorities.userId);

      if (updateError) throw updateError;
    } catch (err) {
      setError((err as Error).message);
      await loadPriorities();
    }
  };

  return {
    priorities,
    isLoading,
    error,
    updatePriority,
    setPrioritiesForWeek,
  };
}