-- =============================================
-- STAYINUBUD ADMIN EXTENDED FEATURES
-- Run this in Supabase SQL Editor
-- =============================================

-- =============================================
-- 1. PROMO/DISCOUNT CODES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS promos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(12, 2) NOT NULL,
    min_stay_nights INTEGER DEFAULT 1,
    min_booking_amount DECIMAL(15, 2) DEFAULT 0,
    max_discount_amount DECIMAL(15, 2),  -- Cap for percentage discounts
    usage_limit INTEGER,  -- NULL = unlimited
    used_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    applicable_villas UUID[],  -- NULL = all villas
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for promo lookup
CREATE INDEX IF NOT EXISTS idx_promos_code ON promos(code);
CREATE INDEX IF NOT EXISTS idx_promos_active ON promos(is_active, valid_from, valid_until);

-- =============================================
-- 2. PROMOTIONAL BANNERS/ADS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS promotional_banners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    description TEXT,
    image_url TEXT,
    cta_text VARCHAR(100),
    cta_link VARCHAR(500),
    position VARCHAR(50) DEFAULT 'bottom-right' CHECK (position IN ('bottom-right', 'bottom-left', 'top-right', 'top-left', 'center', 'full-width')),
    display_type VARCHAR(50) DEFAULT 'popup' CHECK (display_type IN ('popup', 'banner', 'slide-in')),
    background_color VARCHAR(20) DEFAULT '#4A5D23',
    text_color VARCHAR(20) DEFAULT '#FFFFFF',
    show_on_pages TEXT[] DEFAULT ARRAY['home'],  -- Which pages to show
    delay_seconds INTEGER DEFAULT 3,  -- Delay before showing
    show_frequency VARCHAR(50) DEFAULT 'once_per_session' CHECK (show_frequency IN ('always', 'once_per_session', 'once_per_day', 'once_ever')),
    priority INTEGER DEFAULT 0,  -- Higher = shows first
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. ACTIVITY LOGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    user_email VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),  -- 'villa', 'booking', 'blog', etc.
    entity_id UUID,
    entity_name VARCHAR(255),
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for activity log queries
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_email);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at DESC);

-- =============================================
-- 4. EMAIL TEMPLATES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    subject VARCHAR(500) NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT,
    variables TEXT[],  -- Available variables like {{guest_name}}, {{booking_id}}
    category VARCHAR(50) DEFAULT 'general' CHECK (category IN ('booking', 'notification', 'marketing', 'general')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 5. EMAIL LOGS TABLE (for tracking sent emails)
-- =============================================
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    template_id UUID REFERENCES email_templates(id),
    template_name VARCHAR(100),
    recipient_email VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(255),
    subject VARCHAR(500),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
    resend_id VARCHAR(255),  -- ID from Resend
    error_message TEXT,
    metadata JSONB,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created ON email_logs(created_at DESC);

-- =============================================
-- RLS POLICIES
-- =============================================

-- Enable RLS
ALTER TABLE promos ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotional_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Promos: Anyone can read active promos (for validation), admin can manage
DROP POLICY IF EXISTS "Public can read active promos" ON promos;
CREATE POLICY "Public can read active promos" ON promos
    FOR SELECT USING (is_active = true AND valid_from <= NOW() AND (valid_until IS NULL OR valid_until >= NOW()));

DROP POLICY IF EXISTS "Admin full access to promos" ON promos;
CREATE POLICY "Admin full access to promos" ON promos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    );

-- Promotional Banners: Anyone can read active banners, admin can manage
DROP POLICY IF EXISTS "Public can read active banners" ON promotional_banners;
CREATE POLICY "Public can read active banners" ON promotional_banners
    FOR SELECT USING (is_active = true AND valid_from <= NOW() AND (valid_until IS NULL OR valid_until >= NOW()));

DROP POLICY IF EXISTS "Admin full access to banners" ON promotional_banners;
CREATE POLICY "Admin full access to banners" ON promotional_banners
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    );

-- Activity Logs: Only admin can read/write
DROP POLICY IF EXISTS "Admin full access to activity_logs" ON activity_logs;
CREATE POLICY "Admin full access to activity_logs" ON activity_logs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    );

-- Email Templates: Only admin can read/write
DROP POLICY IF EXISTS "Admin full access to email_templates" ON email_templates;
CREATE POLICY "Admin full access to email_templates" ON email_templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    );

