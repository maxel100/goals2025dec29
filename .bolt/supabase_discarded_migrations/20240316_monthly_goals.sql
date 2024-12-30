-- Create monthly goals table
create table if not exists public.monthly_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  month_of timestamp with time zone not null,
  goals jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for faster queries
create index if not exists monthly_goals_user_month_idx 
  on monthly_goals(user_id, month_of);

-- Enable RLS
alter table public.monthly_goals enable row level security;

-- Create policies
create policy "Users can view their own monthly goals"
  on public.monthly_goals for select
  using (auth.uid() = user_id);

create policy "Users can insert their own monthly goals"
  on public.monthly_goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own monthly goals"
  on public.monthly_goals for update
  using (auth.uid() = user_id);