import { useState, useEffect, useCallback } from 'react';
import { DailyPriorities, Priority } from '../types/priorities';
import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';
import { formatDateForDB } from '../utils/date';
import { handleSingleRecordError, handleDatabaseError } from './useDataFetching';

export function useDailyPriorities(selectedDate: Date = new Date()) {
  const [priorities, setPriorities] = useState<DailyPriorities | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPriorities = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      const dateStr = formatDateForDB(selectedDate);

      const { data, error: fetchError } = await supabase
        .from('daily_priorities')
        .select('*')
        .eq('user_id', user.id)
        .eq('date_of', dateStr)
        .maybeSingle();

      handleSingleRecordError(fetchError);

      setPriorities(data ? {
        id: data.id,
        dateOf: data.date_of,
        priorities: data.priorities || [],
        userId: data.user_id,
      } : null);

      setError(null);
    } catch (err) {
      setError(handleDatabaseError(err));
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadPriorities();
  }, [loadPriorities]);

  const setPrioritiesForDay = async (texts: string[]) => {
    try {
      const user = await getCurrentUser();
      const dateStr = formatDateForDB(selectedDate);

      const newPriorities: Priority[] = texts.map(text => ({
        id: crypto.randomUUID(),
        text,
        completed: false,
      }));

      // Optimistically update the UI
      const newPrioritiesData = {
        id: priorities?.id || crypto.randomUUID(),
        dateOf: dateStr,
        priorities: newPriorities,
        userId: user.id,
      };
      setPriorities(newPrioritiesData);

      const { data, error: upsertError } = await supabase
        .from('daily_priorities')
        .upsert({
          date_of: dateStr,
          user_id: user.id,
          priorities: newPriorities,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,date_of'
        })
        .select()
        .single();

      if (upsertError) throw upsertError;

      // Update with the server response
      setPriorities({
        id: data.id,
        dateOf: data.date_of,
        priorities: data.priorities,
        userId: data.user_id,
      });

      setError(null);
    } catch (err) {
      setError(handleDatabaseError(err));
      // Rollback optimistic update on error
      await loadPriorities();
    }
  };

  const updatePriority = async (priorityId: string, completed: boolean) => {
    if (!priorities) return;

    try {
      // Optimistically update the UI
      const updatedPriorities = priorities.priorities.map(p =>
        p.id === priorityId ? { ...p, completed } : p
      );

      setPriorities(prev => prev ? {
        ...prev,
        priorities: updatedPriorities,
      } : null);

      const { error: updateError } = await supabase
        .from('daily_priorities')
        .update({
          priorities: updatedPriorities,
          updated_at: new Date().toISOString(),
        })
        .eq('id', priorities.id)
        .eq('user_id', priorities.userId);

      if (updateError) throw updateError;
    } catch (err) {
      setError(handleDatabaseError(err));
      // Rollback optimistic update on error
      await loadPriorities();
    }
  };

  return {
    priorities,
    isLoading,
    error,
    updatePriority,
    setPrioritiesForDay,
  };
}