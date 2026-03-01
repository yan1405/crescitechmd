# CrescitechMD - Arquitetura Técnica

**Versão:** 1.0  
**Data:** 01/03/2026

---

## 1. Stack tecnológica

### 1.1 Frontend
- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Componentes:** shadcn/ui
- **Validação:** Zod
- **Estado:** React Context API + useState
- **Formulários:** React Hook Form

### 1.2 Backend
- **Runtime:** Next.js API Routes (Node.js)
- **Processamento:** Docling (Python via subprocess)
- **Validação:** Zod schemas
- **ORM:** Prisma
- **Autenticação:** NextAuth.js v5

### 1.3 Banco de dados
- **Primary:** PostgreSQL 15+
- **Provider:** Supabase (tier gratuito inicial)
- **ORM:** Prisma
- **Migrações:** Prisma Migrate

### 1.4 Storage
- **Arquivos temporários:** /tmp (Vercel serverless)
- **Arquivos convertidos:** Vercel Blob Storage
- **Limite:** 1GB inicial (tier gratuito)

### 1.5 Pagamentos
- **Processador:** Stripe
- **SDK:** @stripe/stripe-js
- **Webhooks:** /api/webhooks/stripe
- **Modo:** Test + Production

### 1.6 Email
- **Provider:** Resend
- **Templates:** React Email
- **Domínio:** @crescitechmd.com
- **Tipos:** Transacionais + marketing

### 1.7 Monitoramento
- **Analytics:** Google Analytics 4
- **Logs:** Vercel Logs
- **Uptime:** Vercel Analytics
- **Erros:** Sentry (opcional fase 2)

### 1.8 Hospedagem
- **Plataforma:** Vercel
- **Tier:** Pro (R$ 100/mês após gratuito)
- **Regiões:** São Paulo (sa-east-1)
- **CDN:** Vercel Edge Network

---

## 2. Arquitetura de alto nível

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │    Mobile    │  │   Tablet     │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          └──────────────────┴──────────────────┘
                             │
                    ┌────────▼────────┐
                    │  Vercel CDN     │
                    │  (Edge Network) │
                    └────────┬────────┘
                             │
          ┌──────────────────┴──────────────────┐
          │                                     │
    ┌─────▼─────┐                     ┌────────▼────────┐
    │  Next.js  │                     │   Static Files  │
    │  App      │                     │   (Landing)     │
    └─────┬─────┘                     └─────────────────┘
          │
    ┌─────┴─────┐
    │           │
┌───▼───┐   ┌───▼───────┐
│ Pages │   │ API Routes│
│       │   │           │
└───────┘   └─────┬─────┘
                  │
        ┌─────────┼─────────┐
        │         │         │
    ┌───▼───┐ ┌──▼───┐ ┌───▼────┐
    │ Auth  │ │Upload│ │Convert │
    │NextAuth│ │File │ │Docling │
    └───┬───┘ └──┬───┘ └───┬────┘
        │        │         │
        └────────┴─────────┘
                 │
        ┌────────┴────────┐
        │                 │
   ┌────▼────┐     ┌──────▼──────┐
   │PostgreSQL│     │Vercel Blob  │
   │(Supabase)│     │   Storage   │
   └────┬────┘     └─────────────┘
        │
   ┌────▼────┐
   │ Stripe  │
   │Webhooks │
   └─────────┘
```

---

## 3. Fluxo de conversão de documentos

```
┌──────────────────────────────────────────────────────────────┐
│ 1. USUÁRIO FAZ UPLOAD                                         │
│    ┌──────────────┐                                          │
│    │  Seleciona   │                                          │
│    │   arquivo    │                                          │
│    └──────┬───────┘                                          │
└───────────┼──────────────────────────────────────────────────┘
            │
┌───────────▼──────────────────────────────────────────────────┐
│ 2. VALIDAÇÃO FRONTEND                                         │
│    ┌─────────────────────────────────────┐                  │
│    │ - Tipo MIME (PDF, DOCX, etc.)       │                  │
│    │ - Tamanho máximo (5/10/20/50 MB)    │                  │
│    │ - Extensão do arquivo               │                  │
│    └─────────┬───────────────────────────┘                  │
│              │ ✅ Válido                                      │
└──────────────┼──────────────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────────────┐
│ 3. ENVIO PARA API                                            │
│    POST /api/convert                                         │
│    ┌──────────────────────────────┐                         │
│    │ - FormData com arquivo       │                         │
│    │ - Token de autenticação      │                         │
│    │ - Opções de conversão        │                         │
│    └──────────┬───────────────────┘                         │
└───────────────┼─────────────────────────────────────────────┘
                │
