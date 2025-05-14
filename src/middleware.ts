import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const userId = request.cookies.get('userId')?.value
  const { pathname } = request.nextUrl

  // Lista stron publicznych (dostęp bez logowania)
  const publicPaths = ['/', '/login', '/register']

  // Jeśli ścieżka jest publiczna – przepuszczamy
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // Jeśli brak userId – przekierowanie na login
  if (!userId) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/'
    return NextResponse.redirect(loginUrl)
  }

  // Jest userId – przepuszczamy dalej
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Wszystkie strony (oprócz API, _next itp.)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
