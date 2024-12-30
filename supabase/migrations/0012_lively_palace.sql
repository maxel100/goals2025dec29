-- Create a function to ensure all required user records exist
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
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION ensure_user_records(uuid) TO authenticated;