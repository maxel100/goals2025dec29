-- Add unique constraint to prevent duplicate months
alter table public.monthly_goals
add constraint monthly_goals_user_month_unique 
unique (user_id, month_of);

-- Add index to improve query performance
create index if not exists monthly_goals_month_of_idx 
on public.monthly_goals(month_of);