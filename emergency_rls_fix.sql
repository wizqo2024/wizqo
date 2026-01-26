-- =====================================================
-- EMERGENCY RLS FIX - DISABLE ALL RLS TEMPORARILY
-- =====================================================
-- This will completely disable RLS on all tables
-- to get the app working immediately
-- =====================================================

-- Disable RLS on ALL tables
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE hobby_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DROP POLICY IF EXISTS "users_can_view_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "users_can_update_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "users_can_insert_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "service_role_all" ON user_profiles;
DROP POLICY IF EXISTS "service_role_bypass" ON user_profiles;

DROP POLICY IF EXISTS "users_can_view_own_plans" ON hobby_plans;
DROP POLICY IF EXISTS "users_can_insert_own_plans" ON hobby_plans;
DROP POLICY IF EXISTS "users_can_update_own_plans" ON hobby_plans;
DROP POLICY IF EXISTS "users_can_delete_own_plans" ON hobby_plans;
DROP POLICY IF EXISTS "service_role_all" ON hobby_plans;
DROP POLICY IF EXISTS "service_role_bypass" ON hobby_plans;

DROP POLICY IF EXISTS "users_can_view_own_progress" ON user_progress;
DROP POLICY IF EXISTS "users_can_insert_own_progress" ON user_progress;
DROP POLICY IF EXISTS "users_can_update_own_progress" ON user_progress;
DROP POLICY IF EXISTS "users_can_delete_own_progress" ON user_progress;
DROP POLICY IF EXISTS "service_role_all" ON user_progress;
DROP POLICY IF EXISTS "service_role_bypass" ON user_progress;

-- Verify RLS is disabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('user_profiles', 'hobby_plans', 'user_progress')
AND schemaname = 'public';

SELECT 'EMERGENCY RLS FIX APPLIED - ALL RLS DISABLED!' as status;