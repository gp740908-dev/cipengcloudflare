import { createClient } from '@/lib/supabase/server'
import TestimonialsClient from './TestimonialsClient'

export default async function Testimonials() {
    const supabase = await createClient()

    // Fetch featured testimonials
    const { data: testimonials, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(5)

    if (error) {
        console.error('Error fetching testimonials:', error)
    }

    // Fallback testimonials if database is empty
    const fallbackTestimonials = [
        {
            id: '1',
            quote: "An absolutely transcendent experience. The attention to detail was extraordinary, and our private villa exceeded every expectation.",
            guest_name: "Alexandra Chen",
            guest_location: "Hong Kong",
            rating: 5,
            villa_name: "Villa Lotus Dream",
            guest_image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
            featured: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: '2',
            quote: "StayinUBUD set a new standard for luxury. The concierge service was impeccable, and the villa was simply breathtaking.",
            guest_name: "James Miller",
            guest_location: "London, UK",
            rating: 5,
            villa_name: "Villa Taman Surga",
            guest_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
            featured: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: '3',
            quote: "A hidden paradise. The privacy, the views, the service—everything was curated to perfection. Already planning our return.",
            guest_name: "Sophie Laurent",
            guest_location: "Paris, France",
            rating: 5,
            villa_name: "Villa Bambu Retreat",
            guest_image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
            featured: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
    ]

    const testimonialsToShow = testimonials && testimonials.length > 0 ? testimonials : fallbackTestimonials

    return <TestimonialsClient testimonials={testimonialsToShow} />
}
