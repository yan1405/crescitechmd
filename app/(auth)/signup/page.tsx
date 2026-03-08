import { SignupForm } from '@/components/auth/SignupForm'

export const metadata = {
  title: 'Criar Conta | CrescitechMD',
  description: 'Crie sua conta gratuita no CrescitechMD',
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const params = await searchParams
  const referralCode = params.ref ?? ''

  return <SignupForm defaultReferralCode={referralCode} />
}
