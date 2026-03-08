'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { Zap, Download, RefreshCw, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { FileDropzone } from '@/components/convert/FileDropzone'
import { ConversionOptions } from '@/components/convert/ConversionOptions'
import type { ConversionOptionsValues } from '@/components/convert/ConversionOptions'
import { ConversionResult } from '@/components/convert/ConversionResult'
import { MarkdownPreview } from '@/components/convert/MarkdownPreview'

// ============================================================
// Types
// ============================================================

interface ConvertResult {
  conversionId: string
  previewUrl: string
  downloadUrl: string
  creditsRemaining: number
}

type ConvertState =
  | { status: 'idle' }
  | { status: 'selected'; file: File }
  | { status: 'converting'; file: File }
  | { status: 'success'; file: File; result: ConvertResult; elapsedSeconds: number }
  | { status: 'error'; file: File; errorMessage: string }

interface ConvertClientProps {
  credits: number
  maxCredits: number
  plan: string
}

// ============================================================
// Component
// ============================================================

export function ConvertClient({ credits, maxCredits, plan }: ConvertClientProps) {
  const [state, setState] = useState<ConvertState>({ status: 'idle' })
  const [displayCredits, setDisplayCredits] = useState(credits)
  const [progress, setProgress] = useState(0)
  const [options, setOptions] = useState<ConversionOptionsValues>({
    preserveImages: true,
    preserveTables: true,
    preserveHeaders: true,
    preserveLists: true,
  })

  // Fake progress bar during conversion
  useEffect(() => {
    if (state.status !== 'converting') {
      setProgress(0)
      return
    }

    setProgress(5)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev
        return prev + Math.random() * 8
      })
    }, 600)

    return () => clearInterval(interval)
  }, [state.status])

  const handleFileSelect = useCallback((file: File) => {
    setState({ status: 'selected', file })
  }, [])

  const handleFileRemove = useCallback(() => {
    setState({ status: 'idle' })
  }, [])

  const handleConvert = useCallback(async () => {
    if (state.status !== 'selected' && state.status !== 'error') return

    const file = state.file
    setState({ status: 'converting', file })
    const startTime = Date.now()

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('preserveImages', String(options.preserveImages))
      formData.append('preserveTables', String(options.preserveTables))
      formData.append('preserveHeaders', String(options.preserveHeaders))

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setState({
          status: 'error',
          file,
          errorMessage: data.error || 'Erro desconhecido. Tente novamente.',
        })
        toast.error(data.error || 'Erro na conversão')
        return
      }

      const elapsedSeconds = Math.round((Date.now() - startTime) / 1000)

      setProgress(100)
      // Brief delay at 100% before showing result
      await new Promise((r) => setTimeout(r, 300))

      setState({ status: 'success', file, result: data, elapsedSeconds })
      setDisplayCredits(data.creditsRemaining)
      toast.success('Conversão concluída com sucesso!')
    } catch {
      setState({
        status: 'error',
        file,
        errorMessage: 'Erro de conexão. Verifique sua internet e tente novamente.',
      })
      toast.error('Erro de conexão')
    }
  }, [state, options])

  const handleReset = useCallback(() => {
    setState({ status: 'idle' })
  }, [])

  const isConverting = state.status === 'converting'
  const canConvert =
    (state.status === 'selected' || state.status === 'error') && displayCredits > 0

  // ── Success state ──
  if (state.status === 'success') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#111827]">Converter Arquivo</h1>
          <p className="mt-1 text-sm text-[#4B5563]">
            Créditos disponíveis: {displayCredits}/{maxCredits}
          </p>
        </div>

        <ConversionResult
          originalFileName={state.file.name}
          creditsRemaining={state.result.creditsRemaining}
          maxCredits={maxCredits}
          processingTimeSeconds={state.elapsedSeconds}
        />

        <MarkdownPreview previewUrl={state.result.previewUrl} />

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="bg-[#0066CC] hover:bg-[#0052A3]">
            <a href={state.result.downloadUrl} download>
              <Download className="mr-2 h-4 w-4" />
              Baixar Markdown
            </a>
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Converter Outro
          </Button>
        </div>
      </div>
    )
  }

  // ── Idle / Selected / Converting / Error states ──
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#111827]">Converter Arquivo</h1>
        <p className="mt-1 text-sm text-[#4B5563]">
          Créditos disponíveis: {displayCredits}/{maxCredits}
        </p>
      </div>

      {state.status === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro na conversão</AlertTitle>
          <AlertDescription>{state.errorMessage}</AlertDescription>
        </Alert>
      )}

      <FileDropzone
        selectedFile={
          state.status === 'selected' || state.status === 'error' || state.status === 'converting'
            ? state.file
            : null
        }
        onFileSelect={handleFileSelect}
        onFileRemove={handleFileRemove}
        plan={plan}
        disabled={isConverting}
      />

      <ConversionOptions
        options={options}
        onChange={setOptions}
        disabled={isConverting}
      />

      {isConverting ? (
        <div className="space-y-3">
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-[#0066CC]" />
            <p className="text-sm text-[#4B5563]">Processando com Docling...</p>
          </div>
        </div>
      ) : (
        <Button
          onClick={handleConvert}
          disabled={!canConvert}
          className="w-full bg-[#0066CC] hover:bg-[#0052A3] sm:w-auto"
          size="lg"
        >
          <Zap className="mr-2 h-4 w-4" />
          Converter para Markdown
        </Button>
      )}

      {displayCredits <= 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Créditos esgotados</AlertTitle>
          <AlertDescription>
            Faça upgrade do seu plano para continuar convertendo.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
