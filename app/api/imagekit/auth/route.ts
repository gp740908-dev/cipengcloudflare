import { NextResponse } from 'next/server'
import ImageKit from 'imagekit'

// Initialize ImageKit with credentials
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL!,
})

/**
 * GET /api/imagekit/auth
 * Returns authentication parameters for client-side ImageKit uploads
 */
export async function GET() {
    try {
        const authenticationParameters = imagekit.getAuthenticationParameters()

        return NextResponse.json(authenticationParameters)
    } catch (error) {
        console.error('ImageKit auth error:', error)
        return NextResponse.json(
            { error: 'Failed to generate authentication parameters' },
            { status: 500 }
        )
    }
}
