import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';

interface YearlyDebrief {
  wins: string;
  challenges: string;
  lessons: string;
}

export function useReflection() {
  const [debrief, setDebrief] = useState<YearlyDebrief | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDebrief();
  }, []);

  const loadDebrief = async () => {
    try {
      const user = await getCurrentUser();
      
      const { data, error: fetchError } = await supabase
        .from('yearly_debrief')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      setDebrief({
        wins: data?.wins || '',
        challenges: data?.challenges || '',
        lessons: data?.lessons || ''
      });
      setIsLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error loading debrief:', err);
      setError((err as Error).message);
      setIsLoading(false);
    }
  };

  const saveDebrief = async (data: YearlyDebrief) => {
    try {
      const user = await getCurrentUser();

      const { error: upsertError } = await supabase
        .from('yearly_debrief')
        .upsert({
          user_id: user.id,
          ...data,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (upsertError) throw upsertError;

      setDebrief(data);
      setError(null);
    } catch (err) {
      console.error('Error saving debrief:', err);
      setError((err as Error).message);
      throw err;
    }
  };

  return {
    debrief,
    isLoading,
    error,
    saveDebrief,
    loadDebrief
  };
}