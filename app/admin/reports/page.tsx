'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    Download,
    FileText,
    Calendar,
    Home,
    DollarSign,
    Users,
    Loader2,
    TrendingUp,
    BarChart3,
    PieChart,
    Filter,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { format, subDays, startOfMonth, endOfMonth, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/ui/Toast'
import { formatCurrency } from '@/lib/utils'

interface ReportStats {
    totalBookings: number
    totalRevenue: number
    totalVillas: number
    totalGuests: number
    bookingsByStatus: { status: string; count: number }[]
    revenueByMonth: { month: string; revenue: number }[]
    topVillas: { name: string; bookings: number; revenue: number }[]
}

export default function AdminReportsPage() {
    const router = useRouter()
    const supabase = createClient()
    const toast = useToast()

    const [loading, setLoading] = useState(true)
    const [exporting, setExporting] = useState(false)
    const [stats, setStats] = useState<ReportStats | null>(null)
    const [dateRange, setDateRange] = useState({
        from: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
        to: format(new Date(), 'yyyy-MM-dd'),
    })
    const [exportType, setExportType] = useState<'bookings' | 'villas' | 'revenue'>('bookings')

    useEffect(() => {
        checkAuth()
        fetchStats()
    }, [dateRange])

    async function checkAuth() {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            router.push('/admin/login')
            return
        }
    }

    async function fetchStats() {
        setLoading(true)
        try {
            // Fetch bookings
            const { data: bookings, error: bookingsError } = await supabase
                .from('bookings')
                .select('*, villa:villas(name)')
                .gte('created_at', dateRange.from)
                .lte('created_at', dateRange.to + 'T23:59:59')

            if (bookingsError) throw bookingsError

            // Fetch villas count
            const { count: villasCount } = await supabase
                .from('villas')
                .select('*', { count: 'exact', head: true })

            // Calculate stats
            const totalRevenue = bookings?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0
            const totalGuests = bookings?.reduce((sum, b) => sum + (b.total_guests || 0), 0) || 0

            // Bookings by status
            const statusCounts: Record<string, number> = {}
            bookings?.forEach(b => {
                statusCounts[b.status] = (statusCounts[b.status] || 0) + 1
            })
            const bookingsByStatus = Object.entries(statusCounts).map(([status, count]) => ({ status, count }))

            // Top villas
            const villaStats: Record<string, { name: string; bookings: number; revenue: number }> = {}
            bookings?.forEach(b => {
                const villaName = b.villa?.name || 'Unknown'
                if (!villaStats[b.villa_id]) {
                    villaStats[b.villa_id] = { name: villaName, bookings: 0, revenue: 0 }
                }
                villaStats[b.villa_id].bookings++
                villaStats[b.villa_id].revenue += b.total_price || 0
            })
            const topVillas = Object.values(villaStats)
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 5)

            setStats({
                totalBookings: bookings?.length || 0,
                totalRevenue,
                totalVillas: villasCount || 0,
                totalGuests,
                bookingsByStatus,
                revenueByMonth: [],
                topVillas,
            })
        } catch (error) {
            console.error('Error fetching stats:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleExport() {
        setExporting(true)
        try {
            let data: any[] = []
            let filename = ''
            let headers: string[] = []

            if (exportType === 'bookings') {
                const { data: bookings, error } = await supabase
                    .from('bookings')
                    .select('*, villa:villas(name)')
                    .gte('created_at', dateRange.from)
                    .lte('created_at', dateRange.to + 'T23:59:59')
                    .order('created_at', { ascending: false })

                if (error) throw error

                headers = ['ID', 'Villa', 'Guest Name', 'Email', 'Phone', 'Check In', 'Check Out', 'Guests', 'Total Price', 'Status', 'Created At']
                data = bookings?.map(b => [
                    b.id,
                    b.villa?.name || '-',
                    b.guest_name,
                    b.guest_email,
                    b.guest_phone || '-',
                    b.check_in,
                    b.check_out,
                    b.total_guests,
                    b.total_price,
                    b.status,
                    format(parseISO(b.created_at), 'yyyy-MM-dd HH:mm'),
                ]) || []

                filename = `bookings_${dateRange.from}_${dateRange.to}.csv`
            } else if (exportType === 'villas') {
                const { data: villas, error } = await supabase
                    .from('villas')
                    .select('*')
                    .order('name')

                if (error) throw error

                headers = ['ID', 'Name', 'Location', 'Bedrooms', 'Bathrooms', 'Max Guests', 'Price/Night', 'Created At']
                data = villas?.map(v => [
                    v.id,
                    v.name,
                    v.location,
                    v.bedrooms,
                    v.bathrooms,
                    v.max_guests,
                    v.price_per_night,
                    format(parseISO(v.created_at), 'yyyy-MM-dd'),
                ]) || []

                filename = `villas_${format(new Date(), 'yyyy-MM-dd')}.csv`
            } else if (exportType === 'revenue') {
                const { data: bookings, error } = await supabase
                    .from('bookings')
                    .select('*, villa:villas(name)')
                    .eq('status', 'confirmed')
                    .gte('created_at', dateRange.from)
                    .lte('created_at', dateRange.to + 'T23:59:59')
                    .order('created_at', { ascending: false })

                if (error) throw error

                headers = ['Date', 'Booking ID', 'Villa', 'Guest', 'Revenue']
                data = bookings?.map(b => [
                    format(parseISO(b.created_at), 'yyyy-MM-dd'),
                    b.id,
                    b.villa?.name || '-',
                    b.guest_name,
                    b.total_price,
                ]) || []

                filename = `revenue_${dateRange.from}_${dateRange.to}.csv`
            }

            // Generate CSV
            const csvContent = [
                headers.join(','),
                ...data.map(row => row.map((cell: any) => `"${cell}"`).join(','))
            ].join('\n')

            // Download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = filename
            link.click()

            toast.success('Data berhasil diexport')
        } catch (error: any) {
            console.error('Error exporting:', error)
            toast.error('Gagal export data', error.message)
        } finally {
            setExporting(false)
        }
    }

    const quickDateRanges = [
        { label: '7 Hari', days: 7 },
        { label: '30 Hari', days: 30 },
        { label: '90 Hari', days: 90 },
        { label: 'Bulan Ini', type: 'month' },
    ]

    function setQuickDate(range: { days?: number; type?: string }) {
        if (range.type === 'month') {
            setDateRange({
                from: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
                to: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
            })
        } else if (range.days) {
            setDateRange({
                from: format(subDays(new Date(), range.days), 'yyyy-MM-dd'),
                to: format(new Date(), 'yyyy-MM-dd'),
            })
        }
    }

    if (loading && !stats) {
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
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-xl sm:text-2xl font-display text-gray-900">Reports & Export</h1>
                        <p className="text-gray-500 text-sm">Analisis data dan export laporan</p>
                    </div>

                    {/* Date Range & Quick Filters */}
                    <div className="bg-white border border-gray-100 p-5 mb-6">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-gray-400" />
                                <input
                                    type="date"
                                    value={dateRange.from}
                                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                                    className="px-3 py-2 border border-gray-200 text-sm"
                                />
                                <span className="text-gray-400">—</span>
                                <input
                                    type="date"
                                    value={dateRange.to}
                                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                                    className="px-3 py-2 border border-gray-200 text-sm"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                {quickDateRanges.map((range) => (
                                    <button
                                        key={range.label}
                                        onClick={() => setQuickDate(range)}
                                        className="px-3 py-1.5 text-xs border border-gray-200 hover:bg-gray-50"
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border border-gray-100 p-5"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-olive-100 flex items-center justify-center">
                                    <Calendar size={18} className="text-olive-600" />
                                </div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider">Total Booking</p>
                            </div>
                            <p className="text-3xl font-display text-gray-900">{stats?.totalBookings || 0}</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white border border-gray-100 p-5"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-green-100 flex items-center justify-center">
                                    <DollarSign size={18} className="text-green-600" />
                                </div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider">Total Revenue</p>
                            </div>
                            <p className="text-2xl font-display text-gray-900">{formatCurrency(stats?.totalRevenue || 0)}</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white border border-gray-100 p-5"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                                    <Home size={18} className="text-blue-600" />
                                </div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider">Total Villa</p>
                            </div>
                            <p className="text-3xl font-display text-gray-900">{stats?.totalVillas || 0}</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white border border-gray-100 p-5"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-amber-100 flex items-center justify-center">
                                    <Users size={18} className="text-amber-600" />
                                </div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider">Total Tamu</p>
                            </div>
                            <p className="text-3xl font-display text-gray-900">{stats?.totalGuests || 0}</p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                        {/* Booking by Status */}
                        <div className="bg-white border border-gray-100 p-5">
                            <h3 className="font-display text-lg text-gray-900 mb-4 flex items-center gap-2">
                                <PieChart size={18} className="text-olive-600" />
                                Booking by Status
                            </h3>
                            <div className="space-y-3">
                                {stats?.bookingsByStatus.map((item) => (
                                    <div key={item.status} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-3 h-3 rounded-full ${item.status === 'confirmed' ? 'bg-green-500' :
                                                item.status === 'pending' ? 'bg-amber-500' :
                                                    'bg-red-500'
                                                }`} />
                                            <span className="text-sm capitalize">{item.status}</span>
                                        </div>
                                        <span className="font-medium">{item.count}</span>
                                    </div>
                                ))}
                                {(!stats?.bookingsByStatus || stats.bookingsByStatus.length === 0) && (
                                    <p className="text-gray-400 text-sm">Tidak ada data</p>
                                )}
                            </div>
                        </div>

                        {/* Top Villas */}
                        <div className="bg-white border border-gray-100 p-5">
                            <h3 className="font-display text-lg text-gray-900 mb-4 flex items-center gap-2">
                                <BarChart3 size={18} className="text-olive-600" />
                                Top Villa
                            </h3>
                            <div className="space-y-3">
                                {stats?.topVillas.map((villa, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 h-6 bg-gray-100 flex items-center justify-center text-xs font-medium">
                                                {index + 1}
                                            </span>
                                            <span className="text-sm truncate max-w-[150px]">{villa.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{formatCurrency(villa.revenue)}</p>
                                            <p className="text-xs text-gray-400">{villa.bookings} booking</p>
                                        </div>
                                    </div>
                                ))}
                                {(!stats?.topVillas || stats.topVillas.length === 0) && (
                                    <p className="text-gray-400 text-sm">Tidak ada data</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Export Section */}
                    <div className="bg-white border border-gray-100 p-6">
                        <h3 className="font-display text-lg text-gray-900 mb-4 flex items-center gap-2">
                            <Download size={18} className="text-olive-600" />
                            Export Data
                        </h3>

                        <div className="flex items-end gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Pilih Tipe Data
                                </label>
                                <select
                                    value={exportType}
                                    onChange={(e) => setExportType(e.target.value as any)}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none"
                                >
                                    <option value="bookings">Data Booking</option>
                                    <option value="villas">Data Villa</option>
                                    <option value="revenue">Laporan Revenue</option>
                                </select>
                            </div>

                            <button
                                onClick={handleExport}
                                disabled={exporting}
                                className="flex items-center gap-2 px-6 py-3 bg-olive-600 text-white hover:bg-olive-700 disabled:opacity-50"
                            >
                                {exporting ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <Download size={18} />
                                )}
                                <span>Export CSV</span>
                            </button>
                        </div>

                        <p className="text-xs text-gray-400 mt-3">
                            * Export akan menggunakan rentang tanggal yang dipilih di atas
                        </p>
                    </div>
                </div>
            </main>
        </AdminLayout>
    )
}
