import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import VillasList from '@/components/villas/VillasList'
import WhatsAppButton from '@/components/WhatsAppButton'
import BackToTop from '@/components/BackToTop'
import { createMetadata, getBreadcrumbSchema } from '@/lib/seo'

export const metadata: Metadata = createMetadata({
    title: 'Luxury Villas in Ubud Bali - Browse Our Collection',
    description: 'Browse our exclusive collection of luxury villas in Ubud, Bali. Handpicked properties featuring private infinity pools, stunning rice terrace views, traditional Balinese architecture, and 5-star amenities. Book your dream villa today.',
    keywords: [
        'ubud villas collection',
        'luxury villas ubud bali',
        'private pool villas',
        'rice terrace villas',
        'ubud accommodation',
        'bali villa rentals',
        'tropical villas ubud',
        '5-star villas ubud',
        'exclusive ubud villas',
        'balinese villa architecture',
    ],
    path: '/villas',
})


export default function VillasPage() {
    const breadcrumbSchema = getBreadcrumbSchema([
        { name: 'Home', url: 'https://www.stayinubud.com' },
        { name: 'Villas', url: 'https://www.stayinubud.com/villas' },
    ])

    return (
        <main className="min-h-screen bg-cream">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <Navbar />
            <PageHeader
                title="Our Collection"
                subtitle="Curated properties representing the pinnacle of Balinese architecture and hospitality"
                backgroundImage="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
                breadcrumbs={[{ label: 'Villas' }]}
                height="medium"
            />
            <section className="py-24">
                <VillasList />
            </section>
            <Footer />
            <WhatsAppButton />
            <BackToTop />
        </main>
    )
}
