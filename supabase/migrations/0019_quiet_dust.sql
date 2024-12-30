-- Drop and recreate ensure_user_records to fix year name initialization
CREATE OR REPLACE FUNCTION ensure_user_records(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_year integer;
BEGIN
  -- Get current year
  current_year := EXTRACT(YEAR FROM CURRENT_DATE);

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

  -- Create year name record if it doesn't exist
  INSERT INTO public.year_name (user_id, name, year)
  VALUES (user_id, 'My Goals Board', current_year)
  ON CONFLICT (user_id, year) DO NOTHING;
END;
$$;