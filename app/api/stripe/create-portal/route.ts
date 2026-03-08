import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export async function POST() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
      select: { stripeCustomerId: true },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'Nenhuma assinatura encontrada.' },
        { status: 404 },
      )
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${baseUrl}/settings`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error('Create portal error:', error)
    return NextResponse.json(
      { error: 'Erro ao abrir portal de pagamento.' },
      { status: 500 },
    )
  }
}
