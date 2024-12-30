-- First drop the policy that depends on the materialized view
DROP POLICY IF EXISTS "Users can view shared goals" ON goals;

-- Now we can safely drop the materialized view
DROP MATERIALIZED VIEW IF EXISTS shared_access;

-- Recreate materialized view with proper permissions
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

-- Grant necessary permissions
GRANT SELECT ON shared_access TO authenticated;
GRANT ALL ON shared_access TO postgres;
GRANT ALL ON shared_access TO service_role;

-- Create function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_shared_access()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY shared_access;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS refresh_shared_access_trigger ON sharing_requests;

-- Create trigger to refresh view on sharing changes
CREATE TRIGGER refresh_shared_access_trigger
AFTER INSERT OR UPDATE OR DELETE ON sharing_requests
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_shared_access();

-- Recreate the policy using the materialized view
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

-- Initial refresh of the materialized view
REFRESH MATERIALIZED VIEW CONCURRENTLY shared_access;