import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Check if the path is an admin route (except login)
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
    const isLoginPage = request.nextUrl.pathname === '/admin/login'

    if (isAdminRoute && !isLoginPage) {
        const { data: { session } } = await supabase.auth.getSession()

        // No session - redirect to login
        if (!session) {
            const loginUrl = new URL('/admin/login', request.url)
            loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
            return NextResponse.redirect(loginUrl)
        }

        // Check if user is admin
        const { data: adminUser } = await supabase
            .from('admin_users')
            .select('id')
            .eq('email', session.user.email)
            .single()

        if (!adminUser) {
            // Not an admin - redirect to login with error
            const loginUrl = new URL('/admin/login', request.url)
            loginUrl.searchParams.set('error', 'not_admin')
            return NextResponse.redirect(loginUrl)
        }
    }

    // If on login page and already authenticated as admin, redirect to dashboard
    if (isLoginPage) {
        const { data: { session } } = await supabase.auth.getSession()

        if (session) {
            const { data: adminUser } = await supabase
                .from('admin_users')
                .select('id')
                .eq('email', session.user.email)
                .single()

            if (adminUser) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url))
            }
        }
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        '/admin/:path*',
    ],
}
