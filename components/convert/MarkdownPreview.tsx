'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const MAX_PREVIEW_CHARS = 50_000

interface MarkdownPreviewProps {
  previewUrl: string
}

export function MarkdownPreview({ previewUrl }: MarkdownPreviewProps) {
  const [markdown, setMarkdown] = useState<string | null>(null)
  const [truncated, setTruncated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function fetchMarkdown() {
      try {
        const response = await fetch(previewUrl)
        if (!response.ok) throw new Error('Failed to fetch')
        let text = await response.text()

        if (text.length > MAX_PREVIEW_CHARS) {
          text = text.slice(0, MAX_PREVIEW_CHARS)
          if (!cancelled) setTruncated(true)
        }

        if (!cancelled) setMarkdown(text)
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchMarkdown()
    return () => { cancelled = true }
  }, [previewUrl])

  return (
    <Card className="border-[#E5E7EB]">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-[#111827]">
          Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-96 overflow-y-auto rounded-md border border-[#E5E7EB] bg-white p-4">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[#0066CC]" />
            </div>
          )}

          {error && (
            <p className="text-sm text-[#EF4444]">
              Erro ao carregar preview. Use o botão de download.
            </p>
          )}

          {markdown !== null && (
            <article className="prose prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdown}
              </ReactMarkdown>
            </article>
          )}
        </div>

        {truncated && (
          <p className="mt-2 text-xs text-[#4B5563]">
            Conteúdo truncado. Baixe o arquivo completo para visualização total.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
