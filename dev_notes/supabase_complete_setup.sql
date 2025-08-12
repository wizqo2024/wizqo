-- Complete Supabase Setup for Wizqo Platform
-- This script creates all necessary tables for user profiles, hobby plans, and progress tracking

-- 1. Create user_profiles table for extended user information
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create hobby_plans table to store generated learning plans
CREATE TABLE IF NOT EXISTS public.hobby_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  hobby_name TEXT NOT NULL,
  title TEXT NOT NULL,
  overview TEXT,
  difficulty TEXT DEFAULT 'beginner',
  total_days INTEGER DEFAULT 7,
  plan_data JSONB NOT NULL, -- Stores the complete plan structure
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create user_progress table to track learning progress
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.hobby_plans(id) ON DELETE CASCADE,
  current_day INTEGER DEFAULT 1,
  completed_days INTEGER[] DEFAULT '{}',
  progress_percentage FLOAT DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, plan_id)
);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hobby_plans_user_id ON public.hobby_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_hobby_plans_created_at ON public.hobby_plans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_plan_id ON public.user_progress(plan_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_last_accessed ON public.user_progress(last_accessed DESC);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hobby_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 7. Create RLS policies for hobby_plans
CREATE POLICY "Users can view own plans" ON public.hobby_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own plans" ON public.hobby_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plans" ON public.hobby_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own plans" ON public.hobby_plans
  FOR DELETE USING (auth.uid() = user_id);

-- 8. Create RLS policies for user_progress
CREATE POLICY "Users can view own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress" ON public.user_progress
  FOR DELETE USING (auth.uid() = user_id);

-- 9. Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. Create triggers for automatic timestamp updates
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON public.user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hobby_plans_updated_at 
  BEFORE UPDATE ON public.hobby_plans 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at 
  BEFORE UPDATE ON public.user_progress 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, first_name, last_name, profile_image_url)
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

-- 12. Create trigger for automatic user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Complete setup verification
SELECT 'Supabase setup complete! All tables, policies, and triggers created successfully.' as status;