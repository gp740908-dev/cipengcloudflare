'use client'

import { useRef, useEffect, useState } from 'react'
import { Shield, Sparkles, Heart, Clock, Leaf, Users, Star } from 'lucide-react'

const features = [
    {
        icon: Shield,
        title: 'Verified Excellence',
        description: 'Every villa is personally inspected and meets our rigorous standards for luxury.',
        stat: 100,
        statSuffix: '%',
        statLabel: 'Verified'
    },
    {
        icon: Sparkles,
        title: 'Curated Collection',
        description: 'Hand-picked properties offering unique experiences in the heart of Ubud.',
        stat: 50,
        statSuffix: '+',
        statLabel: 'Villas'
    },
    {
        icon: Heart,
        title: 'Personal Concierge',
        description: '24/7 dedicated support to craft your perfect Balinese experience.',
        stat: 24,
        statSuffix: '/7',
        statLabel: 'Support'
    },
    {
        icon: Clock,
        title: 'Seamless Booking',
        description: 'Instant confirmation with flexible cancellation policies.',
        stat: 1,
        statPrefix: '< ',
        statSuffix: 'hr',
        statLabel: 'Response'
    },
    {
        icon: Leaf,
        title: 'Eco-Conscious',
        description: 'Partnering with sustainable properties committed to preserving Bali.',
        stat: 80,
        statSuffix: '%',
        statLabel: 'Eco Certified'
    },
    {
        icon: Users,
        title: 'Local Expertise',
        description: 'Insider knowledge from Bali residents to enhance your stay.',
        stat: 10,
        statSuffix: '+',
        statLabel: 'Years'
    },
]

const stats = [
    { value: '5000+', label: 'Happy Guests' },
    { value: '4.9', label: 'Average Rating' },
    { value: '50+', label: 'Luxury Villas' },
    { value: '10+', label: 'Years Experience' },
]

export default function Features() {
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
        <section ref={containerRef} className="relative py-32 md:py-40 bg-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-olive-100/30 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-olive-100/40 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-olive-50/30 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                    {/* Header */}
                    <div className="text-center mb-20 md:mb-24">
                        <p className={`text-olive-600 text-xs tracking-[0.3em] uppercase mb-4 flex items-center justify-center gap-2 ${isInView ? 'animate-fade-up' : 'opacity-0'}`}>
                            <Star size={12} className="fill-olive-600" />
                            Why Choose Us
                            <Star size={12} className="fill-olive-600" />
                        </p>

                        <h2 className={`font-display text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6 ${isInView ? 'animate-fade-up stagger-1' : 'opacity-0'}`}>
                            The StayinUBUD <span className="italic text-olive-600">Difference</span>
                        </h2>

                        <p className={`text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed ${isInView ? 'animate-fade-up stagger-2' : 'opacity-0'}`}>
                            Experience unparalleled service and attention to detail that transforms your Bali stay into an unforgettable journey.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {features.map((feature, index) => {
                            const staggerClass = index < 6 ? `stagger-${index + 1}` : ''
                            return (
                                <div
                                    key={index}
                                    className={`group relative p-8 md:p-10 bg-white border border-gray-100 hover:border-olive-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 ${isInView ? `animate-fade-up ${staggerClass}` : 'opacity-0'}`}
                                >
                                    {/* Number */}
                                    <span className="absolute top-6 right-6 text-6xl font-display text-gray-100 group-hover:text-olive-100 transition-colors">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>

                                    {/* Icon */}
                                    <div className="relative w-14 h-14 flex items-center justify-center bg-olive-100 text-olive-600 mb-6 group-hover:bg-olive-600 group-hover:text-white transition-all duration-300">
                                        <feature.icon size={24} />
                                    </div>

                                    {/* Content */}
                                    <h3 className="font-display text-xl text-gray-900 mb-3 group-hover:text-olive-900 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-500 leading-relaxed mb-6 text-sm">
                                        {feature.description}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-end gap-2 pt-4 border-t border-gray-100">
                                        <span className="font-display text-3xl text-olive-600 group-hover:text-olive-900 transition-colors">
                                            {feature.statPrefix}{feature.stat}{feature.statSuffix}
                                        </span>
                                        <span className="text-gray-400 text-sm mb-1">{feature.statLabel}</span>
                                    </div>

                                    {/* Hover accent line */}
                                    <div className="absolute bottom-0 left-0 h-1 bg-olive-600 w-0 group-hover:w-full transition-all duration-300" />
                                </div>
                            )
                        })}
                    </div>

                    {/* Bottom Stats Bar */}
                    <div className={`mt-20 md:mt-24 py-12 px-8 md:px-16 bg-olive-900 grid grid-cols-2 md:grid-cols-4 gap-8 ${isInView ? 'animate-fade-up stagger-6' : 'opacity-0'}`}>
                        {stats.map((stat, index) => {
                            const staggerClass = `stagger-${index + 1}`
                            return (
                                <div
                                    key={index}
                                    className={`text-center ${isInView ? `animate-fade-up ${staggerClass}` : 'opacity-0'}`}
                                >
                                    <span className="font-display text-4xl md:text-5xl text-white block">
                                        {stat.value}
                                    </span>
                                    <p className="text-olive-300 text-sm tracking-wider uppercase mt-2">{stat.label}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
