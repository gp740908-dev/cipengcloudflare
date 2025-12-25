'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Save,
    Loader2,
    Settings,
    Phone,
    Mail,
    MapPin,
    Globe,
    Instagram,
    Facebook,
    Youtube,
    Search,
    FileText
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/ui/Toast'

interface SettingsData {
    general: {
        site_name: string
        tagline: string
    }
    contact: {
        phone: string
        email: string
        whatsapp: string
        address: string
    }
    social: {
        instagram: string
        facebook: string
        tiktok: string
        youtube: string
    }
    seo: {
        meta_title: string
        meta_description: string
        google_analytics_id: string
    }
    footer: {
        copyright: string
        show_newsletter: boolean
    }
}

const defaultSettings: SettingsData = {
    general: { site_name: 'StayinUBUD', tagline: 'Luxury Villa Rentals in Ubud, Bali' },
    contact: { phone: '+62 812 3456 7890', email: 'hello@stayinubud.com', whatsapp: '6281234567890', address: 'Ubud, Bali, Indonesia' },
    social: { instagram: '', facebook: '', tiktok: '', youtube: '' },
    seo: { meta_title: '', meta_description: '', google_analytics_id: '' },
    footer: { copyright: '© 2024 StayinUBUD. All rights reserved.', show_newsletter: true }
}

