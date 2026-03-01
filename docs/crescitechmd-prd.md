# CrescitechMD - Product Requirements Document (PRD)

**Versão:** 1.0  
**Data:** 01/03/2026  
**Autor:** Yan Guilherme Oliveira da Silva  
**Empresa:** Crescitech

---

## 1. Visão geral do produto

### 1.1 Descrição
CrescitechMD é um SaaS B2C de conversão de documentos para Markdown utilizando o framework Docling. O produto oferece uma interface web intuitiva onde usuários convertem arquivos em Markdown através de um sistema de créditos com planos de assinatura mensais.

### 1.2 Objetivos do negócio
- Lançar MVP funcional em 4 semanas
- Modelo freemium para aquisição de usuários
- Receita recorrente via assinaturas Stripe
- Sistema viral através de programa de referência

### 1.3 Público-alvo
- Desenvolvedores que trabalham com documentação
- Profissionais que precisam converter documentos para Markdown
- Empresas que gerenciam documentação técnica
- Criadores de conteúdo que usam Markdown

---

## 2. Modelo de negócio

### 2.1 Sistema de créditos
- Cada conversão consome 1 crédito
- Créditos mensais resetam (não acumulam)
- Plano gratuito renova 5 créditos todo mês
- Conversões em lote: Não (apenas 1 arquivo por vez)

### 2.2 Planos de assinatura

| Plano | Preço/mês | Créditos | Tamanho máximo | Diferenciais |
|-------|-----------|----------|----------------|--------------|
| FREE | R$ 0 | 5 | 5 MB | Básico |
| BÁSICO | R$ 9 | 50 | 10 MB | - |
| PRO | R$ 19 | 200 | 20 MB | - |
| BUSINESS | R$ 39 | 1000 | 50 MB | Suporte prioritário |

### 2.3 Formatos suportados
- **Documentos:** PDF, DOCX, PPTX, XLSX
- **Imagens:** PNG, JPEG/JPG (com OCR)
- **Web:** HTML

### 2.4 Sistema de referência
- Usuário ganha créditos bônus ao indicar amigos
- Indicado também recebe bônus no cadastro
- Códigos únicos de indicação por usuário
- Dashboard mostrando indicações realizadas

---

## 3. Funcionalidades principais

### 3.1 Autenticação
- **Método:** Email + senha tradicional
- **Tecnologia:** NextAuth.js v5
- **Segurança:** 
  - Senhas criptografadas com bcrypt
  - Sessões gerenciadas por JWT
  - Verificação de email obrigatória

### 3.2 Conversão de documentos

#### Fluxo de conversão
1. Usuário faz upload do arquivo
2. Validação frontend (tipo MIME + tamanho)
3. Verificação de créditos disponíveis
4. Processamento síncrono com Docling (timeout 1 min)
5. Preview do Markdown na tela
6. Botão de download do arquivo .md
7. Arquivo salvo no histórico permanente

#### Opções de customização
- Preservar imagens (inline base64 ou links)
- Manter formatação de tabelas
- Converter headers/títulos
- Preservar listas numeradas/bullets

#### Validação e erros
- **Frontend:** Valida tipo e tamanho antes de enviar
- **Backend:** Validação adicional + segurança
- **Mensagens de erro:** Específicas com sugestões
  - "Arquivo corrompido. Tente exportar novamente."
  - "Timeout após 60s. Reduza o tamanho."
  - "Formato inválido. Aceitos: PDF, DOCX, PPTX, XLSX, PNG, JPEG."

### 3.3 Histórico de conversões
- **Armazenamento:** Permanente
- **Conteúdo salvo:** Apenas arquivos .md convertidos
- **Arquivos originais:** Deletados após conversão
- **Interface:** Lista com filtros e busca
- **Ações:** Re-download, visualizar preview, deletar

### 3.4 Notificações por email
- Quando créditos acabarem
- Quando conversão for concluída (arquivos grandes)
- Boas-vindas no cadastro
- Confirmação de pagamento/cancelamento

---

## 4. Gestão de assinaturas

