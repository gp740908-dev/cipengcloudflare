import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BlogPostContent from '@/components/blog/BlogPostContent'
import WhatsAppButton from '@/components/WhatsAppButton'
import BackToTop from '@/components/BackToTop'
import { Metadata } from 'next'

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const supabase = await createClient()

    const { data: post } = await supabase
        .from('blog_posts')
        .select('title, excerpt')
        .eq('slug', slug)
        .eq('published', true)
        .single()

    if (!post) {
        return { title: 'Artikel Tidak Ditemukan' }
    }

    return {
        title: `${post.title} | StayinUBUD Blog`,
        description: post.excerpt || post.title,
    }
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params
    const supabase = await createClient()

    const { data: post, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single()

    if (error || !post) {
        notFound()
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-[90px] lg:pt-[100px] pb-20 bg-cream">
                <BlogPostContent post={post} />
            </main>
            <Footer />
            <WhatsAppButton />
            <BackToTop />
        </>
    )
}
