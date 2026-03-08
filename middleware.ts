import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'

const { auth } = NextAuth(authConfig)

export default auth

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/convert/:path*',
    '/history/:path*',
    '/settings/:path*',
    '/referral/:path*',
    '/admin/:path*',
    '/login',
    '/signup',
  ],
}
