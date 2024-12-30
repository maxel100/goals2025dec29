-- Drop existing materialized view and related objects
DROP POLICY IF EXISTS "Users can view shared goals" ON goals;
DROP TRIGGER IF EXISTS refresh_shared_access_trigger ON sharing_requests;
DROP FUNCTION IF EXISTS refresh_shared_access();
DROP MATERIALIZED VIEW IF EXISTS shared_access;

-- Create a simpler policy directly on goals table
CREATE POLICY "Users can view shared goals"
  ON goals
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM sharing_requests sr
      WHERE (
        -- Allow access in both directions
        (sr.from_user_id = auth.uid() AND sr.to_user_id = goals.user_id) OR
        (sr.to_user_id = auth.uid() AND sr.from_user_id = goals.user_id)
      )
      AND sr.status = 'accepted'
    )
  );

-- Add indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_sharing_requests_from_status 
  ON sharing_requests(from_user_id, status)
  WHERE status = 'accepted';

CREATE INDEX IF NOT EXISTS idx_sharing_requests_to_status 
  ON sharing_requests(to_user_id, status)
  WHERE status = 'accepted';