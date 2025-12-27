/**
 * ImageKit Upload Utility
 * Handles client-side uploads to ImageKit with authentication
 */

const IMAGEKIT_URL = process.env.NEXT_PUBLIC_IMAGEKIT_URL || 'https://ik.imagekit.io/sfu6px4tc'

interface UploadResponse {
    url: string
    fileId: string
    name: string
    filePath: string
    thumbnailUrl: string
}

interface UploadOptions {
    folder?: string
    fileName?: string
    tags?: string[]
}

/**
 * Get authentication parameters from server
 */
async function getAuthParams() {
    const response = await fetch('/api/imagekit/auth')
    if (!response.ok) {
        throw new Error('Failed to get ImageKit auth params')
    }
    return response.json()
}

/**
 * Upload a file to ImageKit
 */
export async function uploadToImageKit(
    file: File,
    options: UploadOptions = {}
): Promise<UploadResponse> {
    const { folder = 'villas', fileName, tags } = options

    // Get authentication params
    const authParams = await getAuthParams()

    // Create form data
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileName', fileName || file.name)
    formData.append('folder', folder)
    formData.append('publicKey', process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || 'public_FvixsA/xbl2OWjbFtEY4Irmx1fE=')
    formData.append('signature', authParams.signature)
    formData.append('expire', authParams.expire)
    formData.append('token', authParams.token)

    if (tags && tags.length > 0) {
        formData.append('tags', tags.join(','))
    }

    // Upload to ImageKit
    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: formData,
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`Upload failed: ${error}`)
    }

    const result = await response.json()

    return {
        url: result.url,
        fileId: result.fileId,
        name: result.name,
        filePath: result.filePath,
        thumbnailUrl: result.thumbnailUrl,
    }
}

/**
 * Upload multiple files to ImageKit
 */
export async function uploadMultipleToImageKit(
    files: File[],
    options: UploadOptions = {}
): Promise<UploadResponse[]> {
    const results = await Promise.all(
        files.map(file => uploadToImageKit(file, options))
    )
    return results
}

/**
 * Get optimized ImageKit URL with transformations
 */
export function getImageKitUrl(
    filePath: string,
    options: {
        width?: number
        height?: number
        quality?: number
        format?: 'auto' | 'webp' | 'avif'
    } = {}
): string {
    const { width, height, quality = 80, format = 'auto' } = options

    const transforms: string[] = []
    if (width) transforms.push(`w-${width}`)
    if (height) transforms.push(`h-${height}`)
    if (quality) transforms.push(`q-${quality}`)
    if (format) transforms.push(`f-${format}`)

    const transformString = transforms.length > 0 ? `tr:${transforms.join(',')}/` : ''

    // Handle full URLs vs relative paths
    if (filePath.startsWith('http')) {
        return filePath
    }

    return `${IMAGEKIT_URL}/${transformString}${filePath}`
}
