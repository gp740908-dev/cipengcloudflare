'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isWithinInterval, parseISO, isBefore, startOfDay } from 'date-fns'
import { id } from 'date-fns/locale'

interface AvailabilityCalendarProps {
    villaId: string
}

interface BookedDate {
    check_in: string
    check_out: string
    status: string
}

export default function AvailabilityCalendar({ villaId }: AvailabilityCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [bookedDates, setBookedDates] = useState<BookedDate[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchBookings()
    }, [villaId])

    async function fetchBookings() {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select('check_in, check_out, status')
                .eq('villa_id', villaId)
                .in('status', ['pending', 'confirmed'])

            if (error) throw error
            setBookedDates(data || [])
        } catch (error) {
            console.error('Error fetching bookings:', error)
        } finally {
            setLoading(false)
        }
    }

    const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

    // Add empty cells for days before month starts
    const startDay = monthStart.getDay()
    const emptyDays = Array(startDay).fill(null)

    const isDateBooked = (date: Date) => {
        return bookedDates.some(booking => {
            const checkIn = parseISO(booking.check_in)
            const checkOut = parseISO(booking.check_out)
            return isWithinInterval(date, { start: checkIn, end: checkOut })
        })
    }

    const getBookingStatus = (date: Date) => {
        const booking = bookedDates.find(b => {
            const checkIn = parseISO(b.check_in)
            const checkOut = parseISO(b.check_out)
            return isWithinInterval(date, { start: checkIn, end: checkOut })
        })
        return booking?.status || null
    }

    const isPastDate = (date: Date) => {
        return isBefore(date, startOfDay(new Date()))
    }

    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

    return (
        <div className="border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl text-gray-900 flex items-center gap-2">
                    <Calendar size={20} className="text-olive-600" />
                    Availability
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={prevMonth}
                        className="p-2 hover:bg-gray-100 transition-colors"
                        aria-label="Previous month"
                    >
                        <ChevronLeft size={18} className="text-gray-600" />
                    </button>
                    <span className="text-sm font-medium text-gray-700 min-w-[140px] text-center">
                        {format(currentMonth, 'MMMM yyyy', { locale: id })}
                    </span>
                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-gray-100 transition-colors"
                        aria-label="Next month"
                    >
                        <ChevronRight size={18} className="text-gray-600" />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="h-64 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-olive-600 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    {/* Days of Week */}
                    <div className="grid grid-cols-7 mb-2">
                        {daysOfWeek.map(day => (
                            <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {emptyDays.map((_, index) => (
                            <div key={`empty-${index}`} className="aspect-square" />
                        ))}
                        {days.map((day, index) => {
                            const isBooked = isDateBooked(day)
                            const status = getBookingStatus(day)
                            const isPast = isPastDate(day)
                            const isToday = isSameDay(day, new Date())
                            const staggerClass = index < 14 ? `stagger-${(index % 7) + 1}` : ''

                            return (
                                <div
                                    key={day.toISOString()}
                                    className={`
                                        aspect-square flex items-center justify-center text-sm relative animate-scale-in ${staggerClass}
                                        ${isPast ? 'text-gray-300' : 'text-gray-700'}
                                        ${isBooked && status === 'confirmed' ? 'bg-red-100 text-red-700' : ''}
                                        ${isBooked && status === 'pending' ? 'bg-amber-100 text-amber-700' : ''}
                                        ${!isBooked && !isPast ? 'bg-olive-50 text-olive-700 hover:bg-olive-100' : ''}
                                        ${isToday ? 'ring-2 ring-olive-600' : ''}
                                    `}
                                >
                                    {format(day, 'd')}
                                </div>
                            )
                        })}
                    </div>

                    {/* Legend */}
                    <div className="mt-6 flex flex-wrap gap-4 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-olive-50 border border-olive-200" />
                            <span className="text-gray-600">Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-100 border border-red-200" />
                            <span className="text-gray-600">Booked</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-amber-100 border border-amber-200" />
                            <span className="text-gray-600">Pending</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-gray-100 border border-gray-200" />
                            <span className="text-gray-600">Past</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
