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

interface PaymentConfirmedEmailProps {
  userName: string
  plan: string
  credits: number
}

const PLAN_LABELS: Record<string, string> = {
  FREE: 'Gratuito',
  BASIC: 'Básico',
  PRO: 'Pro',
  BUSINESS: 'Business',
}

export default function PaymentConfirmedEmail({
  userName = 'Usuário',
  plan = 'PRO',
  credits = 200,
}: PaymentConfirmedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Assinatura ativada — Plano {PLAN_LABELS[plan] || plan}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={logo}>CrescitechMD</Heading>

          <Section style={successBox}>
            <Text style={checkmark}>&#10003;</Text>
            <Text style={successLabel}>Pagamento confirmado</Text>
          </Section>

          <Heading style={heading}>
            Bem-vindo ao plano {PLAN_LABELS[plan] || plan}!
          </Heading>

          <Text style={paragraph}>
            Olá, {userName}! Sua assinatura foi ativada com sucesso. Agora você
            tem acesso a todos os recursos do plano{' '}
            <strong>{PLAN_LABELS[plan] || plan}</strong>.
          </Text>

          <Section style={detailsBox}>
            <table style={detailsTable}>
              <tbody>
                <tr>
                  <td style={detailLabel}>Plano</td>
                  <td style={detailValue}>{PLAN_LABELS[plan] || plan}</td>
                </tr>
                <tr>
                  <td style={detailLabel}>Créditos/mês</td>
                  <td style={detailValue}>{credits}</td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Section style={buttonSection}>
            <Button style={button} href="https://crescitechmd.com/dashboard">
              Ir ao Dashboard
            </Button>
          </Section>

          <Text style={smallText}>
            Gerencie sua assinatura a qualquer momento em Configurações.
          </Text>

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

const successBox = {
  backgroundColor: '#D1FAE5',
  border: '1px solid #10B98133',
  borderRadius: '12px',
  padding: '24px',
  textAlign: 'center' as const,
  margin: '0 0 24px',
}

const checkmark = {
  color: '#10B981',
  fontSize: '36px',
  fontWeight: '700' as const,
  margin: '0',
}

const successLabel = {
  color: '#065F46',
  fontSize: '14px',
  fontWeight: '500' as const,
  margin: '4px 0 0',
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
  margin: '0 0 24px',
}

const detailsBox = {
  backgroundColor: '#F3F4F6',
  borderRadius: '8px',
  padding: '16px 24px',
  margin: '0 0 24px',
}

const detailsTable = {
  width: '100%',
}

const detailLabel = {
  color: '#6B7280',
  fontSize: '13px',
  padding: '6px 0',
}

const detailValue = {
  color: '#111827',
  fontSize: '15px',
  fontWeight: '600' as const,
  textAlign: 'right' as const,
  padding: '6px 0',
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

const smallText = {
  color: '#6B7280',
  fontSize: '13px',
  textAlign: 'center' as const,
  margin: '0 0 16px',
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
