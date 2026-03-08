# Sprint 1.1 + Schema + Autenticação - Concluído

**Data:** 02/03/2026
**Status:** Concluído

---

## 1. Configurações Finais

### Versões Instaladas

| Pacote | Versão |
|--------|--------|
| Node.js | v24.11.1 |
| npm | 11.6.2 |
| Next.js | 16.1.6 (Turbopack) |
| React | 19.2.3 |
| TypeScript | ^5 |
| Prisma | 7.4.2 |
| Tailwind CSS | v4 |
| NextAuth.js | v5 beta.30 |
| Zod | v4.3.6 |
| shadcn/ui | 3.8.5 |
| Stripe SDK | 20.4.0 |
| bcryptjs | 3.0.3 |

### Estrutura de Pastas

```
crescitechmd/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx
│   │   ├── convert/
│   │   ├── history/
│   │   ├── settings/
│   │   └── referral/
│   ├── (admin)/admin/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts
│   │   │   └── signup/route.ts
│   │   ├── convert/
│   │   ├── stripe/create-checkout/
│   │   ├── webhooks/stripe/
│   │   └── credits/
│   ├── generated/prisma/  (cliente Prisma gerado)
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/  (13 componentes shadcn)
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── dashboard/
│   ├── landing/
│   ├── convert/
│   ├── history/
│   ├── settings/
│   ├── admin/
│   └── referral/
├── lib/
│   ├── prisma.ts         (singleton PrismaClient com PG adapter)
│   ├── auth.ts           (NextAuth config completa - server only)
│   ├── auth.config.ts    (NextAuth config base - Edge safe)
│   ├── utils.ts          (shadcn utils)
│   ├── validations/
│   │   └── auth.ts       (schemas Zod login/signup)
│   └── docling/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── middleware.ts          (proteção de rotas)
├── prisma.config.ts
├── .env.local
├── .env
└── .prettierignore
```

### Componentes shadcn/ui Instalados (13)

button, input, card, dialog, dropdown-menu, form, select, table, sonner (substituiu toast), tabs, badge, alert, label

---

## 2. Banco de Dados

### Connection Strings

- **Session Pooler (queries runtime):**
  `postgresql://postgres.cgklbglhyyvyupjtmnma:***@aws-1-sa-east-1.pooler.supabase.com:5432/postgres`

- **Direct (migrations/schema push):**
  `postgresql://postgres:***@db.cgklbglhyyvyupjtmnma.supabase.co:5432/postgres`

- **Project Reference:** `cgklbglhyyvyupjtmnma`

### Configuração Prisma v7

No Prisma v7, as URLs NÃO ficam no `schema.prisma`. Ficam no `prisma.config.ts`:

```typescript
datasource: {
  url: process.env["DIRECT_URL"] || process.env["DATABASE_URL"],
}
```

O `schema.prisma` tem apenas `provider = "postgresql"` (sem url/directUrl).

O PrismaClient v7 requer driver adapter:

```typescript
import { PrismaPg } from '@prisma/adapter-pg'
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })
```

### 8 Tabelas Criadas

| Tabela | Descrição |
|--------|-----------|
| User | Usuários (email, senha bcrypt, role, plan) |
| Credits | Créditos por usuário (amount, lastReset) |
| Conversion | Histórico de conversões de arquivos |
| Subscription | Assinaturas Stripe |
| Referral | Sistema de indicações |
| AuditLog | Logs de auditoria (16 ações) |
| DailyMetrics | Métricas diárias (analytics) |
| SystemConfig | Configurações key-value do sistema |

### 7 Enums

UserRole, PlanType, ConversionStatus, FileFormat, SubscriptionStatus, ReferralStatus, AuditAction

### Seed Executado

- **Admin:** yan@crescitech.com / admin123 (BUSINESS, 1000 créditos)
- **10 SystemConfigs:** limites de arquivo por plano, créditos por plano, timeout, referral bonus

---

## 3. Variáveis de Ambiente (.env.local)

| Variável | Status |
|----------|--------|
| DATABASE_URL | Configurada (Session Pooler Supabase) |
| DIRECT_URL | Configurada (Direct Supabase) |
| NEXTAUTH_URL | http://localhost:3000 |
| NEXTAUTH_SECRET | Gerado (base64 32 bytes) |
| STRIPE_SECRET_KEY | Vazia (configurar no Sprint 3) |
| STRIPE_PUBLISHABLE_KEY | Vazia |
| STRIPE_WEBHOOK_SECRET | Vazia |
| STRIPE_PRICE_BASIC | Vazia |
| STRIPE_PRICE_PRO | Vazia |
| STRIPE_PRICE_BUSINESS | Vazia |
| BLOB_READ_WRITE_TOKEN | Vazia (configurar no Sprint 2) |
| RESEND_API_KEY | Vazia (configurar no Sprint 4) |
| NEXT_PUBLIC_GA_ID | Vazia |
| ADMIN_EMAIL | yan@crescitech.com |

