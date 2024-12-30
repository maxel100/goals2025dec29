import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';

type RuleType = 'internal_talk' | 'success_rules' | 'business_rules';

export function useRules(type: RuleType) {
  const [rules, setRules] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    try {
      const user = await getCurrentUser();
      
      const { data, error: fetchError } = await supabase
        .from('user_rules')
        .select('rules')
        .eq('user_id', user.id)
        .eq('type', type)
        .maybeSingle();

      if (fetchError) throw fetchError;

      setRules(data?.rules || []);
      setError(null);
    } catch (err) {
      console.error('Error loading rules:', err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const saveRules = async (newRules: string[]) => {
    try {
      const user = await getCurrentUser();

      const { error: upsertError } = await supabase
        .from('user_rules')
        .upsert({
          user_id: user.id,
          type,
          rules: newRules,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,type'
        });

      if (upsertError) throw upsertError;

      setRules(newRules);
      setError(null);
    } catch (err) {
      console.error('Error saving rules:', err);
      setError((err as Error).message);
      throw err;
    }
  };

  return {
    rules,
    isLoading,
    error,
    saveRules
  };
}