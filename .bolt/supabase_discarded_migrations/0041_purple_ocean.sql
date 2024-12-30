-- Drop existing policy
DROP POLICY IF EXISTS "Users can view shared goals" ON goals;

-- Create optimized policy for viewing shared goals
CREATE POLICY "Users can view shared goals"
  ON goals
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM sharing_requests sr
      WHERE sr.status = 'accepted'
      AND (
        -- Check both directions of sharing
        (sr.from_user_id = auth.uid() AND sr.to_user_id = goals.user_id) OR
        (sr.to_user_id = auth.uid() AND sr.from_user_id = goals.user_id)
      )
    )
  );

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS idx_sharing_requests_from_status;
DROP INDEX IF EXISTS idx_sharing_requests_to_status;

-- Create more efficient composite indexes
CREATE INDEX idx_sharing_requests_from_accepted
  ON sharing_requests (from_user_id, to_user_id)
  WHERE status = 'accepted';

CREATE INDEX idx_sharing_requests_to_accepted
  ON sharing_requests (to_user_id, from_user_id) 
  WHERE status = 'accepted';

-- Add index on goals for faster lookups
CREATE INDEX idx_goals_user_lookup
  ON goals (user_id)
  INCLUDE (title, type, category, progress, target, completed, monthly_progress);

-- Analyze tables to update statistics
ANALYZE sharing_requests;
ANALYZE goals;