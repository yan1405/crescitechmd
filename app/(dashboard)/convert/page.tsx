import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ConvertClient } from '@/components/convert/ConvertClient'

const maxCreditsMap: Record<string, number> = {
  FREE: 5,
  BASIC: 50,
  PRO: 200,
  BUSINESS: 1000,
}

export const metadata = {
  title: 'Converter Arquivo | CrescitechMD',
}

export default async function ConvertPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      plan: true,
      credits: { select: { amount: true } },
    },
  })

  const plan = user?.plan ?? 'FREE'
  const credits = user?.credits?.amount ?? 0
  const maxCredits = maxCreditsMap[plan]

  return (
    <ConvertClient
      credits={credits}
      maxCredits={maxCredits}
      plan={plan}
    />
  )
}
