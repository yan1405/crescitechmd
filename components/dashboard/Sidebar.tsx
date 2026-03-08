'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  Home,
  Zap,
  ClipboardList,
  Settings,
  Users,
  Shield,
  LogOut,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/convert', label: 'Converter', icon: Zap },
  { href: '/history', label: 'Histórico', icon: ClipboardList },
  { href: '/settings', label: 'Configurações', icon: Settings },
  { href: '/referral', label: 'Referências', icon: Users },
]

interface SidebarProps {
  userRole?: string
  open?: boolean
  onClose?: () => void
}

export function Sidebar({ userRole, open, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#E5E7EB] bg-white transition-transform lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-[#E5E7EB] px-6">
          <Link href="/dashboard" className="text-xl font-bold text-[#0066CC]">
            CrescitechMD
          </Link>
          <button onClick={onClose} className="lg:hidden">
            <X className="h-5 w-5 text-[#4B5563]" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#0066CC]/10 text-[#0066CC]'
                    : 'text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#111827]'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}

          {userRole === 'ADMIN' && (
            <Link
              href="/admin"
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                pathname === '/admin'
                  ? 'bg-[#0066CC]/10 text-[#0066CC]'
                  : 'text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#111827]'
              )}
            >
              <Shield className="h-5 w-5" />
              Admin
            </Link>
          )}
        </nav>

        {/* Logout */}
        <div className="border-t border-[#E5E7EB] p-3">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-[#4B5563] hover:bg-red-50 hover:text-red-600"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            <LogOut className="h-5 w-5" />
            Sair
          </Button>
        </div>
      </aside>
    </>
  )
}
