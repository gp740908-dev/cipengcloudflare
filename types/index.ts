export interface NearbyPlace {
    name: string
    type: 'beach' | 'temple' | 'attraction' | 'restaurant' | 'shopping' | 'landmark' | 'airport' | 'other'
    distance: string
}

export interface Villa {
    id: string
    name: string
    description: string
    bedrooms: number
    bathrooms: number
    max_guests: number
    price_per_night: number
    amenities: string[]
    images: string[]
    location: string
    latitude: number | null
    longitude: number | null
    nearby_places: NearbyPlace[]
    created_at: string
    updated_at: string
}

export interface Booking {
    id: string
    villa_id: string
    guest_name: string
    guest_email: string
    guest_phone: string | null
    check_in: string
    check_out: string
    total_guests: number
    total_price: number
    status: 'pending' | 'confirmed' | 'cancelled'
    special_requests: string | null
    created_at: string
    updated_at: string
    villa?: Villa
}

export interface AdminUser {
    id: string
    email: string
    role: 'admin' | 'super_admin'
    created_at: string
}

export interface BookingFormData {
    villa_id: string
    guest_name: string
    guest_email: string
    guest_phone?: string
    check_in: string
    check_out: string
    total_guests: number
    special_requests?: string
}

export interface VillaFilters {
    minPrice?: number
    maxPrice?: number
    minGuests?: number
    bedrooms?: number
}

export interface DateRange {
    from: Date | undefined
    to: Date | undefined
}

export interface BlogPost {
    id: string
    title: string
    slug: string
    excerpt: string | null
    content: string
    cover_image: string | null
    author: string
    published: boolean
    created_at: string
    updated_at: string
}

export interface Testimonial {
    id: string
    guest_name: string
    guest_location: string | null
    quote: string
    rating: number
    villa_name: string | null
    guest_image: string | null
    featured: boolean
    created_at: string
    updated_at: string
}

// Site Settings Types
export interface SiteSettings {
    general: {
        site_name: string
        tagline: string
    }
    contact: {
        phone: string
        email: string
        whatsapp: string
        address: string
    }
    social: {
        instagram: string
        facebook: string
        tiktok: string
        youtube: string
    }
    seo: {
        meta_title: string
        meta_description: string
        google_analytics_id: string
    }
    footer: {
        copyright: string
        show_newsletter: boolean
    }
}

export interface HeroSlide {
    id: string
    villa_id: string
    custom_tagline: string | null
    custom_description: string | null
    display_order: number
    is_active: boolean
    created_at: string
    updated_at: string
    villa?: Villa
}

export interface Experience {
    id: string
    title: string
    description: string | null
    image: string | null
    category: 'wellness' | 'adventure' | 'culture' | 'relaxation' | 'spiritual' | 'creative' | 'other'
    featured: boolean
    display_order: number
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface Media {
    id: string
    filename: string
    original_name: string
    url: string
    file_type: 'image' | 'video' | 'document'
    file_size: number | null
    folder: string
    alt_text: string | null
    uploaded_by: string | null
    created_at: string
}

export interface Promo {
    id: string
    code: string
    name: string
    description: string | null
    discount_type: 'percentage' | 'fixed'
    discount_value: number
    min_stay_nights: number
    min_booking_amount: number
    max_discount_amount: number | null
    usage_limit: number | null
    used_count: number
    valid_from: string
    valid_until: string | null
    applicable_villas: string[] | null
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface PromotionalBanner {
    id: string
    title: string
    subtitle: string | null
    description: string | null
    image_url: string | null
    cta_text: string | null
    cta_link: string | null
    position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center' | 'full-width'
    display_type: 'popup' | 'banner' | 'slide-in'
    background_color: string
    text_color: string
    show_on_pages: string[]
    delay_seconds: number
    show_frequency: 'always' | 'once_per_session' | 'once_per_day' | 'once_ever'
    priority: number
    valid_from: string
    valid_until: string | null
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface ActivityLog {
    id: string
    user_id: string | null
    user_email: string | null
    action: string
    entity_type: string | null
    entity_id: string | null
    entity_name: string | null
    details: Record<string, any> | null
    ip_address: string | null
    user_agent: string | null
    created_at: string
}

export interface EmailTemplate {
    id: string
    name: string
    subject: string
    html_content: string
    text_content: string | null
    variables: string[]
    category: 'booking' | 'notification' | 'marketing' | 'general'
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface EmailLog {
    id: string
    template_id: string | null
    template_name: string | null
    recipient_email: string
    recipient_name: string | null
    subject: string | null
    status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced'
    resend_id: string | null
    error_message: string | null
    metadata: Record<string, any> | null
    sent_at: string | null
    created_at: string
}

