-- SUPABASE RLS POLICY FIX
-- This script fixes the Row-Level Security policies that are blocking plan saves

-- 1. First, let's check current policies (for reference)
-- SELECT schemaname, tablename, policyname, cmd, qual, with_check 
-- FROM pg_policies WHERE tablename = 'hobby_plans';

-- 2. Drop existing problematic policies
DROP POLICY IF EXISTS "Users can create own plans" ON public.hobby_plans;
DROP POLICY IF EXISTS "Users can view own plans" ON public.hobby_plans;
DROP POLICY IF EXISTS "Users can update own plans" ON public.hobby_plans;
DROP POLICY IF EXISTS "Users can delete own plans" ON public.hobby_plans;

-- 3. Create proper RLS policies for hobby_plans
CREATE POLICY "Enable all operations for authenticated users on hobby_plans" ON public.hobby_plans
  FOR ALL USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() = user_id);

-- 4. Alternative: More specific policies (use these if the above doesn't work)
-- CREATE POLICY "Users can insert own plans" ON public.hobby_plans
--   FOR INSERT WITH CHECK (auth.uid() = user_id);

-- CREATE POLICY "Users can select own plans" ON public.hobby_plans
--   FOR SELECT USING (auth.uid() = user_id);

-- CREATE POLICY "Users can update own plans" ON public.hobby_plans
--   FOR UPDATE USING (auth.uid() = user_id)
--   WITH CHECK (auth.uid() = user_id);

-- CREATE POLICY "Users can delete own plans" ON public.hobby_plans
--   FOR DELETE USING (auth.uid() = user_id);

-- 5. Ensure RLS is enabled
ALTER TABLE public.hobby_plans ENABLE ROW LEVEL SECURITY;

-- 6. Grant necessary permissions
GRANT ALL ON public.hobby_plans TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 7. Test the fix (optional)
-- SELECT auth.uid(); -- Should return the current user's UUID
-- INSERT INTO public.hobby_plans (user_id, hobby_name, title, overview, plan_data) 
-- VALUES (auth.uid(), 'test', 'Test Plan', 'Test', '{"test": true}');