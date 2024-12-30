-- Drop existing foreign key constraints
ALTER TABLE sharing_requests 
  DROP CONSTRAINT IF EXISTS sharing_requests_from_user_id_fkey,
  DROP CONSTRAINT IF EXISTS sharing_requests_to_user_id_fkey;

-- Add new foreign key constraints to user_profiles
ALTER TABLE sharing_requests
  ADD CONSTRAINT sharing_requests_from_user_id_fkey 
    FOREIGN KEY (from_user_id) 
    REFERENCES user_profiles(id),
  ADD CONSTRAINT sharing_requests_to_user_id_fkey 
    FOREIGN KEY (to_user_id) 
    REFERENCES user_profiles(id);