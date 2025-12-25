'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    Activity,
    Search,
    Filter,
    Loader2,
    User,
    Home,
    Calendar,
    FileText,
    Settings,
    Trash2,
    Edit,
    Plus,
    Eye,
    Download,
    Mail,
    Tag,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ActivityLog } from '@/types'
import { format, parseISO, formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'
import AdminLayout from '@/components/admin/AdminLayout'

const actionIcons: Record<string, any> = {
    create: Plus,
    update: Edit,
    delete: Trash2,
    view: Eye,
    login: User,
    logout: User,
    export: Download,
    email: Mail,
}

const entityIcons: Record<string, any> = {
    villa: Home,
    booking: Calendar,
    blog: FileText,
    promo: Tag,
    settings: Settings,
    user: User,
}

const actionColors: Record<string, string> = {
    create: 'bg-green-100 text-green-700',
    update: 'bg-blue-100 text-blue-700',
    delete: 'bg-red-100 text-red-700',
    view: 'bg-gray-100 text-gray-700',
    login: 'bg-olive-100 text-olive-700',
    logout: 'bg-amber-100 text-amber-700',
    export: 'bg-purple-100 text-purple-700',
    email: 'bg-cyan-100 text-cyan-700',
}

export default function AdminActivityLogPage() {
    const router = useRouter()
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [logs, setLogs] = useState<ActivityLog[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [filterAction, setFilterAction] = useState('')
    const [filterEntity, setFilterEntity] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const perPage = 20

    useEffect(() => {
        checkAuth()
    }, [])

    useEffect(() => {
        fetchLogs()
    }, [page, filterAction, filterEntity])

    async function checkAuth() {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            router.push('/admin/login')
            return
        }
    }

    async function fetchLogs() {
        setLoading(true)
        try {
            let query = supabase
                .from('activity_logs')
                .select('*', { count: 'exact' })
                .order('created_at', { ascending: false })

            if (filterAction) {
                query = query.eq('action', filterAction)
            }

            if (filterEntity) {
                query = query.eq('entity_type', filterEntity)
            }

            // Pagination
            const from = (page - 1) * perPage
            const to = from + perPage - 1
            query = query.range(from, to)

            const { data, error, count } = await query

            if (error) throw error
            setLogs(data || [])
            setTotalPages(Math.ceil((count || 0) / perPage))
        } catch (error) {
            console.error('Error fetching activity logs:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredLogs = logs.filter(log =>
        searchQuery === '' ||
        log.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.entity_name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getActionIcon = (action: string) => {
        const Icon = actionIcons[action] || Activity
        return Icon
    }

    const getEntityIcon = (entity: string | null) => {
        if (!entity) return Activity
        const Icon = entityIcons[entity] || Activity
        return Icon
    }

    const getActionColor = (action: string) => {
        return actionColors[action] || 'bg-gray-100 text-gray-700'
    }

    return (
        <AdminLayout>
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-xl sm:text-2xl font-display text-gray-900">Activity Log</h1>
                        <p className="text-gray-500 text-sm">Pantau semua aktivitas di admin panel</p>
                    </div>

                    {/* Filters */}
                    <div className="bg-white border border-gray-100 p-4 mb-6">
                        <div className="flex flex-wrap items-center gap-4">
                            {/* Search */}
                            <div className="flex-1 min-w-[200px] relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari email, aksi, atau nama..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 focus:border-olive-600 outline-none text-sm"
                                />
                            </div>

                            {/* Action Filter */}
                            <select
                                value={filterAction}
                                onChange={(e) => { setFilterAction(e.target.value); setPage(1); }}
                                className="px-4 py-2 border border-gray-200 focus:border-olive-600 outline-none text-sm"
                            >
                                <option value="">Semua Aksi</option>
                                <option value="create">Create</option>
                                <option value="update">Update</option>
                                <option value="delete">Delete</option>
                                <option value="login">Login</option>
                                <option value="logout">Logout</option>
                                <option value="export">Export</option>
                            </select>

                            {/* Entity Filter */}
                            <select
                                value={filterEntity}
                                onChange={(e) => { setFilterEntity(e.target.value); setPage(1); }}
                                className="px-4 py-2 border border-gray-200 focus:border-olive-600 outline-none text-sm"
                            >
                                <option value="">Semua Entity</option>
                                <option value="villa">Villa</option>
                                <option value="booking">Booking</option>
                                <option value="blog">Blog</option>
                                <option value="promo">Promo</option>
                                <option value="settings">Settings</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                    </div>

                    {/* Activity List */}
                    {loading ? (
                        <div className="text-center py-20">
                            <Loader2 size={40} className="animate-spin text-olive-600 mx-auto" />
                        </div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="bg-white border border-gray-100 p-12 text-center">
                            <Activity size={48} className="text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-500">Belum ada aktivitas tercatat</p>
                        </div>
                    ) : (
                        <div className="bg-white border border-gray-100">
                            <div className="divide-y divide-gray-100">
                                {filteredLogs.map((log, index) => {
                                    const ActionIcon = getActionIcon(log.action)
                                    const EntityIcon = getEntityIcon(log.entity_type)

                                    return (
                                        <motion.div
                                            key={log.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.02 }}
                                            className="p-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Action Icon */}
                                                <div className={`w-10 h-10 flex items-center justify-center ${getActionColor(log.action)}`}>
                                                    <ActionIcon size={18} />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-medium text-gray-900">
                                                            {log.user_email || 'System'}
                                                        </span>
                                                        <span className="text-gray-400">•</span>
                                                        <span className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${getActionColor(log.action)}`}>
                                                            {log.action}
                                                        </span>
                                                    </div>

                                                    <p className="text-sm text-gray-600">
                                                        {log.entity_type && (
                                                            <span className="inline-flex items-center gap-1 mr-1">
                                                                <EntityIcon size={14} className="text-gray-400" />
                                                                <span className="capitalize">{log.entity_type}</span>
                                                            </span>
                                                        )}
                                                        {log.entity_name && (
                                                            <span className="font-medium">"{log.entity_name}"</span>
                                                        )}
                                                    </p>

                                                    {log.details && (
                                                        <div className="mt-2 p-2 bg-gray-50 text-xs font-mono text-gray-500 overflow-x-auto">
                                                            {JSON.stringify(log.details, null, 2)}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Time */}
                                                <div className="text-right flex-shrink-0">
                                                    <p className="text-xs text-gray-400">
                                                        {formatDistanceToNow(parseISO(log.created_at), { addSuffix: true, locale: id })}
                                                    </p>
                                                    <p className="text-[10px] text-gray-300">
                                                        {format(parseISO(log.created_at), 'dd/MM/yyyy HH:mm')}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between p-4 border-t border-gray-100">
                                    <p className="text-sm text-gray-500">
                                        Halaman {page} dari {totalPages}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="p-2 border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        <button
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                            className="p-2 border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </AdminLayout>
    )
}
