'use client'

import { useRef, useEffect, useState, ReactNode } from 'react'
import Link from 'next/link'
import { FileText, Scale, BookOpen, ArrowLeft, ChevronRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface LegalPageLayoutProps {
    title: string
    subtitle: string
    icon: 'privacy' | 'terms' | 'booking'
    lastUpdated: string
    children: ReactNode
}

const iconMap = {
    privacy: FileText,
    terms: Scale,
    booking: BookOpen,
}

const relatedPages = [
    { title: 'Privacy Policy', href: '/privacy', icon: FileText },
    { title: 'Terms of Service', href: '/terms', icon: Scale },
    { title: 'Booking Policy', href: '/booking-policy', icon: BookOpen },
]

export default function LegalPageLayout({
    title,
    subtitle,
    icon,
    lastUpdated,
    children
}: LegalPageLayoutProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [isInView, setIsInView] = useState(false)
    const [activeSection, setActiveSection] = useState('')
    const Icon = iconMap[icon]

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsInView(true)
            },
            { rootMargin: '-100px' }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    // Track active section for table of contents
    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll('[data-section]')
            let current = ''

            sections.forEach((section) => {
                const sectionTop = (section as HTMLElement).offsetTop
                if (window.scrollY >= sectionTop - 200) {
                    current = section.getAttribute('data-section') || ''
                }
            })

            setActiveSection(current)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <main className="min-h-screen bg-cream">
            <Navbar />

            {/* Hero Header */}
            <div className="relative pt-32 pb-16 md:pb-24 bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-olive-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-10 w-96 h-96 bg-olive-400/10 rounded-full blur-3xl" />

                <div className="relative max-w-[1400px] mx-auto px-6 md:px-12">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-white/50 mb-8">
                        <Link href="/" className="hover:text-white transition-colors">
                            Home
                        </Link>
                        <ChevronRight size={14} />
                        <span className="text-white">{title}</span>
                    </nav>

                    <div className="flex items-start gap-6">
                        {/* Icon */}
                        <div className="hidden md:flex w-20 h-20 bg-olive-600/20 backdrop-blur-sm border border-olive-400/30 items-center justify-center flex-shrink-0">
                            <Icon size={32} className="text-olive-400" />
                        </div>

                        <div>
                            <p className="text-olive-400 text-xs tracking-[0.3em] uppercase mb-3">
                                Legal Documentation
                            </p>
                            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-4">
                                {title}
                            </h1>
                            <p className="text-white/60 text-lg max-w-2xl mb-4">
                                {subtitle}
                            </p>
                            <p className="text-white/40 text-sm">
                                Last updated: {lastUpdated}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div ref={ref} className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24">
                <div className="grid lg:grid-cols-[280px_1fr] gap-12">
                    {/* Sidebar - Table of Contents */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-32">
                            <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-4">
                                On this page
                            </p>
                            <nav className="space-y-1 border-l border-gray-200">
                                {/* Auto-generated from sections */}
                                <div id="toc-container" />
                            </nav>

                            {/* Related Policies */}
                            <div className="mt-12 pt-8 border-t border-gray-200">
                                <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-4">
                                    Related Policies
                                </p>
                                <div className="space-y-3">
                                    {relatedPages.map((page) => (
                                        <Link
                                            key={page.href}
                                            href={page.href}
                                            className="flex items-center gap-3 text-gray-600 hover:text-olive-600 transition-colors group"
                                        >
                                            <page.icon size={16} className="text-gray-400 group-hover:text-olive-600" />
                                            <span className="text-sm">{page.title}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Back to Home */}
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 mt-12 text-sm text-gray-500 hover:text-olive-600 transition-colors"
                            >
                                <ArrowLeft size={14} />
                                <span>Back to Home</span>
                            </Link>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className={`${isInView ? 'animate-fade-up' : 'opacity-0'}`}>
                        <div className="bg-white border border-gray-100 shadow-sm">
                            <div className="p-8 md:p-12 lg:p-16">
                                {children}
                            </div>
                        </div>

                        {/* Footer Note */}
                        <div className="mt-8 p-6 bg-olive-50/50 border border-olive-100">
                            <p className="text-sm text-olive-800">
                                <strong>Questions?</strong> If you have any questions about this policy, please contact us at{' '}
                                <a href="mailto:legal@stayinubud.com" className="text-olive-600 underline hover:no-underline">
                                    legal@stayinubud.com
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    )
}

// Reusable Section Component
export function LegalSection({
    number,
    title,
    children
}: {
    number: string
    title: string
    children: ReactNode
}) {
    return (
        <section data-section={`section-${number}`} className="scroll-mt-32">
            <div className="flex items-start gap-4 mb-6">
                <span className="flex-shrink-0 w-10 h-10 bg-olive-100 text-olive-600 flex items-center justify-center font-display text-lg">
                    {number}
                </span>
                <h2 className="font-display text-2xl md:text-3xl text-gray-900 pt-1">
                    {title}
                </h2>
            </div>
            <div className="pl-14 text-gray-600 leading-relaxed space-y-4">
                {children}
            </div>
        </section>
    )
}

// Highlighted Box Component
export function LegalHighlight({
    variant = 'info',
    children
}: {
    variant?: 'info' | 'warning' | 'success'
    children: ReactNode
}) {
    const variants = {
        info: 'bg-blue-50 border-blue-200 text-blue-900',
        warning: 'bg-amber-50 border-amber-200 text-amber-900',
        success: 'bg-olive-50 border-olive-200 text-olive-900',
    }

    return (
        <div className={`p-6 border ${variants[variant]}`}>
            {children}
        </div>
    )
}

// List Component
export function LegalList({ items }: { items: string[] }) {
    return (
        <ul className="space-y-3">
            {items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-1.5 h-1.5 bg-olive-600 rounded-full mt-2" />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    )
}

// Contact Card Component
export function LegalContactCard({
    title,
    email,
    phone,
    address,
    hours
}: {
    title: string
    email: string
    phone: string
    address?: string
    hours?: string
}) {
    return (
        <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <p className="font-display text-xl mb-6">{title}</p>
            <div className="space-y-3">
                <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-3 text-white/80 hover:text-olive-400 transition-colors"
                >
                    <span className="w-8 h-8 bg-white/10 flex items-center justify-center">
                        <FileText size={14} />
                    </span>
                    <span>{email}</span>
                </a>
                <a
                    href={`tel:${phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-3 text-white/80 hover:text-olive-400 transition-colors"
                >
                    <span className="w-8 h-8 bg-white/10 flex items-center justify-center">
                        <Scale size={14} />
                    </span>
                    <span>{phone}</span>
                </a>
                {address && (
                    <p className="flex items-center gap-3 text-white/60">
                        <span className="w-8 h-8 bg-white/10 flex items-center justify-center">
                            <BookOpen size={14} />
                        </span>
                        <span>{address}</span>
                    </p>
                )}
            </div>
            {hours && (
                <p className="mt-6 pt-6 border-t border-white/10 text-white/40 text-sm">
                    {hours}
                </p>
            )}
        </div>
    )
}
