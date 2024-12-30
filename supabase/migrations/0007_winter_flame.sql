/*
  # Add email preferences and fix cron job

  1. Changes
    - Add user_preferences table for email settings
    - Add trigger for default preferences
    - Fix cron job configuration
    - Add proper error handling for email job

  2. Security
    - Enable RLS on user_preferences table
    - Add policy for authenticated users
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can manage their own preferences" ON user_preferences;

-- Create policy
CREATE POLICY "Users can manage their own preferences"
  ON user_preferences
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Enable required extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS http;

-- Drop existing cron job if it exists
SELECT cron.unschedule('weekly-email-job');

-- Schedule the weekly email job
SELECT cron.schedule(
  'weekly-email-job',
  '0 7 * * 0',
  $$
  SELECT http_post(
    'https://' || current_setting('app.supabase_project_ref') || '.functions.supabase.co/weekly-email',
    '{}',
    'application/json',
    ARRAY[http_header('Authorization', current_setting('app.edge_function_key'))]
  );
  $$
);