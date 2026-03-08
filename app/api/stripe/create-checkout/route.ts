import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe, PLAN_PRICES } from '@/lib/stripe'

const VALID_PLANS = ['BASIC', 'PRO', 'BUSINESS'] as const

export async function POST(request: Request) {
  try {
    // 1. Authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
    }

    // 2. Validate planId
    const body = await request.json()
    const { planId } = body as { planId?: string }

    if (!planId || !VALID_PLANS.includes(planId as (typeof VALID_PLANS)[number])) {
      return NextResponse.json(
        { error: 'Plano inválido. Escolha BASIC, PRO ou BUSINESS.' },
        { status: 400 },
      )
    }

    // 3. Check if user already has active subscription for same plan
    const existingSub = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    if (existingSub && existingSub.status === 'ACTIVE' && existingSub.plan === planId) {
      return NextResponse.json(
        { error: 'Você já possui uma assinatura ativa deste plano.' },
        { status: 400 },
      )
    }

    // 4. Create Stripe Checkout Session
    const priceId = PLAN_PRICES[planId]
    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID não configurado para este plano.' },
        { status: 500 },
      )
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/dashboard?success=true`,
      cancel_url: `${baseUrl}/dashboard?canceled=true`,
      metadata: {
        userId: session.user.id,
        planId,
      },
      subscription_data: {
        metadata: {
          userId: session.user.id,
          planId,
        },
      },
    })

    // 5. Return checkout URL
    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Create checkout error:', error)
    return NextResponse.json(
      { error: 'Erro ao criar sessão de pagamento. Tente novamente.' },
      { status: 500 },
    )
  }
}
