import { Suspense } from 'react'
import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageHeader from '@/components/PageHeader'
import BlogList from '@/components/blog/BlogList'
import WhatsAppButton from '@/components/WhatsAppButton'
import BackToTop from '@/components/BackToTop'

export const metadata: Metadata = {
    title: 'Journal | StayinUBUD - Stories & Insights',
    description: 'Explore our journal for travel tips, destination guides, and stories from Ubud, Bali.',
}

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-cream">
            <Navbar />
            <PageHeader
                title="Journal"
                subtitle="Stories, insights, and inspiration from Ubud"
                backgroundImage="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80"
                breadcrumbs={[{ label: 'Journal' }]}
                height="medium"
            />
            <section className="py-24">
                <Suspense fallback={
                    <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="aspect-[4/3] bg-light animate-pulse" />
                                    <div className="h-6 bg-light animate-pulse w-3/4" />
                                    <div className="h-4 bg-light animate-pulse w-1/2" />
                                </div>
                            ))}
                        </div>
                    </div>
                }>
                    <BlogList />
                </Suspense>
            </section>
            <Footer />
            <WhatsAppButton />
            <BackToTop />
        </main>
    )
}
