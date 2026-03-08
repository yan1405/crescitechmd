'use client'

import { useEffect, useState } from 'react'
import { DollarSign, Users, FileText, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface KPIs {
  mrr: number
  totalUsers: number
  conversionsToday: number
  conversionRate: number
}

interface MetricsData {
  kpis: KPIs
  chartData: ChartPoint[]
  planDistribution: Record<string, number>
}

interface ChartPoint {
  date: string
  newUsers: number
  totalConversions: number
  mrr: number
}

interface MetricsCardsProps {
  onDataLoaded?: (data: MetricsData) => void
}

export function MetricsCards({ onDataLoaded }: MetricsCardsProps) {
  const [kpis, setKpis] = useState<KPIs | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/metrics')
      .then((res) => res.json())
      .then((data: MetricsData) => {
        setKpis(data.kpis)
        onDataLoaded?.(data)
      })
      .catch(() => setKpis(null))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cards = [
    {
      title: 'MRR',
      value: kpis ? `R$ ${kpis.mrr.toLocaleString('pt-BR')}` : '—',
      icon: DollarSign,
      color: '#10B981',
    },
    {
      title: 'Total Usuários',
      value: kpis?.totalUsers ?? '—',
      icon: Users,
      color: '#0066CC',
    },
    {
      title: 'Conversões Hoje',
      value: kpis?.conversionsToday ?? '—',
      icon: FileText,
      color: '#F59E0B',
    },
    {
      title: 'Taxa de Conversão',
      value: kpis ? `${kpis.conversionRate}%` : '—',
      icon: TrendingUp,
      color: '#8B5CF6',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="border-[#E5E7EB]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#4B5563]">
              {card.title}
            </CardTitle>
            <card.icon
              className="h-4 w-4"
              style={{ color: card.color }}
            />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-[#111827]">
                {card.value}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export type { MetricsData, ChartPoint }
