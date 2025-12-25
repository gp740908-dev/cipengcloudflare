'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    Home,
    Calendar,
    DollarSign,
    Clock,
    CheckCircle,
    ArrowUpRight,
    Plus,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'
import { Booking } from '@/types'
import Link from 'next/link'
import { parseISO, format } from 'date-fns'
import { id } from 'date-fns/locale'
import AdminLayout from '@/components/admin/AdminLayout'

export default function AdminDashboard() {
    const router = useRouter()
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        totalVillas: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
    })
    const [recentBookings, setRecentBookings] = useState<Booking[]>([])

    useEffect(() => {
        checkAuth()
        fetchData()
    }, [])

    async function checkAuth() {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            router.push('/admin/login')
            return
        }

        const { data: adminData } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', session.user.email)
            .single()

        if (!adminData) {
            await supabase.auth.signOut()
            router.push('/admin/login')
        }
    }

    async function fetchData() {
        try {
            const { count: bookingsCount } = await supabase
                .from('bookings')
                .select('*', { count: 'exact', head: true })

            const { data: revenueData } = await supabase
                .from('bookings')
                .select('total_price')
                .eq('status', 'confirmed')

            const totalRevenue = revenueData?.reduce((sum, b) => sum + Number(b.total_price), 0) || 0

            const { count: villasCount } = await supabase
                .from('villas')
                .select('*', { count: 'exact', head: true })

            const { count: pendingCount } = await supabase
                .from('bookings')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'pending')

            const { count: confirmedCount } = await supabase
                .from('bookings')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'confirmed')

            const { data: recentData } = await supabase
                .from('bookings')
                .select(`*, villa:villas(name)`)
                .order('created_at', { ascending: false })
                .limit(5)

            setStats({
                totalBookings: bookingsCount || 0,
                totalRevenue,
                totalVillas: villasCount || 0,
                pendingBookings: pendingCount || 0,
                confirmedBookings: confirmedCount || 0,
            })
            setRecentBookings(recentData || [])
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }


    const statCards = [
        { label: 'Total Booking', value: stats.totalBookings, icon: Calendar, color: 'bg-olive-600' },
        { label: 'Total Pendapatan', value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: 'bg-olive-900' },
        { label: 'Total Villa', value: stats.totalVillas, icon: Home, color: 'bg-olive-400' },
        { label: 'Menunggu Konfirmasi', value: stats.pendingBookings, icon: Clock, color: 'bg-amber-500' },
    ]

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
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-display text-gray-900">Dashboard</h2>
                            <p className="text-gray-500 text-sm">Overview statistik dan booking terbaru</p>
                        </div>
                        <Link
                            href="/admin/villas/new"
                            className="flex items-center gap-2 px-4 py-2 bg-olive-600 text-white text-sm font-medium hover:bg-olive-900 transition-colors"
                        >
                            <Plus size={16} />
                            <span>Tambah Villa</span>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="animate-spin w-10 h-10 border-3 border-olive-600 border-t-transparent rounded-full mx-auto"></div>
                            <p className="mt-4 text-gray-500 text-sm">Memuat data...</p>
                        </div>
                    ) : (
                        <>
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                {statCards.map((card, index) => (
                                    <motion.div
                                        key={card.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white border border-gray-100 p-6"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`w-10 h-10 ${card.color} flex items-center justify-center`}>
                                                <card.icon size={18} className="text-white" />
                                            </div>
                                            <ArrowUpRight size={16} className="text-gray-300" />
                                        </div>
                                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{card.label}</p>
                                        <p className="text-2xl font-display text-gray-900">{card.value}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-white border border-gray-100 p-5 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-olive-100 flex items-center justify-center">
                                        <CheckCircle size={20} className="text-olive-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">Dikonfirmasi</p>
                                        <p className="text-xl font-display text-gray-900">{stats.confirmedBookings}</p>
                                    </div>
                                </div>
                                <div className="bg-white border border-gray-100 p-5 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-amber-100 flex items-center justify-center">
                                        <Clock size={20} className="text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">Menunggu</p>
                                        <p className="text-xl font-display text-gray-900">{stats.pendingBookings}</p>
                                    </div>
                                </div>
                                <div className="bg-white border border-gray-100 p-5 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-olive-100 flex items-center justify-center">
                                        <Home size={20} className="text-olive-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">Total Villa</p>
                                        <p className="text-xl font-display text-gray-900">{stats.totalVillas}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Bookings */}
                            <div className="bg-white border border-gray-100">
                                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                                    <h3 className="font-display text-lg text-gray-900">Booking Terbaru</h3>
                                    <Link
                                        href="/admin/bookings"
                                        className="text-olive-600 hover:text-olive-900 text-sm font-medium"
                                    >
                                        Lihat Semua →
                                    </Link>
                                </div>
                                {recentBookings.length === 0 ? (
                                    <div className="p-12 text-center text-gray-400">
                                        <Calendar size={40} className="mx-auto mb-3 opacity-50" />
                                        <p>Belum ada booking</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tamu</th>
                                                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Villa</th>
                                                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {recentBookings.map((booking) => (
                                                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-5 py-4 font-mono text-xs text-gray-400">
                                                            #{booking.id.substring(0, 8).toUpperCase()}
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <p className="font-medium text-gray-900 text-sm">{booking.guest_name}</p>
                                                            <p className="text-xs text-gray-400">{booking.guest_email}</p>
                                                        </td>
                                                        <td className="px-5 py-4 text-sm text-gray-600">
                                                            {booking.villa?.name || '-'}
                                                        </td>
                                                        <td className="px-5 py-4 text-xs text-gray-500">
                                                            {format(parseISO(booking.check_in), 'dd MMM', { locale: id })} - {format(parseISO(booking.check_out), 'dd MMM', { locale: id })}
                                                        </td>
                                                        <td className="px-5 py-4 font-medium text-olive-600 text-sm">
                                                            {formatCurrency(booking.total_price)}
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <span className={`px-2 py-1 text-[10px] font-medium uppercase tracking-wide ${getStatusColor(booking.status)}`}>
                                                                {getStatusLabel(booking.status)}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Quick Actions */}
                            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                                <Link
                                    href="/admin/villas"
                                    className="bg-olive-600 text-white px-5 py-3 text-center text-sm font-medium hover:bg-olive-900 transition-colors"
                                >
                                    Kelola Villa
                                </Link>
                                <Link
                                    href="/admin/bookings"
                                    className="bg-olive-900 text-white px-5 py-3 text-center text-sm font-medium hover:bg-olive-600 transition-colors"
                                >
                                    Kelola Booking
                                </Link>
                                <Link
                                    href="/admin/blog"
                                    className="border border-olive-600 text-olive-600 px-5 py-3 text-center text-sm font-medium hover:bg-olive-600 hover:text-white transition-colors"
                                >
                                    Kelola Blog
                                </Link>
                                <Link
                                    href="/"
                                    target="_blank"
                                    className="border border-gray-200 text-gray-600 px-5 py-3 text-center text-sm font-medium hover:border-olive-600 hover:text-olive-600 transition-colors"
                                >
                                    Lihat Website
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </AdminLayout>
    )
}
