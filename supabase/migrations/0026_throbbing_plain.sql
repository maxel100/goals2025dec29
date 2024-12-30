-- Add policies for viewing shared goals
CREATE POLICY "Users can view goals shared with them"
  ON goals
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM sharing_requests
      WHERE from_user_id = auth.uid()
        AND to_user_id = goals.user_id
        AND status = 'accepted'
    )
  );

-- Add index to improve query performance
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);