-- Create weekly motivation table
create table if not exists public.weekly_motivation (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for faster queries
create index if not exists weekly_motivation_user_date_idx 
  on weekly_motivation(user_id, created_at);

-- Enable RLS
alter table public.weekly_motivation enable row level security;

-- Create policies
create policy "Users can view their own motivation"
  on public.weekly_motivation for select
  using (auth.uid() = user_id);

create policy "Users can insert their own motivation"
  on public.weekly_motivation for insert
  with check (auth.uid() = user_id);