'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Home,
    Calendar,
    TrendingUp,
    LogOut,
    ArrowLeft,
    Save,
    Loader2,
    FileText,
    Users,
    Eye
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'

export default function NewBlogPostPage() {
    const router = useRouter()
    const supabase = createClient()
    const toast = useToast()

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        cover_image: '',
        author: 'Admin',
        published: false,
    })

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
    }

    const handleTitleChange = (title: string) => {
        setFormData({
            ...formData,
            title,
            slug: generateSlug(title),
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.title || !formData.content) {
            toast.warning('Judul dan konten wajib diisi')
            return
        }

        setLoading(true)

        try {
            const { error } = await supabase
                .from('blog_posts')
                .insert({
                    title: formData.title,
                    slug: formData.slug || generateSlug(formData.title),
                    excerpt: formData.excerpt || null,
                    content: formData.content,
                    cover_image: formData.cover_image || null,
                    author: formData.author,
                    published: formData.published,
                })

            if (error) throw error

            toast.success('Artikel berhasil dibuat')
            router.push('/admin/blog')
        } catch (error: any) {
            console.error('Error creating post:', error)
            toast.error('Gagal membuat artikel', error.message)
        } finally {
            setLoading(false)
        }
    }

    const menuItems = [
        { href: '/admin/dashboard', icon: TrendingUp, label: 'Dashboard' },
        { href: '/admin/villas', icon: Home, label: 'Kelola Villa' },
        { href: '/admin/bookings', icon: Calendar, label: 'Kelola Booking' },
        { href: '/admin/blog', icon: FileText, label: 'Kelola Blog', active: true },
        { href: '/admin/users', icon: Users, label: 'Admin Users' },
    ]

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-olive text-cream p-6 flex flex-col">
                <div className="mb-8">
                    <h1 className="font-knewave text-3xl text-sage">StayinUBUD</h1>
                    <p className="text-sm text-cream/70">Admin Panel</p>
                </div>

                <nav className="flex-1 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${item.active ? 'bg-sage text-white' : 'hover:bg-sage/20'
                                }`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <button
                    onClick={async () => {
                        await supabase.auth.signOut()
                        router.push('/admin/login')
                    }}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-red-300 hover:text-red-200 transition-colors"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center space-x-4 mb-8">
                        <Link
                            href="/admin/blog"
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={24} className="text-olive" />
                        </Link>
                        <h2 className="text-3xl font-bold text-olive">Tulis Artikel Baru</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
                        <div className="space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-olive mb-2">
                                    Judul Artikel *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    placeholder="Judul artikel yang menarik"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-sage focus:ring-2 focus:ring-sage/20 text-lg"
                                />
                            </div>

                            {/* Slug */}
                            <div>
                                <label className="block text-sm font-medium text-olive mb-2">
                                    Slug (URL)
                                </label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="judul-artikel-yang-menarik"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-sage focus:ring-2 focus:ring-sage/20 font-mono text-sm"
                                />
                            </div>

                            {/* Cover Image */}
                            <div>
                                <label className="block text-sm font-medium text-olive mb-2">
                                    URL Gambar Cover
                                </label>
                                <input
                                    type="url"
                                    value={formData.cover_image}
                                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                                    placeholder="https://images.unsplash.com/..."
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-sage focus:ring-2 focus:ring-sage/20"
                                />
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label className="block text-sm font-medium text-olive mb-2">
                                    Ringkasan
                                </label>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    placeholder="Ringkasan singkat artikel (tampil di listing)"
                                    rows={2}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-sage focus:ring-2 focus:ring-sage/20 resize-none"
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-medium text-olive mb-2">
                                    Konten Artikel * (Markdown didukung)
                                </label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="## Subjudul\n\nTulis konten artikel di sini...\n\n### Tips\n- Point 1\n- Point 2"
                                    rows={15}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-sage focus:ring-2 focus:ring-sage/20 resize-none font-mono text-sm"
                                />
                            </div>

                            {/* Author */}
                            <div>
                                <label className="block text-sm font-medium text-olive mb-2">
                                    Penulis
                                </label>
                                <input
                                    type="text"
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-sage focus:ring-2 focus:ring-sage/20"
                                />
                            </div>

                            {/* Published */}
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="published"
                                    checked={formData.published}
                                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-300 text-sage focus:ring-sage"
                                />
                                <label htmlFor="published" className="text-olive font-medium">
                                    Publikasikan sekarang
                                </label>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="mt-8 flex justify-end space-x-4">
                            <Link
                                href="/admin/blog"
                                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center space-x-2 px-6 py-3 bg-sage text-white rounded-lg hover:bg-sage-dark transition-colors disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        <span>Menyimpan...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        <span>Simpan Artikel</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}
