/**
 * ImageKit URL Helper
 * Generates optimized image URLs using ImageKit CDN
 * 
 * Usage:
 * import { getOptimizedImageUrl, getImageKitUrl } from '@/lib/imagekit'
 * 
 * // For ImageKit hosted images:
 * getImageKitUrl('villa-hero.jpg', { width: 800, quality: 75 })
 * 
 * // For any URL (Supabase, Unsplash, etc):
 * getOptimizedImageUrl('https://example.com/image.jpg', { width: 800 })
 */

// ImageKit URL endpoint - set in .env.local
const IMAGEKIT_URL = process.env.NEXT_PUBLIC_IMAGEKIT_URL || 'https://ik.imagekit.io/sfu6px4tc'

export interface ImageTransformOptions {
    width?: number
    height?: number
    quality?: number
    format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png'
    blur?: number
    crop?: 'maintain_ratio' | 'force' | 'at_least' | 'at_max'
}

/**
 * Generate ImageKit URL for images stored in ImageKit
 */
export function getImageKitUrl(
    path: string,
    options: ImageTransformOptions = {}
): string {
    const {
        width,
        height,
        quality = 80,
        format = 'auto',
        blur,
        crop = 'maintain_ratio'
    } = options

    // Build transformation string
    const transforms: string[] = []

    if (width) transforms.push(`w-${width}`)
    if (height) transforms.push(`h-${height}`)
    if (quality) transforms.push(`q-${quality}`)
    if (format) transforms.push(`f-${format}`)
    if (blur) transforms.push(`bl-${blur}`)
    if (crop) transforms.push(`c-${crop}`)

    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path

    // Build URL with transformations
    const transformString = transforms.length > 0 ? `tr:${transforms.join(',')}` : ''

    return transformString
        ? `${IMAGEKIT_URL}/${transformString}/${cleanPath}`
        : `${IMAGEKIT_URL}/${cleanPath}`
}

/**
 * Generate ImageKit URL for external images (Supabase, Unsplash, etc)
 * Uses ImageKit's URL-based fetch feature to proxy and optimize external images
 */
export function getOptimizedImageUrl(
    url: string,
    options: ImageTransformOptions = {}
): string {
    // If empty or invalid, return as-is
    if (!url) return url

    // If it's already an ImageKit URL, just return it
    if (url.includes('imagekit.io')) {
        return url
    }

    // If URL is a relative path or data URL, return as-is
    if (url.startsWith('/') || url.startsWith('data:')) {
        return url
    }

    const {
        width,
        height,
        quality = 75,
        format = 'auto',
    } = options

    // Build transformation string
    const transforms: string[] = []
    if (width) transforms.push(`w-${width}`)
    if (height) transforms.push(`h-${height}`)
    if (quality) transforms.push(`q-${quality}`)
    if (format) transforms.push(`f-${format}`)

    const transformString = transforms.length > 0 ? `tr:${transforms.join(',')}/` : ''

    // ImageKit can fetch and transform external URLs
    // Format: https://ik.imagekit.io/{id}/tr:w-800/{external-url}
    return `${IMAGEKIT_URL}/${transformString}${url}`
}

/**
 * Get blur placeholder data URL
 */
export function getBlurPlaceholder(color: string = '#1a1a1a'): string {
    const svg = `<svg width="10" height="10" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${color}"/></svg>`
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

/**
 * Preset transformations for common use cases
 */
export const imagePresets = {
    hero: { width: 1920, quality: 75, format: 'auto' as const },
    thumbnail: { width: 400, quality: 70, format: 'auto' as const },
    card: { width: 600, quality: 75, format: 'auto' as const },
    gallery: { width: 1200, quality: 80, format: 'auto' as const },
    avatar: { width: 100, height: 100, quality: 80, format: 'auto' as const },
}
