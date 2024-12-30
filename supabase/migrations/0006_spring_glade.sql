/*
  # Enable cron extension and schedule weekly email

  1. Changes
    - Enable the pg_cron extension
    - Create cron job for weekly email sending
    - Add security settings for cron job
*/

-- Enable the pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Grant usage on pg_cron to postgres
GRANT USAGE ON SCHEMA cron TO postgres;

-- Create the cron job for weekly emails
SELECT cron.schedule(
  'weekly-email-job',                    -- Job name
  '0 7 * * 0',                          -- Schedule (Every Sunday at 7 AM)
  $$
  SELECT
    CASE 
      WHEN response.status >= 200 AND response.status < 300 THEN
        TRUE
      ELSE
        FALSE
    END as success
  FROM 
    http((
      'POST',
      'https://' || current_setting('app.supabase_project_ref') || '.functions.supabase.co/weekly-email',
      ARRAY[http_header('Authorization', current_setting('app.edge_function_key'))],
      'application/json',
      '{}'
    )::http_request) as response;
  $$
);