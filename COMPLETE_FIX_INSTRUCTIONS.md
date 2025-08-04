# Complete Database Fix Instructions

## Current Status
- App generates plans correctly ✓
- Authentication working ✓ 
- Save operation timing out due to RLS ❌

## IMMEDIATE FIX NEEDED

Since API fixes aren't working, you must manually run this in your Supabase dashboard:

### Step 1: Open Supabase Dashboard
1. Go to: https://supabase.com/dashboard/projects
2. Select your Wizqo project
3. Click "SQL Editor" in left sidebar
4. Click "New Query"

### Step 2: Run This Emergency Fix
Copy and paste exactly:

```sql
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
```

### Step 3: Click "Run" and verify success

### Step 4: Test in app
Generate a new plan - saves should work immediately!

## After Fix Works
Once saves work, you can re-enable RLS with proper policies:

```sql
-- Re-enable RLS with working policy
ALTER TABLE public.hobby_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_authenticated_all" ON public.hobby_plans
  FOR ALL USING (auth.uid() IS NOT NULL);
```

This emergency fix removes the security restriction temporarily so saves work immediately.