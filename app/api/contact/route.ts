import { NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'

const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  subject: z.string().min(1, 'Selecione um assunto'),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
})

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = contactSchema.parse(body)

    const resend = getResendClient()
    if (!resend) {
      return NextResponse.json(
        { error: 'Serviço de email não configurado' },
        { status: 500 },
      )
    }

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'CrescitechMD <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL || 'contato@crescitechmd.com',
      replyTo: data.email,
      subject: `[Contato] ${data.subject}`,
      html: `
        <h2>Nova mensagem de contato</h2>
        <p><strong>Nome:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Assunto:</strong> ${data.subject}</p>
        <hr />
        <p>${data.message.replace(/\n/g, '<br />')}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues[0].message },
        { status: 400 },
      )
    }
    console.error('Contact form error:', err)
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem' },
      { status: 500 },
    )
  }
}
