'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Gift, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PromotionalBanner } from '@/types'
import Link from 'next/link'
import Image from 'next/image'

interface Props {
    page?: string
}

export default function PromoBanner({ page = 'home' }: Props) {
    const [banner, setBanner] = useState<PromotionalBanner | null>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [isDismissed, setIsDismissed] = useState(false)

    useEffect(() => {
        fetchBanner()
    }, [page])

    async function fetchBanner() {
        try {
            const supabase = createClient()
            const now = new Date().toISOString()

            // Simpler query - fetch all active banners first
            const { data: banners, error } = await supabase
                .from('promotional_banners')
                .select('*')
                .eq('is_active', true)
                .order('priority', { ascending: false })

            if (error) {
                console.error('Error fetching banners:', error)
                return
            }


            if (!banners || banners.length === 0) {
                return
            }

            // Filter by validity date and page manually
            const validBanner = banners.find(b => {
                const validFrom = new Date(b.valid_from)
                const validUntil = b.valid_until ? new Date(b.valid_until) : null
                const nowDate = new Date()

                const isDateValid = validFrom <= nowDate && (!validUntil || validUntil >= nowDate)
                const isPageValid = !b.show_on_pages || b.show_on_pages.length === 0 || b.show_on_pages.includes(page)


                return isDateValid && isPageValid
            })

            if (!validBanner) {
                return
            }

            // Check frequency
            const storageKey = `promo_banner_${validBanner.id}`
            const lastShown = localStorage.getItem(storageKey)

            if (validBanner.show_frequency === 'once_ever' && lastShown) {
                return
            }

            if (validBanner.show_frequency === 'once_per_day' && lastShown) {
                const lastDate = new Date(lastShown).toDateString()
                const today = new Date().toDateString()
                if (lastDate === today) {
                    return
                }
            }

            if (validBanner.show_frequency === 'once_per_session' && sessionStorage.getItem(storageKey)) {
                return
            }

            setBanner(validBanner)

            // Show after delay
            setTimeout(() => {
                setIsVisible(true)
                // Mark as shown
                localStorage.setItem(storageKey, new Date().toISOString())
                if (validBanner.show_frequency === 'once_per_session') {
                    sessionStorage.setItem(storageKey, 'true')
                }
            }, (validBanner.delay_seconds || 3) * 1000)
        } catch (error) {
            console.error('Error:', error)
        }
    }

    function handleDismiss() {
        setIsDismissed(true)
        setTimeout(() => {
            setIsVisible(false)
        }, 300)
    }

    if (!banner || !isVisible) return null

    const positionClasses: Record<string, string> = {
        'bottom-right': 'bottom-6 right-6',
        'bottom-left': 'bottom-6 left-6',
        'top-right': 'top-24 right-6',
        'top-left': 'top-24 left-6',
        'center': 'inset-0 flex items-center justify-center',
        'full-width': 'bottom-0 left-0 right-0',
    }

    const animationVariants = {
        'popup': {
            initial: { opacity: 0, scale: 0.9, y: 20 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.9, y: 20 },
        },
        'slide-in': {
            initial: { opacity: 0, x: banner.position.includes('right') ? 100 : -100 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: banner.position.includes('right') ? 100 : -100 },
        },
        'banner': {
            initial: { opacity: 0, y: 50 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: 50 },
        },
    }

    const variant = animationVariants[banner.display_type] || animationVariants.popup

    return (
        <AnimatePresence>
            {!isDismissed && (
                <>
                    {/* Backdrop for center modal */}
                    {banner.position === 'center' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 z-[60]"
                            onClick={handleDismiss}
                        />
                    )}

                    <motion.div
                        initial={variant.initial}
                        animate={variant.animate}
                        exit={variant.exit}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className={`fixed z-[70] ${positionClasses[banner.position] || positionClasses['bottom-right']}`}
                    >
                        {banner.position === 'center' ? (
                            /* Center Modal Style */
                            <div
                                className="relative w-full max-w-md mx-4 overflow-hidden shadow-2xl"
                                style={{ backgroundColor: banner.background_color }}
                            >
                                {/* Close button */}
                                <button
                                    onClick={handleDismiss}
                                    className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors"
                                    style={{ color: banner.text_color }}
                                >
                                    <X size={18} />
                                </button>

                                {/* Image */}
                                {banner.image_url && (
                                    <div className="relative h-48 w-full">
                                        <Image
                                            src={banner.image_url}
                                            alt={banner.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}

                                {/* Content */}
                                <div className="p-8">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Gift size={16} style={{ color: banner.text_color }} className="opacity-70" />
                                        <span
                                            className="text-[10px] uppercase tracking-[0.2em] opacity-70"
                                            style={{ color: banner.text_color }}
                                        >
                                            Special Offer
                                        </span>
                                    </div>
                                    <h3
                                        className="text-2xl font-display mb-2"
                                        style={{ color: banner.text_color }}
                                    >
                                        {banner.title}
                                    </h3>
                                    {banner.subtitle && (
                                        <p
                                            className="text-lg opacity-90 mb-2"
                                            style={{ color: banner.text_color }}
                                        >
                                            {banner.subtitle}
                                        </p>
                                    )}
                                    {banner.description && (
                                        <p
                                            className="text-sm opacity-70 mb-6"
                                            style={{ color: banner.text_color }}
                                        >
                                            {banner.description}
                                        </p>
                                    )}
                                    {banner.cta_text && banner.cta_link && (
                                        <Link
                                            href={banner.cta_link}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-sm font-medium tracking-wide transition-colors"
                                            style={{ color: banner.text_color }}
                                        >
                                            <span>{banner.cta_text}</span>
                                            <ArrowRight size={16} />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ) : banner.position === 'full-width' ? (
                            /* Full Width Banner Style */
                            <div
                                className="w-full py-4 px-6 shadow-lg"
                                style={{ backgroundColor: banner.background_color }}
                            >
                                <div className="max-w-7xl mx-auto flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Sparkles size={20} style={{ color: banner.text_color }} />
                                        <div>
                                            <p
                                                className="font-medium"
                                                style={{ color: banner.text_color }}
                                            >
                                                {banner.title}
                                                {banner.subtitle && (
                                                    <span className="ml-2 opacity-70">{banner.subtitle}</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {banner.cta_text && banner.cta_link && (
                                            <Link
                                                href={banner.cta_link}
                                                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-sm font-medium transition-colors"
                                                style={{ color: banner.text_color }}
                                            >
                                                {banner.cta_text}
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleDismiss}
                                            className="p-1 hover:bg-white/20 transition-colors"
                                            style={{ color: banner.text_color }}
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Corner Popup/Slide-in Style */
                            <div
                                className="w-80 shadow-2xl overflow-hidden"
                                style={{ backgroundColor: banner.background_color }}
                            >
                                {/* Close button */}
                                <button
                                    onClick={handleDismiss}
                                    className="absolute top-3 right-3 z-10 w-6 h-6 bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors"
                                    style={{ color: banner.text_color }}
                                >
                                    <X size={14} />
                                </button>

                                {/* Image */}
                                {banner.image_url && (
                                    <div className="relative h-32 w-full">
                                        <Image
                                            src={banner.image_url}
                                            alt={banner.title}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                    </div>
                                )}

                                {/* Content */}
                                <div className="p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Gift size={14} style={{ color: banner.text_color }} className="opacity-70" />
                                        <span
                                            className="text-[10px] uppercase tracking-[0.15em] opacity-70"
                                            style={{ color: banner.text_color }}
                                        >
                                            Special Offer
                                        </span>
                                    </div>
                                    <h3
                                        className="text-lg font-display mb-1"
                                        style={{ color: banner.text_color }}
                                    >
                                        {banner.title}
                                    </h3>
                                    {banner.subtitle && (
                                        <p
                                            className="text-sm opacity-90 mb-1"
                                            style={{ color: banner.text_color }}
                                        >
                                            {banner.subtitle}
                                        </p>
                                    )}
                                    {banner.description && (
                                        <p
                                            className="text-xs opacity-60 mb-4 line-clamp-2"
                                            style={{ color: banner.text_color }}
                                        >
                                            {banner.description}
                                        </p>
                                    )}
                                    {banner.cta_text && banner.cta_link && (
                                        <Link
                                            href={banner.cta_link}
                                            className="inline-flex items-center gap-1.5 text-sm font-medium hover:gap-2.5 transition-all"
                                            style={{ color: banner.text_color }}
                                        >
                                            <span>{banner.cta_text}</span>
                                            <ArrowRight size={14} />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
