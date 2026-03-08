import { redirect } from 'next/navigation'
import { customAlphabet } from 'nanoid'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ReferralCode } from '@/components/referral/ReferralCode'
import { ReferralStats } from '@/components/referral/ReferralStats'

export const metadata = {
  title: 'Referências | CrescitechMD',
}

const generateReferralCode = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8)

export default async function ReferralPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      referralCode: true,
      referrals: {
        select: {
          id: true,
          status: true,
          creditsAwarded: true,
          createdAt: true,
          referred: {
            select: { email: true, name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!user) redirect('/login')

  // Lazy generation for users created before Sprint 4.1
  let code = user.referralCode
  if (!code) {
    code = generateReferralCode()
    while (await prisma.user.findUnique({ where: { referralCode: code } })) {
      code = generateReferralCode()
    }
    await prisma.user.update({
      where: { id: session.user.id },
      data: { referralCode: code },
    })
  }

  const totalReferrals = user.referrals.length
  const convertedReferrals = user.referrals.filter(
    (r) => r.status === 'REWARDED'
  ).length
  const totalCreditsEarned = user.referrals.reduce(
    (sum, r) => sum + r.creditsAwarded,
    0
  )

  const serializedReferrals = user.referrals.map((r) => ({
    id: r.id,
    status: r.status,
    creditsAwarded: r.creditsAwarded,
    createdAt: r.createdAt.toISOString(),
    referredEmail: r.referred.email,
    referredName: r.referred.name,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#111827]">
          Programa de Referência
        </h1>
        <p className="mt-1 text-sm text-[#4B5563]">
          Indique amigos e ganhe créditos bônus para conversões!
        </p>
      </div>

      <ReferralCode code={code} />

      <ReferralStats
        stats={{ totalReferrals, convertedReferrals, totalCreditsEarned }}
        referrals={serializedReferrals}
      />
    </div>
  )
}
