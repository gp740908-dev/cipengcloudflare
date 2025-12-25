'use client'

import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export default function BackToTop() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 500)
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (!isVisible) return null

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-8 left-8 z-40 w-12 h-12 bg-primary text-white flex items-center justify-center hover:bg-secondary transition-all duration-300 animate-fade-up"
            aria-label="Back to top"
        >
            <ArrowUp size={20} />
        </button>
    )
}
