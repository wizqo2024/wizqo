-- =====================================================
-- COMPREHENSIVE RLS POLICIES FOR WIZQO APP
-- =====================================================
-- This script sets up Row Level Security policies that allow:
-- 1. Users to access their own data
-- 2. Service role to perform all operations
-- 3. Proper security while maintaining functionality
-- =====================================================

-- Enable RLS on all tables (if not already enabled)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hobby_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USER_PROFILES TABLE POLICIES
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "users_can_view_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "users_can_update_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "users_can_insert_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "service_role_all" ON user_profiles;

-- Users can view their own profile
CREATE POLICY "users_can_view_own_profile" ON user_profiles
    FOR SELECT USING (
        auth.uid()::text = id OR 
        auth.uid()::text = user_id
    );

-- Users can update their own profile
CREATE POLICY "users_can_update_own_profile" ON user_profiles
    FOR UPDATE USING (
        auth.uid()::text = id OR 
        auth.uid()::text = user_id
    );

-- Users can insert their own profile
CREATE POLICY "users_can_insert_own_profile" ON user_profiles
    FOR INSERT WITH CHECK (
        auth.uid()::text = id OR 
        auth.uid()::text = user_id
    );

-- Service role can do everything
CREATE POLICY "service_role_all" ON user_profiles
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- HOBBY_PLANS TABLE POLICIES
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "users_can_view_own_plans" ON hobby_plans;
DROP POLICY IF EXISTS "users_can_insert_own_plans" ON hobby_plans;
DROP POLICY IF EXISTS "users_can_update_own_plans" ON hobby_plans;
DROP POLICY IF EXISTS "users_can_delete_own_plans" ON hobby_plans;
DROP POLICY IF EXISTS "service_role_all" ON hobby_plans;

-- Users can view their own plans
CREATE POLICY "users_can_view_own_plans" ON hobby_plans
    FOR SELECT USING (
        auth.uid()::text = user_id
    );

-- Users can insert their own plans
CREATE POLICY "users_can_insert_own_plans" ON hobby_plans
    FOR INSERT WITH CHECK (
        auth.uid()::text = user_id
    );

-- Users can update their own plans
CREATE POLICY "users_can_update_own_plans" ON hobby_plans
    FOR UPDATE USING (
        auth.uid()::text = user_id
    );

-- Users can delete their own plans
CREATE POLICY "users_can_delete_own_plans" ON hobby_plans
    FOR DELETE USING (
        auth.uid()::text = user_id
    );

-- Service role can do everything
CREATE POLICY "service_role_all" ON hobby_plans
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- USER_PROGRESS TABLE POLICIES
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "users_can_view_own_progress" ON user_progress;
DROP POLICY IF EXISTS "users_can_insert_own_progress" ON user_progress;
DROP POLICY IF EXISTS "users_can_update_own_progress" ON user_progress;
DROP POLICY IF EXISTS "users_can_delete_own_progress" ON user_progress;
DROP POLICY IF EXISTS "service_role_all" ON user_progress;

-- Users can view their own progress
CREATE POLICY "users_can_view_own_progress" ON user_progress
    FOR SELECT USING (
        auth.uid()::text = user_id
    );

-- Users can insert their own progress
CREATE POLICY "users_can_insert_own_progress" ON user_progress
    FOR INSERT WITH CHECK (
        auth.uid()::text = user_id
    );

-- Users can update their own progress
CREATE POLICY "users_can_update_own_progress" ON user_progress
    FOR UPDATE USING (
        auth.uid()::text = user_id
    );

-- Users can delete their own progress
CREATE POLICY "users_can_delete_own_progress" ON user_progress
    FOR DELETE USING (
        auth.uid()::text = user_id
    );

-- Service role can do everything
CREATE POLICY "service_role_all" ON user_progress
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- ADDITIONAL SECURITY POLICIES
-- =====================================================

-- Optional: Allow public read access to plan data (for sharing)
-- Uncomment if you want to allow public access to plan data
/*
CREATE POLICY "public_can_view_plans" ON hobby_plans
    FOR SELECT USING (true);
*/

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if policies were created successfully
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('user_profiles', 'hobby_plans', 'user_progress')
ORDER BY tablename, policyname;

-- Check RLS status on tables
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_profiles', 'hobby_plans', 'user_progress');

-- =====================================================
-- NOTES
-- =====================================================
/*
This script creates comprehensive RLS policies that:

1. SECURITY: Users can only access their own data
2. FUNCTIONALITY: Service role can perform all operations
3. FLEXIBILITY: Supports both 'id' and 'user_id' columns in user_profiles
4. COMPLETENESS: Covers all CRUD operations (SELECT, INSERT, UPDATE, DELETE)

To apply these policies:
1. Run this script in your Supabase SQL Editor
2. Test the app functionality
3. Monitor logs for any remaining RLS issues

If you need to temporarily disable RLS for debugging:
   ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
   ALTER TABLE hobby_plans DISABLE ROW LEVEL SECURITY;
   ALTER TABLE user_progress DISABLE ROW LEVEL SECURITY;

To re-enable RLS:
   ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE hobby_plans ENABLE ROW LEVEL SECURITY;
   ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
*/