### 4.1 Stripe Integration
- **Produtos:** 3 planos pagos (Básico, Pro, Business)
- **Ciclo:** Mensal com renovação automática
- **Prorrateio:** Sim (upgrade/downgrade proporcional)
- **Webhooks:** 
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_failed`

### 4.2 Políticas de cobrança

#### Upgrade/Downgrade
- Efeito imediato com cobrança prorrateada
- Stripe calcula automaticamente proporção
- Créditos ajustados imediatamente ao novo plano

#### Falha de pagamento
- Suspensão imediata do plano
- Email de aviso enviado
- Usuário retorna ao plano FREE
- Mantém histórico de conversões

#### Cancelamento
- Usuário cancela e volta ao plano gratuito
- Mantém acesso até fim do ciclo pago
- Histórico preservado
- Créditos gratuitos (5) renovam no próximo mês

---

## 5. Dashboard administrativo

### 5.1 Métricas principais
- **MRR (Monthly Recurring Revenue)**
- Total de usuários cadastrados
- Conversões realizadas por dia
- Taxa de conversão free → pago
- Integração Google Analytics 4

### 5.2 Gestão de usuários
- Lista completa com filtros por plano
- Busca por email/nome
- Ações administrativas:
  - Visualizar histórico de conversões
  - Adicionar/remover créditos manualmente
  - Alterar plano
  - Suspender/reativar conta

### 5.3 Relatórios
- Gráfico de crescimento de usuários
- Funil de conversão (cadastro → primeiro pagamento)
- Análise de churn por plano
- Formatos mais convertidos

---

## 6. Landing page

### 6.1 Estrutura
1. **Hero section**
   - Headline: "Converta documentos para Markdown em segundos"
   - Subheadline explicativa
   - CTA: "Começar grátis"
   - GIF animado demonstrando conversão

2. **Como funciona** (3 passos)
   - Upload do arquivo
   - Conversão automática
   - Download do Markdown

3. **Pricing**
   - 4 cards de planos lado a lado
   - Destaque no plano PRO
   - Comparação de features

4. **FAQ**
   - 5-7 perguntas frequentes
   - Expansível/colapsável

5. **CTA final**
   - Reforço da proposta de valor
   - Botão de cadastro

6. **Rodapé**
   - Termos de Uso
   - Política de Privacidade
   - Contato
   - Redes Sociais
   - WhatsApp

### 6.2 Design
- **Estilo:** Minimalista corporativo
- **Cores:** Azul primário (#0066CC), branco, cinza claro
- **Tipografia:** Inter ou DM Sans
- **Responsividade:** Mobile-first

### 6.3 Social proof
- Não utilizar depoimentos fictícios
- Adicionar seção apenas com clientes reais
- Alternativa: Contador de conversões realizadas

---

## 7. Suporte ao cliente

### 7.1 Canais disponíveis
- Email: contato@crescitechmd.com
- FAQ completo na landing page
- Chatbot integrado (Crisp ou Tawk.to)
- WhatsApp Business (link no rodapé)

### 7.2 SLA por plano
- **FREE/BÁSICO:** Resposta em até 48h
- **PRO:** Resposta em até 24h
- **BUSINESS:** Resposta em até 12h (prioritário)

---

## 8. Segurança e privacidade (LGPD)

### 8.1 Proteção de dados
- Senhas criptografadas com bcrypt (salt rounds: 10)
- Dados sensíveis criptografados no PostgreSQL
- Comunicação via HTTPS (SSL da Vercel)
- Tokens JWT com expiração de 7 dias

### 8.2 Políticas de retenção
- **Arquivos originais:** Deletados após conversão
- **Arquivos .md convertidos:** Mantidos permanentemente
- **Logs de auditoria:** Retidos por 90 dias
- **Dados de usuários inativos:** Anonimizados após 2 anos

### 8.3 Logs de auditoria
- Registro completo de ações:
  - Login/logout com IP e timestamp
  - Conversões realizadas
  - Alterações de plano
  - Pagamentos e falhas
- Tabela `audit_logs` no PostgreSQL
- Acesso restrito ao dashboard admin

### 8.4 Conformidade LGPD
- Termo de aceite explícito no cadastro
- Opção de exportar dados pessoais
- Opção de deletar conta e dados
- Política de privacidade atualizada
- DPO: Yan Guilherme (yan@crescitech.com)

---

## 9. Requisitos técnicos

### 9.1 Performance
- Tempo de conversão: < 60 segundos (timeout)
- Tempo de carregamento da página: < 3s
- Uptime: 99.5% (monitorado via Vercel Analytics)

### 9.2 Escalabilidade
- Suporte inicial: 100 usuários simultâneos
- Arquitetura stateless (fácil escalonamento horizontal)
- CDN para assets estáticos (Vercel Edge Network)
- Banco otimizado com índices

### 9.3 Compatibilidade
- Navegadores: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Dispositivos móveis: iOS 14+, Android 10+
- Resolução mínima: 360px (mobile)

---

## 10. Métricas de sucesso

### 10.1 KPIs principais
- **Aquisição:** 100 usuários cadastrados no primeiro mês
- **Ativação:** 70% realizam primeira conversão
- **Receita:** R$ 500 MRR no primeiro mês
- **Retenção:** 40% retornam após 7 dias
- **Referência:** 20% indicam pelo menos 1 pessoa

### 10.2 Tracking
- Google Analytics 4 integrado
- Eventos customizados:
  - `signup_completed`
  - `first_conversion`
  - `plan_upgraded`
  - `referral_sent`
- Funil de conversão monitorado

---

## 11. Roadmap de lançamento

### Semana 1: Setup e autenticação
- Configuração Next.js + PostgreSQL + Vercel
- Sistema de autenticação com NextAuth
- Páginas de login/cadastro
- Dashboard básico

### Semana 2: Core de conversão
- Integração Docling
- Upload e validação de arquivos
- Sistema de créditos
- Preview e download de Markdown

### Semana 3: Pagamentos e admin
- Integração Stripe
- Webhooks de assinatura
- Dashboard administrativo
- Sistema de logs

### Semana 4: Landing e ajustes finais
- Landing page completa
- FAQ e suporte
- Testes de carga
- Deploy produção

---

## 12. Riscos e mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Docling lento para arquivos grandes | Média | Alto | Timeout de 60s + mensagem clara |
| Custo alto de storage | Baixa | Médio | Deletar originais, manter apenas .md |
| Fraude de créditos | Média | Alto | Rate limiting + validação backend |
| Churn alto no FREE | Alta | Médio | Programa de referência + email marketing |

---

## 13. Critérios de aceitação do MVP

- [ ] Usuário consegue criar conta e fazer login
- [ ] Usuário consegue converter PDF/DOCX para Markdown
- [ ] Sistema de créditos funciona corretamente
- [ ] Histórico de conversões é salvo
- [ ] Stripe processa pagamentos de forma segura
- [ ] Dashboard admin exibe métricas básicas
- [ ] Landing page está no ar e responsiva
- [ ] Sistema de referência gera códigos únicos
- [ ] Emails transacionais são enviados
- [ ] LGPD: termo de aceite + deleção de dados

---

**Aprovação:** ___________________________  
**Data:** ___/___/______
