import { Metadata } from 'next'
import { LandingHeader } from '@/components/landing/LandingHeader'
import { Footer } from '@/components/landing/Footer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Perguntas frequentes sobre o CrescitechMD. Tire suas dúvidas sobre conversão de documentos, créditos, planos e segurança.',
  openGraph: {
    title: 'FAQ - CrescitechMD',
    description:
      'Perguntas frequentes sobre conversão de documentos, créditos, planos e segurança.',
  },
}

const faqCategories = [
  {
    title: 'Geral',
    faqs: [
      {
        question: 'Quais formatos são suportados?',
        answer:
          'Suportamos PDF, DOCX, PPTX, XLSX, PNG, JPEG e HTML. Nosso motor de conversão Docling processa cada formato mantendo a formatação original o máximo possível.',
      },
      {
        question: 'Qual o tempo de conversão?',
        answer:
          'A maioria dos documentos é convertida em menos de 10 segundos. Arquivos maiores ou com muitas imagens podem levar até 60 segundos. O timeout máximo é de 1 minuto.',
      },
      {
        question: 'Os arquivos ficam armazenados?',
        answer:
          'Os arquivos originais são deletados imediatamente após a conversão por segurança. Apenas o resultado em Markdown fica salvo no seu histórico permanente para re-download.',
      },
    ],
  },
  {
    title: 'Créditos & Planos',
    faqs: [
      {
        question: 'Como funciona o sistema de créditos?',
        answer:
          'Cada conversão consome 1 crédito. Os créditos são renovados mensalmente de acordo com seu plano. O plano gratuito oferece 5 créditos por mês. Os créditos não acumulam entre meses.',
      },
      {
        question: 'Como faço upgrade do meu plano?',
        answer:
          'Acesse Configurações no seu dashboard e clique em "Alterar Plano". Você pode escolher entre os planos Básico (50 créditos), Pro (200 créditos) e Business (1.000 créditos). O upgrade é imediato e seus novos créditos ficam disponíveis na hora.',
      },
      {
        question: 'O que acontece quando meus créditos acabam?',
        answer:
          'Quando seus créditos chegam a zero, você não poderá fazer novas conversões até que os créditos sejam renovados no próximo ciclo ou você faça upgrade para um plano superior. Você receberá um email avisando quando seus créditos acabarem.',
      },
      {
        question: 'Posso cancelar minha assinatura a qualquer momento?',
        answer:
          'Sim! Você pode cancelar sua assinatura quando quiser, sem taxas de cancelamento. Seu plano continuará ativo até o final do período pago. Após o cancelamento, sua conta volta para o plano Gratuito com 5 créditos/mês.',
      },
    ],
  },
  {
    title: 'Indicação',
    faqs: [
      {
        question: 'Como funciona o programa de indicação?',
        answer:
          'Cada usuário recebe um código de indicação único. Quando um amigo se cadastra usando seu código, ele ganha +5 créditos bônus. Quando esse amigo assina um plano pago, você ganha +10 créditos! Não há limite de indicações.',
      },
    ],
  },
  {
    title: 'Segurança',
    faqs: [
      {
        question: 'Meus dados estão seguros?',
        answer:
          'Sim. Utilizamos criptografia bcrypt para senhas, HTTPS em todas as comunicações e tokens JWT com expiração de 7 dias. Os arquivos originais enviados são deletados imediatamente após a conversão. Nosso banco de dados é hospedado na Supabase com backups automáticos.',
      },
      {
        question: 'Posso exportar ou excluir meus dados?',
        answer:
          'Sim. De acordo com a LGPD, você tem direito a acessar, corrigir, exportar e excluir seus dados pessoais. Entre em contato com nosso DPO pelo email yansilva@crescitech.com.br para solicitar qualquer operação sobre seus dados.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />

      <main className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-center text-3xl font-semibold text-[#111827] sm:text-4xl">
            Perguntas Frequentes
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-center text-[#4B5563]">
            Encontre respostas para as dúvidas mais comuns sobre o CrescitechMD
          </p>

          {faqCategories.map((category, catIndex) => (
            <div key={catIndex} className="mt-10">
              <h2 className="mb-4 text-lg font-semibold text-[#111827]">
                {category.title}
              </h2>
              <Accordion type="single" collapsible>
                {category.faqs.map((faq, faqIndex) => (
                  <AccordionItem
                    key={faqIndex}
                    value={`cat-${catIndex}-item-${faqIndex}`}
                  >
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}

          <div className="mt-16 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-8 text-center">
            <h2 className="text-xl font-semibold text-[#111827]">
              Não encontrou sua resposta?
            </h2>
            <p className="mt-2 text-[#4B5563]">
              Nossa equipe está pronta para ajudar você.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-block rounded-md bg-[#0066CC] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0052A3]"
            >
              Entre em Contato
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
