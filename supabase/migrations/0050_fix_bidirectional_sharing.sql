/*
  # Fix Bidirectional Goal Sharing
  
  1. Changes
    - Update RLS policies to properly handle bidirectional sharing
    - Add optimized indexes for better performance
    - Ensure both users in a sharing relationship can see each other's goals
  
  2. Security
    - Maintain data isolation
    - Allow proper read access for shared goals in both directions
    - Prevent unauthorized access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view shared goals" ON goals;
DROP POLICY IF EXISTS "Users can manage their own goals" ON goals;

-- Create policy for managing own goals
CREATE POLICY "Users can manage their own goals"
  ON goals
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policy for viewing shared goals that handles both directions
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
        -- Allow both directions of sharing
        (sr.from_user_id = auth.uid() AND sr.to_user_id = goals.user_id) OR
        (sr.to_user_id = auth.uid() AND sr.from_user_id = goals.user_id)
      )
    )
  );

-- Drop existing indexes
DROP INDEX IF EXISTS idx_sharing_requests_from_status;
DROP INDEX IF EXISTS idx_sharing_requests_to_status;
DROP INDEX IF EXISTS idx_sharing_requests_bidirectional;
DROP INDEX IF EXISTS idx_sharing_requests_reverse;

-- Create optimized indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sharing_requests_bidirectional
  ON sharing_requests (from_user_id, to_user_id, status)
  WHERE status = 'accepted';

CREATE INDEX IF NOT EXISTS idx_sharing_requests_reverse
  ON sharing_requests (to_user_id, from_user_id, status)
  WHERE status = 'accepted';

-- Add index for goals lookup
CREATE INDEX IF NOT EXISTS idx_goals_user_lookup
  ON goals (user_id)
  INCLUDE (title, type, category, progress, target, completed, monthly_progress)
  WHERE NOT hidden; 