'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    Plus,
    Trash2,
    Loader2,
    Users,
    Shield,
    Mail,
    AlertCircle
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AdminUser } from '@/types'
import { format, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/ui/Toast'

export default function AdminUsersPage() {
    const router = useRouter()
    const supabase = createClient()
    const toast = useToast()

    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState<AdminUser[]>([])
    const [deleting, setDeleting] = useState<string | null>(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const [newEmail, setNewEmail] = useState('')
    const [newRole, setNewRole] = useState<'admin' | 'super_admin'>('admin')
    const [adding, setAdding] = useState(false)
    const [currentUserEmail, setCurrentUserEmail] = useState('')

    useEffect(() => {
        checkAuth()
        fetchUsers()
    }, [])

    async function checkAuth() {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            router.push('/admin/login')
            return
        }
        setCurrentUserEmail(session.user.email || '')
    }

    async function fetchUsers() {
        try {
            const { data, error } = await supabase
                .from('admin_users')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setUsers(data || [])
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: string, email: string) {
        if (email === currentUserEmail) {
            toast.warning('Anda tidak bisa menghapus akun sendiri')
            return
        }

        if (!confirm('Apakah Anda yakin ingin menghapus admin ini?')) return

        setDeleting(id)
        try {
            const { error } = await supabase
                .from('admin_users')
                .delete()
                .eq('id', id)

            if (error) throw error
            toast.success('Admin berhasil dihapus')
            setUsers(users.filter(u => u.id !== id))
        } catch (error: any) {
            console.error('Error deleting user:', error)
            toast.error('Gagal menghapus admin', error.message)
        } finally {
            setDeleting(null)
        }
    }

    async function handleAddUser(e: React.FormEvent) {
        e.preventDefault()

        if (!newEmail.trim()) {
            toast.warning('Email wajib diisi')
            return
        }

        setAdding(true)
        try {
            const { error } = await supabase
                .from('admin_users')
                .insert({
                    email: newEmail.trim().toLowerCase(),
                    role: newRole,
                })

            if (error) throw error

            toast.success('Admin berhasil ditambahkan')
            setNewEmail('')
            setNewRole('admin')
            setShowAddModal(false)
            fetchUsers()
        } catch (error: any) {
            console.error('Error adding user:', error)
            if (error.code === '23505') {
                toast.error('Email sudah terdaftar sebagai admin')
            } else {
                toast.error('Gagal menambahkan admin', error.message)
            }
        } finally {
            setAdding(false)
        }
    }

    return (
        <AdminLayout>
            {/* Main Content */}
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-display text-gray-900">Admin Users</h2>
                            <p className="text-gray-500 text-sm">Kelola akses admin panel</p>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-olive-600 text-white text-sm font-medium hover:bg-olive-900 transition-colors"
                        >
                            <Plus size={16} />
                            <span>Tambah Admin</span>
                        </button>
                    </div>

                    {/* Info Box */}
                    <div className="bg-amber-50 border border-amber-200 p-4 mb-6 flex items-start gap-3">
                        <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800">
                            <strong>Catatan:</strong> Untuk login sebagai admin, user harus terdaftar di Supabase Authentication
                            dan email-nya tercatat di tabel admin_users ini.
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <Loader2 size={40} className="animate-spin text-olive-600 mx-auto" />
                            <p className="mt-4 text-gray-500 text-sm">Memuat data admin...</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-20 bg-white border border-gray-100">
                            <Users size={48} className="text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Belum ada admin</p>
                        </div>
                    ) : (
                        <div className="bg-white border border-gray-100">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Ditambahkan</th>
                                        <th className="text-right px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.map((user) => (
                                        <motion.tr
                                            key={user.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 bg-olive-100 flex items-center justify-center">
                                                        <Mail size={16} className="text-olive-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{user.email}</p>
                                                        {user.email === currentUserEmail && (
                                                            <span className="text-xs text-olive-600">(Anda)</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium ${user.role === 'super_admin'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'bg-olive-100 text-olive-700'
                                                    }`}>
                                                    <Shield size={12} />
                                                    <span>{user.role === 'super_admin' ? 'Super Admin' : 'Admin'}</span>
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-gray-500">
                                                {format(parseISO(user.created_at), 'dd MMM yyyy', { locale: id })}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-end">
                                                    <button
                                                        onClick={() => handleDelete(user.id, user.email)}
                                                        disabled={deleting === user.id || user.email === currentUserEmail}
                                                        className="p-2 hover:bg-gray-100 transition-colors text-gray-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                                        title={user.email === currentUserEmail ? 'Tidak bisa hapus akun sendiri' : 'Hapus'}
                                                    >
                                                        {deleting === user.id ? (
                                                            <Loader2 size={18} className="animate-spin" />
                                                        ) : (
                                                            <Trash2 size={18} />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* Add Admin Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white p-8 w-full max-w-md"
                    >
                        <h3 className="text-xl font-display text-gray-900 mb-6">Tambah Admin Baru</h3>

                        <form onSubmit={handleAddUser} className="space-y-5">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Role
                                </label>
                                <select
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value as 'admin' | 'super_admin')}
                                    className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="super_admin">Super Admin</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={adding}
                                    className="flex items-center gap-2 px-4 py-2 bg-olive-600 text-white hover:bg-olive-900 disabled:opacity-50 transition-colors"
                                >
                                    {adding ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Plus size={16} />
                                    )}
                                    <span>Tambah</span>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AdminLayout>
    )
}
