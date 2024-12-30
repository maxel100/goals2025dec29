-- Drop existing table and recreate with proper structure
drop table if exists public.life_mission cascade;

create table public.life_mission (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    vision text,
    importance text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint life_mission_user_unique unique (user_id)
);

-- Create index for better performance
create index if not exists life_mission_user_idx 
    on public.life_mission(user_id);

-- Enable RLS
alter table public.life_mission enable row level security;

-- Create RLS policies
create policy "Users can view their own life mission"
    on public.life_mission for select
    using (auth.uid() = user_id);

create policy "Users can insert their own life mission"
    on public.life_mission for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own life mission"
    on public.life_mission for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);