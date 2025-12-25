'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    Plus,
    Edit,
    Trash2,
    Star,
    Loader2,
    MessageSquare,
    X,
} from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Testimonial } from '@/types'
import { format, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/ui/Toast'

export default function AdminTestimonialsPage() {
    const router = useRouter()
    const supabase = createClient()
    const toast = useToast()

    const [loading, setLoading] = useState(true)
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [deleting, setDeleting] = useState<string | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState<Testimonial | null>(null)
    const [saving, setSaving] = useState(false)

    const [formData, setFormData] = useState({
        guest_name: '',
        guest_location: '',
        quote: '',
        rating: 5,
        villa_name: '',
        guest_image: '',
        featured: false,
    })

    useEffect(() => {
        checkAuth()
        fetchTestimonials()
    }, [])

    async function checkAuth() {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            router.push('/admin/login')
            return
        }
    }

    async function fetchTestimonials() {
        try {
            const { data, error } = await supabase
                .from('testimonials')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setTestimonials(data || [])
        } catch (error) {
            console.error('Error fetching testimonials:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Apakah Anda yakin ingin menghapus testimonial ini?')) return

        setDeleting(id)
        try {
            const { error } = await supabase
                .from('testimonials')
                .delete()
                .eq('id', id)

            if (error) throw error
            toast.success('Testimonial berhasil dihapus')
            setTestimonials(testimonials.filter(t => t.id !== id))
        } catch (error: any) {
            console.error('Error deleting testimonial:', error)
            toast.error('Gagal menghapus testimonial', error.message)
        } finally {
            setDeleting(null)
        }
    }

    function openAddModal() {
        setEditing(null)
        setFormData({
            guest_name: '',
            guest_location: '',
            quote: '',
            rating: 5,
            villa_name: '',
            guest_image: '',
            featured: false,
        })
        setShowModal(true)
    }

    function openEditModal(testimonial: Testimonial) {
        setEditing(testimonial)
        setFormData({
            guest_name: testimonial.guest_name,
            guest_location: testimonial.guest_location || '',
            quote: testimonial.quote,
            rating: testimonial.rating,
            villa_name: testimonial.villa_name || '',
            guest_image: testimonial.guest_image || '',
            featured: testimonial.featured,
        })
        setShowModal(true)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)

        try {
            if (editing) {
                const { error } = await supabase
                    .from('testimonials')
                    .update({
                        guest_name: formData.guest_name,
                        guest_location: formData.guest_location || null,
                        quote: formData.quote,
                        rating: formData.rating,
                        villa_name: formData.villa_name || null,
                        guest_image: formData.guest_image || null,
                        featured: formData.featured,
                    })
                    .eq('id', editing.id)

                if (error) throw error
                toast.success('Testimonial berhasil diperbarui')
            } else {
                const { error } = await supabase
                    .from('testimonials')
                    .insert({
                        guest_name: formData.guest_name,
                        guest_location: formData.guest_location || null,
                        quote: formData.quote,
                        rating: formData.rating,
                        villa_name: formData.villa_name || null,
                        guest_image: formData.guest_image || null,
                        featured: formData.featured,
                    })

                if (error) throw error
                toast.success('Testimonial berhasil ditambahkan')
            }

            setShowModal(false)
            fetchTestimonials()
        } catch (error: any) {
            console.error('Error saving testimonial:', error)
            toast.error('Gagal menyimpan testimonial', error.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <AdminLayout>
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-display text-gray-900">Testimonials</h2>
                            <p className="text-gray-500 text-sm">Kelola testimonial dari tamu</p>
                        </div>
                        <button
                            onClick={openAddModal}
                            className="flex items-center gap-2 px-4 py-2 bg-olive-600 text-white text-sm font-medium hover:bg-olive-900 transition-colors"
                        >
                            <Plus size={16} />
                            <span>Tambah Testimonial</span>
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <Loader2 size={40} className="animate-spin text-olive-600 mx-auto" />
                            <p className="mt-4 text-gray-500 text-sm">Memuat testimonials...</p>
                        </div>
                    ) : testimonials.length === 0 ? (
                        <div className="text-center py-20 bg-white border border-gray-100">
                            <MessageSquare size={48} className="text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 mb-4">Belum ada testimonial</p>
                            <button
                                onClick={openAddModal}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-olive-600 text-white text-sm hover:bg-olive-900 transition-colors"
                            >
                                <Plus size={16} />
                                <span>Tambah Testimonial Pertama</span>
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {testimonials.map((testimonial) => (
                                <motion.div
                                    key={testimonial.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white border border-gray-100 p-5 flex items-start gap-5"
                                >
                                    {/* Avatar */}
                                    <div className="relative w-14 h-14 overflow-hidden flex-shrink-0 bg-gray-100 rounded-full">
                                        {testimonial.guest_image ? (
                                            <Image
                                                src={testimonial.guest_image}
                                                alt={testimonial.guest_name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl font-medium">
                                                {testimonial.guest_name.charAt(0)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-medium text-gray-900">{testimonial.guest_name}</h3>
                                            {testimonial.featured && (
                                                <span className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide bg-olive-100 text-olive-900">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400 mb-2">
                                            {testimonial.guest_location && `${testimonial.guest_location} • `}
                                            {testimonial.villa_name && `${testimonial.villa_name} • `}
                                            <span className="inline-flex items-center gap-0.5">
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <Star key={i} size={10} className="text-olive-400 fill-olive-400" />
                                                ))}
                                            </span>
                                        </p>
                                        <p className="text-gray-600 text-sm line-clamp-2">"{testimonial.quote}"</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <button
                                            onClick={() => openEditModal(testimonial)}
                                            className="p-2 hover:bg-gray-100 transition-colors text-gray-400 hover:text-blue-600"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(testimonial.id)}
                                            disabled={deleting === testimonial.id}
                                            className="p-2 hover:bg-gray-100 transition-colors text-gray-400 hover:text-red-600 disabled:opacity-50"
                                            title="Hapus"
                                        >
                                            {deleting === testimonial.id ? (
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

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-display text-gray-900">
                                {editing ? 'Edit Testimonial' : 'Tambah Testimonial'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Nama Tamu *
                                </label>
                                <input
                                    type="text"
                                    value={formData.guest_name}
                                    onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Lokasi
                                </label>
                                <input
                                    type="text"
                                    value={formData.guest_location}
                                    onChange={(e) => setFormData({ ...formData, guest_location: e.target.value })}
                                    placeholder="e.g. Hong Kong"
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Quote *
                                </label>
                                <textarea
                                    value={formData.quote}
                                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                        Rating
                                    </label>
                                    <select
                                        value={formData.rating}
                                        onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                                        className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                    >
                                        {[5, 4, 3, 2, 1].map(r => (
                                            <option key={r} value={r}>{r} Bintang</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                        Nama Villa
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.villa_name}
                                        onChange={(e) => setFormData({ ...formData, villa_name: e.target.value })}
                                        placeholder="e.g. Villa Lotus Dream"
                                        className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    URL Foto Tamu
                                </label>
                                <input
                                    type="url"
                                    value={formData.guest_image}
                                    onChange={(e) => setFormData({ ...formData, guest_image: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    className="w-4 h-4 text-olive-600 border-gray-300 focus:ring-olive-500"
                                />
                                <label htmlFor="featured" className="text-sm text-gray-700">
                                    Tampilkan di homepage (Featured)
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-olive-600 text-white hover:bg-olive-900 disabled:opacity-50 transition-colors"
                                >
                                    {saving && <Loader2 size={16} className="animate-spin" />}
                                    <span>{editing ? 'Update' : 'Simpan'}</span>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AdminLayout>
    )
}
