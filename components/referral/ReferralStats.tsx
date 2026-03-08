'use client'

import { Users, UserCheck, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface ReferralStatsProps {
  stats: {
    totalReferrals: number
    convertedReferrals: number
    totalCreditsEarned: number
  }
  referrals: Array<{
    id: string
    status: string
    creditsAwarded: number
    createdAt: string
    referredEmail: string
    referredName: string | null
  }>
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!domain) return email
  const visible = local.slice(0, 2)
  return `${visible}***@${domain}`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function ReferralStats({ stats, referrals }: ReferralStatsProps) {
  return (
    <div className="space-y-4">
      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-[#E5E7EB]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#4B5563]">
              Total de Indicações
            </CardTitle>
            <Users className="h-4 w-4 text-[#0066CC]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#111827]">
              {stats.totalReferrals}
            </div>
            <p className="mt-1 text-xs text-[#4B5563]">pessoas indicadas</p>
          </CardContent>
        </Card>

        <Card className="border-[#E5E7EB]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#4B5563]">
              Convertidas
            </CardTitle>
            <UserCheck className="h-4 w-4 text-[#10B981]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#111827]">
              {stats.convertedReferrals}
            </div>
            <p className="mt-1 text-xs text-[#4B5563]">assinaram um plano</p>
          </CardContent>
        </Card>

        <Card className="border-[#E5E7EB]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#4B5563]">
              Créditos Ganhos
            </CardTitle>
            <Zap className="h-4 w-4 text-[#F59E0B]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#111827]">
              {stats.totalCreditsEarned}
            </div>
            <p className="mt-1 text-xs text-[#4B5563]">créditos bônus</p>
          </CardContent>
        </Card>
      </div>

      {/* Referral list */}
      <Card className="border-[#E5E7EB]">
        <CardHeader>
          <CardTitle className="text-sm font-medium uppercase tracking-wider text-[#4B5563]">
            Suas Indicações
          </CardTitle>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-[#E5E7EB]" />
              <p className="mt-4 font-medium text-[#111827]">
                Nenhuma indicação ainda
              </p>
              <p className="mt-1 text-sm text-[#4B5563]">
                Compartilhe seu link para começar a ganhar créditos!
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Indicado</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Créditos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-[#111827]">
                          {referral.referredName || 'Sem nome'}
                        </p>
                        <p className="text-sm text-[#4B5563]">
                          {maskEmail(referral.referredEmail)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#4B5563]">
                      {formatDate(referral.createdAt)}
                    </TableCell>
                    <TableCell>
                      {referral.status === 'PENDING' ? (
                        <Badge
                          variant="outline"
                          className="border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#F59E0B]"
                        >
                          Pendente
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981]"
                        >
                          Convertido
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium text-[#111827]">
                      {referral.creditsAwarded > 0
                        ? `+${referral.creditsAwarded}`
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
