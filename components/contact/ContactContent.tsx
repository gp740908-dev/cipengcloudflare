'use client'

import { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Mail, Phone, MapPin, Send, Check, ArrowUpRight, Clock, MessageCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Villa } from '@/types'

// Dynamic import for map (no SSR)
const VillasInteractiveMap = dynamic(() => import('@/components/VillasInteractiveMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[500px] md:h-[600px] bg-gray-100 flex items-center justify-center">
            <div className="text-center">
                <div className="w-8 h-8 border-2 border-olive-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-500">Loading interactive map...</p>
            </div>
        </div>
    )
})

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

interface ContactContentProps {
    villas: Villa[]
}

export default function ContactContent({ villas }: ContactContentProps) {
    const formRef = useRef<HTMLElement>(null)
    const mapRef = useRef<HTMLElement>(null)
    const [isFormInView, setIsFormInView] = useState(false)
    const [isMapInView, setIsMapInView] = useState(false)
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    // Intersection Observer
    useEffect(() => {
        const formObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsFormInView(true)
            },
            { rootMargin: '-100px' }
        )

        const mapObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsMapInView(true)
            },
            { rootMargin: '-50px' }
        )

        if (formRef.current) formObserver.observe(formRef.current)
        if (mapRef.current) mapObserver.observe(mapRef.current)

        return () => {
            formObserver.disconnect()
            mapObserver.disconnect()
        }
    }, [])

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsSubmitting(false)
        setIsSubmitted(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    // Dynamic contact info using settings
    const contactInfo = [
        {
            icon: Mail,
            label: 'Email',
            value: settings.contact.email,
            href: `mailto:${settings.contact.email}`,
            description: 'Send us an email anytime'
        },
        {
            icon: Phone,
            label: 'Phone',
            value: settings.contact.phone,
            href: `tel:${settings.contact.phone.replace(/\s/g, '')}`,
            description: 'Mon-Sun, 8am-9pm'
        },
        {
            icon: MessageCircle,
            label: 'WhatsApp',
            value: 'Chat with us',
            href: `https://wa.me/${settings.contact.whatsapp}`,
            description: 'Quick response guaranteed'
        },
        {
            icon: MapPin,
            label: 'Location',
            value: settings.contact.address,
            href: 'https://maps.google.com/?q=Ubud,Bali',
            description: 'Heart of Ubud, Bali'
        },
    ]

    const villasWithCoords = villas.filter(v => v.latitude && v.longitude)

    return (
        <>
            {/* Contact Form Section */}
            <section ref={formRef} className="py-24 md:py-32 bg-cream">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                        {/* Left: Info */}
                        <div className={isFormInView ? 'animate-slide-left' : 'opacity-0'}>
                            <p className="text-olive-600 text-xs tracking-[0.3em] uppercase mb-6">
                                Get in Touch
                            </p>
                            <h2 className="font-display text-4xl md:text-5xl text-gray-900 mb-8 leading-tight">
                                Let's start a
                                <br />
                                <span className="italic text-olive-600">conversation</span>
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-12 max-w-md">
                                Whether you're planning your next escape or have questions about our
                                properties, we're here to help create your perfect Balinese experience.
                            </p>

                            {/* Contact Info Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {contactInfo.map((item) => {
                                    const Icon = item.icon
                                    return (
                                        <a
                                            key={item.label}
                                            href={item.href}
                                            target={item.href.startsWith('http') ? '_blank' : undefined}
                                            rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                            className="group p-6 bg-white border border-gray-100 hover:border-olive-200 hover:shadow-lg transition-all"
                                        >
                                            <div className="w-10 h-10 bg-olive-100 flex items-center justify-center mb-4 group-hover:bg-olive-600 group-hover:text-white transition-all">
                                                <Icon size={18} className="text-olive-600 group-hover:text-white" />
                                            </div>
                                            <p className="font-medium text-gray-900 mb-1">{item.label}</p>
                                            <p className="text-olive-600 text-sm mb-1">{item.value}</p>
                                            <p className="text-gray-500 text-xs">{item.description}</p>
                                        </a>
                                    )
                                })}
                            </div>

                            {/* Office Hours */}
                            <div className="mt-10 p-6 bg-olive-50 border border-olive-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <Clock size={18} className="text-olive-600" />
                                    <span className="font-medium text-gray-900">Office Hours</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Monday - Friday</p>
                                        <p className="text-gray-900 font-medium">8:00 AM - 9:00 PM</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Saturday - Sunday</p>
                                        <p className="text-gray-900 font-medium">9:00 AM - 6:00 PM</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-3">All times are in Bali Time (WITA, GMT+8)</p>
                            </div>
                        </div>

                        {/* Right: Form */}
                        <div className={isFormInView ? 'animate-slide-right' : 'opacity-0'}>
                            <div className="bg-white p-8 md:p-10 border border-gray-100 shadow-sm">
                                <h3 className="font-display text-2xl text-gray-900 mb-6">Send us a message</h3>

                                {isSubmitted ? (
                                    <div className="py-16 text-center">
                                        <div className="w-16 h-16 bg-olive-600 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Check size={32} />
                                        </div>
                                        <h3 className="font-display text-2xl text-gray-900 mb-4">
                                            Message Sent!
                                        </h3>
                                        <p className="text-gray-600">
                                            We'll get back to you within 24 hours.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm text-gray-500 mb-2">
                                                    Your Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 focus:border-olive-600 focus:ring-1 focus:ring-olive-600 outline-none transition-colors"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-500 mb-2">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 focus:border-olive-600 focus:ring-1 focus:ring-olive-600 outline-none transition-colors"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-500 mb-2">
                                                Subject
                                            </label>
                                            <select
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 focus:border-olive-600 focus:ring-1 focus:ring-olive-600 outline-none transition-colors"
                                            >
                                                <option value="">Select a topic</option>
                                                <option value="booking">Booking Inquiry</option>
                                                <option value="villa">Villa Information</option>
                                                <option value="special">Special Request</option>
                                                <option value="partnership">Partnership</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-500 mb-2">
                                                Message
                                            </label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                rows={5}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 focus:border-olive-600 focus:ring-1 focus:ring-olive-600 outline-none transition-colors resize-none"
                                                placeholder="Tell us how we can help..."
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full group flex items-center justify-center gap-3 bg-olive-900 text-white px-8 py-4 text-sm tracking-wider uppercase hover:bg-olive-600 transition-colors disabled:opacity-50"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    <span>Sending...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Send Message</span>
                                                    <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive Villas Map Section */}
            {villasWithCoords.length > 0 && (
                <section ref={mapRef} className="py-24 md:py-32 bg-white">
                    <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                        <div className={`text-center max-w-2xl mx-auto mb-12 ${isMapInView ? 'animate-fade-up' : 'opacity-0'}`}>
                            <p className="text-olive-600 text-xs tracking-[0.3em] uppercase mb-4">
                                Villa Locations
                            </p>
                            <h2 className="font-display text-4xl md:text-5xl text-gray-900 mb-4 leading-tight">
                                Explore Our <span className="italic text-olive-600">Properties</span>
                            </h2>
                            <p className="text-gray-600">
                                Click on any villa to see details. Use "Compare Distance" to measure
                                the distance between two villas.
                            </p>
                        </div>

                        <div className={`${isMapInView ? 'animate-fade-up stagger-2' : 'opacity-0'}`}>
                            <div className="border border-gray-200 shadow-lg overflow-hidden">
                                <VillasInteractiveMap villas={villas} />
                            </div>
                        </div>

                        {/* Map Legend */}
                        <div className={`mt-6 flex flex-wrap items-center justify-center gap-6 text-sm ${isMapInView ? 'animate-fade-up stagger-3' : 'opacity-0'}`}>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-olive-600 rounded-full"></div>
                                <span className="text-gray-600">Villa Location</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-0.5 bg-olive-600 border-dashed border-2 border-olive-600"></div>
                                <span className="text-gray-600">Distance Line</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-gray-400" />
                                <span className="text-gray-600">{villasWithCoords.length} properties shown</span>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}
