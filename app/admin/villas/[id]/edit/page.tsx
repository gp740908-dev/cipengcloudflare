'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import {
    ArrowLeft,
    Save,
    X,
    Plus,
    Loader2,
    MapPin,
    Navigation
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { NearbyPlace } from '@/types'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/ui/Toast'

const placeTypes = [
    { value: 'beach', label: 'Beach' },
    { value: 'temple', label: 'Temple' },
    { value: 'attraction', label: 'Attraction' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'landmark', label: 'Landmark' },
    { value: 'airport', label: 'Airport' },
    { value: 'other', label: 'Other' },
]

export default function EditVillaPage() {
    const router = useRouter()
    const params = useParams()
    const villaId = params.id as string
    const supabase = createClient()
    const toast = useToast()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        bedrooms: 2,
        bathrooms: 2,
        max_guests: 4,
        price_per_night: 2500000,
        location: 'Ubud, Bali',
        latitude: -8.5069,
        longitude: 115.2624,
        amenities: [''],
        images: [''],
        nearby_places: [] as NearbyPlace[],
    })

    useEffect(() => {
        fetchVilla()
    }, [villaId])

    async function fetchVilla() {
        try {
            const { data, error } = await supabase
                .from('villas')
                .select('*')
                .eq('id', villaId)
                .single()

            if (error) throw error

            if (data) {
                setFormData({
                    name: data.name,
                    description: data.description,
                    bedrooms: data.bedrooms,
                    bathrooms: data.bathrooms,
                    max_guests: data.max_guests,
                    price_per_night: data.price_per_night,
                    location: data.location,
                    latitude: data.latitude || -8.5069,
                    longitude: data.longitude || 115.2624,
                    amenities: data.amenities || [''],
                    images: data.images || [''],
                    nearby_places: data.nearby_places || [],
                })
            }
        } catch (error: any) {
            console.error('Error fetching villa:', error)
            toast.error('Villa tidak ditemukan')
            router.push('/admin/villas')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name || !formData.description) {
            toast.warning('Nama dan deskripsi wajib diisi')
            return
        }

        setSaving(true)

        try {
            const { error } = await supabase
                .from('villas')
                .update({
                    name: formData.name,
                    description: formData.description,
                    bedrooms: formData.bedrooms,
                    bathrooms: formData.bathrooms,
                    max_guests: formData.max_guests,
                    price_per_night: formData.price_per_night,
                    location: formData.location,
                    latitude: formData.latitude || null,
                    longitude: formData.longitude || null,
                    amenities: formData.amenities.filter(a => a.trim()),
                    images: formData.images.filter(img => img.trim()),
                    nearby_places: formData.nearby_places.filter(p => p.name.trim()),
                })
                .eq('id', villaId)

            if (error) throw error

            toast.success('Perubahan berhasil disimpan')
            router.push('/admin/villas')
        } catch (error: any) {
            console.error('Error updating villa:', error)
            toast.error('Gagal menyimpan perubahan', error.message)
        } finally {
            setSaving(false)
        }
    }

    // Image handlers
    const addImageField = () => {
        setFormData({ ...formData, images: [...formData.images, ''] })
    }

    const removeImageField = (index: number) => {
        setFormData({
            ...formData,
            images: formData.images.filter((_, i) => i !== index)
        })
    }

    const updateImage = (index: number, value: string) => {
        const newImages = [...formData.images]
        newImages[index] = value
        setFormData({ ...formData, images: newImages })
    }

    // Amenity handlers
    const addAmenity = () => {
        setFormData({ ...formData, amenities: [...formData.amenities, ''] })
    }

    const removeAmenity = (index: number) => {
        setFormData({
            ...formData,
            amenities: formData.amenities.filter((_, i) => i !== index)
        })
    }

    const updateAmenity = (index: number, value: string) => {
        const newAmenities = [...formData.amenities]
        newAmenities[index] = value
        setFormData({ ...formData, amenities: newAmenities })
    }

    // Nearby Places handlers
    const addNearbyPlace = () => {
        setFormData({
            ...formData,
            nearby_places: [...formData.nearby_places, { name: '', type: 'attraction', distance: '' }]
        })
    }

    const removeNearbyPlace = (index: number) => {
        setFormData({
            ...formData,
            nearby_places: formData.nearby_places.filter((_, i) => i !== index)
        })
    }

    const updateNearbyPlace = (index: number, field: keyof NearbyPlace, value: string) => {
        const newPlaces = [...formData.nearby_places]
        newPlaces[index] = { ...newPlaces[index], [field]: value }
        setFormData({ ...formData, nearby_places: newPlaces })
    }

    if (loading) {
        return (
            <AdminLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 size={40} className="animate-spin text-olive-600 mx-auto" />
                        <p className="mt-4 text-gray-500 text-sm">Memuat data villa...</p>
                    </div>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <Link
                            href="/admin/villas"
                            className="p-2 hover:bg-gray-200 transition-colors"
                        >
                            <ArrowLeft size={24} className="text-gray-600" />
                        </Link>
                        <div>
                            <h2 className="text-2xl font-display text-gray-900">Edit Villa</h2>
                            <p className="text-gray-500 text-sm">Ubah informasi villa</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white border border-gray-100 p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Nama Villa *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                />
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Deskripsi *
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={5}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors resize-none"
                                />
                            </div>

                            {/* Location */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Lokasi
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                />
                            </div>

                            {/* Map Coordinates */}
                            <div className="md:col-span-2 p-4 bg-gray-50 border border-gray-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin size={16} className="text-olive-600" />
                                    <span className="text-sm font-medium text-gray-700">Koordinat Peta</span>
                                </div>
                                <p className="text-xs text-gray-500 mb-4">
                                    Dapatkan koordinat dari Google Maps. Klik kanan pada lokasi villa → Pilih koordinat yang muncul.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            Latitude
                                        </label>
                                        <input
                                            type="number"
                                            step="0.000001"
                                            value={formData.latitude}
                                            onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                                            placeholder="-8.5069"
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            Longitude
                                        </label>
                                        <input
                                            type="number"
                                            step="0.000001"
                                            value={formData.longitude}
                                            onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                                            placeholder="115.2624"
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Harga per Malam (IDR) *
                                </label>
                                <input
                                    type="number"
                                    value={formData.price_per_night}
                                    onChange={(e) => setFormData({ ...formData, price_per_night: parseInt(e.target.value) })}
                                    min="100000"
                                    step="100000"
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                />
                            </div>

                            {/* Bedrooms */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Jumlah Kamar Tidur
                                </label>
                                <input
                                    type="number"
                                    value={formData.bedrooms}
                                    onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                                    min="1"
                                    max="10"
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                />
                            </div>

                            {/* Bathrooms */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Jumlah Kamar Mandi
                                </label>
                                <input
                                    type="number"
                                    value={formData.bathrooms}
                                    onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) })}
                                    min="1"
                                    max="10"
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                />
                            </div>

                            {/* Max Guests */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Maksimal Tamu
                                </label>
                                <input
                                    type="number"
                                    value={formData.max_guests}
                                    onChange={(e) => setFormData({ ...formData, max_guests: parseInt(e.target.value) })}
                                    min="1"
                                    max="20"
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                />
                            </div>

                            {/* Images */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    URL Gambar
                                </label>
                                <div className="space-y-2">
                                    {formData.images.map((image, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="url"
                                                value={image}
                                                onChange={(e) => updateImage(index, e.target.value)}
                                                placeholder="https://images.unsplash.com/..."
                                                className="flex-1 px-4 py-2 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                            />
                                            {formData.images.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeImageField(index)}
                                                    className="p-2 text-red-500 hover:bg-red-50"
                                                >
                                                    <X size={18} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addImageField}
                                        className="flex items-center gap-2 text-olive-600 hover:text-olive-900 text-sm"
                                    >
                                        <Plus size={16} />
                                        <span>Tambah Gambar</span>
                                    </button>
                                </div>
                            </div>

                            {/* Amenities */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Fasilitas
                                </label>
                                <div className="space-y-2">
                                    {formData.amenities.map((amenity, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={amenity}
                                                onChange={(e) => updateAmenity(index, e.target.value)}
                                                placeholder="Private Pool"
                                                className="flex-1 px-4 py-2 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeAmenity(index)}
                                                className="p-2 text-red-500 hover:bg-red-50"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addAmenity}
                                        className="flex items-center gap-2 text-olive-600 hover:text-olive-900 text-sm"
                                    >
                                        <Plus size={16} />
                                        <span>Tambah Fasilitas</span>
                                    </button>
                                </div>
                            </div>

                            {/* Nearby Places */}
                            <div className="md:col-span-2 p-4 bg-blue-50 border border-blue-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <Navigation size={16} className="text-blue-600" />
                                    <span className="text-sm font-medium text-gray-700">Tempat Terdekat</span>
                                </div>
                                <p className="text-xs text-gray-500 mb-4">
                                    Tambahkan tempat-tempat menarik di sekitar villa (pantai, kuil, restoran, dll)
                                </p>
                                <div className="space-y-3">
                                    {formData.nearby_places.map((place, index) => (
                                        <div key={index} className="flex gap-2 bg-white p-3 border border-gray-100">
                                            <input
                                                type="text"
                                                value={place.name}
                                                onChange={(e) => updateNearbyPlace(index, 'name', e.target.value)}
                                                placeholder="Nama tempat"
                                                className="flex-1 px-3 py-2 border border-gray-200 focus:border-olive-600 outline-none transition-colors text-sm"
                                            />
                                            <select
                                                value={place.type}
                                                onChange={(e) => updateNearbyPlace(index, 'type', e.target.value)}
                                                className="px-3 py-2 border border-gray-200 focus:border-olive-600 outline-none transition-colors text-sm"
                                            >
                                                {placeTypes.map(t => (
                                                    <option key={t.value} value={t.value}>{t.label}</option>
                                                ))}
                                            </select>
                                            <input
                                                type="text"
                                                value={place.distance}
                                                onChange={(e) => updateNearbyPlace(index, 'distance', e.target.value)}
                                                placeholder="1.5 km"
                                                className="w-24 px-3 py-2 border border-gray-200 focus:border-olive-600 outline-none transition-colors text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeNearbyPlace(index)}
                                                className="p-2 text-red-500 hover:bg-red-50"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addNearbyPlace}
                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        <Plus size={16} />
                                        <span>Tambah Tempat Terdekat</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="mt-8 flex justify-end gap-4">
                            <Link
                                href="/admin/villas"
                                className="px-6 py-3 border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-3 bg-olive-600 text-white hover:bg-olive-900 transition-colors disabled:opacity-50"
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
