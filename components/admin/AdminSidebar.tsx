'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import {
    Home,
    Calendar,
    TrendingUp,
    LogOut,
    FileText,
    Users,
    ExternalLink,
    Leaf,
    MessageSquare,
    Settings,
    Image,
    Sparkles,
    LayoutDashboard,
    Globe,
    BarChart3,
    Tag,
    Megaphone,
    Download,
    Mail,
    Activity,
    X,
    Menu,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAdminLayout } from '@/contexts/AdminLayoutContext'

const menuGroups = [
    {
        label: 'Main',
        items: [
            { href: '/admin/dashboard', icon: TrendingUp, label: 'Dashboard' },
            { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
            { href: '/admin/reports', icon: Download, label: 'Reports' },
        ]
    },
    {
        label: 'Content',
        items: [
            { href: '/admin/villas', icon: Home, label: 'Villas' },
            { href: '/admin/bookings', icon: Calendar, label: 'Bookings' },
            { href: '/admin/experiences', icon: Sparkles, label: 'Experiences' },
            { href: '/admin/testimonials', icon: MessageSquare, label: 'Testimonials' },
            { href: '/admin/blog', icon: FileText, label: 'Blog' },
        ]
    },
    {
        label: 'Marketing',
        items: [
            { href: '/admin/promos', icon: Tag, label: 'Promo Codes' },
            { href: '/admin/banners', icon: Megaphone, label: 'Promo Banners' },
            { href: '/admin/email-templates', icon: Mail, label: 'Email Templates' },
        ]
    },
    {
        label: 'Homepage',
        items: [
            { href: '/admin/homepage', icon: LayoutDashboard, label: 'Hero & Sections' },
        ]
    },
    {
        label: 'Settings',
        items: [
            { href: '/admin/settings', icon: Settings, label: 'Site Settings' },
            { href: '/admin/media', icon: Image, label: 'Media Library' },
            { href: '/admin/users', icon: Users, label: 'Admin Users' },
            { href: '/admin/activity-log', icon: Activity, label: 'Activity Log' },
        ]
    },
]

export default function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()
    const { sidebarOpen, setSidebarOpen } = useAdminLayout()

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setSidebarOpen(false)
    }, [pathname, setSidebarOpen])

    async function handleLogout() {
        await supabase.auth.signOut()
        router.push('/admin/login')
    }

    return (
        <>
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 z-50 h-screen bg-olive-900 text-white p-4 flex flex-col overflow-y-auto
                    w-64 transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0 lg:z-30
                `}
            >
                {/* Logo */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-9 h-9 bg-olive-600 flex items-center justify-center">
                            <Leaf size={18} className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-display text-lg">StayinUBUD</h1>
                            <p className="text-[10px] text-white/50 uppercase tracking-wider">Admin Panel</p>
                        </div>
                    </div>

                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 hover:bg-olive-600/50 rounded transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 space-y-4">
                    {menuGroups.map((group) => (
                        <div key={group.label}>
                            <p className="text-[10px] text-white/40 uppercase tracking-wider px-4 mb-1">{group.label}</p>
                            <div className="space-y-0.5">
                                {group.items.map((item) => {
                                    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center gap-3 px-4 py-2.5 transition-all text-sm ${isActive
                                                ? 'bg-olive-600 text-white'
                                                : 'text-white/70 hover:bg-olive-600/50 hover:text-white'
                                                }`}
                                        >
                                            <item.icon size={16} />
                                            <span>{item.label}</span>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="border-t border-white/10 pt-3 mt-4 space-y-0.5">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 px-4 py-2.5 text-white/70 hover:bg-olive-600/50 hover:text-white transition-all text-sm"
                    >
                        <Globe size={16} />
                        <span>Lihat Website</span>
                        <ExternalLink size={12} className="ml-auto opacity-50" />
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all text-sm"
                    >
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    )
}

// Mobile Header Component
export function AdminMobileHeader() {
    const { toggleSidebar } = useAdminLayout()
    const pathname = usePathname()

    // Get current page title
    const getPageTitle = () => {
        for (const group of menuGroups) {
            for (const item of group.items) {
                if (pathname === item.href || pathname?.startsWith(item.href + '/')) {
                    return item.label
                }
            }
        }
        return 'Admin'
    }

    return (
        <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-olive-900 text-white px-4 py-3 flex items-center gap-3">
            <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-olive-600/50 rounded transition-colors"
            >
                <Menu size={22} />
            </button>
            <div className="flex items-center gap-2">
                <Leaf size={18} className="text-olive-400" />
                <span className="font-display text-lg">{getPageTitle()}</span>
            </div>
        </header>
    )
}
