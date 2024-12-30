-- First, backup existing data
create table if not exists public.monthly_goals_backup as 
select * from public.monthly_goals;

-- Drop existing table
drop table if exists public.monthly_goals;

-- Create new table with correct schema
create table public.monthly_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  month_of date not null,
  goals jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add unique constraint
alter table public.monthly_goals
add constraint monthly_goals_user_month_unique unique (user_id, month_of);

-- Create index
create index monthly_goals_user_month_idx on public.monthly_goals(user_id, month_of);

-- Enable RLS
alter table public.monthly_goals enable row level security;

-- Create RLS policies
create policy "Users can view their own monthly goals"
  on public.monthly_goals for select
  using (auth.uid() = user_id);

create policy "Users can insert their own monthly goals"
  on public.monthly_goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own monthly goals"
  on public.monthly_goals for update
  using (auth.uid() = user_id);

-- Restore data from backup, handling duplicates by keeping the latest version
insert into public.monthly_goals (id, user_id, month_of, goals, created_at, updated_at)
select distinct on (user_id, date_trunc('month', month_of::timestamp)::date)
  id,
  user_id,
  date_trunc('month', month_of::timestamp)::date as month_of,
  goals,
  created_at,
  updated_at
from public.monthly_goals_backup
order by user_id, date_trunc('month', month_of::timestamp)::date, updated_at desc;

-- Drop backup table
drop table public.monthly_goals_backup;