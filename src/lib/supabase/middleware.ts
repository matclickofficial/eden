import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const isDemo = request.cookies.get('demo-session')?.value === 'true'
  
  let supabaseResponse = NextResponse.next({
    request,
  })

  // If demo session, bypass real auth entirely to prevent slowness from dead Supabase connection
  if (isDemo) {
    if (request.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/client/dashboard', request.url))
    }
    if (request.nextUrl.pathname.startsWith('/client')) {
      return supabaseResponse
    }
    // Also allow /apply-now and /online-status to bypass to client portal if in demo
    if (request.nextUrl.pathname === '/apply-now') {
      return NextResponse.redirect(new URL('/client/apply', request.url))
    }
    if (request.nextUrl.pathname === '/online-status') {
      return NextResponse.redirect(new URL('/client/status', request.url))
    }
  }

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

  const { data: { user } } = await supabase.auth.getUser()

  // Redirect authenticated users trying to access root to their specific dashboard
  if (user && request.nextUrl.pathname === '/') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'admin' || profile?.role === 'staff') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
    return NextResponse.redirect(new URL('/client/dashboard', request.url))
  }

  // Redirect /apply-now: logged in → /client/apply, else → /login?redirect=/client/apply
  if (request.nextUrl.pathname === '/apply-now') {
    if (user) {
      return NextResponse.redirect(new URL('/client/apply', request.url))
    }
    return NextResponse.redirect(new URL('/login?redirect=/client/apply', request.url))
  }

  // Redirect /online-status: logged in → /client/status, else → /login?redirect=/client/status
  if (request.nextUrl.pathname === '/online-status') {
    if (user) {
      return NextResponse.redirect(new URL('/client/status', request.url))
    }
    return NextResponse.redirect(new URL('/login?redirect=/client/status', request.url))
  }

  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin' && profile?.role !== 'staff') {
      return NextResponse.redirect(new URL('/client/dashboard', request.url))
    }
  }

  // Protect /client routes
  if (request.nextUrl.pathname.startsWith('/client')) {
    if (!user) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return supabaseResponse
}
