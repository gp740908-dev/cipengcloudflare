'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import { X, Bed, Bath, Users, MapPin, Check, ChevronLeft, ChevronRight, ArrowLeft, Navigation, ChevronDown, Star, Calendar, Sparkles } from 'lucide-react'
import { Villa } from '@/types'
import { formatCurrency } from '@/lib/utils'
import ModernBookingFlow from '@/components/ModernBookingFlow'
import AvailabilityCalendar from '@/components/AvailabilityCalendar'
import NearbyPlaces from '@/components/NearbyPlaces'

// Dynamic import for map (no SSR)
const VillaMap = dynamic(() => import('@/components/VillaMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center">
            <div className="text-center">
                <div className="w-8 h-8 border-2 border-olive-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-500">Loading map...</p>
            </div>
        </div>
    )
})

interface VillaDetailsProps {
    villa: Villa
}

// Scroll reveal component
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
        >
            {children}
        </motion.div>
    )
}

// Text reveal animation component
function TextReveal({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })

    return (
        <div className="overflow-hidden" ref={ref}>
            <motion.div
                initial={{ y: '100%' }}
                animate={isInView ? { y: 0 } : {}}
                transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
            >
                {children}
            </motion.div>
        </div>
    )
}

export default function VillaDetails({ villa }: VillaDetailsProps) {
    const [selectedImage, setSelectedImage] = useState(0)
    const [showLightbox, setShowLightbox] = useState(false)
    const [showBookingModal, setShowBookingModal] = useState(false)

    // Parallax refs
    const heroRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Hero parallax
    const { scrollYProgress: heroScrollProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    })

    const heroY = useTransform(heroScrollProgress, [0, 1], ['0%', '30%'])
    const heroScale = useTransform(heroScrollProgress, [0, 1], [1, 1.1])
    const heroOpacity = useTransform(heroScrollProgress, [0, 0.8], [1, 0])
    const overlayOpacity = useTransform(heroScrollProgress, [0, 0.5], [0.3, 0.7])
    const textY = useTransform(heroScrollProgress, [0, 1], ['0%', '50%'])

    // Gallery parallax
    const { scrollYProgress: galleryScrollProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const galleryY = useTransform(galleryScrollProgress, [0, 1], ['5%', '-5%'])

    const nextImage = () => {
        setSelectedImage((prev) => (prev + 1) % villa.images.length)
    }

    const prevImage = () => {
        setSelectedImage((prev) => (prev - 1 + villa.images.length) % villa.images.length)
    }

    return (
        <>
            {/* Full Screen Hero with Parallax */}
            <section ref={heroRef} className="relative h-[100svh] min-h-[600px] overflow-hidden -mt-24 w-full">
                {/* Parallax Background */}
                <motion.div
                    style={{ y: heroY, scale: heroScale }}
                    className="absolute inset-0"
                >
                    <Image
                        src={villa.images[0]}
                        alt={villa.name}
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                </motion.div>

                {/* Dynamic Overlay */}
                <motion.div
                    style={{ opacity: overlayOpacity }}
                    className="absolute inset-0 bg-black"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

                {/* Hero Content */}
                <motion.div
                    style={{ y: textY, opacity: heroOpacity }}
                    className="absolute inset-0 flex flex-col justify-end pb-20 sm:pb-24 px-4 sm:px-6 md:px-12"
                >
                    <div className="max-w-[1400px] mx-auto w-full">
                        {/* Back Button */}
                        <Link
                            href="/villas"
                            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 text-sm tracking-wide"
                        >
                            <ArrowLeft size={16} />
                            <span>Back to Collection</span>
                        </Link>

                        {/* Location Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center gap-2 mb-4"
                        >
                            <MapPin size={14} className="text-olive-400" />
                            <span className="text-white/70 text-sm tracking-wide">{villa.location}</span>
                        </motion.div>

                        {/* Villa Name */}
                        <div className="overflow-hidden mb-6">
                            <motion.h1
                                initial={{ y: 100 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-white leading-tight"
                            >
                                {villa.name}
                            </motion.h1>
                        </div>

                        {/* Quick Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-wrap items-center gap-3 sm:gap-6 md:gap-8 mb-6 sm:mb-8"
                        >
                            <div className="flex items-center gap-1.5 sm:gap-2 text-white/80">
                                <Bed size={16} className="sm:w-[18px] sm:h-[18px]" />
                                <span className="text-xs sm:text-sm">{villa.bedrooms} Beds</span>
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2 text-white/80">
                                <Bath size={16} className="sm:w-[18px] sm:h-[18px]" />
                                <span className="text-xs sm:text-sm">{villa.bathrooms} Baths</span>
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2 text-white/80">
                                <Users size={16} className="sm:w-[18px] sm:h-[18px]" />
                                <span className="text-xs sm:text-sm">{villa.max_guests} Guests</span>
                            </div>
                        </motion.div>

                        {/* Price */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="flex items-end gap-2 sm:gap-4"
                        >
                            <span className="font-display text-2xl sm:text-3xl md:text-4xl text-olive-400">
                                {formatCurrency(villa.price_per_night)}
                            </span>
                            <span className="text-white/50 text-xs sm:text-sm mb-0.5 sm:mb-1">per night</span>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Scroll Indicator - Hidden on mobile */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex flex-col items-center gap-2 text-white/50"
                    >
                        <span className="text-xs tracking-[0.2em] uppercase">Scroll to explore</span>
                        <ChevronDown size={20} />
                    </motion.div>
                </motion.div>
            </section>

            {/* Story Section - About */}
            <section className="py-16 sm:py-24 md:py-32 bg-cream relative overflow-hidden">
                {/* Decorative */}
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-olive-100/30 to-transparent pointer-events-none" />

                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                        {/* Left - Text */}
                        <div>
                            <ScrollReveal>
                                <p className="text-olive-600 text-xs tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                                    <Sparkles size={12} />
                                    The Experience
                                </p>
                            </ScrollReveal>

                            <TextReveal delay={0.1}>
                                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-6 sm:mb-8">
                                    Your Private <span className="italic text-olive-600">Sanctuary</span>
                                </h2>
                            </TextReveal>

                            <ScrollReveal delay={0.2}>
                                <p className="text-gray-600 leading-relaxed text-base sm:text-lg mb-6 sm:mb-8 whitespace-pre-line">
                                    {villa.description}
                                </p>
                            </ScrollReveal>
                        </div>

                        {/* Right - Key Features */}
                        <div className="grid grid-cols-3 gap-3 sm:gap-4">
                            {[
                                { icon: Bed, value: villa.bedrooms, label: 'Bedrooms' },
                                { icon: Bath, value: villa.bathrooms, label: 'Bathrooms' },
                                { icon: Users, value: villa.max_guests, label: 'Max Guests' },
                            ].map((stat, index) => (
                                <ScrollReveal key={stat.label} delay={0.2 + index * 0.1}>
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        className="p-4 sm:p-6 md:p-8 bg-white border border-gray-100 text-center"
                                    >
                                        <stat.icon size={20} className="sm:w-6 sm:h-6 mx-auto text-olive-600 mb-3 sm:mb-4" />
                                        <span className="font-display text-2xl sm:text-3xl md:text-4xl text-gray-900 block mb-1 sm:mb-2">
                                            {stat.value}
                                        </span>
                                        <p className="text-gray-500 text-xs sm:text-sm">{stat.label}</p>
                                    </motion.div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Split Screen Gallery Section */}
            <section ref={containerRef} className="relative bg-gray-900 overflow-hidden">
                <div className="grid lg:grid-cols-2 min-h-[600px] lg:min-h-[800px]">
                    {/* Left - Gallery */}
                    <div className="relative">
                        {/* Main Image */}
                        <motion.div
                            style={{ y: galleryY }}
                            className="relative h-[50vh] lg:h-full"
                        >
                            <div
                                className="relative h-full overflow-hidden cursor-pointer group"
                                onClick={() => setShowLightbox(true)}
                            >
                                <Image
                                    src={villa.images[selectedImage]}
                                    alt={`${villa.name} - Image ${selectedImage + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                                {/* Image Counter */}
                                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                                    <span className="px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-xs sm:text-sm">
                                        {selectedImage + 1} / {villa.images.length}
                                    </span>
                                    <span className="px-3 py-1 bg-black/50 backdrop-blur-sm text-white/80 text-xs hidden sm:block">
                                        Click to expand
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Thumbnail Strip - Horizontal at bottom on mobile, visible on all sizes */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                {villa.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 overflow-hidden transition-all ${selectedImage === index
                                            ? 'ring-2 ring-olive-400 opacity-100'
                                            : 'opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <Image
                                            src={image}
                                            alt={`Thumbnail ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right - Content */}
                    <div className="bg-gray-900 py-12 sm:py-16 lg:py-0 px-6 sm:px-10 lg:px-16 flex items-center">
                        <div className="w-full max-w-lg mx-auto lg:mx-0">
                            <ScrollReveal>
                                <div className="inline-flex items-center gap-3 mb-6">
                                    <div className="w-10 h-[1px] bg-olive-400" />
                                    <span className="text-olive-400 text-xs tracking-[0.3em] uppercase">Gallery</span>
                                </div>
                            </ScrollReveal>

                            <TextReveal delay={0.1}>
                                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-6 leading-tight">
                                    Explore Every<br />
                                    <span className="italic text-olive-400">Detail</span>
                                </h2>
                            </TextReveal>

                            <ScrollReveal delay={0.2}>
                                <p className="text-white/60 text-base sm:text-lg mb-8 leading-relaxed">
                                    Browse through our carefully curated gallery showcasing the beauty and elegance of {villa.name}.
                                    Every corner is designed for your comfort and pleasure.
                                </p>
                            </ScrollReveal>

                            {/* Quick Features */}
                            <ScrollReveal delay={0.3}>
                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    {[
                                        { icon: Bed, value: villa.bedrooms, label: 'Beds' },
                                        { icon: Bath, value: villa.bathrooms, label: 'Baths' },
                                        { icon: Users, value: villa.max_guests, label: 'Guests' },
                                    ].map((stat, index) => (
                                        <div key={index} className="text-center p-3 sm:p-4 bg-white/5 border border-white/10">
                                            <stat.icon size={18} className="mx-auto text-olive-400 mb-2" />
                                            <p className="font-display text-xl sm:text-2xl text-white">{stat.value}</p>
                                            <p className="text-white/50 text-xs">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </ScrollReveal>

                            {/* CTA */}
                            <ScrollReveal delay={0.4}>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() => setShowBookingModal(true)}
                                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-olive-600 text-white text-xs sm:text-sm tracking-wider uppercase hover:bg-olive-500 transition-colors"
                                    >
                                        <Calendar size={16} />
                                        <span>Book Now</span>
                                    </button>
                                    <button
                                        onClick={() => setShowLightbox(true)}
                                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/30 text-white text-xs sm:text-sm tracking-wider uppercase hover:bg-white/10 transition-colors"
                                    >
                                        <span>View All Photos</span>
                                    </button>
                                </div>
                            </ScrollReveal>

                            {/* Price Tag */}
                            <ScrollReveal delay={0.5}>
                                <div className="mt-8 pt-6 border-t border-white/10">
                                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Starting from</p>
                                    <p className="font-display text-2xl sm:text-3xl text-olive-400">
                                        {formatCurrency(villa.price_per_night)}
                                        <span className="text-white/50 text-sm ml-2">/ night</span>
                                    </p>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* Amenities Section */}
            <section className="py-16 sm:py-24 md:py-32 bg-white relative">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12">
                    <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
                        {/* Left - Amenities */}
                        <div>
                            <ScrollReveal>
                                <p className="text-olive-600 text-xs tracking-[0.3em] uppercase mb-3 sm:mb-4">
                                    Premium Amenities
                                </p>
                            </ScrollReveal>

                            <TextReveal delay={0.1}>
                                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-8 sm:mb-12">
                                    Every Detail <span className="italic text-olive-600">Considered</span>
                                </h2>
                            </TextReveal>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4 sm:gap-y-6">
                                {villa.amenities.map((amenity, index) => (
                                    <ScrollReveal key={index} delay={0.05 * index}>
                                        <motion.div
                                            whileHover={{ x: 5 }}
                                            className="flex items-center gap-3 py-3 border-b border-gray-100"
                                        >
                                            <Check size={18} className="text-olive-600 flex-shrink-0" />
                                            <span className="text-gray-700">{amenity}</span>
                                        </motion.div>
                                    </ScrollReveal>
                                ))}
                            </div>
                        </div>

                        {/* Right - Availability Calendar */}
                        <ScrollReveal delay={0.3}>
                            <div className="lg:sticky lg:top-32">
                                <AvailabilityCalendar villaId={villa.id} />
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Location & Nearby Places */}
            {(villa.latitude && villa.longitude) && (
                <section className="py-16 sm:py-24 md:py-32 bg-olive-100/30 relative overflow-hidden">
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12">
                        <div className="text-center mb-8 sm:mb-12 md:mb-16">
                            <ScrollReveal>
                                <p className="text-olive-600 text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-3 sm:mb-4">
                                    Location
                                </p>
                            </ScrollReveal>

                            <TextReveal delay={0.1}>
                                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-gray-900">
                                    Discover the <span className="italic text-olive-600">Surroundings</span>
                                </h2>
                            </TextReveal>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-start">
                            {/* Map */}
                            <ScrollReveal>
                                <div className="relative">
                                    <VillaMap
                                        latitude={villa.latitude}
                                        longitude={villa.longitude}
                                        villaName={villa.name}
                                        location={villa.location}
                                    />
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${villa.latitude},${villa.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 sm:mt-4 inline-flex items-center gap-2 text-olive-600 hover:text-olive-900 transition-colors text-xs sm:text-sm"
                                    >
                                        <Navigation size={14} />
                                        <span>Get Directions</span>
                                    </a>
                                </div>
                            </ScrollReveal>

                            {/* Nearby Places */}
                            <ScrollReveal delay={0.2}>
                                {villa.nearby_places && villa.nearby_places.length > 0 && (
                                    <NearbyPlaces places={villa.nearby_places} />
                                )}
                            </ScrollReveal>
                        </div>
                    </div>
                </section>
            )}

            {/* Final CTA Section */}
            <section className="relative py-20 sm:py-32 md:py-48 overflow-hidden">
                {/* Parallax Background */}
                <div className="absolute inset-0">
                    <Image
                        src={villa.images[villa.images.length - 1] || villa.images[0]}
                        alt="Villa ambiance"
                        fill
                        className="object-cover"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-black/70" />
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 text-center">
                    <ScrollReveal>
                        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} className="sm:w-4 sm:h-4 text-olive-400 fill-olive-400" />
                            ))}
                        </div>
                    </ScrollReveal>

                    <TextReveal delay={0.1}>
                        <h2 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-white mb-4 sm:mb-8 leading-tight">
                            Ready to <span className="italic text-olive-400">Experience</span> Paradise?
                        </h2>
                    </TextReveal>

                    <ScrollReveal delay={0.2}>
                        <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto mb-8 sm:mb-12 px-4">
                            Book your stay at {villa.name} and discover the perfect blend of luxury and tranquility in the heart of Bali.
                        </p>
                    </ScrollReveal>

                    <ScrollReveal delay={0.3}>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                            <button
                                onClick={() => setShowBookingModal(true)}
                                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-10 py-4 sm:py-5 bg-olive-600 text-white text-xs sm:text-sm tracking-[0.1em] sm:tracking-[0.15em] uppercase hover:bg-olive-400 transition-colors"
                            >
                                <Calendar size={16} className="sm:w-[18px] sm:h-[18px]" />
                                <span>Check Availability</span>
                            </button>
                            <a
                                href={`https://wa.me/6281234567890?text=Hi, I'm interested in ${villa.name}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-10 py-4 sm:py-5 border border-white/30 text-white text-xs sm:text-sm tracking-[0.1em] sm:tracking-[0.15em] uppercase hover:bg-white/10 transition-colors"
                            >
                                <span>Contact Us</span>
                            </a>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={0.4}>
                        <p className="mt-8 sm:mt-12 text-white/40 text-xs sm:text-sm">
                            Starting from <span className="text-olive-400 font-display text-xl sm:text-2xl">{formatCurrency(villa.price_per_night)}</span> per night
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Lightbox */}
            <AnimatePresence>
                {showLightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black flex items-center justify-center"
                        onClick={() => setShowLightbox(false)}
                    >
                        <button
                            onClick={() => setShowLightbox(false)}
                            className="absolute top-4 right-4 sm:top-8 sm:right-8 text-white/60 hover:text-white transition-colors z-10"
                        >
                            <X size={28} className="sm:w-8 sm:h-8" />
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-14 sm:h-14 border border-white/30 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all"
                        >
                            <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-14 sm:h-14 border border-white/30 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all"
                        >
                            <ChevronRight size={20} className="sm:w-6 sm:h-6" />
                        </button>

                        <motion.div
                            key={selectedImage}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative w-full max-w-6xl aspect-[16/10] mx-4 sm:mx-8"
                        >
                            <Image
                                src={villa.images[selectedImage]}
                                alt={`${villa.name} - Image ${selectedImage + 1}`}
                                fill
                                className="object-contain"
                            />
                        </motion.div>

                        {/* Thumbnails - scrollable on mobile */}
                        <div className="absolute bottom-8 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto flex gap-2 overflow-x-auto pb-2 justify-start sm:justify-center">
                            {villa.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => { e.stopPropagation(); setSelectedImage(index); }}
                                    className={`w-16 h-12 relative overflow-hidden transition-all ${index === selectedImage ? 'ring-2 ring-white' : 'opacity-50 hover:opacity-100'
                                        }`}
                                >
                                    <Image src={img} alt="" fill className="object-cover" />
                                </button>
                            ))}
                        </div>

                        <p className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/60 text-sm">
                            {selectedImage + 1} / {villa.images.length}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Booking Modal */}
            {showBookingModal && (
                <ModernBookingFlow
                    villa={villa}
                    onClose={() => setShowBookingModal(false)}
                />
            )}
        </>
    )
}
