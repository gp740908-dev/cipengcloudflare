import { createClient } from '@/lib/supabase/server'
import ExperienceClient from './ExperienceClient'

export default async function Experience() {
    const supabase = await createClient()

    // Fetch experiences from database
    const { data: experiences, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('is_active', true)
        .eq('featured', true)
        .order('display_order', { ascending: true })
        .limit(6)

    // Fallback experiences if database is empty
    const fallbackExperiences = [
        {
            id: '1',
            title: 'Sunrise Yoga',
            description: 'Start your day with rejuvenating yoga sessions overlooking rice terraces',
            image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800',
            category: 'wellness'
        },
        {
            id: '2',
            title: 'Balinese Spa',
            description: 'Traditional healing treatments using ancient techniques and local herbs',
            image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800',
            category: 'relaxation'
        },
        {
            id: '3',
            title: 'Rice Field Trek',
            description: 'Guided walks through emerald terraces and hidden waterfalls',
            image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800',
            category: 'adventure'
        },
        {
            id: '4',
            title: 'Cooking Class',
            description: 'Master authentic Balinese recipes with local culinary experts',
            image: 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=800',
            category: 'culture'
        },
        {
            id: '5',
            title: 'Temple Ceremony',
            description: 'Experience sacred rituals and ancient spiritual traditions',
            image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800',
            category: 'spiritual'
        },
        {
            id: '6',
            title: 'Art Workshop',
            description: 'Learn traditional Balinese painting and craft techniques',
            image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
            category: 'creative'
        },
    ]

    const experiencesToShow = experiences && experiences.length > 0 ? experiences : fallbackExperiences

    return <ExperienceClient experiences={experiencesToShow} />
}
