import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';

export function useYearName() {
  const [yearName, setYearName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadYearName();
  }, []);

  const loadYearName = async () => {
    try {
      setIsLoading(true);
      const user = await getCurrentUser();
      const currentYear = new Date().getFullYear();

      const { data, error: fetchError } = await supabase
        .from('year_name')
        .select('name')
        .eq('user_id', user.id)
        .eq('year', currentYear)
        .maybeSingle();

      if (fetchError) throw fetchError;

      // Set the name from the database, or use default if none exists
      setYearName(data?.name || 'My Goals Board');
      setError(null);
    } catch (err) {
      console.error('Error loading year name:', err);
      setError((err as Error).message);
      // Set default name on error
      setYearName('My Goals Board');
    } finally {
      setIsLoading(false);
    }
  };

  const updateYearName = async (name: string) => {
    try {
      const user = await getCurrentUser();
      const currentYear = new Date().getFullYear();

      // Optimistically update the UI
      setYearName(name);

      const { error: upsertError } = await supabase
        .from('year_name')
        .upsert({
          user_id: user.id,
          year: currentYear,
          name,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,year'
        });

      if (upsertError) throw upsertError;
      setError(null);
    } catch (err) {
      console.error('Error updating year name:', err);
      setError((err as Error).message);
      // Revert to previous name on error
      await loadYearName();
      throw err;
    }
  };

  return {
    yearName: yearName || 'My Goals Board', // Ensure we always return a string
    isLoading,
    error,
    updateYearName
  };
}