'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X, Phone, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface ContactSettings {
    phone: string
    email: string
    whatsapp: string
    address: string
}

const defaultContact: ContactSettings = {
    phone: '+62 812 3456 7890',
    email: 'hello@stayinubud.com',
    whatsapp: '6281234567890',
    address: 'Ubud, Bali, Indonesia'
}

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [contact, setContact] = useState<ContactSettings>(defaultContact)
    const pathname = usePathname()

    // Scroll detection - navbar always visible (fixed), only updates styling
    useEffect(() => {
        const handleScroll = () => {
            // Update scrolled state (for styling changes only - background, shadow, etc.)
            setIsScrolled(window.scrollY > 80)
        }

        handleScroll() // Initial check
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset'
        return () => { document.body.style.overflow = 'unset' }
    }, [isMobileMenuOpen])

    useEffect(() => {
        fetchContactSettings()
    }, [])

    async function fetchContactSettings() {
        try {
            const supabase = createClient()
            const { data } = await supabase
                .from('site_settings')
                .select('key, value')
                .eq('key', 'contact')
                .single()

            if (data?.value) {
                setContact(data.value as ContactSettings)
            }
        } catch (error) {
            console.error('Error fetching contact settings:', error)
        }
    }

    const menuItems = [
        { href: '/villas', label: 'Villas' },
        { href: '/about', label: 'About' },
        { href: '/blog', label: 'Journal' },
        { href: '/contact', label: 'Contact' },
    ]

    const isActive = (href: string) => pathname === href
    const isTransparent = !isScrolled

    return (
        <>
            {/* Desktop Navbar - Always Fixed */}
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], type: 'tween' }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    willChange: 'transform',
                    backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent'
                }}
                className={`z-[9999] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                    ${isScrolled
                        ? 'backdrop-blur-md py-3 border-b border-gray-100 shadow-sm'
                        : 'py-4'
                    }
                `}
            >





                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="relative z-10 h-20 md:h-24 flex items-center">
                            {/* Container with fixed height for smooth transition */}
                            <div className="relative w-48 md:w-56 h-full flex items-center">
                                {/* Image Logo - Always rendered, opacity controlled */}
                                <motion.div
                                    animate={{
                                        opacity: isTransparent ? 1 : 0,
                                        scale: isTransparent ? 1 : 0.9,
                                    }}
                                    transition={{
                                        duration: 0.4,
                                        ease: [0.16, 1, 0.3, 1]
                                    }}
                                    className="absolute inset-0 flex items-center"
                                    style={{ pointerEvents: isTransparent ? 'auto' : 'none' }}
                                >
                                    <Image
                                        src="/images/logo.png"
                                        alt="StayinUBUD"
                                        width={220}
                                        height={120}
                                        className="h-20 md:h-24 w-auto object-contain"
                                        priority
                                    />
                                </motion.div>

                                {/* Text Logo - Always rendered, opacity controlled */}
                                <motion.span
                                    animate={{
                                        opacity: isTransparent ? 0 : 1,
                                        y: isTransparent ? -5 : 0,
                                    }}
                                    transition={{
                                        duration: 0.4,
                                        ease: [0.16, 1, 0.3, 1]
                                    }}
                                    className="font-display text-2xl md:text-3xl tracking-tight text-gray-900 whitespace-nowrap"
                                    style={{ pointerEvents: isTransparent ? 'none' : 'auto' }}
                                >
                                    Stayin<span className="text-olive-600">UBUD</span>
                                </motion.span>
                            </div>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex items-center gap-12">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="relative group"
                                >
                                    <span className={`text-xs tracking-[0.2em] uppercase transition-colors duration-300
                                        ${isActive(item.href)
                                            ? isTransparent ? 'text-olive-400' : 'text-olive-600'
                                            : isTransparent ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                                        }
                                    `}>
                                        {item.label}
                                    </span>
                                    <span className={`absolute -bottom-1 left-0 h-px transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                                        ${isTransparent ? 'bg-olive-400' : 'bg-olive-600'}
                                        ${isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'}
                                    `} />
                                </Link>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="hidden lg:flex items-center gap-4">
                            <a
                                href={`tel:${contact.phone.replace(/\s/g, '')}`}
                                className={`flex items-center gap-2 text-xs transition-colors
                                    ${isTransparent ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-gray-900'}
                                `}
                            >
                                <Phone size={14} />
                                <span className="hidden xl:inline">{contact.phone}</span>
                            </a>
                            <a
                                href={`mailto:${contact.email}`}
                                className={`flex items-center gap-2 text-xs tracking-[0.15em] uppercase px-6 py-3 transition-all duration-300
                                    ${isTransparent
                                        ? 'bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-olive-600 hover:border-olive-600'
                                        : 'bg-olive-900 text-white hover:bg-olive-600'
                                    }
                                `}
                            >
                                <Mail size={14} />
                                <span className="hidden xl:inline">{contact.email}</span>
                                <span className="xl:hidden">Email Us</span>
                            </a>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className={`lg:hidden p-2 transition-colors ${isTransparent ? 'text-white' : 'text-gray-900'}`}
                            aria-label="Open menu"
                        >
                            <Menu size={24} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 z-[10000] bg-black/40 backdrop-blur-sm lg:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="fixed top-0 right-0 bottom-0 w-full max-w-sm z-[10000] bg-[#5D8736] lg:hidden"
                        >
                            <div className="h-full flex flex-col p-8">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-12">
                                    <Image
                                        src="/images/logo.png"
                                        alt="StayinUBUD"
                                        width={140}
                                        height={80}
                                        className="h-16 w-auto object-contain"
                                    />
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="p-2 text-white hover:text-white/80 transition-colors"
                                        aria-label="Close menu"
                                    >
                                        <X size={24} strokeWidth={1.5} />
                                    </button>
                                </div>

                                {/* Menu Items */}
                                <div className="flex-1">
                                    {menuItems.map((item, index) => (
                                        <motion.div
                                            key={item.href}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`block py-4 text-3xl font-display border-b border-white/20 transition-colors
                                                    ${isActive(item.href) ? 'text-white' : 'text-white/80 hover:text-white'}
                                                `}
                                            >
                                                {item.label}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Bottom CTA */}
                                <div className="pt-8 border-t border-white/20 space-y-4">
                                    <Link
                                        href="/villas"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block w-full py-4 bg-white text-[#5D8736] text-center text-sm tracking-[0.15em] uppercase font-medium hover:bg-white/90 transition-colors"
                                    >
                                        Book Your Stay
                                    </Link>
                                    <a
                                        href={`tel:${contact.phone.replace(/\s/g, '')}`}
                                        className="flex items-center justify-center gap-2 text-white/70 hover:text-white transition-colors"
                                    >
                                        <Phone size={16} />
                                        <span>{contact.phone}</span>
                                    </a>
                                    <a
                                        href={`mailto:${contact.email}`}
                                        className="flex items-center justify-center gap-2 text-white/70 hover:text-white transition-colors"
                                    >
                                        <Mail size={16} />
                                        <span>{contact.email}</span>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
