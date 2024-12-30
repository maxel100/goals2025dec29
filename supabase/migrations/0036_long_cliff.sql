-- Create wizard_completion table to track onboarding state
CREATE TABLE IF NOT EXISTS wizard_completion (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_wizard UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE wizard_completion ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can manage their own wizard completion"
  ON wizard_completion
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add to ensure_user_records function
CREATE OR REPLACE FUNCTION ensure_user_records(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_year integer;
BEGIN
  current_year := EXTRACT(YEAR FROM CURRENT_DATE);

  -- Create wizard completion record
  INSERT INTO public.wizard_completion (user_id, completed)
  VALUES (p_user_id, false)
  ON CONFLICT (user_id) DO NOTHING;

  -- Rest of the existing function...
  INSERT INTO public.life_mission (user_id, vision, importance)
  VALUES (p_user_id, '', '')
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.yearly_debrief (user_id, wins, challenges, lessons)
  VALUES (p_user_id, '', '', '')
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