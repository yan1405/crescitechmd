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
// Helpers
// ============================================================

function getFileExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() ?? ''
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
      // ── Step 1: Call Next.js to validate auth + credits ──
      const formData = new FormData()
      formData.append('file', file)
      formData.append('preserveImages', String(options.preserveImages))
      formData.append('preserveTables', String(options.preserveTables))
      formData.append('preserveHeaders', String(options.preserveHeaders))

      const authResponse = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      })

      const authData = await authResponse.json()

      if (!authResponse.ok) {
        setState({
          status: 'error',
          file,
          errorMessage: authData.error || 'Erro na validação. Tente novamente.',
        })
        toast.error(authData.error || 'Erro na validação')
        return
      }

      const { proxyUrl, apiKey, options: serverOptions } = authData as {
        proxyUrl: string
        apiKey: string
        options: { preserveImages: boolean; preserveTables: boolean; preserveHeaders: boolean }
      }

      // ── Step 2: Send file directly to Render (bypasses Vercel timeout) ──
      const renderFormData = new FormData()
      renderFormData.append('file', file)
      renderFormData.append('options', JSON.stringify(serverOptions))

      const renderResponse = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'X-API-Key': apiKey,
        },
        body: renderFormData,
      })

      const renderData = await renderResponse.json()

      if (!renderData.success) {
        setState({
          status: 'error',
          file,
          errorMessage: renderData.error || 'Erro na conversão. Tente novamente.',
        })
        toast.error(renderData.error || 'Erro na conversão')
        return
      }

      const processingTime = (Date.now() - startTime) / 1000

      // ── Step 3: Call /api/convert/complete to save result + debit credit ──
      const completeResponse = await fetch('/api/convert/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          markdown: renderData.markdown,
          fileName: file.name,
          fileSize: file.size,
          fileExtension: getFileExtension(file.name),
          processingTime: Math.round(processingTime),
          options: serverOptions,
        }),
      })

      const completeData = await completeResponse.json()

      if (!completeResponse.ok) {
        setState({
          status: 'error',
          file,
          errorMessage: completeData.error || 'Erro ao salvar resultado. Tente novamente.',
        })
        toast.error(completeData.error || 'Erro ao salvar resultado')
        return
      }

      const elapsedSeconds = Math.round((Date.now() - startTime) / 1000)

      setProgress(100)
      // Brief delay at 100% before showing result
      await new Promise((r) => setTimeout(r, 300))

      setState({ status: 'success', file, result: completeData, elapsedSeconds })
      setDisplayCredits(completeData.creditsRemaining)
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
