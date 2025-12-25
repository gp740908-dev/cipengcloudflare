'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Home, Search, Compass, ArrowUpRight } from 'lucide-react'

export default function NotFound() {
    return (
        <main className="h-screen bg-olive-900 relative overflow-hidden flex flex-col">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                <Image
                    src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920"
                    alt="Bali Landscape"
                    fill
                    className="object-cover opacity-20"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-olive-900 via-olive-900/95 to-olive-800" />
            </div>

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
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Image
                            src="/images/logo.png"
                            alt="StayinUBUD"
                            width={140}
                            height={60}
                            className="h-12 w-auto"
                        />
                    </motion.div>
                </Link>
            </nav>

            {/* Main Content - Centered */}
            <div className="relative z-10 flex-1 flex items-center justify-center px-6">
                <div className="text-center max-w-2xl mx-auto">
                    {/* 404 Number with Compass */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="relative inline-block mb-6"
                    >
                        <span className="text-[120px] md:text-[180px] font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white/25 to-white/5 leading-none select-none">
                            404
                        </span>
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                            <Compass size={50} className="text-olive-400/40" strokeWidth={1} />
                        </motion.div>
                    </motion.div>

                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <p className="text-olive-400 text-[10px] md:text-xs tracking-[0.4em] uppercase mb-3">Lost in Paradise</p>
                        <h1 className="font-display text-3xl md:text-5xl text-white mb-4">
                            Page Not <span className="italic text-olive-400">Found</span>
                        </h1>
                    </motion.div>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-white/50 text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed"
                    >
                        The path you seek has wandered beyond our sanctuary.
                        Let us guide you back to serenity.
                    </motion.p>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3"
                    >
                        <Link
                            href="/"
                            className="group flex items-center gap-2 px-6 py-3 bg-olive-600 text-white text-xs md:text-sm tracking-[0.1em] uppercase hover:bg-olive-500 transition-all"
                        >
                            <Home size={16} />
                            <span>Return Home</span>
                        </Link>

                        <Link
                            href="/villas"
                            className="group flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm text-white text-xs md:text-sm tracking-[0.1em] uppercase border border-white/20 hover:bg-white/10 transition-all"
                        >
                            <Search size={16} />
                            <span>Explore Villas</span>
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Footer Quick Links */}
            <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="relative z-10 px-6 md:px-12 py-6 border-t border-white/10"
            >
                <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-white/30 text-xs tracking-wider">© StayinUBUD · Ubud, Bali</p>
                    <div className="flex items-center gap-6">
                        {[
                            { href: '/about', label: 'About' },
                            { href: '/contact', label: 'Contact' },
                            { href: '/blog', label: 'Journal' },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-white/40 hover:text-olive-400 text-xs tracking-wider transition-colors flex items-center gap-1 group"
                            >
                                <span>{link.label}</span>
                                <ArrowUpRight size={10} className="opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 transition-all" />
                            </Link>
                        ))}
                    </div>
                </div>
            </motion.footer>
        </main>
    )
}
