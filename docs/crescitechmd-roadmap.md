# CrescitechMD - Roadmap de Desenvolvimento

**Duração total:** 4 semanas  
**Início:** 03/03/2026  
**Lançamento MVP:** 31/03/2026

---

## Semana 1: Fundação e autenticação (03/03 - 09/03)

### Objetivos
- Setup completo do projeto
- Sistema de autenticação funcional
- Landing page básica

### Sprint 1.1: Setup do projeto (Dia 1-2)

**Tasks:**
- [ ] Criar projeto Next.js 14 com TypeScript
  ```bash
  npx create-next-app@latest crescitechmd --typescript --tailwind --app
  ```
- [ ] Configurar Tailwind CSS + shadcn/ui
  ```bash
  npx shadcn-ui@latest init
  ```
- [ ] Setup Prisma + PostgreSQL (Supabase)
  ```bash
  npm install prisma @prisma/client
  npx prisma init
  ```
- [ ] Configurar variáveis de ambiente (.env.local)
- [ ] Setup GitHub repository + Vercel deployment
- [ ] Configurar ESLint + Prettier

**Entregável:** Projeto rodando em localhost e deploy inicial na Vercel

---

### Sprint 1.2: Autenticação (Dia 3-4)

**Tasks:**
- [ ] Instalar NextAuth.js v5
  ```bash
  npm install next-auth@beta
  ```
- [ ] Criar schema Prisma (User, Credits)
- [ ] Implementar provider de credenciais (email + senha)
- [ ] Criar páginas de login e signup
- [ ] Implementar validação com Zod
- [ ] Hash de senhas com bcrypt
- [ ] Middleware de proteção de rotas
- [ ] Testes de autenticação

**Componentes:**
- `app/(auth)/login/page.tsx`
- `app/(auth)/signup/page.tsx`
- `components/auth/LoginForm.tsx`
- `components/auth/SignupForm.tsx`
- `app/api/auth/[...nextauth]/route.ts`

**Entregável:** Usuário consegue criar conta, fazer login e logout

---

### Sprint 1.3: Dashboard básico (Dia 5)

**Tasks:**
- [ ] Layout do dashboard com sidebar
- [ ] Página inicial do dashboard
- [ ] Exibir informações do usuário
- [ ] Mostrar créditos disponíveis
- [ ] Botão de logout

**Componentes:**
- `app/(dashboard)/layout.tsx`
- `app/(dashboard)/dashboard/page.tsx`
- `components/dashboard/Sidebar.tsx`
- `components/dashboard/Header.tsx`
- `components/dashboard/CreditsDisplay.tsx`

**Entregável:** Dashboard funcional com informações básicas

---

### Sprint 1.4: Landing page (Dia 6-7)

**Tasks:**
- [ ] Hero section com CTA
- [ ] Seção "Como funciona" (3 passos)
- [ ] Seção de pricing (4 planos)
- [ ] FAQ (5-7 perguntas)
- [ ] CTA final
- [ ] Rodapé completo
- [ ] Responsividade mobile

**Componentes:**
- `app/page.tsx`
- `components/landing/Hero.tsx`
- `components/landing/HowItWorks.tsx`
- `components/landing/Pricing.tsx`
- `components/landing/FAQ.tsx`
- `components/landing/Footer.tsx`

**Entregável:** Landing page completa e responsiva

---

## Semana 2: Core de conversão (10/03 - 16/03)

### Objetivos
- Sistema de conversão funcionando
- Integração com Docling
- Sistema de créditos operacional

### Sprint 2.1: Setup Docling (Dia 1-2)

**Tasks:**
- [ ] Instalar Python dependencies
  ```bash
  pip install docling --break-system-packages
  ```
- [ ] Criar script Python para conversão
- [ ] Testar Docling localmente com arquivos exemplo
- [ ] Implementar timeout de 60 segundos
- [ ] Tratamento de erros do Docling

**Arquivos:**
- `lib/docling/convert.py`
- `lib/docling.ts` (wrapper Node.js)

**Entregável:** Script Python converte PDF/DOCX para Markdown

---

### Sprint 2.2: API de upload e conversão (Dia 3-4)

**Tasks:**
- [ ] API route para upload de arquivo
- [ ] Validação de tipo MIME e tamanho
- [ ] Salvar arquivo temporário em /tmp
- [ ] Executar conversão com Docling
- [ ] Upload do .md para Vercel Blob
- [ ] Deletar arquivo original
- [ ] Decrementar crédito do usuário
- [ ] Criar registro em Conversion

