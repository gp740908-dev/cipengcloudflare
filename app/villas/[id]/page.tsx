import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import VillaDetails from '@/components/villas/VillaDetails'
import WhatsAppButton from '@/components/WhatsAppButton'
import BackToTop from '@/components/BackToTop'
import { Metadata } from 'next'
import { createMetadata, getVillaSchema, getBreadcrumbSchema } from '@/lib/seo'

interface Props {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params
    const supabase = await createClient()

    const { data: villa } = await supabase
        .from('villas')
        .select('*')
        .eq('id', id)
        .single()

    if (!villa) {
        return {
            title: 'Villa Not Found - StayinUBUD',
        }
    }

    return createMetadata({
        title: `${villa.name} - Luxury Villa in Ubud`,
        description: villa.description?.substring(0, 155) + '... Book this exclusive Ubud villa with private pool and stunning views.',
        keywords: [
            villa.name,
            `${villa.name} ubud`,
            'luxury villa ubud',
            `${villa.bedrooms} bedroom villa ubud`,
            'private pool villa',
            'rice terrace view',
            villa.location,
            'ubud accommodation',
            'bali villa rental',
        ],
        image: villa.images?.[0],
        path: `/villas/${id}`,
    })
}

export default async function VillaPage({ params }: Props) {
    const { id } = await params
    const supabase = await createClient()

    const { data: villa, error } = await supabase
        .from('villas')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !villa) {
        notFound()
    }

    // Generate structured data
    const villaSchema = getVillaSchema(villa)
    const breadcrumbSchema = getBreadcrumbSchema([
        { name: 'Home', url: 'https://www.stayinubud.com' },
        { name: 'Villas', url: 'https://www.stayinubud.com/villas' },
        { name: villa.name, url: `https://www.stayinubud.com/villas/${id}` },
    ])

    return (
        <main className="min-h-screen bg-cream overflow-x-hidden">
            {/* Structured Data - Villa Product */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(villaSchema) }}
            />

            {/* Structured Data - Breadcrumb */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            <Navbar />
            <VillaDetails villa={villa} />
            <Footer />
            <WhatsAppButton />
            <BackToTop />
        </main>
    )
}
