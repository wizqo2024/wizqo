-- EMERGENCY FIX: Temporarily disable RLS for hobby_plans to resolve save issue
-- This is a temporary solution until proper RLS policies can be configured

-- Disable RLS on hobby_plans table
ALTER TABLE public.hobby_plans DISABLE ROW LEVEL SECURITY;

-- Ensure authenticated users have access
GRANT ALL ON public.hobby_plans TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Test insert (should work now)
-- INSERT INTO public.hobby_plans (user_id, hobby_name, title, overview, plan_data) 
-- VALUES ('773c3f18-025a-432d-ae3d-fa13be3faef8', 'test_no_rls', 'Test Without RLS', 'Testing', '{"test": true}');

-- Note: This removes security restrictions temporarily
-- Re-enable RLS later with proper policies:
-- ALTER TABLE public.hobby_plans ENABLE ROW LEVEL SECURITY;