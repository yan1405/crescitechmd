import { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/dashboard/DashboardShell'

export const metadata: Metadata = {
  title: 'Admin',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return (
    <DashboardShell
      userName={session.user.name}
      userRole={session.user.role}
      userPlan={session.user.plan}
    >
      {children}
    </DashboardShell>
  )
}
