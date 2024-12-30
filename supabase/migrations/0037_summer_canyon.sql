-- Drop existing function
DROP FUNCTION IF EXISTS delete_user_account();

-- Create updated function with proper deletion order
CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  -- Get the current user's ID
  current_user_id := auth.uid();
  
  -- Delete data in the correct order to handle foreign key constraints
  DELETE FROM sharing_requests 
  WHERE from_user_id = current_user_id 
     OR to_user_id = current_user_id;

  DELETE FROM weekly_motivation 
  WHERE user_id = current_user_id;

  DELETE FROM daily_priorities 
  WHERE user_id = current_user_id;

  DELETE FROM weekly_priorities 
  WHERE user_id = current_user_id;

  DELETE FROM monthly_goals 
  WHERE user_id = current_user_id;

  DELETE FROM goals 
  WHERE user_id = current_user_id;

  DELETE FROM user_rules
  WHERE user_id = current_user_id;

  DELETE FROM year_name
  WHERE user_id = current_user_id;

  DELETE FROM life_mission 
  WHERE user_id = current_user_id;

  DELETE FROM yearly_debrief 
  WHERE user_id = current_user_id;

  DELETE FROM user_preferences 
  WHERE user_id = current_user_id;

  -- Add wizard_completion deletion
  DELETE FROM wizard_completion
  WHERE user_id = current_user_id;

  DELETE FROM user_profiles 
  WHERE id = current_user_id;

  -- Delete the user from auth.users
  DELETE FROM auth.users 
  WHERE id = current_user_id;

  -- Refresh materialized view
  REFRESH MATERIALIZED VIEW CONCURRENTLY shared_access;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_user_account() TO authenticated;