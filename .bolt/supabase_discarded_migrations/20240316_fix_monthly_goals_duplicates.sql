-- First, create a temporary table with the latest goals for each user and month
create temporary table latest_monthly_goals as
select distinct on (user_id, month_of)
  id,
  user_id,
  month_of,
  goals,
  created_at,
  updated_at
from public.monthly_goals
order by user_id, month_of, updated_at desc;

-- Delete all rows from monthly_goals
delete from public.monthly_goals;

-- Insert back only the latest versions
insert into public.monthly_goals
select * from latest_monthly_goals;

-- Now we can safely add the unique constraint
alter table public.monthly_goals
add constraint monthly_goals_user_month_unique 
unique (user_id, month_of);

-- Add index to improve query performance
create index if not exists monthly_goals_month_of_idx 
on public.monthly_goals(month_of);

-- Drop the temporary table
drop table latest_monthly_goals;