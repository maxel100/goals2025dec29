/*
  # Add Daily Priorities Feature

  1. New Tables
    - `daily_priorities`
      - `id` (uuid, primary key)
      - `date_of` (date, not null)
      - `priorities` (jsonb, array of priority objects)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on daily_priorities table
    - Add policy for authenticated users to manage their priorities
*/

CREATE TABLE IF NOT EXISTS daily_priorities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date_of date NOT NULL,
  priorities jsonb DEFAULT '[]'::jsonb,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT daily_priorities_user_date_unique UNIQUE (user_id, date_of)
);

ALTER TABLE daily_priorities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own daily priorities"
  ON daily_priorities
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS daily_priorities_user_date_idx ON daily_priorities(user_id, date_of);