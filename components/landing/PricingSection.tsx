import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const plans = [
  {
    name: 'FREE',
    price: 'R$ 0',
    period: '/mês',
    description: 'Para experimentar',
    features: [
      '5 conversões por mês',
      'Arquivos até 5 MB',
      'Formatos básicos',
      'Histórico permanente',
    ],
    cta: 'Usar Grátis',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'BÁSICO',
    price: 'R$ 9',
    period: '/mês',
    description: 'Para uso regular',
    features: [
      '50 conversões por mês',
      'Arquivos até 10 MB',
      'Todos os formatos',
      'Histórico permanente',
    ],
    cta: 'Assinar',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'PRO',
    price: 'R$ 19',
    period: '/mês',
    description: 'Mais popular',
    features: [
      '200 conversões por mês',
      'Arquivos até 20 MB',
      'Todos os formatos',
      'Histórico permanente',
      'Suporte em até 24h',
    ],
    cta: 'Assinar',
    href: '/signup',
    highlighted: true,
  },
  {
    name: 'BUSINESS',
    price: 'R$ 39',
    period: '/mês',
    description: 'Para profissionais',
    features: [
      '1000 conversões por mês',
      'Arquivos até 50 MB',
      'Todos os formatos',
      'Histórico permanente',
      'Suporte prioritário',
    ],
    cta: 'Assinar',
    href: '/signup',
    highlighted: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="bg-white px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-semibold text-[#111827] sm:text-4xl">
          Planos
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[#4B5563]">
          Escolha o plano ideal para suas necessidades
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'relative flex flex-col rounded-xl border p-6',
                plan.highlighted
                  ? 'border-[#0066CC] shadow-lg ring-1 ring-[#0066CC]'
                  : 'border-[#E5E7EB] shadow-sm'
              )}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0066CC] text-white">
                  Popular
                </Badge>
              )}

              <h3 className="text-lg font-semibold text-[#111827]">
                {plan.name}
              </h3>
              <p className="mt-1 text-sm text-[#4B5563]">{plan.description}</p>

              <div className="mt-4">
                <span className="text-3xl font-bold text-[#111827]">
                  {plan.price}
                </span>
                <span className="text-sm text-[#4B5563]">{plan.period}</span>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-[#4B5563]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={cn(
                  'mt-6 w-full',
                  plan.highlighted
                    ? 'bg-[#0066CC] hover:bg-[#0052A3]'
                    : 'bg-[#111827] hover:bg-[#111827]/90'
                )}
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
