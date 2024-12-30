-- Create missing tables if they don't exist
CREATE TABLE IF NOT EXISTS public.sharing_requests (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    from_user_id uuid REFERENCES auth.users ON DELETE CASCADE,
    to_user_id uuid REFERENCES auth.users ON DELETE CASCADE,
    status text DEFAULT 'pending',
    read boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.weekly_motivation (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users ON DELETE CASCADE,
    content text,
    week_of date,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.daily_priorities (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users ON DELETE CASCADE,
    content text,
    date date,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.weekly_priorities (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users ON DELETE CASCADE,
    content text,
    week_of date,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.monthly_goals (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users ON DELETE CASCADE,
    content text,
    month date,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.goals (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users ON DELETE CASCADE,
    title text,
    description text,
    status text DEFAULT 'active',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.wizard_completion (
    user_id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    completed boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.sharing_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_motivation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wizard_completion ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for each table
CREATE POLICY "Users can view their own sharing requests"
    ON public.sharing_requests FOR SELECT
    TO authenticated
    USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can delete their own sharing requests"
    ON public.sharing_requests FOR DELETE
    TO authenticated
    USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can view their own weekly motivation"
    ON public.weekly_motivation FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weekly motivation"
    ON public.weekly_motivation FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own daily priorities"
    ON public.daily_priorities FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily priorities"
    ON public.daily_priorities FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own weekly priorities"
    ON public.weekly_priorities FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weekly priorities"
    ON public.weekly_priorities FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own monthly goals"
    ON public.monthly_goals FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own monthly goals"
    ON public.monthly_goals FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own goals"
    ON public.goals FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
    ON public.goals FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own wizard completion"
    ON public.wizard_completion FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wizard completion"
    ON public.wizard_completion FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated; 