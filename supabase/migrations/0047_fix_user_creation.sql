-- Drop existing triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS ensure_user_records(uuid) CASCADE;

-- Create a simplified user creation function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  current_year integer;
BEGIN
  -- Get current year
  current_year := EXTRACT(YEAR FROM CURRENT_DATE);

  -- Create user_preferences record
  INSERT INTO public.user_preferences (user_id, email)
  VALUES (NEW.id, true)
  ON CONFLICT (user_id) DO NOTHING;

  -- Create wizard_completion record
  INSERT INTO public.wizard_completion (user_id, completed)
  VALUES (NEW.id, false)
  ON CONFLICT (user_id) DO NOTHING;

  -- Create life_mission record
  INSERT INTO public.life_mission (user_id, vision, importance)
  VALUES (NEW.id, '', '')
  ON CONFLICT (user_id) DO NOTHING;

  -- Create yearly_debrief record
  INSERT INTO public.yearly_debrief (user_id, wins, challenges, lessons)
  VALUES (NEW.id, '', '', '')
  ON CONFLICT (user_id) DO NOTHING;

  -- Create user_rules records
  INSERT INTO public.user_rules (user_id, type, rules)
  VALUES 
    (NEW.id, 'internal_talk', '[]'::jsonb),
    (NEW.id, 'success_rules', '[]'::jsonb),
    (NEW.id, 'business_rules', '[]'::jsonb)
  ON CONFLICT (user_id, type) DO NOTHING;

  -- Create year_name record
  INSERT INTO public.year_name (user_id, name, year)
  VALUES (NEW.id, 'My Goals Board', current_year)
  ON CONFLICT (user_id, year) DO NOTHING;

  -- Create initial goals record
  INSERT INTO public.goals (id, user_id, title, category, type)
  VALUES (gen_random_uuid(), NEW.id, 'Welcome to Your Goals', 'mind', 'simple')
  ON CONFLICT DO NOTHING;

  -- Create initial quarterly_goals record
  INSERT INTO public.quarterly_goals (id, user_id, quarter_start, goals)
  VALUES (gen_random_uuid(), NEW.id, date_trunc('quarter', CURRENT_DATE), '[]'::jsonb)
  ON CONFLICT DO NOTHING;

  -- Create initial monthly_goals record
  INSERT INTO public.monthly_goals (id, user_id, month_of, goals)
  VALUES (gen_random_uuid(), NEW.id, date_trunc('month', CURRENT_DATE), '[]'::jsonb)
  ON CONFLICT DO NOTHING;

  -- Create initial weekly_priorities record
  INSERT INTO public.weekly_priorities (id, user_id, week_of, priorities)
  VALUES (gen_random_uuid(), NEW.id, date_trunc('week', CURRENT_DATE), '[]'::jsonb)
  ON CONFLICT DO NOTHING;

  -- Create initial daily_priorities record
  INSERT INTO public.daily_priorities (id, user_id, date_of, priorities)
  VALUES (gen_random_uuid(), NEW.id, CURRENT_DATE, '[]'::jsonb)
  ON CONFLICT DO NOTHING;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in handle_new_user: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Create new trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Ensure RLS is enabled on all tables
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
  END LOOP;
END
$$; 