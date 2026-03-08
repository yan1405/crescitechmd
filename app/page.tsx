import { Metadata } from 'next'
import { LandingHeader } from '@/components/landing/LandingHeader'
import { HeroSection } from '@/components/landing/HeroSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { FAQSection } from '@/components/landing/FAQSection'
import { CTASection } from '@/components/landing/CTASection'
import { Footer } from '@/components/landing/Footer'

export const metadata: Metadata = {
  title: 'CrescitechMD - Converta Documentos para Markdown',
  description:
    'Transforme PDF, DOCX, PPTX e mais em Markdown com apenas alguns cliques. Simples, rápido e profissional. Comece grátis com 5 conversões.',
  keywords: [
    'markdown',
    'conversor',
    'pdf para markdown',
    'docx para markdown',
    'docling',
    'conversão de documentos',
  ],
  openGraph: {
    title: 'CrescitechMD - Converta Documentos para Markdown',
    description:
      'Transforme PDF, DOCX, PPTX e mais em Markdown. Simples, rápido e profissional.',
    type: 'website',
    locale: 'pt_BR',
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <HeroSection />
      <HowItWorksSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  )
}
