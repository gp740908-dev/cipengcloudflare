import { Metadata } from 'next'

export const siteConfig = {
    name: 'StayinUBUD',
    title: 'Luxury Villa Rentals in Ubud, Bali | StayinUBUD',
    description: 'Discover premium luxury villas in the heart of Ubud, Bali. Experience authentic Balinese hospitality, stunning rice terrace views, and world-class amenities. Book your perfect sanctuary today.',
    url: 'https://www.stayinubud.com',
    ogImage: 'https://www.stayinubud.com/og-image.jpg',
    links: {
        facebook: 'https://facebook.com/stayinubud',
        instagram: 'https://instagram.com/stayinubud',
        twitter: 'https://twitter.com/stayinubud',
    },
}

export function createMetadata({
    title,
    description,
    image,
    noIndex = false,
    keywords,
    path = '',
}: {
    title?: string
    description?: string
    image?: string
    noIndex?: boolean
    keywords?: string[]
    path?: string
}): Metadata {
    const metaTitle = title ? `${title} | StayinUBUD` : siteConfig.title
    const metaDescription = description || siteConfig.description
    const metaImage = image || siteConfig.ogImage
    const url = `${siteConfig.url}${path}`

    return {
        title: metaTitle,
        description: metaDescription,
        keywords: keywords || [
            'luxury villas ubud',
            'ubud accommodation',
            'bali villas',
            'ubud hotels',
            'luxury stay ubud',
            'private villas bali',
            'ubud resort',
            'indonesia luxury villas',
        ],
        authors: [{ name: 'StayinUBUD' }],
        creator: 'StayinUBUD',
        publisher: 'StayinUBUD',
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        metadataBase: new URL(siteConfig.url),
        alternates: {
            canonical: url,
        },
        openGraph: {
            type: 'website',
            locale: 'en_US',
            url,
            title: metaTitle,
            description: metaDescription,
            siteName: siteConfig.name,
            images: [
                {
                    url: metaImage,
                    width: 1200,
                    height: 630,
                    alt: metaTitle,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: metaTitle,
            description: metaDescription,
            images: [metaImage],
            creator: '@stayinubud',
            site: '@stayinubud',
        },
        robots: {
            index: !noIndex,
            follow: !noIndex,
            googleBot: {
                index: !noIndex,
                follow: !noIndex,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        icons: {
            icon: '/favicon.ico',
            shortcut: '/favicon-16x16.png',
            apple: '/apple-touch-icon.png',
        },
        manifest: '/site.webmanifest',
    }
}

// JSON-LD Schema helpers
export function getOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'StayinUBUD',
        description: siteConfig.description,
        url: siteConfig.url,
        logo: `${siteConfig.url}/logo.png`,
        image: siteConfig.ogImage,
        sameAs: [
            siteConfig.links.facebook,
            siteConfig.links.instagram,
            siteConfig.links.twitter,
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+62-xxx-xxxx-xxxx',
            contactType: 'customer service',
            areaServed: 'ID',
            availableLanguage: ['en', 'id'],
        },
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Ubud',
            addressLocality: 'Gianyar',
            addressRegion: 'Bali',
            postalCode: '80571',
            addressCountry: 'ID',
        },
    }
}

export function getLocalBusinessSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'LodgingBusiness',
        '@id': `${siteConfig.url}/#lodgingbusiness`,
        name: 'StayinUBUD',
        description: siteConfig.description,
        url: siteConfig.url,
        telephone: '+62-xxx-xxxx-xxxx',
        priceRange: '$$$$',
        servesCuisine: 'Indonesian, International',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Ubud',
            addressLocality: 'Gianyar',
            addressRegion: 'Bali',
            postalCode: '80571',
            addressCountry: 'ID',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: -8.5069,
            longitude: 115.2624,
        },
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday',
            ],
            opens: '00:00',
            closes: '23:59',
        },
    }
}

export function getVillaSchema(villa: {
    id: string
    name: string
    description: string
    price_per_night: number
    images: string[]
    bedrooms: number
    bathrooms: number
    max_guests: number
    location: string
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': `${siteConfig.url}/villas/${villa.id}`,
        name: villa.name,
        description: villa.description,
        image: villa.images,
        offers: {
            '@type': 'Offer',
            priceCurrency: 'IDR',
            price: villa.price_per_night,
            availability: 'https://schema.org/InStock',
            url: `${siteConfig.url}/villas/${villa.id}`,
        },
        brand: {
            '@type': 'Brand',
            name: 'StayinUBUD',
        },
        category: 'Luxury Villa',
    }
}

export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    }
}
