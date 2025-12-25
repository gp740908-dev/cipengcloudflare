-- =============================================
-- TESTIMONIALS TABLE FOR STAYINUBUD
-- =============================================

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    guest_name VARCHAR(255) NOT NULL,
    guest_location VARCHAR(255),
    quote TEXT NOT NULL,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    villa_name VARCHAR(255),
    guest_image VARCHAR(500),
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public read policy (for website display)
CREATE POLICY "Public can view testimonials" ON testimonials
    FOR SELECT USING (true);

-- Admin insert policy
CREATE POLICY "Admin can insert testimonials" ON testimonials
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email'
        )
    );

-- Admin update policy
CREATE POLICY "Admin can update testimonials" ON testimonials
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email'
        )
    );

-- Admin delete policy
CREATE POLICY "Admin can delete testimonials" ON testimonials
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = auth.jwt() ->> 'email'
        )
    );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_testimonials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_testimonials_timestamp
    BEFORE UPDATE ON testimonials
    FOR EACH ROW
    EXECUTE FUNCTION update_testimonials_updated_at();

-- Insert sample testimonials
INSERT INTO testimonials (guest_name, guest_location, quote, rating, villa_name, guest_image, featured) VALUES
(
    'Alexandra Chen',
    'Hong Kong',
    'An absolutely transcendent experience. The attention to detail was extraordinary, and our private villa exceeded every expectation.',
    5,
    'Villa Lotus Dream',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    true
),
(
    'James Miller',
    'London, UK',
    'StayinUBUD set a new standard for luxury. The concierge service was impeccable, and the villa was simply breathtaking.',
    5,
    'Villa Taman Surga',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    true
),
(
    'Sophie Laurent',
    'Paris, France',
    'A hidden paradise. The privacy, the views, the service—everything was curated to perfection. Already planning our return.',
    5,
    'Villa Bambu Retreat',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    true
),
(
    'David Kim',
    'Seoul, Korea',
    'The perfect blend of traditional Balinese charm and modern luxury. We felt completely at home yet utterly pampered.',
    5,
    'Villa Sawah Indah',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    false
);
