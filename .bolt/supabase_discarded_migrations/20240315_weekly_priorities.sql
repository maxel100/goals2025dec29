create table if not exists public.weekly_priorities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  week_of timestamp with time zone not null,
  priorities jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for faster queries
create index if not exists weekly_priorities_user_week_idx 
  on public.weekly_priorities(user_id, week_of);

-- Enable RLS
alter table public.weekly_priorities enable row level security;

-- Create policies
create policy "Users can view their own priorities"
  on public.weekly_priorities for select
  using (auth.uid() = user_id);

create policy "Users can insert their own priorities"
  on public.weekly_priorities for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own priorities"
  on public.weekly_priorities for update
  using (auth.uid() = user_id);