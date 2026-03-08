import { Metadata } from 'next'
import { LandingHeader } from '@/components/landing/LandingHeader'
import { Footer } from '@/components/landing/Footer'
import { ContactContent } from './contact-content'

export const metadata: Metadata = {
  title: 'Contato',
  description:
    'Entre em contato com a equipe CrescitechMD. Estamos prontos para ajudar com dúvidas, suporte técnico ou parcerias.',
  openGraph: {
    title: 'Contato - CrescitechMD',
    description:
      'Entre em contato com a equipe CrescitechMD para dúvidas, suporte ou parcerias.',
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <ContactContent />
      <Footer />
    </div>
  )
}
