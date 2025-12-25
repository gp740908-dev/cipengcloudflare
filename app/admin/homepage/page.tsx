'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
    Plus,
    Trash2,
    Loader2,
    X,
    GripVertical,
    Eye,
    EyeOff,
    Save,
    Home,
    Star,
    ArrowUp,
    ArrowDown
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/admin/AdminLayout'
import { Villa, HeroSlide } from '@/types'
import { useToast } from '@/components/ui/Toast'

export default function HomepagePage() {
    const router = useRouter()
    const supabase = createClient()
    const toast = useToast()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [villas, setVillas] = useState<Villa[]>([])
    const [heroSlides, setHeroSlides] = useState<(HeroSlide & { villa?: Villa })[]>([])
    const [featuredVillas, setFeaturedVillas] = useState<string[]>([])
    const [showAddModal, setShowAddModal] = useState(false)
    const [selectedVillaId, setSelectedVillaId] = useState('')
    const [customTagline, setCustomTagline] = useState('')
    const [customDescription, setCustomDescription] = useState('')

    useEffect(() => {
        checkAuth()
        fetchData()
    }, [])

    async function checkAuth() {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            router.push('/admin/login')
        }
    }

    async function fetchData() {
        try {
            // Fetch villas
            const { data: villasData } = await supabase
                .from('villas')
                .select('*')
                .order('name')

            // Fetch hero slides with villa data
            const { data: slidesData } = await supabase
                .from('hero_slides')
                .select('*, villa:villas(*)')
                .order('display_order')

            setVillas(villasData || [])
            setHeroSlides(slidesData || [])

            // Extract featured villas
            const featured = (villasData || []).filter(v => v.featured).map(v => v.id)
            setFeaturedVillas(featured)

        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    async function addHeroSlide() {
        if (!selectedVillaId) {
            toast.warning('Pilih villa terlebih dahulu')
            return
        }

        setSaving(true)
        try {
            const { error } = await supabase
                .from('hero_slides')
                .insert([{
                    villa_id: selectedVillaId,
                    custom_tagline: customTagline || null,
                    custom_description: customDescription || null,
                    display_order: heroSlides.length,
                    is_active: true
                }])

            if (error) throw error

            toast.success('Slide berhasil ditambahkan')
            setShowAddModal(false)
            setSelectedVillaId('')
            setCustomTagline('')
            setCustomDescription('')
            fetchData()
        } catch (error: any) {
            console.error('Error adding slide:', error)
            toast.error('Gagal menambah slide', error.message)
        } finally {
            setSaving(false)
        }
    }

    async function removeHeroSlide(id: string) {
        if (!confirm('Yakin ingin menghapus slide ini?')) return

        try {
            const { error } = await supabase
                .from('hero_slides')
                .delete()
                .eq('id', id)

            if (error) throw error
            toast.success('Slide berhasil dihapus')
            fetchData()
        } catch (error: any) {
            console.error('Error removing slide:', error)
            toast.error('Gagal menghapus slide', error.message)
        }
    }

    async function toggleSlideActive(id: string, currentStatus: boolean) {
        try {
            const { error } = await supabase
                .from('hero_slides')
                .update({ is_active: !currentStatus })
                .eq('id', id)

            if (error) throw error
            fetchData()
        } catch (error) {
            console.error('Error toggling slide:', error)
        }
    }

    async function moveSlide(id: string, direction: 'up' | 'down') {
        const index = heroSlides.findIndex(s => s.id === id)
        if (index === -1) return
        if (direction === 'up' && index === 0) return
        if (direction === 'down' && index === heroSlides.length - 1) return

        const newSlides = [...heroSlides]
        const swapIndex = direction === 'up' ? index - 1 : index + 1

        // Swap orders
        const temp = newSlides[index].display_order
        newSlides[index].display_order = newSlides[swapIndex].display_order
        newSlides[swapIndex].display_order = temp

        try {
            await supabase
                .from('hero_slides')
                .update({ display_order: newSlides[index].display_order })
                .eq('id', newSlides[index].id)

            await supabase
                .from('hero_slides')
                .update({ display_order: newSlides[swapIndex].display_order })
                .eq('id', newSlides[swapIndex].id)

            fetchData()
        } catch (error) {
            console.error('Error reordering:', error)
        }
    }

    async function toggleFeaturedVilla(villaId: string) {
        const isFeatured = featuredVillas.includes(villaId)

        try {
            const { error } = await supabase
                .from('villas')
                .update({ featured: !isFeatured })
                .eq('id', villaId)

            if (error) throw error

            if (isFeatured) {
                setFeaturedVillas(featuredVillas.filter(id => id !== villaId))
            } else {
                setFeaturedVillas([...featuredVillas, villaId])
            }
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

    // Villas not in hero
    const availableVillas = villas.filter(v => !heroSlides.some(s => s.villa_id === v.id))

    return (
        <AdminLayout>
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-xl sm:text-2xl font-display text-gray-900">Homepage Settings</h1>
                        <p className="text-gray-500 text-sm">Kelola hero slides dan featured villas</p>
                    </div>

                    {/* Hero Slides Section */}
                    <div className="bg-white border border-gray-100 p-6 mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="font-display text-lg text-gray-900">Hero Slides</h2>
                                <p className="text-gray-500 text-sm">Slide yang tampil di hero section homepage</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(true)}
                                disabled={availableVillas.length === 0}
                                className="flex items-center gap-2 px-4 py-2 bg-olive-600 text-white hover:bg-olive-900 transition-colors disabled:opacity-50"
                            >
                                <Plus size={16} />
                                <span>Tambah Slide</span>
                            </button>
                        </div>

                        {heroSlides.length > 0 ? (
                            <div className="space-y-3">
                                {heroSlides.map((slide, index) => (
                                    <div
                                        key={slide.id}
                                        className={`flex items-center gap-4 p-4 border ${slide.is_active ? 'border-gray-200' : 'border-gray-100 opacity-50'}`}
                                    >
                                        {/* Thumbnail */}
                                        <div className="relative w-24 h-16 flex-shrink-0">
                                            {slide.villa?.images?.[0] ? (
                                                <Image
                                                    src={slide.villa.images[0]}
                                                    alt={slide.villa.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                    <Home size={20} className="text-gray-300" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-gray-900 truncate">
                                                {slide.villa?.name || 'Villa tidak ditemukan'}
                                            </h3>
                                            <p className="text-sm text-gray-500 truncate">
                                                {slide.custom_tagline || slide.villa?.location || 'No tagline'}
                                            </p>
                                        </div>

                                        {/* Order */}
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => moveSlide(slide.id, 'up')}
                                                disabled={index === 0}
                                                className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                            >
                                                <ArrowUp size={16} />
                                            </button>
                                            <button
                                                onClick={() => moveSlide(slide.id, 'down')}
                                                disabled={index === heroSlides.length - 1}
                                                className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                                            >
                                                <ArrowDown size={16} />
                                            </button>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => toggleSlideActive(slide.id, slide.is_active)}
                                                className={`p-2 ${slide.is_active ? 'text-olive-600' : 'text-gray-400'}`}
                                                title={slide.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                            >
                                                {slide.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
                                            </button>
                                            <button
                                                onClick={() => removeHeroSlide(slide.id)}
                                                className="p-2 text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                Belum ada hero slides. Tambahkan villa untuk ditampilkan di hero.
                            </div>
                        )}
                    </div>

                    {/* Featured Villas Section */}
                    <div className="bg-white border border-gray-100 p-6">
                        <div className="mb-6">
                            <h2 className="font-display text-lg text-gray-900">Featured Villas</h2>
                            <p className="text-gray-500 text-sm">Villas yang ditandai sebagai featured akan tampil lebih menonjol</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {villas.map((villa) => {
                                const isFeatured = featuredVillas.includes(villa.id)
                                return (
                                    <div
                                        key={villa.id}
                                        className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors ${isFeatured
                                            ? 'border-olive-600 bg-olive-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        onClick={() => toggleFeaturedVilla(villa.id)}
                                    >
                                        <div className="relative w-14 h-14 flex-shrink-0">
                                            {villa.images?.[0] ? (
                                                <Image
                                                    src={villa.images[0]}
                                                    alt={villa.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-100" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-gray-900 truncate">{villa.name}</h3>
                                            <p className="text-xs text-gray-500">{villa.bedrooms} BR • {villa.max_guests} guests</p>
                                        </div>
                                        <Star
                                            size={18}
                                            className={isFeatured ? 'text-olive-600 fill-olive-600' : 'text-gray-300'}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </main>

            {/* Add Slide Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-md">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="font-display text-xl">Tambah Hero Slide</h2>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Pilih Villa *
                                </label>
                                <select
                                    value={selectedVillaId}
                                    onChange={(e) => setSelectedVillaId(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none"
                                >
                                    <option value="">-- Pilih Villa --</option>
                                    {availableVillas.map((villa) => (
                                        <option key={villa.id} value={villa.id}>{villa.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Custom Tagline (opsional)
                                </label>
                                <input
                                    type="text"
                                    value={customTagline}
                                    onChange={(e) => setCustomTagline(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none"
                                    placeholder="e.g. Exclusive Retreat"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Custom Description (opsional)
                                </label>
                                <textarea
                                    value={customDescription}
                                    onChange={(e) => setCustomDescription(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none resize-none"
                                    placeholder="Override villa description for hero..."
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 flex gap-3">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={addHeroSlide}
                                disabled={saving || !selectedVillaId}
                                className="flex-1 px-4 py-3 bg-olive-600 text-white hover:bg-olive-900 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {saving && <Loader2 size={18} className="animate-spin" />}
                                <span>Tambah</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}
