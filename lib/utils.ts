import { format, differenceInDays, parseISO } from 'date-fns'

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

export function formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, 'MMM dd, yyyy')
}

export function calculateNights(checkIn: string | Date, checkOut: string | Date): number {
    const checkInDate = typeof checkIn === 'string' ? parseISO(checkIn) : checkIn
    const checkOutDate = typeof checkOut === 'string' ? parseISO(checkOut) : checkOut
    return differenceInDays(checkOutDate, checkInDate)
}

export function calculateTotalPrice(pricePerNight: number, checkIn: string | Date, checkOut: string | Date): number {
    const nights = calculateNights(checkIn, checkOut)
    return pricePerNight * nights
}

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
    // Basic phone validation - can be customized
    const phoneRegex = /^[\d\s\-+()]+$/
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ')
}
