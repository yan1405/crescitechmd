import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="CrescitechMD - página inicial" className="flex items-center">
          <Image
            src="/logocrescitech.png"
            alt="CrescitechMD"
            width={120}
            height={36}
            priority
          />
        </Link>

        <nav aria-label="Navegação principal" className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="text-[#4B5563]">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild size="sm" className="bg-[#0066CC] hover:bg-[#0052A3]">
            <Link href="/signup">Começar Grátis</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
