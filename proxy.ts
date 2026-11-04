import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })

          response = NextResponse.next({
            request,
          })

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isLoginPage = pathname === '/admin/login'
  const isAdminRoute = pathname.startsWith('/admin')

  // Helper to preserve updated session cookies on any redirect or error response
  const withCookies = (targetResponse: NextResponse) => {
    response.cookies.getAll().forEach((cookie) => {
      targetResponse.cookies.set(cookie.name, cookie.value, cookie)
    })
    return targetResponse
  }

  // 1. طلبات غير المسجلين لمحاولة الوصول إلى لوحة الإدارة
  if (isAdminRoute && !isLoginPage && !user) {
    // إذا كان الطلب استدعاء Server Action، نرفضه بـ 401 لحماية الإجراءات وعدم كسر بروتوكول Actions
    if (request.headers.has('next-action')) {
      return withCookies(new NextResponse('Unauthorized', { status: 401 }))
    }

    // لطلبات التصفح العادية، تحويل آمن إلى صفحة تسجيل الدخول مع الحفاظ على الكوكيز
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return withCookies(NextResponse.redirect(url))
  }

  // 2. إذا كان المستخدم مسجلاً بالفعل ويحاول فتح صفحة تسجيل الدخول عبر المتصفح (GET)
  if (isLoginPage && user && request.method === 'GET') {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return withCookies(NextResponse.redirect(url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}