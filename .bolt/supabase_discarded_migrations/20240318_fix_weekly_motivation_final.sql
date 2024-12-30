-- Drop existing table
drop table if exists public.weekly_motivation;

-- Create weekly motivation table with proper structure
create table public.weekly_motivation (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    week_of timestamp with time zone not null,
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint weekly_motivation_user_week_unique unique (user_id, week_of)
);

-- Create index for faster queries
create index if not exists weekly_motivation_user_week_idx 
    on weekly_motivation(user_id, week_of);

-- Enable RLS
alter table public.weekly_motivation enable row level security;

-- Create policies
create policy "Users can view their own motivation"
    on public.weekly_motivation for select
    using (auth.uid() = user_id);

create policy "Users can insert their own motivation"
    on public.weekly_motivation for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own motivation"
    on public.weekly_motivation for update
    using (auth.uid() = user_id);