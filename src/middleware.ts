import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth')?.value
  const { pathname } = request.nextUrl

  // Lista stron publicznych (dostęp bez logowania)
  const publicPaths = ['/', '/login', '/register']

  // Jeśli ścieżka jest publiczna – przepuszczamy
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // Jeśli brak tokena – przekierowanie na login
  if (!token) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/'
    return NextResponse.redirect(loginUrl)
  }

  // Token jest, przepuszczamy dalej
  return NextResponse.next()
}
export const config = {
  matcher: [
    // Wszystkie strony (oprócz API, _next itp.)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
