'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  CreditCard,
  Check,
  Loader2,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { PLAN_DETAILS } from '@/lib/stripe'
import type { PlanKey } from '@/lib/stripe'
import { PlanCard } from '@/components/pricing/PlanCard'
import { BillingHistory } from './BillingHistory'

// ============================================================
// Plan features (same as PlanCard)
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
// Types
// ============================================================

interface SubscriptionPanelProps {
  plan: string
  credits: number
  maxCredits: number
  lastReset: string | null
  subscription: {
    status: string
    currentPeriodEnd: string
    canceledAt: string | null
    plan: string
    stripeCustomerId: string
  } | null
}

// ============================================================
// Component
// ============================================================

export function SubscriptionPanel({
  plan,
  credits,
  maxCredits,
  lastReset,
  subscription,
}: SubscriptionPanelProps) {
  const [cancelLoading, setCancelLoading] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const [canceled, setCanceled] = useState(!!subscription?.canceledAt)

  const details = PLAN_DETAILS[plan as PlanKey]
  const features = PLAN_FEATURES[plan] ?? []
  const isFree = plan === 'FREE'
  const creditsPercent = maxCredits > 0 ? (credits / maxCredits) * 100 : 0

  // Days until next credit reset
  const daysUntilReset = lastReset
    ? Math.max(
        0,
        30 - Math.floor((Date.now() - new Date(lastReset).getTime()) / 86400000),
      )
    : null

  async function handleCancel() {
    setCancelLoading(true)
    try {
      const res = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Erro ao cancelar assinatura.')
        return
      }

      setCanceled(true)
      toast.success('Assinatura cancelada. Acesso mantido até o final do período.')
    } catch {
      toast.error('Erro de conexão. Tente novamente.')
    } finally {
      setCancelLoading(false)
    }
  }

  async function handlePortal() {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/create-portal', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Erro ao abrir portal.')
        return
      }

      window.location.href = data.url
    } catch {
      toast.error('Erro de conexão. Tente novamente.')
    } finally {
      setPortalLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <Card className="border-[#E5E7EB]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-[#111827]">
              <CreditCard className="h-5 w-5 text-[#0066CC]" />
              Seu Plano Atual
            </CardTitle>
            {!isFree && subscription?.status === 'ACTIVE' && !canceled && (
              <Badge className="bg-[#10B981]/10 text-[#10B981]">Ativo</Badge>
            )}
            {canceled && (
              <Badge className="bg-[#F59E0B]/10 text-[#F59E0B]">
                Cancelamento agendado
              </Badge>
            )}
            {subscription?.status === 'PAST_DUE' && (
              <Badge className="bg-[#EF4444]/10 text-[#EF4444]">
                Pagamento pendente
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plan name and price */}
          <div className="flex items-baseline justify-between">
            <div>
              <h3 className="text-2xl font-bold text-[#111827]">
                {details?.name ?? plan}
              </h3>
              <p className="text-sm text-[#4B5563]">
                {isFree
                  ? 'Plano gratuito'
                  : `R$ ${details?.price ?? 0}/mês`}
              </p>
            </div>
          </div>

          {/* Features */}
          <ul className="space-y-2">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm text-[#4B5563]"
              >
                <Check className="h-4 w-4 shrink-0 text-[#10B981]" />
                {feature}
              </li>
            ))}
          </ul>

          {/* Next billing */}
          {subscription && !isFree && (
            <div className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4">
              <p className="text-sm text-[#4B5563]">
                {canceled ? 'Acesso até:' : 'Próxima cobrança:'}
              </p>
              <p className="text-sm font-medium text-[#111827]">
                {new Date(subscription.currentPeriodEnd).toLocaleDateString(
                  'pt-BR',
                  { day: '2-digit', month: 'long', year: 'numeric' },
                )}
              </p>
            </div>
          )}

          {/* Credits */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#4B5563]">Créditos disponíveis</span>
              <span className="font-medium text-[#111827]">
                {credits}/{maxCredits}
              </span>
            </div>
            <Progress
              value={creditsPercent}
              className="h-2 bg-[#E5E7EB]"
            />
            {daysUntilReset !== null && (
              <p className="text-xs text-[#4B5563]">
                Reset em {daysUntilReset} dia{daysUntilReset !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Cancellation warning */}
          {canceled && (
            <div className="flex items-start gap-2 rounded-lg border border-[#F59E0B]/30 bg-[#F59E0B]/5 p-4">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#F59E0B]" />
              <p className="text-sm text-[#4B5563]">
                Sua assinatura foi cancelada. Você manterá acesso ao plano{' '}
                <strong>{details?.name}</strong> até o final do período atual.
                Após isso, será movido para o plano Gratuito.
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            {/* Change Plan Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-[#0066CC] hover:bg-[#0052A3]">
                  {isFree ? 'Fazer Upgrade' : 'Alterar Plano'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle className="text-[#111827]">
                    Escolha seu plano
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4 sm:grid-cols-2 lg:grid-cols-4">
                  {(['FREE', 'BASIC', 'PRO', 'BUSINESS'] as const).map(
                    (key) => (
                      <PlanCard
                        key={key}
                        planKey={key}
                        currentPlan={plan}
                        highlighted={key === 'PRO'}
                      />
                    ),
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Cancel button (only for active paid subscriptions) */}
            {!isFree && !canceled && subscription?.status === 'ACTIVE' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/5">
                    Cancelar Assinatura
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-[#111827]">
                      Cancelar assinatura?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Ao cancelar, você manterá acesso ao plano{' '}
                      <strong>{details?.name}</strong> até{' '}
                      <strong>
                        {new Date(
                          subscription.currentPeriodEnd,
                        ).toLocaleDateString('pt-BR')}
                      </strong>
                      . Após isso, será movido para o plano Gratuito com 5
                      créditos por mês.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Manter Plano</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancel}
                      disabled={cancelLoading}
                      className="bg-[#EF4444] hover:bg-[#EF4444]/90"
                    >
                      {cancelLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Cancelando...
                        </>
                      ) : (
                        'Confirmar Cancelamento'
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {/* Stripe Portal link */}
            {!isFree && subscription && (
              <Button
                variant="outline"
                onClick={handlePortal}
                disabled={portalLoading}
                className="border-[#E5E7EB] text-[#4B5563]"
              >
                {portalLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Abrindo...
                  </>
                ) : (
                  <>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Gerenciar no Stripe
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="border-[#E5E7EB]">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#111827]">
            Histórico de Faturas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BillingHistory
            stripeCustomerId={subscription?.stripeCustomerId ?? null}
          />
        </CardContent>
      </Card>
    </div>
  )
}
