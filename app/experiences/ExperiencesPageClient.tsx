'use client'

import { useState, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Filter, X, Sparkles, MapPin, Clock } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface Experience {
    id: string
    title: string
    description: string | null
    image: string | null
    category: string
    featured?: boolean
}

interface ExperiencesPageClientProps {
    experiences: Experience[]
    categories: string[]
}

export default function ExperiencesPageClient({ experiences, categories }: ExperiencesPageClientProps) {
    const [activeCategory, setActiveCategory] = useState('all')
    const [showFilters, setShowFilters] = useState(false)
    const heroRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    })

    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

    const filteredExperiences = activeCategory === 'all'
        ? experiences
        : experiences.filter(e => e.category === activeCategory)

    const categoryLabels: { [key: string]: string } = {
        all: 'All Experiences',
        wellness: 'Wellness',
        relaxation: 'Relaxation',
        adventure: 'Adventure',
        culture: 'Culture',
        spiritual: 'Spiritual',
        creative: 'Creative'
    }

    return (
        <main className="min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section ref={heroRef} className="relative h-[70vh] overflow-hidden">
                <motion.div
                    style={{ y: heroY }}
                    className="absolute inset-0"
                >
                    <Image
                        src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920"
                        alt="Bali Experiences"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-olive-900" />
                </motion.div>

                <motion.div
                    style={{ opacity: heroOpacity }}
                    className="relative z-10 h-full flex items-center justify-center text-center px-6"
                >
                    <div className="max-w-4xl">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-olive-300 text-xs tracking-[0.4em] uppercase mb-6"
                        >
                            Beyond Accommodation
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="font-display text-5xl md:text-7xl text-white mb-6"
                        >
                            Curated <span className="italic text-olive-300">Experiences</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto"
                        >
                            Immerse yourself in the magic of Ubud with our carefully crafted experiences,
                            designed to connect you with the soul of Bali.
                        </motion.p>
                    </div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center pt-2"
                    >
                        <div className="w-1 h-2 bg-white/50 rounded-full" />
                    </motion.div>
                </motion.div>
            </section>

            {/* Content Section */}
            <section className="bg-cream py-20 md:py-32">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                    {/* Filter Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
                        <div className="flex items-center gap-2">
                            <Sparkles size={20} className="text-olive-600" />
                            <span className="text-gray-500 text-sm">
                                {filteredExperiences.length} experiences available
                            </span>
                        </div>

                        {/* Desktop Filters */}
                        <div className="hidden md:flex items-center gap-2">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-4 py-2 text-sm transition-all ${activeCategory === category
                                            ? 'bg-olive-600 text-white'
                                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                >
                                    {categoryLabels[category] || category}
                                </button>
                            ))}
                        </div>

                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(true)}
                            className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200"
                        >
                            <Filter size={16} />
                            <span className="text-sm">Filter</span>
                        </button>
                    </div>

                    {/* Experiences Grid */}
                    <motion.div
                        layout
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredExperiences.map((experience, index) => (
                                <motion.div
                                    key={experience.id}
                                    layout
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    className="group bg-white border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-500"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-[4/3] overflow-hidden">
                                        {experience.image ? (
                                            <Image
                                                src={experience.image}
                                                alt={experience.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-olive-100" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        {/* Featured Badge */}
                                        {experience.featured && (
                                            <div className="absolute top-4 left-4 px-3 py-1 bg-olive-600 text-white text-xs tracking-wider uppercase">
                                                Featured
                                            </div>
                                        )}

                                        {/* Category Badge */}
                                        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 text-olive-900 text-xs tracking-wider uppercase">
                                            {experience.category}
                                        </div>

                                        {/* Hover Button */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            whileHover={{ opacity: 1, y: 0 }}
                                            className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <div className="w-12 h-12 bg-olive-600 text-white flex items-center justify-center hover:bg-olive-500 transition-colors">
                                                <ArrowRight size={20} />
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="font-display text-2xl text-gray-900 mb-3 group-hover:text-olive-600 transition-colors">
                                            {experience.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                                            {experience.description}
                                        </p>

                                        <div className="flex items-center gap-4 text-xs text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <MapPin size={12} />
                                                <span>Ubud, Bali</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock size={12} />
                                                <span>2-4 hours</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* Empty State */}
                    {filteredExperiences.length === 0 && (
                        <div className="text-center py-20">
                            <Sparkles size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="font-display text-2xl text-gray-900 mb-2">No experiences found</h3>
                            <p className="text-gray-500">Try selecting a different category</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-olive-900 py-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <p className="text-olive-400 text-xs tracking-[0.3em] uppercase mb-4">Ready to Explore?</p>
                    <h2 className="font-display text-3xl md:text-5xl text-white mb-6">
                        Book Your <span className="italic">Experience</span>
                    </h2>
                    <p className="text-white/60 mb-8 max-w-2xl mx-auto">
                        Contact our concierge team to arrange personalized experiences during your stay.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-olive-900 font-medium text-sm tracking-[0.1em] uppercase hover:bg-olive-100 transition-colors"
                    >
                        <span>Contact Concierge</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            {/* Mobile Filter Modal */}
            <AnimatePresence>
                {showFilters && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-50"
                            onClick={() => setShowFilters(false)}
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-3xl p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-display text-xl">Filter Experiences</h3>
                                <button onClick={() => setShowFilters(false)}>
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => {
                                            setActiveCategory(category)
                                            setShowFilters(false)
                                        }}
                                        className={`px-4 py-3 text-sm transition-all ${activeCategory === category
                                                ? 'bg-olive-600 text-white'
                                                : 'bg-gray-100 text-gray-600'
                                            }`}
                                    >
                                        {categoryLabels[category] || category}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <Footer />
        </main>
    )
}
