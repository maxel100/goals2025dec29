/*
  # Add rules table for storing user rules and statements
  
  1. New Tables
    - `user_rules`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `type` (text) - 'internal_talk', 'success_rules', or 'business_rules'
      - `rules` (jsonb array of strings)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS
    - Add policy for authenticated users
*/

-- Create the rules table
CREATE TABLE IF NOT EXISTS user_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  type text NOT NULL,
  rules jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_rule_type UNIQUE (user_id, type)
);

-- Enable RLS
ALTER TABLE user_rules ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can manage their own rules"
  ON user_rules
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index
CREATE INDEX IF NOT EXISTS user_rules_user_type_idx ON user_rules(user_id, type);