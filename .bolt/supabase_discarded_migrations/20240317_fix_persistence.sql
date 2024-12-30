-- Drop existing tables to start fresh
drop table if exists public.monthly_goals;
drop table if exists public.yearly_debrief;
drop table if exists public.life_mission;

-- Create monthly_goals table with proper structure
create table public.monthly_goals (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    month_of date not null,
    goals jsonb not null default '[]'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint monthly_goals_user_month_unique unique (user_id, month_of)
);

-- Create yearly_debrief table
create table public.yearly_debrief (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    wins text,
    challenges text,
    lessons text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint yearly_debrief_user_unique unique (user_id)
);

-- Create life_mission table
create table public.life_mission (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    vision text,
    importance text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint life_mission_user_unique unique (user_id)
);

-- Enable RLS on all tables
alter table public.monthly_goals enable row level security;
alter table public.yearly_debrief enable row level security;
alter table public.life_mission enable row level security;

-- Create RLS policies for monthly_goals
create policy "Users can view their own monthly goals"
    on public.monthly_goals for select
    using (auth.uid() = user_id);

create policy "Users can insert their own monthly goals"
    on public.monthly_goals for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own monthly goals"
    on public.monthly_goals for update
    using (auth.uid() = user_id);

-- Create RLS policies for yearly_debrief
create policy "Users can view their own yearly debrief"
    on public.yearly_debrief for select
    using (auth.uid() = user_id);

create policy "Users can insert their own yearly debrief"
    on public.yearly_debrief for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own yearly debrief"
    on public.yearly_debrief for update
    using (auth.uid() = user_id);

-- Create RLS policies for life_mission
create policy "Users can view their own life mission"
    on public.life_mission for select
    using (auth.uid() = user_id);

create policy "Users can insert their own life mission"
    on public.life_mission for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own life mission"
    on public.life_mission for update
    using (auth.uid() = user_id);