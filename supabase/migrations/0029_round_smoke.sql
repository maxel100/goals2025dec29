/*
  # Fix Shared Goals Access

  1. Changes
    - Update RLS policies for better shared goals access
    - Add composite indexes for performance
    - Fix policy conditions

  2. Security
    - Maintain data isolation between users
    - Allow read-only access to shared goals
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their own goals" ON goals;
DROP POLICY IF EXISTS "Users can view shared goals" ON goals;

-- Create separate policies for different operations
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
      JOIN user_profiles up ON up.id = goals.user_id
      WHERE sr.from_user_id = auth.uid()
        AND sr.to_user_id = goals.user_id
        AND sr.status = 'accepted'
    )
  );

-- Add composite indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_goals_sharing_lookup 
  ON goals(user_id)
  INCLUDE (title, type, category, progress, target, completed, monthly_progress);

CREATE INDEX IF NOT EXISTS idx_sharing_requests_lookup 
  ON sharing_requests(from_user_id, to_user_id, status)
  WHERE status = 'accepted';