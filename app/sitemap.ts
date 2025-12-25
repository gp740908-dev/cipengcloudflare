import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient()
    const baseUrl = 'https://www.stayinubud.com'

    // Fetch all villas
    const { data: villas } = await supabase
        .from('villas')
        .select('id, updated_at')
        .order('created_at', { ascending: false })

    // Fetch all blog posts
    const { data: posts } = await supabase
        .from('blog_posts')
        .select('id, updated_at')
        .eq('published', true)
        .order('created_at', { ascending: false })

    // Static pages
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1.0,
        },
        {
            url: `${baseUrl}/villas`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/experiences`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/faq`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
    ]

    // Villa detail pages
    const villaPages = (villas || []).map((villa) => ({
        url: `${baseUrl}/villas/${villa.id}`,
        lastModified: new Date(villa.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    // Blog post pages (if blog_posts table exists)
    const blogPages = (posts || []).map((post) => ({
        url: `${baseUrl}/journal/${post.id}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }))

    return [...staticPages, ...villaPages, ...blogPages]
}
