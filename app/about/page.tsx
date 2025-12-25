import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import WhatsAppButton from '@/components/WhatsAppButton'
import BackToTop from '@/components/BackToTop'
import AboutContent from '@/components/about/AboutContent'

export const metadata: Metadata = {
    title: 'About Us - StayinUBUD | Our Story',
    description: 'Learn about StayinUBUD\'s story, our mission to provide exceptional villa experiences in Ubud, Bali, and meet the team behind our luxury properties.',
}

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-cream">
            <Navbar />
            <PageHeader
                title="About Us"
                subtitle="A decade of curating exceptional experiences in the heart of Ubud"
                backgroundImage="https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1920&q=80"
                breadcrumbs={[{ label: 'About' }]}
                height="medium"
            />
            <AboutContent />
            <Footer />
            <WhatsAppButton />
            <BackToTop />
        </main>
    )
}
