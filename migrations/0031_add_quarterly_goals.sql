-- Create quarterly_goals table
CREATE TABLE IF NOT EXISTS quarterly_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quarter_start TIMESTAMP WITH TIME ZONE NOT NULL,
  goals JSONB DEFAULT '[]'::JSONB,
  is_visible BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, quarter_start)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS quarterly_goals_user_id_idx ON quarterly_goals(user_id);
CREATE INDEX IF NOT EXISTS quarterly_goals_quarter_start_idx ON quarterly_goals(quarter_start);

-- Enable Row Level Security
ALTER TABLE quarterly_goals ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'quarterly_goals' AND policyname = 'Users can view their own quarterly goals'
  ) THEN
    CREATE POLICY "Users can view their own quarterly goals"
      ON quarterly_goals FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'quarterly_goals' AND policyname = 'Users can create their own quarterly goals'
  ) THEN
    CREATE POLICY "Users can create their own quarterly goals"
      ON quarterly_goals FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'quarterly_goals' AND policyname = 'Users can update their own quarterly goals'
  ) THEN
    CREATE POLICY "Users can update their own quarterly goals"
      ON quarterly_goals FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT FROM pg_policies WHERE tablename = 'quarterly_goals' AND policyname = 'Users can delete their own quarterly goals'
  ) THEN
    CREATE POLICY "Users can delete their own quarterly goals"
      ON quarterly_goals FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Function to ensure quarterly goals records exist for a user
CREATE OR REPLACE FUNCTION ensure_quarterly_goals()
RETURNS TRIGGER AS $$
DECLARE
  current_quarter TIMESTAMP WITH TIME ZONE;
  next_quarter TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Calculate current and next quarter start dates
  current_quarter := date_trunc('quarter', CURRENT_TIMESTAMP);
  next_quarter := current_quarter + INTERVAL '3 months';
  
  -- Insert record for current quarter if it doesn't exist
  INSERT INTO quarterly_goals (user_id, quarter_start, goals, is_visible)
  VALUES (NEW.id, current_quarter, '[]'::JSONB, false)
  ON CONFLICT (user_id, quarter_start) DO NOTHING;
  
  -- Insert record for next quarter if it doesn't exist
  INSERT INTO quarterly_goals (user_id, quarter_start, goals, is_visible)
  VALUES (NEW.id, next_quarter, '[]'::JSONB, false)
  ON CONFLICT (user_id, quarter_start) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to run the function for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION ensure_quarterly_goals();

-- Run for existing users
DO $$
DECLARE
  current_quarter TIMESTAMP WITH TIME ZONE;
  next_quarter TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Calculate current and next quarter start dates
  current_quarter := date_trunc('quarter', CURRENT_TIMESTAMP);
  next_quarter := current_quarter + INTERVAL '3 months';
  
  -- Insert records for all existing users
  INSERT INTO quarterly_goals (user_id, quarter_start, goals, is_visible)
  SELECT id, current_quarter, '[]'::JSONB, false
  FROM auth.users
  ON CONFLICT (user_id, quarter_start) DO NOTHING;
  
  INSERT INTO quarterly_goals (user_id, quarter_start, goals, is_visible)
  SELECT id, next_quarter, '[]'::JSONB, false
  FROM auth.users
  ON CONFLICT (user_id, quarter_start) DO NOTHING;
END $$; 