'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar as CalendarIcon, Loader2, AlertCircle } from 'lucide-react'
import { format, addDays, parseISO, isBefore, isAfter } from 'date-fns'
import { Villa } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { calculateNights, calculateTotalPrice, formatCurrency, validateEmail, validatePhone } from '@/lib/utils'

interface BookingFormProps {
    villa: Villa
}

export default function BookingForm({ villa }: BookingFormProps) {
    const router = useRouter()
    const supabase = createClient()

    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [guests, setGuests] = useState(2)
    const [guestName, setGuestName] = useState('')
    const [guestEmail, setGuestEmail] = useState('')
    const [guestPhone, setGuestPhone] = useState('')
    const [specialRequests, setSpecialRequests] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [bookedDates, setBookedDates] = useState<string[]>([])
    const [checkingAvailability, setCheckingAvailability] = useState(false)

    const minDate = format(new Date(), 'yyyy-MM-dd')

    useEffect(() => {
        fetchBookedDates()
    }, [])

    async function fetchBookedDates() {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select('check_in, check_out')
                .eq('villa_id', villa.id)
                .in('status', ['pending', 'confirmed'])

            if (error) throw error

            const dates: string[] = []
            data?.forEach((booking) => {
                const start = parseISO(booking.check_in)
                const end = parseISO(booking.check_out)
                let current = start

                while (isBefore(current, end) || current.getTime() === end.getTime()) {
                    dates.push(format(current, 'yyyy-MM-dd'))
                    current = addDays(current, 1)
                }
            })

            setBookedDates(dates)
        } catch (err) {
            console.error('Error fetching booked dates:', err)
        }
    }

    async function checkAvailability() {
        if (!checkIn || !checkOut) return true

        setCheckingAvailability(true)
        try {
            const { data, error } = await supabase
                .rpc('check_booking_availability', {
                    p_villa_id: villa.id,
                    p_check_in: checkIn,
                    p_check_out: checkOut,
                })

            if (error) throw error
            return data
        } catch (err) {
            console.error('Error checking availability:', err)
            return true
        } finally {
            setCheckingAvailability(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')

        // Validation
        if (!checkIn || !checkOut) {
            setError('Please select check-in and check-out dates')
            return
        }

        if (!guestName.trim()) {
            setError('Please enter your name')
            return
        }

        if (!validateEmail(guestEmail)) {
            setError('Please enter a valid email address')
            return
        }

        if (guestPhone && !validatePhone(guestPhone)) {
            setError('Please enter a valid phone number')
            return
        }

        if (guests < 1 || guests > villa.max_guests) {
            setError(`Number of guests must be between 1 and ${villa.max_guests}`)
            return
        }

        const checkInDate = parseISO(checkIn)
        const checkOutDate = parseISO(checkOut)

        if (isAfter(checkInDate, checkOutDate) || checkInDate.getTime() === checkOutDate.getTime()) {
            setError('Check-out date must be after check-in date')
            return
        }

        // Check availability
        const available = await checkAvailability()
        if (!available) {
            setError('Sorry, this villa is not available for the selected dates. Please choose different dates.')
            return
        }

        setLoading(true)

        try {
            const totalPrice = calculateTotalPrice(villa.price_per_night, checkIn, checkOut)

            const { data, error } = await supabase
                .from('bookings')
                .insert({
                    villa_id: villa.id,
                    guest_name: guestName.trim(),
                    guest_email: guestEmail.trim().toLowerCase(),
                    guest_phone: guestPhone.trim() || null,
                    check_in: checkIn,
                    check_out: checkOut,
                    total_guests: guests,
                    total_price: totalPrice,
                    special_requests: specialRequests.trim() || null,
                    status: 'pending',
                })
                .select()
                .single()

            if (error) throw error

            // Redirect to confirmation page
            router.push(`/booking/confirmation?id=${data.id}`)
        } catch (err: any) {
            console.error('Booking error:', err)
            setError(err.message || 'Failed to create booking. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0
    const totalPrice = checkIn && checkOut ? calculateTotalPrice(villa.price_per_night, checkIn, checkOut) : 0

    return (
        <div className="bg-white rounded-2xl shadow-2xl p-8 sticky top-24 animate-fade-up">
            <h2 className="text-2xl font-bold text-olive mb-6">Book Your Stay</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Selection */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <CalendarIcon size={16} className="inline mr-1" />
                            Check-in
                        </label>
                        <input
                            type="date"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            min={minDate}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <CalendarIcon size={16} className="inline mr-1" />
                            Check-out
                        </label>
                        <input
                            type="date"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            min={checkIn || minDate}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all"
                        />
                    </div>
                </div>

                {/* Guests */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Guests
                    </label>
                    <input
                        type="number"
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value))}
                        min="1"
                        max={villa.max_guests}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-1">Maximum {villa.max_guests} guests</p>
                </div>

                {/* Guest Information */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                    </label>
                    <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        required
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                    </label>
                    <input
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        required
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="+62 xxx xxx xxx"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Requests (Optional)
                    </label>
                    <textarea
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        rows={3}
                        placeholder="Any special requirements or requests?"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all resize-none"
                    />
                </div>

                {/* Price Summary */}
                {nights > 0 && (
                    <div className="bg-cream/50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                                {formatCurrency(villa.price_per_night)} × {nights} {nights === 1 ? 'night' : 'nights'}
                            </span>
                            <span className="font-medium">{formatCurrency(totalPrice)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t border-sage/20 pt-2">
                            <span>Total</span>
                            <span className="text-sage">{formatCurrency(totalPrice)}</span>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-2">
                        <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || checkingAvailability}
                    className="w-full bg-sage text-white py-4 rounded-lg font-semibold hover:bg-sage-dark hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
                >
                    {loading ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            <span>Processing...</span>
                        </>
                    ) : checkingAvailability ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            <span>Checking availability...</span>
                        </>
                    ) : (
                        <span>Book Now</span>
                    )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                    You won't be charged yet. We'll confirm your booking details first.
                </p>
            </form>
        </div>
    )
}
