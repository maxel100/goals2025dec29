import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { generateGoals } from '../services/goals';

export function useOnboarding() {
  const [data, setData] = useState({
    debrief: {
      wins: '',
      challenges: '',
      lessons: ''
    },
    mission: {
      vision: '',
      importance: ''
    },
    goals: {
      health: [],
      mind: [],
      emotions: [],
      relationships: [],
      mission: [],
      money: [],
      family: [],
      lifestyle: [],
      contribution: [],
      spirituality: []
    },
    internalTalk: [],
    avoidance: []
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateData = (newData: any) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const generateGoalsBoard = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No authenticated session');

      // Save mission and debrief first
      await Promise.all([
        supabase.from('yearly_debrief').upsert({
          user_id: session.user.id,
          ...data.debrief,
          updated_at: new Date().toISOString()
        }),
        supabase.from('life_mission').upsert({
          user_id: session.user.id,
          ...data.mission,
          updated_at: new Date().toISOString()
        })
      ]);

      // Generate and save goals
      await generateGoals(data);

      // Redirect to main dashboard
      window.location.href = '/';
    } catch (err) {
      console.error('Error generating goals:', err);
      setError('Failed to generate goals. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    data,
    updateData,
    isGenerating,
    generateGoals: generateGoalsBoard,
    error
  };
}