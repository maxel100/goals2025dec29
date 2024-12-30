-- Add year_name table
CREATE TABLE IF NOT EXISTS year_name (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL DEFAULT 'My Goals Board',
  year integer NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_year UNIQUE (user_id, year)
);

-- Enable RLS
ALTER TABLE year_name ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can manage their own year names"
  ON year_name
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add to ensure_user_records function
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

  -- Create year name record if it doesn't exist
  INSERT INTO public.year_name (user_id, name, year)
  VALUES (user_id, 'My Goals Board', EXTRACT(YEAR FROM CURRENT_DATE))
  ON CONFLICT (user_id, year) DO NOTHING;
END;
$$;