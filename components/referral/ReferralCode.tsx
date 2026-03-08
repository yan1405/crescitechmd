'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Copy, Link, MessageCircle, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface ReferralCodeProps {
  code: string
}

export function ReferralCode({ code }: ReferralCodeProps) {
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const referralLink = typeof window !== 'undefined'
    ? `${window.location.origin}/signup?ref=${code}`
    : `/signup?ref=${code}`

  async function copyToClipboard(text: string, type: 'code' | 'link') {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'code') {
        setCopiedCode(true)
        setTimeout(() => setCopiedCode(false), 2000)
      } else {
        setCopiedLink(true)
        setTimeout(() => setCopiedLink(false), 2000)
      }
      toast.success(type === 'code' ? 'Código copiado!' : 'Link copiado!')
    } catch {
      toast.error('Erro ao copiar. Tente novamente.')
    }
  }

  const shareMessage = `Experimente o CrescitechMD! Converta seus documentos para Markdown com IA. Use meu código de indicação e ganhe 5 créditos bônus: ${referralLink}`

  return (
    <div className="space-y-4">
      {/* Codigo de indicacao */}
      <Card className="border-[#E5E7EB]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium uppercase tracking-wider text-[#4B5563]">
            Seu Código de Indicação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-dashed border-[#0066CC]/30 bg-[#0066CC]/5 px-6 py-4">
            <span className="text-2xl font-bold tracking-[0.3em] text-[#0066CC] font-mono">
              {code}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(code, 'code')}
              className="gap-1.5 border-[#0066CC] text-[#0066CC] hover:bg-[#0066CC]/10"
            >
              <Copy className="h-4 w-4" />
              {copiedCode ? 'Copiado!' : 'Copiar'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Link de indicacao + compartilhamento */}
      <Card className="border-[#E5E7EB]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium uppercase tracking-wider text-[#4B5563]">
            Seu Link de Indicação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 truncate rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2.5 text-sm text-[#4B5563] font-mono">
              {referralLink}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(referralLink, 'link')}
              className="gap-1.5 shrink-0 border-[#0066CC] text-[#0066CC] hover:bg-[#0066CC]/10"
            >
              <Link className="h-4 w-4" />
              {copiedLink ? 'Copiado!' : 'Copiar'}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="gap-1.5 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10"
            >
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="gap-1.5 border-[#4B5563] text-[#4B5563] hover:bg-[#4B5563]/10"
            >
              <a
                href={`mailto:?subject=${encodeURIComponent('Experimente o CrescitechMD!')}&body=${encodeURIComponent(shareMessage)}`}
              >
                <Mail className="h-4 w-4" />
                Email
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Como funciona */}
      <Card className="border-[#E5E7EB]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium uppercase tracking-wider text-[#4B5563]">
            Como Funciona
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0066CC] text-sm font-bold text-white">
                1
              </div>
              <div>
                <p className="font-medium text-[#111827]">Compartilhe</p>
                <p className="text-sm text-[#4B5563]">
                  Envie seu link para amigos
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0066CC] text-sm font-bold text-white">
                2
              </div>
              <div>
                <p className="font-medium text-[#111827]">Amigo se cadastra</p>
                <p className="text-sm text-[#4B5563]">
                  Ele ganha +5 créditos bônus
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#10B981] text-sm font-bold text-white">
                3
              </div>
              <div>
                <p className="font-medium text-[#111827]">Você ganha</p>
                <p className="text-sm text-[#4B5563]">
                  +10 créditos quando ele assina
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
