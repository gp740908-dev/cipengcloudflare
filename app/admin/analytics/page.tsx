'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Loader2,
    Users,
    Eye,
    Clock,
    Monitor,
    Smartphone,
    Tablet,
    TrendingUp,
    TrendingDown,
    Globe,
    FileText,
    Calendar,
    RefreshCw
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/admin/AdminLayout'

interface DailyStats {
    date: string
    total_views: number
    unique_visitors: number
    desktop_views: number
    mobile_views: number
    tablet_views: number
    avg_duration: number
    top_pages: { path: string; views: number }[]
    top_referrers: { referrer: string; views: number }[]
}

interface RealtimeStats {
    today_views: number
    today_visitors: number
    yesterday_views: number
    yesterday_visitors: number
    this_week_views: number
    this_month_views: number
}

interface TopPage {
    path: string
    views: number
}

interface DeviceStats {
    desktop: number
    mobile: number
    tablet: number
}

export default function AnalyticsPage() {
    const router = useRouter()
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [dateRange, setDateRange] = useState('7days')
    const [realtime, setRealtime] = useState<RealtimeStats>({
        today_views: 0,
        today_visitors: 0,
        yesterday_views: 0,
        yesterday_visitors: 0,
        this_week_views: 0,
        this_month_views: 0
    })
    const [topPages, setTopPages] = useState<TopPage[]>([])
    const [deviceStats, setDeviceStats] = useState<DeviceStats>({ desktop: 0, mobile: 0, tablet: 0 })
    const [dailyData, setDailyData] = useState<{ date: string; views: number; visitors: number }[]>([])
    const [topReferrers, setTopReferrers] = useState<{ referrer: string; views: number }[]>([])

    useEffect(() => {
        checkAuth()
        fetchAnalytics()
    }, [dateRange])

    async function checkAuth() {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            router.push('/admin/login')
        }
    }

    async function fetchAnalytics() {
        try {
            const now = new Date()
            const today = now.toISOString().split('T')[0]
            const yesterday = new Date(now.setDate(now.getDate() - 1)).toISOString().split('T')[0]

            // Get real-time stats from page_views
            const todayStart = new Date()
            todayStart.setHours(0, 0, 0, 0)

            const yesterdayStart = new Date(todayStart)
            yesterdayStart.setDate(yesterdayStart.getDate() - 1)

            const weekStart = new Date(todayStart)
            weekStart.setDate(weekStart.getDate() - 7)

            const monthStart = new Date(todayStart)
            monthStart.setDate(monthStart.getDate() - 30)

            // Today's stats
            const { data: todayData } = await supabase
                .from('page_views')
                .select('id, visitor_id')
                .gte('created_at', todayStart.toISOString())

            // Yesterday's stats
            const { data: yesterdayData } = await supabase
                .from('page_views')
                .select('id, visitor_id')
                .gte('created_at', yesterdayStart.toISOString())
                .lt('created_at', todayStart.toISOString())

            // Week stats
            const { data: weekData } = await supabase
                .from('page_views')
                .select('id')
                .gte('created_at', weekStart.toISOString())

            // Month stats
            const { data: monthData } = await supabase
                .from('page_views')
                .select('id')
                .gte('created_at', monthStart.toISOString())

            // Calculate unique visitors
            const todayVisitors = new Set(todayData?.map(d => d.visitor_id) || []).size
            const yesterdayVisitors = new Set(yesterdayData?.map(d => d.visitor_id) || []).size

            setRealtime({
                today_views: todayData?.length || 0,
                today_visitors: todayVisitors,
                yesterday_views: yesterdayData?.length || 0,
                yesterday_visitors: yesterdayVisitors,
                this_week_views: weekData?.length || 0,
                this_month_views: monthData?.length || 0
            })

            // Get date range for detailed stats
            let daysBack = 7
            if (dateRange === '30days') daysBack = 30
            if (dateRange === '90days') daysBack = 90

            const rangeStart = new Date()
            rangeStart.setDate(rangeStart.getDate() - daysBack)

            // Top pages
            const { data: pagesData } = await supabase
                .from('page_views')
                .select('path')
                .gte('created_at', rangeStart.toISOString())

            if (pagesData) {
                const pageCounts: { [key: string]: number } = {}
                pagesData.forEach(p => {
                    pageCounts[p.path] = (pageCounts[p.path] || 0) + 1
                })
                const sorted = Object.entries(pageCounts)
                    .map(([path, views]) => ({ path, views }))
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 10)
                setTopPages(sorted)
            }

            // Device stats
            const { data: devicesData } = await supabase
                .from('page_views')
                .select('device_type')
                .gte('created_at', rangeStart.toISOString())

            if (devicesData) {
                const devices = { desktop: 0, mobile: 0, tablet: 0 }
                devicesData.forEach(d => {
                    if (d.device_type === 'desktop') devices.desktop++
                    else if (d.device_type === 'mobile') devices.mobile++
                    else if (d.device_type === 'tablet') devices.tablet++
                })
                setDeviceStats(devices)
            }

            // Daily breakdown
            const { data: dailyBreakdown } = await supabase
                .from('page_views')
                .select('created_at, visitor_id')
                .gte('created_at', rangeStart.toISOString())
                .order('created_at', { ascending: true })

            if (dailyBreakdown) {
                const dailyMap: { [key: string]: { views: number; visitors: Set<string> } } = {}
                dailyBreakdown.forEach(d => {
                    const date = new Date(d.created_at).toISOString().split('T')[0]
                    if (!dailyMap[date]) {
                        dailyMap[date] = { views: 0, visitors: new Set() }
                    }
                    dailyMap[date].views++
                    if (d.visitor_id) dailyMap[date].visitors.add(d.visitor_id)
                })
                const dailyArray = Object.entries(dailyMap)
                    .map(([date, data]) => ({
                        date,
                        views: data.views,
                        visitors: data.visitors.size
                    }))
                    .sort((a, b) => a.date.localeCompare(b.date))
                setDailyData(dailyArray)
            }

            // Top referrers
            const { data: referrersData } = await supabase
                .from('page_views')
                .select('referrer')
                .gte('created_at', rangeStart.toISOString())
                .not('referrer', 'is', null)
                .not('referrer', 'eq', '')

            if (referrersData) {
                const refCounts: { [key: string]: number } = {}
                referrersData.forEach(r => {
                    if (r.referrer) {
                        try {
                            const url = new URL(r.referrer)
                            const host = url.hostname
                            refCounts[host] = (refCounts[host] || 0) + 1
                        } catch {
                            refCounts[r.referrer] = (refCounts[r.referrer] || 0) + 1
                        }
                    }
                })
                const sorted = Object.entries(refCounts)
                    .map(([referrer, views]) => ({ referrer, views }))
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 10)
                setTopReferrers(sorted)
            }

        } catch (error) {
            console.error('Error fetching analytics:', error)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    function handleRefresh() {
        setRefreshing(true)
        fetchAnalytics()
    }

    function formatNumber(num: number): string {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
        return num.toString()
    }

    function getChangePercent(current: number, previous: number): { value: number; isUp: boolean } {
        if (previous === 0) return { value: current > 0 ? 100 : 0, isUp: current > 0 }
        const change = ((current - previous) / previous) * 100
        return { value: Math.abs(Math.round(change)), isUp: change >= 0 }
    }

    const viewsChange = getChangePercent(realtime.today_views, realtime.yesterday_views)
    const visitorsChange = getChangePercent(realtime.today_visitors, realtime.yesterday_visitors)

    const totalDevices = deviceStats.desktop + deviceStats.mobile + deviceStats.tablet
    const devicePercent = {
        desktop: totalDevices > 0 ? Math.round((deviceStats.desktop / totalDevices) * 100) : 0,
        mobile: totalDevices > 0 ? Math.round((deviceStats.mobile / totalDevices) * 100) : 0,
        tablet: totalDevices > 0 ? Math.round((deviceStats.tablet / totalDevices) * 100) : 0,
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
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-display text-gray-900">Analytics</h1>
                            <p className="text-gray-500 text-sm">Monitor pengunjung website</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="px-4 py-2 border border-gray-200 bg-white focus:border-olive-600 outline-none"
                            >
                                <option value="7days">7 Hari Terakhir</option>
                                <option value="30days">30 Hari Terakhir</option>
                                <option value="90days">90 Hari Terakhir</option>
                            </select>
                            <button
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="flex items-center gap-2 px-4 py-2 bg-olive-600 text-white hover:bg-olive-900 disabled:opacity-50"
                            >
                                <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                                <span>Refresh</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Today Views */}
                        <div className="bg-white border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Eye size={20} className="text-olive-600" />
                                <div className={`flex items-center gap-1 text-xs ${viewsChange.isUp ? 'text-green-600' : 'text-red-600'}`}>
                                    {viewsChange.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                    <span>{viewsChange.value}%</span>
                                </div>
                            </div>
                            <p className="text-3xl font-display text-gray-900 mb-1">{formatNumber(realtime.today_views)}</p>
                            <p className="text-gray-500 text-sm">Page Views Hari Ini</p>
                        </div>

                        {/* Today Visitors */}
                        <div className="bg-white border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Users size={20} className="text-olive-600" />
                                <div className={`flex items-center gap-1 text-xs ${visitorsChange.isUp ? 'text-green-600' : 'text-red-600'}`}>
                                    {visitorsChange.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                    <span>{visitorsChange.value}%</span>
                                </div>
                            </div>
                            <p className="text-3xl font-display text-gray-900 mb-1">{formatNumber(realtime.today_visitors)}</p>
                            <p className="text-gray-500 text-sm">Unique Visitors Hari Ini</p>
                        </div>

                        {/* Week Views */}
                        <div className="bg-white border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <Calendar size={20} className="text-olive-600" />
                            </div>
                            <p className="text-3xl font-display text-gray-900 mb-1">{formatNumber(realtime.this_week_views)}</p>
                            <p className="text-gray-500 text-sm">Views 7 Hari Terakhir</p>
                        </div>

                        {/* Month Views */}
                        <div className="bg-white border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <TrendingUp size={20} className="text-olive-600" />
                            </div>
                            <p className="text-3xl font-display text-gray-900 mb-1">{formatNumber(realtime.this_month_views)}</p>
                            <p className="text-gray-500 text-sm">Views 30 Hari Terakhir</p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 mb-8">
                        {/* Chart Area */}
                        <div className="lg:col-span-2 bg-white border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-display text-lg text-gray-900">Traffic Overview</h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-olive-600 rounded-sm" />
                                        <span className="text-xs text-gray-500">Page Views</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-olive-300 rounded-sm" />
                                        <span className="text-xs text-gray-500">Visitors</span>
                                    </div>
                                </div>
                            </div>

                            {dailyData.length > 0 ? (
                                <div className="relative">
                                    {/* Y-Axis Labels */}
                                    <div className="absolute left-0 top-0 bottom-8 w-10 flex flex-col justify-between text-right pr-2">
                                        {(() => {
                                            const maxViews = Math.max(...dailyData.map(d => d.views), 1)
                                            return [maxViews, Math.round(maxViews * 0.75), Math.round(maxViews * 0.5), Math.round(maxViews * 0.25), 0].map((val, i) => (
                                                <span key={i} className="text-[10px] text-gray-400">{formatNumber(val)}</span>
                                            ))
                                        })()}
                                    </div>

                                    {/* Chart Container */}
                                    <div className="ml-12">
                                        {/* Grid Lines */}
                                        <div className="absolute left-12 right-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none">
                                            {[0, 1, 2, 3, 4].map((_, i) => (
                                                <div key={i} className="border-t border-gray-100 w-full" />
                                            ))}
                                        </div>

                                        {/* Bars */}
                                        <div className="h-52 flex items-end gap-1 relative">
                                            {dailyData.map((day, i) => {
                                                const maxViews = Math.max(...dailyData.map(d => d.views), 1)
                                                const viewsHeight = (day.views / maxViews) * 100
                                                const visitorsHeight = (day.visitors / maxViews) * 100

                                                return (
                                                    <div
                                                        key={day.date}
                                                        className="flex-1 flex flex-col items-center group cursor-pointer"
                                                    >
                                                        {/* Tooltip */}
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none"
                                                            style={{ left: `${((i + 0.5) / dailyData.length) * 100}%` }}
                                                        >
                                                            <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                                                                <p className="font-medium mb-1">
                                                                    {new Date(day.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
                                                                </p>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <div className="w-2 h-2 bg-olive-400 rounded-full" />
                                                                    <span>{day.views.toLocaleString()} views</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-2 h-2 bg-olive-200 rounded-full" />
                                                                    <span>{day.visitors.toLocaleString()} visitors</span>
                                                                </div>
                                                            </div>
                                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                                                        </div>

                                                        {/* Bar Group */}
                                                        <div className="w-full flex items-end justify-center gap-[2px] h-full">
                                                            {/* Views Bar */}
                                                            <div
                                                                className="w-[45%] bg-gradient-to-t from-olive-700 to-olive-500 rounded-t transition-all duration-300 group-hover:from-olive-600 group-hover:to-olive-400"
                                                                style={{ height: `${Math.max(viewsHeight, 2)}%` }}
                                                            />
                                                            {/* Visitors Bar */}
                                                            <div
                                                                className="w-[45%] bg-gradient-to-t from-olive-400 to-olive-300 rounded-t transition-all duration-300 group-hover:from-olive-300 group-hover:to-olive-200"
                                                                style={{ height: `${Math.max(visitorsHeight, 2)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        {/* X-Axis Labels */}
                                        <div className="flex mt-2 h-6">
                                            {dailyData.map((day, i) => (
                                                <div key={day.date} className="flex-1 text-center">
                                                    <span className="text-[10px] text-gray-400">
                                                        {dailyData.length <= 14
                                                            ? new Date(day.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                                                            : i % Math.ceil(dailyData.length / 7) === 0
                                                                ? new Date(day.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                                                                : ''
                                                        }
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Summary Stats */}
                                    <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4">
                                        <div className="text-center">
                                            <p className="text-2xl font-display text-gray-900">
                                                {formatNumber(dailyData.reduce((sum, d) => sum + d.views, 0))}
                                            </p>
                                            <p className="text-xs text-gray-500">Total Views</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-display text-gray-900">
                                                {formatNumber(dailyData.reduce((sum, d) => sum + d.visitors, 0))}
                                            </p>
                                            <p className="text-xs text-gray-500">Total Visitors</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-display text-gray-900">
                                                {dailyData.length > 0
                                                    ? (dailyData.reduce((sum, d) => sum + d.views, 0) / dailyData.length).toFixed(0)
                                                    : 0
                                                }
                                            </p>
                                            <p className="text-xs text-gray-500">Avg Views/Day</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
                                    <Eye size={48} className="mb-4 opacity-30" />
                                    <p className="text-lg font-medium mb-1">Belum ada data traffic</p>
                                    <p className="text-sm">Data akan muncul setelah ada pengunjung</p>
                                </div>
                            )}
                        </div>

                        {/* Device Breakdown */}
                        <div className="bg-white border border-gray-100 p-6">
                            <h3 className="font-display text-lg text-gray-900 mb-6">Devices</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Monitor size={16} className="text-gray-500" />
                                            <span className="text-sm text-gray-700">Desktop</span>
                                        </div>
                                        <span className="text-sm font-medium">{devicePercent.desktop}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-olive-600 transition-all"
                                            style={{ width: `${devicePercent.desktop}%` }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Smartphone size={16} className="text-gray-500" />
                                            <span className="text-sm text-gray-700">Mobile</span>
                                        </div>
                                        <span className="text-sm font-medium">{devicePercent.mobile}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-olive-400 transition-all"
                                            style={{ width: `${devicePercent.mobile}%` }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Tablet size={16} className="text-gray-500" />
                                            <span className="text-sm text-gray-700">Tablet</span>
                                        </div>
                                        <span className="text-sm font-medium">{devicePercent.tablet}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-olive-300 transition-all"
                                            style={{ width: `${devicePercent.tablet}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <p className="text-sm text-gray-500">Total: {formatNumber(totalDevices)} views</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Top Pages */}
                        <div className="bg-white border border-gray-100 p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <FileText size={18} className="text-olive-600" />
                                <h3 className="font-display text-lg text-gray-900">Top Pages</h3>
                            </div>
                            {topPages.length > 0 ? (
                                <div className="space-y-3">
                                    {topPages.map((page, i) => (
                                        <div key={page.path} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="w-6 h-6 bg-gray-100 text-gray-500 text-xs flex items-center justify-center">
                                                    {i + 1}
                                                </span>
                                                <span className="text-sm text-gray-700 truncate max-w-xs">{page.path}</span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">{formatNumber(page.views)}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm">Belum ada data</p>
                            )}
                        </div>

                        {/* Top Referrers */}
                        <div className="bg-white border border-gray-100 p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Globe size={18} className="text-olive-600" />
                                <h3 className="font-display text-lg text-gray-900">Top Referrers</h3>
                            </div>
                            {topReferrers.length > 0 ? (
                                <div className="space-y-3">
                                    {topReferrers.map((ref, i) => (
                                        <div key={ref.referrer} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="w-6 h-6 bg-gray-100 text-gray-500 text-xs flex items-center justify-center">
                                                    {i + 1}
                                                </span>
                                                <span className="text-sm text-gray-700 truncate max-w-xs">{ref.referrer}</span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">{formatNumber(ref.views)}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm">Belum ada referrer data</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </AdminLayout>
    )
}
