import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface SubscriptionCanceledEmailProps {
  userName: string
  plan: string
}

const PLAN_LABELS: Record<string, string> = {
  FREE: 'Gratuito',
  BASIC: 'Básico',
  PRO: 'Pro',
  BUSINESS: 'Business',
}

export default function SubscriptionCanceledEmail({
  userName = 'Usuário',
  plan = 'PRO',
}: SubscriptionCanceledEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Sua assinatura do plano {PLAN_LABELS[plan] || plan} foi cancelada</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={logo}>CrescitechMD</Heading>

          <Heading style={heading}>Assinatura cancelada</Heading>

          <Text style={paragraph}>
            Olá, {userName}. Confirmamos o cancelamento do seu plano{' '}
            <strong>{PLAN_LABELS[plan] || plan}</strong>.
          </Text>

          <Section style={infoBox}>
            <Text style={infoText}>
              Sua conta foi alterada para o plano <strong>Gratuito</strong> com{' '}
              <strong>5 créditos/mês</strong>. Seus documentos convertidos
              anteriormente continuam disponíveis no seu histórico.
            </Text>
          </Section>

          <Text style={paragraph}>
            Sentiremos sua falta! Se mudar de ideia, você pode reativar sua
            assinatura a qualquer momento.
          </Text>

          <Section style={buttonSection}>
            <Button style={button} href="https://crescitechmd.com/settings">
              Reativar Assinatura
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            CrescitechMD — Conversão inteligente de documentos para Markdown
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#F9FAFB',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '40px 24px',
  maxWidth: '600px',
}

const logo = {
  color: '#0066CC',
  fontSize: '24px',
  fontWeight: '700' as const,
  textAlign: 'center' as const,
  margin: '0 0 32px',
}

const heading = {
  color: '#111827',
  fontSize: '22px',
  fontWeight: '600' as const,
  margin: '0 0 16px',
}

const paragraph = {
  color: '#4B5563',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 16px',
}

const infoBox = {
  backgroundColor: '#F3F4F6',
  borderRadius: '8px',
  padding: '16px 24px',
  margin: '0 0 16px',
}

const infoText = {
  color: '#4B5563',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
}

const buttonSection = {
  textAlign: 'center' as const,
  margin: '0 0 16px',
}

const button = {
  backgroundColor: '#0066CC',
  borderRadius: '6px',
  color: '#FFFFFF',
  fontSize: '15px',
  fontWeight: '600' as const,
  textDecoration: 'none',
  padding: '12px 32px',
  display: 'inline-block' as const,
}

const hr = {
  borderColor: '#E5E7EB',
  margin: '24px 0',
}

const footer = {
  color: '#9CA3AF',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '0',
}
