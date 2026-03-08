import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

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
    <section className="bg-[#F9FAFB] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-semibold text-[#111827] sm:text-4xl">
          Perguntas Frequentes
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[#4B5563]">
          Tire suas dúvidas sobre o CrescitechMD
        </p>

        <Accordion type="single" collapsible className="mt-10">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
