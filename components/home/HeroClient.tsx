'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Calendar, Users, Search, ArrowRight, Pause, Play, ChevronDown } from 'lucide-react'

interface FeaturedVilla {
    id: string
    name: string
    tagline: string
    description: string
    image: string
    bedrooms: number
    guests: number
    price: number
}

interface HeroClientProps {
    villas: FeaturedVilla[]
}

export default function HeroClient({ villas }: HeroClientProps) {
    const [current, setCurrent] = useState(0)
    const [isPlaying, setIsPlaying] = useState(true)
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [guests, setGuests] = useState(2)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [isMobile, setIsMobile] = useState(false)
    const heroRef = useRef<HTMLElement>(null)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    const minDate = new Date().toISOString().split('T')[0]

    // Check if mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Parallax scroll effect
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    })

    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
    const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.2])
    const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 0.5])
    const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
    const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

    // Track mouse for parallax effect (desktop only)
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isMobile || !heroRef.current) return
        const { clientX, clientY } = e
        const { width, height } = heroRef.current.getBoundingClientRect()
        setMousePosition({
            x: (clientX / width - 0.5) * 30,
            y: (clientY / height - 0.5) * 30,
        })
    }, [isMobile])

    useEffect(() => {
        if (!isMobile) {
            window.addEventListener('mousemove', handleMouseMove)
            return () => window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [handleMouseMove, isMobile])

    // Auto-slide
    useEffect(() => {
        if (isPlaying && villas.length > 1) {
            intervalRef.current = setInterval(() => {
                setCurrent((prev) => (prev + 1) % villas.length)
            }, 6000)
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [isPlaying, villas.length])

    const next = () => setCurrent((prev) => (prev + 1) % villas.length)
    const prev = () => setCurrent((prev) => (prev - 1 + villas.length) % villas.length)
    const goTo = (index: number) => setCurrent(index)

    const currentVilla = villas[current]

    if (!currentVilla) return null

    return (
        <section ref={heroRef} className="relative h-[100svh] overflow-hidden bg-gray-900">
            {/* Background with Parallax */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                >
                    <motion.div
                        style={isMobile ? {} : { y: heroY, scale: heroScale }}
                        className="absolute inset-[-50px] md:inset-[-100px]"
                    >
                        <motion.div
                            animate={isMobile ? {} : { x: mousePosition.x, y: mousePosition.y }}
                            transition={{ type: 'spring', damping: 50, stiffness: 100 }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={currentVilla.image}
                                alt={currentVilla.name}
                                fill
                                priority
                                className="object-cover"
                                sizes="100vw"
                            />
                        </motion.div>
                    </motion.div>

                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/60 to-gray-900/30 md:from-gray-900/90 md:via-gray-900/50 md:to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-gray-900/50 md:from-gray-900/80 md:via-transparent md:to-gray-900/40" />
                </motion.div>
            </AnimatePresence>

            {/* Dark overlay on scroll */}
            <motion.div
                style={{ opacity: overlayOpacity }}
                className="absolute inset-0 bg-black pointer-events-none z-10"
            />

            {/* Content Container - Flexbox to fill viewport */}
            <motion.div
                style={isMobile ? {} : { y: contentY, opacity: contentOpacity }}
                className="relative z-20 h-full flex flex-col justify-between pt-20 md:pt-24 pb-4 md:pb-6"
            >
                {/* Main Content */}
                <div className="flex-1 flex items-center px-4 sm:px-6 md:px-12 lg:px-20">
                    <div className="max-w-[1400px] mx-auto w-full">
                        <div className="max-w-full md:max-w-xl lg:max-w-2xl">
                            {/* Badge */}
                            <motion.div
                                key={`badge-${current}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 mb-3 md:mb-4"
                            >
                                <span className="w-1.5 h-1.5 bg-olive-400 rounded-full animate-pulse" />
                                <span className="text-white/80 text-[10px] sm:text-xs tracking-[0.15em] uppercase">
                                    {currentVilla.tagline}
                                </span>
                            </motion.div>

                            {/* Title */}
                            <div className="overflow-hidden mb-1 md:mb-2">
                                <motion.h1
                                    key={`name-${current}`}
                                    initial={{ y: 100 }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                    className="font-display text-[2rem] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-[1.1]"
                                >
                                    {currentVilla.name.split(' ').slice(0, -1).join(' ')}{' '}
                                    <span className="italic text-olive-400">
                                        {currentVilla.name.split(' ').slice(-1)}
                                    </span>
                                </motion.h1>
                            </div>

                            {/* Description */}
                            <motion.p
                                key={`desc-${current}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-white/60 text-sm md:text-base lg:text-lg max-w-md leading-relaxed mb-4 md:mb-6 line-clamp-2 md:line-clamp-3"
                            >
                                {currentVilla.description}
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="flex flex-wrap gap-3"
                            >
                                <Link
                                    href={`/villas/${currentVilla.id}`}
                                    className="group inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-olive-600 text-white text-xs sm:text-sm tracking-wider uppercase hover:bg-olive-400 transition-colors"
                                >
                                    <span>Explore</span>
                                    <ArrowRight size={14} />
                                </Link>
                                <Link
                                    href="/villas"
                                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 border border-white/30 text-white text-xs sm:text-sm tracking-wider uppercase hover:bg-white/10 transition-colors"
                                >
                                    <span>All Villas</span>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section - Controls & Search */}
                <div className="px-4 sm:px-6 md:px-12 lg:px-20">
                    <div className="max-w-[1400px] mx-auto">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-6">

                            {/* Slide Controls */}
                            <div className="flex items-center justify-between lg:justify-start gap-4">
                                {/* Nav Buttons */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={prev}
                                        className="w-9 h-9 md:w-10 md:h-10 border border-white/30 flex items-center justify-center text-white/60 hover:text-white hover:border-white transition-colors"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button
                                        onClick={next}
                                        className="w-9 h-9 md:w-10 md:h-10 border border-white/30 flex items-center justify-center text-white/60 hover:text-white hover:border-white transition-colors"
                                    >
                                        <ChevronRight size={16} />
                                    </button>

                                    {/* Play/Pause - Hidden on mobile */}
                                    <button
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        className="hidden sm:flex w-9 h-9 md:w-10 md:h-10 border border-white/30 items-center justify-center text-white/60 hover:text-white hover:border-white transition-colors"
                                    >
                                        {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                                    </button>
                                </div>

                                {/* Progress Dots */}
                                <div className="flex items-center gap-2">
                                    {villas.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => goTo(index)}
                                            className="relative h-1 overflow-hidden transition-all"
                                            style={{ width: index === current ? 32 : 16 }}
                                        >
                                            <div className="absolute inset-0 bg-white/20" />
                                            {index === current && (
                                                <motion.div
                                                    className="absolute inset-0 bg-olive-400"
                                                    initial={{ scaleX: 0 }}
                                                    animate={{ scaleX: 1 }}
                                                    transition={{ duration: 6, ease: 'linear' }}
                                                    style={{ transformOrigin: 'left' }}
                                                    key={`progress-${current}`}
                                                />
                                            )}
                                        </button>
                                    ))}

                                    {/* Counter */}
                                    <span className="hidden md:block text-white/40 text-xs font-mono ml-2">
                                        <span className="text-white">{String(current + 1).padStart(2, '0')}</span>
                                        /{String(villas.length).padStart(2, '0')}
                                    </span>
                                </div>
                            </div>

                            {/* Search Widget - Compact */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="bg-white p-3 md:p-4 shadow-xl w-full lg:max-w-lg"
                            >
                                <div className="grid grid-cols-4 gap-2">
                                    <div>
                                        <label className="block text-[8px] md:text-[9px] text-gray-400 uppercase tracking-wider mb-1">Check In</label>
                                        <input
                                            type="date"
                                            value={checkIn}
                                            onChange={(e) => {
                                                setCheckIn(e.target.value)
                                                if (checkOut && e.target.value >= checkOut) setCheckOut('')
                                            }}
                                            min={minDate}
                                            className="w-full px-2 py-2 border border-gray-200 text-xs focus:border-olive-600 outline-none bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[8px] md:text-[9px] text-gray-400 uppercase tracking-wider mb-1">Check Out</label>
                                        <input
                                            type="date"
                                            value={checkOut}
                                            onChange={(e) => setCheckOut(e.target.value)}
                                            min={checkIn || minDate}
                                            className="w-full px-2 py-2 border border-gray-200 text-xs focus:border-olive-600 outline-none bg-gray-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[8px] md:text-[9px] text-gray-400 uppercase tracking-wider mb-1">Guests</label>
                                        <div className="relative">
                                            <Users size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <select
                                                value={guests}
                                                onChange={(e) => setGuests(Number(e.target.value))}
                                                className="w-full pl-6 pr-1 py-2 border border-gray-200 text-xs focus:border-olive-600 outline-none bg-gray-50 appearance-none"
                                            >
                                                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                                    <option key={num} value={num}>{num}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex items-end">
                                        <Link
                                            href={`/villas?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}
                                            className="w-full flex items-center justify-center gap-1 py-2 bg-olive-600 text-white text-xs font-medium hover:bg-olive-900 transition-colors"
                                        >
                                            <Search size={12} />
                                            <span className="hidden sm:inline">Search</span>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator - Only on large screens */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 hidden xl:block"
                >
                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-white/30"
                    >
                        <ChevronDown size={20} />
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Thumbnails - Only on XL screens */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute top-1/2 -translate-y-1/2 right-8 z-30 hidden xl:flex flex-col gap-2"
            >
                {villas.map((villa, index) => (
                    <button
                        key={villa.id}
                        onClick={() => goTo(index)}
                        className={`relative overflow-hidden transition-all duration-300 ${index === current
                                ? 'w-16 h-16 ring-2 ring-olive-400'
                                : 'w-12 h-12 opacity-50 hover:opacity-100'
                            }`}
                    >
                        <Image src={villa.image} alt={villa.name} fill className="object-cover" sizes="64px" />
                    </button>
                ))}
            </motion.div>
        </section>
    )
}
