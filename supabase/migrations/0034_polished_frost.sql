/*
  # Fix Goal Sharing Access

  1. Changes
    - Simplify RLS policies for better performance
    - Add materialized view for quick access checks
    - Add function to refresh access view
    - Update indexes for optimal query performance

  2. Security
    - Maintain strict access control
    - Prevent unauthorized access
    - Enable bidirectional sharing
*/

-- Create materialized view for quick access checks
CREATE MATERIALIZED VIEW shared_access AS
SELECT DISTINCT
  CASE 
    WHEN sr.from_user_id = up1.id THEN sr.to_user_id
    ELSE sr.from_user_id
  END as viewer_id,
  CASE 
    WHEN sr.from_user_id = up1.id THEN sr.from_user_id
    ELSE sr.to_user_id
  END as owner_id
FROM sharing_requests sr
JOIN user_profiles up1 ON (up1.id = sr.from_user_id OR up1.id = sr.to_user_id)
WHERE sr.status = 'accepted';

-- Create index on materialized view
CREATE UNIQUE INDEX idx_shared_access_lookup 
ON shared_access(viewer_id, owner_id);

-- Create function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_shared_access()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY shared_access;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh view on sharing changes
CREATE TRIGGER refresh_shared_access_trigger
AFTER INSERT OR UPDATE OR DELETE ON sharing_requests
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_shared_access();

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their own goals" ON goals;
DROP POLICY IF EXISTS "Users can view shared goals" ON goals;

-- Create simplified policies
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
      FROM shared_access sa
      WHERE sa.viewer_id = auth.uid()
        AND sa.owner_id = goals.user_id
    )
  );

-- Add optimized indexes
CREATE INDEX IF NOT EXISTS idx_goals_user_lookup 
  ON goals(user_id)
  INCLUDE (title, type, category, progress, target, completed);

-- Grant necessary permissions
GRANT SELECT ON shared_access TO authenticated;