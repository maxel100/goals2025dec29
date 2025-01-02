-- Reset auth schema permissions
GRANT USAGE ON SCHEMA auth TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA auth TO anon, authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA auth TO anon, authenticated;

-- Reset public schema permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated;

-- Ensure handle_new_user has proper permissions
ALTER FUNCTION handle_new_user()
    SECURITY DEFINER
    SET search_path = public, auth;

-- Create or replace the auth trigger function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, auth
LANGUAGE plpgsql
AS $$
DECLARE
    current_year integer;
BEGIN
    BEGIN
        current_year := EXTRACT(YEAR FROM CURRENT_DATE);

        -- Create user_preferences record
        INSERT INTO public.user_preferences (user_id, email)
        VALUES (NEW.id, true)
        ON CONFLICT (user_id) DO NOTHING;

        -- Create wizard_completion record
        INSERT INTO public.wizard_completion (user_id, completed)
        VALUES (NEW.id, false)
        ON CONFLICT (user_id) DO NOTHING;

        -- Create life_mission record
        INSERT INTO public.life_mission (user_id, vision, importance)
        VALUES (NEW.id, '', '')
        ON CONFLICT (user_id) DO NOTHING;

        -- Create yearly_debrief record
        INSERT INTO public.yearly_debrief (user_id, wins, challenges, lessons)
        VALUES (NEW.id, '', '', '')
        ON CONFLICT (user_id) DO NOTHING;

        -- Create user_rules records
        INSERT INTO public.user_rules (user_id, type, rules)
        VALUES 
            (NEW.id, 'internal_talk', '[]'::jsonb),
            (NEW.id, 'success_rules', '[]'::jsonb),
            (NEW.id, 'business_rules', '[]'::jsonb)
        ON CONFLICT (user_id, type) DO NOTHING;

        -- Create year_name record
        INSERT INTO public.year_name (user_id, name, year)
        VALUES (NEW.id, 'My Goals Board', current_year)
        ON CONFLICT (user_id, year) DO NOTHING;

        -- Create initial goals record
        INSERT INTO public.goals (id, user_id, title, category, type)
        VALUES (gen_random_uuid(), NEW.id, 'Welcome to Your Goals', 'mind', 'simple')
        ON CONFLICT DO NOTHING;

        -- Create initial quarterly_goals record
        INSERT INTO public.quarterly_goals (id, user_id, quarter_start, goals)
        VALUES (gen_random_uuid(), NEW.id, date_trunc('quarter', CURRENT_DATE), '[]'::jsonb)
        ON CONFLICT DO NOTHING;

        -- Create initial monthly_goals record
        INSERT INTO public.monthly_goals (id, user_id, month_of, goals)
        VALUES (gen_random_uuid(), NEW.id, date_trunc('month', CURRENT_DATE), '[]'::jsonb)
        ON CONFLICT DO NOTHING;

        -- Create initial weekly_priorities record
        INSERT INTO public.weekly_priorities (id, user_id, week_of, priorities)
        VALUES (gen_random_uuid(), NEW.id, date_trunc('week', CURRENT_DATE), '[]'::jsonb)
        ON CONFLICT DO NOTHING;

        -- Create initial daily_priorities record
        INSERT INTO public.daily_priorities (id, user_id, date_of, priorities)
        VALUES (gen_random_uuid(), NEW.id, CURRENT_DATE, '[]'::jsonb)
        ON CONFLICT DO NOTHING;

    EXCEPTION WHEN OTHERS THEN
        -- Log the specific error
        RAISE LOG 'Error in handle_new_user for user %: % %', NEW.id, SQLERRM, SQLSTATE;
    END;

    RETURN NEW;
END;
$$;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Ensure RLS is enabled but with proper policies
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
        
        -- Drop existing policies
        EXECUTE format('DROP POLICY IF EXISTS "Enable read for users" ON public.%I;', t);
        EXECUTE format('DROP POLICY IF EXISTS "Enable insert for users" ON public.%I;', t);
        EXECUTE format('DROP POLICY IF EXISTS "Enable update for users" ON public.%I;', t);
        EXECUTE format('DROP POLICY IF EXISTS "Enable delete for users" ON public.%I;', t);
        
        -- Create new policies
        EXECUTE format('
            CREATE POLICY "Enable read for users" ON public.%I
                FOR SELECT
                TO authenticated
                USING (auth.uid() = user_id);
        ', t);
        
        EXECUTE format('
            CREATE POLICY "Enable insert for users" ON public.%I
                FOR INSERT
                TO authenticated
                WITH CHECK (auth.uid() = user_id);
        ', t);
        
        EXECUTE format('
            CREATE POLICY "Enable update for users" ON public.%I
                FOR UPDATE
                TO authenticated
                USING (auth.uid() = user_id)
                WITH CHECK (auth.uid() = user_id);
        ', t);
        
        EXECUTE format('
            CREATE POLICY "Enable delete for users" ON public.%I
                FOR DELETE
                TO authenticated
                USING (auth.uid() = user_id);
        ', t);
    END LOOP;
END
$$; 