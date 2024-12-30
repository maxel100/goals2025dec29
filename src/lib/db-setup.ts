import { supabase } from './supabase';
import { goals as initialGoals } from '../data/goals';
import { Goal } from '../types';

export async function setupDatabase() {
  try {
    // Create the goals table with the correct schema
    const { error: createError } = await supabase.rpc('setup_goals_table');
    if (createError) throw createError;

    // Initialize goals for new users
    return {
      name: 'Goals table setup completed',
      success: true
    };
  } catch (error) {
    console.error('Database setup error:', error);
    return {
      name: 'Goals table setup failed',
      success: false,
      error
    };
  }
}