import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ExperiencesPageClient from './ExperiencesPageClient'
import { createMetadata } from '@/lib/seo'

export const metadata: Metadata = createMetadata({
    title: 'Ubud Experiences - Yoga, Spa, Culture & Adventure Activities',
    description: 'Discover authentic Balinese experiences in Ubud. Enjoy yoga sessions, traditional spa treatments, rice field treks, cooking classes, temple ceremonies, and cultural workshops. Book your perfect Ubud experience today.',
    keywords: [
        'ubud experiences',
        'yoga ubud',
        'bali spa treatments',
        'ubud activities',
        'balinese cooking class',
        'rice terrace trek',
        'ubud temple ceremony',
        'wellness retreat ubud',
        'ubud cultural activities',
        'bali adventure tours',
    ],
    path: '/experiences',
})


export default async function ExperiencesPage() {
    const supabase = await createClient()

    // Fetch all active experiences
    const { data: experiences, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

    // Fallback experiences
    const fallbackExperiences = [
        {
            id: '1',
            title: 'Sunrise Yoga',
            description: 'Start your day with rejuvenating yoga sessions overlooking rice terraces. Our experienced instructors guide you through traditional Balinese yoga practices.',
            image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800',
            category: 'wellness',
            featured: true
        },
        {
            id: '2',
            title: 'Balinese Spa',
            description: 'Traditional healing treatments using ancient techniques and local herbs. Experience the art of Balinese massage and holistic wellness.',
            image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800',
            category: 'relaxation',
            featured: true
        },
        {
            id: '3',
            title: 'Rice Field Trek',
            description: 'Guided walks through emerald terraces and hidden waterfalls. Discover the beauty of Ubud\'s legendary rice paddies.',
            image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800',
            category: 'adventure',
            featured: true
        },
        {
            id: '4',
            title: 'Cooking Class',
            description: 'Master authentic Balinese recipes with local culinary experts. Learn the secrets of traditional Balinese cuisine.',
            image: 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=800',
            category: 'culture',
            featured: true
        },
        {
            id: '5',
            title: 'Temple Ceremony',
            description: 'Experience sacred rituals and ancient spiritual traditions. Witness the devotion and artistry of Balinese Hindu ceremonies.',
            image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800',
            category: 'spiritual',
            featured: false
        },
        {
            id: '6',
            title: 'Art Workshop',
            description: 'Learn traditional Balinese painting and craft techniques. Create your own masterpiece under the guidance of local artists.',
            image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
            category: 'creative',
            featured: false
        },
        {
            id: '7',
            title: 'Waterfall Adventure',
            description: 'Explore hidden waterfalls in the lush Ubud jungle. Swim in crystal clear waters surrounded by tropical paradise.',
            image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
            category: 'adventure',
            featured: false
        },
        {
            id: '8',
            title: 'Meditation Retreat',
            description: 'Find inner peace with guided meditation sessions in serene settings. Reconnect with yourself in the spiritual heart of Bali.',
            image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
            category: 'wellness',
            featured: false
        },
    ]

    const experiencesToShow = experiences && experiences.length > 0 ? experiences : fallbackExperiences

    // Get unique categories
    const categories = ['all', ...new Set(experiencesToShow.map(e => e.category))]

    return <ExperiencesPageClient experiences={experiencesToShow} categories={categories} />
}
