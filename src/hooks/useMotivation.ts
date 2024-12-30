import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';
import { startOfWeek } from '../utils/date';
import { fetchContextData, generateMotivationalContent } from '../services/motivation';

export function useMotivation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentMotivation, setCurrentMotivation] = useState<string | null>(null);

  const loadMotivation = async (selectedDate: Date) => {
    try {
      const user = await getCurrentUser();
      const weekStart = startOfWeek(selectedDate).toISOString();
      
      const { data, error: fetchError } = await supabase
        .from('weekly_motivation')
        .select('content')
        .eq('user_id', user.id)
        .eq('week_of', weekStart)
        .maybeSingle();

      if (fetchError) throw fetchError;
      
      if (data) {
        setCurrentMotivation(data.content);
        return data.content;
      }
      
      return null;
    } catch (err) {
      console.error('Error loading motivation:', err);
      return null;
    }
  };

  const generateMotivation = async (selectedDate: Date = new Date(), force: boolean = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!force) {
        const existing = await loadMotivation(selectedDate);
        if (existing) {
          setIsLoading(false);
          return existing;
        }
      }

      const context = await fetchContextData();
      const content = await generateMotivationalContent(context);
      
      if (content) {
        const user = await getCurrentUser();
        const weekStart = startOfWeek(selectedDate).toISOString();

        const { error: upsertError } = await supabase
          .from('weekly_motivation')
          .upsert({
            user_id: user.id,
            week_of: weekStart,
            content,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,week_of'
          });

        if (upsertError) throw upsertError;

        setCurrentMotivation(content);
        return content;
      }
      
      return null;
    } catch (err) {
      console.error('Error generating motivation:', err);
      setError('Unable to generate motivation right now. Please try again in a moment.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateMotivation,
    currentMotivation,
    isLoading,
    error,
    loadMotivation
  };
}