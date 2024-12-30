-- Add explicit foreign key names to help with query disambiguation
ALTER TABLE sharing_requests
  DROP CONSTRAINT IF EXISTS sharing_requests_from_user_id_fkey,
  DROP CONSTRAINT IF EXISTS sharing_requests_to_user_id_fkey;

ALTER TABLE sharing_requests
  ADD CONSTRAINT sharing_requests_from_user_id_fkey 
    FOREIGN KEY (from_user_id) 
    REFERENCES user_profiles(id),
  ADD CONSTRAINT sharing_requests_to_user_id_fkey 
    FOREIGN KEY (to_user_id) 
    REFERENCES user_profiles(id);

-- Create indexes to improve query performance
CREATE INDEX IF NOT EXISTS idx_sharing_requests_from_user_status 
  ON sharing_requests(from_user_id, status);
CREATE INDEX IF NOT EXISTS idx_sharing_requests_to_user_status 
  ON sharing_requests(to_user_id, status);