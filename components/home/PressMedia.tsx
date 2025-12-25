'use client'

import { useRef, useEffect, useState } from 'react'
import { Newspaper } from 'lucide-react'

// Media logos represented as text for reliability (in production, use actual SVG logos)
const mediaLogos = [
    { name: 'Condé Nast Traveller', category: 'Featured' },
    { name: 'Forbes Travel', category: 'Recommended' },
    { name: 'Travel + Leisure', category: 'Best Of' },
    { name: 'Vogue Living', category: 'Editor Pick' },
    { name: 'Architectural Digest', category: 'Spotlight' },
    { name: 'Lonely Planet', category: 'Top Choice' },
]

const pressQuotes = [
    {
        quote: "An oasis of refined luxury that sets the benchmark for villa experiences in Ubud.",
        source: "Condé Nast Traveller",
        date: "December 2024"
    },
    {
        quote: "StayinUBUD represents the pinnacle of sustainable luxury in Southeast Asia.",
        source: "Forbes Travel Guide",
        date: "November 2024"
    },
]

export default function PressMedia() {
    const containerRef = useRef<HTMLElement>(null)
    const [isInView, setIsInView] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true)
                }
            },
            { rootMargin: '-100px' }
        )
        if (containerRef.current) observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [])

    return (
        <section ref={containerRef} className="relative py-20 md:py-28 bg-cream overflow-hidden">
            {/* Subtle Pattern */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(74,93,35,0.1) 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12">
                {/* Header */}
                <div className="text-center mb-14">
                    <p className={`text-olive-600 text-xs tracking-[0.3em] uppercase mb-4 ${isInView ? 'animate-fade-up' : 'opacity-0'}`}>
                        As Featured In
                    </p>
                    <h2 className={`font-display text-3xl md:text-4xl text-gray-900 ${isInView ? 'animate-fade-up stagger-1' : 'opacity-0'}`}>
                        Trusted by the <span className="italic text-olive-600">World's Best</span>
                    </h2>
                </div>

                {/* Media Logos Grid */}
                <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 mb-16 ${isInView ? 'animate-fade-up stagger-2' : 'opacity-0'}`}>
                    {mediaLogos.map((media, index) => (
                        <div
                            key={index}
                            className="group flex flex-col items-center justify-center p-6 bg-white border border-gray-100 hover:border-olive-200 hover:shadow-lg transition-all duration-300"
                        >
                            <span className="font-display text-sm md:text-base text-gray-400 group-hover:text-olive-600 transition-colors text-center leading-tight">
                                {media.name}
                            </span>
                            <span className="text-[10px] text-olive-500 tracking-wider uppercase mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {media.category}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Press Quotes */}
                <div className="grid md:grid-cols-2 gap-6">
                    {pressQuotes.map((item, index) => {
                        const staggerClass = `stagger-${index + 3}`
                        return (
                            <div
                                key={index}
                                className={`relative p-8 md:p-10 bg-white border border-gray-100 ${isInView ? `animate-fade-up ${staggerClass}` : 'opacity-0'}`}
                            >
                                {/* Quote Mark */}
                                <div className="absolute top-6 right-6 font-display text-6xl text-olive-100 leading-none">
                                    "
                                </div>

                                <div className="relative">
                                    <Newspaper size={16} className="text-olive-400 mb-4" />
                                    <blockquote className="font-display text-xl md:text-2xl text-gray-800 leading-relaxed mb-6 italic">
                                        "{item.quote}"
                                    </blockquote>
                                    <div className="flex items-center justify-between">
                                        <cite className="not-italic text-olive-600 font-medium text-sm">
                                            — {item.source}
                                        </cite>
                                        <span className="text-gray-400 text-xs">
                                            {item.date}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
