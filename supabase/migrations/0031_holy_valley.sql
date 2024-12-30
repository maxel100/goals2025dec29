/*
  # Fix Goal Sharing Permissions

  1. Changes
    - Update RLS policies for goals table
    - Add better indexes for performance
    - Fix policy conditions for shared access

  2. Security
    - Maintain data isolation
    - Allow proper read access for shared goals
    - Prevent unauthorized access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their own goals" ON goals;
DROP POLICY IF EXISTS "Users can view shared goals" ON goals;

-- Create new policies with fixed conditions
CREATE POLICY "Users can manage their own goals"
  ON goals
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create a separate policy for viewing shared goals
CREATE POLICY "Users can view shared goals"
  ON goals
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM sharing_requests sr
      WHERE sr.from_user_id = auth.uid()
        AND sr.to_user_id = goals.user_id
        AND sr.status = 'accepted'
    )
    OR
    EXISTS (
      SELECT 1 
      FROM sharing_requests sr
      WHERE sr.to_user_id = auth.uid()
        AND sr.from_user_id = goals.user_id
        AND sr.status = 'accepted'
    )
  );

-- Add better indexes for performance
CREATE INDEX IF NOT EXISTS idx_goals_sharing_lookup 
  ON goals(user_id)
  INCLUDE (title, type, category, progress, target, completed, monthly_progress);

CREATE INDEX IF NOT EXISTS idx_sharing_requests_bidirectional_lookup 
  ON sharing_requests(from_user_id, to_user_id, status)
  WHERE status = 'accepted';

CREATE INDEX IF NOT EXISTS idx_sharing_requests_reverse_lookup 
  ON sharing_requests(to_user_id, from_user_id, status)
  WHERE status = 'accepted';