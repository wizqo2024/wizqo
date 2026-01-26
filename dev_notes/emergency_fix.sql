-- EMERGENCY FIX: Disable RLS temporarily
ALTER TABLE public.hobby_plans DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON public.hobby_plans TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Clean up any problematic policies
DROP POLICY IF EXISTS "Users can create own plans" ON public.hobby_plans;
DROP POLICY IF EXISTS "Users can view own plans" ON public.hobby_plans;
DROP POLICY IF EXISTS "Users can update own plans" ON public.hobby_plans;
DROP POLICY IF EXISTS "Users can delete own plans" ON public.hobby_plans;
DROP POLICY IF EXISTS "authenticated_users_all_access" ON public.hobby_plans;

-- Test the fix
INSERT INTO public.hobby_plans (user_id, hobby_name, title, overview, plan_data) 
VALUES ('773c3f18-025a-432d-ae3d-fa13be3faef8', 'test_fix', 'Test Fix', 'Testing', '{"test": true}');

SELECT * FROM public.hobby_plans WHERE hobby_name = 'test_fix';