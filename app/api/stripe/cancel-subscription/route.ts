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
    })

    if (!subscription || subscription.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Nenhuma assinatura ativa encontrada.' },
        { status: 400 },
      )
    }

    // Cancel at end of billing period (not immediate)
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    })

    await prisma.subscription.update({
      where: { userId: session.user.id },
      data: { canceledAt: new Date() },
    })

    // Audit log (fire-and-forget)
    prisma.auditLog
      .create({
        data: {
          userId: session.user.id,
          action: 'PLAN_CANCELED',
          details: {
            plan: subscription.plan,
            accessUntil: subscription.currentPeriodEnd.toISOString(),
          },
        },
      })
      .catch((err: unknown) => console.error('Audit log failed:', err))

    return NextResponse.json({
      success: true,
      accessUntil: subscription.currentPeriodEnd.toISOString(),
    })
  } catch (error) {
    console.error('Cancel subscription error:', error)
    return NextResponse.json(
      { error: 'Erro ao cancelar assinatura.' },
      { status: 500 },
    )
  }
}
