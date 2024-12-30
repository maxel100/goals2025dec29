-- Add period column to ai_coach_goals table
alter table public.ai_coach_goals 
add column period text,
add column year integer default extract(year from current_date);

-- Add constraint for period based on timeframe
alter table public.ai_coach_goals
add constraint valid_period check (
  (timeframe = 'quarterly' and period in ('Q1', 'Q2', 'Q3', 'Q4')) or
  (timeframe = 'monthly' and period in (
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  )) or
  (timeframe in ('five_year', 'one_year') and period is null)
);