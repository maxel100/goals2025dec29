-- Drop existing function
DROP FUNCTION IF EXISTS delete_user_account();

-- Create updated function with proper permissions and cascading deletes
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

-- Add cascade delete triggers for cleanup
CREATE OR REPLACE FUNCTION handle_deleted_user() 
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Clean up any remaining data
  DELETE FROM sharing_requests WHERE from_user_id = OLD.id OR to_user_id = OLD.id;
  DELETE FROM weekly_motivation WHERE user_id = OLD.id;
  DELETE FROM daily_priorities WHERE user_id = OLD.id;
  DELETE FROM weekly_priorities WHERE user_id = OLD.id;
  DELETE FROM monthly_goals WHERE user_id = OLD.id;
  DELETE FROM goals WHERE user_id = OLD.id;
  DELETE FROM user_rules WHERE user_id = OLD.id;
  DELETE FROM year_name WHERE user_id = OLD.id;
  DELETE FROM life_mission WHERE user_id = OLD.id;
  DELETE FROM yearly_debrief WHERE user_id = OLD.id;
  DELETE FROM user_preferences WHERE user_id = OLD.id;
  DELETE FROM user_profiles WHERE id = OLD.id;
  
  RETURN OLD;
END;
$$;

-- Create trigger for cleanup
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_deleted_user();