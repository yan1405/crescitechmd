'use client'

import { useState } from 'react'
import { MetricsCards } from '@/components/admin/MetricsCards'
import { Charts } from '@/components/admin/Charts'
import { UserTable } from '@/components/admin/UserTable'
import type { MetricsData, ChartPoint } from '@/components/admin/MetricsCards'

export default function AdminPage() {
  const [chartData, setChartData] = useState<ChartPoint[]>([])

  function handleMetricsLoaded(data: MetricsData) {
    setChartData(data.chartData)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#111827]">
          Painel Administrativo
        </h1>
        <p className="mt-1 text-sm text-[#4B5563]">
          Visão geral da plataforma
        </p>
      </div>

      <MetricsCards onDataLoaded={handleMetricsLoaded} />
      <Charts data={chartData} />
      <UserTable />
    </div>
  )
}
