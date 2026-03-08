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

interface WelcomeEmailProps {
  userName: string
  referralCode: string
  credits: number
}

export default function WelcomeEmail({
  userName = 'Usuário',
  referralCode = 'XXXXXXXX',
  credits = 5,
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{`Bem-vindo ao CrescitechMD! Seus ${credits} créditos estão prontos.`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={logo}>CrescitechMD</Heading>

          <Heading style={heading}>Bem-vindo, {userName}!</Heading>

          <Text style={paragraph}>
            Sua conta foi criada com sucesso. Você já tem{' '}
            <strong>{credits} créditos</strong> disponíveis para converter
            documentos em Markdown com qualidade profissional.
          </Text>

          <Section style={statsBox}>
            <Text style={statsText}>
              <strong>{credits}</strong> créditos disponíveis
            </Text>
          </Section>

          <Section style={buttonSection}>
            <Button style={button} href="https://crescitechmd.com/convert">
              Converter Primeiro Documento
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={paragraph}>
            <strong>Indique amigos e ganhe mais créditos!</strong>
          </Text>
          <Text style={paragraph}>
            Seu código de indicação:{' '}
            <span style={codeStyle}>{referralCode}</span>
          </Text>
          <Text style={smallText}>
            Quando um amigo se cadastrar com seu código, ele ganha +5 créditos
            bônus. E quando ele assinar um plano pago, você ganha +10 créditos!
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

const statsBox = {
  backgroundColor: '#0066CC0D',
  border: '1px dashed #0066CC4D',
  borderRadius: '8px',
  padding: '16px 24px',
  textAlign: 'center' as const,
  margin: '0 0 24px',
}

const statsText = {
  color: '#0066CC',
  fontSize: '18px',
  margin: '0',
}

const buttonSection = {
  textAlign: 'center' as const,
  margin: '0 0 24px',
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

const codeStyle = {
  backgroundColor: '#0066CC0D',
  border: '1px solid #0066CC33',
  borderRadius: '4px',
  color: '#0066CC',
  fontFamily: 'monospace',
  fontSize: '16px',
  fontWeight: '700' as const,
  letterSpacing: '0.15em',
  padding: '4px 12px',
}

const smallText = {
  color: '#6B7280',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '0 0 16px',
}

const footer = {
  color: '#9CA3AF',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '0',
}
