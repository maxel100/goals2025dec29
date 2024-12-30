-- Create AI Coach Goals table
create table if not exists public.ai_coach_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  timeframe text not null check (timeframe in ('five_year', 'one_year', 'quarterly', 'monthly')),
  goals jsonb not null default '[]'::jsonb,
  importance text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for faster queries
create index if not exists ai_coach_goals_user_timeframe_idx 
  on public.ai_coach_goals(user_id, timeframe);

-- Enable RLS
alter table public.ai_coach_goals enable row level security;

-- Create policies
create policy "Users can view their own AI coach goals"
  on public.ai_coach_goals for select
  using (auth.uid() = user_id);

create policy "Users can insert their own AI coach goals"
  on public.ai_coach_goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own AI coach goals"
  on public.ai_coach_goals for update
  using (auth.uid() = user_id);