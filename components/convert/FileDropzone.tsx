'use client'

import { useRef, useState, useCallback } from 'react'
import { Upload, FileText, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { SUPPORTED_MIME_TYPES, MAX_FILE_SIZES } from '@/lib/validations/convert'

interface FileDropzoneProps {
  selectedFile: File | null
  onFileSelect: (file: File) => void
  onFileRemove: () => void
  plan: string
  disabled?: boolean
}

const acceptString = Object.keys(SUPPORTED_MIME_TYPES).join(',')

function formatFileSize(bytes: number): string {
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1_048_576).toFixed(2)} MB`
}

export function FileDropzone({
  selectedFile,
  onFileSelect,
  onFileRemove,
  plan,
  disabled = false,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const maxSize = MAX_FILE_SIZES[plan] ?? MAX_FILE_SIZES.FREE
  const maxSizeMB = Math.round(maxSize / 1_048_576)

  const validateAndSelect = useCallback(
    (file: File) => {
      setValidationError(null)

      if (!SUPPORTED_MIME_TYPES[file.type]) {
        setValidationError(
          'Formato não suportado. Formatos aceitos: PDF, DOCX, PPTX, XLSX, PNG, JPEG, HTML.',
        )
        return
      }

      if (file.size > maxSize) {
        setValidationError(`Arquivo muito grande. Limite do seu plano: ${maxSizeMB} MB.`)
        return
      }

      onFileSelect(file)
    },
    [maxSize, maxSizeMB, onFileSelect],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      if (disabled) return

      const file = e.dataTransfer.files[0]
      if (file) validateAndSelect(file)
    },
    [disabled, validateAndSelect],
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (!disabled) setIsDragOver(true)
    },
    [disabled],
  )

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) validateAndSelect(file)
      // Reset input so the same file can be selected again
      e.target.value = ''
    },
    [validateAndSelect],
  )

  // File selected state
  if (selectedFile) {
    return (
      <Card className="border-[#0066CC] border-dashed bg-[#0066CC]/5">
        <CardContent>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-[#0066CC]" />
              <div>
                <p className="text-sm font-medium text-[#111827]">{selectedFile.name}</p>
                <p className="text-xs text-[#4B5563]">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <button
              onClick={onFileRemove}
              disabled={disabled}
              className="rounded-full p-1 transition-colors hover:bg-[#EF4444]/10 disabled:opacity-50"
            >
              <X className="h-5 w-5 text-[#4B5563] hover:text-[#EF4444]" />
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Empty / drag-and-drop state
  return (
    <div>
      <Card
        className={cn(
          'border-dashed transition-colors',
          isDragOver
            ? 'border-[#0066CC] bg-[#0066CC]/5'
            : 'border-[#E5E7EB] hover:border-[#0066CC]/50',
          disabled && 'pointer-events-none opacity-50',
        )}
      >
        <CardContent>
          <div
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center py-12"
          >
            <Upload
              className={cn(
                'mb-3 h-10 w-10',
                isDragOver ? 'text-[#0066CC]' : 'text-[#E5E7EB]',
              )}
            />
            <p className="text-sm font-medium text-[#4B5563]">
              Arraste seu arquivo aqui ou clique
            </p>
            <p className="mt-2 text-xs text-[#4B5563]">
              Formatos: PDF, DOCX, PPTX, XLSX, PNG, JPEG, HTML
            </p>
            <p className="mt-1 text-xs text-[#4B5563]">
              Tamanho máximo: {maxSizeMB} MB
            </p>
          </div>
        </CardContent>
      </Card>

      <input
        ref={inputRef}
        type="file"
        accept={acceptString}
        onChange={handleInputChange}
        className="hidden"
      />

      {validationError && (
        <p className="mt-2 text-sm text-[#EF4444]">{validationError}</p>
      )}
    </div>
  )
}
