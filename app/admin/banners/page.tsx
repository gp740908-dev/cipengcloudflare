'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus,
    Edit,
    Trash2,
    Loader2,
    X,
    Image as ImageIcon,
    ToggleLeft,
    ToggleRight,
    Eye,
    Megaphone,
    Layout,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PromotionalBanner } from '@/types'
import { format, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/ui/Toast'

const positionLabels: Record<string, string> = {
    'bottom-right': 'Kanan Bawah',
    'bottom-left': 'Kiri Bawah',
    'top-right': 'Kanan Atas',
    'top-left': 'Kiri Atas',
    'center': 'Tengah (Modal)',
    'full-width': 'Full Width',
}

const displayTypeLabels: Record<string, string> = {
    'popup': 'Popup',
    'slide-in': 'Slide In',
    'banner': 'Banner',
}

export default function AdminBannersPage() {
    const router = useRouter()
    const supabase = createClient()
    const toast = useToast()

    const [loading, setLoading] = useState(true)
    const [banners, setBanners] = useState<PromotionalBanner[]>([])
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState<PromotionalBanner | null>(null)
    const [saving, setSaving] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        image_url: '',
        cta_text: '',
        cta_link: '',
        position: 'bottom-right',
        display_type: 'popup',
        background_color: '#4A5D23',
        text_color: '#FFFFFF',
        show_on_pages: ['home'],
        delay_seconds: 3,
        show_frequency: 'once_per_session',
        priority: 0,
        valid_from: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        valid_until: '',
        is_active: true,
    })

    useEffect(() => {
        checkAuth()
        fetchBanners()
    }, [])

    async function checkAuth() {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            router.push('/admin/login')
            return
        }
    }

    async function fetchBanners() {
        try {
            const { data, error } = await supabase
                .from('promotional_banners')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setBanners(data || [])
        } catch (error) {
            console.error('Error fetching banners:', error)
        } finally {
            setLoading(false)
        }
    }

    function openAddModal() {
        setEditing(null)
        setFormData({
            title: '',
            subtitle: '',
            description: '',
            image_url: '',
            cta_text: 'Lihat Promo',
            cta_link: '/villas',
            position: 'bottom-right',
            display_type: 'popup',
            background_color: '#4A5D23',
            text_color: '#FFFFFF',
            show_on_pages: ['home'],
            delay_seconds: 3,
            show_frequency: 'once_per_session',
            priority: 0,
            valid_from: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
            valid_until: '',
            is_active: true,
        })
        setShowModal(true)
    }

    function openEditModal(banner: PromotionalBanner) {
        setEditing(banner)
        setFormData({
            title: banner.title,
            subtitle: banner.subtitle || '',
            description: banner.description || '',
            image_url: banner.image_url || '',
            cta_text: banner.cta_text || '',
            cta_link: banner.cta_link || '',
            position: banner.position,
            display_type: banner.display_type,
            background_color: banner.background_color,
            text_color: banner.text_color,
            show_on_pages: banner.show_on_pages || ['home'],
            delay_seconds: banner.delay_seconds,
            show_frequency: banner.show_frequency,
            priority: banner.priority,
            valid_from: format(parseISO(banner.valid_from), "yyyy-MM-dd'T'HH:mm"),
            valid_until: banner.valid_until ? format(parseISO(banner.valid_until), "yyyy-MM-dd'T'HH:mm") : '',
            is_active: banner.is_active,
        })
        setShowModal(true)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!formData.title.trim()) {
            toast.warning('Judul wajib diisi')
            return
        }

        setSaving(true)
        try {
            const bannerData = {
                title: formData.title,
                subtitle: formData.subtitle || null,
                description: formData.description || null,
                image_url: formData.image_url || null,
                cta_text: formData.cta_text || null,
                cta_link: formData.cta_link || null,
                position: formData.position,
                display_type: formData.display_type,
                background_color: formData.background_color,
                text_color: formData.text_color,
                show_on_pages: formData.show_on_pages,
                delay_seconds: formData.delay_seconds,
                show_frequency: formData.show_frequency,
                priority: formData.priority,
                valid_from: formData.valid_from,
                valid_until: formData.valid_until || null,
                is_active: formData.is_active,
            }

            if (editing) {
                const { error } = await supabase
                    .from('promotional_banners')
                    .update(bannerData)
                    .eq('id', editing.id)

                if (error) throw error
                toast.success('Banner berhasil diperbarui')
            } else {
                const { error } = await supabase
                    .from('promotional_banners')
                    .insert(bannerData)

                if (error) throw error
                toast.success('Banner berhasil ditambahkan')
            }

            setShowModal(false)
            fetchBanners()
        } catch (error: any) {
            console.error('Error saving banner:', error)
            toast.error('Gagal menyimpan banner', error.message)
        } finally {
            setSaving(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Yakin ingin menghapus banner ini?')) return

        try {
            const { error } = await supabase
                .from('promotional_banners')
                .delete()
                .eq('id', id)

            if (error) throw error
            toast.success('Banner berhasil dihapus')
            setBanners(banners.filter(b => b.id !== id))
        } catch (error: any) {
            console.error('Error deleting banner:', error)
            toast.error('Gagal menghapus banner', error.message)
        }
    }

    async function toggleActive(banner: PromotionalBanner) {
        try {
            const { error } = await supabase
                .from('promotional_banners')
                .update({ is_active: !banner.is_active })
                .eq('id', banner.id)

            if (error) throw error
            toast.success(banner.is_active ? 'Banner dinonaktifkan' : 'Banner diaktifkan')
            fetchBanners()
        } catch (error: any) {
            console.error('Error toggling banner:', error)
            toast.error('Gagal mengubah status', error.message)
        }
    }

    const pageOptions = ['home', 'villas', 'about', 'contact', 'blog']

    if (loading) {
        return (
            <AdminLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <Loader2 size={40} className="animate-spin text-olive-600" />
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-display text-gray-900">Promotional Banners</h1>
                            <p className="text-gray-500 text-sm">Kelola popup dan banner promosi</p>
                        </div>
                        <button
                            onClick={openAddModal}
                            className="flex items-center gap-2 px-4 py-2 bg-olive-600 text-white text-sm font-medium hover:bg-olive-700 transition-colors"
                        >
                            <Plus size={16} />
                            <span>Tambah Banner</span>
                        </button>
                    </div>

                    {/* Banners List */}
                    {banners.length === 0 ? (
                        <div className="bg-white border border-gray-100 p-12 text-center">
                            <Megaphone size={48} className="text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-500 mb-4">Belum ada banner promosi</p>
                            <button
                                onClick={openAddModal}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-olive-600 text-white text-sm hover:bg-olive-700 transition-colors"
                            >
                                <Plus size={16} />
                                <span>Buat Banner Pertama</span>
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {banners.map((banner, index) => (
                                <motion.div
                                    key={banner.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`bg-white border p-5 ${banner.is_active ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Preview */}
                                        <div
                                            className="w-16 h-16 flex items-center justify-center flex-shrink-0"
                                            style={{ backgroundColor: banner.background_color }}
                                        >
                                            {banner.image_url ? (
                                                <img
                                                    src={banner.image_url}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Layout size={24} style={{ color: banner.text_color }} />
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-medium text-gray-900">{banner.title}</h3>
                                                {banner.is_active && (
                                                    <span className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide bg-olive-100 text-olive-700">
                                                        Aktif
                                                    </span>
                                                )}
                                            </div>
                                            {banner.subtitle && (
                                                <p className="text-sm text-gray-500 mb-1">{banner.subtitle}</p>
                                            )}
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <span className="px-1.5 py-0.5 bg-gray-100">{positionLabels[banner.position]}</span>
                                                <span>•</span>
                                                <span>{displayTypeLabels[banner.display_type]}</span>
                                                <span>•</span>
                                                <span>Delay: {banner.delay_seconds}s</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => toggleActive(banner)}
                                                className={`p-2 ${banner.is_active ? 'text-olive-600' : 'text-gray-400'}`}
                                                title={banner.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                            >
                                                {banner.is_active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                            </button>
                                            <button
                                                onClick={() => openEditModal(banner)}
                                                className="p-2 text-gray-400 hover:text-blue-600"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(banner.id)}
                                                className="p-2 text-gray-400 hover:text-red-600"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                                <h2 className="font-display text-xl text-gray-900">
                                    {editing ? 'Edit Banner' : 'Tambah Banner'}
                                </h2>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                {/* Title */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                        Judul *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Holiday Special 20% OFF"
                                        className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none"
                                        required
                                    />
                                </div>

                                {/* Subtitle */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                        Subtitle
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.subtitle}
                                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                        placeholder="Berlaku hingga 31 Desember"
                                        className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                        Deskripsi
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={2}
                                        className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none resize-none"
                                    />
                                </div>

                                {/* Image URL */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                        URL Gambar
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none"
                                    />
                                </div>

                                {/* CTA */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            Teks Tombol
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.cta_text}
                                            onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                                            placeholder="Lihat Promo"
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            Link Tombol
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.cta_link}
                                            onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                                            placeholder="/villas"
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Position & Display Type */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            Posisi
                                        </label>
                                        <select
                                            value={formData.position}
                                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none"
                                        >
                                            {Object.entries(positionLabels).map(([value, label]) => (
                                                <option key={value} value={value}>{label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            Tipe Animasi
                                        </label>
                                        <select
                                            value={formData.display_type}
                                            onChange={(e) => setFormData({ ...formData, display_type: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none"
                                        >
                                            {Object.entries(displayTypeLabels).map(([value, label]) => (
                                                <option key={value} value={value}>{label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Colors */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            Warna Background
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                value={formData.background_color}
                                                onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                                                className="w-12 h-12 border border-gray-200 cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={formData.background_color}
                                                onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                                                className="flex-1 px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none font-mono text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            Warna Teks
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                value={formData.text_color}
                                                onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                                                className="w-12 h-12 border border-gray-200 cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={formData.text_color}
                                                onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                                                className="flex-1 px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none font-mono text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Show on Pages */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                        Tampilkan di Halaman
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {pageOptions.map((page) => (
                                            <label key={page} className="flex items-center gap-2 px-3 py-2 border border-gray-200 cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.show_on_pages.includes(page)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setFormData({ ...formData, show_on_pages: [...formData.show_on_pages, page] })
                                                        } else {
                                                            setFormData({ ...formData, show_on_pages: formData.show_on_pages.filter(p => p !== page) })
                                                        }
                                                    }}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm capitalize">{page}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Timing */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            Delay (detik)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.delay_seconds}
                                            onChange={(e) => setFormData({ ...formData, delay_seconds: Number(e.target.value) })}
                                            min={0}
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            Frekuensi Tampil
                                        </label>
                                        <select
                                            value={formData.show_frequency}
                                            onChange={(e) => setFormData({ ...formData, show_frequency: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none"
                                        >
                                            <option value="always">Selalu</option>
                                            <option value="once_per_session">Sekali per Sesi</option>
                                            <option value="once_per_day">Sekali per Hari</option>
                                            <option value="once_ever">Sekali Selamanya</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Validity */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            Berlaku Dari
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={formData.valid_from}
                                            onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            Berlaku Sampai (opsional)
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={formData.valid_until}
                                            onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Active */}
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor="is_active" className="text-sm text-gray-700">
                                        Aktifkan banner
                                    </label>
                                </div>

                                {/* Submit */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 hover:bg-gray-50"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 px-4 py-3 bg-olive-600 text-white hover:bg-olive-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {saving && <Loader2 size={18} className="animate-spin" />}
                                        <span>{editing ? 'Update' : 'Simpan'}</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    )
}
