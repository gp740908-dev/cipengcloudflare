-- =============================================
-- FIX RLS POLICIES FOR ADMIN EXTENDED TABLES
-- Run this in Supabase SQL Editor
-- =============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Public can read active promos" ON promos;
DROP POLICY IF EXISTS "Admin full access to promos" ON promos;
DROP POLICY IF EXISTS "Public can read active banners" ON promotional_banners;
DROP POLICY IF EXISTS "Admin full access to banners" ON promotional_banners;
DROP POLICY IF EXISTS "Admin full access to activity_logs" ON activity_logs;
DROP POLICY IF EXISTS "Admin full access to email_templates" ON email_templates;
DROP POLICY IF EXISTS "Admin full access to email_logs" ON email_logs;

-- =============================================
-- PROMOS POLICIES
-- =============================================

-- Anyone can read active promos (for public validation)
CREATE POLICY "promos_public_read" ON promos
    FOR SELECT 
    USING (is_active = true AND valid_from <= NOW() AND (valid_until IS NULL OR valid_until >= NOW()));

-- Authenticated users who are admins can do everything
CREATE POLICY "promos_admin_all" ON promos
    FOR ALL 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.email = auth.jwt() ->> 'email'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.email = auth.jwt() ->> 'email'
        )
    );

-- =============================================
-- PROMOTIONAL BANNERS POLICIES
-- =============================================

-- Anyone can read active banners
CREATE POLICY "banners_public_read" ON promotional_banners
    FOR SELECT 
    USING (is_active = true AND valid_from <= NOW() AND (valid_until IS NULL OR valid_until >= NOW()));

-- Authenticated users who are admins can do everything
CREATE POLICY "banners_admin_all" ON promotional_banners
    FOR ALL 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.email = auth.jwt() ->> 'email'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.email = auth.jwt() ->> 'email'
        )
    );

-- =============================================
-- ACTIVITY LOGS POLICIES
-- =============================================

-- Only admins can read/write activity logs
CREATE POLICY "activity_logs_admin_all" ON activity_logs
    FOR ALL 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.email = auth.jwt() ->> 'email'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.email = auth.jwt() ->> 'email'
        )
    );

-- =============================================
-- EMAIL TEMPLATES POLICIES
-- =============================================

-- Only admins can read/write email templates
CREATE POLICY "email_templates_admin_all" ON email_templates
    FOR ALL 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.email = auth.jwt() ->> 'email'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.email = auth.jwt() ->> 'email'
        )
    );

-- =============================================
-- EMAIL LOGS POLICIES
-- =============================================

-- Only admins can read/write email logs
CREATE POLICY "email_logs_admin_all" ON email_logs
    FOR ALL 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.email = auth.jwt() ->> 'email'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.email = auth.jwt() ->> 'email'
        )
    );

-- =============================================
-- VERIFY admin_users POLICY (ensure it works)
-- =============================================

-- Make sure admin_users allows authenticated users to check their own email
DROP POLICY IF EXISTS "admin_users_read_own" ON admin_users;
CREATE POLICY "admin_users_read_own" ON admin_users
    FOR SELECT
    TO authenticated
    USING (true);  -- Allow all authenticated users to read admin_users table to check if they are admin
