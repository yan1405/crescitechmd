'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ChartPoint } from './MetricsCards'

interface ChartsProps {
  data: ChartPoint[]
}

export function Charts({ data }: ChartsProps) {
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    }),
  }))

  if (formatted.length === 0) {
    return (
      <Card className="border-[#E5E7EB]">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#111827]">
            Crescimento - Últimos 30 dias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center text-sm text-[#4B5563]">
            Sem dados de métricas diárias ainda.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-[#E5E7EB]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#111827]">
          Crescimento - Últimos 30 dias
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formatted}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: '#4B5563' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#4B5563' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid #E5E7EB',
                  fontSize: 13,
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 13 }}
              />
              <Line
                type="monotone"
                dataKey="newUsers"
                name="Novos Usuários"
                stroke="#0066CC"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="totalConversions"
                name="Conversões"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
