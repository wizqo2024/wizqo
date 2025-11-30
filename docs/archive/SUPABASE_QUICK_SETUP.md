# Supabase Database Setup - Quick Fix

## Problem
The Wizqo app is connected to Supabase but the required database tables don't exist, causing "relation does not exist" errors.

## Solution
Run this SQL in your Supabase dashboard's SQL Editor:

```sql
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
  completed_days JSONB NOT NULL DEFAULT '[]'::jsonb,
  current_day INTEGER NOT NULL DEFAULT 1,
  unlocked_days JSONB NOT NULL DEFAULT '[1]'::jsonb,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hobby_plans_user_id ON public.hobby_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_hobby_plans_created_at ON public.hobby_plans(created_at);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_plan_id ON public.user_progress(plan_id);

-- Enable Row Level Security (optional, for production)
ALTER TABLE public.hobby_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (optional, for production)
CREATE POLICY "Users can manage own plans" ON public.hobby_plans
  FOR ALL USING (user_id = auth.uid()::text);

CREATE POLICY "Users can manage own progress" ON public.user_progress
  FOR ALL USING (user_id = auth.uid()::text);
```

## Steps to Execute

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Paste the SQL above
4. Click "Run" to execute
5. Verify tables were created in the Table Editor

## Verification

After running the SQL, these tables should appear in your Supabase project:
- `hobby_plans`
- `user_progress`

The app should then work correctly with progress saving for authenticated users.