-- ============================================
-- COMPLETE FIX untuk Admin Login
-- Jalankan SEMUA query ini di Supabase SQL Editor
-- ============================================

-- =====================
-- STEP 1: Hapus SEMUA policy lama
-- =====================
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;
DROP POLICY IF EXISTS "Users can check if they are admin" ON admin_users;
DROP POLICY IF EXISTS "Admins can view all admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can insert admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can delete admin users" ON admin_users;

-- =====================
-- STEP 2: Buat policy yang lebih simple
-- Mengizinkan authenticated users untuk SELECT berdasarkan email mereka
-- =====================
CREATE POLICY "Authenticated users can check their admin status" ON admin_users
  FOR SELECT 
  TO authenticated
  USING (email = auth.jwt()->>'email');

-- Policy untuk admins mengelola admin_users
CREATE POLICY "Admins can manage admin users" ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE email = auth.jwt()->>'email'
    )
  );

-- =====================
-- STEP 3: Pastikan email admin ada di tabel
-- =====================
INSERT INTO admin_users (email, role) 
VALUES ('admin@stayinubud.com', 'super_admin')
ON CONFLICT (email) DO UPDATE SET role = 'super_admin';

-- =====================
-- STEP 4: Buat function RPC untuk cek admin (bypass RLS jika perlu)
-- =====================
CREATE OR REPLACE FUNCTION is_admin(check_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users WHERE email = lower(check_email)
  );
END;
$$;

-- =====================
-- STEP 5: Verifikasi
-- =====================

-- Cek data admin_users
SELECT * FROM admin_users;

-- Cek policies yang aktif
SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'admin_users';

-- =====================
-- HASIL YANG DIHARAPKAN:
-- 
-- Dari SELECT * FROM admin_users:
-- | id   | email                  | role        | created_at |
-- | uuid | admin@stayinubud.com   | super_admin | timestamp  |
-- 
-- =====================
