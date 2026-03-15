'use client'

import * as AccordionPrimitive from '@radix-ui/react-accordion'

const faqs = [
  {
    question: 'Quais formatos são suportados?',
    answer:
      'Suportamos PDF, DOCX, PPTX, XLSX, PNG, JPEG e HTML. Nosso motor de conversão Docling processa cada formato mantendo a formatação original o máximo possível.',
  },
  {
    question: 'Como funciona o sistema de créditos?',
    answer:
      'Cada conversão consome 1 crédito. Os créditos são renovados mensalmente de acordo com seu plano. O plano gratuito oferece 5 créditos por mês. Os créditos não acumulam entre meses.',
  },
  {
    question: 'Posso cancelar minha assinatura a qualquer momento?',
    answer:
      'Sim! Você pode cancelar sua assinatura quando quiser, sem taxas de cancelamento. Seu plano continuará ativo até o final do período pago.',
  },
  {
    question: 'Os arquivos ficam armazenados?',
    answer:
      'Os arquivos originais são deletados imediatamente após a conversão por segurança. Apenas o resultado em Markdown fica salvo no seu histórico permanente para re-download.',
  },
  {
    question: 'Qual o tempo de conversão?',
    answer:
      'A maioria dos documentos é convertida em menos de 10 segundos. Arquivos maiores ou com muitas imagens podem levar até 60 segundos. O timeout máximo é de 1 minuto.',
  },
]

export function FAQSection() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl font-bold text-[#111827] sm:text-4xl">
          <span className="text-[#0066CC]">&#10022; </span>
          Perguntas Frequentes
        </h2>

        <AccordionPrimitive.Root
          type="single"
          collapsible
          defaultValue="item-0"
          className="mt-10"
        >
          {faqs.map((faq, index) => (
            <AccordionPrimitive.Item
              key={index}
              value={`item-${index}`}
              className="border-b border-[#E5E7EB]"
            >
              <AccordionPrimitive.Header className="flex">
                <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between py-5 text-left text-base font-semibold text-[#111827] outline-none transition-colors hover:text-[#0066CC] sm:text-lg">
                  {faq.question}
                  <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center text-xl text-[#0066CC]">
                    <span className="block group-data-[state=open]:hidden">+</span>
                    <span className="hidden group-data-[state=open]:block">&minus;</span>
                  </span>
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionPrimitive.Content className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down sm:text-base">
                <p className="pb-5 leading-relaxed text-[#4B5563]">
                  {faq.answer}
                </p>
              </AccordionPrimitive.Content>
            </AccordionPrimitive.Item>
          ))}
        </AccordionPrimitive.Root>
      </div>
    </section>
  )
}