-- Email Logs: Only admin can read/write
DROP POLICY IF EXISTS "Admin full access to email_logs" ON email_logs;
CREATE POLICY "Admin full access to email_logs" ON email_logs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    );

-- =============================================
-- INSERT DEFAULT EMAIL TEMPLATES
-- =============================================
INSERT INTO email_templates (name, subject, html_content, text_content, variables, category) VALUES 
(
    'booking_confirmation',
    'Booking Confirmed - {{villa_name}} | StayinUBUD',
    '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Georgia, serif; color: #1a1a1a; background: #f5f3ef; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: #4A5D23; padding: 40px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; font-weight: normal; }
        .content { padding: 40px; }
        .booking-details { background: #f8f7f4; padding: 24px; margin: 24px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e5e5; }
        .detail-label { color: #666; }
        .detail-value { font-weight: 600; color: #1a1a1a; }
        .footer { background: #f5f3ef; padding: 30px; text-align: center; color: #666; font-size: 14px; }
        .btn { display: inline-block; padding: 16px 32px; background: #4A5D23; color: white; text-decoration: none; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Booking Confirmed</h1>
        </div>
        <div class="content">
            <p>Dear {{guest_name}},</p>
            <p>Thank you for choosing StayinUBUD. Your booking has been confirmed!</p>
            
            <div class="booking-details">
                <h3 style="margin-top:0;">Booking Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Booking ID</span>
                    <span class="detail-value">{{booking_id}}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Villa</span>
                    <span class="detail-value">{{villa_name}}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Check-in</span>
                    <span class="detail-value">{{check_in}}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Check-out</span>
                    <span class="detail-value">{{check_out}}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Guests</span>
                    <span class="detail-value">{{guests}} guests</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Total</span>
                    <span class="detail-value">{{total_price}}</span>
                </div>
            </div>
            
            <p>If you have any questions, please don''t hesitate to contact us.</p>
            
            <a href="{{booking_url}}" class="btn">View Booking Details</a>
        </div>
        <div class="footer">
            <p>StayinUBUD - Luxury Villa Rentals in Ubud, Bali</p>
            <p>© 2024 StayinUBUD. All rights reserved.</p>
        </div>
    </div>
</body>
</html>',
    'Dear {{guest_name}},

Thank you for choosing StayinUBUD. Your booking has been confirmed!

Booking Details:
- Booking ID: {{booking_id}}
- Villa: {{villa_name}}
- Check-in: {{check_in}}
- Check-out: {{check_out}}
- Guests: {{guests}}
- Total: {{total_price}}

If you have any questions, please contact us.

Best regards,
StayinUBUD Team',
    ARRAY['guest_name', 'booking_id', 'villa_name', 'check_in', 'check_out', 'guests', 'total_price', 'booking_url'],
    'booking'
),
(
    'booking_cancelled',
    'Booking Cancelled - {{booking_id}} | StayinUBUD',
    '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Georgia, serif; color: #1a1a1a; background: #f5f3ef; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: #991b1b; padding: 40px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; font-weight: normal; }
        .content { padding: 40px; }
        .footer { background: #f5f3ef; padding: 30px; text-align: center; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Booking Cancelled</h1>
        </div>
        <div class="content">
            <p>Dear {{guest_name}},</p>
            <p>Your booking (ID: {{booking_id}}) for {{villa_name}} has been cancelled.</p>
            <p>If you did not request this cancellation or have any questions, please contact us immediately.</p>
            <p>We hope to welcome you to StayinUBUD in the future.</p>
        </div>
        <div class="footer">
            <p>StayinUBUD - Luxury Villa Rentals in Ubud, Bali</p>
        </div>
    </div>
</body>
</html>',
    'Dear {{guest_name}},

Your booking (ID: {{booking_id}}) for {{villa_name}} has been cancelled.

If you did not request this cancellation, please contact us immediately.

Best regards,
StayinUBUD Team',
    ARRAY['guest_name', 'booking_id', 'villa_name'],
    'booking'
),
(
    'welcome_newsletter',
    'Welcome to StayinUBUD Newsletter',
    '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Georgia, serif; color: #1a1a1a; background: #f5f3ef; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: #4A5D23; padding: 40px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; font-weight: normal; }
        .content { padding: 40px; }
        .footer { background: #f5f3ef; padding: 30px; text-align: center; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to StayinUBUD</h1>
        </div>
        <div class="content">
            <p>Dear {{subscriber_name}},</p>
            <p>Thank you for subscribing to our newsletter! You''ll be the first to know about:</p>
            <ul>
                <li>Exclusive villa collections</li>
                <li>Special promotions and discounts</li>
                <li>Bali travel tips and experiences</li>
                <li>New additions to our portfolio</li>
            </ul>
            <p>We look forward to sharing the beauty of Ubud with you.</p>
        </div>
        <div class="footer">
            <p>StayinUBUD - Luxury Villa Rentals in Ubud, Bali</p>
        </div>
    </div>
</body>
</html>',
    'Welcome to StayinUBUD Newsletter!

Thank you for subscribing. You''ll receive exclusive updates about our villas and special offers.

Best regards,
StayinUBUD Team',
    ARRAY['subscriber_name', 'subscriber_email'],
    'marketing'
)
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- FUNCTION TO LOG ACTIVITY
-- =============================================
CREATE OR REPLACE FUNCTION log_activity(
    p_user_email VARCHAR(255),
    p_action VARCHAR(100),
    p_entity_type VARCHAR(100) DEFAULT NULL,
    p_entity_id UUID DEFAULT NULL,
    p_entity_name VARCHAR(255) DEFAULT NULL,
    p_details JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO activity_logs (user_email, action, entity_type, entity_id, entity_name, details)
    VALUES (p_user_email, p_action, p_entity_type, p_entity_id, p_entity_name, p_details)
    RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FUNCTION TO VALIDATE PROMO CODE
-- =============================================
CREATE OR REPLACE FUNCTION validate_promo_code(
    p_code VARCHAR(50),
    p_villa_id UUID DEFAULT NULL,
    p_booking_amount DECIMAL(15, 2) DEFAULT 0,
    p_stay_nights INTEGER DEFAULT 1
) RETURNS TABLE (
    valid BOOLEAN,
    promo_id UUID,
    discount_type VARCHAR(20),
    discount_value DECIMAL(12, 2),
    max_discount DECIMAL(15, 2),
    message TEXT
) AS $$
DECLARE
    v_promo RECORD;
BEGIN
    SELECT * INTO v_promo
    FROM promos
    WHERE UPPER(code) = UPPER(p_code)
    AND is_active = true
    AND valid_from <= NOW()
    AND (valid_until IS NULL OR valid_until >= NOW());
    
    IF v_promo IS NULL THEN
        RETURN QUERY SELECT false, NULL::UUID, NULL::VARCHAR(20), NULL::DECIMAL(12,2), NULL::DECIMAL(15,2), 'Invalid or expired promo code'::TEXT;
        RETURN;
    END IF;
    
    -- Check usage limit
    IF v_promo.usage_limit IS NOT NULL AND v_promo.used_count >= v_promo.usage_limit THEN
        RETURN QUERY SELECT false, NULL::UUID, NULL::VARCHAR(20), NULL::DECIMAL(12,2), NULL::DECIMAL(15,2), 'Promo code usage limit reached'::TEXT;
        RETURN;
    END IF;
    
    -- Check minimum stay nights
    IF p_stay_nights < v_promo.min_stay_nights THEN
        RETURN QUERY SELECT false, NULL::UUID, NULL::VARCHAR(20), NULL::DECIMAL(12,2), NULL::DECIMAL(15,2), 
            ('Minimum stay of ' || v_promo.min_stay_nights || ' nights required')::TEXT;
        RETURN;
    END IF;
    
    -- Check minimum booking amount
    IF p_booking_amount < v_promo.min_booking_amount THEN
        RETURN QUERY SELECT false, NULL::UUID, NULL::VARCHAR(20), NULL::DECIMAL(12,2), NULL::DECIMAL(15,2), 
            ('Minimum booking amount of Rp ' || v_promo.min_booking_amount || ' required')::TEXT;
        RETURN;
    END IF;
    
    -- Check applicable villas
    IF v_promo.applicable_villas IS NOT NULL AND p_villa_id IS NOT NULL THEN
        IF NOT (p_villa_id = ANY(v_promo.applicable_villas)) THEN
            RETURN QUERY SELECT false, NULL::UUID, NULL::VARCHAR(20), NULL::DECIMAL(12,2), NULL::DECIMAL(15,2), 
                'This promo code is not valid for the selected villa'::TEXT;
            RETURN;
        END IF;
    END IF;
    
    -- Valid promo
    RETURN QUERY SELECT true, v_promo.id, v_promo.discount_type, v_promo.discount_value, v_promo.max_discount_amount, 
        ('Promo applied: ' || v_promo.name)::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
