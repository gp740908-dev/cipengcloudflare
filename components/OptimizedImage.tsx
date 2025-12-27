'use client'

import Image, { ImageProps } from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { organicBlurDataURL } from '@/lib/blurImage'

interface OptimizedImageProps extends Omit<ImageProps, 'placeholder' | 'blurDataURL' | 'onLoad'> {
    blurDataURL?: string
    fadeIn?: boolean
    lowQualityPreview?: boolean
}

/**
 * Highly Optimized Image component with:
 * - Automatic WebP format (handled by Next.js)
 * - Blur placeholder with smooth fade-in
 * - Intersection Observer for lazy loading
 * - Reduced quality for faster loads
 * - Native lazy loading support
 */
export default function OptimizedImage({
    blurDataURL = organicBlurDataURL,
    quality = 75, // Reduced quality for faster loads
    loading = 'lazy',
    fadeIn = true,
    lowQualityPreview = false,
    className = '',
    sizes,
    ...props
}: OptimizedImageProps) {
    const [isLoaded, setIsLoaded] = useState(false)
    const [isInView, setIsInView] = useState(false)
    const imgRef = useRef<HTMLDivElement>(null)

    // Intersection Observer for lazy loading trigger
    useEffect(() => {
        if (!imgRef.current) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true)
                    observer.disconnect()
                }
            },
            {
                rootMargin: '200px', // Start loading 200px before entering viewport
                threshold: 0.01
            }
        )

        observer.observe(imgRef.current)
        return () => observer.disconnect()
    }, [])

    // Generate optimized sizes if not provided
    const optimizedSizes = sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'

    // Optimize URL through ImageKit CDN for external images
    const optimizeUrl = (src: string | any): string | any => {
        if (typeof src !== 'string') return src

        // Skip relative paths and data URLs
        if (src.startsWith('/') || src.startsWith('data:')) return src

        // Skip if already an ImageKit URL
        if (src.includes('imagekit.io')) return src

        // For all external images (Supabase, Unsplash, etc), proxy through ImageKit
        const IMAGEKIT_URL = process.env.NEXT_PUBLIC_IMAGEKIT_URL || 'https://ik.imagekit.io/sfu6px4tc'
        return `${IMAGEKIT_URL}/tr:w-1200,q-${quality},f-auto/${src}`
    }

    const optimizedSrc = optimizeUrl(props.src)

    return (
        <div ref={imgRef} className="relative w-full h-full">
            {isInView && (
                <Image
                    {...props}
                    src={optimizedSrc}
                    quality={quality}
                    loading={loading}
                    placeholder="blur"
                    blurDataURL={blurDataURL}
                    sizes={optimizedSizes}
                    className={`
                        ${className}
                        ${fadeIn ? 'transition-opacity duration-500 ease-out' : ''}
                        ${fadeIn && !isLoaded ? 'opacity-0' : 'opacity-100'}
                    `}
                    onLoad={() => setIsLoaded(true)}
                    decoding="async"
                />
            )}

            {/* Placeholder while not in view */}
            {!isInView && (
                <div
                    className="absolute inset-0 bg-gradient-to-br from-cream to-gray-100 animate-pulse"
                    style={{
                        backgroundImage: `url(${blurDataURL})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
            )}
        </div>
    )
}

