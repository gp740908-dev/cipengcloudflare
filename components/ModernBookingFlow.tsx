'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Calendar,
    Users,
    User,
    CreditCard,
    Check,
    ChevronLeft,
    ChevronRight,
    Loader2,
    MessageCircle,
    Tag,
    Phone,
    Mail,
    MapPin,
    Leaf,
    X
} from 'lucide-react'
import { format, parseISO, differenceInDays } from 'date-fns'
import { Villa } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'

interface ModernBookingFlowProps {
    villa: Villa
    onClose?: () => void
}

type BookingStep = 'dates' | 'guests' | 'review' | 'payment' | 'confirmation'

const steps: { id: BookingStep; label: string; icon: React.ElementType }[] = [
    { id: 'dates', label: 'Dates', icon: Calendar },
    { id: 'guests', label: 'Guest', icon: Users },
    { id: 'review', label: 'Review', icon: Check },
    { id: 'payment', label: 'Pay', icon: CreditCard },
]

export default function ModernBookingFlow({ villa, onClose }: ModernBookingFlowProps) {
    const supabase = createClient()

    const [currentStep, setCurrentStep] = useState<BookingStep>('dates')
    const [isLoading, setIsLoading] = useState(false)
    const [bookingId, setBookingId] = useState<string | null>(null)

    // Form data
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [guests, setGuests] = useState(2)
    const [guestName, setGuestName] = useState('')
    const [guestEmail, setGuestEmail] = useState('')
    const [guestPhone, setGuestPhone] = useState('')
    const [specialRequests, setSpecialRequests] = useState('')
    const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'whatsapp'>('whatsapp')

    // Promo code state
    const [promoCode, setPromoCode] = useState('')
    const [promoLoading, setPromoLoading] = useState(false)
    const [promoApplied, setPromoApplied] = useState<{
        id: string
        name: string
        discount_type: 'percentage' | 'fixed'
        discount_value: number
        max_discount: number | null
    } | null>(null)
    const [promoError, setPromoError] = useState('')

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [])

    // Calculations
    const nights = checkIn && checkOut ? differenceInDays(parseISO(checkOut), parseISO(checkIn)) : 0
    const subtotal = villa.price_per_night * nights
    const serviceFee = Math.round(subtotal * 0.05)

    // Calculate discount
    let discountAmount = 0
    if (promoApplied) {
        if (promoApplied.discount_type === 'percentage') {
            discountAmount = Math.round(subtotal * (promoApplied.discount_value / 100))
            // Apply max discount cap
            if (promoApplied.max_discount && discountAmount > promoApplied.max_discount) {
                discountAmount = promoApplied.max_discount
            }
        } else {
            discountAmount = promoApplied.discount_value
        }
    }
    const totalPrice = subtotal + serviceFee - discountAmount

    const minDate = format(new Date(), 'yyyy-MM-dd')
    const adminWhatsApp = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '6281234567890'
    const stepIndex = steps.findIndex(s => s.id === currentStep)

    const canProceed = () => {
        switch (currentStep) {
            case 'dates':
                return checkIn && checkOut && nights > 0
            case 'guests':
                return guestName.trim() && guestEmail.trim() && guestPhone.trim()
            case 'review':
                return true
            case 'payment':
                return paymentMethod
            default:
                return false
        }
    }

    const nextStep = () => {
        const currentIndex = steps.findIndex(s => s.id === currentStep)
        if (currentIndex < steps.length - 1) {
            setCurrentStep(steps[currentIndex + 1].id)
        } else if (currentStep === 'payment') {
            handleSubmitBooking()
        }
    }

    const prevStep = () => {
        const currentIndex = steps.findIndex(s => s.id === currentStep)
        if (currentIndex > 0) {
            setCurrentStep(steps[currentIndex - 1].id)
        }
    }

    // Validate promo code
    const validatePromoCode = async () => {
        if (!promoCode.trim()) {
            setPromoError('Masukkan kode promo')
            return
        }

        setPromoLoading(true)
        setPromoError('')

        try {
            const { data, error } = await supabase
                .from('promos')
                .select('*')
                .ilike('code', promoCode.trim())
                .eq('is_active', true)
                .single()

            if (error || !data) {
                setPromoError('Kode promo tidak valid')
                setPromoApplied(null)
                return
            }

            // Check validity dates
            const now = new Date()
            const validFrom = new Date(data.valid_from)
            const validUntil = data.valid_until ? new Date(data.valid_until) : null

            if (validFrom > now) {
                setPromoError('Kode promo belum berlaku')
                setPromoApplied(null)
                return
            }

            if (validUntil && validUntil < now) {
                setPromoError('Kode promo sudah kadaluarsa')
                setPromoApplied(null)
                return
            }

            // Check usage limit
            if (data.usage_limit && data.used_count >= data.usage_limit) {
                setPromoError('Kode promo sudah mencapai batas penggunaan')
                setPromoApplied(null)
                return
            }

            // Check minimum stay
            if (data.min_stay_nights && nights < data.min_stay_nights) {
                setPromoError(`Minimal menginap ${data.min_stay_nights} malam`)
                setPromoApplied(null)
                return
            }

            // Check minimum booking amount
            if (data.min_booking_amount && subtotal < data.min_booking_amount) {
                setPromoError(`Minimal booking ${formatCurrency(data.min_booking_amount)}`)
                setPromoApplied(null)
                return
            }

            // Promo valid!
            setPromoApplied({
                id: data.id,
                name: data.name,
                discount_type: data.discount_type,
                discount_value: data.discount_value,
                max_discount: data.max_discount_amount,
            })
            setPromoError('')
        } catch (error) {
            console.error('Error validating promo:', error)
            setPromoError('Gagal memvalidasi kode promo')
        } finally {
            setPromoLoading(false)
        }
    }

    const removePromo = () => {
        setPromoApplied(null)
        setPromoCode('')
        setPromoError('')
    }

    const handleSubmitBooking = async () => {
        setIsLoading(true)

        try {
            const { data, error } = await supabase
                .from('bookings')
                .insert({
                    villa_id: villa.id,
                    guest_name: guestName.trim(),
                    guest_email: guestEmail.trim().toLowerCase(),
                    guest_phone: guestPhone.trim(),
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

            setBookingId(data.id)
            setCurrentStep('confirmation')

            if (paymentMethod === 'whatsapp') {
                sendToWhatsApp(data.id)
            }
        } catch (error) {
            console.error('Booking error:', error)
            alert('An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const sendToWhatsApp = (bookingRef: string) => {
        const checkInFormatted = format(parseISO(checkIn), 'dd MMM yyyy')
        const checkOutFormatted = format(parseISO(checkOut), 'dd MMM yyyy')

        const message = `
🏝️ *NEW BOOKING - StayinUBUD*

📋 *Booking Details*
━━━━━━━━━━━━━━━
🆔 ID: ${bookingRef.substring(0, 8).toUpperCase()}
🏠 Villa: ${villa.name}
📍 Location: ${villa.location}

📅 *Dates*
━━━━━━━━━━━━━━━
Check-in: ${checkInFormatted}
Check-out: ${checkOutFormatted}
Duration: ${nights} night${nights > 1 ? 's' : ''}

👥 *Guest*
━━━━━━━━━━━━━━━
Name: ${guestName}
Email: ${guestEmail}
Phone: ${guestPhone}
Total Guests: ${guests} person${guests > 1 ? 's' : ''}
${specialRequests ? `\nSpecial Requests:\n${specialRequests}` : ''}

💰 *Price Breakdown*
━━━━━━━━━━━━━━━
${formatCurrency(villa.price_per_night)} × ${nights} night${nights > 1 ? 's' : ''} = ${formatCurrency(subtotal)}
Service Fee (5%): ${formatCurrency(serviceFee)}${promoApplied ? `
🏷️ Promo (${promoApplied.name}): -${formatCurrency(discountAmount)}` : ''}
━━━━━━━━━━━━━━━
*TOTAL: ${formatCurrency(totalPrice)}*

Please confirm villa availability. Thank you! 🙏
`.trim()

        const whatsappUrl = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3 }}
                className="relative bg-white w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="bg-olive-900 p-6 text-white flex-shrink-0">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-display text-xl md:text-2xl">Book {villa.name}</h2>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    {/* Progress Steps */}
                    {currentStep !== 'confirmation' && (
                        <div className="flex items-center justify-between">
                            {steps.map((step, index) => {
                                const Icon = step.icon
                                const isActive = step.id === currentStep
                                const isCompleted = index < stepIndex

                                return (
                                    <div key={step.id} className="flex items-center">
                                        <div className={`
                                            flex items-center justify-center w-10 h-10 transition-all
                                            ${isActive ? 'bg-white text-olive-900' : ''}
                                            ${isCompleted ? 'bg-olive-400/30 text-white' : ''}
                                            ${!isActive && !isCompleted ? 'bg-white/10 text-white/50' : ''}
                                        `}>
                                            {isCompleted ? <Check size={16} /> : <Icon size={16} />}
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div className={`w-8 md:w-12 h-px mx-1 ${isCompleted ? 'bg-olive-400/50' : 'bg-white/10'}`} />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Content - Scrollable */}
                <div className="p-6 flex-1 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Dates */}
                        {currentStep === 'dates' && (
                            <motion.div
                                key="dates"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="text-center">
                                    <h3 className="font-display text-2xl text-gray-900 mb-2">Select Your Dates</h3>
                                    <p className="text-gray-500 text-sm">When would you like to stay?</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-500 mb-2">Check-in</label>
                                        <input
                                            type="date"
                                            value={checkIn}
                                            onChange={(e) => {
                                                setCheckIn(e.target.value)
                                                if (checkOut && e.target.value >= checkOut) {
                                                    setCheckOut('')
                                                }
                                            }}
                                            min={minDate}
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-500 mb-2">Check-out</label>
                                        <input
                                            type="date"
                                            value={checkOut}
                                            onChange={(e) => setCheckOut(e.target.value)}
                                            min={checkIn || minDate}
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors text-gray-900"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-500 mb-4 text-center">Number of Guests</label>
                                    <div className="flex items-center justify-center gap-6">
                                        <button
                                            onClick={() => setGuests(Math.max(1, guests - 1))}
                                            className="w-12 h-12 border border-gray-200 flex items-center justify-center hover:bg-olive-600 hover:text-white hover:border-olive-600 transition-all text-xl"
                                        >
                                            −
                                        </button>
                                        <span className="text-3xl font-display text-gray-900 w-12 text-center">{guests}</span>
                                        <button
                                            onClick={() => setGuests(Math.min(villa.max_guests, guests + 1))}
                                            className="w-12 h-12 border border-gray-200 flex items-center justify-center hover:bg-olive-600 hover:text-white hover:border-olive-600 transition-all text-xl"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className="text-center text-xs text-gray-400 mt-3">Maximum {villa.max_guests} guests</p>
                                </div>

                                {nights > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-olive-100 p-4 text-center"
                                    >
                                        <p className="text-olive-600 text-sm">Duration</p>
                                        <p className="text-2xl font-display text-olive-900">{nights} Night{nights > 1 ? 's' : ''}</p>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {/* Step 2: Guest Details */}
                        {currentStep === 'guests' && (
                            <motion.div
                                key="guests"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="text-center">
                                    <h3 className="font-display text-2xl text-gray-900 mb-2">Guest Information</h3>
                                    <p className="text-gray-500 text-sm">Enter your details</p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-500 mb-2">Full Name *</label>
                                        <div className="relative">
                                            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                value={guestName}
                                                onChange={(e) => setGuestName(e.target.value)}
                                                placeholder="Enter your full name"
                                                className="w-full pl-12 pr-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-500 mb-2">Email *</label>
                                        <div className="relative">
                                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                value={guestEmail}
                                                onChange={(e) => setGuestEmail(e.target.value)}
                                                placeholder="email@example.com"
                                                className="w-full pl-12 pr-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-500 mb-2">WhatsApp Number *</label>
                                        <div className="relative">
                                            <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={guestPhone}
                                                onChange={(e) => setGuestPhone(e.target.value)}
                                                placeholder="+62 812 3456 7890"
                                                className="w-full pl-12 pr-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-500 mb-2">Special Requests (Optional)</label>
                                        <textarea
                                            value={specialRequests}
                                            onChange={(e) => setSpecialRequests(e.target.value)}
                                            placeholder="E.g., Early check-in, dietary restrictions..."
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-200 focus:border-olive-600 outline-none transition-colors resize-none"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Review */}
                        {currentStep === 'review' && (
                            <motion.div
                                key="review"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="text-center">
                                    <h3 className="font-display text-2xl text-gray-900 mb-2">Review Your Booking</h3>
                                    <p className="text-gray-500 text-sm">Please verify your details</p>
                                </div>

                                <div className="bg-olive-100/50 p-5 space-y-4">
                                    <div>
                                        <p className="font-display text-lg text-gray-900">{villa.name}</p>
                                        <p className="text-gray-500 text-sm flex items-center gap-1">
                                            <MapPin size={12} /> {villa.location}
                                        </p>
                                    </div>

                                    <div className="border-t border-olive-200/50 pt-4 grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-400">Check-in</p>
                                            <p className="text-gray-900 font-medium">
                                                {checkIn && format(parseISO(checkIn), 'dd MMM yyyy')}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">Check-out</p>
                                            <p className="text-gray-900 font-medium">
                                                {checkOut && format(parseISO(checkOut), 'dd MMM yyyy')}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">Guests</p>
                                            <p className="text-gray-900 font-medium">{guests} person{guests > 1 ? 's' : ''}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">Duration</p>
                                            <p className="text-gray-900 font-medium">{nights} night{nights > 1 ? 's' : ''}</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-olive-200/50 pt-4 text-sm">
                                        <p className="text-gray-400 mb-1">Guest Name</p>
                                        <p className="text-gray-900 font-medium">{guestName}</p>
                                        <p className="text-gray-500 text-xs">{guestEmail} • {guestPhone}</p>
                                    </div>
                                </div>

                                {/* Promo Code Input */}
                                <div className="border border-olive-200 p-4">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Promo Code</p>
                                    {promoApplied ? (
                                        <div className="flex items-center justify-between bg-olive-100/50 p-3">
                                            <div className="flex items-center gap-2">
                                                <Tag size={16} className="text-olive-600" />
                                                <div>
                                                    <p className="font-medium text-olive-700">{promoApplied.name}</p>
                                                    <p className="text-xs text-olive-600">
                                                        {promoApplied.discount_type === 'percentage'
                                                            ? `${promoApplied.discount_value}% OFF`
                                                            : `${formatCurrency(promoApplied.discount_value)} OFF`
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={removePromo}
                                                className="text-xs text-red-500 hover:text-red-700"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                                placeholder="Masukkan kode promo"
                                                className="flex-1 px-3 py-2 border border-gray-200 focus:border-olive-600 outline-none text-sm font-mono uppercase"
                                            />
                                            <button
                                                onClick={validatePromoCode}
                                                disabled={promoLoading}
                                                className="px-4 py-2 bg-olive-600 text-white text-sm hover:bg-olive-700 disabled:opacity-50 flex items-center gap-1"
                                            >
                                                {promoLoading ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
                                            </button>
                                        </div>
                                    )}
                                    {promoError && (
                                        <p className="text-xs text-red-500 mt-2">{promoError}</p>
                                    )}
                                </div>

                                {/* Price Breakdown */}
                                <div className="border border-olive-200 p-5 space-y-3">
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <span>{formatCurrency(villa.price_per_night)} × {nights} night{nights > 1 ? 's' : ''}</span>
                                        <span>{formatCurrency(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <span>Service fee (5%)</span>
                                        <span>{formatCurrency(serviceFee)}</span>
                                    </div>
                                    {discountAmount > 0 && (
                                        <div className="flex justify-between text-green-600 text-sm">
                                            <span className="flex items-center gap-1">
                                                <Tag size={12} />
                                                Promo Discount
                                            </span>
                                            <span>-{formatCurrency(discountAmount)}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-olive-200 pt-3 flex justify-between text-lg">
                                        <span className="text-gray-900 font-medium">Total</span>
                                        <span className="font-display text-olive-900">{formatCurrency(totalPrice)}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4: Payment */}
                        {currentStep === 'payment' && (
                            <motion.div
                                key="payment"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="text-center">
                                    <h3 className="font-display text-2xl text-gray-900 mb-2">Payment Method</h3>
                                    <p className="text-gray-500 text-sm">Choose how to proceed</p>
                                </div>

                                <div className="space-y-3">
                                    <label className={`block p-5 border-2 cursor-pointer transition-all ${paymentMethod === 'whatsapp' ? 'border-olive-600 bg-olive-100/30' : 'border-gray-200 hover:border-olive-400'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="whatsapp"
                                            checked={paymentMethod === 'whatsapp'}
                                            onChange={() => setPaymentMethod('whatsapp')}
                                            className="hidden"
                                        />
                                        <div className="flex items-center">
                                            <div className={`w-12 h-12 flex items-center justify-center mr-4 ${paymentMethod === 'whatsapp' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                <MessageCircle size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">Chat via WhatsApp</p>
                                                <p className="text-sm text-gray-500">Continue booking via admin</p>
                                            </div>
                                            {paymentMethod === 'whatsapp' && (
                                                <div className="w-6 h-6 bg-olive-600 flex items-center justify-center">
                                                    <Check size={14} className="text-white" />
                                                </div>
                                            )}
                                        </div>
                                    </label>

                                    <label className={`block p-5 border-2 cursor-pointer transition-all ${paymentMethod === 'transfer' ? 'border-olive-600 bg-olive-100/30' : 'border-gray-200 hover:border-olive-400'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="transfer"
                                            checked={paymentMethod === 'transfer'}
                                            onChange={() => setPaymentMethod('transfer')}
                                            className="hidden"
                                        />
                                        <div className="flex items-center">
                                            <div className={`w-12 h-12 flex items-center justify-center mr-4 ${paymentMethod === 'transfer' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                <CreditCard size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">Bank Transfer</p>
                                                <p className="text-sm text-gray-500">BCA, Mandiri, BNI, BRI</p>
                                            </div>
                                            {paymentMethod === 'transfer' && (
                                                <div className="w-6 h-6 bg-olive-600 flex items-center justify-center">
                                                    <Check size={14} className="text-white" />
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                </div>

                                <div className="bg-olive-100 p-4 text-center">
                                    <p className="text-2xl font-display text-olive-900">{formatCurrency(totalPrice)}</p>
                                    <p className="text-olive-600 text-sm">Total Payment</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Confirmation */}
                        {currentStep === 'confirmation' && (
                            <motion.div
                                key="confirmation"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center py-6"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: 'spring' }}
                                    className="inline-flex p-5 bg-olive-100 mb-6"
                                >
                                    <Leaf size={32} className="text-olive-600" />
                                </motion.div>

                                <h3 className="font-display text-2xl text-gray-900 mb-2">Booking Successful!</h3>
                                <p className="text-gray-500 mb-6">
                                    ID: <span className="font-mono font-bold text-gray-900">{bookingId?.substring(0, 8).toUpperCase()}</span>
                                </p>

                                <div className="bg-olive-100/50 p-5 mb-6 text-left">
                                    <p className="font-display text-lg text-gray-900 mb-2">{villa.name}</p>
                                    <p className="text-sm text-gray-600">
                                        {checkIn && format(parseISO(checkIn), 'dd MMM')} - {checkOut && format(parseISO(checkOut), 'dd MMM yyyy')}
                                    </p>
                                    <p className="text-sm text-gray-600">{guests} guest{guests > 1 ? 's' : ''} • {nights} night{nights > 1 ? 's' : ''}</p>
                                    <p className="font-display text-xl text-olive-900 mt-3">{formatCurrency(totalPrice)}</p>
                                </div>

                                {paymentMethod === 'whatsapp' && (
                                    <button
                                        onClick={() => sendToWhatsApp(bookingId!)}
                                        className="w-full bg-green-500 text-white py-4 font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <MessageCircle size={20} />
                                        <span>Contact via WhatsApp</span>
                                    </button>
                                )}

                                {paymentMethod === 'transfer' && (
                                    <div className="bg-blue-50 p-5 text-left">
                                        <p className="font-medium text-blue-900 mb-3">Transfer to:</p>
                                        <div className="space-y-1 text-sm">
                                            <p><span className="text-gray-600">Bank:</span> <span className="font-medium">BCA</span></p>
                                            <p><span className="text-gray-600">Account:</span> <span className="font-mono font-medium">1234567890</span></p>
                                            <p><span className="text-gray-600">Name:</span> <span className="font-medium">PT StayinUBUD</span></p>
                                            <p><span className="text-gray-600">Amount:</span> <span className="font-medium text-gray-900">{formatCurrency(totalPrice)}</span></p>
                                        </div>
                                        <button
                                            onClick={() => sendToWhatsApp(bookingId!)}
                                            className="mt-4 w-full bg-green-500 text-white py-3 font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <MessageCircle size={18} />
                                            <span>Send Payment Proof</span>
                                        </button>
                                    </div>
                                )}

                                {onClose && (
                                    <button
                                        onClick={onClose}
                                        className="mt-4 w-full border border-gray-200 text-gray-900 py-3 font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Close
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Actions */}
                {currentStep !== 'confirmation' && (
                    <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={prevStep}
                                disabled={stepIndex === 0}
                                className={`flex items-center gap-2 px-4 py-3 font-medium transition-all ${stepIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-900 hover:bg-gray-200'
                                    }`}
                            >
                                <ChevronLeft size={18} />
                                <span>Back</span>
                            </button>

                            <button
                                onClick={nextStep}
                                disabled={!canProceed() || isLoading}
                                className={`flex items-center gap-2 px-6 py-3 font-medium transition-all ${canProceed()
                                    ? 'bg-olive-900 text-white hover:bg-olive-600'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : currentStep === 'payment' ? (
                                    <>
                                        <span>Confirm Booking</span>
                                        <Check size={18} />
                                    </>
                                ) : (
                                    <>
                                        <span>Continue</span>
                                        <ChevronRight size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    )
}
