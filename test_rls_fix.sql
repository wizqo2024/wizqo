-- =====================================================
-- TEST RLS FIX - VERIFY SERVICE ROLE ACCESS
-- =====================================================
-- This script tests if the service role can access tables
-- =====================================================

-- Check if RLS is disabled on all tables
SELECT 
  'user_profiles' as table_name,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'user_profiles' AND schemaname = 'public'

UNION ALL

SELECT 
  'hobby_plans' as table_name,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'hobby_plans' AND schemaname = 'public'

UNION ALL

SELECT 
  'user_progress' as table_name,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'user_progress' AND schemaname = 'public';

-- Check if policies exist (should be 0)
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
WHERE tablename IN ('user_profiles', 'hobby_plans', 'user_progress')
AND schemaname = 'public';

SELECT 'RLS FIX VERIFICATION COMPLETE!' as status;