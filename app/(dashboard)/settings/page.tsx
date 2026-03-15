import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { PLAN_CREDITS } from '@/lib/plans'
import { User, CreditCard, Shield, Bell } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SubscriptionPanel } from '@/components/settings/SubscriptionPanel'

export const metadata = {
  title: 'Configurações | CrescitechMD',
}

export default async function SettingsPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      plan: true,
      credits: { select: { amount: true, lastReset: true } },
      subscription: {
        select: {
          status: true,
          currentPeriodEnd: true,
          canceledAt: true,
          plan: true,
          stripeCustomerId: true,
        },
      },
    },
  })

  if (!user) redirect('/login')

  const plan = user.plan ?? 'FREE'
  const credits = user.credits?.amount ?? 0
  const maxCredits = PLAN_CREDITS[plan] ?? 5

  // Serialize subscription for client component
  const serializedSubscription = user.subscription
    ? {
        status: user.subscription.status,
        currentPeriodEnd: user.subscription.currentPeriodEnd.toISOString(),
        canceledAt: user.subscription.canceledAt?.toISOString() ?? null,
        plan: user.subscription.plan,
        stripeCustomerId: user.subscription.stripeCustomerId,
      }
    : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#111827]">Configurações</h1>
        <p className="mt-1 text-sm text-[#4B5563]">
          Gerencie sua conta e assinatura
        </p>
      </div>

      <Tabs defaultValue="assinatura">
        <TabsList>
          <TabsTrigger value="perfil" className="gap-1.5">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="assinatura" className="gap-1.5">
            <CreditCard className="h-4 w-4" />
            Assinatura
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="gap-1.5">
            <Shield className="h-4 w-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="gap-1.5">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="perfil">
          <Card className="border-[#E5E7EB]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#111827]">
                Informações do Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#4B5563]">Nome</label>
                <p className="mt-1 text-sm text-[#111827]">
                  {user.name || 'Não informado'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#4B5563]">Email</label>
                <p className="mt-1 text-sm text-[#111827]">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-[#4B5563]">Plano</label>
                <p className="mt-1 text-sm text-[#111827]">{plan}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="assinatura">
          <SubscriptionPanel
            plan={plan}
            credits={credits}
            maxCredits={maxCredits}
            lastReset={user.credits?.lastReset?.toISOString() ?? null}
            subscription={serializedSubscription}
          />
        </TabsContent>

        {/* Security Tab - Placeholder */}
        <TabsContent value="seguranca">
          <Card className="border-[#E5E7EB]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#111827]">
                Segurança
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-12 text-center">
                <Shield className="mb-3 h-10 w-10 text-[#E5E7EB]" />
                <p className="text-sm font-medium text-[#4B5563]">
                  Em breve
                </p>
                <p className="mt-1 text-xs text-[#4B5563]">
                  Alteração de senha e autenticação de dois fatores
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab - Placeholder */}
        <TabsContent value="notificacoes">
          <Card className="border-[#E5E7EB]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#111827]">
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-12 text-center">
                <Bell className="mb-3 h-10 w-10 text-[#E5E7EB]" />
                <p className="text-sm font-medium text-[#4B5563]">
                  Em breve
                </p>
                <p className="mt-1 text-xs text-[#4B5563]">
                  Preferências de email e notificações do sistema
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
