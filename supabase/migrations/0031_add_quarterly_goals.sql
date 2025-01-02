-- Create quarterly goals table
CREATE TABLE IF NOT EXISTS public.quarterly_goals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    quarter_start DATE NOT NULL,  -- Start date of the quarter
    goals JSONB DEFAULT '[]'::jsonb,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, quarter_start)
);

-- Enable RLS
ALTER TABLE public.quarterly_goals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own quarterly goals"
    ON public.quarterly_goals FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quarterly goals"
    ON public.quarterly_goals FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quarterly goals"
    ON public.quarterly_goals FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quarterly goals"
    ON public.quarterly_goals FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS quarterly_goals_user_id_idx ON public.quarterly_goals(user_id);
CREATE INDEX IF NOT EXISTS quarterly_goals_quarter_start_idx ON public.quarterly_goals(quarter_start);

-- Function to ensure quarterly goals records exist for a user
CREATE OR REPLACE FUNCTION ensure_quarterly_goals(user_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_quarter DATE;
    next_quarter DATE;
BEGIN
    -- Calculate current quarter start
    current_quarter := date_trunc('quarter', current_date)::date;
    -- Calculate next quarter start
    next_quarter := (date_trunc('quarter', current_date) + interval '3 months')::date;
    
    -- Insert current quarter if doesn't exist
    INSERT INTO public.quarterly_goals (user_id, quarter_start, goals)
    VALUES (user_uuid, current_quarter, '[]'::jsonb)
    ON CONFLICT (user_id, quarter_start) DO NOTHING;
    
    -- Insert next quarter if doesn't exist
    INSERT INTO public.quarterly_goals (user_id, quarter_start, goals)
    VALUES (user_uuid, next_quarter, '[]'::jsonb)
    ON CONFLICT (user_id, quarter_start) DO NOTHING;
END;
$$;

-- Trigger function to automatically create quarterly goals for new users
CREATE OR REPLACE FUNCTION create_initial_quarterly_goals()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    PERFORM ensure_quarterly_goals(NEW.id);
    RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created_quarterly_goals ON auth.users;
CREATE TRIGGER on_auth_user_created_quarterly_goals
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_initial_quarterly_goals();

-- Run ensure_quarterly_goals for all existing users
DO $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN SELECT id FROM auth.users
    LOOP
        PERFORM ensure_quarterly_goals(user_record.id);
    END LOOP;
END;
$$; 