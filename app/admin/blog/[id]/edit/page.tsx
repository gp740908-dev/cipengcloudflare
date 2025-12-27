'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
    ArrowLeft,
    Save,
    Loader2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import AdminLayout from '@/components/admin/AdminLayout'

export default function EditBlogPostPage() {
    const router = useRouter()
    const params = useParams()
    const postId = params.id as string
    const supabase = createClient()
    const toast = useToast()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        cover_image: '',
        author: 'Admin',
        published: false,
    })

    useEffect(() => {
        fetchPost()
    }, [postId])

    async function fetchPost() {
        try {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('id', postId)
                .single()

            if (error) throw error

            if (data) {
                setFormData({
                    title: data.title,
                    slug: data.slug,
                    excerpt: data.excerpt || '',
                    content: data.content,
                    cover_image: data.cover_image || '',
                    author: data.author,
                    published: data.published,
                })
            }
        } catch (error: any) {
            console.error('Error fetching post:', error)
            toast.error('Artikel tidak ditemukan')
            router.push('/admin/blog')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.title || !formData.content) {
            toast.warning('Judul dan konten wajib diisi')
            return
        }

        setSaving(true)

        try {
            const { error } = await supabase
                .from('blog_posts')
                .update({
                    title: formData.title,
                    slug: formData.slug,
                    excerpt: formData.excerpt || null,
                    content: formData.content,
                    cover_image: formData.cover_image || null,
                    author: formData.author,
                    published: formData.published,
                })
                .eq('id', postId)

            if (error) throw error

            toast.success('Perubahan berhasil disimpan')
            router.push('/admin/blog')
        } catch (error: any) {
            console.error('Error updating post:', error)
            toast.error('Gagal menyimpan perubahan', error.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <AdminLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 size={40} className="animate-spin text-olive-600 mx-auto" />
                        <p className="mt-4 text-gray-500 text-sm">Memuat artikel...</p>
                    </div>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6 sm:mb-8">
                        <Link
                            href="/admin/blog"
                            className="p-2 hover:bg-gray-200 transition-colors"
                        >
                            <ArrowLeft size={24} className="text-gray-600" />
                        </Link>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-display text-gray-900">Edit Artikel</h2>
                            <p className="text-gray-500 text-sm">Perbarui konten artikel blog</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white border border-gray-100 p-4 sm:p-6 lg:p-8">
                        <div className="space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Judul Artikel *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors text-lg"
                                />
                            </div>

                            {/* Slug */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Slug (URL)
                                </label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors font-mono text-sm"
                                />
                            </div>

                            {/* Cover Image */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    URL Gambar Cover
                                </label>
                                <input
                                    type="url"
                                    value={formData.cover_image}
                                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                />
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Ringkasan
                                </label>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors resize-none"
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Konten Artikel * (Markdown didukung)
                                </label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    rows={15}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors resize-none font-mono text-sm"
                                />
                            </div>

                            {/* Author */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Penulis
                                </label>
                                <input
                                    type="text"
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                />
                            </div>

                            {/* Published */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="published"
                                    checked={formData.published}
                                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                    className="w-5 h-5 border-gray-300 text-olive-600 focus:ring-olive-600"
                                />
                                <label htmlFor="published" className="text-gray-700 font-medium">
                                    Publikasikan
                                </label>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                            <Link
                                href="/admin/blog"
                                className="px-6 py-3 border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-center"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-olive-600 text-white hover:bg-olive-900 transition-colors disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Menyimpan...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        <span>Simpan Perubahan</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </AdminLayout>
    )
}
