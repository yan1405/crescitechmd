import { Upload, Cog, Download } from 'lucide-react'

const steps = [
  {
    icon: Upload,
    title: 'Upload',
    description: 'Arraste ou selecione seu arquivo. Suportamos PDF, DOCX, PPTX, XLSX, imagens e HTML.',
  },
  {
    icon: Cog,
    title: 'Conversão',
    description: 'Processamos seu documento com Docling em poucos segundos, preservando formatação.',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Visualize o preview e baixe seu Markdown pronto para uso.',
  },
]

export function HowItWorksSection() {
  return (
    <section className="bg-[#F9FAFB] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-semibold text-[#111827] sm:text-4xl">
          Como Funciona
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[#4B5563]">
          Três passos simples para converter seus documentos
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex flex-col items-center rounded-xl border border-[#E5E7EB] bg-white p-8 text-center shadow-sm"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0066CC]/10">
                <step.icon className="h-7 w-7 text-[#0066CC]" />
              </div>
              <span className="mt-4 text-sm font-medium text-[#0066CC]">
                Passo {index + 1}
              </span>
              <h3 className="mt-2 text-xl font-semibold text-[#111827]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-[#4B5563]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
