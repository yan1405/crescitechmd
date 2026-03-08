'use client'

import { useEffect, useState } from 'react'
import { ExternalLink, FileText, Receipt } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface Invoice {
  id: string
  number: string | null
  date: string | null
  amount: number
  status: string | null
  pdfUrl: string | null
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  paid: { label: 'Pago', className: 'bg-[#10B981]/10 text-[#10B981]' },
  open: { label: 'Aberto', className: 'bg-[#F59E0B]/10 text-[#F59E0B]' },
  void: { label: 'Anulado', className: 'bg-[#4B5563]/10 text-[#4B5563]' },
  uncollectible: { label: 'Falhou', className: 'bg-[#EF4444]/10 text-[#EF4444]' },
  draft: { label: 'Rascunho', className: 'bg-[#4B5563]/10 text-[#4B5563]' },
}

interface BillingHistoryProps {
  stripeCustomerId: string | null
}

export function BillingHistory({ stripeCustomerId }: BillingHistoryProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!stripeCustomerId) {
      setLoading(false)
      return
    }

    fetch('/api/stripe/invoices')
      .then((res) => res.json())
      .then((data) => setInvoices(data.invoices ?? []))
      .catch(() => setInvoices([]))
      .finally(() => setLoading(false))
  }, [stripeCustomerId])

  if (!stripeCustomerId) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <Receipt className="mb-3 h-8 w-8 text-[#E5E7EB]" />
        <p className="text-sm text-[#4B5563]">
          Assine um plano para ver o histórico de faturas.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    )
  }

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <FileText className="mb-3 h-8 w-8 text-[#E5E7EB]" />
        <p className="text-sm text-[#4B5563]">Nenhuma fatura encontrada.</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-[#E5E7EB]">
      {invoices.map((invoice) => {
        const statusInfo = STATUS_LABELS[invoice.status ?? ''] ?? {
          label: invoice.status ?? '—',
          className: 'bg-[#4B5563]/10 text-[#4B5563]',
        }

        return (
          <div
            key={invoice.id}
            className="flex items-center justify-between py-3"
          >
            <div>
              <p className="text-sm font-medium text-[#111827]">
                {invoice.date
                  ? new Date(invoice.date).toLocaleDateString('pt-BR')
                  : '—'}
              </p>
              <p className="text-xs text-[#4B5563]">
                {invoice.number ?? invoice.id.slice(0, 16)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#111827]">
                R$ {(invoice.amount / 100).toFixed(2).replace('.', ',')}
              </span>

              <Badge className={statusInfo.className}>
                {statusInfo.label}
              </Badge>

              {invoice.pdfUrl && (
                <a
                  href={invoice.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0066CC] hover:text-[#0052A3]"
                  title="Baixar PDF"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
