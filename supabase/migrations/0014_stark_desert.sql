-- Add tracking_type column if it doesn't exist
ALTER TABLE goals ADD COLUMN IF NOT EXISTS tracking_type text;

-- Update existing quantifiable goals to have default tracking_type
UPDATE goals 
SET tracking_type = 'slider' 
WHERE type = 'quantifiable' AND tracking_type IS NULL;

-- Add comment to document column purpose
COMMENT ON COLUMN goals.tracking_type IS 'Tracking type for quantifiable goals (slider or subgoals)';