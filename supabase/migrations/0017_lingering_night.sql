-- Drop and recreate the ensure_user_records function with better error handling
CREATE OR REPLACE FUNCTION ensure_user_records(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create life_mission record if it doesn't exist
  INSERT INTO public.life_mission (user_id, vision, importance)
  VALUES (user_id, '', '')
  ON CONFLICT (user_id) DO NOTHING;

  -- Create yearly_debrief record if it doesn't exist
  INSERT INTO public.yearly_debrief (user_id, wins, challenges, lessons)
  VALUES (user_id, '', '', '')
  ON CONFLICT (user_id) DO NOTHING;

  -- Create user_preferences record if it doesn't exist
  INSERT INTO public.user_preferences (user_id, email)
  VALUES (user_id, true)
  ON CONFLICT (user_id) DO NOTHING;

  -- Create default rules records if they don't exist
  INSERT INTO public.user_rules (user_id, type, rules)
  VALUES 
    (user_id, 'internal_talk', '[]'::jsonb),
    (user_id, 'success_rules', '[]'::jsonb),
    (user_id, 'business_rules', '[]'::jsonb)
  ON CONFLICT (user_id, type) DO NOTHING;
END;
$$;

-- Create a trigger to automatically ensure records exist for new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM ensure_user_records(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION ensure_user_records(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION handle_new_user() TO authenticated;