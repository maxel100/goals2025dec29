/*
  # Fix account deletion functionality
  
  1. Changes
    - Fix ambiguous user_id references
    - Add table aliases for clarity
    - Ensure proper order of deletion
*/

-- Drop existing function
DROP FUNCTION IF EXISTS delete_user_account();

-- Create updated function with fixed references
CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  -- Get the current user's ID
  current_user_id := auth.uid();
  
  -- Delete data from all related tables with explicit table references
  DELETE FROM public.goals g WHERE g.user_id = current_user_id;
  DELETE FROM public.weekly_priorities wp WHERE wp.user_id = current_user_id;
  DELETE FROM public.monthly_goals mg WHERE mg.user_id = current_user_id;
  DELETE FROM public.daily_priorities dp WHERE dp.user_id = current_user_id;
  DELETE FROM public.ai_coach_goals acg WHERE acg.user_id = current_user_id;
  DELETE FROM public.life_mission lm WHERE lm.user_id = current_user_id;
  DELETE FROM public.yearly_debrief yd WHERE yd.user_id = current_user_id;
  DELETE FROM public.weekly_motivation wm WHERE wm.user_id = current_user_id;
  DELETE FROM public.user_preferences up WHERE up.user_id = current_user_id;
  
  -- Delete the user from auth.users
  DELETE FROM auth.users u WHERE u.id = current_user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_user_account() TO authenticated;