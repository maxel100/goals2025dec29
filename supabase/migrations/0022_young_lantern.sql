-- Drop existing function and trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS ensure_user_records(uuid);

-- Create a more robust initialization function
CREATE OR REPLACE FUNCTION ensure_user_records(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_year integer;
BEGIN
  -- Get current year
  current_year := EXTRACT(YEAR FROM CURRENT_DATE);

  -- Wrap all operations in a transaction
  BEGIN
    -- Create life_mission record
    INSERT INTO public.life_mission (user_id, vision, importance)
    VALUES (p_user_id, '', '')
    ON CONFLICT (user_id) DO NOTHING;

    -- Create yearly_debrief record
    INSERT INTO public.yearly_debrief (user_id, wins, challenges, lessons)
    VALUES (p_user_id, '', '', '')
    ON CONFLICT (user_id) DO NOTHING;

    -- Create user_preferences record
    INSERT INTO public.user_preferences (user_id, email)
    VALUES (p_user_id, true)
    ON CONFLICT (user_id) DO NOTHING;

    -- Create default rules records
    INSERT INTO public.user_rules (user_id, type, rules)
    VALUES 
      (p_user_id, 'internal_talk', '[]'::jsonb),
      (p_user_id, 'success_rules', '[]'::jsonb),
      (p_user_id, 'business_rules', '[]'::jsonb)
    ON CONFLICT (user_id, type) DO NOTHING;

    -- Create year name record
    INSERT INTO public.year_name (user_id, name, year)
    VALUES (p_user_id, 'My Goals Board', current_year)
    ON CONFLICT (user_id, year) DO NOTHING;

  EXCEPTION WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE NOTICE 'Error in ensure_user_records: %', SQLERRM;
  END;
END;
$$;

-- Create new trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM ensure_user_records(NEW.id);
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the user creation
  RAISE NOTICE 'Error in handle_new_user: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create new trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();