'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Loader2,
    FileText,
} from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { BlogPost } from '@/types'
import { format, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/ui/Toast'

export default function AdminBlogPage() {
    const router = useRouter()
    const supabase = createClient()
    const toast = useToast()

    const [loading, setLoading] = useState(true)
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [deleting, setDeleting] = useState<string | null>(null)
    const [toggling, setToggling] = useState<string | null>(null)

    useEffect(() => {
        checkAuth()
        fetchPosts()
    }, [])

    async function checkAuth() {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            router.push('/admin/login')
            return
        }
    }

    async function fetchPosts() {
        try {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setPosts(data || [])
        } catch (error) {
            console.error('Error fetching posts:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Apakah Anda yakin ingin menghapus artikel ini?')) return

        setDeleting(id)
        try {
            const { error } = await supabase
                .from('blog_posts')
                .delete()
                .eq('id', id)

            if (error) throw error
            toast.success('Artikel berhasil dihapus')
            setPosts(posts.filter(p => p.id !== id))
        } catch (error: any) {
            console.error('Error deleting post:', error)
            toast.error('Gagal menghapus artikel', error.message)
        } finally {
            setDeleting(null)
        }
    }

    async function togglePublish(id: string, currentStatus: boolean) {
        setToggling(id)
        try {
            const { error } = await supabase
                .from('blog_posts')
                .update({ published: !currentStatus })
                .eq('id', id)

            if (error) throw error
            toast.success(currentStatus ? 'Artikel di-unpublish' : 'Artikel dipublish')
            setPosts(posts.map(p =>
                p.id === id ? { ...p, published: !currentStatus } : p
            ))
        } catch (error: any) {
            console.error('Error toggling post:', error)
            toast.error('Gagal mengubah status', error.message)
        } finally {
            setToggling(null)
        }
    }

    return (
        <AdminLayout>
            {/* Main Content */}
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-display text-gray-900">Kelola Blog</h2>
                            <p className="text-gray-500 text-sm">Tulis dan kelola artikel blog</p>
                        </div>
                        <Link
                            href="/admin/blog/new"
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-olive-600 text-white text-sm font-medium hover:bg-olive-900 transition-colors"
                        >
                            <Plus size={16} />
                            <span>Tulis Artikel</span>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <Loader2 size={40} className="animate-spin text-olive-600 mx-auto" />
                            <p className="mt-4 text-gray-500 text-sm">Memuat artikel...</p>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-20 bg-white border border-gray-100">
                            <FileText size={48} className="text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 mb-4">Belum ada artikel</p>
                            <Link
                                href="/admin/blog/new"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-olive-600 text-white text-sm hover:bg-olive-900 transition-colors"
                            >
                                <Plus size={16} />
                                <span>Tulis Artikel Pertama</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {posts.map((post) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white border border-gray-100 p-5 flex items-start gap-5"
                                >
                                    {post.cover_image && (
                                        <div className="relative w-32 h-20 overflow-hidden flex-shrink-0 bg-gray-100">
                                            <Image
                                                src={post.cover_image}
                                                alt={post.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-medium text-gray-900 truncate">{post.title}</h3>
                                            <span className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${post.published
                                                ? 'bg-olive-100 text-olive-900'
                                                : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {post.published ? 'Published' : 'Draft'}
                                            </span>
                                        </div>
                                        {post.excerpt && (
                                            <p className="text-gray-500 text-sm line-clamp-1 mb-1">{post.excerpt}</p>
                                        )}
                                        <p className="text-xs text-gray-400">
                                            {format(parseISO(post.created_at), 'dd MMMM yyyy', { locale: id })} • {post.author}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <button
                                            onClick={() => togglePublish(post.id, post.published)}
                                            disabled={toggling === post.id}
                                            className={`p-2 transition-colors ${post.published
                                                ? 'hover:bg-amber-50 text-amber-600'
                                                : 'hover:bg-olive-50 text-olive-600'
                                                }`}
                                            title={post.published ? 'Sembunyikan' : 'Publikasikan'}
                                        >
                                            {toggling === post.id ? (
                                                <Loader2 size={18} className="animate-spin" />
                                            ) : post.published ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                        <Link
                                            href={`/admin/blog/${post.id}/edit`}
                                            className="p-2 hover:bg-gray-100 transition-colors text-gray-400 hover:text-blue-600"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            disabled={deleting === post.id}
                                            className="p-2 hover:bg-gray-100 transition-colors text-gray-400 hover:text-red-600 disabled:opacity-50"
                                            title="Hapus"
                                        >
                                            {deleting === post.id ? (
                                                <Loader2 size={18} className="animate-spin" />
                                            ) : (
                                                <Trash2 size={18} />
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </AdminLayout>
    )
}
