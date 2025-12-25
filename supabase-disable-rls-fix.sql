-- =============================================
-- SIMPLE FIX: DISABLE RLS FOR ADMIN-ONLY TABLES
-- Run this in Supabase SQL Editor
-- =============================================

-- Option 1: DISABLE RLS completely for admin tables
-- These tables are only accessed from admin panel which is protected by authentication

-- Disable RLS on new tables (simple solution for admin-only tables)
ALTER TABLE promos DISABLE ROW LEVEL SECURITY;
ALTER TABLE promotional_banners DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('promos', 'promotional_banners', 'activity_logs', 'email_templates', 'email_logs');
