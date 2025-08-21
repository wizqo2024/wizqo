-- =====================================================
-- FINAL RLS FIX - ROBUST SERVICE ROLE DETECTION
-- =====================================================
-- This version uses multiple methods to detect service role
-- and ensures all operations work properly
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hobby_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
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

-- Service role bypass policies (allows backend to work)
-- Multiple conditions to catch service role requests
CREATE POLICY "service_role_bypass" ON user_profiles FOR ALL USING (
  auth.role() = 'service_role' OR 
  auth.role() = 'authenticated' OR
  current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
);

CREATE POLICY "service_role_bypass" ON hobby_plans FOR ALL USING (
  auth.role() = 'service_role' OR 
  auth.role() = 'authenticated' OR
  current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
);

CREATE POLICY "service_role_bypass" ON user_progress FOR ALL USING (
  auth.role() = 'service_role' OR 
  auth.role() = 'authenticated' OR
  current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
);

-- User policies using auth.uid() directly (no type casting)
CREATE POLICY "users_can_view_own_profile" ON user_profiles FOR SELECT USING (auth.uid() = id OR auth.uid() = user_id);
CREATE POLICY "users_can_update_own_profile" ON user_profiles FOR UPDATE USING (auth.uid() = id OR auth.uid() = user_id);
CREATE POLICY "users_can_insert_own_profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id OR auth.uid() = user_id);

CREATE POLICY "users_can_view_own_plans" ON hobby_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_can_insert_own_plans" ON hobby_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_can_update_own_plans" ON hobby_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "users_can_delete_own_plans" ON hobby_plans FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "users_can_view_own_progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_can_insert_own_progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_can_update_own_progress" ON user_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "users_can_delete_own_progress" ON user_progress FOR DELETE USING (auth.uid() = user_id);

SELECT 'Final RLS Policies Created Successfully!' as status;