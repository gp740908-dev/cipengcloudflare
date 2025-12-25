'use client'

import { WifiOff, RefreshCw, Home } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function OfflinePage() {
    const handleRefresh = () => {
        window.location.reload()
    }

    return (
        <main className="h-screen bg-olive-900 relative overflow-hidden flex flex-col">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-olive-900 via-olive-800 to-olive-900" />

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-olive-600/20 blur-3xl"
                    animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-olive-400/10 blur-3xl"
                    animate={{ x: [0, -20, 0], y: [0, -30, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 px-6 md:px-12 py-6">
                <Link href="/" className="inline-block">
                    <Image
                        src="/images/logo.png"
                        alt="StayinUBUD"
                        width={140}
                        height={60}
                        className="h-12 w-auto"
                    />
                </Link>
            </nav>

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex items-center justify-center px-6">
                <div className="text-center max-w-md mx-auto">
                    {/* Icon */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <div className="w-24 h-24 mx-auto rounded-full bg-white/10 flex items-center justify-center">
                            <WifiOff size={48} className="text-olive-400" />
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <p className="text-olive-400 text-xs tracking-[0.4em] uppercase mb-3">Connection Lost</p>
                        <h1 className="font-display text-3xl md:text-4xl text-white mb-4">
                            You're <span className="italic text-olive-400">Offline</span>
                        </h1>
                    </motion.div>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-white/50 text-sm md:text-base mb-8 leading-relaxed"
                    >
                        It seems you've lost your connection. Check your internet
                        and try again to continue exploring our sanctuary.
                    </motion.p>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3"
                    >
                        <button
                            onClick={handleRefresh}
                            className="group flex items-center gap-2 px-6 py-3 bg-olive-600 text-white text-sm tracking-[0.1em] uppercase hover:bg-olive-500 transition-all"
                        >
                            <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                            <span>Try Again</span>
                        </button>

                        <Link
                            href="/"
                            className="flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm text-white text-sm tracking-[0.1em] uppercase border border-white/20 hover:bg-white/10 transition-all"
                        >
                            <Home size={16} />
                            <span>Go Home</span>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            <footer className="relative z-10 px-6 md:px-12 py-6 text-center">
                <p className="text-white/30 text-xs tracking-wider">
                    Some pages may be available offline
                </p>
            </footer>
        </main>
    )
}
