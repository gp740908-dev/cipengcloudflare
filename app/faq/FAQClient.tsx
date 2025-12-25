'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
    ChevronDown,
    Search,
    HelpCircle,
    Home,
    CreditCard,
    CalendarCheck,
    Shield,
    MapPin,
    Clock,
    MessageCircle,
    Phone,
    Mail,
    ArrowRight,
    Sparkles
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import BackToTop from '@/components/BackToTop'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

// Settings interface
interface SiteSettings {
    contact: {
        phone: string
        email: string
        whatsapp: string
        address: string
    }
}

const defaultSettings: SiteSettings = {
    contact: {
        phone: '+62 812 3456 7890',
        email: 'hello@stayinubud.com',
        whatsapp: '6281234567890',
        address: 'Ubud, Bali, Indonesia'
    }
}

// FAQ Categories
const categories = [
    { id: 'all', name: 'All Questions', icon: HelpCircle },
    { id: 'booking', name: 'Booking & Reservations', icon: CalendarCheck },
    { id: 'payment', name: 'Payment & Pricing', icon: CreditCard },
    { id: 'villa', name: 'Villa & Amenities', icon: Home },
    { id: 'location', name: 'Location & Transport', icon: MapPin },
    { id: 'policies', name: 'Policies & Rules', icon: Shield },
]

