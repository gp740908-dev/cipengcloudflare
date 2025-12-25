import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import WhatsAppButton from '@/components/WhatsAppButton'
import BackToTop from '@/components/BackToTop'
import ContactContent from '@/components/contact/ContactContent'
import { createMetadata } from '@/lib/seo'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = createMetadata({
    title: 'Contact Us - Get in Touch for Villa Bookings & Inquiries',
    description: 'Contact StayinUBUD for villa bookings, inquiries, or assistance. Reach us via email, phone, or WhatsApp. Located in Ubud, Bali. We\'re here to help plan your perfect Balinese escape.',
    keywords: [
        'contact stayinubud',
        'ubud villa booking',
        'bali villa inquiry',
        'stayinubud location',
        'villa rental contact',
        'ubud accommodation contact',
        'luxury villa reservations',
    ],
    path: '/contact',
})


export default async function ContactPage() {
    const supabase = await createClient()

    // Fetch villas with coordinates for the map
    const { data: villas } = await supabase
        .from('villas')
        .select('*')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)
        .order('name')

    return (
        <main className="min-h-screen bg-cream">
            <Navbar />
            <PageHeader
                title="Contact"
                subtitle="We're here to help create your perfect Balinese experience"
                backgroundImage="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&q=80"
                breadcrumbs={[{ label: 'Contact' }]}
                height="small"
            />
            <ContactContent villas={villas || []} />
            <Footer />
            <WhatsAppButton />
            <BackToTop />
        </main>
    )
}
