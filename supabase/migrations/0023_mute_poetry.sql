-- Create sharing_requests table
CREATE TABLE IF NOT EXISTS sharing_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id uuid REFERENCES auth.users NOT NULL,
  to_user_id uuid REFERENCES auth.users NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_sharing_request UNIQUE (from_user_id, to_user_id)
);

-- Enable RLS
ALTER TABLE sharing_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create sharing requests"
  ON sharing_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can view their received requests"
  ON sharing_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = to_user_id);

CREATE POLICY "Users can update their received requests"
  ON sharing_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = to_user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS sharing_requests_to_user_id_idx ON sharing_requests(to_user_id);
CREATE INDEX IF NOT EXISTS sharing_requests_from_user_id_idx ON sharing_requests(from_user_id);