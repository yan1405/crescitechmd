'use client'

import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Zap } from 'lucide-react'
import Link from 'next/link'

interface CreditsDisplayProps {
  amount: number
  maxCredits: number
  plan: string
}

export function CreditsDisplay({ amount, maxCredits, plan }: CreditsDisplayProps) {
  const percentage = maxCredits > 0 ? (amount / maxCredits) * 100 : 0
  const isLow = percentage <= 20

  return (
    <Card className="border-[#E5E7EB]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-[#4B5563]">
          Créditos Disponíveis
        </CardTitle>
        <Zap className={`h-4 w-4 ${isLow ? 'text-[#F59E0B]' : 'text-[#0066CC]'}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-[#111827]">
          {amount}
          <span className="text-sm font-normal text-[#4B5563]">/{maxCredits}</span>
        </div>
        <Progress
          value={percentage}
          className="mt-3 h-2"
        />
        {isLow && plan !== 'BUSINESS' && (
          <Button asChild size="sm" className="mt-3 w-full bg-[#0066CC] hover:bg-[#0052A3]">
            <Link href="/settings">Upgrade</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
