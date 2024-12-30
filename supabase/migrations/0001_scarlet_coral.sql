/*
  # Initial Schema Setup

  1. New Tables
    - `goals`
      - `id` (uuid, primary key)
      - `title` (text)
      - `category` (text)
      - `type` (text)
      - `completed` (boolean)
      - `progress` (integer)
      - `target` (integer)
      - `unit` (text)
      - `items` (jsonb)
      - `monthly_progress` (jsonb)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `weekly_priorities`
      - `id` (uuid, primary key)
      - `week_of` (date)
      - `priorities` (jsonb)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `monthly_goals`
      - `id` (uuid, primary key)
      - `month_of` (date)
      - `goals` (jsonb)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `ai_coach_goals`
      - `id` (uuid, primary key)
      - `timeframe` (text)
      - `goals` (jsonb)
      - `importance` (text)
      - `period` (text)
      - `year` (integer)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `life_mission`
      - `id` (uuid, primary key)
      - `vision` (text)
      - `importance` (text)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `yearly_debrief`
      - `id` (uuid, primary key)
      - `wins` (text)
      - `challenges` (text)
      - `lessons` (text)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `weekly_motivation`
      - `id` (uuid, primary key)
      - `week_of` (date)
      - `content` (text)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  type text NOT NULL,
  completed boolean DEFAULT false,
  progress integer,
  target integer,
  unit text,
  items jsonb DEFAULT '[]'::jsonb,
  monthly_progress jsonb DEFAULT '{}'::jsonb,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own goals"
  ON goals
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Weekly priorities table
CREATE TABLE IF NOT EXISTS weekly_priorities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_of date NOT NULL,
  priorities jsonb DEFAULT '[]'::jsonb,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE weekly_priorities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own weekly priorities"
  ON weekly_priorities
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Monthly goals table
CREATE TABLE IF NOT EXISTS monthly_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month_of date NOT NULL,
  goals jsonb DEFAULT '[]'::jsonb,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE monthly_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own monthly goals"
  ON monthly_goals
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- AI coach goals table
CREATE TABLE IF NOT EXISTS ai_coach_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timeframe text NOT NULL,
  goals jsonb DEFAULT '[]'::jsonb,
  importance text,
  period text,
  year integer,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ai_coach_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own AI coach goals"
  ON ai_coach_goals
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Life mission table
CREATE TABLE IF NOT EXISTS life_mission (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vision text,
  importance text,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_mission UNIQUE (user_id)
);

ALTER TABLE life_mission ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own life mission"
  ON life_mission
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Yearly debrief table
CREATE TABLE IF NOT EXISTS yearly_debrief (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wins text,
  challenges text,
  lessons text,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_debrief UNIQUE (user_id)
);

ALTER TABLE yearly_debrief ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own yearly debrief"
  ON yearly_debrief
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Weekly motivation table
CREATE TABLE IF NOT EXISTS weekly_motivation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_of date NOT NULL,
  content text,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE weekly_motivation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own weekly motivation"
  ON weekly_motivation
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS goals_user_id_idx ON goals(user_id);
CREATE INDEX IF NOT EXISTS weekly_priorities_user_week_idx ON weekly_priorities(user_id, week_of);
CREATE INDEX IF NOT EXISTS monthly_goals_user_month_idx ON monthly_goals(user_id, month_of);
CREATE INDEX IF NOT EXISTS ai_coach_goals_user_timeframe_idx ON ai_coach_goals(user_id, timeframe);
CREATE INDEX IF NOT EXISTS weekly_motivation_user_week_idx ON weekly_motivation(user_id, week_of);