import { Metadata } from 'next'
import { LandingHeader } from '@/components/landing/LandingHeader'
import { Footer } from '@/components/landing/Footer'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description:
    'Política de Privacidade do CrescitechMD em conformidade com a LGPD. Saiba como seus dados pessoais são coletados, utilizados e protegidos.',
  openGraph: {
    title: 'Política de Privacidade - CrescitechMD',
    description:
      'Saiba como seus dados pessoais são coletados, utilizados e protegidos conforme a LGPD.',
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />

      <main className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="prose prose-gray mx-auto max-w-3xl">
          <h1 className="text-center text-3xl font-semibold text-[#111827] sm:text-4xl">
            Política de Privacidade
          </h1>
          <p className="text-center text-sm text-[#6B7280]">
            Última atualização: 7 de março de 2026
          </p>

          <h2>1. Introdução e Responsável</h2>
          <p>
            A presente Política de Privacidade descreve como o CrescitechMD
            (&quot;nós&quot;, &quot;nosso&quot;), operado pela Crescitech,
            coleta, utiliza, armazena e protege os dados pessoais dos
            usuários, em conformidade com a Lei Geral de Proteção de Dados
            Pessoais (Lei nº 13.709/2018 — LGPD).
          </p>

          <h2>2. Dados Coletados</h2>
          <p>Coletamos os seguintes dados pessoais:</p>
          <ul>
            <li>
              <strong>Dados de cadastro:</strong> nome completo, endereço de
              email e senha (armazenada em hash bcrypt).
            </li>
            <li>
              <strong>Dados de uso:</strong> histórico de conversões (nome do
              arquivo, data, status), créditos consumidos e plano contratado.
            </li>
            <li>
              <strong>Dados técnicos:</strong> endereço IP, user-agent do
              navegador e logs de acesso.
            </li>
            <li>
              <strong>Dados de pagamento:</strong> processados diretamente
              pelo Stripe. Não armazenamos dados de cartão de crédito em
              nossos servidores.
            </li>
          </ul>

          <h2>3. Finalidade do Tratamento</h2>
          <p>Seus dados pessoais são utilizados para:</p>
          <ul>
            <li>Criar e gerenciar sua conta na plataforma.</li>
            <li>Processar conversões de documentos e gerenciar créditos.</li>
            <li>Enviar emails transacionais (boas-vindas, confirmação de pagamento, alertas de crédito).</li>
            <li>Processar pagamentos e gerenciar assinaturas.</li>
            <li>Melhorar a qualidade e segurança do Serviço.</li>
            <li>Cumprir obrigações legais e regulatórias.</li>
          </ul>

          <h2>4. Base Legal (LGPD Art. 7º)</h2>
          <p>O tratamento de dados pessoais é realizado com base nas seguintes hipóteses legais:</p>
          <ul>
            <li>
              <strong>Execução de contrato</strong> (Art. 7º, V): para
              prestação do serviço de conversão de documentos conforme os
              Termos de Uso.
            </li>
            <li>
              <strong>Consentimento</strong> (Art. 7º, I): para envio de
              comunicações de marketing, quando aplicável.
            </li>
            <li>
              <strong>Legítimo interesse</strong> (Art. 7º, IX): para
              melhorias no Serviço e prevenção de fraudes.
            </li>
            <li>
              <strong>Cumprimento de obrigação legal</strong> (Art. 7º, II):
              para atender requisitos legais e regulatórios.
            </li>
          </ul>

          <h2>5. Compartilhamento de Dados</h2>
          <p>
            Seus dados podem ser compartilhados com os seguintes prestadores
            de serviço, estritamente para fins operacionais:
          </p>
          <ul>
            <li>
              <strong>Supabase:</strong> hospedagem do banco de dados
              (região sa-east-1, São Paulo).
            </li>
            <li>
              <strong>Stripe:</strong> processamento de pagamentos e
              gerenciamento de assinaturas.
            </li>
            <li>
              <strong>Vercel:</strong> hospedagem da aplicação web.
            </li>
            <li>
              <strong>Resend:</strong> envio de emails transacionais.
            </li>
          </ul>
          <p>
            Não vendemos, alugamos ou compartilhamos seus dados pessoais com
            terceiros para fins de marketing.
          </p>

          <h2>6. Retenção de Dados</h2>
          <ul>
            <li>
              <strong>Arquivos enviados:</strong> deletados imediatamente após
              a conversão. Não são armazenados em nossos servidores.
            </li>
            <li>
              <strong>Resultado da conversão (Markdown):</strong> mantido no
              histórico do usuário enquanto a conta estiver ativa.
            </li>
            <li>
              <strong>Logs de acesso:</strong> retidos por 90 dias para fins
              de segurança e auditoria.
            </li>
            <li>
              <strong>Contas inativas:</strong> dados de contas sem atividade
              por mais de 2 anos podem ser anonimizados ou excluídos, mediante
              notificação prévia por email.
            </li>
          </ul>

          <h2>7. Segurança</h2>
          <p>
            Adotamos medidas técnicas e organizacionais para proteger seus
            dados:
          </p>
          <ul>
            <li>
              Senhas armazenadas com hash bcrypt (não é possível
              recuperá-las em texto).
            </li>
            <li>
              Comunicação exclusivamente via HTTPS (TLS 1.2+).
            </li>
            <li>
              Tokens de sessão JWT com expiração de 7 dias.
            </li>
            <li>
              Banco de dados com criptografia em repouso e backups
              automáticos.
            </li>
            <li>
              Acesso restrito a dados em produção, limitado à equipe técnica
              autorizada.
            </li>
          </ul>

          <h2>8. Direitos do Titular</h2>
          <p>
            De acordo com a LGPD, você tem direito a:
          </p>
          <ul>
            <li>
              <strong>Acesso:</strong> solicitar cópia dos seus dados pessoais
              armazenados.
            </li>
            <li>
              <strong>Correção:</strong> solicitar correção de dados
              incompletos, inexatos ou desatualizados.
            </li>
            <li>
              <strong>Exclusão:</strong> solicitar a exclusão dos seus dados
              pessoais, salvo quando houver obrigação legal de retenção.
            </li>
            <li>
              <strong>Portabilidade:</strong> solicitar a transferência dos
              seus dados a outro fornecedor de serviço.
            </li>
            <li>
              <strong>Revogação do consentimento:</strong> revogar o
              consentimento dado anteriormente, quando aplicável.
            </li>
          </ul>
          <p>
            Para exercer qualquer destes direitos, entre em contato com nosso
            Encarregado de Proteção de Dados (DPO) pelo email indicado
            abaixo.
          </p>

          <h2>9. Cookies e Rastreamento</h2>
          <p>
            Utilizamos cookies estritamente necessários para o funcionamento
            do Serviço, incluindo cookies de sessão para autenticação. Não
            utilizamos cookies de rastreamento de terceiros ou publicidade.
          </p>

          <h2>10. Encarregado de Proteção de Dados (DPO)</h2>
          <p>
            Para questões relacionadas à privacidade e proteção de dados,
            entre em contato com nosso DPO:
          </p>
          <ul>
            <li>
              <strong>Nome:</strong> Yan Guilherme
            </li>
            <li>
              <strong>Email:</strong>{' '}
              <a href="mailto:yansilva@crescitech.com.br">yansilva@crescitech.com.br</a>
            </li>
          </ul>

          <h2>11. Alterações nesta Política</h2>
          <p>
            Esta Política de Privacidade pode ser atualizada periodicamente.
            Alterações significativas serão comunicadas por email com
            antecedência mínima de 15 dias. A data de última atualização é
            indicada no topo deste documento.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
