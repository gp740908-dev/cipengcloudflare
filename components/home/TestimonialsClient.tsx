'use client'

import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence, useMotionValue, useScroll, useTransform } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Star, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import { Testimonial } from '@/types'

interface TestimonialsClientProps {
    testimonials: Testimonial[]
}

// Text reveal component
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

// Scroll reveal component
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-80px" })

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

export default function TestimonialsClient({ testimonials }: TestimonialsClientProps) {
    const [current, setCurrent] = useState(0)
    const containerRef = useRef<HTMLElement>(null)
    const isInView = useInView(containerRef, { once: true, margin: "-100px" })

    // Parallax
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
    const quoteRotate = useTransform(scrollYProgress, [0, 1], [0, 15])

    // Drag handling
    const dragX = useMotionValue(0)

    const next = () => setCurrent((prev) => (prev + 1) % testimonials.length)
    const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)

    const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
        if (info.offset.x > 50) prev()
        else if (info.offset.x < -50) next()
    }

    if (testimonials.length === 0) return null

    return (
        <section ref={containerRef} className="py-32 md:py-40 bg-cream relative overflow-hidden">
            {/* Parallax Background */}
            <motion.div
                style={{ y: backgroundY }}
                className="absolute inset-0 pointer-events-none"
            >
                {/* Decorative Quote */}
                <motion.div
                    style={{ rotate: quoteRotate }}
                    className="absolute top-10 left-10 md:left-20 opacity-[0.03]"
                >
                    <Quote size={500} strokeWidth={0.5} />
                </motion.div>

                {/* Decorative circles */}
                <div className="absolute top-1/4 right-20 w-80 h-80 border border-olive-200/30 rounded-full" />
                <div className="absolute bottom-20 left-1/4 w-64 h-64 border border-olive-200/20 rounded-full" />

                {/* Gradient orbs */}
                <div className="absolute top-20 right-0 w-96 h-96 bg-olive-100/30 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-olive-100/20 rounded-full blur-3xl" />
            </motion.div>

            <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12">
                {/* Header */}
                <div className="text-center mb-16 md:mb-24">
                    <ScrollReveal>
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <MessageCircle size={14} className="text-olive-600" />
                            <p className="text-olive-600 text-xs tracking-[0.3em] uppercase">
                                Guest Experiences
                            </p>
                        </div>
                    </ScrollReveal>

                    <TextReveal delay={0.1}>
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6">
                            What Our <span className="italic text-olive-600">Guests</span> Say
                        </h2>
                    </TextReveal>

                    <ScrollReveal delay={0.2}>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                            Real stories from travelers who discovered the magic of our curated villa collection.
                        </p>
                    </ScrollReveal>
                </div>

                {/* Testimonial Slider */}
                <div className="relative max-w-5xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.1}
                            onDragEnd={handleDragEnd}
                            style={{ x: dragX }}
                            className="cursor-grab active:cursor-grabbing"
                        >
                            <div className="bg-white p-8 md:p-16 shadow-xl">
                                {/* Stars */}
                                <div className="flex items-center justify-center gap-2 mb-10">
                                    {[...Array(testimonials[current].rating)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0, rotate: -180 }}
                                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                            transition={{ delay: 0.1 + i * 0.08 }}
                                        >
                                            <Star size={20} className="text-olive-400 fill-olive-400" />
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Quote */}
                                <blockquote className="text-center text-2xl md:text-3xl lg:text-4xl font-display text-gray-900 leading-relaxed mb-12 max-w-4xl mx-auto">
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        "{testimonials[current].quote}"
                                    </motion.span>
                                </blockquote>

                                {/* Author */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="relative mb-5">
                                        {testimonials[current].guest_image ? (
                                            <div className="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-olive-100">
                                                <Image
                                                    src={testimonials[current].guest_image}
                                                    alt={testimonials[current].guest_name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-20 h-20 rounded-full bg-olive-600 flex items-center justify-center text-white text-2xl font-display">
                                                {testimonials[current].guest_name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <p className="font-display text-xl text-gray-900 mb-1">
                                        {testimonials[current].guest_name}
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        {testimonials[current].guest_location}
                                        {testimonials[current].villa_name && (
                                            <span className="text-olive-600"> • {testimonials[current].villa_name}</span>
                                        )}
                                    </p>
                                </motion.div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    {testimonials.length > 1 && (
                        <div className="flex items-center justify-center gap-6 mt-10">
                            <motion.button
                                whileHover={{ scale: 1.1, x: -3 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={prev}
                                className="w-14 h-14 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-olive-600 hover:border-olive-600 hover:bg-olive-50 transition-all"
                            >
                                <ChevronLeft size={22} />
                            </motion.button>

                            <div className="flex items-center gap-3">
                                {testimonials.map((_, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => setCurrent(index)}
                                        whileHover={{ scale: 1.2 }}
                                        className={`transition-all duration-300 ${index === current
                                            ? 'w-10 h-2 bg-olive-600'
                                            : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                                            }`}
                                    />
                                ))}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.1, x: 3 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={next}
                                className="w-14 h-14 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-olive-600 hover:border-olive-600 hover:bg-olive-50 transition-all"
                            >
                                <ChevronRight size={22} />
                            </motion.button>
                        </div>
                    )}

                    {/* Mobile swipe hint */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 1.5 }}
                        className="md:hidden text-center text-gray-400 text-xs mt-8"
                    >
                        ← Swipe to navigate →
                    </motion.p>
                </div>
            </div>
        </section>
    )
}
