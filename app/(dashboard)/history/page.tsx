import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ConversionList } from '@/components/history/ConversionList'
import type { Prisma } from '@/app/generated/prisma/client'

const ITEMS_PER_PAGE = 20

export const metadata = {
  title: 'Histórico | CrescitechMD',
}

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const params = await searchParams
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1)
  const format = params.format ?? 'all'
  const status = params.status ?? 'all'
  const search = params.search ?? ''

  // Build where clause
  const where: Prisma.ConversionWhereInput = {
    userId: session.user.id,
  }

  if (format !== 'all') {
    where.originalFormat = format as Prisma.ConversionWhereInput['originalFormat']
  }

  if (status !== 'all') {
    where.status = status as Prisma.ConversionWhereInput['status']
  }

  if (search) {
    where.originalFileName = { contains: search, mode: 'insensitive' }
  }

  // Fetch data
  const [conversions, total] = await prisma.$transaction([
    prisma.conversion.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.conversion.count({ where }),
  ])

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE))

  // Serialize dates for client component
  const serialized = conversions.map((c) => ({
    id: c.id,
    originalFileName: c.originalFileName,
    originalFormat: c.originalFormat,
    originalSize: c.originalSize,
    markdownUrl: c.markdownUrl,
    markdownSize: c.markdownSize,
    status: c.status,
    errorMessage: c.errorMessage,
    processingTime: c.processingTime,
    createdAt: c.createdAt.toISOString(),
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#111827]">
          Histórico de Conversões
        </h1>
        <p className="mt-1 text-sm text-[#4B5563]">
          Total: {total} conversão{total !== 1 ? 'ões' : ''}
        </p>
      </div>

      <ConversionList
        conversions={serialized}
        total={total}
        page={page}
        totalPages={totalPages}
        currentFormat={format}
        currentStatus={status}
        currentSearch={search}
      />
    </div>
  )
}
