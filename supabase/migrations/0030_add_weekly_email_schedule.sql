-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a function to invoke the Edge Function
CREATE OR REPLACE FUNCTION invoke_weekly_focus_email()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Call the Edge Function using pg_net extension
  PERFORM
    net.http_post(
      url := 'https://htieckijvxzjohfmmdim.supabase.co/functions/v1/weekly-focus-email',
      headers := jsonb_build_object(
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0aWVja2lqdnh6am9oZm1tZGltIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNzE4NTY0MCwiZXhwIjoyMDIyNzYxNjQwfQ.KwNIIoqfxZGFv_S8SoQj9uHiVkGz_-UHZHXMLs5hxFk',
        'Content-Type', 'application/json'
      ),
      body := '{}'
    );
END;
$$;

-- Create a cron schedule to run every Sunday at midnight UTC
SELECT cron.schedule(
  'weekly-focus-email', -- schedule name
  '0 0 * * 0', -- every Sunday at midnight
  'SELECT invoke_weekly_focus_email();'
);

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION invoke_weekly_focus_email() TO service_role; 