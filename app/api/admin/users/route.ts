import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/app/generated/prisma/client'

const ITEMS_PER_PAGE = 10

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
    }
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, Number(searchParams.get('page') ?? '1'))
    const plan = searchParams.get('plan')
    const search = searchParams.get('search')

    // Build where clause
    const where: Prisma.UserWhereInput = {}

    if (plan && ['FREE', 'BASIC', 'PRO', 'BUSINESS'].includes(plan)) {
      where.plan = plan as Prisma.UserWhereInput['plan']
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          plan: true,
          role: true,
          createdAt: true,
          credits: { select: { amount: true } },
          subscription: { select: { status: true } },
          _count: { select: { conversions: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
      }),
      prisma.user.count({ where }),
    ])

    const serializedUsers = users.map((u) => ({
      ...u,
      createdAt: u.createdAt.toISOString(),
    }))

    return NextResponse.json({
      users: serializedUsers,
      total,
      page,
      totalPages: Math.ceil(total / ITEMS_PER_PAGE),
    })
  } catch (error) {
    console.error('Admin users error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar usuários.' },
      { status: 500 },
    )
  }
}
