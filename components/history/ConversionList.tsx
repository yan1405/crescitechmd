'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FileText, ChevronLeft, ChevronRight, Search, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ConversionCard } from '@/components/history/ConversionCard'
import type { SerializedConversion } from '@/components/history/ConversionCard'

// ============================================================
// Types
// ============================================================

interface ConversionListProps {
  conversions: SerializedConversion[]
  total: number
  page: number
  totalPages: number
  currentFormat: string
  currentStatus: string
  currentSearch: string
}

// ============================================================
// Constants
// ============================================================

const FORMAT_OPTIONS = [
  { value: 'all', label: 'Todos os formatos' },
  { value: 'PDF', label: 'PDF' },
  { value: 'DOCX', label: 'DOCX' },
  { value: 'PPTX', label: 'PPTX' },
  { value: 'XLSX', label: 'XLSX' },
  { value: 'PNG', label: 'PNG' },
  { value: 'JPEG', label: 'JPEG' },
  { value: 'HTML', label: 'HTML' },
]

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos os status' },
  { value: 'COMPLETED', label: 'Concluído' },
  { value: 'FAILED', label: 'Falhou' },
]

// ============================================================
// Component
// ============================================================

export function ConversionList({
  conversions,
  total,
  page,
  totalPages,
  currentFormat,
  currentStatus,
  currentSearch,
}: ConversionListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchInput, setSearchInput] = useState(currentSearch)

  // Build URL with updated params
  const buildUrl = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())

      for (const [key, value] of Object.entries(updates)) {
        if (value && value !== 'all' && value !== '') {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      }

      // Reset to page 1 when filters change (except when navigating pages)
      if (!('page' in updates)) {
        params.delete('page')
      }

      const qs = params.toString()
      return `/history${qs ? `?${qs}` : ''}`
    },
    [searchParams],
  )

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== currentSearch) {
        router.push(buildUrl({ search: searchInput }))
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput, currentSearch, router, buildUrl])

  return (
    <div className="space-y-4">
      {/* Filters bar */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Select
          value={currentFormat}
          onValueChange={(value) => router.push(buildUrl({ format: value }))}
        >
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Formato" />
          </SelectTrigger>
          <SelectContent>
            {FORMAT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentStatus}
          onValueChange={(value) => router.push(buildUrl({ status: value }))}
        >
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4B5563]" />
          <Input
            placeholder="Buscar por nome do arquivo..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* List */}
      {conversions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="mb-3 h-10 w-10 text-[#E5E7EB]" />
          <p className="text-sm font-medium text-[#4B5563]">
            Nenhuma conversão encontrada
          </p>
          <p className="mt-1 text-xs text-[#4B5563]">
            {currentSearch || currentFormat !== 'all' || currentStatus !== 'all'
              ? 'Tente ajustar os filtros'
              : 'Converta seu primeiro documento para Markdown'}
          </p>
          <Button asChild size="sm" className="mt-4 bg-[#0066CC] hover:bg-[#0052A3]">
            <Link href="/convert">
              <Zap className="mr-2 h-4 w-4" />
              Converter arquivo
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {conversions.map((conversion) => (
            <ConversionCard key={conversion.id} conversion={conversion} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => router.push(buildUrl({ page: String(page - 1) }))}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Anterior
          </Button>

          <span className="text-sm text-[#4B5563]">
            Página {page} de {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => router.push(buildUrl({ page: String(page + 1) }))}
          >
            Próxima
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
