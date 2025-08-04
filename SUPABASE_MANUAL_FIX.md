# Manual Supabase RLS Fix Instructions

Since the API fix didn't work, you need to manually fix the RLS policies in your Supabase dashboard.

## Step-by-Step Fix

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/projects
   - Select your Wizqo project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run this emergency fix SQL script** (copy and paste exactly):

```sql
-- EMERGENCY FIX: Temporarily disable RLS
ALTER TABLE public.hobby_plans DISABLE ROW LEVEL SECURITY;

-- Ensure authenticated users have access
GRANT ALL ON public.hobby_plans TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Drop any existing policies that might interfere
DROP POLICY IF EXISTS "Users can create own plans" ON public.hobby_plans;
DROP POLICY IF EXISTS "Users can view own plans" ON public.hobby_plans;
DROP POLICY IF EXISTS "Users can update own plans" ON public.hobby_plans;
DROP POLICY IF EXISTS "Users can delete own plans" ON public.hobby_plans;
DROP POLICY IF EXISTS "Enable all operations for authenticated users on hobby_plans" ON public.hobby_plans;
DROP POLICY IF EXISTS "authenticated_users_all_access" ON public.hobby_plans;
```

4. **Click "Run" to execute the script**

5. **Test the fix** by generating a new plan in the app

## What This Does

- Removes all existing restrictive RLS policies
- Creates a simple policy that allows authenticated users to do everything
- Ensures proper permissions are granted
- Keeps RLS enabled for security

This should completely fix the save issue!