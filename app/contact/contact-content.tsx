'use client'

import { useState } from 'react'
import { Mail, MessageCircle, Clock } from 'lucide-react'
import { toast } from 'sonner'

const subjects = [
  'Dúvida sobre o serviço',
  'Problema técnico',
  'Pagamentos e assinatura',
  'Solicitação LGPD',
  'Parceria comercial',
  'Outro',
]

export function ContactContent() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Erro ao enviar mensagem')
      }

      toast.success('Mensagem enviada com sucesso! Responderemos em breve.')
      form.reset()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erro ao enviar mensagem',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-center text-3xl font-semibold text-[#111827] sm:text-4xl">
          Entre em Contato
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-center text-[#4B5563]">
          Estamos aqui para ajudar. Escolha o melhor canal para falar conosco.
        </p>

        {/* Canais de contato */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-[#E5E7EB] p-6 text-center">
            <Mail className="mx-auto h-8 w-8 text-[#0066CC]" />
            <h3 className="mt-3 font-semibold text-[#111827]">Email</h3>
            <p className="mt-1 text-sm text-[#4B5563]">
              contato@crescitechmd.com
            </p>
          </div>

          <div className="rounded-lg border border-[#E5E7EB] p-6 text-center">
            <MessageCircle className="mx-auto h-8 w-8 text-[#25D366]" />
            <h3 className="mt-3 font-semibold text-[#111827]">WhatsApp</h3>
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm text-[#0066CC] hover:underline"
            >
              Abrir conversa
            </a>
          </div>

          <div className="rounded-lg border border-[#E5E7EB] p-6 text-center">
            <Clock className="mx-auto h-8 w-8 text-[#F59E0B]" />
            <h3 className="mt-3 font-semibold text-[#111827]">
              Tempo de resposta
            </h3>
            <div className="mt-1 space-y-0.5 text-sm text-[#4B5563]">
              <p>Free/Básico: até 48h</p>
              <p>Pro: até 24h</p>
              <p>Business: até 12h</p>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="mt-12 rounded-lg border border-[#E5E7EB] p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-[#111827]">
            Envie uma mensagem
          </h2>
          <p className="mt-1 text-sm text-[#4B5563]">
            Preencha o formulário abaixo e responderemos o mais breve possível.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-1 block text-sm font-medium text-[#111827]"
                >
                  Nome
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full rounded-md border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC] focus:outline-none"
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-[#111827]"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-md border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC] focus:outline-none"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="mb-1 block text-sm font-medium text-[#111827]"
              >
                Assunto
              </label>
              <select
                id="subject"
                name="subject"
                required
                className="w-full rounded-md border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC] focus:outline-none"
              >
                <option value="">Selecione um assunto</option>
                {subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-1 block text-sm font-medium text-[#111827]"
              >
                Mensagem
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full rounded-md border border-[#D1D5DB] px-3 py-2 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC] focus:outline-none"
                placeholder="Descreva como podemos ajudar..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-[#0066CC] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0052A3] disabled:opacity-50 sm:w-auto"
            >
              {loading ? 'Enviando...' : 'Enviar Mensagem'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
