'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

interface ExperienceItem {
    id: string
    title: string
    description: string | null
    image: string | null
    category: string
}

interface ExperienceClientProps {
    experiences: ExperienceItem[]
}

export default function ExperienceClient({ experiences }: ExperienceClientProps) {
    const containerRef = useRef<HTMLElement>(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const isInView = useInView(containerRef, { once: true, margin: "-100px" })

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])

    // Take only first 4 for split layout
    const featuredExperiences = experiences.slice(0, 4)
    const activeExperience = featuredExperiences[activeIndex]

    return (
        <section ref={containerRef} className="relative min-h-screen bg-olive-900 overflow-hidden">
            {/* Parallax Background */}
            <motion.div
                style={{ y: backgroundY }}
                className="absolute inset-0 pointer-events-none"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-olive-900 via-olive-800 to-olive-900" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-black/20 to-transparent" />
            </motion.div>

            {/* Split Screen Layout */}
            <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
                {/* Left Side - Content */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-16 py-20 lg:py-0">
                    <div className="max-w-xl mx-auto lg:mx-0 lg:ml-auto lg:mr-16">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6 }}
                        >
                            <p className="text-olive-400 text-xs tracking-[0.3em] uppercase mb-4">
                                Beyond Accommodation
                            </p>
                            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
                                Curated<br />
                                <span className="italic text-olive-400">Experiences</span>
                            </h2>
                            <p className="text-white/50 text-lg leading-relaxed mb-12">
                                Immerse yourself in the magic of Ubud with our carefully crafted experiences,
                                designed to connect you with the soul of Bali.
                            </p>
                        </motion.div>

                        {/* Experience List */}
                        <div className="space-y-4 mb-12">
                            {featuredExperiences.map((experience, index) => (
                                <motion.div
                                    key={experience.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                >
                                    <button
                                        onClick={() => setActiveIndex(index)}
                                        className={`w-full text-left group flex items-center justify-between p-4 border-l-2 transition-all duration-300 ${activeIndex === index
                                                ? 'border-olive-400 bg-white/5'
                                                : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className={`font-display text-2xl transition-colors ${activeIndex === index ? 'text-olive-400' : 'text-white/30'
                                                }`}>
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <div>
                                                <h3 className={`font-display text-xl transition-colors ${activeIndex === index ? 'text-white' : 'text-white/60'
                                                    }`}>
                                                    {experience.title}
                                                </h3>
                                                <p className={`text-sm capitalize transition-colors ${activeIndex === index ? 'text-olive-400' : 'text-white/30'
                                                    }`}>
                                                    {experience.category}
                                                </p>
                                            </div>
                                        </div>
                                        <ArrowRight
                                            size={20}
                                            className={`transition-all duration-300 ${activeIndex === index
                                                    ? 'text-olive-400 translate-x-0'
                                                    : 'text-white/20 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'
                                                }`}
                                        />
                                    </button>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <Link
                                href="/experiences"
                                className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-olive-900 font-medium text-sm tracking-[0.1em] uppercase hover:bg-olive-100 transition-all"
                            >
                                <span>View All Experiences</span>
                                <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {/* Right Side - Image */}
                <div className="w-full lg:w-1/2 relative min-h-[60vh] lg:min-h-screen">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeExperience?.id}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.6 }}
                            className="absolute inset-0"
                        >
                            {activeExperience?.image && (
                                <Image
                                    src={activeExperience.image}
                                    alt={activeExperience.title}
                                    fill
                                    className="object-cover"
                                />
                            )}
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-olive-900 via-olive-900/50 to-transparent lg:opacity-100 opacity-70" />
                            <div className="absolute inset-0 bg-gradient-to-t from-olive-900/80 via-transparent to-transparent" />
                        </motion.div>
                    </AnimatePresence>

                    {/* Image Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeExperience?.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <p className="text-olive-300 text-xs tracking-[0.2em] uppercase mb-3">
                                    {activeExperience?.category}
                                </p>
                                <h3 className="font-display text-3xl md:text-4xl text-white mb-4">
                                    {activeExperience?.title}
                                </h3>
                                <p className="text-white/60 max-w-md leading-relaxed">
                                    {activeExperience?.description}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Dots */}
                    <div className="absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                        {featuredExperiences.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === index
                                        ? 'bg-olive-400 scale-125'
                                        : 'bg-white/30 hover:bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-20 left-20 w-64 h-64 border border-olive-700/20 rounded-full pointer-events-none hidden lg:block" />
            <div className="absolute bottom-20 left-40 w-32 h-32 border border-olive-600/20 rounded-full pointer-events-none hidden lg:block" />
        </section>
    )
}