---

## 4. Sprint 1.2: Autenticação (Concluído)

### Arquivos Implementados

| Arquivo | Função |
|---------|--------|
| lib/auth.config.ts | Config base NextAuth (Edge-safe, sem Prisma/bcrypt) |
| lib/auth.ts | Config completa com Credentials provider + bcrypt |
| lib/prisma.ts | Singleton PrismaClient com adapter PG |
| lib/validations/auth.ts | Schemas Zod (loginSchema, signupSchema) |
| app/api/auth/[...nextauth]/route.ts | Route handler NextAuth (GET, POST) |
| app/api/auth/signup/route.ts | API de cadastro |
| components/auth/LoginForm.tsx | Formulário login (React Hook Form + Zod) |
| components/auth/SignupForm.tsx | Formulário signup (React Hook Form + Zod) |
| app/(auth)/layout.tsx | Layout centralizado para auth |
| app/(auth)/login/page.tsx | Página de login |
| app/(auth)/signup/page.tsx | Página de signup |
| middleware.ts | Proteção de rotas (Edge-compatible) |

### Fluxo Implementado

1. **Signup:** Form → Zod validation → POST /api/auth/signup → bcrypt hash (10 rounds) → User + 5 Credits → AuditLog → auto-login → redirect /dashboard
2. **Login:** Form → NextAuth Credentials → bcrypt compare → JWT (7 dias) → redirect /dashboard
3. **Proteção:** Middleware redireciona não-autenticados para /login; redireciona autenticados em /login ou /signup para /dashboard
4. **Rotas protegidas:** /dashboard, /convert, /history, /settings, /referral, /admin

### Testes Realizados

- `/` → 200 (landing page)
- `/login` → 200 (formulário)
- `/signup` → 200 (formulário)
- `/dashboard` → 302 redirect para `/login` (proteção ativa)
- Build de produção: passou sem erros

---

## 5. Problemas Resolvidos

### Project Reference Incorreto

O modal do Supabase exibia o project reference com caracteres trocados. Resolvido verificando via DNS lookup:

- Incorreto: `cgklbglhyyyupjtnmma` (DNS: Non-existent domain)
- Correto: `cgklbglhyyvyupjtmnma` (DNS: resolve corretamente)

### Session Pooler vs Direct Connection

Prisma `db push` e migrations requerem conexão direta (não pooler):

- **Pooler** (porta 5432): `aws-1-sa-east-1.pooler.supabase.com` → para runtime queries
- **Direct** (porta 5432): `db.[ref].supabase.co` → para migrations/schema push

### Prisma v7 Breaking Changes

O Prisma v7 tem mudanças significativas vs v5:

1. `url` e `directUrl` removidos do `schema.prisma` → configurar em `prisma.config.ts`
2. Provider mudou de `prisma-client-js` para `prisma-client`
3. PrismaClient requer `adapter` (ex: `@prisma/adapter-pg`) ou `accelerateUrl`
4. Cliente gerado em `app/generated/prisma/` (não mais em `node_modules`)

### Middleware Edge Runtime

NextAuth importava Prisma/bcrypt no middleware (Edge Runtime), causando erro `crypto module not supported`. Resolvido separando:

- `auth.config.ts` → config leve (Edge-safe) para middleware
- `auth.ts` → config completa com Credentials provider (server-only)

### CSS PostCSS no Windows

Erro `0xc0000142` (DLL initialization failed) ao processar CSS no Turbopack. Resolvido aumentando memória do Node.js:

```bash
NODE_OPTIONS="--max-old-space-size=4096" npx next dev
```

---

## 6. Próximos Passos

| Sprint | Descrição | Status |
|--------|-----------|--------|
| 1.1 | Setup do projeto | Concluído |
| 1.2 | Autenticação | Concluído |
| 1.3 | Dashboard básico | Pendente |
| 1.4 | Landing page | Pendente |
| 2.1 | Setup Docling | Pendente |
| 2.2 | API de upload/conversão | Pendente |

### Comandos Úteis

```bash
npm run dev                    # Dev server (localhost:3000)
npm run build                  # Build produção
npm run db:generate            # Gerar cliente Prisma
npm run db:push                # Sincronizar schema com banco
npm run db:seed                # Popular banco
npm run db:studio              # Interface visual do banco
```

---

**Última atualização:** 02/03/2026
