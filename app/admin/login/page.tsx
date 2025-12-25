'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Mail, Loader2, AlertCircle, CheckCircle, Leaf } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'

export default function AdminLoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [step, setStep] = useState('')

    const supabase = createClient()

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setStep('')
        setLoading(true)

        const normalizedEmail = email.trim().toLowerCase()

        try {
            setStep('Authenticating...')
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: normalizedEmail,
                password,
            })

            if (authError) {
                throw new Error(authError.message)
            }

            if (!authData.user) {
                throw new Error('Authentication failed')
            }

            setStep('Verifying admin access...')

            const { data: adminData, error: adminError } = await supabase
                .from('admin_users')
                .select('id, email, role')
                .eq('email', normalizedEmail)
                .maybeSingle()

            if (adminData) {
                setStep('Access granted!')
                await new Promise(resolve => setTimeout(resolve, 500))
                router.push('/admin/dashboard')
                router.refresh()
                return
            }

            if (adminError) {
                console.log('Direct query failed, trying RPC...', adminError.message)

                const { data: isAdmin, error: rpcError } = await supabase
                    .rpc('is_admin', { check_email: normalizedEmail })

                if (rpcError) {
                    console.error('RPC error:', rpcError)
                    await supabase.auth.signOut()
                    throw new Error('Unable to verify admin status. Please check database setup.')
                }

                if (isAdmin) {
                    setStep('Access granted!')
                    await new Promise(resolve => setTimeout(resolve, 500))
                    router.push('/admin/dashboard')
                    router.refresh()
                    return
                }
            }

            await supabase.auth.signOut()
            throw new Error(`"${normalizedEmail}" is not registered as admin.`)

        } catch (err: any) {
            console.error('Login error:', err)
            setError(err.message || 'Login failed')
            setStep('')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-olive-100/50 flex">
            {/* Left Side - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 bg-olive-900 relative overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
                        alt="Villa"
                        fill
                        className="object-cover opacity-30"
                    />
                </div>
                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    <div>
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-olive-600 flex items-center justify-center">
                                <Leaf size={20} className="text-white" />
                            </div>
                            <span className="font-display text-2xl text-white">StayinUBUD</span>
                        </Link>
                    </div>
                    <div>
                        <h2 className="font-display text-4xl text-white mb-4">
                            Welcome to <br />
                            <span className="italic text-olive-400">Admin Panel</span>
                        </h2>
                        <p className="text-white/60 max-w-sm">
                            Manage your villas, bookings, and content from one centralized dashboard.
                        </p>
                    </div>
                    <div className="text-white/40 text-sm">
                        © 2024 StayinUBUD. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile Logo */}
                    <div className="text-center mb-8 lg:hidden">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <div className="w-10 h-10 bg-olive-900 flex items-center justify-center">
                                <Leaf size={20} className="text-white" />
                            </div>
                            <span className="font-display text-2xl text-gray-900">StayinUBUD</span>
                        </Link>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white p-8 md:p-10 shadow-xl">
                        <div className="flex items-center justify-center w-14 h-14 bg-olive-100 mx-auto mb-6">
                            <Lock size={24} className="text-olive-600" />
                        </div>

                        <h2 className="text-xl font-display text-gray-900 text-center mb-2">
                            Admin Login
                        </h2>
                        <p className="text-gray-500 text-sm text-center mb-8">
                            Enter your credentials to access dashboard
                        </p>

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="admin@stayinubud.com"
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="Enter your password"
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-50 border border-red-200 p-4 flex items-start gap-3"
                                >
                                    <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-700">{error}</p>
                                </motion.div>
                            )}

                            {step && !error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-olive-100 border border-olive-200 p-4 flex items-center gap-3"
                                >
                                    {step === 'Access granted!' ? (
                                        <CheckCircle size={18} className="text-olive-600" />
                                    ) : (
                                        <Loader2 size={18} className="text-olive-600 animate-spin" />
                                    )}
                                    <p className="text-sm text-olive-900">{step}</p>
                                </motion.div>
                            )}

                            <motion.button
                                whileHover={{ scale: loading ? 1 : 1.01 }}
                                whileTap={{ scale: loading ? 1 : 0.99 }}
                                type="submit"
                                disabled={loading}
                                className="w-full bg-olive-900 text-white py-3 font-medium text-sm tracking-wider uppercase hover:bg-olive-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Please wait...</span>
                                    </>
                                ) : (
                                    <span>Sign In</span>
                                )}
                            </motion.button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <Link
                                href="/"
                                className="block text-center text-sm text-gray-500 hover:text-olive-600 transition-colors"
                            >
                                ← Back to Website
                            </Link>
                        </div>
                    </div>

                    <p className="text-center text-xs text-gray-400 mt-6 lg:hidden">
                        © 2024 StayinUBUD. All rights reserved.
                    </p>
                </motion.div>
            </div>
        </div>
    )
}
