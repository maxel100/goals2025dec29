-- Add hidden column to goals table
ALTER TABLE goals ADD COLUMN hidden boolean DEFAULT false;

-- Update sharing policy to exclude hidden goals
DROP POLICY IF EXISTS "Users can view shared goals" ON goals;

CREATE POLICY "Users can view shared goals"
  ON goals
  FOR SELECT
  TO authenticated
  USING (
    NOT hidden AND
    EXISTS (
      SELECT 1 
      FROM sharing_requests sr
      WHERE sr.status = 'accepted'
      AND (
        (sr.from_user_id = auth.uid() AND sr.to_user_id = goals.user_id) OR
        (sr.to_user_id = auth.uid() AND sr.from_user_id = goals.user_id)
      )
    )
  );

-- Add index for hidden goals
CREATE INDEX idx_goals_hidden ON goals(hidden) WHERE hidden = true;