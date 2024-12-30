-- Drop the existing table if it exists
DROP TABLE IF EXISTS public.wizard_completion;

-- Create the wizard_completion table with the correct schema
CREATE TABLE public.wizard_completion (
    user_id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    completed boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wizard_completion ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own wizard completion"
    ON public.wizard_completion FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own wizard completion"
    ON public.wizard_completion FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wizard completion"
    ON public.wizard_completion FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions
GRANT ALL ON public.wizard_completion TO authenticated; 