**Componentes:**
- `app/api/convert/route.ts`
- `lib/blob-storage.ts`
- `lib/file-validation.ts`

**Entregável:** API que recebe arquivo e retorna Markdown

---

### Sprint 2.3: Interface de conversão (Dia 5-6)

**Tasks:**
- [ ] Página de conversão com dropzone
- [ ] Drag & drop de arquivo
- [ ] Validação frontend (tipo + tamanho)
- [ ] Loading state durante conversão
- [ ] Preview do Markdown gerado
- [ ] Botão de download
- [ ] Opções de customização (imagens, tabelas)
- [ ] Mensagens de erro amigáveis

**Componentes:**
- `app/(dashboard)/convert/page.tsx`
- `components/convert/FileUpload.tsx`
- `components/convert/ConversionOptions.tsx`
- `components/convert/MarkdownPreview.tsx`

**Entregável:** Usuário consegue converter arquivo completo

---

### Sprint 2.4: Histórico de conversões (Dia 7)

**Tasks:**
- [ ] Página de histórico
- [ ] Lista de conversões anteriores
- [ ] Filtros (data, formato, status)
- [ ] Busca por nome de arquivo
- [ ] Re-download de arquivos
- [ ] Visualizar preview
- [ ] Deletar conversão

**Componentes:**
- `app/(dashboard)/history/page.tsx`
- `components/history/ConversionList.tsx`
- `components/history/ConversionCard.tsx`

**Entregável:** Histórico completo e funcional

---

## Semana 3: Pagamentos e admin (17/03 - 23/03)

### Objetivos
- Integração Stripe completa
- Dashboard administrativo
- Sistema de logs

### Sprint 3.1: Setup Stripe (Dia 1-2)

**Tasks:**
- [ ] Criar conta Stripe (modo teste)
- [ ] Criar produtos e preços
  - BÁSICO: R$ 9/mês
  - PRO: R$ 19/mês
  - BUSINESS: R$ 39/mês
- [ ] Instalar Stripe SDK
  ```bash
  npm install @stripe/stripe-js stripe
  ```
- [ ] Configurar webhooks
- [ ] Criar schema Subscription

**Entregável:** Produtos configurados no Stripe

---

### Sprint 3.2: Checkout e assinaturas (Dia 3-4)

**Tasks:**
- [ ] API para criar checkout session
- [ ] Página de pricing com botões de assinatura
- [ ] Redirecionamento para Stripe Checkout
- [ ] Webhook: checkout.session.completed
- [ ] Atualizar plano do usuário
- [ ] Atualizar créditos
- [ ] Enviar email de confirmação

**Componentes:**
- `app/api/stripe/create-checkout/route.ts`
- `app/api/webhooks/stripe/route.ts`
- `components/pricing/PlanCard.tsx`

**Entregável:** Usuário consegue assinar plano pago

---

### Sprint 3.3: Gestão de assinaturas (Dia 5)

**Tasks:**
- [ ] Página de configurações
- [ ] Exibir plano atual
- [ ] Botão de upgrade/downgrade
- [ ] Prorrateio automático (Stripe)
- [ ] Cancelamento de assinatura
- [ ] Portal do cliente Stripe
- [ ] Histórico de faturas

**Componentes:**
- `app/(dashboard)/settings/page.tsx`
- `components/settings/SubscriptionPanel.tsx`
- `components/settings/BillingHistory.tsx`

**Entregável:** Gestão completa de assinaturas

---

### Sprint 3.4: Dashboard administrativo (Dia 6-7)

**Tasks:**
- [ ] Rota protegida /admin (role check)
- [ ] Métricas principais:
  - Total de usuários
  - MRR
  - Conversões por dia
  - Taxa de conversão free→pago
- [ ] Gráficos com Recharts
- [ ] Lista de usuários com filtros
- [ ] Ações admin:
  - Adicionar/remover créditos
  - Alterar plano
  - Suspender conta
- [ ] Google Analytics 4 integration

**Componentes:**
- `app/(admin)/admin/page.tsx`
- `components/admin/MetricsCard.tsx`
- `components/admin/UserTable.tsx`
- `components/admin/Charts.tsx`

**Entregável:** Dashboard admin funcional

---

## Semana 4: Polimento e lançamento (24/03 - 31/03)

### Objetivos
- Sistema de referência
- Email transacional
- Testes finais
- Deploy produção

### Sprint 4.1: Sistema de referência (Dia 1-2)

