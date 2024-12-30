/*
  # Fix Database Constraints and Error Handling

  1. Changes
    - Add unique constraint for weekly_motivation on (user_id, week_of)
    - Add unique constraint for weekly_priorities on (user_id, week_of)
    - Add unique constraint for monthly_goals on (user_id, month_of)

  2. Purpose
    - Prevent duplicate entries for the same week/month
    - Enable proper UPSERT operations
    - Fix 406/400 errors in the application
*/

-- Add unique constraints
ALTER TABLE weekly_motivation 
ADD CONSTRAINT weekly_motivation_user_week_unique 
UNIQUE (user_id, week_of);

ALTER TABLE weekly_priorities 
ADD CONSTRAINT weekly_priorities_user_week_unique 
UNIQUE (user_id, week_of);

ALTER TABLE monthly_goals 
ADD CONSTRAINT monthly_goals_user_month_unique 
UNIQUE (user_id, month_of);