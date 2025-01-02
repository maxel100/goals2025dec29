/*
  # Fix Sharing Requests Policies
  
  1. Changes
    - Add missing policy to allow users to view their own sent requests
    - Keep existing policies intact
    
  2. Security
    - Maintain existing security model
    - Add necessary access for sent requests
*/

-- Add missing policy for viewing sent requests
CREATE POLICY "Users can view their sent requests"
  ON sharing_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = from_user_id); 