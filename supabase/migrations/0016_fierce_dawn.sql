-- Drop tracking_type column if it exists (to clean up any inconsistencies)
ALTER TABLE goals DROP COLUMN IF EXISTS tracking_type;

-- Add tracking_type column with proper constraints
ALTER TABLE goals ADD COLUMN tracking_type text CHECK (tracking_type IN ('slider', 'subgoals'));

-- Update existing quantifiable goals to use slider by default
UPDATE goals 
SET tracking_type = 'slider' 
WHERE type = 'quantifiable' AND tracking_type IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN goals.tracking_type IS 'Tracking type for quantifiable goals: slider or subgoals';