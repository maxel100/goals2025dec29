import { useEffect, useState } from 'react';
import { useGoalStore } from '../store/goalStore';
import { calculateProgress } from '../utils/calculations';
import { Goal } from '../types';
import { supabase } from '../lib/supabase';

export function useGoals() {
  const { goals, initialize, updateGoal, isLoading: storeLoading, error } = useGoalStore();
  const [hasInitialGoals, setHasInitialGoals] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeGoals = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setHasInitialGoals(false);
          setIsLoading(false);
          return;
        }

        // Check if user has any goals
        const { data: existingGoals, error: fetchError } = await supabase
          .from('goals')
          .select('id')
          .eq('user_id', session.user.id)
          .limit(1);

        if (fetchError) throw fetchError;

        const hasGoals = Boolean(existingGoals?.length);
        setHasInitialGoals(hasGoals);

        // Initialize goals store
        await initialize();
      } catch (err) {
        console.error('Error initializing goals:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeGoals();
  }, [initialize]);

  const calculateGoalProgress = (goal: Goal): number => {
    switch (goal.type) {
      case 'simple':
        return goal.completed ? 100 : 0;
      case 'quantifiable':
        return calculateProgress(goal.progress || 0, goal.target || 0);
      case 'monthly':
        const completedMonths = Object.values(goal.monthlyProgress || {}).filter(Boolean).length;
        return calculateProgress(completedMonths, 12);
      default:
        return 0;
    }
  };

  const totalProgress = goals.length
    ? Math.round(
        goals.reduce((sum, goal) => sum + calculateGoalProgress(goal), 0) / goals.length
      )
    : 0;

  const groupedGoals = goals.reduce((acc, goal) => ({
    ...acc,
    [goal.category]: [...(acc[goal.category] || []), goal],
  }), {} as Record<string, Goal[]>);

  return {
    goals,
    updateGoal,
    totalProgress,
    groupedGoals,
    isLoading: isLoading || storeLoading,
    error,
    hasInitialGoals
  };
}