-- Create missing tables
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    email boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
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

-- Enable RLS on all tables
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.life_mission ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yearly_debrief ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.year_name ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own preferences"
    ON public.user_preferences FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
    ON public.user_preferences FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own life mission"
    ON public.life_mission FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own life mission"
    ON public.life_mission FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own yearly debrief"
    ON public.yearly_debrief FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own yearly debrief"
    ON public.yearly_debrief FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own rules"
    ON public.user_rules FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own rules"
    ON public.user_rules FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own year names"
    ON public.year_name FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own year names"
    ON public.year_name FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Add insert policies
CREATE POLICY "Users can insert their own preferences"
    ON public.user_preferences FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own life mission"
    ON public.life_mission FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own yearly debrief"
    ON public.yearly_debrief FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rules"
    ON public.user_rules FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own year names"
    ON public.year_name FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Add delete policies
CREATE POLICY "Users can delete their own preferences"
    ON public.user_preferences FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own life mission"
    ON public.life_mission FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own yearly debrief"
    ON public.yearly_debrief FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rules"
    ON public.user_rules FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own year names"
    ON public.year_name FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id); 