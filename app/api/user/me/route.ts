import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      credits: {
        select: { amount: true },
      },
      _count: {
        select: { conversions: true },
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
  }

  const maxCredits: Record<string, number> = {
    FREE: 5,
    BASIC: 50,
    PRO: 200,
    BUSINESS: 1000,
  }

  return NextResponse.json({
    ...user,
    creditsUsed: (maxCredits[user.plan] ?? 5) - (user.credits?.amount ?? 0),
    maxCredits: maxCredits[user.plan] ?? 5,
  })
}