┌───────────────▼─────────────────────────────────────────────┐
│ 4. VERIFICAÇÕES BACKEND                                      │
│    ┌────────────────────────────────────┐                   │
│    │ a) Usuário autenticado?            │                   │
│    │ b) Tem créditos disponíveis?       │                   │
│    │ c) Arquivo válido (tipo + tamanho)?│                   │
│    │ d) Rate limiting (10 req/min)      │                   │
│    └────────────┬───────────────────────┘                   │
│                 │ ✅ Aprovado                                 │
└─────────────────┼──────────────────────────────────────────┘
                  │
┌─────────────────▼──────────────────────────────────────────┐
│ 5. PROCESSAMENTO                                            │
│    ┌─────────────────────────────────────┐                 │
│    │ a) Salvar arquivo em /tmp           │                 │
│    │ b) Executar Docling via Python      │                 │
│    │ c) Aplicar opções customização      │                 │
│    │ d) Gerar arquivo .md                │                 │
│    │ e) Timeout: 60 segundos             │                 │
│    └─────────────┬───────────────────────┘                 │
└──────────────────┼─────────────────────────────────────────┘
                   │
┌──────────────────▼─────────────────────────────────────────┐
│ 6. PÓS-PROCESSAMENTO                                        │
│    ┌──────────────────────────────────────┐                │
│    │ a) Upload .md para Vercel Blob       │                │
│    │ b) Deletar arquivo original de /tmp  │                │
│    │ c) Decrementar crédito do usuário    │                │
│    │ d) Criar registro em 'conversions'   │                │
│    │ e) Enviar email de conclusão         │                │
│    └──────────────┬───────────────────────┘                │
└───────────────────┼────────────────────────────────────────┘
                    │
┌───────────────────▼────────────────────────────────────────┐
│ 7. RESPOSTA AO CLIENTE                                      │
│    ┌──────────────────────────────────┐                    │
│    │ {                                │                    │
│    │   success: true,                 │                    │
│    │   conversionId: "uuid",          │                    │
│    │   previewUrl: "blob://...",      │                    │
│    │   downloadUrl: "blob://...",     │                    │
│    │   creditsRemaining: 4            │                    │
│    │ }                                │                    │
│    └──────────────┬───────────────────┘                    │
└───────────────────┼────────────────────────────────────────┘
                    │
┌───────────────────▼────────────────────────────────────────┐
│ 8. INTERFACE MOSTRA RESULTADO                               │
│    ┌──────────────────────────────────┐                    │
│    │ - Preview do Markdown            │                    │
│    │ - Botão de download              │                    │
│    │ - Créditos restantes             │                    │
│    │ - Adicionar ao histórico         │                    │
│    └──────────────────────────────────┘                    │
└────────────────────────────────────────────────────────────┘
```

---

## 4. Fluxo de autenticação

```
┌──────────────────────────────────────────────────────────┐
│ REGISTRO                                                  │
│  1. Usuário preenche email + senha                       │
│  2. Validação Zod (email válido, senha >= 8 chars)       │
│  3. Backend verifica se email já existe                  │
│  4. Criptografa senha com bcrypt (10 rounds)             │
│  5. Cria registro em 'users' com plan='FREE'             │
│  6. Cria registro em 'credits' com amount=5              │
│  7. Envia email de boas-vindas                           │
│  8. Auto-login via NextAuth                              │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ LOGIN                                                     │
│  1. Usuário insere email + senha                         │
│  2. NextAuth busca usuário no banco                      │
│  3. Compara senha com bcrypt.compare()                   │
│  4. Gera JWT com expiração de 7 dias                     │
│  5. Define cookie httpOnly + secure                      │
│  6. Redireciona para /dashboard                          │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ PROTEÇÃO DE ROTAS                                         │
│  - Middleware Next.js verifica token JWT                 │
│  - Rotas públicas: /, /login, /signup                    │
│  - Rotas protegidas: /dashboard, /convert, /history      │
│  - Rota admin: /admin (role='ADMIN')                     │
└──────────────────────────────────────────────────────────┘
```

---

## 5. Integração Stripe

### 5.1 Criação de assinatura

```
┌────────────────────────────────────────────────────────┐
│ 1. USUÁRIO SELECIONA PLANO                              │
│    - Clica em "Assinar PRO (R$19/mês)"                 │
└────────────┬───────────────────────────────────────────┘
             │
┌────────────▼───────────────────────────────────────────┐
│ 2. FRONTEND CHAMA API                                   │
│    POST /api/stripe/create-checkout                     │
│    { planId: "pro" }                                    │
└────────────┬───────────────────────────────────────────┘
             │
┌────────────▼───────────────────────────────────────────┐
│ 3. BACKEND CRIA CHECKOUT SESSION                        │
│    const session = await stripe.checkout.sessions      │
│      .create({                                          │
│        customer_email: user.email,                      │
│        mode: 'subscription',                            │
│        line_items: [{                                   │
│          price: 'price_pro_monthly',                    │
│          quantity: 1                                    │
│        }],                                              │
│        success_url: '/dashboard?success=true',          │
│        cancel_url: '/pricing?canceled=true',            │
│        metadata: { userId: user.id }                    │
│      })                                                 │
└────────────┬───────────────────────────────────────────┘
             │
