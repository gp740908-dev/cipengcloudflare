import { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import Experience from '@/components/home/Experience'
import Features from '@/components/home/Features'
import Testimonials from '@/components/home/Testimonials'
import CTASection from '@/components/home/CTASection'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import BackToTop from '@/components/BackToTop'
import PromoBanner from '@/components/PromoBanner'
import { createMetadata } from '@/lib/seo'

export const metadata: Metadata = createMetadata({
  title: 'Luxury Villa Rentals in Ubud, Bali',
  description: 'Discover premium luxury villas in the heart of Ubud, Bali. Experience authentic Balinese hospitality, stunning rice terrace views, private infinity pools, and world-class amenities. Your perfect sanctuary awaits.',
  keywords: [
    'luxury villas ubud',
    'ubud villa rentals',
    'bali luxury accommodation',
    'ubud private villas',
    'rice terrace view villas',
    'private pool villas ubud',
    'ubud resort',
    'luxury stay ubud bali',
    'ubud honeymoon villas',
    'infinity pool villas ubud',
  ],
  path: '/',
})


export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Experience />
      <Testimonials />
      <CTASection />
      <Footer />
      <WhatsAppButton />
      <BackToTop />
      <PromoBanner page="home" />
    </main>
  )
}

