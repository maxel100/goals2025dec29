import { supabase } from '../lib/supabase';
import { Goal, GoalInput } from '../types/goals';
import { generateGoalsFromSurvey } from './ai';

export async function generateGoals(surveyData: any): Promise<Goal[]> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No authenticated session');

    // Generate goals from survey data
    const aiGoals = await generateGoalsFromSurvey(surveyData);
    
    // Only use default goals if no survey goals were generated
    if (!aiGoals.length) {
      console.log('No goals generated from survey, using defaults');
      return [];
    }

    // Format goals for database
    const formattedGoals = aiGoals.map(goal => ({
      title: goal.title,
      category: goal.category,
      type: goal.type,
      completed: false,
      progress: 0,
      target: goal.target || null,
      unit: goal.unit || null,
      items: [],
      monthly_progress: {},
      user_id: session.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    // Insert goals into database
    const { data: insertedGoals, error: insertError } = await supabase
      .from('goals')
      .insert(formattedGoals)
      .select();

    if (insertError) throw insertError;
    return insertedGoals || [];
  } catch (error) {
    console.error('Error generating goals:', error);
    throw error;
  }
}