'use client'

import { useState, useEffect } from 'react'

export default function LuxuryLoader() {
    const [isLoading, setIsLoading] = useState(true)
    const [fadeOut, setFadeOut] = useState(false)

    useEffect(() => {
        // Minimum display time for luxury feel
        const minDisplayTime = 2000

        const timer = setTimeout(() => {
            setFadeOut(true)
            // Remove from DOM after fade animation
            setTimeout(() => {
                setIsLoading(false)
            }, 800)
        }, minDisplayTime)

        return () => clearTimeout(timer)
    }, [])

    if (!isLoading) return null

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center bg-olive-900 transition-opacity duration-800 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-olive-800/30 blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-olive-700/20 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>

            {/* Gold Lines Decoration */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

            {/* Main Content */}
            <div className="relative text-center">
                {/* Logo */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white tracking-wide">
                        Stayin<span className="text-amber-400">UBUD</span>
                    </h1>
                    <p className="text-white/40 text-xs tracking-[0.4em] uppercase mt-3">
                        Luxury Villa Rentals
                    </p>
                </div>

                {/* Elegant Loader */}
                <div className="relative">
                    {/* Rotating Ring */}
                    <div className="w-16 h-16 mx-auto relative">
                        <div className="absolute inset-0 border-2 border-amber-400/20 rounded-full" />
                        <div className="absolute inset-0 border-2 border-transparent border-t-amber-400 rounded-full animate-spin" style={{ animationDuration: '1.5s' }} />
                    </div>

                    {/* Loading Text */}
                    <p className="text-white/30 text-xs tracking-[0.3em] uppercase mt-6 animate-pulse">
                        Loading Experience
                    </p>
                </div>

                {/* Bottom Tagline */}
                <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <p className="text-white/20 text-sm italic font-display">
                        Ubud, Bali
                    </p>
                </div>
            </div>

            {/* Corner Decorations */}
            <div className="absolute top-8 left-8 w-12 h-12 border-l-2 border-t-2 border-amber-400/30" />
            <div className="absolute top-8 right-8 w-12 h-12 border-r-2 border-t-2 border-amber-400/30" />
            <div className="absolute bottom-8 left-8 w-12 h-12 border-l-2 border-b-2 border-amber-400/30" />
            <div className="absolute bottom-8 right-8 w-12 h-12 border-r-2 border-b-2 border-amber-400/30" />

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out forwards;
                }
            `}</style>
        </div>
    )
}
