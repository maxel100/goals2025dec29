-- Drop existing constraints if they exist
alter table if exists public.monthly_goals
drop constraint if exists monthly_goals_user_month_unique;

-- Recreate the monthly_goals table with proper structure
create table if not exists public.monthly_goals_new (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  month_of date not null, -- Changed to date type for better handling
  goals jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint monthly_goals_user_month_unique unique (user_id, month_of)
);

-- Copy data from old table if it exists
insert into public.monthly_goals_new (id, user_id, month_of, goals, created_at, updated_at)
select 
  id,
  user_id,
  date_trunc('month', month_of::timestamp)::date,
  goals,
  created_at,
  updated_at
from public.monthly_goals
on conflict (user_id, month_of) 
do update set
  goals = excluded.goals,
  updated_at = excluded.updated_at;

-- Drop old table and rename new one
drop table if exists public.monthly_goals;
alter table public.monthly_goals_new rename to monthly_goals;

-- Create index for better performance
create index if not exists monthly_goals_user_month_idx 
on public.monthly_goals(user_id, month_of);

-- Enable RLS
alter table public.monthly_goals enable row level security;

-- Recreate policies
drop policy if exists "Users can view their own monthly goals" on public.monthly_goals;
drop policy if exists "Users can insert their own monthly goals" on public.monthly_goals;
drop policy if exists "Users can update their own monthly goals" on public.monthly_goals;

create policy "Users can view their own monthly goals"
  on public.monthly_goals for select
  using (auth.uid() = user_id);

create policy "Users can insert their own monthly goals"
  on public.monthly_goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own monthly goals"
  on public.monthly_goals for update
  using (auth.uid() = user_id);