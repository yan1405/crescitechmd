import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="bg-[#0066CC] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">
          Pronto para começar?
        </h2>
        <p className="mt-4 text-lg text-white/80">
          Comece gratuitamente com 5 conversões. Sem cartão de crédito.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-8 bg-white px-8 text-base text-[#0066CC] hover:bg-white/90"
        >
          <Link href="/signup">
            Criar Conta Grátis
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
