import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const PLAN_PRICE: Record<string, number> = {
  BASIC: 9,
  PRO: 19,
  BUSINESS: 39,
}

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
    }
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    thirtyDaysAgo.setHours(0, 0, 0, 0)

    // Run queries in parallel
    const [
      totalUsers,
      paidUsers,
      conversionsToday,
      planGroups,
      activeSubscriptions,
      chartData,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { plan: { not: 'FREE' } } }),
      prisma.conversion.count({
        where: { createdAt: { gte: today } },
      }),
      prisma.user.groupBy({
        by: ['plan'],
        _count: true,
      }),
      prisma.subscription.findMany({
        where: { status: 'ACTIVE' },
        select: { plan: true },
      }),
      prisma.dailyMetrics.findMany({
        where: { date: { gte: thirtyDaysAgo } },
        orderBy: { date: 'asc' },
      }),
    ])

    // Calculate MRR from active subscriptions
    const mrr = activeSubscriptions.reduce(
      (sum, sub) => sum + (PLAN_PRICE[sub.plan] ?? 0),
      0,
    )

    // Conversion rate (free → paid)
    const conversionRate =
      totalUsers > 0 ? Math.round((paidUsers / totalUsers) * 100) : 0

    // Plan distribution
    const planDistribution: Record<string, number> = {
      FREE: 0,
      BASIC: 0,
      PRO: 0,
      BUSINESS: 0,
    }
    for (const group of planGroups) {
      planDistribution[group.plan] = group._count
    }

    // Serialize chart data
    const serializedChart = chartData.map((d) => ({
      date: d.date.toISOString(),
      newUsers: d.newUsers,
      totalConversions: d.totalConversions,
      mrr: Number(d.mrr),
    }))

    return NextResponse.json({
      kpis: {
        mrr,
        totalUsers,
        conversionsToday,
        conversionRate,
      },
      chartData: serializedChart,
      planDistribution,
    })
  } catch (error) {
    console.error('Admin metrics error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar métricas.' },
      { status: 500 },
    )
  }
}
