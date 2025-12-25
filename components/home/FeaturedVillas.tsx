'use client'

import { useRef, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Villa } from '@/types'
import Link from 'next/link'
import { ArrowUpRight, Leaf } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import OptimizedImage from '@/components/OptimizedImage'

// Fallback data
const fallbackVillas = [
    {
        id: '1',
        name: 'Villa Taman Surga',
        price_per_night: 4500000,
        bedrooms: 3,
        bathrooms: 3,
        max_guests: 6,
        images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'],
        location: 'Ubud, Bali'
    },
    {
        id: '2',
        name: 'Villa Lotus Dream',
        price_per_night: 5500000,
        bedrooms: 4,
        bathrooms: 4,
        max_guests: 8,
        images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80'],
        location: 'Ubud, Bali'
    },
    {
        id: '3',
        name: 'Villa Bambu Retreat',
        price_per_night: 3800000,
        bedrooms: 2,
        bathrooms: 2,
        max_guests: 4,
        images: ['https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80'],
        location: 'Ubud, Bali'
    },
    {
        id: '4',
        name: 'Villa Sawah Indah',
        price_per_night: 6200000,
        bedrooms: 5,
        bathrooms: 5,
        max_guests: 10,
        images: ['https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80'],
        location: 'Ubud, Bali'
    },
    {
        id: '5',
        name: 'Villa Harmony',
        price_per_night: 4200000,
        bedrooms: 3,
        bathrooms: 3,
        max_guests: 6,
        images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80'],
        location: 'Ubud, Bali'
    },
]

export default function FeaturedVillas() {
    const ref = useRef<HTMLElement>(null)
    const [isInView, setIsInView] = useState(false)
    const [villas, setVillas] = useState<Villa[]>(fallbackVillas as Villa[])
    const [loading, setLoading] = useState(true)

    // Intersection Observer for viewport detection
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true)
                    observer.disconnect()
                }
            },
            { rootMargin: '-100px' }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        async function fetchVillas() {
            try {
                const supabase = createClient()
                const { data, error } = await supabase
                    .from('villas')
                    .select('*')
                    .limit(5)
                    .order('created_at', { ascending: false })

                if (!error && data && data.length > 0) {
                    setVillas(data)
                }
            } catch (err) {
                console.error('Error fetching villas:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchVillas()
    }, [])

    const displayVillas = villas

    return (
        <section ref={ref} className="py-24 md:py-32 bg-white relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-olive-100/50 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gradient-to-tr from-gray-50 to-transparent pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-8">
                    <div className="max-w-2xl">
                        <div className={`flex items-center gap-3 mb-6 ${isInView ? 'animate-fade-up' : 'opacity-0'}`}>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-olive-900 text-white">
                                <Leaf size={12} />
                                <span className="text-[10px] tracking-[0.2em] uppercase">Curated Selection</span>
                            </div>
                        </div>

                        <h2 className={`font-display text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6 ${isInView ? 'animate-fade-up stagger-1' : 'opacity-0'}`}>
                            Selected <span className="italic text-olive-600">Villas</span>
                        </h2>

                        <p className={`text-gray-500 max-w-lg leading-relaxed ${isInView ? 'animate-fade-up stagger-2' : 'opacity-0'}`}>
                            Each property in our collection represents the pinnacle of
                            Balinese architecture and hospitality excellence.
                        </p>
                    </div>

                    <div className={isInView ? 'animate-fade-up stagger-3' : 'opacity-0'}>
                        <Link
                            href="/villas"
                            className="group inline-flex items-center gap-3 px-6 py-4 border border-gray-200 hover:bg-olive-900 hover:border-olive-900 hover:text-white transition-all duration-300"
                        >
                            <span className="text-xs tracking-[0.2em] uppercase">View All Properties</span>
                            <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="col-span-2 row-span-2 aspect-square skeleton" />
                        <div className="aspect-square skeleton" />
                        <div className="aspect-square skeleton" />
                        <div className="row-span-2 aspect-[1/2] skeleton" />
                        <div className="aspect-square skeleton" />
                    </div>
                )}

                {/* Bento Grid */}
                {!loading && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {displayVillas.slice(0, 5).map((villa, index) => {
                            const gridClasses = [
                                'col-span-2 row-span-2',
                                '',
                                '',
                                'row-span-2',
                                '',
                            ]

                            const aspectClasses = [
                                'aspect-square',
                                'aspect-square',
                                'aspect-square',
                                'aspect-[1/2]',
                                'aspect-square',
                            ]

                            const isFeatured = index === 0 || index === 3
                            const staggerClass = index < 6 ? `stagger-${index + 1}` : ''

                            return (
                                <div
                                    key={villa.id}
                                    className={`${gridClasses[index]} relative group overflow-hidden bg-gray-100 ${isInView ? `animate-fade-up ${staggerClass}` : 'opacity-0'}`}
                                >
                                    <Link href={`/villas/${villa.id}`} className="block h-full">
                                        <div className={`relative ${aspectClasses[index]} w-full h-full`}>
                                            <OptimizedImage
                                                src={villa.images[0]}
                                                alt={villa.name}
                                                fill
                                                sizes={index === 0 ? "50vw" : "(max-width: 768px) 50vw, 25vw"}
                                                className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                                                priority={index < 2}
                                            />

                                            {/* Featured Badge */}
                                            {isFeatured && (
                                                <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm">
                                                    <Leaf size={10} className="text-olive-600" />
                                                    <span className="text-gray-900 text-[9px] tracking-[0.15em] uppercase font-medium">Featured</span>
                                                </div>
                                            )}

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                            {/* Hover Content */}
                                            <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                                                <div className="translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                                    <p className="text-white/60 text-[10px] md:text-xs tracking-[0.15em] uppercase mb-2">
                                                        From {formatCurrency(villa.price_per_night)}/night
                                                    </p>
                                                    <h3 className="text-white font-display text-lg md:text-xl lg:text-2xl mb-1">
                                                        {villa.name}
                                                    </h3>
                                                    <p className="text-white/60 text-xs md:text-sm">
                                                        {villa.bedrooms} Bedrooms · {villa.max_guests} Guests
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Corner Arrow */}
                                            <div className="absolute top-4 right-4 w-8 h-8 md:w-10 md:h-10 bg-white/0 group-hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                <ArrowUpRight size={14} className="text-gray-900" />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Bottom Stats */}
                <div className={`mt-20 ${isInView ? 'animate-fade-up stagger-6' : 'opacity-0'}`}>
                    <div className="h-px bg-gradient-to-r from-transparent via-olive-400/50 to-transparent mb-12" />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        <div className="text-center">
                            <p className="font-display text-4xl md:text-5xl text-gray-900 mb-2">25+</p>
                            <p className="text-gray-400 text-xs tracking-[0.15em] uppercase">Curated Properties</p>
                        </div>
                        <div className="text-center">
                            <p className="font-display text-4xl md:text-5xl text-gray-900 mb-2">8</p>
                            <p className="text-gray-400 text-xs tracking-[0.15em] uppercase">Years Excellence</p>
                        </div>
                        <div className="text-center">
                            <p className="font-display text-4xl md:text-5xl text-gray-900 mb-2">4.9</p>
                            <p className="text-gray-400 text-xs tracking-[0.15em] uppercase">Guest Rating</p>
                        </div>
                        <div className="text-center">
                            <p className="font-display text-4xl md:text-5xl text-gray-900 mb-2">2K+</p>
                            <p className="text-gray-400 text-xs tracking-[0.15em] uppercase">Happy Guests</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
