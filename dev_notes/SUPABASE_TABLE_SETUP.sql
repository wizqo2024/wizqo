-- SUPABASE TABLE SETUP
-- Run this SQL in your Supabase project's SQL Editor to create all required tables

-- 1. Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. Create hobby_plans table
CREATE TABLE IF NOT EXISTS public.hobby_plans (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  hobby TEXT NOT NULL,
  title TEXT NOT NULL,
  overview TEXT NOT NULL,
  plan_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3. Create user_progress table  
CREATE TABLE IF NOT EXISTS public.user_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  plan_id INTEGER REFERENCES public.hobby_plans(id) ON DELETE CASCADE,
  completed_days JSONB NOT NULL DEFAULT '[]',
  current_day INTEGER NOT NULL DEFAULT 1,
  unlocked_days JSONB NOT NULL DEFAULT '[1]',
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hobby_plans_user_id ON public.hobby_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_hobby_plans_created_at ON public.hobby_plans(created_at);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_plan_id ON public.user_progress(plan_id);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hobby_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for users table
CREATE POLICY "Users can view own profile" ON public.users
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- 7. Create RLS policies for hobby_plans table
CREATE POLICY "Users can view own hobby plans" ON public.hobby_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own hobby plans" ON public.hobby_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own hobby plans" ON public.hobby_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own hobby plans" ON public.hobby_plans
  FOR DELETE USING (auth.uid() = user_id);

-- 8. Create RLS policies for user_progress table
CREATE POLICY "Users can view own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress" ON public.user_progress
  FOR DELETE USING (auth.uid() = user_id);

-- 9. Create function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Create trigger to auto-create user profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verification queries (run these to check if tables were created successfully)
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('users', 'hobby_plans', 'user_progress');
-- SELECT * FROM public.users LIMIT 1;
-- SELECT * FROM public.hobby_plans LIMIT 1;  
-- SELECT * FROM public.user_progress LIMIT 1;