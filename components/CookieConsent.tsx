'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X } from 'lucide-react'
import Link from 'next/link'

const COOKIE_CONSENT_KEY = 'stayinubud_cookie_consent'

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Check if user has already consented
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
        if (!consent) {
            // Show banner after a short delay
            const timer = setTimeout(() => {
                setIsVisible(true)
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [])

    function handleAccept() {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
        setIsVisible(false)
    }

    function handleDecline() {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'declined')
        setIsVisible(false)
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed bottom-0 left-0 right-0 z-[9998] p-4 sm:p-6"
                >
                    <div className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-xl">
                        <div className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                {/* Icon & Text */}
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="w-10 h-10 bg-olive-100 flex items-center justify-center flex-shrink-0">
                                        <Cookie size={20} className="text-olive-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            We use cookies to enhance your browsing experience and analyze site traffic.{' '}
                                            <Link
                                                href="/privacy"
                                                className="text-olive-600 hover:underline"
                                            >
                                                Learn more
                                            </Link>
                                        </p>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex items-center gap-3 sm:flex-shrink-0">
                                    <button
                                        onClick={handleDecline}
                                        className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        Decline
                                    </button>
                                    <button
                                        onClick={handleAccept}
                                        className="px-6 py-2 bg-olive-600 text-white text-sm font-medium tracking-wide hover:bg-olive-700 transition-colors"
                                    >
                                        Accept
                                    </button>
                                </div>

                                {/* Close button - mobile */}
                                <button
                                    onClick={handleDecline}
                                    className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 sm:hidden"
                                    aria-label="Close"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
