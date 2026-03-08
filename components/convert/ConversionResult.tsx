'use client'

import { CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface ConversionResultProps {
  originalFileName: string
  creditsRemaining: number
  maxCredits: number
  processingTimeSeconds: number
}

export function ConversionResult({
  originalFileName,
  creditsRemaining,
  maxCredits,
  processingTimeSeconds,
}: ConversionResultProps) {
  const mdFileName = originalFileName.replace(/\.[^.]+$/, '.md')

  return (
    <Card className="border-[#10B981] bg-[#10B981]/5">
      <CardContent className="py-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <CheckCircle2 className="h-8 w-8 text-[#10B981]" />
          <h2 className="text-lg font-semibold text-[#111827]">
            Conversão Concluída!
          </h2>
          <p className="text-sm text-[#4B5563]">
            {originalFileName} → {mdFileName}
          </p>
          <p className="text-sm text-[#4B5563]">
            Processado em {processingTimeSeconds} segundo{processingTimeSeconds !== 1 ? 's' : ''}
          </p>
          <p className="text-sm text-[#4B5563]">
            Créditos restantes: {creditsRemaining}/{maxCredits}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
