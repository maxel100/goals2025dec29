/*
  # Remove hardcoded data and add user-specific data handling

  1. Changes
    - Remove hardcoded data initialization
    - Add user-specific data constraints
    - Update triggers for new user initialization
*/

-- Drop existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Update the function to not insert any default data
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create empty life_mission record
  INSERT INTO public.life_mission (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Create empty yearly_debrief record
  INSERT INTO public.yearly_debrief (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Create empty user_preferences record with email enabled
  INSERT INTO public.user_preferences (user_id, email)
  VALUES (NEW.id, TRUE)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();