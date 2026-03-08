import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Zap, FileText, CreditCard } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CreditsDisplay } from '@/components/dashboard/CreditsDisplay'

const maxCreditsMap: Record<string, number> = {
  FREE: 5,
  BASIC: 50,
  PRO: 200,
  BUSINESS: 1000,
}

const planPrices: Record<string, string> = {
  FREE: 'Grátis',
  BASIC: 'R$ 9/mês',
  PRO: 'R$ 19/mês',
  BUSINESS: 'R$ 39/mês',
}

export const metadata = {
  title: 'Dashboard | CrescitechMD',
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      plan: true,
      credits: { select: { amount: true } },
      _count: { select: { conversions: true } },
    },
  })

  const credits = user?.credits?.amount ?? 0
  const maxCredits = maxCreditsMap[user?.plan ?? 'FREE']
  const conversions = user?._count?.conversions ?? 0
  const plan = user?.plan ?? 'FREE'

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#111827]">
            Bem-vindo de volta, {user?.name?.split(' ')[0] || 'Usuário'}!
          </h1>
          <p className="mt-1 text-sm text-[#4B5563]">
            Aqui está o resumo da sua conta
          </p>
        </div>
        <Button asChild className="bg-[#0066CC] hover:bg-[#0052A3]">
          <Link href="/convert">
            <Zap className="mr-2 h-4 w-4" />
            Converter Arquivo
          </Link>
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CreditsDisplay amount={credits} maxCredits={maxCredits} plan={plan} />

        <Card className="border-[#E5E7EB]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#4B5563]">
              Conversões Realizadas
            </CardTitle>
            <FileText className="h-4 w-4 text-[#0066CC]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#111827]">{conversions}</div>
            <p className="mt-1 text-xs text-[#4B5563]">total na plataforma</p>
          </CardContent>
        </Card>

        <Card className="border-[#E5E7EB]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#4B5563]">
              Plano Atual
            </CardTitle>
            <CreditCard className="h-4 w-4 text-[#0066CC]" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#111827]">{plan}</span>
              {plan === 'PRO' && (
                <Badge className="bg-[#0066CC]/10 text-[#0066CC]">Popular</Badge>
              )}
            </div>
            <p className="mt-1 text-xs text-[#4B5563]">{planPrices[plan]}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent conversions */}
      <Card className="border-[#E5E7EB]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-[#111827]">
              Conversões Recentes
            </CardTitle>
            <Button asChild variant="ghost" size="sm" className="text-[#0066CC]">
              <Link href="/history">Ver todas</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {conversions === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="mb-3 h-10 w-10 text-[#E5E7EB]" />
              <p className="text-sm font-medium text-[#4B5563]">
                Nenhuma conversão ainda
              </p>
              <p className="mt-1 text-xs text-[#4B5563]">
                Converta seu primeiro documento para Markdown
              </p>
              <Button asChild size="sm" className="mt-4 bg-[#0066CC] hover:bg-[#0052A3]">
                <Link href="/convert">Começar agora</Link>
              </Button>
            </div>
          ) : (
            <p className="text-sm text-[#4B5563]">
              Você tem {conversions} conversão(ões). Acesse o histórico para ver detalhes.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
