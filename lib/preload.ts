'use client'

import { useEffect } from 'react'

/**
 * Preload critical images on page load
 * Helps improve LCP (Largest Contentful Paint)
 */
export function usePreloadImages(images: string[]) {
    useEffect(() => {
        if (typeof window === 'undefined') return

        images.forEach((src) => {
            const link = document.createElement('link')
            link.rel = 'preload'
            link.as = 'image'
            link.href = src
            link.fetchPriority = 'high'
            document.head.appendChild(link)
        })
    }, [images])
}

/**
 * Prefetch pages on hover for instant navigation
 * Best for villa cards, navigation links
 */
export function usePrefetchOnHover(href: string) {
    const prefetch = () => {
        if (typeof window !== 'undefined' && 'connection' in navigator) {
            // Type assertion for navigator.connection
            const connection = (navigator as any).connection
            // Only prefetch on fast connections
            if (connection?.effectiveType === '4g' || connection?.effectiveType === '3g') {
                const link = document.createElement('link')
                link.rel = 'prefetch'
                link.href = href
                document.head.appendChild(link)
            }
        }
    }

    return {
        onMouseEnter: prefetch,
        onTouchStart: prefetch, // For mobile
    }
}

/**
 * Preconnect to external domains
 * Use for: Google Fonts, Analytics, CDNs
 */
export function preconnect(domains: string[]) {
    if (typeof window === 'undefined') return

    domains.forEach((domain) => {
        const link = document.createElement('link')
        link.rel = 'preconnect'
        link.href = domain
        link.crossOrigin = 'anonymous'
        document.head.appendChild(link)
    })
}
