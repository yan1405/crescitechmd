import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export async function GET() {
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
      return NextResponse.json({ invoices: [] })
    }

    const stripeInvoices = await stripe.invoices.list({
      customer: subscription.stripeCustomerId,
      limit: 10,
    })

    const invoices = stripeInvoices.data.map((invoice) => ({
      id: invoice.id,
      number: invoice.number,
      date: invoice.created
        ? new Date(invoice.created * 1000).toISOString()
        : null,
      amount: invoice.amount_paid ?? 0,
      status: invoice.status,
      pdfUrl: invoice.invoice_pdf,
    }))

    return NextResponse.json({ invoices })
  } catch (error) {
    console.error('List invoices error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar faturas.' },
      { status: 500 },
    )
  }
}
