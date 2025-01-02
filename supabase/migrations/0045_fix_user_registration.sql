-- Create all necessary tables if they don't exist
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    email boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.wizard_completion (
    user_id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    completed boolean DEFAULT false,
    completed_at timestamptz,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.life_mission (
    user_id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    vision text DEFAULT '',
    importance text DEFAULT '',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.yearly_debrief (
    user_id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    wins text DEFAULT '',
    challenges text DEFAULT '',
    lessons text DEFAULT '',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_rules (
    user_id uuid REFERENCES auth.users ON DELETE CASCADE,
    type text NOT NULL,
    rules jsonb DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    PRIMARY KEY (user_id, type)
);

CREATE TABLE IF NOT EXISTS public.year_name (
    user_id uuid REFERENCES auth.users ON DELETE CASCADE,
    year integer NOT NULL,
    name text DEFAULT 'My Goals Board',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    PRIMARY KEY (user_id, year)
);

CREATE TABLE IF NOT EXISTS public.goals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users ON DELETE CASCADE,
    title text NOT NULL,
    category text NOT NULL,
    type text NOT NULL,
    completed boolean DEFAULT false,
    progress integer,
    target integer,
    unit text,
    items jsonb,
    monthly_progress jsonb,
    hidden boolean DEFAULT false,
    tracking_type text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quarterly_goals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users ON DELETE CASCADE,
    quarter_start date NOT NULL,
    goals jsonb DEFAULT '[]'::jsonb,
    is_visible boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.monthly_goals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users ON DELETE CASCADE,
    month_of date NOT NULL,
    goals jsonb DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.weekly_priorities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users ON DELETE CASCADE,
    week_of date NOT NULL,
    priorities jsonb DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.daily_priorities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users ON DELETE CASCADE,
    date_of date NOT NULL,
    priorities jsonb DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wizard_completion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.life_mission ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yearly_debrief ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.year_name ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quarterly_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_priorities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for all tables
DO $$ 
DECLARE
    table_name text;
BEGIN
    FOR table_name IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND 
        tablename IN ('user_preferences', 'wizard_completion', 'life_mission', 'yearly_debrief', 
                     'user_rules', 'year_name', 'goals', 'quarterly_goals', 'monthly_goals', 
                     'weekly_priorities', 'daily_priorities')
    LOOP
        EXECUTE format('
            DROP POLICY IF EXISTS "Users can manage their own data" ON public.%I;
            CREATE POLICY "Users can manage their own data" ON public.%I
                FOR ALL
                TO authenticated
                USING (auth.uid() = user_id)
                WITH CHECK (auth.uid() = user_id);
        ', table_name, table_name);
    END LOOP;
END $$; 