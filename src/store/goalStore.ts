import { create } from 'zustand';
import { Goal } from '../types/goals';
import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';
import { formatGoalForDb, formatGoalFromDb } from '../utils/goalFormatters';

interface GoalStore {
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  updateGoal: (goalId: string, updates: Partial<Goal>) => Promise<void>;
  addGoal: (goal: Partial<Goal>) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
}

export const useGoalStore = create<GoalStore>()((set, get) => ({
  goals: [],
  isLoading: true,
  error: null,

  initialize: async () => {
    try {
      const user = await getCurrentUser();
      
      const { data: existingGoals, error: fetchError } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      const formattedGoals = (existingGoals || []).map(formatGoalFromDb);
      set({ goals: formattedGoals, isLoading: false, error: null });
    } catch (error) {
      set({ 
        error: `Failed to initialize goals: ${(error as Error).message}`,
        isLoading: false 
      });
    }
  },

  updateGoal: async (goalId: string, updates: Partial<Goal>) => {
    try {
      const user = await getCurrentUser();
      const existingGoal = get().goals.find(g => g.id === goalId);
      if (!existingGoal) throw new Error('Goal not found');

      const dbUpdates = formatGoalForDb(updates, existingGoal);

      const { error } = await supabase
        .from('goals')
        .update({ 
          ...dbUpdates, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) throw error;

      set(state => ({
        goals: state.goals.map(goal =>
          goal.id === goalId ? { ...goal, ...updates } : goal
        ),
        error: null
      }));
    } catch (error) {
      set({ error: `Failed to update goal: ${(error as Error).message}` });
    }
  },

  addGoal: async (goal: Partial<Goal>) => {
    try {
      const user = await getCurrentUser();
      const dbGoal = formatGoalForDb({
        ...goal,
        user_id: user.id,
      });

      const { data, error } = await supabase
        .from('goals')
        .insert([{
          ...dbGoal,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      const formattedGoal = formatGoalFromDb(data);
      set(state => ({
        goals: [...state.goals, formattedGoal],
        error: null
      }));
    } catch (error) {
      set({ error: `Failed to add goal: ${(error as Error).message}` });
    }
  },

  deleteGoal: async (goalId: string) => {
    try {
      const user = await getCurrentUser();
      
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) throw error;

      set(state => ({
        goals: state.goals.filter(goal => goal.id !== goalId),
        error: null
      }));
    } catch (error) {
      set({ error: `Failed to delete goal: ${(error as Error).message}` });
    }
  }
}));