**Tasks:**
- [ ] Criar schema Referral
- [ ] Gerar códigos únicos (nanoid)
- [ ] Página de referência
- [ ] Link de compartilhamento
- [ ] Tracking de indicações
- [ ] Bônus de créditos automático
- [ ] Dashboard de indicações

**Componentes:**
- `app/(dashboard)/referral/page.tsx`
- `components/referral/ReferralCode.tsx`
- `components/referral/ReferralStats.tsx`

**Entregável:** Sistema de referência completo

---

### Sprint 4.2: Email transacional (Dia 3)

**Tasks:**
- [ ] Setup Resend + React Email
- [ ] Template de boas-vindas
- [ ] Template de conversão concluída
- [ ] Template de créditos esgotados
- [ ] Template de confirmação de pagamento
- [ ] Template de cancelamento
- [ ] Envio via API routes

**Arquivos:**
- `emails/welcome.tsx`
- `emails/conversion-completed.tsx`
- `emails/credits-depleted.tsx`
- `lib/email.ts`

**Entregável:** Emails sendo enviados corretamente

---

### Sprint 4.3: Suporte e FAQ (Dia 4)

**Tasks:**
- [ ] Integrar chatbot (Crisp ou Tawk.to)
- [ ] Criar FAQ completo
- [ ] Adicionar WhatsApp no rodapé
- [ ] Página de contato
- [ ] Termos de Uso
- [ ] Política de Privacidade (LGPD)

**Componentes:**
- `app/faq/page.tsx`
- `app/contact/page.tsx`
- `app/terms/page.tsx`
- `app/privacy/page.tsx`

**Entregável:** Canais de suporte operacionais

---

### Sprint 4.4: Testes e otimizações (Dia 5-6)

**Tasks:**
- [ ] Testes end-to-end com Playwright
- [ ] Testes de carga (conversões simultâneas)
- [ ] Otimização de queries (índices)
- [ ] Lighthouse audit (performance)
- [ ] Acessibilidade (WCAG AA)
- [ ] SEO (meta tags, sitemap)
- [ ] Verificação LGPD
- [ ] Correção de bugs

**Entregável:** Aplicação testada e otimizada

---

### Sprint 4.5: Deploy produção (Dia 7)

**Tasks:**
- [ ] Migrar banco para produção (Supabase)
- [ ] Configurar variáveis de ambiente produção
- [ ] Ativar modo production Stripe
- [ ] Configurar domínio customizado
- [ ] SSL certificate
- [ ] Google Analytics em produção
- [ ] Monitoring (Vercel Analytics)
- [ ] Backup inicial do banco
- [ ] Smoke tests em produção

**Entregável:** CrescitechMD live em produção 🚀

---

## Checklist pré-lançamento

### Funcional
- [ ] Autenticação funcionando
- [ ] Conversão de todos os formatos
- [ ] Sistema de créditos preciso
- [ ] Pagamentos Stripe operacionais
- [ ] Histórico salvando corretamente
- [ ] Emails sendo enviados
- [ ] Referências gerando bônus

### Performance
- [ ] Lighthouse score > 90
- [ ] Tempo de conversão < 60s
- [ ] Página carrega em < 3s
- [ ] Mobile responsivo 100%

### Segurança
- [ ] HTTPS ativo
- [ ] Senhas criptografadas
- [ ] CSRF protection
- [ ] Rate limiting configurado
- [ ] Logs de auditoria funcionando

### Legal
- [ ] Termos de Uso publicados
- [ ] Política de Privacidade (LGPD)
- [ ] Cookie consent
- [ ] Opção de deletar dados

### Marketing
- [ ] Landing page completa
- [ ] SEO otimizado
- [ ] Google Analytics configurado
- [ ] Redes sociais criadas
- [ ] Email de lançamento preparado

---

## Métricas de sucesso (Primeira semana)

| Métrica | Meta |
|---------|------|
| Usuários cadastrados | 50 |
| Taxa de ativação (primeira conversão) | 60% |
| Conversões totais | 200 |
| Assinantes pagos | 5 |
| MRR | R$ 100 |
| Referências criadas | 10 |

---

## Próximos passos (Pós-MVP)

### Fase 2 (Mês 2)
- API pública para desenvolvedores
- Conversão em lote (múltiplos arquivos)
- Integração com Google Drive
- Tema dark mode
- App mobile (React Native)

### Fase 3 (Mês 3)
- OCR avançado para imagens
- Suporte a mais formatos (EPUB, RTF)
- Templates de Markdown customizados
- Colaboração em equipe (BUSINESS)
- Webhooks para notificações

---

**Última atualização:** 01/03/2026  
**Status:** Ready to start 🚀
