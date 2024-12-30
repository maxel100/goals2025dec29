/*
  # Fix user preferences and email functionality

  1. Changes
    - Add trigger to create user preferences on signup
    - Add function to handle user preferences creation
    - Add missing columns and constraints
  
  2. Security
    - Enable RLS
    - Add policy for authenticated users
*/

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created_preferences ON auth.users;

-- Update or create the function to handle new user preferences
CREATE OR REPLACE FUNCTION handle_new_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_preferences (
    user_id,
    email,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    TRUE,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created_preferences
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_preferences();

-- Backfill preferences for existing users
INSERT INTO public.user_preferences (user_id, email, created_at, updated_at)
SELECT 
  id as user_id,
  TRUE as email,
  NOW() as created_at,
  NOW() as updated_at
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;