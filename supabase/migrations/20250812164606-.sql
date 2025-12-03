-- Add phone and bio to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS bio text;

-- Create monthly_budgets table if not exists
CREATE TABLE IF NOT EXISTS public.monthly_budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  month text NOT NULL,
  income numeric NOT NULL DEFAULT 0,
  savings_goal numeric NOT NULL DEFAULT 0,
  fixed_expenses jsonb NOT NULL DEFAULT '[]'::jsonb,
  variable_expenses jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.monthly_budgets ENABLE ROW LEVEL SECURITY;

-- Policies for monthly_budgets
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'monthly_budgets' AND policyname = 'Users can view their own monthly budgets'
  ) THEN
    CREATE POLICY "Users can view their own monthly budgets"
    ON public.monthly_budgets
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'monthly_budgets' AND policyname = 'Users can insert their own monthly budgets'
  ) THEN
    CREATE POLICY "Users can insert their own monthly budgets"
    ON public.monthly_budgets
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'monthly_budgets' AND policyname = 'Users can update their own monthly budgets'
  ) THEN
    CREATE POLICY "Users can update their own monthly budgets"
    ON public.monthly_budgets
    FOR UPDATE
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'monthly_budgets' AND policyname = 'Users can delete their own monthly budgets'
  ) THEN
    CREATE POLICY "Users can delete their own monthly budgets"
    ON public.monthly_budgets
    FOR DELETE
    USING (auth.uid() = user_id);
  END IF;
END $$;

-- Unique constraint to avoid duplicates per month per user
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'monthly_budgets_user_month_key'
  ) THEN
    ALTER TABLE public.monthly_budgets
    ADD CONSTRAINT monthly_budgets_user_month_key UNIQUE (user_id, month);
  END IF;
END $$;

-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_monthly_budgets_updated_at'
  ) THEN
    CREATE TRIGGER trg_monthly_budgets_updated_at
    BEFORE UPDATE ON public.monthly_budgets
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;