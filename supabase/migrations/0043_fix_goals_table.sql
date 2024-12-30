-- Add missing columns to goals table
ALTER TABLE goals ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'simple';
ALTER TABLE goals ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE goals ADD COLUMN IF NOT EXISTS progress integer;
ALTER TABLE goals ADD COLUMN IF NOT EXISTS target integer;
ALTER TABLE goals ADD COLUMN IF NOT EXISTS unit text;
ALTER TABLE goals ADD COLUMN IF NOT EXISTS tracking_type text CHECK (tracking_type IN ('slider', 'subgoals'));
ALTER TABLE goals ADD COLUMN IF NOT EXISTS items jsonb DEFAULT '[]'::jsonb;
ALTER TABLE goals ADD COLUMN IF NOT EXISTS monthly_progress jsonb DEFAULT '{}'::jsonb;
ALTER TABLE goals ADD COLUMN IF NOT EXISTS completed boolean DEFAULT false;

-- Update existing quantifiable goals to have default tracking_type
UPDATE goals 
SET tracking_type = 'slider' 
WHERE type = 'quantifiable' AND tracking_type IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN goals.tracking_type IS 'Tracking type for quantifiable goals: slider or subgoals';
COMMENT ON COLUMN goals.type IS 'Goal type: simple, quantifiable, or monthly';
COMMENT ON COLUMN goals.items IS 'Array of subgoals for quantifiable goals with subgoals tracking';
COMMENT ON COLUMN goals.monthly_progress IS 'Monthly progress tracking for monthly goals'; 