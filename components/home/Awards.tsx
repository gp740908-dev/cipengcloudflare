'use client'

import { useRef, useEffect, useState } from 'react'
import { Award, Star, Trophy, Medal, Crown, Gem } from 'lucide-react'

const awards = [
    {
        icon: Trophy,
        year: '2024',
        title: 'Best Luxury Villa Provider',
        organization: 'Bali Tourism Awards',
        badge: 'Gold Winner'
    },
    {
        icon: Award,
        year: '2024',
        title: 'Excellence in Hospitality',
        organization: 'Indonesia Travel Awards',
        badge: 'Top Rated'
    },
    {
        icon: Crown,
        year: '2023',
        title: "Traveler's Choice",
        organization: 'TripAdvisor',
        badge: 'Best of Best'
    },
    {
        icon: Medal,
        year: '2023',
        title: 'Sustainable Tourism',
        organization: 'Green Globe Certified',
        badge: 'Eco-Certified'
    },
    {
        icon: Star,
        year: '2023',
        title: 'Guest Review Score 9.5',
        organization: 'Booking.com',
        badge: 'Exceptional'
    },
    {
        icon: Gem,
        year: '2022',
        title: 'Hidden Gem Award',
        organization: 'Condé Nast Traveller',
        badge: 'Editor Pick'
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
        <section ref={containerRef} className="relative py-24 md:py-32 bg-olive-900 overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-olive-800/30 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-olive-700/20 rounded-full blur-3xl" />
            </div>

            {/* Gold Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

            <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12">
                {/* Header */}
                <div className="text-center mb-16 md:mb-20">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 mb-6 ${isInView ? 'animate-fade-up' : 'opacity-0'}`}>
                        <Trophy size={14} className="text-amber-400" />
                        <span className="text-amber-400 text-xs tracking-[0.2em] uppercase">Recognition</span>
                    </div>

                    <h2 className={`font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6 ${isInView ? 'animate-fade-up stagger-1' : 'opacity-0'}`}>
                        Awards & <span className="italic text-amber-400">Accolades</span>
                    </h2>

                    <p className={`text-white/50 text-lg max-w-2xl mx-auto leading-relaxed ${isInView ? 'animate-fade-up stagger-2' : 'opacity-0'}`}>
                        Recognized by industry leaders for our commitment to exceptional hospitality and unparalleled guest experiences.
                    </p>
                </div>

                {/* Awards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {awards.map((award, index) => {
                        const staggerClass = `stagger-${Math.min(index + 1, 6)}`
                        return (
                            <div
                                key={index}
                                className={`group relative p-8 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-amber-400/30 hover:bg-white/10 transition-all duration-500 ${isInView ? `animate-fade-up ${staggerClass}` : 'opacity-0'}`}
                            >
                                {/* Year Badge */}
                                <span className="absolute top-4 right-4 text-xs text-white/30 font-medium">
                                    {award.year}
                                </span>

                                {/* Icon */}
                                <div className="w-12 h-12 flex items-center justify-center bg-amber-400/10 text-amber-400 mb-5 group-hover:bg-amber-400 group-hover:text-olive-900 transition-all duration-300">
                                    <award.icon size={22} />
                                </div>

                                {/* Content */}
                                <h3 className="font-display text-lg text-white mb-2 group-hover:text-amber-400 transition-colors">
                                    {award.title}
                                </h3>
                                <p className="text-white/40 text-sm mb-4">
                                    {award.organization}
                                </p>

                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-400/10 border border-amber-400/20">
                                    <Star size={10} className="text-amber-400 fill-amber-400" />
                                    <span className="text-amber-400 text-[10px] tracking-[0.15em] uppercase font-medium">
                                        {award.badge}
                                    </span>
                                </div>

                                {/* Hover Glow */}
                                <div className="absolute inset-0 bg-gradient-to-t from-amber-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>
                        )
                    })}
                </div>

                {/* Trust Indicators */}
                <div className={`mt-16 pt-12 border-t border-white/10 ${isInView ? 'animate-fade-up stagger-6' : 'opacity-0'}`}>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                        <div className="text-center">
                            <p className="font-display text-3xl md:text-4xl text-amber-400">15+</p>
                            <p className="text-white/40 text-xs tracking-wider uppercase mt-1">Industry Awards</p>
                        </div>
                        <div className="w-px h-12 bg-white/10 hidden md:block" />
                        <div className="text-center">
                            <p className="font-display text-3xl md:text-4xl text-amber-400">9.5</p>
                            <p className="text-white/40 text-xs tracking-wider uppercase mt-1">Average Rating</p>
                        </div>
                        <div className="w-px h-12 bg-white/10 hidden md:block" />
                        <div className="text-center">
                            <p className="font-display text-3xl md:text-4xl text-amber-400">5000+</p>
                            <p className="text-white/40 text-xs tracking-wider uppercase mt-1">5-Star Reviews</p>
                        </div>
                        <div className="w-px h-12 bg-white/10 hidden md:block" />
                        <div className="text-center">
                            <p className="font-display text-3xl md:text-4xl text-amber-400">100%</p>
                            <p className="text-white/40 text-xs tracking-wider uppercase mt-1">Satisfaction</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
