import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe, PLAN_CREDITS } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendPaymentConfirmedEmail, sendSubscriptionCanceledEmail } from '@/lib/email'

// ============================================================
// Helpers
// ============================================================

/** Resolve plan key from Stripe Price ID */
async function resolvePlanFromPriceId(priceId: string): Promise<string> {
  if (priceId === process.env.STRIPE_PRICE_BASIC) return 'BASIC'
  if (priceId === process.env.STRIPE_PRICE_PRO) return 'PRO'
  if (priceId === process.env.STRIPE_PRICE_BUSINESS) return 'BUSINESS'
  return 'FREE'
}

/** Find userId from subscription metadata or DB lookup */
async function findUserId(
  metadata: Stripe.Metadata | null,
  stripeCustomerId?: string,
): Promise<string | null> {
  // Try metadata first
  if (metadata?.userId) return metadata.userId

  // Fallback: lookup by stripeCustomerId in subscriptions table
  if (stripeCustomerId) {
    const sub = await prisma.subscription.findFirst({
      where: { stripeCustomerId },
      select: { userId: true },
    })
    if (sub) return sub.userId
  }

  return null
}

// ============================================================
// Webhook event handlers
// ============================================================

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  if (!userId) {
    console.error('Webhook: checkout.session.completed missing userId in metadata')
    return
  }

  const subscriptionId = session.subscription as string
  const customerId = session.customer as string

  // Retrieve subscription to get price and period info
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const firstItem = subscription.items.data[0]
  const priceId = firstItem?.price.id
  if (!priceId) return

  const plan = await resolvePlanFromPriceId(priceId)
  const credits = PLAN_CREDITS[plan] ?? 5

  // Stripe v20: period dates are on subscription items, not subscription
  const periodStart = new Date((firstItem.current_period_start ?? subscription.start_date) * 1000)
  const periodEnd = new Date((firstItem.current_period_end ?? subscription.start_date) * 1000)

  // Transaction: update user plan + credits + upsert subscription
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { plan: plan as 'FREE' | 'BASIC' | 'PRO' | 'BUSINESS' },
    }),
    prisma.credits.upsert({
      where: { userId },
      update: { amount: credits, lastReset: new Date() },
      create: { userId, amount: credits },
    }),
    prisma.subscription.upsert({
      where: { userId },
      update: {
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        stripePriceId: priceId,
        plan: plan as 'FREE' | 'BASIC' | 'PRO' | 'BUSINESS',
        status: 'ACTIVE',
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
        canceledAt: null,
      },
      create: {
        userId,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        stripePriceId: priceId,
        plan: plan as 'FREE' | 'BASIC' | 'PRO' | 'BUSINESS',
        status: 'ACTIVE',
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
      },
    }),
  ])

  // Audit log (fire-and-forget)
  prisma.auditLog
    .create({
      data: {
        userId,
        action: 'PLAN_UPGRADED',
        details: { plan, priceId, subscriptionId, customerId },
      },
    })
    .catch((err: unknown) => console.error('Audit log failed:', err))

  // Payment confirmed email (fire-and-forget)
  const paidUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true },
  })
  if (paidUser) {
    sendPaymentConfirmedEmail(paidUser.name || 'Usuário', paidUser.email, plan, credits)
  }

  // Referral conversion: award bonus to referrer on first payment
  const pendingReferral = await prisma.referral.findFirst({
    where: { referredId: userId, status: 'PENDING' },
  })

  if (pendingReferral) {
    await prisma.$transaction([
      prisma.referral.update({
        where: { id: pendingReferral.id },
        data: { status: 'REWARDED', creditsAwarded: 10 },
      }),
      prisma.credits.update({
        where: { userId: pendingReferral.referrerId },
        data: { amount: { increment: 10 } },
      }),
    ])

    prisma.auditLog
      .create({
        data: {
          userId: pendingReferral.referrerId,
          action: 'REFERRAL_CONVERTED',
          details: {
            referralId: pendingReferral.id,
            referredUserId: userId,
            creditsAwarded: 10,
          },
        },
      })
      .catch((err: unknown) => console.error('Audit log failed:', err))
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = await findUserId(
    subscription.metadata,
    subscription.customer as string,
  )
  if (!userId) return

  const firstItem = subscription.items.data[0]
  const priceId = firstItem?.price.id
  if (!priceId) return

  const plan = await resolvePlanFromPriceId(priceId)
  const credits = PLAN_CREDITS[plan] ?? 5

  const status = subscription.cancel_at_period_end
    ? 'CANCELED'
    : subscription.status === 'active'
      ? 'ACTIVE'
      : subscription.status === 'past_due'
        ? 'PAST_DUE'
        : 'PAUSED'

  const periodStart = new Date((firstItem.current_period_start ?? subscription.start_date) * 1000)
  const periodEnd = new Date((firstItem.current_period_end ?? subscription.start_date) * 1000)

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { plan: plan as 'FREE' | 'BASIC' | 'PRO' | 'BUSINESS' },
    }),
    prisma.credits.update({
      where: { userId },
      data: { amount: credits },
    }),
    prisma.subscription.update({
      where: { userId },
      data: {
        stripePriceId: priceId,
        plan: plan as 'FREE' | 'BASIC' | 'PRO' | 'BUSINESS',
        status,
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
        canceledAt: subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000)
          : null,
      },
    }),
  ])

  prisma.auditLog
    .create({
      data: { userId, action: 'PLAN_UPGRADED', details: { plan, status, priceId } },
    })
    .catch((err: unknown) => console.error('Audit log failed:', err))
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = await findUserId(
    subscription.metadata,
    subscription.customer as string,
  )
  if (!userId) return

  // Fetch user info before downgrading
  const canceledUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, plan: true },
  })

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { plan: 'FREE' },
    }),
    prisma.credits.update({
      where: { userId },
      data: { amount: 5 },
    }),
    prisma.subscription.update({
      where: { userId },
      data: {
        status: 'CANCELED',
        canceledAt: new Date(),
      },
    }),
  ])

  prisma.auditLog
    .create({
      data: {
        userId,
        action: 'PLAN_CANCELED',
        details: { previousPlan: subscription.metadata?.planId },
      },
    })
    .catch((err: unknown) => console.error('Audit log failed:', err))

  // Subscription canceled email (fire-and-forget)
  if (canceledUser) {
    sendSubscriptionCanceledEmail(
      canceledUser.name || 'Usuário',
      canceledUser.email,
      canceledUser.plan,
    )
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  // Only handle recurring payments (not the first one)
  if (invoice.billing_reason !== 'subscription_cycle') return

  const customerId = invoice.customer as string
  const userId = await findUserId(null, customerId)
  if (!userId) return

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  })
  if (!user) return

  const credits = PLAN_CREDITS[user.plan] ?? 5

  await prisma.credits.update({
    where: { userId },
    data: { amount: credits, lastReset: new Date() },
  })

  prisma.auditLog
    .create({
      data: {
        userId,
        action: 'CREDITS_RESET',
        details: { credits, plan: user.plan, invoiceId: invoice.id },
      },
    })
    .catch((err: unknown) => console.error('Audit log failed:', err))
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string
  const userId = await findUserId(null, customerId)
  if (!userId) return

  await prisma.subscription.updateMany({
    where: { userId, status: 'ACTIVE' },
    data: { status: 'PAST_DUE' },
  })

  prisma.auditLog
    .create({
      data: {
        userId,
        action: 'PAYMENT_FAILED',
        details: { invoiceId: invoice.id, amount: invoice.amount_due },
      },
    })
    .catch((err: unknown) => console.error('Audit log failed:', err))
}

// ============================================================
// POST /api/webhooks/stripe
// ============================================================

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header.' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break
      default:
        // Unhandled event type — ignore
        break
    }
  } catch (error) {
    console.error(`Webhook handler error for ${event.type}:`, error)
    return NextResponse.json({ error: 'Webhook handler failed.' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
