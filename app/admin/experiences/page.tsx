'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
    Plus,
    Pencil,
    Trash2,
    Loader2,
    X,
    Sparkles,
    Star,
    GripVertical,
    Eye,
    EyeOff
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/admin/AdminLayout'
import { Experience } from '@/types'
import { useToast } from '@/components/ui/Toast'

const categories = [
    { value: 'wellness', label: 'Wellness' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'culture', label: 'Culture' },
    { value: 'relaxation', label: 'Relaxation' },
    { value: 'spiritual', label: 'Spiritual' },
    { value: 'creative', label: 'Creative' },
    { value: 'other', label: 'Other' },
]

const defaultExperience: Partial<Experience> = {
    title: '',
    description: '',
    image: '',
    category: 'other',
    featured: false,
    display_order: 0,
    is_active: true
}

export default function ExperiencesPage() {
    const router = useRouter()
    const supabase = createClient()
    const toast = useToast()

    const [loading, setLoading] = useState(true)
    const [experiences, setExperiences] = useState<Experience[]>([])
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState<Partial<Experience>>(defaultExperience)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState<string | null>(null)

    useEffect(() => {
        checkAuth()
        fetchExperiences()
    }, [])

    async function checkAuth() {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            router.push('/admin/login')
        }
    }

    async function fetchExperiences() {
        try {
            const { data, error } = await supabase
                .from('experiences')
                .select('*')
                .order('display_order', { ascending: true })

            if (error) throw error
            setExperiences(data || [])
        } catch (error) {
            console.error('Error fetching experiences:', error)
        } finally {
            setLoading(false)
        }
    }

    function openModal(experience?: Experience) {
        if (experience) {
            setEditingId(experience.id)
            setFormData(experience)
        } else {
            setEditingId(null)
            setFormData({ ...defaultExperience, display_order: experiences.length })
        }
        setShowModal(true)
    }

    async function handleSave() {
        if (!formData.title) {
            toast.warning('Title wajib diisi')
            return
        }

        setSaving(true)
        try {
            if (editingId) {
                // Update
                const { error } = await supabase
                    .from('experiences')
                    .update({
                        ...formData,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', editingId)

                if (error) throw error
                toast.success('Experience berhasil diperbarui')
            } else {
                // Create
                const { error } = await supabase
                    .from('experiences')
                    .insert([formData])

                if (error) throw error
                toast.success('Experience berhasil ditambahkan')
            }

            setShowModal(false)
            fetchExperiences()
        } catch (error: any) {
            console.error('Error saving experience:', error)
            toast.error('Gagal menyimpan experience', error.message)
        } finally {
            setSaving(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Yakin ingin menghapus experience ini?')) return

        setDeleting(id)
        try {
            const { error } = await supabase
                .from('experiences')
                .delete()
                .eq('id', id)

            if (error) throw error
            toast.success('Experience berhasil dihapus')
            fetchExperiences()
        } catch (error: any) {
            console.error('Error deleting experience:', error)
            toast.error('Gagal menghapus experience', error.message)
        } finally {
            setDeleting(null)
        }
    }

    async function toggleActive(id: string, currentStatus: boolean) {
        try {
            const { error } = await supabase
                .from('experiences')
                .update({ is_active: !currentStatus })
                .eq('id', id)

            if (error) throw error
            fetchExperiences()
        } catch (error) {
            console.error('Error toggling status:', error)
        }
    }

    async function toggleFeatured(id: string, currentStatus: boolean) {
        try {
            const { error } = await supabase
                .from('experiences')
                .update({ featured: !currentStatus })
                .eq('id', id)

            if (error) throw error
            fetchExperiences()
        } catch (error) {
            console.error('Error toggling featured:', error)
        }
    }

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
                            <h1 className="text-2xl font-display text-gray-900">Experiences</h1>
                            <p className="text-gray-500 text-sm">Kelola pengalaman/aktivitas yang ditawarkan</p>
                        </div>
                        <button
                            onClick={() => openModal()}
                            className="flex items-center gap-2 px-6 py-3 bg-olive-600 text-white hover:bg-olive-900 transition-colors"
                        >
                            <Plus size={18} />
                            <span>Tambah Experience</span>
                        </button>
                    </div>

                    {/* Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {experiences.map((exp) => (
                            <div
                                key={exp.id}
                                className={`bg-white border border-gray-100 overflow-hidden group ${!exp.is_active ? 'opacity-60' : ''}`}
                            >
                                {/* Image */}
                                <div className="relative aspect-[4/3]">
                                    {exp.image ? (
                                        <Image
                                            src={exp.image}
                                            alt={exp.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                            <Sparkles size={40} className="text-gray-300" />
                                        </div>
                                    )}

                                    {/* Badges */}
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        <span className="px-2 py-1 bg-white/90 text-xs capitalize">{exp.category}</span>
                                        {exp.featured && (
                                            <span className="px-2 py-1 bg-olive-600 text-white text-xs flex items-center gap-1">
                                                <Star size={10} /> Featured
                                            </span>
                                        )}
                                    </div>

                                    {/* Actions overlay */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => openModal(exp)}
                                            className="p-3 bg-white text-gray-900 hover:bg-olive-600 hover:text-white transition-colors"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => toggleActive(exp.id, exp.is_active)}
                                            className="p-3 bg-white text-gray-900 hover:bg-olive-600 hover:text-white transition-colors"
                                        >
                                            {exp.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(exp.id)}
                                            disabled={deleting === exp.id}
                                            className="p-3 bg-white text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                                        >
                                            {deleting === exp.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-display text-lg text-gray-900">{exp.title}</h3>
                                            <p className="text-gray-500 text-sm line-clamp-2 mt-1">{exp.description}</p>
                                        </div>
                                        <button
                                            onClick={() => toggleFeatured(exp.id, exp.featured)}
                                            className={`p-2 ${exp.featured ? 'text-olive-600' : 'text-gray-300 hover:text-gray-500'}`}
                                        >
                                            <Star size={18} fill={exp.featured ? 'currentColor' : 'none'} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {experiences.length === 0 && (
                        <div className="text-center py-12 bg-white border border-gray-100">
                            <Sparkles size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">Belum ada experience</p>
                            <button
                                onClick={() => openModal()}
                                className="mt-4 text-olive-600 hover:underline"
                            >
                                Tambah Experience Pertama
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
                            <h2 className="font-display text-xl">
                                {editingId ? 'Edit Experience' : 'Tambah Experience'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title || ''}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none"
                                    placeholder="e.g. Sunrise Yoga"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description || ''}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none resize-none"
                                    placeholder="Deskripsi singkat..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Image URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.image || ''}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none"
                                    placeholder="https://..."
                                />
                                {formData.image && (
                                    <div className="mt-2 relative aspect-video w-full max-w-xs">
                                        <Image
                                            src={formData.image}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Category
                                </label>
                                <select
                                    value={formData.category || 'other'}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Experience['category'] })}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.featured || false}
                                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                        className="w-5 h-5 accent-olive-600"
                                    />
                                    <span className="text-gray-700">Featured</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active ?? true}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-5 h-5 accent-olive-600"
                                    />
                                    <span className="text-gray-700">Active</span>
                                </label>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 px-4 py-3 bg-olive-600 text-white hover:bg-olive-900 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {saving && <Loader2 size={18} className="animate-spin" />}
                                <span>Simpan</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}
