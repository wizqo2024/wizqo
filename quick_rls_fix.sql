-- =====================================================
-- QUICK RLS FIX FOR WIZQO APP
-- =====================================================
-- Run this in Supabase SQL Editor to fix RLS issues immediately
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hobby_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to start fresh
DROP POLICY IF EXISTS "users_can_view_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "users_can_update_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "users_can_insert_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "service_role_all" ON user_profiles;

DROP POLICY IF EXISTS "users_can_view_own_plans" ON hobby_plans;
DROP POLICY IF EXISTS "users_can_insert_own_plans" ON hobby_plans;
DROP POLICY IF EXISTS "users_can_update_own_plans" ON hobby_plans;
DROP POLICY IF EXISTS "users_can_delete_own_plans" ON hobby_plans;
DROP POLICY IF EXISTS "service_role_all" ON hobby_plans;

DROP POLICY IF EXISTS "users_can_view_own_progress" ON user_progress;
DROP POLICY IF EXISTS "users_can_insert_own_progress" ON user_progress;
DROP POLICY IF EXISTS "users_can_update_own_progress" ON user_progress;
DROP POLICY IF EXISTS "users_can_delete_own_progress" ON user_progress;
DROP POLICY IF EXISTS "service_role_all" ON user_progress;

-- Create service role policies (allows backend to work)
CREATE POLICY "service_role_all" ON user_profiles FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all" ON hobby_plans FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all" ON user_progress FOR ALL USING (auth.role() = 'service_role');

-- Create user policies (allows frontend to work)
CREATE POLICY "users_can_view_own_profile" ON user_profiles FOR SELECT USING (auth.uid()::text = id OR auth.uid()::text = user_id);
CREATE POLICY "users_can_update_own_profile" ON user_profiles FOR UPDATE USING (auth.uid()::text = id OR auth.uid()::text = user_id);
CREATE POLICY "users_can_insert_own_profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid()::text = id OR auth.uid()::text = user_id);

CREATE POLICY "users_can_view_own_plans" ON hobby_plans FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "users_can_insert_own_plans" ON hobby_plans FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "users_can_update_own_plans" ON hobby_plans FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "users_can_delete_own_plans" ON hobby_plans FOR DELETE USING (auth.uid()::text = user_id);

CREATE POLICY "users_can_view_own_progress" ON user_progress FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "users_can_insert_own_progress" ON user_progress FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "users_can_update_own_progress" ON user_progress FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "users_can_delete_own_progress" ON user_progress FOR DELETE USING (auth.uid()::text = user_id);

-- Verify policies were created
SELECT 'RLS Policies Created Successfully!' as status;