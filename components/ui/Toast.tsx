'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, AlertTriangle, Info, Loader2 } from 'lucide-react'

// Toast types
type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading'

interface Toast {
    id: string
    type: ToastType
    title: string
    message?: string
    duration?: number
}

interface ToastContextType {
    toasts: Toast[]
    addToast: (toast: Omit<Toast, 'id'>) => string
    removeToast: (id: string) => void
    updateToast: (id: string, toast: Partial<Omit<Toast, 'id'>>) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

// Toast Provider
export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9)
        const newToast: Toast = {
            ...toast,
            id,
            duration: toast.duration ?? (toast.type === 'loading' ? 0 : 5000)
        }

        setToasts(prev => [...prev, newToast])

        // Auto remove if has duration
        if (newToast.duration && newToast.duration > 0) {
            setTimeout(() => {
                removeToast(id)
            }, newToast.duration)
        }

        return id
    }, [])

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }, [])

    const updateToast = useCallback((id: string, updates: Partial<Omit<Toast, 'id'>>) => {
        setToasts(prev => prev.map(toast =>
            toast.id === id ? { ...toast, ...updates } : toast
        ))

        // If updating to a type with duration, set auto-dismiss
        if (updates.type && updates.type !== 'loading') {
            const duration = updates.duration ?? 5000
            setTimeout(() => {
                removeToast(id)
            }, duration)
        }
    }, [removeToast])

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast, updateToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    )
}

// Custom hook
export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }

    const { addToast, removeToast, updateToast } = context

    return {
        toast: addToast,
        dismiss: removeToast,
        update: updateToast,
        success: (title: string, message?: string) =>
            addToast({ type: 'success', title, message }),
        error: (title: string, message?: string) =>
            addToast({ type: 'error', title, message }),
        warning: (title: string, message?: string) =>
            addToast({ type: 'warning', title, message }),
        info: (title: string, message?: string) =>
            addToast({ type: 'info', title, message }),
        loading: (title: string, message?: string) =>
            addToast({ type: 'loading', title, message, duration: 0 }),
        promise: async <T,>(
            promise: Promise<T>,
            { loading, success, error }: {
                loading: string
                success: string | ((data: T) => string)
                error: string | ((err: any) => string)
            }
        ) => {
            const id = addToast({ type: 'loading', title: loading })
            try {
                const data = await promise
                updateToast(id, {
                    type: 'success',
                    title: typeof success === 'function' ? success(data) : success
                })
                return data
            } catch (err) {
                updateToast(id, {
                    type: 'error',
                    title: typeof error === 'function' ? error(err) : error
                })
                throw err
            }
        }
    }
}

// Toast Container
function ToastContainer({ toasts, removeToast }: { toasts: Toast[], removeToast: (id: string) => void }) {
    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none max-w-md w-full">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
                ))}
            </AnimatePresence>
        </div>
    )
}

// Individual Toast
function ToastItem({ toast, onDismiss }: { toast: Toast, onDismiss: () => void }) {
    const icons = {
        success: Check,
        error: X,
        warning: AlertTriangle,
        info: Info,
        loading: Loader2
    }

    const colors = {
        success: {
            bg: 'bg-gradient-to-r from-emerald-50 to-emerald-100/80',
            border: 'border-emerald-200',
            icon: 'bg-emerald-600 text-white',
            title: 'text-emerald-900',
            message: 'text-emerald-700'
        },
        error: {
            bg: 'bg-gradient-to-r from-red-50 to-red-100/80',
            border: 'border-red-200',
            icon: 'bg-red-600 text-white',
            title: 'text-red-900',
            message: 'text-red-700'
        },
        warning: {
            bg: 'bg-gradient-to-r from-amber-50 to-amber-100/80',
            border: 'border-amber-200',
            icon: 'bg-amber-500 text-white',
            title: 'text-amber-900',
            message: 'text-amber-700'
        },
        info: {
            bg: 'bg-gradient-to-r from-slate-50 to-slate-100/80',
            border: 'border-slate-200',
            icon: 'bg-slate-600 text-white',
            title: 'text-slate-900',
            message: 'text-slate-600'
        },
        loading: {
            bg: 'bg-gradient-to-r from-olive-50 to-olive-100/80',
            border: 'border-olive-200',
            icon: 'bg-olive-600 text-white',
            title: 'text-olive-900',
            message: 'text-olive-700'
        }
    }

    const Icon = icons[toast.type]
    const colorScheme = colors[toast.type]

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30,
                mass: 0.8
            }}
            className={`
                pointer-events-auto
                ${colorScheme.bg} ${colorScheme.border}
                border backdrop-blur-xl
                rounded-sm shadow-lg shadow-black/5
                overflow-hidden
            `}
        >
            <div className="flex items-start gap-4 p-4">
                {/* Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 500 }}
                    className={`
                        flex-shrink-0 w-8 h-8 rounded-sm flex items-center justify-center
                        ${colorScheme.icon}
                    `}
                >
                    <Icon
                        size={16}
                        className={toast.type === 'loading' ? 'animate-spin' : ''}
                    />
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                    <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 }}
                        className={`font-medium text-sm ${colorScheme.title}`}
                    >
                        {toast.title}
                    </motion.p>
                    {toast.message && (
                        <motion.p
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className={`text-xs mt-1 ${colorScheme.message}`}
                        >
                            {toast.message}
                        </motion.p>
                    )}
                </div>

                {/* Close Button */}
                {toast.type !== 'loading' && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        onClick={onDismiss}
                        className="flex-shrink-0 p-1 rounded-sm hover:bg-black/5 transition-colors"
                    >
                        <X size={14} className="text-gray-400" />
                    </motion.button>
                )}
            </div>

            {/* Progress Bar */}
            {toast.duration && toast.duration > 0 && (
                <motion.div
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    transition={{ duration: toast.duration / 1000, ease: 'linear' }}
                    className="h-0.5 bg-black/10 origin-left"
                />
            )}
        </motion.div>
    )
}

// Standalone Toast Component (for non-context usage)
export function Toast({
    type,
    title,
    message,
    onDismiss,
    show
}: {
    type: ToastType
    title: string
    message?: string
    onDismiss?: () => void
    show: boolean
}) {
    return (
        <AnimatePresence>
            {show && (
                <div className="fixed bottom-6 right-6 z-[100] max-w-md">
                    <ToastItem
                        toast={{ id: '1', type, title, message }}
                        onDismiss={onDismiss || (() => { })}
                    />
                </div>
            )}
        </AnimatePresence>
    )
}
