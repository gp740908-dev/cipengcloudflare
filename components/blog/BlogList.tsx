'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { BlogPost } from '@/types'
import { format, parseISO } from 'date-fns'
import OptimizedImage from '@/components/OptimizedImage'

export default function BlogList() {
    const supabase = createClient()
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPosts()
    }, [])

    async function fetchPosts() {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('published', true)
            .order('created_at', { ascending: false })

        if (!error && data) {
            setPosts(data)
        }
        setLoading(false)
    }

    if (loading) {
        return (
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <div className="aspect-[4/3] skeleton" />
                            <div className="h-6 skeleton w-3/4" />
                            <div className="h-4 skeleton w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            {posts.length === 0 ? (
                <div className="text-center py-24">
                    <p className="text-muted text-lg">No articles available yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {posts.map((post, index) => {
                        const staggerClass = index < 6 ? `stagger-${(index % 6) + 1}` : ''

                        return (
                            <article
                                key={post.id}
                                className={`group animate-fade-up ${staggerClass}`}
                            >
                                <Link href={`/blog/${post.slug}`} className="block">
                                    {/* Image */}
                                    <div className="aspect-[4/3] relative overflow-hidden bg-light mb-6">
                                        {post.cover_image && (
                                            <OptimizedImage
                                                src={post.cover_image}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-all duration-500" />

                                        {/* Arrow */}
                                        <div className="absolute top-4 right-4 w-10 h-10 bg-white/0 group-hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                                            <ArrowUpRight size={18} className="text-primary" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-3">
                                        <p className="text-muted text-sm">
                                            {format(parseISO(post.created_at), 'MMMM d, yyyy')}
                                        </p>
                                        <h3 className="font-display text-2xl text-primary group-hover:text-accent transition-colors leading-tight">
                                            {post.title}
                                        </h3>
                                        {post.excerpt && (
                                            <p className="text-muted line-clamp-2">
                                                {post.excerpt}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            </article>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
