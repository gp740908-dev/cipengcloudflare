'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus,
    Edit,
    Trash2,
    Loader2,
    Tag,
    Percent,
    DollarSign,
    Calendar,
    X,
    Copy,
    Check,
    ToggleLeft,
    ToggleRight,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Promo } from '@/types'
import { format, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/ui/Toast'
import { formatCurrency } from '@/lib/utils'

export default function AdminPromosPage() {
    const router = useRouter()
    const supabase = createClient()
    const toast = useToast()

    const [loading, setLoading] = useState(true)
    const [promos, setPromos] = useState<Promo[]>([])
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState<Promo | null>(null)
    const [saving, setSaving] = useState(false)
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        discount_type: 'percentage' as 'percentage' | 'fixed',
        discount_value: 10,
        min_stay_nights: 1,
        min_booking_amount: 0,
        max_discount_amount: 0,
        usage_limit: 0,
        valid_from: format(new Date(), 'yyyy-MM-dd'),
        valid_until: '',
        is_active: true,
    })

    useEffect(() => {
        checkAuth()
        fetchPromos()
    }, [])

    async function checkAuth() {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            router.push('/admin/login')
            return
        }
    }

    async function fetchPromos() {
        try {
            const { data, error } = await supabase
                .from('promos')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setPromos(data || [])
        } catch (error) {
            console.error('Error fetching promos:', error)
        } finally {
            setLoading(false)
        }
    }

    function openAddModal() {
        setEditing(null)
        setFormData({
            code: '',
            name: '',
            description: '',
            discount_type: 'percentage',
            discount_value: 10,
            min_stay_nights: 1,
            min_booking_amount: 0,
            max_discount_amount: 0,
            usage_limit: 0,
            valid_from: format(new Date(), 'yyyy-MM-dd'),
            valid_until: '',
            is_active: true,
        })
        setShowModal(true)
    }

    function openEditModal(promo: Promo) {
        setEditing(promo)
        setFormData({
            code: promo.code,
            name: promo.name,
            description: promo.description || '',
            discount_type: promo.discount_type,
            discount_value: promo.discount_value,
            min_stay_nights: promo.min_stay_nights,
            min_booking_amount: promo.min_booking_amount,
            max_discount_amount: promo.max_discount_amount || 0,
            usage_limit: promo.usage_limit || 0,
            valid_from: format(parseISO(promo.valid_from), 'yyyy-MM-dd'),
            valid_until: promo.valid_until ? format(parseISO(promo.valid_until), 'yyyy-MM-dd') : '',
            is_active: promo.is_active,
        })
        setShowModal(true)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!formData.code.trim() || !formData.name.trim()) {
            toast.warning('Kode dan nama promo wajib diisi')
            return
        }

        setSaving(true)
        try {
            const promoData = {
                code: formData.code.toUpperCase().trim(),
                name: formData.name,
                description: formData.description || null,
                discount_type: formData.discount_type,
                discount_value: formData.discount_value,
                min_stay_nights: formData.min_stay_nights,
                min_booking_amount: formData.min_booking_amount,
                max_discount_amount: formData.max_discount_amount || null,
                usage_limit: formData.usage_limit || null,
                valid_from: formData.valid_from,
                valid_until: formData.valid_until || null,
                is_active: formData.is_active,
            }

            if (editing) {
                const { error } = await supabase
                    .from('promos')
                    .update(promoData)
                    .eq('id', editing.id)

                if (error) throw error
                toast.success('Promo berhasil diperbarui')
            } else {
                const { error } = await supabase
                    .from('promos')
                    .insert(promoData)

                if (error) throw error
                toast.success('Promo berhasil ditambahkan')
            }

            setShowModal(false)
            fetchPromos()
        } catch (error: any) {
            console.error('Error saving promo:', error)
            if (error.code === '23505') {
                toast.error('Kode promo sudah digunakan')
            } else {
                toast.error('Gagal menyimpan promo', error.message)
            }
        } finally {
            setSaving(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Yakin ingin menghapus promo ini?')) return

        try {
            const { error } = await supabase
                .from('promos')
                .delete()
                .eq('id', id)

            if (error) throw error
            toast.success('Promo berhasil dihapus')
            setPromos(promos.filter(p => p.id !== id))
        } catch (error: any) {
            console.error('Error deleting promo:', error)
            toast.error('Gagal menghapus promo', error.message)
        }
    }

    async function toggleActive(promo: Promo) {
        try {
            const { error } = await supabase
                .from('promos')
                .update({ is_active: !promo.is_active })
                .eq('id', promo.id)

            if (error) throw error
            toast.success(promo.is_active ? 'Promo dinonaktifkan' : 'Promo diaktifkan')
            fetchPromos()
        } catch (error: any) {
            console.error('Error toggling promo:', error)
            toast.error('Gagal mengubah status', error.message)
        }
    }

    function copyCode(code: string, id: string) {
        navigator.clipboard.writeText(code)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
        toast.success('Kode disalin ke clipboard')
    }

    function generateCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let code = 'UBUD'
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        setFormData({ ...formData, code })
    }

    const isPromoValid = (promo: Promo) => {
        const now = new Date()
        const validFrom = new Date(promo.valid_from)
        const validUntil = promo.valid_until ? new Date(promo.valid_until) : null
        return promo.is_active && validFrom <= now && (!validUntil || validUntil >= now)
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
                            <h1 className="text-2xl font-display text-gray-900">Promo Management</h1>
                            <p className="text-gray-500 text-sm">Kelola kode promo dan diskon</p>
                        </div>
                        <button
                            onClick={openAddModal}
                            className="flex items-center gap-2 px-4 py-2 bg-olive-600 text-white text-sm font-medium hover:bg-olive-700 transition-colors"
                        >
                            <Plus size={16} />
                            <span>Tambah Promo</span>
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-white border border-gray-100 p-5">
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Promo</p>
                            <p className="text-3xl font-display text-gray-900">{promos.length}</p>
                        </div>
                        <div className="bg-white border border-gray-100 p-5">
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Promo Aktif</p>
                            <p className="text-3xl font-display text-olive-600">{promos.filter(p => isPromoValid(p)).length}</p>
                        </div>
                        <div className="bg-white border border-gray-100 p-5">
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Penggunaan</p>
                            <p className="text-3xl font-display text-gray-900">{promos.reduce((acc, p) => acc + p.used_count, 0)}</p>
                        </div>
                    </div>

                    {/* Promos List */}
                    {promos.length === 0 ? (
                        <div className="bg-white border border-gray-100 p-12 text-center">
                            <Tag size={48} className="text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-500 mb-4">Belum ada promo</p>
                            <button
                                onClick={openAddModal}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-olive-600 text-white text-sm hover:bg-olive-700 transition-colors"
                            >
                                <Plus size={16} />
                                <span>Buat Promo Pertama</span>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {promos.map((promo) => (
                                <motion.div
                                    key={promo.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`bg-white border p-5 ${isPromoValid(promo) ? 'border-olive-200' : 'border-gray-100 opacity-60'}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            {/* Icon */}
                                            <div className={`w-12 h-12 flex items-center justify-center ${promo.discount_type === 'percentage' ? 'bg-olive-100' : 'bg-amber-100'}`}>
                                                {promo.discount_type === 'percentage' ? (
                                                    <Percent size={20} className="text-olive-600" />
                                                ) : (
                                                    <DollarSign size={20} className="text-amber-600" />
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-medium text-gray-900">{promo.name}</h3>
                                                    {isPromoValid(promo) && (
                                                        <span className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide bg-olive-100 text-olive-700">
                                                            Aktif
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <code className="px-2 py-1 bg-gray-100 text-gray-800 font-mono text-sm">
                                                        {promo.code}
                                                    </code>
                                                    <button
                                                        onClick={() => copyCode(promo.code, promo.id)}
                                                        className="p-1 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {copiedId === promo.id ? (
                                                            <Check size={14} className="text-olive-600" />
                                                        ) : (
                                                            <Copy size={14} />
                                                        )}
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    {promo.discount_type === 'percentage'
                                                        ? `${promo.discount_value}% OFF`
                                                        : `${formatCurrency(promo.discount_value)} OFF`
                                                    }
                                                    {promo.min_stay_nights > 1 && ` • Min ${promo.min_stay_nights} malam`}
                                                    {promo.usage_limit && ` • Limit ${promo.usage_limit}x`}
                                                    {promo.used_count > 0 && ` • Digunakan ${promo.used_count}x`}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    <Calendar size={12} className="inline mr-1" />
                                                    {format(parseISO(promo.valid_from), 'dd MMM yyyy', { locale: id })}
                                                    {promo.valid_until && ` - ${format(parseISO(promo.valid_until), 'dd MMM yyyy', { locale: id })}`}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => toggleActive(promo)}
                                                className={`p-2 ${promo.is_active ? 'text-olive-600' : 'text-gray-400'}`}
                                                title={promo.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                            >
                                                {promo.is_active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                            </button>
                                            <button
                                                onClick={() => openEditModal(promo)}
                                                className="p-2 text-gray-400 hover:text-blue-600"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(promo.id)}
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
                            className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="font-display text-xl text-gray-900">
                                    {editing ? 'Edit Promo' : 'Tambah Promo'}
                                </h2>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                {/* Code */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                        Kode Promo *
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                            placeholder="UBUD2024"
                                            className="flex-1 px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none font-mono uppercase"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={generateCode}
                                            className="px-4 py-3 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm"
                                        >
                                            Generate
                                        </button>
                                    </div>
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                        Nama Promo *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Holiday Special 20%"
                                        className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none"
                                        required
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

                                {/* Discount Type & Value */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            Tipe Diskon
                                        </label>
                                        <select
                                            value={formData.discount_type}
                                            onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'percentage' | 'fixed' })}
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none"
                                        >
                                            <option value="percentage">Persentase (%)</option>
                                            <option value="fixed">Nominal (Rp)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            Nilai Diskon
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.discount_value}
                                            onChange={(e) => setFormData({ ...formData, discount_value: Number(e.target.value) })}
                                            min={0}
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Min Stay & Max Discount */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            Min. Menginap (malam)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.min_stay_nights}
                                            onChange={(e) => setFormData({ ...formData, min_stay_nights: Number(e.target.value) })}
                                            min={1}
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            Max Diskon (Rp) - 0 = unlimited
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.max_discount_amount}
                                            onChange={(e) => setFormData({ ...formData, max_discount_amount: Number(e.target.value) })}
                                            min={0}
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Usage Limit */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                        Limit Penggunaan (0 = unlimited)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.usage_limit}
                                        onChange={(e) => setFormData({ ...formData, usage_limit: Number(e.target.value) })}
                                        min={0}
                                        className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none"
                                    />
                                </div>

                                {/* Validity Period */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            Berlaku Dari
                                        </label>
                                        <input
                                            type="date"
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
                                            type="date"
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
                                        Aktifkan promo
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
