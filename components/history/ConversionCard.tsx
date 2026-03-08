'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  FileText,
  Image,
  Table,
  Presentation,
  Globe,
  Download,
  Trash2,
  Eye,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { MarkdownPreview } from '@/components/convert/MarkdownPreview'

// ============================================================
// Types
// ============================================================

export interface SerializedConversion {
  id: string
  originalFileName: string
  originalFormat: string
  originalSize: number
  markdownUrl: string
  markdownSize: number | null
  status: string
  errorMessage: string | null
  processingTime: number | null
  createdAt: string
}

// ============================================================
// Helpers
// ============================================================

const FORMAT_ICONS: Record<string, typeof FileText> = {
  PDF: FileText,
  DOCX: FileText,
  PPTX: Presentation,
  XLSX: Table,
  PNG: Image,
  JPEG: Image,
  HTML: Globe,
}

function formatFileSize(bytes: number): string {
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1_048_576).toFixed(1)} MB`
}

// ============================================================
// Component
// ============================================================

interface ConversionCardProps {
  conversion: SerializedConversion
}

export function ConversionCard({ conversion }: ConversionCardProps) {
  const router = useRouter()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const Icon = FORMAT_ICONS[conversion.originalFormat] ?? FileText
  const mdFileName = conversion.originalFileName.replace(/\.[^.]+$/, '.md')
  const isCompleted = conversion.status === 'COMPLETED'
  const formattedDate = format(new Date(conversion.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })

  async function handleDelete() {
    setDeleting(true)
    try {
      const response = await fetch(`/api/convert/${conversion.id}`, { method: 'DELETE' })
      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Erro ao deletar.')
        return
      }

      toast.success('Conversão deletada com sucesso.')
      setDeleteOpen(false)
      router.refresh()
    } catch {
      toast.error('Erro de conexão. Tente novamente.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Card className="border-[#E5E7EB]">
        <CardContent className="py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* File info */}
            <div className="flex items-start gap-3">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#0066CC]" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#111827]">
                  {conversion.originalFileName}
                </p>
                <p className="text-xs text-[#4B5563]">
                  → {mdFileName}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#4B5563]">
                  <span>{formattedDate}</span>
                  <span>•</span>
                  <span>{formatFileSize(conversion.originalSize)}</span>
                  {conversion.processingTime != null && (
                    <>
                      <span>•</span>
                      <span>{conversion.processingTime}s</span>
                    </>
                  )}
                  <Badge
                    variant={isCompleted ? 'secondary' : 'destructive'}
                    className={
                      isCompleted
                        ? 'bg-[#10B981]/10 text-[#10B981]'
                        : undefined
                    }
                  >
                    {isCompleted ? 'Concluído' : 'Falhou'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-1">
              {isCompleted && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewOpen(true)}
                    className="text-[#4B5563] hover:text-[#0066CC]"
                  >
                    <Eye className="mr-1 h-4 w-4" />
                    Ver
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-[#4B5563] hover:text-[#0066CC]"
                  >
                    <a href={conversion.markdownUrl} download={mdFileName}>
                      <Download className="mr-1 h-4 w-4" />
                      Baixar
                    </a>
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteOpen(true)}
                className="text-[#4B5563] hover:text-[#EF4444]"
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Deletar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#111827]">
              {conversion.originalFileName}
            </DialogTitle>
            <DialogDescription>
              Preview do Markdown convertido
            </DialogDescription>
          </DialogHeader>
          {previewOpen && <MarkdownPreview previewUrl={conversion.markdownUrl} />}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#111827]">Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar "{conversion.originalFileName}"?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deletando...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Deletar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
