'use client'

import { useState, useEffect } from 'react'

export default function LuxuryLoader() {
    const [isLoading, setIsLoading] = useState(true)
    const [fadeOut, setFadeOut] = useState(false)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        // Simulate loading progress
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval)
                    return 100
                }
                return prev + Math.random() * 15
            })
        }, 200)

        // Minimum display time for luxury feel
        const minDisplayTime = 1800

        const timer = setTimeout(() => {
            setProgress(100)
            setTimeout(() => {
                setFadeOut(true)
                // Remove from DOM after fade animation
                setTimeout(() => {
                    setIsLoading(false)
                }, 600)
            }, 200)
        }, minDisplayTime)

        return () => {
            clearTimeout(timer)
            clearInterval(progressInterval)
        }
    }, [])

    if (!isLoading) return null

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#fafafa] transition-all duration-600 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
        >
            {/* Minimal Grid Background */}
            <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, #4a5d23 1px, transparent 1px),
                            linear-gradient(to bottom, #4a5d23 1px, transparent 1px)
                        `,
                        backgroundSize: '80px 80px'
                    }}
                />
            </div>

            {/* Main Content - Ultra Minimal */}
            <div className="relative text-center">
                {/* Brand Mark */}
                <div
                    className={`transition-all duration-700 ${fadeOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                        }`}
                    style={{
                        animation: 'fadeInUp 0.8s ease-out forwards',
                    }}
                >
                    {/* Minimal Logo */}
                    <div className="mb-12">
                        <h1 className="font-display text-4xl md:text-5xl text-[#1a1a1a] tracking-[0.02em]">
                            Stayin<span className="text-olive-600">UBUD</span>
                        </h1>
                    </div>

                    {/* Elegant Progress Bar */}
                    <div className="w-48 mx-auto">
                        {/* Track */}
                        <div className="h-[1px] bg-gray-200 relative overflow-hidden">
                            {/* Fill */}
                            <div
                                className="absolute left-0 top-0 h-full bg-olive-600 transition-all duration-300 ease-out"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                        </div>

                        {/* Percentage */}
                        <p className="text-[10px] text-gray-400 tracking-[0.3em] uppercase mt-4 font-medium">
                            {Math.min(Math.round(progress), 100)}%
                        </p>
                    </div>
                </div>
            </div>

            {/* Corner Accent - Single, Minimal */}
            <div className="absolute bottom-8 left-8 flex items-end gap-2 text-gray-300">
                <div className="w-8 h-[1px] bg-olive-600/30" />
                <span className="text-[9px] tracking-[0.2em] uppercase text-gray-400">Ubud, Bali</span>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(16px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    )
}