export default function SettingsPage() {
    const router = useRouter()
    const supabase = createClient()
    const toast = useToast()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState('general')
    const [settings, setSettings] = useState<SettingsData>(defaultSettings)

    useEffect(() => {
        checkAuth()
        fetchSettings()
    }, [])

    async function checkAuth() {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            router.push('/admin/login')
        }
    }

    async function fetchSettings() {
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('key, value')

            if (error) throw error

            if (data && data.length > 0) {
                const newSettings = { ...defaultSettings }
                data.forEach((row) => {
                    if (row.key in newSettings) {
                        (newSettings as any)[row.key] = row.value
                    }
                })
                setSettings(newSettings)
            }
        } catch (error) {
            console.error('Error fetching settings:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleSave() {
        setSaving(true)
        const loadingId = toast.loading('Menyimpan pengaturan...')
        try {
            // Save each settings group
            for (const [key, value] of Object.entries(settings)) {
                // First try to update
                const { data: existingData } = await supabase
                    .from('site_settings')
                    .select('id')
                    .eq('key', key)
                    .single()

                let error;
                if (existingData) {
                    // Update existing record
                    const result = await supabase
                        .from('site_settings')
                        .update({ value, updated_at: new Date().toISOString() })
                        .eq('key', key)
                    error = result.error
                } else {
                    // Insert new record
                    const result = await supabase
                        .from('site_settings')
                        .insert({ key, value, updated_at: new Date().toISOString() })
                    error = result.error
                }

                if (error) {
                    console.error(`Error saving ${key}:`, error)
                    throw error
                }
            }
            toast.update(loadingId, { type: 'success', title: 'Pengaturan berhasil disimpan!' })
        } catch (error: any) {
            console.error('Error saving settings:', error)
            toast.update(loadingId, { type: 'error', title: 'Gagal menyimpan pengaturan', message: error.message })
        } finally {
            setSaving(false)
        }
    }


    const tabs = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'contact', label: 'Contact', icon: Phone },
        { id: 'social', label: 'Social Media', icon: Instagram },
        { id: 'seo', label: 'SEO', icon: Search },
        { id: 'footer', label: 'Footer', icon: FileText },
    ]

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
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-display text-gray-900">Site Settings</h1>
                            <p className="text-gray-500 text-sm">Kelola pengaturan website</p>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-olive-600 text-white hover:bg-olive-900 transition-colors disabled:opacity-50"
                        >
                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            <span>Simpan Semua</span>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 text-sm whitespace-nowrap transition-colors ${activeTab === tab.id
                                    ? 'bg-olive-600 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                <tab.icon size={16} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="bg-white border border-gray-100 p-8">
                        {/* General Settings */}
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <h3 className="font-display text-lg text-gray-900 mb-4">General Settings</h3>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                        Site Name
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.general.site_name}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            general: { ...settings.general, site_name: e.target.value }
                                        })}
                                        className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                        Tagline
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.general.tagline}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            general: { ...settings.general, tagline: e.target.value }
                                        })}
                                        className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Contact Settings */}
                        {activeTab === 'contact' && (
                            <div className="space-y-6">
                                <h3 className="font-display text-lg text-gray-900 mb-4">Contact Information</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            <Phone size={12} className="inline mr-1" /> Phone Number
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.contact.phone}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                contact: { ...settings.contact, phone: e.target.value }
                                            })}
                                            placeholder="+62 812 3456 7890"
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            <Mail size={12} className="inline mr-1" /> Email
                                        </label>
                                        <input
                                            type="email"
                                            value={settings.contact.email}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                contact: { ...settings.contact, email: e.target.value }
                                            })}
                                            placeholder="hello@stayinubud.com"
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            WhatsApp Number (tanpa +)
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.contact.whatsapp}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                contact: { ...settings.contact, whatsapp: e.target.value }
                                            })}
                                            placeholder="6281234567890"
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">Format: 628xxxx (tanpa + atau spasi)</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            <MapPin size={12} className="inline mr-1" /> Address
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.contact.address}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                contact: { ...settings.contact, address: e.target.value }
                                            })}
                                            placeholder="Ubud, Bali, Indonesia"
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Social Media Settings */}
                        {activeTab === 'social' && (
                            <div className="space-y-6">
                                <h3 className="font-display text-lg text-gray-900 mb-4">Social Media Links</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            <Instagram size={12} className="inline mr-1" /> Instagram URL
                                        </label>
                                        <input
                                            type="url"
                                            value={settings.social.instagram}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                social: { ...settings.social, instagram: e.target.value }
                                            })}
                                            placeholder="https://instagram.com/stayinubud"
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            <Facebook size={12} className="inline mr-1" /> Facebook URL
                                        </label>
                                        <input
                                            type="url"
                                            value={settings.social.facebook}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                social: { ...settings.social, facebook: e.target.value }
                                            })}
                                            placeholder="https://facebook.com/stayinubud"
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            TikTok URL
                                        </label>
                                        <input
                                            type="url"
                                            value={settings.social.tiktok}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                social: { ...settings.social, tiktok: e.target.value }
                                            })}
                                            placeholder="https://tiktok.com/@stayinubud"
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                            <Youtube size={12} className="inline mr-1" /> YouTube URL
                                        </label>
                                        <input
                                            type="url"
                                            value={settings.social.youtube}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                social: { ...settings.social, youtube: e.target.value }
                                            })}
                                            placeholder="https://youtube.com/@stayinubud"
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SEO Settings */}
                        {activeTab === 'seo' && (
                            <div className="space-y-6">
                                <h3 className="font-display text-lg text-gray-900 mb-4">SEO Settings</h3>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                        Default Meta Title
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.seo.meta_title}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            seo: { ...settings.seo, meta_title: e.target.value }
                                        })}
                                        placeholder="StayinUBUD - Luxury Villa Rentals in Ubud, Bali"
                                        className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Optimal: 50-60 karakter</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                        Default Meta Description
                                    </label>
                                    <textarea
                                        value={settings.seo.meta_description}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            seo: { ...settings.seo, meta_description: e.target.value }
                                        })}
                                        rows={3}
                                        placeholder="Experience luxury in the heart of Ubud..."
                                        className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors resize-none"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Optimal: 150-160 karakter</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                        Google Analytics ID
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.seo.google_analytics_id}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            seo: { ...settings.seo, google_analytics_id: e.target.value }
                                        })}
                                        placeholder="G-XXXXXXXXXX"
                                        className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Footer Settings */}
                        {activeTab === 'footer' && (
                            <div className="space-y-6">
                                <h3 className="font-display text-lg text-gray-900 mb-4">Footer Settings</h3>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                        Copyright Text
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.footer.copyright}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            footer: { ...settings.footer, copyright: e.target.value }
                                        })}
                                        placeholder="© 2024 StayinUBUD. All rights reserved."
                                        className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="show_newsletter"
                                        checked={settings.footer.show_newsletter}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            footer: { ...settings.footer, show_newsletter: e.target.checked }
                                        })}
                                        className="w-5 h-5 accent-olive-600"
                                    />
                                    <label htmlFor="show_newsletter" className="text-gray-700">
                                        Tampilkan Newsletter Section di Footer
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </AdminLayout>
    )
}
