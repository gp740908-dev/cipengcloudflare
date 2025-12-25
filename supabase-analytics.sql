-- =============================================
-- ANALYTICS TRACKING - PAGE VIEWS
-- =============================================

-- 1. PAGE VIEWS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    path TEXT NOT NULL,
    page_title TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_address TEXT,
    country TEXT,
    city TEXT,
    device_type TEXT, -- desktop, mobile, tablet
    browser TEXT,
    os TEXT,
    session_id TEXT,
    visitor_id TEXT, -- persistent identifier for returning visitors
    duration INTEGER DEFAULT 0, -- time spent on page in seconds
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DAILY STATS TABLE (Aggregated for performance)
-- =============================================
CREATE TABLE IF NOT EXISTS analytics_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL UNIQUE,
    total_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    desktop_views INTEGER DEFAULT 0,
    mobile_views INTEGER DEFAULT 0,
    tablet_views INTEGER DEFAULT 0,
    avg_duration INTEGER DEFAULT 0,
    top_pages JSONB DEFAULT '[]',
    top_referrers JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. INDEXES for performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON page_views(visitor_id);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_daily_date ON analytics_daily(date DESC);

-- 4. RLS Policies
-- =============================================
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily ENABLE ROW LEVEL SECURITY;

-- Anyone can insert page views (for tracking)
DROP POLICY IF EXISTS "Anyone can insert page views" ON page_views;
CREATE POLICY "Anyone can insert page views" ON page_views
    FOR INSERT WITH CHECK (true);

-- Only admins can read page views
DROP POLICY IF EXISTS "Admins can read page views" ON page_views;
CREATE POLICY "Admins can read page views" ON page_views
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
    );

-- Only admins can manage analytics_daily
DROP POLICY IF EXISTS "Anyone can read analytics daily" ON analytics_daily;
DROP POLICY IF EXISTS "Admins can manage analytics daily" ON analytics_daily;

CREATE POLICY "Anyone can read analytics daily" ON analytics_daily
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage analytics daily" ON analytics_daily
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
    );

-- 5. Function to aggregate daily stats
-- =============================================
CREATE OR REPLACE FUNCTION aggregate_daily_analytics()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    target_date DATE := CURRENT_DATE - INTERVAL '1 day';
BEGIN
    INSERT INTO analytics_daily (date, total_views, unique_visitors, desktop_views, mobile_views, tablet_views, avg_duration, top_pages, top_referrers)
    SELECT 
        target_date,
        COUNT(*) as total_views,
        COUNT(DISTINCT visitor_id) as unique_visitors,
        COUNT(*) FILTER (WHERE device_type = 'desktop') as desktop_views,
        COUNT(*) FILTER (WHERE device_type = 'mobile') as mobile_views,
        COUNT(*) FILTER (WHERE device_type = 'tablet') as tablet_views,
        COALESCE(AVG(duration), 0)::INTEGER as avg_duration,
        (SELECT jsonb_agg(row_to_json(t)) FROM (
            SELECT path, COUNT(*) as views 
            FROM page_views 
            WHERE created_at::date = target_date 
            GROUP BY path 
            ORDER BY views DESC 
            LIMIT 10
        ) t) as top_pages,
        (SELECT jsonb_agg(row_to_json(t)) FROM (
            SELECT referrer, COUNT(*) as views 
            FROM page_views 
            WHERE created_at::date = target_date AND referrer IS NOT NULL AND referrer != ''
            GROUP BY referrer 
            ORDER BY views DESC 
            LIMIT 10
        ) t) as top_referrers
    FROM page_views
    WHERE created_at::date = target_date
    ON CONFLICT (date) DO UPDATE SET
        total_views = EXCLUDED.total_views,
        unique_visitors = EXCLUDED.unique_visitors,
        desktop_views = EXCLUDED.desktop_views,
        mobile_views = EXCLUDED.mobile_views,
        tablet_views = EXCLUDED.tablet_views,
        avg_duration = EXCLUDED.avg_duration,
        top_pages = EXCLUDED.top_pages,
        top_referrers = EXCLUDED.top_referrers,
        updated_at = NOW();
END;
$$;

-- 6. Clean old page_views (keep last 90 days for detailed data)
-- =============================================
CREATE OR REPLACE FUNCTION cleanup_old_page_views()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM page_views WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$;
