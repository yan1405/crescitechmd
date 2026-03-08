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

interface ConversionCompletedEmailProps {
  userName: string
  fileName: string
  downloadUrl: string
  creditsRemaining: number
}

export default function ConversionCompletedEmail({
  userName = 'Usuário',
  fileName = 'documento.pdf',
  downloadUrl = '#',
  creditsRemaining = 5,
}: ConversionCompletedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Conversão concluída: {fileName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={logo}>CrescitechMD</Heading>

          <Heading style={heading}>Conversão concluída!</Heading>

          <Text style={paragraph}>
            Olá, {userName}! Seu documento foi convertido com sucesso.
          </Text>

          <Section style={fileBox}>
            <Text style={fileLabel}>Arquivo convertido</Text>
            <Text style={fileName_}>{fileName.replace(/\.[^/.]+$/, '.md')}</Text>
          </Section>

          <Section style={buttonSection}>
            <Button style={button} href={downloadUrl}>
              Baixar Markdown
            </Button>
          </Section>

          <Section style={creditsBox}>
            <Text style={creditsText}>
              Créditos restantes: <strong>{creditsRemaining}</strong>
            </Text>
          </Section>

          {creditsRemaining <= 2 && (
            <Section style={alertBox}>
              <Text style={alertText}>
                Seus créditos estão acabando! Considere fazer upgrade do seu
                plano para continuar convertendo sem interrupções.
              </Text>
              <Button style={upgradeButton} href="https://crescitechmd.com/settings">
                Ver Planos
              </Button>
            </Section>
          )}

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

const fileBox = {
  backgroundColor: '#F3F4F6',
  borderRadius: '8px',
  padding: '16px 24px',
  margin: '0 0 24px',
}

const fileLabel = {
  color: '#6B7280',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  margin: '0 0 4px',
}

const fileName_ = {
  color: '#111827',
  fontSize: '16px',
  fontWeight: '600' as const,
  fontFamily: 'monospace',
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

const creditsBox = {
  textAlign: 'center' as const,
  margin: '0 0 16px',
}

const creditsText = {
  color: '#4B5563',
  fontSize: '14px',
  margin: '0',
}

const alertBox = {
  backgroundColor: '#FEF3C7',
  border: '1px solid #F59E0B33',
  borderRadius: '8px',
  padding: '16px 24px',
  textAlign: 'center' as const,
  margin: '0 0 16px',
}

const alertText = {
  color: '#92400E',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 12px',
}

const upgradeButton = {
  backgroundColor: '#F59E0B',
  borderRadius: '6px',
  color: '#FFFFFF',
  fontSize: '14px',
  fontWeight: '600' as const,
  textDecoration: 'none',
  padding: '10px 24px',
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
