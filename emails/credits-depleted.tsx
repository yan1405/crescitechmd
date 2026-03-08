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

interface CreditsDepletedEmailProps {
  userName: string
  plan: string
}

const PLAN_LABELS: Record<string, string> = {
  FREE: 'Gratuito',
  BASIC: 'Básico',
  PRO: 'Pro',
  BUSINESS: 'Business',
}

export default function CreditsDepletedEmail({
  userName = 'Usuário',
  plan = 'FREE',
}: CreditsDepletedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Seus créditos de conversão acabaram</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={logo}>CrescitechMD</Heading>

          <Section style={alertBox}>
            <Text style={alertIcon}>0</Text>
            <Text style={alertLabel}>créditos restantes</Text>
          </Section>

          <Heading style={heading}>
            {userName}, seus créditos acabaram!
          </Heading>

          <Text style={paragraph}>
            Você utilizou todos os créditos do seu plano{' '}
            <strong>{PLAN_LABELS[plan] || plan}</strong>. Para continuar
            convertendo documentos, faça upgrade para um plano com mais
            créditos.
          </Text>

          <Section style={plansTable}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>Plano</th>
                  <th style={th}>Créditos/mês</th>
                  <th style={th}>Preço</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={td}>Básico</td>
                  <td style={td}>50</td>
                  <td style={td}>R$ 9/mês</td>
                </tr>
                <tr style={highlightRow}>
                  <td style={td}>Pro</td>
                  <td style={td}>200</td>
                  <td style={td}>R$ 19/mês</td>
                </tr>
                <tr>
                  <td style={td}>Business</td>
                  <td style={td}>1.000</td>
                  <td style={td}>R$ 39/mês</td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Section style={buttonSection}>
            <Button style={button} href="https://crescitechmd.com/settings">
              Fazer Upgrade
            </Button>
          </Section>

          <Text style={smallText}>
            Ou indique amigos e ganhe créditos bônus! Acesse a página de
            referências no seu painel.
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

const alertBox = {
  backgroundColor: '#FEF3C7',
  border: '1px solid #F59E0B4D',
  borderRadius: '12px',
  padding: '24px',
  textAlign: 'center' as const,
  margin: '0 0 24px',
}

const alertIcon = {
  color: '#F59E0B',
  fontSize: '40px',
  fontWeight: '800' as const,
  margin: '0',
}

const alertLabel = {
  color: '#92400E',
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

const plansTable = {
  margin: '0 0 24px',
}

const table = {
  width: '100%',
  borderCollapse: 'collapse' as const,
}

const th = {
  backgroundColor: '#F3F4F6',
  color: '#6B7280',
  fontSize: '12px',
  fontWeight: '600' as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  padding: '10px 16px',
  textAlign: 'left' as const,
  borderBottom: '1px solid #E5E7EB',
}

const td = {
  color: '#111827',
  fontSize: '14px',
  padding: '12px 16px',
  borderBottom: '1px solid #E5E7EB',
}

const highlightRow = {
  backgroundColor: '#0066CC08',
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
  lineHeight: '20px',
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
