'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// Generate a unique visitor ID (persistent across sessions)
function getVisitorId(): string {
    if (typeof window === 'undefined') return ''

    let visitorId = localStorage.getItem('stayinubud_visitor_id')
    if (!visitorId) {
        visitorId = 'v_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
        localStorage.setItem('stayinubud_visitor_id', visitorId)
    }
    return visitorId
}

// Generate a session ID (unique per browser session)
function getSessionId(): string {
    if (typeof window === 'undefined') return ''

    let sessionId = sessionStorage.getItem('stayinubud_session_id')
    if (!sessionId) {
        sessionId = 's_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
        sessionStorage.setItem('stayinubud_session_id', sessionId)
    }
    return sessionId
}

// Detect device type
function getDeviceType(): string {
    if (typeof window === 'undefined') return 'unknown'

    const ua = navigator.userAgent
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return 'tablet'
    }
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return 'mobile'
    }
    return 'desktop'
}

// Get browser name
function getBrowser(): string {
    if (typeof window === 'undefined') return 'unknown'

    const ua = navigator.userAgent
    if (ua.includes('Firefox')) return 'Firefox'
    if (ua.includes('SamsungBrowser')) return 'Samsung Browser'
    if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera'
    if (ua.includes('Edge')) return 'Edge'
    if (ua.includes('Chrome')) return 'Chrome'
    if (ua.includes('Safari')) return 'Safari'
    return 'Other'
}

// Get OS name
function getOS(): string {
    if (typeof window === 'undefined') return 'unknown'

    const ua = navigator.userAgent
    if (ua.includes('Windows')) return 'Windows'
    if (ua.includes('Mac')) return 'macOS'
    if (ua.includes('Linux')) return 'Linux'
    if (ua.includes('Android')) return 'Android'
    if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS'
    return 'Other'
}

export default function AnalyticsTracker() {
    const pathname = usePathname()
    const startTime = useRef<number>(Date.now())
    const currentPath = useRef<string>('')

    useEffect(() => {
        // Skip admin pages
        if (pathname.startsWith('/admin')) return

        const supabase = createClient()

        async function trackPageView() {
            try {
                const visitorId = getVisitorId()
                const sessionId = getSessionId()
                const deviceType = getDeviceType()
                const browser = getBrowser()
                const os = getOS()

                await supabase.from('page_views').insert({
                    path: pathname,
                    page_title: document.title,
                    referrer: document.referrer || null,
                    user_agent: navigator.userAgent,
                    device_type: deviceType,
                    browser: browser,
                    os: os,
                    session_id: sessionId,
                    visitor_id: visitorId,
                })
            } catch (error) {
                // Silently fail - don't break user experience
                console.error('Analytics error:', error)
            }
        }

        // Track page view
        trackPageView()
        startTime.current = Date.now()
        currentPath.current = pathname

        // Cleanup function
        return () => {
            // Duration tracking could be added here with an API endpoint in the future
        }
    }, [pathname])

    // This component doesn't render anything
    return null
}
