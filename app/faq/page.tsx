import { Metadata } from 'next'
import FAQClient from './FAQClient'
import { createMetadata } from '@/lib/seo'

export const metadata: Metadata = createMetadata({
    title: 'FAQ - Frequently Asked Questions About Ubud Villa Rentals',
    description: 'Find answers to common questions about booking luxury villas in Ubud. Learn about check-in/out times, payment methods, cancellation policies, amenities, and more. Get all the information you need for your stay.',
    keywords: [
        'ubud villa faq',
        'villa booking questions',
        'ubud accommodation faq',
        'villa rental information',
        'booking policies ubud',
        'check-in checkout',
        'villa amenities faq',
        'cancellation policy',
    ],
    path: '/faq',
})

export default function FAQPage() {
    return <FAQClient />
}
