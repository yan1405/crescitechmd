import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, FileText, FileDown, Zap } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-[#111827] sm:text-5xl lg:text-6xl">
          Converta Documentos para{' '}
          <span className="text-[#0066CC]">Markdown</span> em Segundos
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-[#4B5563]">
          Transforme PDF, DOCX, PPTX e mais em Markdown com apenas alguns
          cliques. Simples, rápido e profissional.
        </p>

        <div className="mt-8">
          <Button
            asChild
            size="lg"
            className="bg-[#0066CC] px-8 text-base hover:bg-[#0052A3]"
          >
            <Link href="/signup">
              Começar Grátis - 5 conversões
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Demo visual — janela estilo macOS */}
        <div role="img" aria-label="Demonstração: arquivo PDF convertido para Markdown" className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] shadow-lg">
          {/* Barra macOS */}
          <div className="flex h-9 items-center gap-2 border-b border-[#E5E7EB] bg-[#F0F0F0] px-4">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: '#FF5F57' }} />
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: '#FFBD2E' }} />
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: '#28C840' }} />
          </div>

          <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0066CC]/10">
                <FileText className="h-7 w-7 text-[#0066CC]" />
              </div>
              <span className="text-sm font-medium text-[#4B5563]">
                relatorio.pdf
              </span>
            </div>

            <div className="flex items-center">
              <div className="hidden h-px w-12 bg-[#E5E7EB] sm:block" />
              <Zap className="mx-2 h-5 w-5 text-[#F59E0B]" />
              <div className="hidden h-px w-12 bg-[#E5E7EB] sm:block" />
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#10B981]/10">
                <FileDown className="h-7 w-7 text-[#10B981]" />
              </div>
              <span className="text-sm font-medium text-[#4B5563]">
                relatorio.md
              </span>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-white p-4 text-left font-mono text-sm text-[#4B5563] border border-[#E5E7EB]">
            <p className="text-[#111827] font-semibold"># Relatório Q4 2025</p>
            <p className="mt-2">## Resumo Executivo</p>
            <p className="mt-1 text-[#4B5563]">
              Este documento apresenta os resultados...
            </p>
            <p className="mt-2">### Principais Métricas</p>
            <p className="mt-1 text-[#4B5563]">
              | Métrica | Q3 | Q4 | Variação |
            </p>
          </div>
          </div>
        </div>
      </div>
    </section>
  )
}