// FAQ Data
const faqs = [
    // Booking & Reservations
    {
        category: 'booking',
        question: 'How do I make a reservation?',
        answer: 'You can make a reservation directly through our website by selecting your preferred villa, choosing your check-in and check-out dates, and completing the booking form. Alternatively, you can contact us via WhatsApp for personalized assistance. We will confirm your booking within 24 hours.'
    },
    {
        category: 'booking',
        question: 'What is the minimum stay requirement?',
        answer: 'Our minimum stay requirement is typically 2 nights. During peak seasons (such as Christmas, New Year, and major holidays), the minimum stay may be extended to 3-5 nights. Please check the specific villa details or contact us for more information.'
    },
    {
        category: 'booking',
        question: 'Can I modify or cancel my reservation?',
        answer: 'Yes, you can modify or cancel your reservation. Free cancellation is available up to 7 days before check-in. Cancellations made within 7 days of check-in are subject to a cancellation fee of 50% of the total booking amount. No refunds for no-shows or early departures.'
    },
    {
        category: 'booking',
        question: 'What time are check-in and check-out?',
        answer: 'Standard check-in time is 2:00 PM and check-out is 11:00 AM. Early check-in or late check-out may be available upon request, subject to availability and may incur additional charges. Please contact us in advance to arrange.'
    },
    {
        category: 'booking',
        question: 'Do you offer last-minute bookings?',
        answer: 'Yes, we welcome last-minute bookings subject to availability. Contact us via WhatsApp for the quickest response on same-day or next-day availability. We recommend booking at least 48 hours in advance to ensure your preferred villa is available.'
    },

    // Payment & Pricing
    {
        category: 'payment',
        question: 'What payment methods do you accept?',
        answer: 'We accept bank transfers (BCA, Mandiri, BNI), credit/debit cards (Visa, MasterCard), and various e-wallet payments. International wire transfers are also available for overseas guests. All payments are processed securely.'
    },
    {
        category: 'payment',
        question: 'Is a deposit required?',
        answer: 'Yes, a 50% deposit is required to confirm your booking. The remaining balance is due 7 days before your check-in date. For bookings made within 7 days of arrival, full payment is required at the time of booking.'
    },
    {
        category: 'payment',
        question: 'Are there any additional fees?',
        answer: 'Our quoted prices include all applicable taxes and service fees. Additional charges may apply for extra services such as airport transfers, private chef, spa treatments, or special arrangements. These will be clearly communicated before booking.'
    },
    {
        category: 'payment',
        question: 'Do you offer discounts for long stays?',
        answer: 'Yes! We offer attractive discounts for extended stays: 10% off for stays of 7+ nights, 15% off for stays of 14+ nights, and 20% off for monthly stays. Contact us directly for personalized long-stay packages.'
    },
    {
        category: 'payment',
        question: 'Can I use promo codes?',
        answer: 'Yes, we occasionally offer promotional codes for special discounts. You can apply your promo code during the booking process on the review page. Subscribe to our newsletter to receive exclusive offers and promo codes.'
    },

    // Villa & Amenities
    {
        category: 'villa',
        question: 'What amenities are included in the villa?',
        answer: 'All our villas include: private pool, fully-equipped kitchen, air conditioning, WiFi, smart TV, daily housekeeping, fresh linens and towels, complimentary toiletries, welcome drinks, and 24/7 security. Specific amenities vary by villa - please check individual villa pages for details.'
    },
    {
        category: 'villa',
        question: 'Is daily housekeeping included?',
        answer: 'Yes, daily housekeeping is included in all bookings. Our staff will clean the villa, make beds, and replenish toiletries daily between 10:00 AM and 2:00 PM. You can request a specific time or opt out for privacy - just let us know your preferences.'
    },
    {
        category: 'villa',
        question: 'Are the villas suitable for children?',
        answer: 'Most of our villas are family-friendly. However, please note that private pools are not fenced. We recommend adult supervision at all times. Baby cots, high chairs, and other child-friendly equipment can be arranged upon request (some may incur additional charges).'
    },
    {
        category: 'villa',
        question: 'Are pets allowed?',
        answer: 'Unfortunately, pets are not allowed in any of our villas to maintain the highest standards of cleanliness and to accommodate guests with allergies. We apologize for any inconvenience this may cause.'
    },
    {
        category: 'villa',
        question: 'Is WiFi available?',
        answer: 'Yes, complimentary high-speed WiFi is available in all our villas. The connection is suitable for streaming, video calls, and remote work. Each villa has its own dedicated network for privacy and optimal speed.'
    },

    // Location & Transport
    {
        category: 'location',
        question: 'Where are your villas located?',
        answer: 'Our villas are strategically located in the most desirable areas of Ubud, Bali - including Tegallalang, Penestanan, and Central Ubud. Each location offers a unique experience, from rice terrace views to proximity to cultural attractions and restaurants.'
    },
    {
        category: 'location',
        question: 'Do you provide airport transfers?',
        answer: 'Yes, we offer private airport transfers from Ngurah Rai International Airport (DPS) to our villas. The journey takes approximately 1.5-2 hours depending on traffic. Transfers can be arranged during booking or afterward. Prices start from IDR 450,000 one way.'
    },
    {
        category: 'location',
        question: 'What attractions are nearby?',
        answer: 'Our villas are close to popular attractions including Tegallalang Rice Terraces, Sacred Monkey Forest, Ubud Royal Palace, Tirta Empul Temple, and numerous art galleries and restaurants. Many attractions are within 10-20 minutes drive.'
    },
    {
        category: 'location',
        question: 'Can you help arrange transportation or tours?',
        answer: 'Absolutely! We offer a variety of services including private driver hire, motorbike rental, and curated tours. Popular options include sunrise trekking at Mount Batur, temple tours, cooking classes, and spa experiences. Our concierge can help plan your perfect itinerary.'
    },
    {
        category: 'location',
        question: 'Is it easy to get around without a car?',
        answer: 'While having private transportation is convenient, you can use ride-hailing apps (Grab, Gojek) in Ubud. However, for exploring further areas or visiting multiple attractions, we recommend hiring a private driver for the day (approximately IDR 600,000-800,000).'
    },

    // Policies & Rules
    {
        category: 'policies',
        question: 'What is your cancellation policy?',
        answer: 'Free cancellation up to 7 days before check-in (full refund minus processing fees). 7-3 days before: 50% refund. Less than 3 days or no-show: no refund. We recommend travel insurance for unforeseen circumstances.'
    },
    {
        category: 'policies',
        question: 'Is smoking allowed in the villas?',
        answer: 'Smoking is not permitted inside any of our villas. Designated outdoor smoking areas are available. A cleaning fee of IDR 1,000,000 will be charged if evidence of indoor smoking is found.'
    },
    {
        category: 'policies',
        question: 'Are parties or events allowed?',
        answer: 'Our villas are designed for relaxation and are not suitable for parties or events. Gatherings are limited to registered guests only. Any disturbance to neighbors or violation of this policy may result in immediate termination of your stay without refund.'
    },
    {
        category: 'policies',
        question: 'What is the maximum occupancy?',
        answer: 'Maximum occupancy varies by villa and is strictly enforced for safety and comfort. The limits are specified on each villa page. Additional guests beyond the maximum capacity are not permitted, even for day visits.'
    },
    {
        category: 'policies',
        question: 'Is there a security deposit?',
        answer: 'A refundable security deposit of IDR 2,000,000 is required upon check-in. This is held against any damages or extra charges. The deposit will be refunded within 7 days of check-out after inspection, minus any applicable deductions.'
    },
]

// Scroll Reveal Component
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
        >
            {children}
        </motion.div>
    )
}

