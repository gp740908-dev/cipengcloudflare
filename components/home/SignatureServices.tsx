'use client'

import { useRef, useEffect, useState } from 'react'
import {
    Car,
    UtensilsCrossed,
    Sparkles,
    Camera,
    Plane,
    Wine,
    Crown,
    ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import OptimizedImage from '@/components/OptimizedImage'

const services = [
    {
        icon: Car,
        title: 'Private Airport Transfer',
        description: 'Luxury vehicle pickup with welcome amenities',
        tag: 'Complimentary',
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80'
    },
    {
        icon: UtensilsCrossed,
        title: 'Private Chef Service',
        description: 'Michelin-trained chefs creating culinary masterpieces',
        tag: 'On Request',
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80'
    },
    {
        icon: Sparkles,
        title: 'In-Villa Spa',
        description: 'Traditional Balinese treatments in complete privacy',
        tag: 'Exclusive',
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80'
    },
    {
        icon: Camera,
        title: 'Professional Photography',
        description: 'Capture your moments with our resident photographer',
        tag: 'Premium',
        image: 'https://images.unsplash.com/photo-1520390138845-fd2d229dd553?w=600&q=80'
    },
    {
        icon: Plane,
        title: 'Island Hopping',
        description: 'Private tours to Nusa Penida, Gili & beyond',
        tag: 'Adventure',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'
    },
    {
        icon: Wine,
        title: 'Sunset Dining',
        description: 'Romantic private dining with panoramic views',
        tag: 'Signature',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80'
    },
]

export default function SignatureServices() {
    const containerRef = useRef<HTMLElement>(null)
    const [isInView, setIsInView] = useState(false)
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

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
        <section ref={containerRef} className="relative py-24 md:py-32 bg-gray-50 overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gradient-to-bl from-olive-100/50 to-transparent" />
                <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-gradient-to-tr from-olive-100/30 to-transparent" />
            </div>

            <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-8">
                    <div className="max-w-2xl">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 bg-olive-900 text-white mb-6 ${isInView ? 'animate-fade-up' : 'opacity-0'}`}>
                            <Crown size={14} />
                            <span className="text-xs tracking-[0.2em] uppercase">Exclusive Services</span>
                        </div>

                        <h2 className={`font-display text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6 ${isInView ? 'animate-fade-up stagger-1' : 'opacity-0'}`}>
                            Signature <span className="italic text-olive-600">Experiences</span>
                        </h2>

                        <p className={`text-gray-500 leading-relaxed ${isInView ? 'animate-fade-up stagger-2' : 'opacity-0'}`}>
                            Elevate your stay with our curated collection of bespoke services,
                            designed exclusively for discerning travelers seeking the extraordinary.
                        </p>
                    </div>

                    <Link
                        href="/experiences"
                        className={`group inline-flex items-center gap-3 px-6 py-4 bg-olive-900 text-white hover:bg-olive-700 transition-all duration-300 ${isInView ? 'animate-fade-up stagger-3' : 'opacity-0'}`}
                    >
                        <span className="text-xs tracking-[0.2em] uppercase">View All Services</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {services.map((service, index) => {
                        const staggerClass = `stagger-${Math.min(index + 1, 6)}`
                        const isHovered = hoveredIndex === index

                        return (
                            <div
                                key={index}
                                className={`group relative overflow-hidden cursor-pointer ${isInView ? `animate-fade-up ${staggerClass}` : 'opacity-0'}`}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                {/* Image */}
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <OptimizedImage
                                        src={service.image}
                                        alt={service.title}
                                        fill
                                        className={`object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                                    />

                                    {/* Overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-70'}`} />

                                    {/* Tag */}
                                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm">
                                        <span className="text-olive-900 text-[10px] tracking-[0.15em] uppercase font-medium">
                                            {service.tag}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        {/* Icon */}
                                        <div className={`w-10 h-10 flex items-center justify-center bg-olive-600 text-white mb-4 transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}>
                                            <service.icon size={18} />
                                        </div>

                                        <h3 className="font-display text-xl text-white mb-2">
                                            {service.title}
                                        </h3>

                                        <p className={`text-white/70 text-sm leading-relaxed transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                            {service.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Bottom CTA Bar */}
                <div className={`mt-12 p-8 md:p-10 bg-olive-900 flex flex-col md:flex-row items-center justify-between gap-6 ${isInView ? 'animate-fade-up stagger-6' : 'opacity-0'}`}>
                    <div className="text-center md:text-left">
                        <h3 className="font-display text-2xl text-white mb-2">
                            Create Your Perfect Stay
                        </h3>
                        <p className="text-white/50 text-sm">
                            Our concierge team is available 24/7 to customize your experience
                        </p>
                    </div>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-olive-900 hover:bg-olive-100 transition-colors text-sm tracking-[0.15em] uppercase font-medium"
                    >
                        Contact Concierge
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    )
}
