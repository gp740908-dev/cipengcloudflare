'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
    label: string
    href?: string
}

interface PageHeaderProps {
    title: string
    subtitle?: string
    backgroundImage?: string
    breadcrumbs?: BreadcrumbItem[]
    overlay?: 'light' | 'dark' | 'gradient'
    height?: 'small' | 'medium' | 'large'
}

export default function PageHeader({
    title,
    subtitle,
    backgroundImage = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
    breadcrumbs = [],
    overlay = 'dark',
    height = 'medium'
}: PageHeaderProps) {
    const ref = useRef<HTMLElement>(null)
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect()
                if (rect.bottom > 0) {
                    setScrollY(window.scrollY)
                }
            }
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const heightClasses = {
        small: 'h-[50vh] min-h-[400px]',
        medium: 'h-[65vh] min-h-[500px]',
        large: 'h-[80vh] min-h-[600px]'
    }

    const parallaxY = scrollY * 0.3
    const opacity = Math.max(0, 1 - scrollY / 500)

    return (
        <header ref={ref} className={`relative ${heightClasses[height]} overflow-hidden bg-primary`}>
            {/* Parallax Background - CSS transform for GPU acceleration */}
            <div
                className="absolute inset-0 w-full h-[120%] -top-[10%] will-change-transform"
                style={{ transform: `translateY(${parallaxY}px) scale(${1 + scrollY * 0.0001})` }}
            >
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                />
                <div className="absolute inset-0 bg-primary/50" />
            </div>

            {/* Content */}
            <div
                className="relative z-10 h-full flex flex-col justify-end px-6 md:px-12 pb-16 md:pb-24"
                style={{ opacity }}
            >
                <div className="max-w-[1400px] mx-auto w-full">
                    {/* Breadcrumbs */}
                    {breadcrumbs.length > 0 && (
                        <nav className="flex items-center gap-2 text-sm text-white/60 mb-8 animate-fade-up stagger-1">
                            <Link href="/" className="hover:text-white transition-colors">
                                Home
                            </Link>
                            {breadcrumbs.map((item, index) => (
                                <span key={index} className="flex items-center gap-2">
                                    <ChevronRight size={14} />
                                    {item.href ? (
                                        <Link href={item.href} className="hover:text-white transition-colors">
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <span className="text-white">{item.label}</span>
                                    )}
                                </span>
                            ))}
                        </nav>
                    )}

                    {/* Title */}
                    <div className="overflow-hidden">
                        <h1 className="font-display text-display-xl text-white mb-6 animate-fade-up stagger-2">
                            {title}
                        </h1>
                    </div>

                    {/* Subtitle */}
                    {subtitle && (
                        <p className="text-white/70 text-lg md:text-xl max-w-2xl animate-fade-up stagger-3">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-fade-in stagger-5">
                <div className="w-px h-12 bg-gradient-to-b from-white/0 via-white/50 to-white/0 animate-bounce" />
            </div>
        </header>
    )
}