// FAQ Item Component
function FAQItem({ faq, index, isOpen, onToggle }: {
    faq: typeof faqs[0],
    index: number,
    isOpen: boolean,
    onToggle: () => void
}) {
    return (
        <ScrollReveal delay={index * 0.05}>
            <motion.div
                className={`border-b border-gray-100 overflow-hidden ${isOpen ? 'bg-olive-50/30' : ''}`}
            >
                <button
                    onClick={onToggle}
                    className="w-full py-6 px-6 flex items-center justify-between text-left group"
                >
                    <span className={`text-base sm:text-lg font-medium transition-colors ${isOpen ? 'text-olive-700' : 'text-gray-900 group-hover:text-olive-600'}`}>
                        {faq.question}
                    </span>
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex-shrink-0 ml-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isOpen ? 'bg-olive-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-olive-100 group-hover:text-olive-600'
                            }`}
                    >
                        <ChevronDown size={18} />
                    </motion.div>
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="px-6 pb-6">
                                <p className="text-gray-600 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </ScrollReveal>
    )
}

export default function FAQPage() {
    const [activeCategory, setActiveCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [openIndex, setOpenIndex] = useState<number | null>(null)
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings)

    // Fetch site settings
    useEffect(() => {
        async function fetchSettings() {
            try {
                const supabase = createClient()
                const { data } = await supabase
                    .from('site_settings')
                    .select('key, value')

                if (data && data.length > 0) {
                    const newSettings = { ...defaultSettings }
                    data.forEach((row) => {
                        if (row.key in newSettings) {
                            (newSettings as any)[row.key] = row.value
                        }
                    })
                    setSettings(newSettings)
                }
            } catch (error) {
                console.error('Error fetching settings:', error)
            }
        }

        fetchSettings()
    }, [])

    // Filter FAQs based on category and search
    const filteredFaqs = faqs.filter(faq => {
        const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
        const matchesSearch = searchQuery === '' ||
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    return (
        <main className="min-h-screen bg-cream">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 bg-olive-900 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-olive-400 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-olive-600 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 mb-6">
                            <Sparkles size={16} className="text-olive-400" />
                            <span className="text-olive-400 text-xs tracking-[0.3em] uppercase">Help Center</span>
                            <Sparkles size={16} className="text-olive-400" />
                        </div>

                        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-6">
                            Frequently Asked<br />
                            <span className="italic text-olive-400">Questions</span>
                        </h1>

                        <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto mb-10">
                            Find answers to common questions about our luxury villa rentals,
                            booking process, and services in Ubud, Bali.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-xl mx-auto">
                            <div className="relative">
                                <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search your question..."
                                    className="w-full py-4 pl-14 pr-6 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-olive-400 transition-colors"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 100" className="w-full h-16 sm:h-24 fill-cream">
                        <path d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z" />
                    </svg>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 sm:py-12 bg-cream sticky top-20 z-20 border-b border-gray-100">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => {
                                    setActiveCategory(category.id)
                                    setOpenIndex(null)
                                }}
                                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 whitespace-nowrap text-xs sm:text-sm font-medium transition-all ${activeCategory === category.id
                                    ? 'bg-olive-900 text-white'
                                    : 'bg-white text-gray-600 hover:bg-olive-100 hover:text-olive-700 border border-gray-100'
                                    }`}
                            >
                                <category.icon size={16} />
                                <span>{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="py-16 sm:py-24 bg-cream">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12">
                    {/* Results Count */}
                    <ScrollReveal>
                        <p className="text-gray-500 text-sm mb-8">
                            Showing {filteredFaqs.length} {filteredFaqs.length === 1 ? 'question' : 'questions'}
                            {activeCategory !== 'all' && ` in ${categories.find(c => c.id === activeCategory)?.name}`}
                            {searchQuery && ` for "${searchQuery}"`}
                        </p>
                    </ScrollReveal>

                    {/* FAQ List */}
                    <div className="bg-white shadow-sm border border-gray-100">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq, index) => (
                                <FAQItem
                                    key={index}
                                    faq={faq}
                                    index={index}
                                    isOpen={openIndex === index}
                                    onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                                />
                            ))
                        ) : (
                            <div className="py-16 text-center">
                                <HelpCircle size={48} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-gray-500">No questions found matching your search.</p>
                                <button
                                    onClick={() => {
                                        setSearchQuery('')
                                        setActiveCategory('all')
                                    }}
                                    className="mt-4 text-olive-600 hover:text-olive-700 text-sm font-medium"
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Still Have Questions Section */}
            <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
                {/* Decorative */}
                <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-olive-50 to-transparent pointer-events-none" />

                <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left - Content */}
                        <div>
                            <ScrollReveal>
                                <p className="text-olive-600 text-xs tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                                    <MessageCircle size={14} />
                                    Need More Help?
                                </p>
                            </ScrollReveal>

                            <ScrollReveal delay={0.1}>
                                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-6">
                                    Still Have <span className="italic text-olive-600">Questions?</span>
                                </h2>
                            </ScrollReveal>

                            <ScrollReveal delay={0.2}>
                                <p className="text-gray-600 text-lg mb-8">
                                    Can&apos;t find the answer you&apos;re looking for? Our friendly team is here to help you
                                    with any questions about your upcoming stay.
                                </p>
                            </ScrollReveal>

                            <ScrollReveal delay={0.3}>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <a
                                        href={`https://wa.me/${settings.contact.whatsapp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-600 text-white text-sm tracking-wider uppercase hover:bg-green-500 transition-colors"
                                    >
                                        <MessageCircle size={18} />
                                        <span>Chat on WhatsApp</span>
                                    </a>
                                    <Link
                                        href="/contact"
                                        className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-200 text-gray-700 text-sm tracking-wider uppercase hover:bg-gray-50 transition-colors"
                                    >
                                        <span>Contact Us</span>
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </ScrollReveal>
                        </div>

                        {/* Right - Contact Cards */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <ScrollReveal delay={0.2}>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="p-6 bg-cream border border-gray-100"
                                >
                                    <div className="w-12 h-12 bg-olive-100 flex items-center justify-center mb-4">
                                        <Phone size={20} className="text-olive-600" />
                                    </div>
                                    <h3 className="font-display text-xl text-gray-900 mb-2">Call Us</h3>
                                    <p className="text-gray-500 text-sm mb-3">Available 24/7 for urgent inquiries</p>
                                    <a href={`tel:${settings.contact.phone.replace(/\s/g, '')}`} className="text-olive-600 font-medium hover:text-olive-700">
                                        {settings.contact.phone}
                                    </a>
                                </motion.div>
                            </ScrollReveal>

                            <ScrollReveal delay={0.3}>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="p-6 bg-cream border border-gray-100"
                                >
                                    <div className="w-12 h-12 bg-olive-100 flex items-center justify-center mb-4">
                                        <Mail size={20} className="text-olive-600" />
                                    </div>
                                    <h3 className="font-display text-xl text-gray-900 mb-2">Email Us</h3>
                                    <p className="text-gray-500 text-sm mb-3">We respond within 24 hours</p>
                                    <a href={`mailto:${settings.contact.email}`} className="text-olive-600 font-medium hover:text-olive-700">
                                        {settings.contact.email}
                                    </a>
                                </motion.div>
                            </ScrollReveal>

                            <ScrollReveal delay={0.4}>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="p-6 bg-cream border border-gray-100"
                                >
                                    <div className="w-12 h-12 bg-olive-100 flex items-center justify-center mb-4">
                                        <Clock size={20} className="text-olive-600" />
                                    </div>
                                    <h3 className="font-display text-xl text-gray-900 mb-2">Office Hours</h3>
                                    <p className="text-gray-500 text-sm mb-3">Our team is available</p>
                                    <p className="text-olive-600 font-medium">
                                        Mon - Sun: 8AM - 10PM
                                    </p>
                                </motion.div>
                            </ScrollReveal>

                            <ScrollReveal delay={0.5}>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="p-6 bg-cream border border-gray-100"
                                >
                                    <div className="w-12 h-12 bg-olive-100 flex items-center justify-center mb-4">
                                        <MapPin size={20} className="text-olive-600" />
                                    </div>
                                    <h3 className="font-display text-xl text-gray-900 mb-2">Visit Us</h3>
                                    <p className="text-gray-500 text-sm mb-3">Our office location</p>
                                    <p className="text-olive-600 font-medium">
                                        {settings.contact.address}
                                    </p>
                                </motion.div>
                            </ScrollReveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Links Section */}
            <section className="py-16 bg-olive-900">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Home, title: 'Browse Villas', desc: 'Explore our collection', link: '/villas' },
                            { icon: CalendarCheck, title: 'Book Now', desc: 'Check availability', link: '/villas' },
                            { icon: MapPin, title: 'Location', desc: 'About Ubud, Bali', link: '/about' },
                            { icon: MessageCircle, title: 'Contact', desc: 'Get in touch', link: '/contact' },
                        ].map((item, index) => (
                            <ScrollReveal key={index} delay={index * 0.1}>
                                <Link
                                    href={item.link}
                                    className="group flex items-center gap-4 p-6 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                                >
                                    <div className="w-12 h-12 bg-olive-600 flex items-center justify-center group-hover:bg-olive-500 transition-colors">
                                        <item.icon size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-white">{item.title}</h3>
                                        <p className="text-white/50 text-sm">{item.desc}</p>
                                    </div>
                                </Link>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
            <WhatsAppButton />
            <BackToTop />
        </main>
    )
}
