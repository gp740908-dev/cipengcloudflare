'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface AdminLayoutContextType {
    sidebarOpen: boolean
    setSidebarOpen: (open: boolean) => void
    toggleSidebar: () => void
}

const AdminLayoutContext = createContext<AdminLayoutContextType | undefined>(undefined)

export function AdminLayoutProvider({ children }: { children: ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const toggleSidebar = () => setSidebarOpen(prev => !prev)

    return (
        <AdminLayoutContext.Provider value={{ sidebarOpen, setSidebarOpen, toggleSidebar }}>
            {children}
        </AdminLayoutContext.Provider>
    )
}

export function useAdminLayout() {
    const context = useContext(AdminLayoutContext)
    if (!context) {
        throw new Error('useAdminLayout must be used within AdminLayoutProvider')
    }
    return context
}
