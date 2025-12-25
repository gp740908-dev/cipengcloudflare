'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Star, Phone, Mail, MapPin } from 'lucide-react'
import OptimizedImage from '@/components/OptimizedImage'

const stats = [
    { value: 50, suffix: '+', label: 'Curated Luxury Villas', desc: 'Hand-picked for excellence' },
    { value: 5000, suffix: '+', label: 'Happy Guests', desc: 'From around the world' },
    { value: 24, suffix: '/7', label: 'Concierge Service', desc: 'Always here for you' },
    { value: 100, suffix: '%', label: 'Satisfaction Rate', desc: 'Guaranteed experiences' },
]

export default function CTASection() {
    const containerRef = useRef<HTMLElement>(null)
    const [isInView, setIsInView] = useState(false)
    const [scrollY, setScrollY] = useState(0)

    // Intersection Observer
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

    // Parallax scroll
    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect()
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    setScrollY(window.scrollY)
                }
            }
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const parallaxY = scrollY * 0.2

    return (
        <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden">
            {/* Parallax Background Image - CSS transform */}
            <div
                className="absolute inset-0 will-change-transform"
                style={{ transform: `translateY(${parallaxY}px) scale(1.1)` }}
            >
                <OptimizedImage
                    src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920"
                    alt="Bali Villa View"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Overlays */}
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

            {/* Content */}
            <div className="relative z-10 w-full py-32 md:py-40">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        {/* Left Content */}
                        <div>
                            {/* Stars */}
                            <div className={`flex items-center gap-2 mb-6 ${isInView ? 'animate-fade-up' : 'opacity-0'}`}>
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} className="text-olive-400 fill-olive-400" />
                                ))}
                                <span className="text-white/60 text-sm ml-2">Rated 4.9 by our guests</span>
                            </div>

                            {/* Titles */}
                            <h2 className={`font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-[1.1] mb-2 ${isInView ? 'animate-fade-up stagger-1' : 'opacity-0'}`}>
                                Begin Your
                            </h2>
                            <h2 className={`font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-olive-400 italic leading-[1.1] mb-8 ${isInView ? 'animate-fade-up stagger-2' : 'opacity-0'}`}>
                                Bali Journey
                            </h2>

                            <p className={`text-white/60 text-lg md:text-xl leading-relaxed mb-10 max-w-xl ${isInView ? 'animate-fade-up stagger-3' : 'opacity-0'}`}>
                                Let our concierge team craft your perfect getaway. From private chef experiences to sacred temple visits, we handle every detail.
                            </p>

                            {/* CTA Buttons */}
                            <div className={`flex flex-wrap gap-4 mb-12 ${isInView ? 'animate-fade-up stagger-4' : 'opacity-0'}`}>
                                <Link
                                    href="/villas"
                                    className="group inline-flex items-center gap-3 px-8 py-4 bg-olive-600 text-white text-sm tracking-[0.15em] uppercase hover:bg-olive-400 transition-colors"
                                >
                                    <span>Explore Villas</span>
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <a
                                    href="mailto:hello@stayinubud.com"
                                    className="inline-flex items-center gap-3 px-8 py-4 border border-white/30 text-white text-sm tracking-[0.15em] uppercase hover:bg-white/10 transition-colors"
                                >
                                    <Mail size={16} />
                                    <span>Contact Us</span>
                                </a>
                            </div>

                            {/* Contact Info */}
                            <div className={`flex flex-wrap gap-8 pt-8 border-t border-white/10 ${isInView ? 'animate-fade-up stagger-5' : 'opacity-0'}`}>
                                <a href="tel:+6281234567890" className="flex items-center gap-3 text-white/60 hover:text-white transition-colors">
                                    <Phone size={16} className="text-olive-400" />
                                    <span className="text-sm">+62 812 3456 7890</span>
                                </a>
                                <div className="flex items-center gap-3 text-white/60">
                                    <MapPin size={16} className="text-olive-400" />
                                    <span className="text-sm">Ubud, Bali, Indonesia</span>
                                </div>
                            </div>
                        </div>

                        {/* Right - Stats Card */}
                        <div className={`${isInView ? 'animate-fade-up stagger-4' : 'opacity-0'}`}>
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 md:p-12 hover-lift">
                                <h3 className="font-display text-2xl text-white mb-8">
                                    Why Choose <span className="text-olive-400">StayinUBUD</span>
                                </h3>

                                <div className="space-y-6">
                                    {stats.map((stat, index) => {
                                        const staggerClass = `stagger-${index + 1}`
                                        return (
                                            <div
                                                key={index}
                                                className={`flex items-start gap-4 pb-6 border-b border-white/10 last:border-0 last:pb-0 ${isInView ? `animate-slide-left ${staggerClass}` : 'opacity-0'}`}
                                            >
                                                <span className="font-display text-3xl md:text-4xl text-olive-400 min-w-[100px]">
                                                    {stat.value}{stat.suffix}
                                                </span>
                                                <div>
                                                    <p className="text-white font-medium">{stat.label}</p>
                                                    <p className="text-white/50 text-sm">{stat.desc}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-4">
                <div className="w-px h-20 bg-gradient-to-b from-transparent via-white/30 to-transparent animate-bounce" />
            </div>
        </section>
    )
}
