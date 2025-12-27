'use client'

import { useRef, useEffect, useState } from 'react'
import { Award, Star, Trophy } from 'lucide-react'

// Simplified to 4 awards for cleaner look
const awards = [
    {
        icon: Trophy,
        year: '2024',
        title: 'Best Luxury Villa Provider',
        organization: 'Bali Tourism Awards',
    },
    {
        icon: Award,
        year: '2024',
        title: 'Excellence in Hospitality',
        organization: 'Indonesia Travel Awards',
    },
    {
        icon: Star,
        year: '2023',
        title: "Traveler's Choice",
        organization: 'TripAdvisor',
    },
    {
        icon: Award,
        year: '2023',
        title: 'Guest Review Score 9.5',
        organization: 'Booking.com',
    },
]

export default function Awards() {
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
        <section ref={containerRef} className="relative py-32 bg-olive-900 overflow-hidden">
            {/* Minimal decorative element - single subtle gradient */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-olive-800/20 to-transparent" />
            </div>

            {/* Gold Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

            <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12">
                {/* Asymmetric Layout - 40/60 split */}
                <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
                    {/* Left Column - 40% */}
                    <div className="lg:col-span-2">
                        <p className={`text-amber-400 text-xs tracking-[0.3em] uppercase mb-4 ${isInView ? 'animate-fade-up' : 'opacity-0'}`}>
                            Recognition
                        </p>

                        <h2 className={`font-display text-4xl md:text-5xl text-white mb-6 ${isInView ? 'animate-fade-up stagger-1' : 'opacity-0'}`}>
                            Awards & <span className="italic text-amber-400">Accolades</span>
                        </h2>

                        <p className={`text-white/50 text-lg leading-relaxed mb-8 ${isInView ? 'animate-fade-up stagger-2' : 'opacity-0'}`}>
                            Recognized by industry leaders for exceptional hospitality.
                        </p>

                        {/* Simple Stats - Cleaner */}
                        <div className={`flex gap-8 ${isInView ? 'animate-fade-up stagger-3' : 'opacity-0'}`}>
                            <div>
                                <p className="font-display text-4xl text-amber-400">15+</p>
                                <p className="text-white/40 text-xs tracking-wider uppercase mt-1">Awards</p>
                            </div>
                            <div>
                                <p className="font-display text-4xl text-amber-400">9.5</p>
                                <p className="text-white/40 text-xs tracking-wider uppercase mt-1">Rating</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - 60% */}
                    <div className="lg:col-span-3">
                        <div className="grid sm:grid-cols-2 gap-4">
                            {awards.map((award, index) => {
                                const staggerClass = `stagger-${Math.min(index + 1, 4)}`
                                return (
                                    <div
                                        key={index}
                                        className={`group p-6 bg-white/5 border border-white/10 hover:border-amber-400/30 transition-all duration-300 ${isInView ? `animate-fade-up ${staggerClass}` : 'opacity-0'}`}
                                    >
                                        {/* Simple layout - icon + content */}
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 flex items-center justify-center bg-amber-400/10 text-amber-400 shrink-0">
                                                <award.icon size={18} />
                                            </div>
                                            <div>
                                                <span className="text-white/30 text-xs">{award.year}</span>
                                                <h3 className="font-display text-white text-lg mt-1 group-hover:text-amber-400 transition-colors">
                                                    {award.title}
                                                </h3>
                                                <p className="text-white/40 text-sm mt-1">
                                                    {award.organization}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
