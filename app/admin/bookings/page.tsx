'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    Calendar,
    Eye,
    Check,
    X,
    Loader2,
    User,
    Mail,
    Phone,
    MessageCircle,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Booking } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { differenceInDays, parseISO, format } from 'date-fns'
import { id } from 'date-fns/locale'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/ui/Toast'

export default function AdminBookingsPage() {
    const router = useRouter()
    const supabase = createClient()
    const toast = useToast()

    const [loading, setLoading] = useState(true)
    const [bookings, setBookings] = useState<Booking[]>([])
    const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all')
    const [updatingId, setUpdatingId] = useState<string | null>(null)
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

    useEffect(() => {
        checkAuth()
        fetchBookings()
    }, [])

    async function checkAuth() {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            router.push('/admin/login')
            return
        }
    }

    async function fetchBookings() {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select(`*, villa:villas(name, location, images)`)
                .order('created_at', { ascending: false })

            if (error) throw error
            setBookings(data || [])
        } catch (error) {
            console.error('Error fetching bookings:', error)
        } finally {
            setLoading(false)
        }
    }

    async function updateStatus(id: string, status: 'confirmed' | 'cancelled') {
        setUpdatingId(id)
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status })
                .eq('id', id)

            if (error) throw error

            toast.success(status === 'confirmed' ? 'Booking dikonfirmasi' : 'Booking dibatalkan')
            setBookings(bookings.map(b =>
                b.id === id ? { ...b, status } : b
            ))

            if (selectedBooking?.id === id) {
                setSelectedBooking({ ...selectedBooking, status })
            }
        } catch (error: any) {
            console.error('Error updating booking:', error)
            toast.error('Gagal mengupdate status', error.message)
        } finally {
            setUpdatingId(null)
        }
    }

    const filteredBookings = bookings.filter(b =>
        filter === 'all' ? true : b.status === filter
    )

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-olive-100 text-olive-900'
            case 'cancelled': return 'bg-red-100 text-red-700'
            default: return 'bg-amber-100 text-amber-700'
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'confirmed': return 'Dikonfirmasi'
            case 'cancelled': return 'Dibatalkan'
            default: return 'Menunggu'
        }
    }

    return (
        <AdminLayout>
            {/* Main Content */}
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 sm:mb-8">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-display text-gray-900">Kelola Booking</h2>
                            <p className="text-gray-500 text-sm">Konfirmasi dan kelola booking tamu</p>
                        </div>

                        {/* Filter */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
                            {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${filter === f
                                        ? 'bg-olive-900 text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                >
                                    {f === 'all' ? 'Semua' : getStatusLabel(f)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <Loader2 size={40} className="animate-spin text-olive-600 mx-auto" />
                            <p className="mt-4 text-gray-500 text-sm">Memuat data booking...</p>
                        </div>
                    ) : filteredBookings.length === 0 ? (
                        <div className="text-center py-20 bg-white border border-gray-100">
                            <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Belum ada booking</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Booking List */}
                            <div className="lg:col-span-2 space-y-3">
                                {filteredBookings.map((booking) => (
                                    <motion.div
                                        key={booking.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`bg-white border p-5 cursor-pointer transition-all ${selectedBooking?.id === booking.id
                                            ? 'border-olive-600 shadow-md'
                                            : 'border-gray-100 hover:border-gray-200'
                                            }`}
                                        onClick={() => setSelectedBooking(booking)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="font-mono text-xs text-gray-400">
                                                        #{booking.id.substring(0, 8).toUpperCase()}
                                                    </span>
                                                    <span className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${getStatusColor(booking.status)}`}>
                                                        {getStatusLabel(booking.status)}
                                                    </span>
                                                </div>
                                                <h3 className="font-medium text-gray-900">
                                                    {booking.villa?.name || '-'}
                                                </h3>
                                                <p className="text-gray-500 text-sm">
                                                    {booking.guest_name}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-olive-600">
                                                    {formatCurrency(booking.total_price)}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {differenceInDays(parseISO(booking.check_out), parseISO(booking.check_in))} malam
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center text-xs text-gray-400">
                                            <Calendar size={12} className="mr-1" />
                                            {format(parseISO(booking.check_in), 'dd MMM', { locale: id })} - {format(parseISO(booking.check_out), 'dd MMM yyyy', { locale: id })}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Booking Detail */}
                            <div className="lg:col-span-1">
                                {selectedBooking ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="bg-white border border-gray-100 p-6 sticky top-8"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-display text-lg text-gray-900">Detail Booking</h3>
                                            <span className={`px-2 py-1 text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                                                {getStatusLabel(selectedBooking.status)}
                                            </span>
                                        </div>

                                        <div className="space-y-4">
                                            {/* Villa */}
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Villa</p>
                                                <p className="font-medium text-gray-900">{selectedBooking.villa?.name}</p>
                                            </div>

                                            {/* Dates */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Check-in</p>
                                                    <p className="text-sm font-medium">{formatDate(selectedBooking.check_in)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Check-out</p>
                                                    <p className="text-sm font-medium">{formatDate(selectedBooking.check_out)}</p>
                                                </div>
                                            </div>

                                            {/* Guest */}
                                            <div className="border-t border-gray-100 pt-4">
                                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Tamu</p>
                                                <div className="space-y-2">
                                                    <div className="flex items-center text-sm">
                                                        <User size={14} className="mr-2 text-olive-600" />
                                                        {selectedBooking.guest_name}
                                                    </div>
                                                    <div className="flex items-center text-sm">
                                                        <Mail size={14} className="mr-2 text-olive-600" />
                                                        {selectedBooking.guest_email}
                                                    </div>
                                                    {selectedBooking.guest_phone && (
                                                        <div className="flex items-center text-sm">
                                                            <Phone size={14} className="mr-2 text-olive-600" />
                                                            {selectedBooking.guest_phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="border-t border-gray-100 pt-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-500 text-sm">Total</span>
                                                    <span className="text-xl font-display text-olive-600">
                                                        {formatCurrency(selectedBooking.total_price)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Special Requests */}
                                            {selectedBooking.special_requests && (
                                                <div className="border-t border-gray-100 pt-4">
                                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Permintaan Khusus</p>
                                                    <p className="text-sm text-gray-600">{selectedBooking.special_requests}</p>
                                                </div>
                                            )}

                                            {/* Actions */}
                                            {selectedBooking.status === 'pending' && (
                                                <div className="border-t border-gray-100 pt-4 flex gap-2">
                                                    <button
                                                        onClick={() => updateStatus(selectedBooking.id, 'confirmed')}
                                                        disabled={updatingId === selectedBooking.id}
                                                        className="flex-1 flex items-center justify-center gap-2 bg-olive-600 text-white py-2.5 text-sm font-medium hover:bg-olive-900 transition-colors disabled:opacity-50"
                                                    >
                                                        {updatingId === selectedBooking.id ? (
                                                            <Loader2 size={16} className="animate-spin" />
                                                        ) : (
                                                            <Check size={16} />
                                                        )}
                                                        <span>Konfirmasi</span>
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatus(selectedBooking.id, 'cancelled')}
                                                        disabled={updatingId === selectedBooking.id}
                                                        className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2.5 text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                                                    >
                                                        <X size={16} />
                                                        <span>Batalkan</span>
                                                    </button>
                                                </div>
                                            )}

                                            {/* WhatsApp */}
                                            {selectedBooking.guest_phone && (
                                                <a
                                                    href={`https://wa.me/${selectedBooking.guest_phone.replace(/\D/g, '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-2 w-full border border-olive-600 text-olive-600 py-2.5 text-sm font-medium hover:bg-olive-50 transition-colors"
                                                >
                                                    <MessageCircle size={16} />
                                                    <span>Hubungi via WhatsApp</span>
                                                </a>
                                            )}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="bg-white border border-gray-100 p-8 text-center text-gray-400">
                                        <Eye size={32} className="mx-auto mb-3 opacity-50" />
                                        <p className="text-sm">Pilih booking untuk melihat detail</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </AdminLayout>
    )
}
