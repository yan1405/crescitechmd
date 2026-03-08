'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'

interface DashboardShellProps {
  children: React.ReactNode
  userName?: string | null
  userRole?: string
  userPlan?: string
}

export function DashboardShell({
  children,
  userName,
  userRole,
  userPlan,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#F9FAFB]">
      <Sidebar
        userRole={userRole}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          userName={userName}
          userPlan={userPlan}
          onMenuToggle={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
