'use client'

import { ReactNode } from 'react'
import { AdminLayoutProvider } from '@/contexts/AdminLayoutContext'
import AdminSidebar, { AdminMobileHeader } from '@/components/admin/AdminSidebar'

interface AdminLayoutProps {
    children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <AdminLayoutProvider>
            <div className="min-h-screen bg-gray-50">
                {/* Mobile Header */}
                <AdminMobileHeader />

                {/* Sidebar */}
                <AdminSidebar />

                {/* Main Content */}
                <main className="lg:ml-64 min-h-screen pt-14 lg:pt-0">
                    {children}
                </main>
            </div>
        </AdminLayoutProvider>
    )
}