┌────────────▼───────────────────────────────────────────┐
│ 4. REDIRECIONA PARA STRIPE CHECKOUT                     │
│    - Usuário insere dados do cartão                    │
│    - Stripe processa pagamento                         │
└────────────┬───────────────────────────────────────────┘
             │
┌────────────▼───────────────────────────────────────────┐
│ 5. WEBHOOK: checkout.session.completed                 │
│    POST /api/webhooks/stripe                            │
│    - Verifica assinatura do webhook                    │
│    - Atualiza user.plan = 'PRO'                        │
│    - Atualiza credits.amount = 200                     │
│    - Cria registro em 'subscriptions'                  │
│    - Envia email de confirmação                        │
└────────────────────────────────────────────────────────┘
```

### 5.2 Webhooks configurados

| Evento | Ação |
|--------|------|
| `checkout.session.completed` | Ativa assinatura, atualiza créditos |
| `customer.subscription.updated` | Atualiza plano (upgrade/downgrade) |
| `customer.subscription.deleted` | Cancela assinatura, volta para FREE |
| `invoice.payment_succeeded` | Renova créditos mensais |
| `invoice.payment_failed` | Suspende assinatura, envia email |

---

## 6. Estrutura de pastas

```
crescitechmd/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── convert/
│   │   │   └── page.tsx
│   │   ├── history/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── (admin)/
│   │   └── admin/
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── convert/
│   │   │   └── route.ts
│   │   ├── stripe/
│   │   │   ├── create-checkout/
│   │   │   │   └── route.ts
│   │   │   └── webhooks/
│   │   │       └── route.ts
│   │   └── credits/
│   │       └── route.ts
│   ├── layout.tsx
│   └── page.tsx (landing page)
├── components/
│   ├── ui/ (shadcn)
│   ├── auth/
│   ├── dashboard/
│   └── landing/
├── lib/
│   ├── prisma.ts
│   ├── stripe.ts
│   ├── docling.ts
│   ├── email.ts
│   └── utils.ts
├── prisma/
│   └── schema.prisma
├── public/
│   ├── images/
│   └── fonts/
├── styles/
│   └── globals.css
├── .env.local
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 7. Variáveis de ambiente

```bash
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generated-secret-key"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_BASIC="price_..."
STRIPE_PRICE_PRO="price_..."
STRIPE_PRICE_BUSINESS="price_..."

# Vercel Blob
BLOB_READ_WRITE_TOKEN="vercel_blob_..."

# Email (Resend)
RESEND_API_KEY="re_..."

# Google Analytics
NEXT_PUBLIC_GA_ID="G-..."

# Admin
ADMIN_EMAIL="yan@crescitech.com"
```

---

## 8. Segurança

### 8.1 Autenticação
- Senhas hasheadas com bcrypt (10 salt rounds)
- JWT com expiração de 7 dias
- Cookies httpOnly + secure + sameSite
- CSRF tokens via NextAuth

### 8.2 Autorização
- Middleware protege rotas privadas
- Role-based access (USER, ADMIN)
- API routes verificam autenticação
- Rate limiting: 100 req/15min por IP

### 8.3 Validação
- Zod schemas em frontend e backend
- Sanitização de inputs
- Validação de MIME types
- Limite de tamanho de arquivo

### 8.4 HTTPS
- SSL automático via Vercel
- HSTS headers configurados
- Cookies secure only

---

## 9. Otimizações de performance

### 9.1 Frontend
- Code splitting automático (Next.js)
- Lazy loading de componentes pesados
- Imagens otimizadas com next/image
- Font optimization (next/font)
- Static generation da landing page

### 9.2 Backend
- Connection pooling (Prisma)
- Índices otimizados no PostgreSQL
- Caching de queries frequentes
- Compressão de respostas (gzip)

### 9.3 Storage
- CDN para arquivos estáticos
- Vercel Edge Network
- Blob storage para arquivos convertidos

---

## 10. Monitoramento e logs

### 10.1 Logs de aplicação
- Vercel Logs (stdout/stderr)
- Structured logging (JSON)
- Níveis: ERROR, WARN, INFO, DEBUG

### 10.2 Métricas
- Google Analytics 4
- Vercel Analytics
- Custom events tracking

### 10.3 Alertas
- Email para erros críticos
- Webhook Discord para deploys
- Stripe webhook failures

---

## 11. Backup e recuperação

### 11.1 Banco de dados
- Supabase: backup automático diário
- Point-in-time recovery até 7 dias
- Exportação manual mensal

### 11.2 Arquivos
- Vercel Blob: redundância automática
- Não há backup dos arquivos originais (deletados)

### 11.3 Código
- Git repository no GitHub
- Branch protection (main)
- CI/CD com Vercel

---

**Última atualização:** 01/03/2026
