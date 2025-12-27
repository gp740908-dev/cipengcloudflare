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
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
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

        // No session - redirect to login immediately
        if (!session) {
            const loginUrl = new URL('/admin/login', request.url)
            loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
            return NextResponse.redirect(loginUrl)
        }

        // Session exists - let the page handle admin verification
        // This avoids RLS issues in middleware
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        '/admin/:path*',
    ],
}
