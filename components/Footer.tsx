'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, MapPin, Phone, Mail, Instagram, Leaf, Facebook, Youtube } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface FooterSettings {
    contact: {
        phone: string
        email: string
        whatsapp: string
        address: string
    }
    social: {
        instagram: string
        facebook: string
        tiktok: string
        youtube: string
    }
    footer: {
        copyright: string
        show_newsletter: boolean
    }
}

const defaultSettings: FooterSettings = {
    contact: { phone: '+62 812 3456 7890', email: 'hello@stayinubud.com', whatsapp: '6281234567890', address: 'Ubud, Bali, Indonesia' },
    social: { instagram: '', facebook: '', tiktok: '', youtube: '' },
    footer: { copyright: '© 2024 StayinUBUD. All rights reserved.', show_newsletter: true }
}

export default function Footer() {
    const ref = useRef<HTMLElement>(null)
    const [isInView, setIsInView] = useState(false)
    const [settings, setSettings] = useState<FooterSettings>(defaultSettings)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true)
                }
            },
            { rootMargin: '-50px' }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        fetchSettings()
    }, [])

    async function fetchSettings() {
        try {
            const supabase = createClient()
            const { data } = await supabase
                .from('site_settings')
                .select('key, value')

            if (data && data.length > 0) {
                const newSettings = { ...defaultSettings }
                data.forEach(item => {
                    if (item.key === 'contact') newSettings.contact = item.value as FooterSettings['contact']
                    if (item.key === 'social') newSettings.social = item.value as FooterSettings['social']
                    if (item.key === 'footer') newSettings.footer = item.value as FooterSettings['footer']
                })
                setSettings(newSettings)
            }
        } catch (error) {
            console.error('Error fetching settings:', error)
        }
    }

    const links = {
        explore: [
            { label: 'All Villas', href: '/villas' },
            { label: 'About Us', href: '/about' },
            { label: 'Journal', href: '/blog' },
            { label: 'FAQ', href: '/faq' },
            { label: 'Contact', href: '/contact' },
        ],
        legal: [
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Booking Policy', href: '/booking-policy' },
        ],
    }

    return (
        <footer ref={ref} className="bg-gray-900 text-white relative overflow-hidden">
            {/* Decorative Line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-olive-400/50 to-transparent" />

            {/* Newsletter Section */}
            {settings.footer.show_newsletter && (
                <div className="border-b border-white/10">
                    <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-20">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                            <div className={`max-w-xl ${isInView ? 'animate-fade-up' : 'opacity-0'}`}>
                                <p className="text-olive-400 text-xs tracking-[0.3em] uppercase mb-4">Stay Updated</p>
                                <h3 className="font-display text-3xl md:text-4xl mb-4">
                                    Get Exclusive <span className="italic">Offers</span>
                                </h3>
                                <p className="text-white/50">
                                    Subscribe to receive curated villa recommendations and special member-only rates.
                                </p>
                            </div>

                            <form
                                className={`flex flex-col sm:flex-row gap-3 w-full lg:w-auto ${isInView ? 'animate-fade-up stagger-1' : 'opacity-0'}`}
                                onSubmit={(e) => e.preventDefault()}
                            >
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 lg:w-80 px-6 py-4 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-olive-400/50 transition-colors"
                                />
                                <button
                                    type="submit"
                                    className="px-8 py-4 bg-olive-600 text-white font-medium text-sm tracking-[0.1em] uppercase hover:bg-olive-400 transition-colors"
                                >
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Footer */}
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16">
                    {/* Brand */}
                    <div className={`lg:col-span-5 ${isInView ? 'animate-fade-up' : 'opacity-0'}`}>
                        <Link href="/" className="inline-block mb-6">
                            <span className="font-display text-3xl md:text-4xl">
                                Stayin<span className="text-olive-400">UBUD</span>
                            </span>
                        </Link>
                        <p className="text-white/40 max-w-sm leading-relaxed mb-8 text-sm">
                            Curating exceptional villa experiences in Ubud, Bali.
                            Where architectural excellence meets Balinese tranquility.
                        </p>

                        {/* Eco Badge */}
                        <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 inline-flex">
                            <Leaf size={16} className="text-olive-400" />
                            <span className="text-white/60 text-xs">Eco-Friendly Luxury</span>
                        </div>
                    </div>

                    {/* Explore Links */}
                    <div className={`lg:col-span-2 ${isInView ? 'animate-fade-up stagger-1' : 'opacity-0'}`}>
                        <p className="text-white/30 text-xs tracking-[0.2em] uppercase mb-6">
                            Explore
                        </p>
                        <ul className="space-y-4">
                            {links.explore.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-white/60 hover:text-olive-400 transition-colors text-sm inline-flex items-center gap-1 group"
                                    >
                                        {link.label}
                                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div className={`lg:col-span-2 ${isInView ? 'animate-fade-up stagger-2' : 'opacity-0'}`}>
                        <p className="text-white/30 text-xs tracking-[0.2em] uppercase mb-6">
                            Legal
                        </p>
                        <ul className="space-y-4">
                            {links.legal.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-white/60 hover:text-olive-400 transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className={`lg:col-span-3 ${isInView ? 'animate-fade-up stagger-3' : 'opacity-0'}`}>
                        <p className="text-white/30 text-xs tracking-[0.2em] uppercase mb-6">
                            Contact Us
                        </p>
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href={`mailto:${settings.contact.email}`}
                                    className="flex items-center gap-3 text-white/60 hover:text-olive-400 transition-colors text-sm"
                                >
                                    <Mail size={16} className="text-olive-400/50" />
                                    {settings.contact.email}
                                </a>
                            </li>
                            <li>
                                <a
                                    href={`tel:${settings.contact.phone.replace(/\s/g, '')}`}
                                    className="flex items-center gap-3 text-white/60 hover:text-olive-400 transition-colors text-sm"
                                >
                                    <Phone size={16} className="text-olive-400/50" />
                                    {settings.contact.phone}
                                </a>
                            </li>
                            <li className="flex items-start gap-3 text-white/60 text-sm">
                                <MapPin size={16} className="text-olive-400/50 flex-shrink-0 mt-0.5" />
                                <span>{settings.contact.address}</span>
                            </li>
                        </ul>

                        {/* Social Links */}
                        <div className="flex items-center gap-3 mt-8">
                            {settings.social.instagram && (
                                <a
                                    href={settings.social.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 flex items-center justify-center border border-white/10 text-white/40 hover:text-olive-400 hover:border-olive-400/50 transition-all"
                                    aria-label="Instagram"
                                >
                                    <Instagram size={18} />
                                </a>
                            )}
                            {settings.social.facebook && (
                                <a
                                    href={settings.social.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 flex items-center justify-center border border-white/10 text-white/40 hover:text-olive-400 hover:border-olive-400/50 transition-all"
                                    aria-label="Facebook"
                                >
                                    <Facebook size={18} />
                                </a>
                            )}
                            {settings.social.youtube && (
                                <a
                                    href={settings.social.youtube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 flex items-center justify-center border border-white/10 text-white/40 hover:text-olive-400 hover:border-olive-400/50 transition-all"
                                    aria-label="YouTube"
                                >
                                    <Youtube size={18} />
                                </a>
                            )}
                            {!settings.social.instagram && !settings.social.facebook && !settings.social.youtube && (
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 flex items-center justify-center border border-white/10 text-white/40 hover:text-olive-400 hover:border-olive-400/50 transition-all"
                                    aria-label="Instagram"
                                >
                                    <Instagram size={18} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/5">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <p className="text-white/30 text-xs">
                            {settings.footer.copyright || `© ${new Date().getFullYear()} StayinUBUD. All rights reserved.`}
                        </p>
                        <p className="text-white/20 text-xs">
                            Crafted with passion in Ubud, Bali
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
