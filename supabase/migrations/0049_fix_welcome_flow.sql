-- Drop existing trigger first to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Modify the handle_new_user function to include welcome flow initialization
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    current_year integer;
    current_quarter date;
    next_quarter date;
    welcome_goal_id uuid;
BEGIN
    -- Get current year
    current_year := EXTRACT(YEAR FROM CURRENT_DATE);
    
    -- Calculate quarters for goals
    current_quarter := date_trunc('quarter', current_date)::date;
    next_quarter := (date_trunc('quarter', current_date) + interval '3 months')::date;

    -- Basic user setup records
    INSERT INTO public.user_preferences (user_id, email)
    VALUES (NEW.id, true)
    ON CONFLICT (user_id) DO NOTHING;

    -- Initialize wizard_completion as false to trigger welcome flow
    INSERT INTO public.wizard_completion (user_id, completed, completed_at)
    VALUES (NEW.id, false, NULL)
    ON CONFLICT (user_id) DO NOTHING;

    -- Initialize empty life mission
    INSERT INTO public.life_mission (user_id, vision, importance)
    VALUES (NEW.id, '', '')
    ON CONFLICT (user_id) DO NOTHING;

    INSERT INTO public.yearly_debrief (user_id, wins, challenges, lessons)
    VALUES (NEW.id, '', '', '')
    ON CONFLICT (user_id) DO NOTHING;

    -- User rules setup with default empty arrays
    INSERT INTO public.user_rules (user_id, type, rules)
    VALUES 
        (NEW.id, 'internal_talk', '[]'::jsonb),
        (NEW.id, 'success_rules', '[]'::jsonb),
        (NEW.id, 'business_rules', '[]'::jsonb)
    ON CONFLICT (user_id, type) DO NOTHING;

    -- Year name setup
    INSERT INTO public.year_name (user_id, name, year)
    VALUES (NEW.id, 'My Goals Board', current_year)
    ON CONFLICT (user_id, year) DO NOTHING;

    -- Create welcome goal
    welcome_goal_id := gen_random_uuid();
    INSERT INTO public.goals (
        id,
        user_id,
        title,
        category,
        type,
        completed,
        progress,
        target,
        items,
        tracking_type,
        hidden
    )
    VALUES (
        welcome_goal_id,
        NEW.id,
        'Welcome to Your Goals Journey!',
        'mind',
        'checklist',
        false,
        0,
        3,
        jsonb_build_array(
            jsonb_build_object(
                'id', gen_random_uuid(),
                'text', 'Complete the welcome wizard',
                'completed', false
            ),
            jsonb_build_object(
                'id', gen_random_uuid(),
                'text', 'Set your first goal',
                'completed', false
            ),
            jsonb_build_object(
                'id', gen_random_uuid(),
                'text', 'Explore your dashboard',
                'completed', false
            )
        ),
        'checklist',
        false
    )
    ON CONFLICT DO NOTHING;

    -- Quarterly goals setup (both current and next quarter)
    INSERT INTO public.quarterly_goals (id, user_id, quarter_start, goals)
    VALUES 
        (gen_random_uuid(), NEW.id, current_quarter, '[]'::jsonb),
        (gen_random_uuid(), NEW.id, next_quarter, '[]'::jsonb)
    ON CONFLICT (user_id, quarter_start) DO NOTHING;

    -- Monthly goals setup with welcome reference
    INSERT INTO public.monthly_goals (id, user_id, month_of, goals)
    VALUES (
        gen_random_uuid(),
        NEW.id,
        date_trunc('month', CURRENT_DATE),
        jsonb_build_array(
            jsonb_build_object(
                'id', gen_random_uuid(),
                'text', 'Complete onboarding',
                'completed', false,
                'linkedGoalId', welcome_goal_id
            )
        )
    )
    ON CONFLICT DO NOTHING;

    -- Weekly priorities setup
    INSERT INTO public.weekly_priorities (id, user_id, week_of, priorities)
    VALUES (
        gen_random_uuid(),
        NEW.id,
        date_trunc('week', CURRENT_DATE),
        jsonb_build_array(
            jsonb_build_object(
                'id', gen_random_uuid(),
                'text', 'Get started with the welcome wizard',
                'completed', false,
                'linkedGoalId', welcome_goal_id
            )
        )
    )
    ON CONFLICT DO NOTHING;

    -- Daily priorities setup
    INSERT INTO public.daily_priorities (id, user_id, date_of, priorities)
    VALUES (
        gen_random_uuid(),
        NEW.id,
        CURRENT_DATE,
        jsonb_build_array(
            jsonb_build_object(
                'id', gen_random_uuid(),
                'text', 'Welcome! Click here to start the wizard',
                'completed', false,
                'linkedGoalId', welcome_goal_id
            )
        )
    )
    ON CONFLICT DO NOTHING;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$; 

-- Create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Create a function to mark wizard as completed
CREATE OR REPLACE FUNCTION mark_wizard_completed(user_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update wizard completion status
    UPDATE public.wizard_completion 
    SET 
        completed = true,
        completed_at = NOW()
    WHERE user_id = user_uuid;

    -- Update the welcome goal items to completed
    UPDATE public.goals 
    SET 
        completed = true,
        progress = target
    WHERE 
        user_id = user_uuid 
        AND title = 'Welcome to Your Goals Journey!';

    -- Update related items in priorities
    UPDATE public.monthly_goals 
    SET goals = jsonb_set(
        goals,
        '{0,completed}',
        'true'::jsonb
    )
    WHERE 
        user_id = user_uuid 
        AND goals @> '[{"text": "Complete onboarding"}]';

    UPDATE public.weekly_priorities 
    SET priorities = jsonb_set(
        priorities,
        '{0,completed}',
        'true'::jsonb
    )
    WHERE 
        user_id = user_uuid 
        AND priorities @> '[{"text": "Get started with the welcome wizard"}]';

    UPDATE public.daily_priorities 
    SET priorities = jsonb_set(
        priorities,
        '{0,completed}',
        'true'::jsonb
    )
    WHERE 
        user_id = user_uuid 
        AND priorities @> '[{"text": "Welcome! Click here to start the wizard"}]';
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION mark_wizard_completed TO authenticated; 