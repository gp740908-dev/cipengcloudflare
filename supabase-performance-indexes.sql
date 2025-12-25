-- ================================================================
-- DATABASE PERFORMANCE OPTIMIZATION FOR STAYINUBUD
-- ================================================================
-- Run these SQL commands in Supabase SQL Editor
-- to improve query performance and reduce load times
-- ================================================================

-- ================================================================
-- INDEXES FOR FASTER QUERIES
-- ================================================================

-- Villas Table Indexes
-- Speeds up villa listing and filtering
CREATE INDEX IF NOT EXISTS idx_villas_created_at 
ON villas(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_villas_featured 
ON villas(featured, created_at DESC) 
WHERE featured = true;

CREATE INDEX IF NOT EXISTS idx_villas_price 
ON villas(price_per_night);

CREATE INDEX IF NOT EXISTS idx_villas_bedrooms 
ON villas(bedrooms);

CREATE INDEX IF NOT EXISTS idx_villas_max_guests 
ON villas(max_guests);

-- Composite index for common filter scenarios
CREATE INDEX IF NOT EXISTS idx_villas_filters 
ON villas(price_per_night, bedrooms, max_guests);

-- ================================================================
-- Bookings Table Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_check_in 
ON bookings(check_in DESC);

CREATE INDEX IF NOT EXISTS idx_bookings_check_out 
ON bookings(check_out);

CREATE INDEX IF NOT EXISTS idx_bookings_villa_id 
ON bookings(villa_id, check_in, check_out);

CREATE INDEX IF NOT EXISTS idx_bookings_status 
ON bookings(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_bookings_guest_email 
ON bookings(guest_email);

-- ================================================================
-- Blog Posts Indexes  
CREATE INDEX IF NOT EXISTS idx_blog_posts_published 
ON blog_posts(published, created_at DESC) 
WHERE published = true;

CREATE INDEX IF NOT EXISTS idx_blog_posts_category 
ON blog_posts(category, created_at DESC);

-- ================================================================
-- Experiences Indexes
CREATE INDEX IF NOT EXISTS idx_experiences_active 
ON experiences(is_active, display_order) 
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_experiences_category 
ON experiences(category, display_order);

-- ================================================================
-- Hero Slides Indexes
CREATE INDEX IF NOT EXISTS idx_hero_slides_active 
ON hero_slides(is_active, display_order) 
WHERE is_active = true;

-- ================================================================
-- Analytics Indexes
CREATE INDEX IF NOT EXISTS idx_page_views_created 
ON page_views(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_page_views_page 
ON page_views(page_url, created_at DESC);

-- ================================================================
-- QUERY OPTIMIZATION ANALYSIS
-- ================================================================
-- Run EXPLAIN ANALYZE to check query performance
-- Example:

-- Check villas query performance
EXPLAIN ANALYZE
SELECT * FROM villas 
WHERE price_per_night <= 5000000 
  AND bedrooms >= 2 
ORDER BY created_at DESC 
LIMIT 10;

-- Check bookings availability query
EXPLAIN ANALYZE
SELECT * FROM bookings 
WHERE villa_id = 'your-villa-id' 
  AND status IN ('confirmed', 'pending')
  AND (
    (check_in <= '2024-01-15' AND check_out >= '2024-01-10')
  );

-- ================================================================
-- MAINTENANCE COMMANDS
-- ================================================================

-- Update statistics for better query planning
ANALYZE villas;
ANALYZE bookings;
ANALYZE blog_posts;
ANALYZE experiences;

-- Reindex if needed (recommended monthly)
REINDEX TABLE villas;
REINDEX TABLE bookings;

-- ================================================================
-- PERFORMANCE MONITORING QUERIES
-- ================================================================

-- Find slow queries (if pg_stat_statements is enabled)
-- Contact Supabase support to enable if needed

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    pg_total_relation_size(schemaname||'.'||tablename) AS size_bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY size_bytes DESC;

-- Check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Find unused indexes (candidates for removal)
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
  AND idx_scan = 0
  AND indexname NOT LIKE '%_pkey';

-- ================================================================
-- MATERIALIZED VIEWS FOR HEAVY QUERIES (Optional)
-- ================================================================

-- Create materialized view for villa statistics
-- Refresh this periodically via cron job
CREATE MATERIALIZED VIEW IF NOT EXISTS villa_stats AS
SELECT 
    v.id,
    v.name,
    v.price_per_night,
    COUNT(DISTINCT b.id) as total_bookings,
    AVG(CASE WHEN b.status = 'completed' THEN 5 ELSE NULL END) as avg_rating,
    MAX(b.check_out) as last_booked
FROM villas v
LEFT JOIN bookings b ON v.id = b.villa_id
GROUP BY v.id, v.name, v.price_per_night;

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_villa_stats_id ON villa_stats(id);

-- Refresh materialized view (run via cron or manually)
-- REFRESH MATERIALIZED VIEW CONCURRENTLY villa_stats;

-- ================================================================
-- NOTES
-- ================================================================
-- 1. Run ANALYZE after creating indexes
-- 2. Monitor index usage and remove unused indexes
-- 3. Consider partitioning bookings table if > 1M rows
-- 4. Enable pg_stat_statements for query monitoring
-- 5. Set up automated backups
-- 6. Monitor connection pool usage
-- ================================================================
