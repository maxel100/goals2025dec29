-- Drop and recreate ensure_user_records function to properly handle wizard completion
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

  -- Create wizard completion record with default values
  INSERT INTO public.wizard_completion (user_id, completed)
  VALUES (p_user_id, false)
  ON CONFLICT (user_id) DO UPDATE
  SET completed = false
  WHERE wizard_completion.completed IS NULL;

  -- Rest of the existing records...
  INSERT INTO public.life_mission (user_id, vision, importance)
  VALUES (p_user_id, '', '')
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.yearly_debrief (user_id, wins, challenges)
  VALUES (p_user_id, '', '')
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_preferences (user_id, email)
  VALUES (p_user_id, true)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_rules (user_id, type, rules)
  VALUES 
    (p_user_id, 'internal_talk', '[]'::jsonb),
    (p_user_id, 'success_rules', '[]'::jsonb),
    (p_user_id, 'business_rules', '[]'::jsonb)
  ON CONFLICT (user_id, type) DO NOTHING;

  INSERT INTO public.year_name (user_id, name, year)
  VALUES (p_user_id, 'My Goals Board', current_year)
  ON CONFLICT (user_id, year) DO NOTHING;
END;
$$;