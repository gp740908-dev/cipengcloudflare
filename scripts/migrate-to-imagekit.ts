/**
 * Migration Script: Supabase Storage -> ImageKit
 * 
 * This script:
 * 1. Fetches all villas from Supabase
 * 2. Downloads images from Supabase Storage
 * 3. Uploads them to ImageKit
 * 4. Updates database with new URLs
 * 
 * Usage:
 * 1. Add env variables to .env.local
 * 2. Run: npx ts-node scripts/migrate-to-imagekit.ts
 */

import { createClient } from '@supabase/supabase-js'

// ImageKit credentials - replace with your actual values
const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY || 'private_8FVquSuea3ved081r7hG2/wVJiI='
const IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY || 'public_FvixsA/xbl2OWjbFtEY4Irmx1fE='
const IMAGEKIT_URL = process.env.NEXT_PUBLIC_IMAGEKIT_URL || 'https://ik.imagekit.io/sfu6px4tc'

// Supabase credentials
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

async function uploadToImageKit(imageUrl: string, folder: string, fileName: string) {
    const fetch = (await import('node-fetch')).default

    // Download image from Supabase
    console.log(`  Downloading: ${imageUrl}`)
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
        throw new Error(`Failed to download image: ${imageResponse.statusText}`)
    }
    const imageBuffer = await imageResponse.buffer()
    const base64Image = imageBuffer.toString('base64')

    // Upload to ImageKit
    console.log(`  Uploading to ImageKit...`)
    const uploadResponse = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(`${IMAGEKIT_PRIVATE_KEY}:`).toString('base64')}`,
        },
        body: JSON.stringify({
            file: base64Image,
            fileName: fileName,
            folder: folder,
            useUniqueFileName: false,
        }),
    })

    if (!uploadResponse.ok) {
        const error = await uploadResponse.text()
        throw new Error(`ImageKit upload failed: ${error}`)
    }

    const result = await uploadResponse.json() as { url: string }
    console.log(`  ✓ Uploaded: ${result.url}`)
    return result.url
}

async function migrateVillaImages() {
    console.log('🚀 Starting migration from Supabase to ImageKit...\n')

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    // Fetch all villas
    const { data: villas, error } = await supabase
        .from('villas')
        .select('id, name, images')

    if (error) {
        console.error('❌ Failed to fetch villas:', error)
        return
    }

    console.log(`Found ${villas?.length || 0} villas to process\n`)

    let migratedCount = 0
    let errorCount = 0

    for (const villa of villas || []) {
        console.log(`\n📦 Processing: ${villa.name}`)

        if (!villa.images || villa.images.length === 0) {
            console.log('  No images to migrate')
            continue
        }

        const newImageUrls: string[] = []

        for (let i = 0; i < villa.images.length; i++) {
            const imageUrl = villa.images[i]

            // Skip if already on ImageKit
            if (imageUrl.includes('imagekit.io')) {
                console.log(`  Skipping (already on ImageKit): ${imageUrl}`)
                newImageUrls.push(imageUrl)
                continue
            }

            try {
                // Extract filename from URL
                const urlParts = imageUrl.split('/')
                const originalFileName = urlParts[urlParts.length - 1] || `image-${i}.jpg`
                const safeFileName = originalFileName.replace(/[^a-zA-Z0-9.-]/g, '_')

                // Upload to ImageKit
                const newUrl = await uploadToImageKit(
                    imageUrl,
                    `villas/${villa.id}`,
                    safeFileName
                )
                newImageUrls.push(newUrl)
            } catch (err) {
                console.error(`  ❌ Error uploading image:`, err)
                newImageUrls.push(imageUrl) // Keep original URL
                errorCount++
            }
        }

        // Update database with new URLs
        if (newImageUrls.some(url => url.includes('imagekit.io'))) {
            const { error: updateError } = await supabase
                .from('villas')
                .update({ images: newImageUrls })
                .eq('id', villa.id)

            if (updateError) {
                console.error(`  ❌ Failed to update database:`, updateError)
                errorCount++
            } else {
                console.log(`  ✓ Database updated with new URLs`)
                migratedCount++
            }
        }
    }

    console.log('\n' + '='.repeat(50))
    console.log(`✅ Migration complete!`)
    console.log(`   Migrated: ${migratedCount} villas`)
    console.log(`   Errors: ${errorCount}`)
}

// Run migration
migrateVillaImages().catch(console.error)
