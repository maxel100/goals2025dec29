-- Add tracking_type column to goals table
ALTER TABLE goals ADD COLUMN IF NOT EXISTS tracking_type text;

-- Update existing goals to have a default tracking_type
UPDATE goals 
SET tracking_type = 'slider' 
WHERE type = 'quantifiable' AND tracking_type IS NULL;