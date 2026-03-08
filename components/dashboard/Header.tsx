'use client'

import { signOut } from 'next-auth/react'
import { Menu, User, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

interface HeaderProps {
  userName?: string | null
  userPlan?: string
  onMenuToggle?: () => void
}

function getInitials(name?: string | null) {
  if (!name) return 'U'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const planColors: Record<string, string> = {
  FREE: 'bg-gray-100 text-gray-700',
  BASIC: 'bg-blue-100 text-blue-700',
  PRO: 'bg-[#0066CC]/10 text-[#0066CC]',
  BUSINESS: 'bg-amber-100 text-amber-700',
}

export function Header({ userName, userPlan = 'FREE', onMenuToggle }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-[#E5E7EB] bg-white px-4 lg:px-6">
      {/* Mobile menu button */}
      <button onClick={onMenuToggle} className="lg:hidden">
        <Menu className="h-6 w-6 text-[#4B5563]" />
      </button>

      <div className="hidden lg:block" />

      {/* Right side */}
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className={planColors[userPlan]}>
          {userPlan}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-[#F9FAFB] focus:outline-none">
            <Avatar className="h-8 w-8 bg-[#0066CC]">
              <AvatarFallback className="bg-[#0066CC] text-sm text-white">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium text-[#111827] sm:inline">
              {userName || 'Usuário'}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <a href="/settings" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Perfil
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
