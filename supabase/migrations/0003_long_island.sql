/*
  # Add default records and improve error handling

  1. Changes
    - Add trigger to create default life_mission record on user creation
    - Add trigger to create default yearly_debrief record on user creation
    - Add function to handle default record creation
  
  2. Security
    - Maintain RLS policies
    - Only create records for authenticated users
*/

-- Function to create default records for new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create default life_mission record
  INSERT INTO public.life_mission (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Create default yearly_debrief record
  INSERT INTO public.yearly_debrief (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create default records when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();