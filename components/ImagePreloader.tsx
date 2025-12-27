'use client'

import { useEffect } from 'react'

interface ImagePreloaderProps {
    images: string[]
    priority?: boolean
}

/**
 * Preloads critical images in the background for instant display
 * Uses browser's native preload mechanism with fetchpriority="high"
 */
export default function ImagePreloader({ images, priority = true }: ImagePreloaderProps) {
    useEffect(() => {
        // Preload images using link preload
        images.forEach((src, index) => {
            if (!src) return

            // Create preload link element
            const link = document.createElement('link')
            link.rel = 'preload'
            link.as = 'image'
            link.href = src

            // Set fetchpriority for critical images
            if (priority && index === 0) {
                link.setAttribute('fetchpriority', 'high')
            }

            // Append to head if not already exists
            const existing = document.querySelector(`link[href="${src}"]`)
            if (!existing) {
                document.head.appendChild(link)
            }
        })

        // Also preload using Image objects for additional browser caching
        const imageObjects = images.map(src => {
            if (!src) return null
            const img = new Image()
            img.src = src
            return img
        })

        return () => {
            // Cleanup is not needed as preload links persist
        }
    }, [images, priority])

    return null // This component renders nothing
}

/**
 * Generates optimized placeholder SVG for instant display
 */
export function generatePlaceholderSVG(
    width: number = 1200,
    height: number = 800,
    color: string = '#e8ebd5'
): string {
    const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${color}"/>
    </svg>`

    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

/**
 * Pre-generates blur data URL for immediate placeholder display
 */
export const blurPlaceholders = {
    hero: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI4MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzJhMmEyYSIvPjwvc3ZnPg==',
    villa: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZThlYmQ1Ii8+PC9zdmc+',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMmU4Ii8+PC9zdmc+',
}
