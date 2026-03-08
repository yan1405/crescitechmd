import { Resend } from 'resend'
import { render } from '@react-email/render'
import WelcomeEmail from '@/emails/welcome'
import ConversionCompletedEmail from '@/emails/conversion-completed'
import CreditsDepletedEmail from '@/emails/credits-depleted'
import PaymentConfirmedEmail from '@/emails/payment-confirmed'
import SubscriptionCanceledEmail from '@/emails/subscription-canceled'

const EMAIL_FROM = process.env.RESEND_FROM_EMAIL || 'CrescitechMD <onboarding@resend.dev>'

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return null
  }
  return new Resend(apiKey)
}

// ============================================================
// Email sending functions (fire-and-forget)
// ============================================================

export async function sendWelcomeEmail(
  name: string,
  email: string,
  referralCode: string,
  credits: number,
) {
  try {
    const html = await render(
      WelcomeEmail({ userName: name, referralCode, credits }),
    )
    const resend = getResendClient()
    if (!resend) return
    await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: `Bem-vindo ao CrescitechMD, ${name}!`,
      html,
    })
  } catch (err) {
    console.error('Failed to send welcome email:', err)
  }
}

export async function sendConversionCompletedEmail(
  name: string,
  email: string,
  fileName: string,
  downloadUrl: string,
  creditsRemaining: number,
) {
  try {
    const html = await render(
      ConversionCompletedEmail({ userName: name, fileName, downloadUrl, creditsRemaining }),
    )
    const resend = getResendClient()
    if (!resend) return
    await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: `Conversão concluída: ${fileName}`,
      html,
    })
  } catch (err) {
    console.error('Failed to send conversion completed email:', err)
  }
}

export async function sendCreditsDepletedEmail(
  name: string,
  email: string,
  plan: string,
) {
  try {
    const html = await render(
      CreditsDepletedEmail({ userName: name, plan }),
    )
    const resend = getResendClient()
    if (!resend) return
    await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: 'Seus créditos de conversão acabaram',
      html,
    })
  } catch (err) {
    console.error('Failed to send credits depleted email:', err)
  }
}

export async function sendPaymentConfirmedEmail(
  name: string,
  email: string,
  plan: string,
  credits: number,
) {
  try {
    const html = await render(
      PaymentConfirmedEmail({ userName: name, plan, credits }),
    )
    const resend = getResendClient()
    if (!resend) return
    await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: `Assinatura ativada — Plano ${plan}`,
      html,
    })
  } catch (err) {
    console.error('Failed to send payment confirmed email:', err)
  }
}

export async function sendSubscriptionCanceledEmail(
  name: string,
  email: string,
  plan: string,
) {
  try {
    const html = await render(
      SubscriptionCanceledEmail({ userName: name, plan }),
    )
    const resend = getResendClient()
    if (!resend) return
    await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: 'Sua assinatura foi cancelada',
      html,
    })
  } catch (err) {
    console.error('Failed to send subscription canceled email:', err)
  }
}
