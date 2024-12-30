import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';

interface LifeMission {
  vision: string;
  importance: string;
}

export function useLifeMission() {
  const [mission, setMission] = useState<LifeMission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMission();
  }, []);

  const loadMission = async () => {
    try {
      setIsLoading(true);
      const user = await getCurrentUser();
      
      const { data, error: fetchError } = await supabase
        .from('life_mission')
        .select('vision, importance')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      setMission({
        vision: data?.vision || '',
        importance: data?.importance || ''
      });
      setError(null);
    } catch (err) {
      console.error('Error loading life mission:', err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const saveMission = async (data: LifeMission) => {
    try {
      const user = await getCurrentUser();

      const { error: upsertError } = await supabase
        .from('life_mission')
        .upsert({
          user_id: user.id,
          vision: data.vision,
          importance: data.importance,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (upsertError) throw upsertError;

      setMission(data);
      setError(null);
    } catch (err) {
      console.error('Error saving life mission:', err);
      setError((err as Error).message);
      throw err;
    }
  };

  return {
    mission,
    isLoading,
    error,
    saveMission,
    loadMission
  };
}