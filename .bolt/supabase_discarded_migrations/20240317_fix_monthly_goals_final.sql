-- Drop existing table if it exists
drop table if exists public.monthly_goals;

-- Create new monthly_goals table with proper structure
create table public.monthly_goals (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    month_of date not null,
    goals jsonb not null default '[]'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add unique constraint for user_id and month combination
alter table public.monthly_goals
    add constraint monthly_goals_user_month_unique 
    unique (user_id, month_of);

-- Create index for better performance
create index monthly_goals_user_month_idx 
    on public.monthly_goals(user_id, month_of);

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