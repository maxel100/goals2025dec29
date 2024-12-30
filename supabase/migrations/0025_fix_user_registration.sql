-- Drop existing triggers to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_preferences ON auth.users;

-- Drop existing functions
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS handle_new_user_profile();
DROP FUNCTION IF EXISTS handle_new_user_preferences();
DROP FUNCTION IF EXISTS ensure_user_records(uuid);

-- Create a consolidated function to handle all user initialization
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  current_year integer;
BEGIN
  -- Get current year
  current_year := EXTRACT(YEAR FROM CURRENT_DATE);

  -- Wrap all operations in a transaction
  BEGIN
    -- Create user profile
    INSERT INTO public.user_profiles (id, email)
    VALUES (NEW.id, NEW.email)
    ON CONFLICT (id) DO NOTHING;

    -- Create life_mission record
    INSERT INTO public.life_mission (user_id, vision, importance)
    VALUES (NEW.id, '', '')
    ON CONFLICT (user_id) DO NOTHING;

    -- Create yearly_debrief record
    INSERT INTO public.yearly_debrief (user_id, wins, challenges, lessons)
    VALUES (NEW.id, '', '', '')
    ON CONFLICT (user_id) DO NOTHING;

    -- Create user_preferences record
    INSERT INTO public.user_preferences (user_id, email)
    VALUES (NEW.id, true)
    ON CONFLICT (user_id) DO NOTHING;

    -- Create default rules records
    INSERT INTO public.user_rules (user_id, type, rules)
    VALUES 
      (NEW.id, 'internal_talk', '[]'::jsonb),
      (NEW.id, 'success_rules', '[]'::jsonb),
      (NEW.id, 'business_rules', '[]'::jsonb)
    ON CONFLICT (user_id, type) DO NOTHING;

    -- Create year name record
    INSERT INTO public.year_name (user_id, name, year)
    VALUES (NEW.id, 'My Goals Board', current_year)
    ON CONFLICT (user_id, year) DO NOTHING;

  EXCEPTION WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a single trigger for user initialization
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated; 