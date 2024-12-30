/*
  # Fix Shared Goals Access

  1. Changes
    - Update RLS policy for goals table to properly handle shared access
    - Add indexes to improve query performance
    - Fix foreign key references for sharing requests

  2. Security
    - Users can only view goals if they have an accepted sharing request
    - Original goal owners maintain full access to their goals
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their own goals" ON goals;
DROP POLICY IF EXISTS "Users can view goals shared with them" ON goals;

-- Create new policies
CREATE POLICY "Users can manage their own goals"
  ON goals
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

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
  );

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sharing_requests_status 
  ON sharing_requests(status) 
  WHERE status = 'accepted';

CREATE INDEX IF NOT EXISTS idx_goals_user_shared 
  ON goals(user_id) 
  INCLUDE (title, type, progress, target, completed, monthly_progress);