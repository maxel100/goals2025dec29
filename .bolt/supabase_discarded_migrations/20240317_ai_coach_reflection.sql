-- Create yearly debrief table
create table if not exists public.yearly_debrief (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    wins text,
    challenges text,
    lessons text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create life mission table
create table if not exists public.life_mission (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    vision text,
    importance text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add unique constraints
alter table public.yearly_debrief
    add constraint yearly_debrief_user_unique unique (user_id);

alter table public.life_mission
    add constraint life_mission_user_unique unique (user_id);

-- Enable RLS
alter table public.yearly_debrief enable row level security;
alter table public.life_mission enable row level security;

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