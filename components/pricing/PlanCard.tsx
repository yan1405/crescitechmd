'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { PLAN_DETAILS } from '@/lib/stripe'
import type { PlanKey } from '@/lib/stripe'

// ============================================================
// Plan features
// ============================================================

const PLAN_FEATURES: Record<string, string[]> = {
  FREE: [
    '5 conversões por mês',
    'Arquivos até 5 MB',
    'Formatos básicos',
    'Histórico permanente',
  ],
  BASIC: [
    '50 conversões por mês',
    'Arquivos até 10 MB',
    'Todos os formatos',
    'Histórico permanente',
  ],
  PRO: [
    '200 conversões por mês',
    'Arquivos até 20 MB',
    'Todos os formatos',
    'Histórico permanente',
    'Suporte em até 24h',
  ],
  BUSINESS: [
    '1000 conversões por mês',
    'Arquivos até 50 MB',
    'Todos os formatos',
    'Histórico permanente',
    'Suporte prioritário',
  ],
}

// ============================================================
// Component
// ============================================================

interface PlanCardProps {
  planKey: string
  currentPlan: string
  highlighted?: boolean
}

export function PlanCard({ planKey, currentPlan, highlighted = false }: PlanCardProps) {
  const [loading, setLoading] = useState(false)

  const details = PLAN_DETAILS[planKey as PlanKey]
  if (!details) return null

  const features = PLAN_FEATURES[planKey] ?? []
  const isCurrent = planKey === currentPlan
  const isFree = planKey === 'FREE'

  async function handleSubscribe() {
    if (isCurrent || isFree) return

    setLoading(true)
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: planKey }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Erro ao iniciar pagamento.')
        return
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch {
      toast.error('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const buttonLabel = isCurrent
    ? 'Plano Atual'
    : isFree
      ? 'Plano Gratuito'
      : `Assinar ${details.name}`

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-xl border p-6',
        highlighted
          ? 'border-[#0066CC] shadow-lg ring-1 ring-[#0066CC]'
          : 'border-[#E5E7EB] shadow-sm',
      )}
    >
      {highlighted && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0066CC] text-white">
          Popular
        </Badge>
      )}

      {isCurrent && (
        <Badge className="absolute -top-3 right-4 bg-[#10B981] text-white">
          Plano Atual
        </Badge>
      )}

      <h3 className="text-lg font-semibold text-[#111827]">{details.name}</h3>

      <div className="mt-4">
        <span className="text-3xl font-bold text-[#111827]">
          R$ {details.price}
        </span>
        <span className="text-sm text-[#4B5563]">/mês</span>
      </div>

      <ul className="mt-6 flex-1 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-[#4B5563]">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]" />
            {feature}
          </li>
        ))}
      </ul>

      <Button
        onClick={handleSubscribe}
        disabled={isCurrent || isFree || loading}
        className={cn(
          'mt-6 w-full',
          highlighted
            ? 'bg-[#0066CC] hover:bg-[#0052A3]'
            : 'bg-[#111827] hover:bg-[#111827]/90',
          isCurrent && 'bg-[#10B981] hover:bg-[#10B981]/90',
        )}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Redirecionando...
          </>
        ) : (
          buttonLabel
        )}
      </Button>
    </div>
  )
}
