'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Mail,
    Plus,
    Edit,
    Trash2,
    Loader2,
    X,
    Eye,
    Code,
    Send,
    CheckCircle,
    XCircle,
    Clock,
    FileText,
    Tag,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { EmailTemplate, EmailLog } from '@/types'
import { format, parseISO, formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/ui/Toast'

const categoryColors: Record<string, string> = {
    booking: 'bg-olive-100 text-olive-700',
    notification: 'bg-blue-100 text-blue-700',
    marketing: 'bg-purple-100 text-purple-700',
    general: 'bg-gray-100 text-gray-700',
}

export default function AdminEmailTemplatesPage() {
    const router = useRouter()
    const supabase = createClient()
    const toast = useToast()

    const [loading, setLoading] = useState(true)
    const [templates, setTemplates] = useState<EmailTemplate[]>([])
    const [emailLogs, setEmailLogs] = useState<EmailLog[]>([])
    const [activeTab, setActiveTab] = useState<'templates' | 'logs'>('templates')
    const [showModal, setShowModal] = useState(false)
    const [showPreview, setShowPreview] = useState(false)
    const [editing, setEditing] = useState<EmailTemplate | null>(null)
    const [saving, setSaving] = useState(false)
    const [previewHtml, setPreviewHtml] = useState('')

    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        html_content: '',
        text_content: '',
        variables: '',
        category: 'general' as 'booking' | 'notification' | 'marketing' | 'general',
        is_active: true,
    })

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
    }

    async function fetchData() {
        setLoading(true)
        try {
            const [templatesRes, logsRes] = await Promise.all([
                supabase.from('email_templates').select('*').order('created_at', { ascending: false }),
                supabase.from('email_logs').select('*').order('created_at', { ascending: false }).limit(50),
            ])

            if (templatesRes.error) throw templatesRes.error
            if (logsRes.error) throw logsRes.error

            setTemplates(templatesRes.data || [])
            setEmailLogs(logsRes.data || [])
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    function openAddModal() {
        setEditing(null)
        setFormData({
            name: '',
            subject: '',
            html_content: getDefaultTemplate(),
            text_content: '',
            variables: '',
            category: 'general',
            is_active: true,
        })
        setShowModal(true)
    }

    function openEditModal(template: EmailTemplate) {
        setEditing(template)
        setFormData({
            name: template.name,
            subject: template.subject,
            html_content: template.html_content,
            text_content: template.text_content || '',
            variables: template.variables?.join(', ') || '',
            category: template.category,
            is_active: template.is_active,
        })
        setShowModal(true)
    }

    function getDefaultTemplate() {
        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Georgia, serif; color: #1a1a1a; background: #f5f3ef; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: #4A5D23; padding: 40px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; font-weight: normal; }
        .content { padding: 40px; }
        .footer { background: #f5f3ef; padding: 30px; text-align: center; color: #666; font-size: 14px; }
        .btn { display: inline-block; padding: 16px 32px; background: #4A5D23; color: white; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>StayinUBUD</h1>
        </div>
        <div class="content">
            <p>Dear {{recipient_name}},</p>
            <p>Your content here...</p>
        </div>
        <div class="footer">
            <p>StayinUBUD - Luxury Villa Rentals in Ubud, Bali</p>
            <p>© 2024 StayinUBUD. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!formData.name.trim() || !formData.subject.trim() || !formData.html_content.trim()) {
            toast.warning('Nama, subject, dan HTML content wajib diisi')
            return
        }

        setSaving(true)
        try {
            const templateData = {
                name: formData.name.toLowerCase().replace(/\s+/g, '_'),
                subject: formData.subject,
                html_content: formData.html_content,
                text_content: formData.text_content || null,
                variables: formData.variables.split(',').map(v => v.trim()).filter(v => v),
                category: formData.category,
                is_active: formData.is_active,
            }

            if (editing) {
                const { error } = await supabase
                    .from('email_templates')
                    .update(templateData)
                    .eq('id', editing.id)

                if (error) throw error
                toast.success('Template berhasil diperbarui')
            } else {
                const { error } = await supabase
                    .from('email_templates')
                    .insert(templateData)

                if (error) throw error
                toast.success('Template berhasil ditambahkan')
            }

            setShowModal(false)
            fetchData()
        } catch (error: any) {
            console.error('Error saving template:', error)
            if (error.code === '23505') {
                toast.error('Nama template sudah digunakan')
            } else {
                toast.error('Gagal menyimpan template', error.message)
            }
        } finally {
            setSaving(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Yakin ingin menghapus template ini?')) return

        try {
            const { error } = await supabase
                .from('email_templates')
                .delete()
                .eq('id', id)

            if (error) throw error
            toast.success('Template berhasil dihapus')
            setTemplates(templates.filter(t => t.id !== id))
        } catch (error: any) {
            console.error('Error deleting template:', error)
            toast.error('Gagal menghapus template', error.message)
        }
    }

    function openPreview(html: string) {
        setPreviewHtml(html)
        setShowPreview(true)
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'sent':
            case 'delivered':
                return <CheckCircle size={14} className="text-green-500" />
            case 'failed':
            case 'bounced':
                return <XCircle size={14} className="text-red-500" />
            default:
                return <Clock size={14} className="text-amber-500" />
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
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-display text-gray-900">Email Templates</h1>
                            <p className="text-gray-500 text-sm">Kelola template email dengan Resend</p>
                        </div>
                        {activeTab === 'templates' && (
                            <button
                                onClick={openAddModal}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-olive-600 text-white text-sm font-medium hover:bg-olive-700 transition-colors"
                            >
                                <Plus size={16} />
                                <span>Tambah Template</span>
                            </button>
                        )}
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-1 mb-6 bg-white border border-gray-100 p-1 w-fit">
                        <button
                            onClick={() => setActiveTab('templates')}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'templates'
                                ? 'bg-olive-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <FileText size={14} className="inline mr-2" />
                            Templates
                        </button>
                        <button
                            onClick={() => setActiveTab('logs')}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'logs'
                                ? 'bg-olive-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Send size={14} className="inline mr-2" />
                            Email Logs
                        </button>
                    </div>

                    {activeTab === 'templates' ? (
                        /* Templates List */
                        templates.length === 0 ? (
                            <div className="bg-white border border-gray-100 p-12 text-center">
                                <Mail size={48} className="text-gray-200 mx-auto mb-4" />
                                <p className="text-gray-500 mb-4">Belum ada template email</p>
                                <button
                                    onClick={openAddModal}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-olive-600 text-white text-sm hover:bg-olive-700 transition-colors"
                                >
                                    <Plus size={16} />
                                    <span>Buat Template</span>
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {templates.map((template, index) => (
                                    <motion.div
                                        key={template.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`bg-white border p-5 ${template.is_active ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                                                    <span className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${categoryColors[template.category]}`}>
                                                        {template.category}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 mb-2">{template.subject}</p>
                                                {template.variables && template.variables.length > 0 && (
                                                    <div className="flex items-center gap-1 flex-wrap">
                                                        <Tag size={12} className="text-gray-400" />
                                                        {template.variables.map((v, i) => (
                                                            <code key={i} className="px-1.5 py-0.5 bg-gray-100 text-[10px] text-gray-600">
                                                                {`{{${v}}}`}
                                                            </code>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openPreview(template.html_content)}
                                                    className="p-2 text-gray-400 hover:text-olive-600"
                                                    title="Preview"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(template)}
                                                    className="p-2 text-gray-400 hover:text-blue-600"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(template.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )
                    ) : (
                        /* Email Logs */
                        emailLogs.length === 0 ? (
                            <div className="bg-white border border-gray-100 p-12 text-center">
                                <Send size={48} className="text-gray-200 mx-auto mb-4" />
                                <p className="text-gray-500">Belum ada email yang dikirim</p>
                            </div>
                        ) : (
                            <div className="bg-white border border-gray-100">
                                <div className="divide-y divide-gray-100">
                                    {emailLogs.map((log) => (
                                        <div key={log.id} className="p-4 hover:bg-gray-50">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3">
                                                    {getStatusIcon(log.status)}
                                                    <div>
                                                        <p className="font-medium text-gray-900 text-sm">
                                                            {log.recipient_email}
                                                        </p>
                                                        <p className="text-xs text-gray-500">{log.subject}</p>
                                                        {log.template_name && (
                                                            <span className="text-[10px] text-gray-400">
                                                                Template: {log.template_name}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`text-xs px-2 py-0.5 ${log.status === 'sent' || log.status === 'delivered'
                                                        ? 'bg-green-100 text-green-700'
                                                        : log.status === 'failed' || log.status === 'bounced'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                        {log.status}
                                                    </span>
                                                    <p className="text-[10px] text-gray-400 mt-1">
                                                        {formatDistanceToNow(parseISO(log.created_at), { addSuffix: true, locale: id })}
                                                    </p>
                                                </div>
                                            </div>
                                            {log.error_message && (
                                                <p className="text-xs text-red-500 mt-2 pl-7">{log.error_message}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
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
                            className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                                <h2 className="font-display text-xl text-gray-900">
                                    {editing ? 'Edit Template' : 'Buat Template Baru'}
                                </h2>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            Nama Template *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="booking_confirmation"
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none font-mono text-sm"
                                            required
                                        />
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            Kategori
                                        </label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none"
                                        >
                                            <option value="booking">Booking</option>
                                            <option value="notification">Notification</option>
                                            <option value="marketing">Marketing</option>
                                            <option value="general">General</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Subject */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                        Email Subject *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        placeholder="Booking Confirmed - {{villa_name}} | StayinUBUD"
                                        className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none"
                                        required
                                    />
                                </div>

                                {/* Variables */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                        Variabel (pisahkan dengan koma)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.variables}
                                        onChange={(e) => setFormData({ ...formData, variables: e.target.value })}
                                        placeholder="guest_name, booking_id, villa_name, check_in, check_out"
                                        className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none font-mono text-sm"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        Gunakan format {'{{variable_name}}'} di dalam template
                                    </p>
                                </div>

                                {/* HTML Content */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            HTML Content *
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => openPreview(formData.html_content)}
                                            className="text-xs text-olive-600 hover:underline flex items-center gap-1"
                                        >
                                            <Eye size={12} />
                                            Preview
                                        </button>
                                    </div>
                                    <textarea
                                        value={formData.html_content}
                                        onChange={(e) => setFormData({ ...formData, html_content: e.target.value })}
                                        rows={15}
                                        className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none font-mono text-xs resize-none"
                                        required
                                    />
                                </div>

                                {/* Text Content */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                        Plain Text Version (opsional)
                                    </label>
                                    <textarea
                                        value={formData.text_content}
                                        onChange={(e) => setFormData({ ...formData, text_content: e.target.value })}
                                        rows={5}
                                        className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none font-mono text-sm resize-none"
                                    />
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
                                        Aktifkan template
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

            {/* Preview Modal */}
            <AnimatePresence>
                {showPreview && (
                    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
                        >
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-medium text-gray-900">Email Preview</h3>
                                <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-gray-100">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-auto bg-gray-100 p-4">
                                <iframe
                                    srcDoc={previewHtml}
                                    className="w-full h-full min-h-[500px] bg-white"
                                    title="Email Preview"
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    )
}
