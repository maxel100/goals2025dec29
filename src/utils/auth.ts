import { supabase } from '../lib/supabase';

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    throw new Error('Not authenticated');
  }
  
  if (!user) {
    throw new Error('User not found');
  }

  // Get the user profile with additional information
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    throw new Error('User profile not found');
  }

  return {
    id: user.id,
    email: user.email,
    ...profile
  };
} 