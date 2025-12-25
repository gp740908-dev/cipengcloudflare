/**
 * Dynamic component imports for code splitting
 * These components are loaded on-demand to reduce initial bundle size
 * 
 * Add imports here as you create components
 */

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/Skeleton'

// Booking flow - already exists
export const ModernBookingFlow = dynamic(
    () => import('@/components/ModernBookingFlow'),
    {
        loading: () => (
            <div className="min-h-screen flex items-center justify-center">
                <div className="space-y-4 w-full max-w-2xl px-4">
                    <Skeleton height={60} />
                    <Skeleton height={400} />
                </div>
            </div>
        ),
        ssr: false,
    }
)

/* 
 * TEMPLATES for future components:
 * Uncomment and use when you create these components
 * 
 * // Map component
 * export const VillaMap = dynamic(
 *     () => import('@/components/villas/VillaMap'),
 *     {
 *         loading: () => <Skeleton height={400} />,
 *         ssr: false,
 *     }
 * )
 * 
 * // Calendar
 * export const BookingCalendar = dynamic(
 *     () => import('@/components/BookingCalendar'),
 *     {
 *         loading: () => <Skeleton height={350} />,
 *         ssr: false,
 *     }
 * )
 */
