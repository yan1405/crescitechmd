import type { NextAuthConfig } from 'next-auth'

// Base config shared between middleware (Edge) and server
// Does NOT import Prisma or bcrypt — Edge-safe
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isProtected =
        nextUrl.pathname.startsWith('/dashboard') ||
        nextUrl.pathname.startsWith('/convert') ||
        nextUrl.pathname.startsWith('/history') ||
        nextUrl.pathname.startsWith('/settings') ||
        nextUrl.pathname.startsWith('/referral') ||
        nextUrl.pathname.startsWith('/admin')

      if (isProtected && !isLoggedIn) {
        return Response.redirect(new URL('/login', nextUrl))
      }

      const isAuthPage =
        nextUrl.pathname.startsWith('/login') ||
        nextUrl.pathname.startsWith('/signup')
      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = (user as { role?: string }).role || 'USER'
        token.plan = (user as { plan?: string }).plan || 'FREE'
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        ;(session.user as { role: string }).role = token.role as string
        ;(session.user as { plan: string }).plan = token.plan as string
      }
      return session
    },
  },
  providers: [], // Providers added in full auth.ts
} satisfies NextAuthConfig
