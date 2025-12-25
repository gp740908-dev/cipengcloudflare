-- =============================================
-- ADMIN FEATURES - COMPLETE SETUP
-- =============================================

-- 1. SITE SETTINGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (key, value) VALUES
    ('general', '{"site_name": "StayinUBUD", "tagline": "Luxury Villa Rentals in Ubud, Bali"}'),
    ('contact', '{"phone": "+62 812 3456 7890", "email": "hello@stayinubud.com", "whatsapp": "6281234567890", "address": "Ubud, Bali, Indonesia"}'),
    ('social', '{"instagram": "https://instagram.com/stayinubud", "facebook": "https://facebook.com/stayinubud", "tiktok": "", "youtube": ""}'),
    ('seo', '{"meta_title": "StayinUBUD - Luxury Villa Rentals in Ubud, Bali", "meta_description": "Experience luxury in the heart of Ubud with our premium villa rentals. Private pools, stunning rice field views, and authentic Balinese hospitality.", "google_analytics_id": ""}'),
    ('footer', '{"copyright": "© 2024 StayinUBUD. All rights reserved.", "show_newsletter": true}')
ON CONFLICT (key) DO NOTHING;

-- RLS for site_settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can read site settings" ON site_settings;
DROP POLICY IF EXISTS "Only admins can update site settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can manage site settings" ON site_settings;

-- Create new policies
CREATE POLICY "Anyone can read site settings" ON site_settings
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage site settings" ON site_settings
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
    );

-- 2. HERO SLIDES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS hero_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    villa_id UUID REFERENCES villas(id) ON DELETE CASCADE,
    custom_tagline TEXT,
    custom_description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for hero_slides
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active hero slides" ON hero_slides;
DROP POLICY IF EXISTS "Admins can manage hero slides" ON hero_slides;
DROP POLICY IF EXISTS "Anyone can read hero slides" ON hero_slides;

CREATE POLICY "Anyone can read hero slides" ON hero_slides
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage hero slides" ON hero_slides
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
    );

-- 3. EXPERIENCES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image TEXT,
    category TEXT DEFAULT 'other', -- wellness, adventure, culture, relaxation, spiritual, creative
    featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default experiences
INSERT INTO experiences (title, description, image, category, featured, display_order) VALUES
    ('Sunrise Yoga', 'Start your day with rejuvenating yoga sessions overlooking rice terraces', 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800', 'wellness', true, 1),
    ('Balinese Spa', 'Traditional healing treatments using ancient techniques and local herbs', 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800', 'relaxation', true, 2),
    ('Rice Field Trek', 'Guided walks through emerald terraces and hidden waterfalls', 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800', 'adventure', true, 3),
    ('Cooking Class', 'Master authentic Balinese recipes with local culinary experts', 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=800', 'culture', true, 4),
    ('Temple Ceremony', 'Experience sacred rituals and ancient spiritual traditions', 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800', 'spiritual', true, 5),
    ('Art Workshop', 'Learn traditional Balinese painting and craft techniques', 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800', 'creative', true, 6)
ON CONFLICT DO NOTHING;

-- RLS for experiences
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active experiences" ON experiences;
DROP POLICY IF EXISTS "Admins can manage experiences" ON experiences;
DROP POLICY IF EXISTS "Anyone can read experiences" ON experiences;

CREATE POLICY "Anyone can read experiences" ON experiences
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage experiences" ON experiences
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
    );

-- 4. MEDIA LIBRARY TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    url TEXT NOT NULL,
    file_type TEXT, -- image, video, document
    file_size INTEGER,
    folder TEXT DEFAULT 'general',
    alt_text TEXT,
    uploaded_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for media
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read media" ON media;
DROP POLICY IF EXISTS "Admins can manage media" ON media;

CREATE POLICY "Anyone can read media" ON media
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage media" ON media
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
    );

-- 5. Add featured column to villas if not exists
-- =============================================
ALTER TABLE villas ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE villas ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_hero_slides_order ON hero_slides(display_order);
CREATE INDEX IF NOT EXISTS idx_experiences_order ON experiences(display_order);
CREATE INDEX IF NOT EXISTS idx_experiences_featured ON experiences(featured);
CREATE INDEX IF NOT EXISTS idx_villas_featured ON villas(featured);
CREATE INDEX IF NOT EXISTS idx_media_folder ON media(folder);
