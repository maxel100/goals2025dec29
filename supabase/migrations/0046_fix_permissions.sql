-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant permissions on all existing tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Ensure the ensure_user_records function is accessible
GRANT EXECUTE ON FUNCTION ensure_user_records(uuid) TO authenticated;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION ensure_user_records(NEW.id);

-- Ensure unique constraints
ALTER TABLE public.user_preferences
  DROP CONSTRAINT IF EXISTS unique_user_preferences,
  ADD CONSTRAINT unique_user_preferences UNIQUE (user_id);

ALTER TABLE public.wizard_completion
  DROP CONSTRAINT IF EXISTS unique_user_wizard,
  ADD CONSTRAINT unique_user_wizard UNIQUE (user_id);

-- Add missing ON CONFLICT clauses to ensure_user_records function
CREATE OR REPLACE FUNCTION ensure_user_records(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_year integer;
BEGIN
  current_year := EXTRACT(YEAR FROM CURRENT_DATE);

  -- Create user_preferences record
  INSERT INTO public.user_preferences (user_id, email)
  VALUES (p_user_id, true)
  ON CONFLICT (user_id) DO NOTHING;

  -- Create wizard_completion record
  INSERT INTO public.wizard_completion (user_id, completed)
  VALUES (p_user_id, false)
  ON CONFLICT (user_id) DO NOTHING;

  -- Create life_mission record
  INSERT INTO public.life_mission (user_id, vision, importance)
  VALUES (p_user_id, '', '')
  ON CONFLICT (user_id) DO NOTHING;

  -- Create yearly_debrief record
  INSERT INTO public.yearly_debrief (user_id, wins, challenges, lessons)
  VALUES (p_user_id, '', '', '')
  ON CONFLICT (user_id) DO NOTHING;

  -- Create user_rules records
  INSERT INTO public.user_rules (user_id, type, rules)
  VALUES 
    (p_user_id, 'internal_talk', '[]'::jsonb),
    (p_user_id, 'success_rules', '[]'::jsonb),
    (p_user_id, 'business_rules', '[]'::jsonb)
  ON CONFLICT (user_id, type) DO NOTHING;

  -- Create year_name record
  INSERT INTO public.year_name (user_id, name, year)
  VALUES (p_user_id, 'My Goals Board', current_year)
  ON CONFLICT (user_id, year) DO NOTHING;

  -- Create initial goals record with id to handle conflict
  INSERT INTO public.goals (id, user_id, title, category, type)
  VALUES (gen_random_uuid(), p_user_id, 'Welcome to Your Goals', 'mind', 'simple')
  ON CONFLICT DO NOTHING;

  -- Create initial quarterly_goals record with id
  INSERT INTO public.quarterly_goals (id, user_id, quarter_start, goals)
  VALUES (gen_random_uuid(), p_user_id, date_trunc('quarter', CURRENT_DATE), '[]'::jsonb)
  ON CONFLICT DO NOTHING;

  -- Create initial monthly_goals record with id
  INSERT INTO public.monthly_goals (id, user_id, month_of, goals)
  VALUES (gen_random_uuid(), p_user_id, date_trunc('month', CURRENT_DATE), '[]'::jsonb)
  ON CONFLICT DO NOTHING;

  -- Create initial weekly_priorities record with id
  INSERT INTO public.weekly_priorities (id, user_id, week_of, priorities)
  VALUES (gen_random_uuid(), p_user_id, date_trunc('week', CURRENT_DATE), '[]'::jsonb)
  ON CONFLICT DO NOTHING;

  -- Create initial daily_priorities record with id
  INSERT INTO public.daily_priorities (id, user_id, date_of, priorities)
  VALUES (gen_random_uuid(), p_user_id, CURRENT_DATE, '[]'::jsonb)
  ON CONFLICT DO NOTHING;

EXCEPTION WHEN OTHERS THEN
  -- Log the error and re-raise
  RAISE NOTICE 'Error in ensure_user_records: %', SQLERRM;
  RAISE;
END;
$$; 