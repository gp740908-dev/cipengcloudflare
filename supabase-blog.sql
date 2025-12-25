-- ============================================
-- ADDITIONAL TABLES FOR BLOG
-- Run this in Supabase SQL Editor
-- ============================================

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  author TEXT DEFAULT 'Admin',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for blog
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);

-- Enable RLS on blog_posts
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Blog policies
-- Anyone can read published posts
CREATE POLICY "Public can view published posts" ON blog_posts
  FOR SELECT USING (published = true);

-- Admins can do everything
CREATE POLICY "Admins can manage blog posts" ON blog_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.email = auth.jwt()->>'email'
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, author, published) VALUES
(
  'Menjelajahi Keindahan Ubud: Panduan Wisatawan',
  'menjelajahi-keindahan-ubud',
  'Temukan pesona tersembunyi di jantung budaya Bali. Ubud menawarkan pengalaman spiritual dan alam yang tak terlupakan.',
  '## Ubud: Jantung Budaya Bali

Ubud adalah destinasi yang sempurna bagi wisatawan yang mencari ketenangan dan pengalaman budaya otentik. Terletak di dataran tinggi Bali, kota ini dikelilingi oleh sawah terasering yang indah, hutan hujan tropis, dan candi-candi kuno.

### Tempat Wajib Dikunjungi

1. **Tegallalang Rice Terrace** - Sawah terasering ikonik dengan pemandangan spektakuler
2. **Sacred Monkey Forest** - Hutan suci yang dihuni ratusan monyet
3. **Tirta Empul** - Pura dengan mata air suci untuk penyucian
4. **Ubud Palace** - Istana kerajaan dengan arsitektur Bali tradisional

### Tips Berkunjung

- Datang pagi untuk menghindari keramaian
- Hormati adat dan budaya lokal
- Gunakan pakaian sopan saat mengunjungi pura
- Coba kuliner lokal di pasar Ubud

Selamat menjelajahi Ubud!',
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80',
  'Admin',
  true
),
(
  '5 Tips Memilih Villa Liburan yang Tepat',
  '5-tips-memilih-villa-liburan',
  'Panduan lengkap memilih akomodasi villa untuk liburan keluarga atau bersama teman.',
  '## Cara Memilih Villa Liburan Terbaik

Memilih villa untuk liburan bisa jadi membingungkan dengan banyaknya pilihan yang tersedia. Berikut tips yang akan membantu Anda:

### 1. Tentukan Lokasi

Pilih villa yang dekat dengan tempat-tempat yang ingin Anda kunjungi. Di Ubud, pertimbangkan akses ke pusat kota, restoran, dan atraksi wisata.

### 2. Cek Fasilitas

Pastikan villa memiliki fasilitas yang Anda butuhkan:
- Kolam renang pribadi
- WiFi cepat
- Dapur lengkap
- AC di semua ruangan

### 3. Baca Review

Ulasan dari tamu sebelumnya sangat berharga. Perhatikan komentar tentang kebersihan, pelayanan, dan kesesuaian foto dengan kondisi nyata.

### 4. Perhatikan Kapasitas

Pilih villa dengan kapasitas yang sesuai. Jangan terlalu sempit agar tetap nyaman.

### 5. Bandingkan Harga

Bandingkan harga dari beberapa sumber. Booking langsung seringkali mendapat harga lebih baik.

Selamat memilih villa impian Anda!',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80',
  'Admin',
  true
);
