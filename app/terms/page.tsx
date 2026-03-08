import { Metadata } from 'next'
import { LandingHeader } from '@/components/landing/LandingHeader'
import { Footer } from '@/components/landing/Footer'

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description:
    'Termos de Uso do CrescitechMD. Leia os termos e condições para utilização da plataforma de conversão de documentos para Markdown.',
  openGraph: {
    title: 'Termos de Uso - CrescitechMD',
    description:
      'Termos e condições para utilização da plataforma CrescitechMD.',
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />

      <main className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="prose prose-gray mx-auto max-w-3xl">
          <h1 className="text-center text-3xl font-semibold text-[#111827] sm:text-4xl">
            Termos de Uso
          </h1>
          <p className="text-center text-sm text-[#6B7280]">
            Última atualização: 7 de março de 2026
          </p>

          <h2>1. Aceitação dos Termos</h2>
          <p>
            Ao acessar ou utilizar a plataforma CrescitechMD
            (&quot;Serviço&quot;), você concorda em cumprir e estar vinculado
            a estes Termos de Uso. Se você não concorda com qualquer parte
            destes termos, não utilize o Serviço.
          </p>

          <h2>2. Descrição do Serviço</h2>
          <p>
            O CrescitechMD é uma plataforma SaaS que converte documentos nos
            formatos PDF, DOCX, PPTX, XLSX, PNG, JPEG e HTML para Markdown,
            utilizando tecnologia Docling. O Serviço é oferecido via web e
            opera no modelo de créditos por conversão.
          </p>

          <h2>3. Cadastro e Conta</h2>
          <p>
            Para utilizar o Serviço, você deve criar uma conta fornecendo nome,
            email e senha. Você é responsável por manter a confidencialidade de
            suas credenciais e por todas as atividades realizadas com sua conta.
            Notifique-nos imediatamente caso suspeite de uso não autorizado.
          </p>

          <h2>4. Planos e Pagamentos</h2>
          <p>
            O CrescitechMD oferece os seguintes planos de assinatura:
          </p>
          <ul>
            <li>
              <strong>Gratuito:</strong> 5 créditos/mês, sem custo.
            </li>
            <li>
              <strong>Básico:</strong> 50 créditos/mês por R$&nbsp;9,00/mês.
            </li>
            <li>
              <strong>Pro:</strong> 200 créditos/mês por R$&nbsp;19,00/mês.
            </li>
            <li>
              <strong>Business:</strong> 1.000 créditos/mês por
              R$&nbsp;39,00/mês.
            </li>
          </ul>
          <p>
            Pagamentos são processados via Stripe. Os valores podem ser
            atualizados mediante notificação prévia de 30 dias. Os créditos são
            renovados mensalmente e não acumulam entre períodos.
          </p>

          <h2>5. Créditos e Conversões</h2>
          <p>
            Cada conversão de documento consome 1 crédito. Os créditos são
            renovados no início de cada ciclo de faturamento. Créditos não
            utilizados não são transferidos para o próximo período. O Serviço
            pode impor limites de tamanho de arquivo (máximo 50 MB) e tempo de
            processamento (máximo 60 segundos).
          </p>

          <h2>6. Propriedade Intelectual</h2>
          <p>
            Você mantém todos os direitos sobre os documentos enviados para
            conversão. O CrescitechMD não reivindica propriedade sobre seu
            conteúdo. A marca CrescitechMD, logotipos e o software da
            plataforma são de propriedade exclusiva da Crescitech.
          </p>

          <h2>7. Uso Aceitável</h2>
          <p>Ao utilizar o Serviço, você concorda em não:</p>
          <ul>
            <li>
              Enviar conteúdo ilegal, difamatório, obsceno ou que viole
              direitos de terceiros.
            </li>
            <li>
              Tentar acessar áreas restritas do sistema ou de outros
              usuários.
            </li>
            <li>
              Utilizar bots, scripts ou ferramentas automatizadas para
              abusar do Serviço.
            </li>
            <li>
              Revender ou redistribuir o Serviço sem autorização prévia por
              escrito.
            </li>
          </ul>

          <h2>8. Limitação de Responsabilidade</h2>
          <p>
            O CrescitechMD é fornecido &quot;como está&quot;. Não garantimos
            que o Serviço será ininterrupto, livre de erros ou que os
            resultados de conversão serão 100% fiéis ao documento original. Em
            nenhuma circunstância seremos responsáveis por danos indiretos,
            incidentais, especiais ou consequentes.
          </p>

          <h2>9. Cancelamento e Reembolso</h2>
          <p>
            Você pode cancelar sua assinatura a qualquer momento através das
            Configurações da sua conta. O cancelamento entra em vigor ao final
            do período de faturamento vigente. Não são oferecidos reembolsos
            proporcionais por períodos parciais. Após o cancelamento, sua
            conta reverte para o plano Gratuito.
          </p>

          <h2>10. Alterações nos Termos</h2>
          <p>
            Reservamo-nos o direito de modificar estes Termos a qualquer
            momento. Alterações significativas serão comunicadas por email com
            antecedência mínima de 15 dias. O uso continuado do Serviço após a
            notificação constitui aceitação dos novos termos.
          </p>

          <h2>11. Foro e Lei Aplicável</h2>
          <p>
            Estes Termos são regidos pelas leis da República Federativa do
            Brasil. Fica eleito o foro da Comarca de São Paulo/SP para
            dirimir quaisquer controvérsias oriundas deste documento, com
            renúncia a qualquer outro, por mais privilegiado que seja.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
