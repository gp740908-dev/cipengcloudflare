'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Award, Heart, Leaf, Users } from 'lucide-react'
import OptimizedImage from '@/components/OptimizedImage'

export default function AboutContent() {
    const storyRef = useRef<HTMLElement>(null)
    const valuesRef = useRef<HTMLElement>(null)
    const statsRef = useRef<HTMLElement>(null)

    const [isStoryInView, setIsStoryInView] = useState(false)
    const [isValuesInView, setIsValuesInView] = useState(false)
    const [isStatsInView, setIsStatsInView] = useState(false)

    useEffect(() => {
        const options = { rootMargin: '-100px', threshold: 0.1 }

        const storyObserver = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setIsStoryInView(true)
        }, options)

        const valuesObserver = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setIsValuesInView(true)
        }, options)

        const statsObserver = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setIsStatsInView(true)
        }, options)

        if (storyRef.current) storyObserver.observe(storyRef.current)
        if (valuesRef.current) valuesObserver.observe(valuesRef.current)
        if (statsRef.current) statsObserver.observe(statsRef.current)

        return () => {
            storyObserver.disconnect()
            valuesObserver.disconnect()
            statsObserver.disconnect()
        }
    }, [])

    const values = [
        {
            number: '01',
            title: 'Architectural Excellence',
            description: 'We curate properties that represent the pinnacle of design, where form meets function in perfect harmony.',
            icon: Award,
        },
        {
            number: '02',
            title: 'Authentic Experience',
            description: 'Every stay is an immersion into Balinese culture, crafted with respect for local traditions and communities.',
            icon: Heart,
        },
        {
            number: '03',
            title: 'Sustainable Luxury',
            description: 'Our commitment to the environment ensures that luxury and sustainability coexist beautifully.',
            icon: Leaf,
        },
        {
            number: '04',
            title: 'Personalized Service',
            description: 'We believe in anticipating needs before they arise, creating seamless experiences for every guest.',
            icon: Users,
        },
    ]

    const stats = [
        { value: '50+', label: 'Luxury Villas', description: 'Carefully curated properties' },
        { value: '5000+', label: 'Happy Guests', description: 'From around the world' },
        { value: '10+', label: 'Years Experience', description: 'In luxury hospitality' },
        { value: '4.9', label: 'Average Rating', description: 'Guest satisfaction score' },
    ]

    return (
        <>
            {/* Story Section */}
            <section ref={storyRef} className="py-24 md:py-32 bg-cream">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                        {/* Image */}
                        <div className={`relative ${isStoryInView ? 'animate-slide-left' : 'opacity-0'}`}>
                            <div className="aspect-[4/5] relative overflow-hidden">
                                <OptimizedImage
                                    src="https://images.unsplash.com/photo-1604999333679-b86d54738315?w=800&q=80"
                                    alt="Balinese villa"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            {/* Decorative Element */}
                            <div className="absolute -bottom-8 -right-8 w-48 h-48 border border-olive-400/30 -z-10 hidden md:block" />
                        </div>

                        {/* Content */}
                        <div className={isStoryInView ? 'animate-slide-right' : 'opacity-0'}>
                            <p className="text-olive-600 text-xs tracking-[0.3em] uppercase mb-6">
                                Our Story
                            </p>
                            <h2 className="font-display text-4xl md:text-5xl text-gray-900 mb-8 leading-tight">
                                A vision born from
                                <br />
                                <span className="italic text-olive-600">Balinese heritage</span>
                            </h2>
                            <div className="space-y-6 text-gray-600 leading-relaxed">
                                <p>
                                    Founded in 2016, StayinUBUD emerged from a simple yet profound vision:
                                    to share the transformative beauty of Ubud with discerning travelers
                                    who seek more than just accommodation.
                                </p>
                                <p>
                                    What began as a single family-owned villa has evolved into a carefully
                                    curated collection of 50+ exceptional properties, each representing the
                                    pinnacle of Balinese hospitality and architectural excellence.
                                </p>
                                <p>
                                    Today, we continue to honor our founding principles: authenticity,
                                    excellence, and an unwavering commitment to creating experiences that
                                    resonate long after departure.
                                </p>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-gray-200">
                                <div>
                                    <p className="font-display text-3xl text-olive-600">2016</p>
                                    <p className="text-sm text-gray-500 mt-1">Founded</p>
                                </div>
                                <div>
                                    <p className="font-display text-3xl text-olive-600">50+</p>
                                    <p className="text-sm text-gray-500 mt-1">Villas</p>
                                </div>
                                <div>
                                    <p className="font-display text-3xl text-olive-600">5K+</p>
                                    <p className="text-sm text-gray-500 mt-1">Guests</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section ref={valuesRef} className="py-24 md:py-32 bg-gray-900 text-white">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                    <div className={`max-w-2xl mb-16 md:mb-24 ${isValuesInView ? 'animate-fade-up' : 'opacity-0'}`}>
                        <p className="text-olive-400 text-xs tracking-[0.3em] uppercase mb-6">
                            Our Values
                        </p>
                        <h2 className="font-display text-4xl md:text-5xl leading-tight">
                            Principles that guide
                            <br />
                            <span className="italic text-olive-400">everything</span> we do
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
                        {values.map((value, index) => {
                            const staggerClass = `stagger-${index + 1}`
                            const Icon = value.icon
                            return (
                                <div
                                    key={value.number}
                                    className={`bg-gray-900 p-8 md:p-12 group hover:bg-gray-800 transition-colors duration-500 ${isValuesInView ? `animate-fade-up ${staggerClass}` : 'opacity-0'}`}
                                >
                                    <div className="flex items-start gap-6">
                                        <div className="w-12 h-12 bg-olive-600/20 flex items-center justify-center flex-shrink-0">
                                            <Icon size={24} className="text-olive-400" />
                                        </div>
                                        <div>
                                            <span className="text-olive-400 text-xs tracking-widest mb-4 block">
                                                {value.number}
                                            </span>
                                            <h3 className="font-display text-2xl md:text-3xl mb-4 group-hover:text-olive-400 transition-colors">
                                                {value.title}
                                            </h3>
                                            <p className="text-white/60 leading-relaxed">
                                                {value.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Stats Section - Replaces Team Section */}
            <section ref={statsRef} className="py-24 md:py-32 bg-cream">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                    <div className={`text-center max-w-2xl mx-auto mb-16 ${isStatsInView ? 'animate-fade-up' : 'opacity-0'}`}>
                        <p className="text-olive-600 text-xs tracking-[0.3em] uppercase mb-6">
                            Our Impact
                        </p>
                        <h2 className="font-display text-4xl md:text-5xl text-gray-900 leading-tight">
                            Numbers that speak <span className="italic text-olive-600">for us</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {stats.map((stat, index) => {
                            const staggerClass = `stagger-${index + 1}`
                            return (
                                <div
                                    key={stat.label}
                                    className={`text-center p-8 bg-white border border-gray-100 hover:border-olive-200 hover:shadow-lg transition-all ${isStatsInView ? `animate-fade-up ${staggerClass}` : 'opacity-0'}`}
                                >
                                    <p className="font-display text-4xl md:text-5xl text-olive-600 mb-2">
                                        {stat.value}
                                    </p>
                                    <p className="font-medium text-gray-900 mb-1">{stat.label}</p>
                                    <p className="text-sm text-gray-500">{stat.description}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-24 md:py-32 bg-olive-50">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                        <div className="animate-fade-up">
                            <p className="text-olive-600 text-xs tracking-[0.3em] uppercase mb-6">
                                Our Mission
                            </p>
                            <h2 className="font-display text-4xl md:text-5xl text-gray-900 mb-8 leading-tight">
                                Creating unforgettable
                                <br />
                                <span className="italic text-olive-600">experiences</span>
                            </h2>
                            <div className="space-y-6 text-gray-600 leading-relaxed">
                                <p>
                                    Our mission is to connect travelers with the soul of Bali through
                                    exceptional villa experiences that blend luxury with authenticity.
                                </p>
                                <p>
                                    We believe every journey should be transformative. That's why we go
                                    beyond accommodation to curate complete experiences — from private
                                    chef dinners to sunrise yoga sessions, cultural immersions to
                                    adventure excursions.
                                </p>
                            </div>

                            <div className="mt-10 flex flex-wrap gap-4">
                                <Link
                                    href="/villas"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-olive-900 text-white text-sm tracking-wider uppercase hover:bg-olive-600 transition-colors"
                                >
                                    <span>Explore Villas</span>
                                    <ArrowUpRight size={16} />
                                </Link>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center gap-2 px-6 py-3 border border-gray-900 text-gray-900 text-sm tracking-wider uppercase hover:bg-gray-900 hover:text-white transition-colors"
                                >
                                    <span>Contact Us</span>
                                </Link>
                            </div>
                        </div>

                        <div className="relative animate-fade-up stagger-2">
                            <div className="aspect-[4/3] relative overflow-hidden">
                                <OptimizedImage
                                    src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80"
                                    alt="Bali rice terraces"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            {/* Decorative overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-olive-900/20 to-transparent" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 md:py-32 bg-gray-900">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
                    <div className="animate-fade-up">
                        <p className="text-olive-400 text-xs tracking-[0.3em] uppercase mb-6">
                            Begin Your Journey
                        </p>
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-8 leading-tight">
                            Ready to experience
                            <br />
                            <span className="italic text-olive-400">Ubud?</span>
                        </h2>
                        <p className="text-white/60 max-w-xl mx-auto mb-10">
                            Discover our collection of handpicked luxury villas and start planning
                            your perfect Balinese escape today.
                        </p>
                        <Link
                            href="/villas"
                            className="group inline-flex items-center gap-3 px-8 py-4 bg-olive-600 text-white text-sm tracking-[0.15em] uppercase hover:bg-olive-400 transition-colors"
                        >
                            <span>Explore Our Collection</span>
                            <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}
