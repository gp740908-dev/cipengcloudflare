import { useEffect, useRef, useCallback } from 'react'

/**
 * Debounce function - delays execution until after wait time has passed
 * Use for: search inputs, resize handlers, API calls
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null
            func(...args)
        }

        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

/**
 * Throttle function - limits execution to once per wait time
 * Use for: scroll handlers, mouse move, window resize
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args)
            inThrottle = true
            setTimeout(() => (inThrottle = false), limit)
        }
    }
}

/**
 * React hook for debounced value
 * Example: const debouncedSearchTerm = useDebounce(searchTerm, 500)
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}

/**
 * React hook for throttled callback
 * Example: const handleScroll = useThrottle(() => {...}, 100)
 */
export function useThrottle<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
): T {
    const lastRun = useRef(Date.now())

    return useCallback(
        ((...args) => {
            const now = Date.now()
            if (now - lastRun.current >= delay) {
                callback(...args)
                lastRun.current = now
            }
        }) as T,
        [callback, delay]
    )
}

/**
 * Request Animation Frame throttle for smooth 60fps animations
 * Use for: scroll animations, parallax effects
 */
export function rafThrottle<T extends (...args: any[]) => any>(callback: T): T {
    let rafId: number | null = null

    return ((...args: Parameters<T>) => {
        if (rafId) return

        rafId = requestAnimationFrame(() => {
            callback(...args)
            rafId = null
        })
    }) as T
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver(
    elementRef: React.RefObject<Element>,
    options?: IntersectionObserverInit
) {
    const [isIntersecting, setIsIntersecting] = React.useState(false)
    const [hasIntersected, setHasIntersected] = React.useState(false)

    useEffect(() => {
        const element = elementRef.current
        if (!element) return

        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting)
            if (entry.isIntersecting && !hasIntersected) {
                setHasIntersected(true)
            }
        }, options)

        observer.observe(element)

        return () => observer.disconnect()
    }, [elementRef, options, hasIntersected])

    return { isIntersecting, hasIntersected }
}

// Fix React import
import React from 'react'
