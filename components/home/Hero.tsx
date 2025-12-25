import { createClient } from '@/lib/supabase/server'
import HeroClient from './HeroClient'

export default async function Hero() {
    const supabase = await createClient()

    // First try to fetch hero slides from admin settings
    const { data: heroSlides, error: slidesError } = await supabase
        .from('hero_slides')
        .select('*, villa:villas(*)')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

    let featuredVillas: any[] = []

    if (heroSlides && heroSlides.length > 0) {
        // Use hero slides from admin settings
        featuredVillas = heroSlides
            .filter(slide => slide.villa)
            .map(slide => ({
                id: slide.villa.id,
                name: slide.villa.name,
                tagline: slide.custom_tagline || slide.villa.location || 'Ubud, Bali',
                description: slide.custom_description ||
                    (slide.villa.description?.substring(0, 150) + '...' || 'Experience luxury in the heart of Ubud.'),
                image: slide.villa.images?.[0] || `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80`,
                bedrooms: slide.villa.bedrooms,
                guests: slide.villa.max_guests,
                price: slide.villa.price_per_night,
            }))
    } else {
        // Fallback: Fetch featured villas or latest villas
        const { data: villas, error } = await supabase
            .from('villas')
            .select('id, name, description, bedrooms, max_guests, price_per_night, images, location, featured')
            .order('featured', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(4)

        if (!error && villas) {
            featuredVillas = villas.map(villa => ({
                id: villa.id,
                name: villa.name,
                tagline: villa.location || 'Ubud, Bali',
                description: villa.description?.substring(0, 150) + '...' || 'Experience luxury in the heart of Ubud.',
                image: villa.images?.[0] || `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80`,
                bedrooms: villa.bedrooms,
                guests: villa.max_guests,
                price: villa.price_per_night,
            }))
        }
    }

    // Fallback data if no villas in database
    const fallbackVillas = [
        {
            id: '1',
            name: 'Villa Taman Surga',
            tagline: 'Tropical Paradise',
            description: 'A luxurious retreat surrounded by lush tropical gardens and infinity pool overlooking the rice terraces.',
            image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
            bedrooms: 3,
            guests: 6,
            price: 4500000,
        },
        {
            id: '2',
            name: 'Villa Lotus Dream',
            tagline: 'Serene Elegance',
            description: 'Experience tranquility in this modern Balinese villa with private lotus pond and meditation pavilion.',
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80',
            bedrooms: 4,
            guests: 8,
            price: 5500000,
        },
        {
            id: '3',
            name: 'Villa Bambu Retreat',
            tagline: 'Nature Harmony',
            description: 'Eco-luxury bamboo architecture blending seamlessly with the surrounding jungle landscape.',
            image: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=1920&q=80',
            bedrooms: 2,
            guests: 4,
            price: 3800000,
        },
        {
            id: '4',
            name: 'Villa Sawah Indah',
            tagline: 'Rice Field Views',
            description: 'Wake up to stunning sunrise views over endless rice paddies in this exclusive hillside estate.',
            image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1920&q=80',
            bedrooms: 5,
            guests: 10,
            price: 6200000,
        },
    ]

    const villasToShow = featuredVillas.length > 0 ? featuredVillas : fallbackVillas

    return <HeroClient villas={villasToShow} />
}
