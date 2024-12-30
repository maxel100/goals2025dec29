/*
  # Add year name table
  
  1. New Tables
    - `year_name` table to store custom names for each year
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text, default 'My Goals Board')
      - `year` (integer, default current year)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS
    - Add policy for authenticated users
*/

-- Create year_name table
CREATE TABLE IF NOT EXISTS year_name (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL DEFAULT 'My Goals Board',
  year integer NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_year UNIQUE (user_id, year)
);

-- Enable RLS
ALTER TABLE year_name ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can manage their own year names" ON year_name;

-- Create policy
CREATE POLICY "Users can manage their own year names"
  ON year_name
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS year_name_user_year_idx ON year_name(user_id, year);