import Image, { ImageProps } from 'next/image'
import { organicBlurDataURL } from '@/lib/blurImage'

interface OptimizedImageProps extends Omit<ImageProps, 'placeholder' | 'blurDataURL'> {
    blurDataURL?: string
}

/**
 * Optimized Image component with automatic blur placeholder
 * Uses organic luxury themed shimmer effect
 */
export default function OptimizedImage({
    blurDataURL = organicBlurDataURL,
    quality = 80,
    loading = 'lazy',
    ...props
}: OptimizedImageProps) {
    return (
        <Image
            {...props}
            quality={quality}
            loading={loading}
            placeholder="blur"
            blurDataURL={blurDataURL}
        />
    )
}
