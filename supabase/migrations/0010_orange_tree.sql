/*
  # Add account deletion functionality
  
  1. New Features
    - Add stored procedure for deleting user account and all related data
    - Cascade deletion through all user-related tables
    - Maintain referential integrity
*/

-- Create a function to delete a user's account and all related data
CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id uuid;
BEGIN
  -- Get the current user's ID
  user_id := auth.uid();
  
  -- Delete data from all related tables
  DELETE FROM public.goals WHERE user_id = user_id;
  DELETE FROM public.weekly_priorities WHERE user_id = user_id;
  DELETE FROM public.monthly_goals WHERE user_id = user_id;
  DELETE FROM public.daily_priorities WHERE user_id = user_id;
  DELETE FROM public.ai_coach_goals WHERE user_id = user_id;
  DELETE FROM public.life_mission WHERE user_id = user_id;
  DELETE FROM public.yearly_debrief WHERE user_id = user_id;
  DELETE FROM public.weekly_motivation WHERE user_id = user_id;
  DELETE FROM public.user_preferences WHERE user_id = user_id;
  
  -- Delete the user from auth.users
  DELETE FROM auth.users WHERE id = user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_user_account() TO authenticated;