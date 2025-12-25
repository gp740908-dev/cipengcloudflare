/**
 * Convert image file to WebP format using Canvas API
 * This provides better compression for web images
 */

export async function convertToWebP(file: File, quality: number = 0.85): Promise<File> {
    // Only convert image files
    if (!file.type.startsWith('image/')) {
        return file
    }

    // Skip if already WebP
    if (file.type === 'image/webp') {
        return file
    }

    // Skip SVG files (vector format)
    if (file.type === 'image/svg+xml') {
        return file
    }

    return new Promise((resolve, reject) => {
        const img = new Image()
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        img.onload = () => {
            // Set canvas dimensions
            canvas.width = img.width
            canvas.height = img.height

            // Draw image to canvas
            if (ctx) {
                ctx.drawImage(img, 0, 0)

                // Convert to WebP blob
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            // Create new File with WebP extension
                            const originalName = file.name.replace(/\.[^/.]+$/, '')
                            const webpFile = new File([blob], `${originalName}.webp`, {
                                type: 'image/webp',
                                lastModified: Date.now(),
                            })
                            resolve(webpFile)
                        } else {
                            // Fallback to original if conversion fails
                            resolve(file)
                        }
                    },
                    'image/webp',
                    quality
                )
            } else {
                resolve(file)
            }
        }

        img.onerror = () => {
            // Return original file if image fails to load
            resolve(file)
        }

        // Create object URL to load the image
        img.src = URL.createObjectURL(file)
    })
}

/**
 * Get the size reduction percentage after WebP conversion
 */
export function getSizeReduction(originalSize: number, newSize: number): number {
    if (originalSize === 0) return 0
    return Math.round(((originalSize - newSize) / originalSize) * 100)
}

/**
 * Format file size to human readable format
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
