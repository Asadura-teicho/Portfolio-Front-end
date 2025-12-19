// import { NextResponse } from 'next/server'

// export function middleware(request) {
//   const { pathname } = request.nextUrl

//   // Protect admin routes (except login page)
//   if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
//     // Check for admin authentication in cookies or headers
//     // For client-side auth, we'll handle it in the component
//     // This middleware can be extended to check server-side tokens
//     return NextResponse.next()
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     '/((?!api|_next/static|_next/image|favicon.ico).*)',
//   ],
// }

// import { NextResponse } from 'next/server'

// export function middleware(request) {
//   const token = request.cookies.get('accessToken')
//   const isAdmin = request.cookies.get('isAdmin')?.value === 'true'
//   const url = request.nextUrl.clone()

//   // If trying to access admin and not an admin, send to login
//   if (url.pathname.startsWith('/admin') && !isAdmin) {
//     return NextResponse.redirect(new URL('/auth/login', request.url))
//   }

//   // If no token and trying to access dashboard
//   if (url.pathname.startsWith('/dashboard') && !token) {
//     return NextResponse.redirect(new URL('/auth/login', request.url))
//   }
// }



// ------------------------------------------------------------------------------

// import { NextResponse } from 'next/server'

// export function middleware(request) {
//   const token = request.cookies.get('accessToken')?.value
//   const isAdmin = request.cookies.get('isAdmin')?.value === 'true'
//   const url = request.nextUrl.clone()

//   const nextParam = encodeURIComponent(`${url.pathname}${url.search}`)

//   // Protect admin routes
//   if (url.pathname.startsWith('/admin')) {
//     // Not logged in
//     if (!token) {
//       return NextResponse.redirect(new URL(`/auth/login?next=${nextParam}`, request.url))
//     }

//     // Logged in but not admin
//     if (!isAdmin) {
//       return NextResponse.redirect(new URL('/dashboard', request.url))
//     }
//   }

//   // Protect dashboard routes
//   if (url.pathname.startsWith('/dashboard') && !token) {
//     return NextResponse.redirect(new URL(`/auth/login?next=${nextParam}`, request.url))
//   }

//   return NextResponse.next()
// }

// // Match all pages except API/static
// export const config = {
//   matcher: [
//     '/((?!api|_next/static|_next/image|favicon.ico).*)',
//   ],
// }
import { NextResponse } from 'next/server'

export function middleware(request) {
  // Use optional chaining and default values
  const token = request.cookies.get('accessToken')?.value || null
  const isAdmin = request.cookies.get('isAdmin')?.value === 'true'

  const url = request.nextUrl.clone()
  const nextParam = encodeURIComponent(`${url.pathname}${url.search}`)

  // Admin routes
  if (url.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL(`/auth/login?next=${nextParam}`, request.url))
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Dashboard routes
  if (url.pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL(`/auth/login?next=${nextParam}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
