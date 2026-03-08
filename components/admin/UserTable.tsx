'use client'

import { useEffect, useState, useCallback } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface UserRow {
  id: string
  name: string | null
  email: string
  plan: string
  role: string
  createdAt: string
  credits: { amount: number } | null
  subscription: { status: string } | null
  _count: { conversions: number }
}

interface UsersResponse {
  users: UserRow[]
  total: number
  page: number
  totalPages: number
}

const PLAN_COLORS: Record<string, string> = {
  FREE: 'bg-gray-100 text-gray-700',
  BASIC: 'bg-blue-100 text-blue-700',
  PRO: 'bg-[#0066CC]/10 text-[#0066CC]',
  BUSINESS: 'bg-amber-100 text-amber-700',
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-[#10B981]/10 text-[#10B981]',
  CANCELED: 'bg-[#EF4444]/10 text-[#EF4444]',
  PAST_DUE: 'bg-[#F59E0B]/10 text-[#F59E0B]',
  PAUSED: 'bg-gray-100 text-gray-700',
}

export function UserTable() {
  const [data, setData] = useState<UsersResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [planFilter, setPlanFilter] = useState('')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set('page', String(page))
    if (planFilter) params.set('plan', planFilter)
    if (debouncedSearch) params.set('search', debouncedSearch)

    try {
      const res = await fetch(`/api/admin/users?${params}`)
      const json = await res.json()
      setData(json)
    } catch {
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [page, planFilter, debouncedSearch])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [planFilter, debouncedSearch])

  return (
    <Card className="border-[#E5E7EB]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#111827]">
          Usuários
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4B5563]" />
            <Input
              placeholder="Buscar por email ou nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-[#E5E7EB]"
            />
          </div>
          <Select
            value={planFilter}
            onValueChange={(v) => setPlanFilter(v === 'ALL' ? '' : v)}
          >
            <SelectTrigger className="w-full sm:w-40 border-[#E5E7EB]">
              <SelectValue placeholder="Todos os planos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              <SelectItem value="FREE">Free</SelectItem>
              <SelectItem value="BASIC">Basic</SelectItem>
              <SelectItem value="PRO">Pro</SelectItem>
              <SelectItem value="BUSINESS">Business</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-[#E5E7EB]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[#4B5563]">Email</TableHead>
                <TableHead className="text-[#4B5563]">Plano</TableHead>
                <TableHead className="text-[#4B5563]">Créditos</TableHead>
                <TableHead className="text-[#4B5563]">Conversões</TableHead>
                <TableHead className="text-[#4B5563]">Cadastro</TableHead>
                <TableHead className="text-[#4B5563]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : data?.users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-sm text-[#4B5563]"
                  >
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                data?.users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-[#111827]">
                          {user.email}
                        </p>
                        {user.name && (
                          <p className="text-xs text-[#4B5563]">{user.name}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={PLAN_COLORS[user.plan] ?? ''}>
                        {user.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-[#111827]">
                      {user.credits?.amount ?? 0}
                    </TableCell>
                    <TableCell className="text-sm text-[#111827]">
                      {user._count.conversions}
                    </TableCell>
                    <TableCell className="text-sm text-[#4B5563]">
                      {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      {user.subscription ? (
                        <Badge
                          className={
                            STATUS_COLORS[user.subscription.status] ?? ''
                          }
                        >
                          {user.subscription.status}
                        </Badge>
                      ) : (
                        <span className="text-xs text-[#4B5563]">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#4B5563]">
              {data.total} usuário{data.total !== 1 ? 's' : ''} encontrado
              {data.total !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="border-[#E5E7EB]"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-[#4B5563]">
                {page} de {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page >= data.totalPages}
                className="border-[#E5E7EB]"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
