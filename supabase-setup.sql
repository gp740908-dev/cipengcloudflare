-- StayinUBUD Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Villas table
CREATE TABLE IF NOT EXISTS villas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  max_guests INTEGER NOT NULL,
  price_per_night DECIMAL(10,2) NOT NULL,
  amenities TEXT[],
  images TEXT[],
  location TEXT NOT NULL DEFAULT 'Ubud, Bali',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  villa_id UUID REFERENCES villas(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  total_guests INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_bookings_villa_id ON bookings(villa_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(guest_email);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE villas ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Villas policies
-- Anyone can read villas
CREATE POLICY "Public villas are viewable by everyone" ON villas
  FOR SELECT USING (true);

-- Only authenticated admins can insert villas
CREATE POLICY "Admins can insert villas" ON villas
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.email = auth.jwt()->>'email'
    )
  );

-- Only authenticated admins can update villas
CREATE POLICY "Admins can update villas" ON villas
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.email = auth.jwt()->>'email'
    )
  );

-- Only authenticated admins can delete villas
CREATE POLICY "Admins can delete villas" ON villas
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.email = auth.jwt()->>'email'
    )
  );

-- Bookings policies
-- Anyone can read all bookings (for availability checking)
CREATE POLICY "Bookings are viewable by everyone" ON bookings
  FOR SELECT USING (true);

-- Anyone can create bookings
CREATE POLICY "Anyone can create bookings" ON bookings
  FOR INSERT WITH CHECK (true);

-- Only admins can update bookings
CREATE POLICY "Admins can update bookings" ON bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.email = auth.jwt()->>'email'
    )
  );

-- Only admins can delete bookings
CREATE POLICY "Admins can delete bookings" ON bookings
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.email = auth.jwt()->>'email'
    )
  );

-- Admin users policies
-- Only authenticated admins can read admin_users
CREATE POLICY "Admins can view admin users" ON admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.email = auth.jwt()->>'email'
    )
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_villas_updated_at BEFORE UPDATE ON villas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check booking availability
CREATE OR REPLACE FUNCTION check_booking_availability(
  p_villa_id UUID,
  p_check_in DATE,
  p_check_out DATE
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM bookings
    WHERE villa_id = p_villa_id
      AND status != 'cancelled'
      AND (
        (check_in <= p_check_in AND check_out > p_check_in) OR
        (check_in < p_check_out AND check_out >= p_check_out) OR
        (check_in >= p_check_in AND check_out <= p_check_out)
      )
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert sample villas
INSERT INTO villas (name, description, bedrooms, bathrooms, max_guests, price_per_night, amenities, images, location) VALUES
(
  'Villa Taman Surga',
  'Experience paradise at Villa Taman Surga, a stunning 3-bedroom sanctuary nestled in the heart of Ubud. This luxurious villa features breathtaking rice field views, a private infinity pool, and traditional Balinese architecture blended with modern amenities. Wake up to the sounds of nature and enjoy your morning coffee on the expansive terrace overlooking emerald green rice terraces. The villa offers spacious living areas, a fully equipped kitchen, and beautifully appointed bedrooms with en-suite bathrooms. Perfect for families or groups seeking tranquility and authentic Balinese charm.',
  3,
  3,
  6,
  3950000,
  ARRAY['Private Pool', 'WiFi', 'Air Conditioning', 'Full Kitchen', 'Rice Field View', 'Parking', 'Garden', 'Outdoor Dining', 'BBQ Facilities', 'Daily Housekeeping'],
  ARRAY[
    'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=1200&q=80',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=80'
  ],
  'Ubud, Bali'
),
(
  'Villa Bambu Retreat',
  'Villa Bambu Retreat is a romantic 2-bedroom hideaway surrounded by lush jungle and swaying bamboo groves. This eco-luxury villa combines sustainable design with ultimate comfort, featuring an outdoor bathtub, private plunge pool, and open-air living spaces that blur the line between indoor and outdoor living. The master bedroom opens directly to the forest, offering an immersive nature experience. Each detail has been carefully curated to provide a peaceful sanctuary while maintaining modern conveniences. Ideal for couples or small families seeking an intimate escape in nature.',
  2,
  2,
  4,
  2850000,
  ARRAY['Plunge Pool', 'WiFi', 'Outdoor Bath', 'Jungle View', 'Air Conditioning', 'Yoga Deck', 'Garden', 'Eco-Friendly', 'Breakfast Included', 'Parking'],
  ARRAY[
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80',
    'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=80',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&q=80'
  ],
  'Ubud, Bali'
),
(
  'Villa Lotus Dream',
  'Villa Lotus Dream is the crown jewel of Ubud luxury accommodations. This magnificent 4-bedroom estate features a spectacular 20-meter infinity pool overlooking the dramatic Campuhan Valley. The villa showcases exquisite Balinese craftsmanship with hand-carved teakwood doors, traditional alang-alang thatched roofs, and contemporary designer furnishings. Multiple living pavilions, a professional kitchen, media room, and spa treatment room make this the perfect venue for special celebrations or exclusive retreats. The master suite features a private balcony with panoramic valley views, while all bedrooms include luxury en-suite bathrooms with rain showers and soaking tubs.',
  4,
  4,
  8,
  5500000,
  ARRAY['Infinity Pool', 'Valley View', 'WiFi', 'Full Kitchen', 'Air Conditioning', 'Media Room', 'Spa Room', 'Butler Service', 'Chef Available', 'Parking', 'Garden', 'Gym'],
  ARRAY[
    'https://images.unsplash.com/photo-1615880480668-7c0f10c4f9de?w=1200&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80'
  ],
  'Ubud, Bali'
),
(
  'Villa Padi Indah',
  'Villa Padi Indah offers an authentic Balinese living experience with its traditional design and prime rice terrace location. This charming 2-bedroom villa features a beautiful private garden, serene lotus pond, and intimate swimming pool surrounded by tropical flowers. The open-plan living area flows seamlessly to an outdoor terrace perfect for alfresco dining while watching farmers tend the rice fields. Both bedrooms are designed as peaceful retreats with natural materials, comfortable beds, and garden views. The villa includes a well-equipped kitchen, cozy reading nook, and multiple relaxation areas. A perfect choice for those seeking authentic Ubud charm at exceptional value.',
  2,
  2,
  4,
  3150000,
  ARRAY['Private Pool', 'Rice Terrace View', 'WiFi', 'Garden', 'Air Conditioning', 'Kitchen', 'Parking', 'Outdoor Dining', 'Lotus Pond', 'Daily Housekeeping'],
  ARRAY[
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=80',
    'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=1200&q=80',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80'
  ],
  'Ubud, Bali'
);

-- Insert a sample admin user (you'll need to create this user in Supabase Auth)
-- Replace 'admin@stayinubud.com' with your actual admin email
INSERT INTO admin_users (email, role) VALUES
('admin@stayinubud.com', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- STORAGE BUCKET
-- ============================================

-- Note: Run this in Supabase Dashboard > Storage
-- Create a public bucket called 'villa-images'
-- Set it to public for read access
-- You can upload images here and reference them in the images array

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('villas', 'bookings', 'admin_users');

-- Verify villas were inserted
SELECT id, name, price_per_night FROM villas;

-- Check booking availability function (optional - can be removed if causing issues)
-- SELECT check_booking_availability(
--   (SELECT id FROM villas LIMIT 1),
--   CURRENT_DATE::DATE,
--   (CURRENT_DATE + INTERVAL '3 days')::DATE
-- );
