-- Create hobby_plans table
CREATE TABLE IF NOT EXISTS public.hobby_plans (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  hobby TEXT NOT NULL,
  title TEXT NOT NULL,
  overview TEXT NOT NULL,
  plan_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS public.user_progress (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  plan_id INTEGER REFERENCES public.hobby_plans(id) ON DELETE CASCADE,
  completed_days JSONB NOT NULL DEFAULT '[]',
  current_day INTEGER NOT NULL DEFAULT 1,
  unlocked_days JSONB NOT NULL DEFAULT '[1]',
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hobby_plans_user_id ON public.hobby_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_hobby_plans_created_at ON public.hobby_plans(created_at);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_plan_id ON public.user_progress(plan_id);