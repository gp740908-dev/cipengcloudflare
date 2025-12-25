'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, Calendar, Users, Mail, Phone, Home, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Booking } from '@/types'
import { formatCurrency, formatDate, calculateNights } from '@/lib/utils'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

function ConfirmationContent() {
    const searchParams = useSearchParams()
    const bookingId = searchParams.get('id')

    const [booking, setBooking] = useState<Booking | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const supabase = createClient()

    useEffect(() => {
        if (bookingId) {
            fetchBooking()
        }
    }, [bookingId])

    async function fetchBooking() {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select(`
          *,
          villa:villas(*)
        `)
                .eq('id', bookingId)
                .single()

            if (error) throw error
            setBooking(data)
        } catch (err: any) {
            console.error('Error fetching booking:', err)
            setError('Booking not found')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="animate-spin w-12 h-12 border-4 border-sage border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading booking details...</p>
            </div>
        )
    }

    if (error || !booking) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="max-w-md mx-auto">
                    <h1 className="text-3xl font-bold text-olive mb-4">Booking Not Found</h1>
                    <p className="text-gray-600 mb-8">We couldn't find the booking you're looking for.</p>
                    <Link
                        href="/"
                        className="inline-flex items-center space-x-2 bg-sage text-white px-6 py-3 rounded-lg hover:bg-sage-dark transition-colors"
                    >
                        <span>Return Home</span>
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        )
    }

    const nights = calculateNights(booking.check_in, booking.check_out)

    return (
        <div className="container mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-3xl mx-auto"
            >
                {/* Success Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
                    >
                        <CheckCircle size={48} className="text-green-600" />
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-bold text-olive mb-4">
                        Booking Confirmed!
                    </h1>
                    <p className="text-xl text-gray-600">
                        Thank you for your booking. We've sent a confirmation email to{' '}
                        <span className="font-medium text-sage">{booking.guest_email}</span>
                    </p>
                </div>

                {/* Booking Details Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Villa Info */}
                    <div className="bg-gradient-to-r from-sage to-sage-dark p-8 text-white">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm opacity-90 mb-1">Booking ID</p>
                                <p className="font-mono text-lg">{booking.id.substring(0, 8).toUpperCase()}</p>
                            </div>
                            <div className="bg-white/20 px-4 py-2 rounded-lg">
                                <p className="text-sm capitalize">{booking.status}</p>
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold mt-6">{booking.villa?.name}</h2>
                    </div>

                    {/* Details Grid */}
                    <div className="p-8 space-y-6">
                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-10 h-10 bg-sage/10 rounded-lg flex items-center justify-center">
                                    <Calendar size={20} className="text-sage" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Check-in</p>
                                    <p className="font-semibold text-lg text-olive">
                                        {formatDate(booking.check_in)}
                                    </p>
                                    <p className="text-xs text-gray-500">After 2:00 PM</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-10 h-10 bg-sage/10 rounded-lg flex items-center justify-center">
                                    <Calendar size={20} className="text-sage" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Check-out</p>
                                    <p className="font-semibold text-lg text-olive">
                                        {formatDate(booking.check_out)}
                                    </p>
                                    <p className="text-xs text-gray-500">Before 12:00 PM</p>
                                </div>
                            </div>
                        </div>

                        {/* Guests */}
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-sage/10 rounded-lg flex items-center justify-center">
                                <Users size={20} className="text-sage" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Guests</p>
                                <p className="font-semibold text-lg text-olive">
                                    {booking.total_guests} {booking.total_guests === 1 ? 'Guest' : 'Guests'}
                                </p>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-3 pt-6 border-t">
                            <h3 className="font-semibold text-olive mb-3">Guest Information</h3>

                            <div className="flex items-center space-x-3">
                                <Home size={18} className="text-sage" />
                                <span className="text-gray-700">{booking.guest_name}</span>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Mail size={18} className="text-sage" />
                                <span className="text-gray-700">{booking.guest_email}</span>
                            </div>

                            {booking.guest_phone && (
                                <div className="flex items-center space-x-3">
                                    <Phone size={18} className="text-sage" />
                                    <span className="text-gray-700">{booking.guest_phone}</span>
                                </div>
                            )}
                        </div>

                        {/* Special Requests */}
                        {booking.special_requests && (
                            <div className="pt-6 border-t">
                                <h3 className="font-semibold text-olive mb-2">Special Requests</h3>
                                <p className="text-gray-700">{booking.special_requests}</p>
                            </div>
                        )}

                        {/* Price Summary */}
                        <div className="bg-cream/50 rounded-lg p-6 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    {booking.villa && formatCurrency(booking.villa.price_per_night)} × {nights} {nights === 1 ? 'night' : 'nights'}
                                </span>
                                <span className="font-medium">{formatCurrency(booking.total_price)}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold border-t border-sage/20 pt-3">
                                <span>Total</span>
                                <span className="text-sage">{formatCurrency(booking.total_price)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-olive mb-4">What's Next?</h3>
                    <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start space-x-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-sage text-white rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                            <span>Check your email for the booking confirmation and villa details</span>
                        </li>
                        <li className="flex items-start space-x-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-sage text-white rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                            <span>Our team will contact you within 24 hours to confirm your reservation</span>
                        </li>
                        <li className="flex items-start space-x-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-sage text-white rounded-full flex items-center justify-center text-sm font-semibold">3</span>
                            <span>We'll send you detailed check-in instructions before your arrival</span>
                        </li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/villas"
                        className="inline-flex items-center justify-center space-x-2 border-2 border-sage text-sage px-6 py-3 rounded-lg hover:bg-sage hover:text-white transition-all font-medium"
                    >
                        <span>Browse More Villas</span>
                    </Link>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center space-x-2 bg-sage text-white px-6 py-3 rounded-lg hover:bg-sage-dark transition-all font-medium"
                    >
                        <span>Return Home</span>
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}

export default function ConfirmationPage() {
    return (
        <main className="min-h-screen bg-cream/30">
            <Navbar />
            <div className="pt-24 pb-20">
                <Suspense fallback={
                    <div className="container mx-auto px-4 py-20 text-center">
                        <div className="animate-spin w-12 h-12 border-4 border-sage border-t-transparent rounded-full mx-auto"></div>
                    </div>
                }>
                    <ConfirmationContent />
                </Suspense>
            </div>
            <Footer />
        </main>
    )
}
