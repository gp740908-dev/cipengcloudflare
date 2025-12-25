'use client'

import Link from 'next/link'
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react'
import { BlogPost } from '@/types'
import { format, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'
import OptimizedImage from '@/components/OptimizedImage'

interface BlogPostContentProps {
    post: BlogPost
}

export default function BlogPostContent({ post }: BlogPostContentProps) {
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    text: post.excerpt || post.title,
                    url: window.location.href,
                })
            } catch (error) {
                console.log('Error sharing:', error)
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href)
            alert('Link berhasil disalin!')
        }
    }

    // Simple markdown-like rendering
    const renderContent = (content: string) => {
        const lines = content.split('\n')
        const elements: JSX.Element[] = []
        let listItems: string[] = []
        let inList = false

        lines.forEach((line, index) => {
            // Flush current list if exiting list context
            if (inList && !line.startsWith('- ') && !line.startsWith('* ')) {
                if (listItems.length > 0) {
                    elements.push(
                        <ul key={`list-${index}`} className="list-disc list-inside space-y-2 my-4 text-gray-700">
                            {listItems.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    )
                    listItems = []
                }
                inList = false
            }

            if (line.startsWith('## ')) {
                elements.push(
                    <h2 key={index} className="text-2xl font-bold text-olive mt-8 mb-4">
                        {line.slice(3)}
                    </h2>
                )
            } else if (line.startsWith('### ')) {
                elements.push(
                    <h3 key={index} className="text-xl font-bold text-olive mt-6 mb-3">
                        {line.slice(4)}
                    </h3>
                )
            } else if (line.startsWith('- ') || line.startsWith('* ')) {
                inList = true
                listItems.push(line.slice(2))
            } else if (line.trim() === '') {
                // Empty line
            } else {
                elements.push(
                    <p key={index} className="text-gray-700 leading-relaxed my-4">
                        {line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .split(/(<strong>.*?<\/strong>)/)
                            .map((part, i) => {
                                if (part.startsWith('<strong>')) {
                                    return <strong key={i}>{part.replace(/<\/?strong>/g, '')}</strong>
                                }
                                return part
                            })}
                    </p>
                )
            }
        })

        // Flush remaining list items
        if (listItems.length > 0) {
            elements.push(
                <ul key="list-end" className="list-disc list-inside space-y-2 my-4 text-gray-700">
                    {listItems.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            )
        }

        return elements
    }

    return (
        <div className="container mx-auto px-4 max-w-4xl">
            {/* Back Link */}
            <div className="mb-8 animate-slide-left">
                <Link
                    href="/blog"
                    className="inline-flex items-center text-sage hover:text-sage-dark transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Kembali ke Blog
                </Link>
            </div>

            {/* Cover Image */}
            {post.cover_image && (
                <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8 animate-fade-up">
                    <OptimizedImage
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            {/* Header */}
            <header className="mb-8 animate-fade-up stagger-1">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-olive mb-6">
                    {post.title}
                </h1>

                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center text-gray-500 space-x-4">
                        <span className="flex items-center">
                            <Calendar size={18} className="mr-2" />
                            {format(parseISO(post.created_at), 'dd MMMM yyyy', { locale: id })}
                        </span>
                        <span className="flex items-center">
                            <User size={18} className="mr-2" />
                            {post.author}
                        </span>
                    </div>
                    <button
                        onClick={handleShare}
                        className="flex items-center text-sage hover:text-sage-dark transition-colors"
                    >
                        <Share2 size={18} className="mr-2" />
                        Bagikan
                    </button>
                </div>
            </header>

            {/* Content */}
            <article className="prose prose-lg max-w-none bg-white rounded-2xl shadow-lg p-8 md:p-12 animate-fade-up stagger-2">
                {renderContent(post.content)}
            </article>

            {/* Related Articles CTA */}
            <div className="mt-12 text-center animate-fade-up stagger-3">
                <Link
                    href="/blog"
                    className="inline-flex items-center bg-sage text-white px-6 py-3 rounded-lg hover:bg-sage-dark transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Lihat Artikel Lainnya
                </Link>
            </div>
        </div>
    )
}
