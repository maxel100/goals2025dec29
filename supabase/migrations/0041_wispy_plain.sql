-- Drop existing policies
DROP POLICY IF EXISTS "Users can view shared goals" ON goals;

-- Create new policy for bidirectional goal sharing
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
        -- Allow both directions of sharing
        (sr.from_user_id = auth.uid() AND sr.to_user_id = goals.user_id) OR
        (sr.to_user_id = auth.uid() AND sr.from_user_id = goals.user_id)
      )
    )
  );

-- Add optimized indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sharing_requests_bidirectional
  ON sharing_requests (from_user_id, to_user_id, status)
  WHERE status = 'accepted';

CREATE INDEX IF NOT EXISTS idx_sharing_requests_reverse
  ON sharing_requests (to_user_id, from_user_id, status)
  WHERE status = 'accepted';