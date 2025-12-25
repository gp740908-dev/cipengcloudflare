-- =============================================
-- SUPABASE STORAGE BUCKET SETUP
-- =============================================
-- Run this in Supabase SQL Editor after creating the bucket manually

-- Note: You need to create the bucket manually in Supabase Dashboard:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Click "New bucket"
-- 3. Name: "media"
-- 4. Check "Public bucket" option
-- 5. Click "Create bucket"

-- After creating the bucket, run this SQL to set up RLS policies:

-- Allow anyone to view files (public bucket)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'media' 
    AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their files
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'media' 
    AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'media' 
    AND auth.role() = 'authenticated'
);
