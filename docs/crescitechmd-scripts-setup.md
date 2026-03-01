# CrescitechMD - Scripts de Setup

**Versão:** 1.0  
**Data:** 01/03/2026

---

## 1. Script de Inicialização Completa

```bash
#!/bin/bash
# setup.sh - Script de setup inicial do CrescitechMD

set -e

echo "🚀 Iniciando setup do CrescitechMD..."

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar Node.js
echo -e "${BLUE}Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado. Instale Node.js 18+ primeiro.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v)${NC}"

# Verificar npm
echo -e "${BLUE}Verificando npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm não encontrado.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm -v)${NC}"

# Criar projeto Next.js
echo -e "${BLUE}Criando projeto Next.js...${NC}"
npx create-next-app@latest crescitechmd \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"

cd crescitechmd

# Instalar dependências principais
echo -e "${BLUE}Instalando dependências...${NC}"
npm install \
  next-auth@beta \
  @prisma/client \
  prisma \
  zod \
  react-hook-form \
  @hookform/resolvers \
  bcryptjs \
  @types/bcryptjs \
  @stripe/stripe-js \
  stripe \
  @vercel/blob \
  resend \
  react-email \
  recharts \
  nanoid \
  date-fns

# Instalar shadcn/ui
echo -e "${BLUE}Configurando shadcn/ui...${NC}"
npx shadcn-ui@latest init -y

# Instalar componentes shadcn/ui essenciais
echo -e "${BLUE}Instalando componentes UI...${NC}"
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add form
npx shadcn-ui@latest add select
npx shadcn-ui@latest add table
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add alert

# Setup Prisma
echo -e "${BLUE}Configurando Prisma...${NC}"
npx prisma init

# Criar arquivo .env.local
echo -e "${BLUE}Criando arquivo .env.local...${NC}"
cat > .env.local << 'EOF'
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/crescitechmd"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=""

# Stripe
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""
STRIPE_PRICE_BASIC=""
STRIPE_PRICE_PRO=""
STRIPE_PRICE_BUSINESS=""

# Vercel Blob
BLOB_READ_WRITE_TOKEN=""

# Email (Resend)
RESEND_API_KEY=""

# Google Analytics
NEXT_PUBLIC_GA_ID=""

# Admin
ADMIN_EMAIL="yan@crescitech.com"
EOF

# Gerar NEXTAUTH_SECRET
echo -e "${BLUE}Gerando NEXTAUTH_SECRET...${NC}"
SECRET=$(openssl rand -base64 32)
sed -i '' "s/NEXTAUTH_SECRET=\"\"/NEXTAUTH_SECRET=\"$SECRET\"/" .env.local

echo -e "${GREEN}✅ Setup inicial concluído!${NC}"
echo ""
echo -e "${BLUE}Próximos passos:${NC}"
echo "1. Configure as variáveis de ambiente em .env.local"
echo "2. Configure o banco de dados PostgreSQL (Supabase recomendado)"
echo "3. Execute: npm run db:generate para criar o cliente Prisma"
echo "4. Execute: npm run db:push para criar as tabelas"
echo "5. Execute: npm run dev para iniciar o servidor"
echo ""
echo -e "${GREEN}🎉 Pronto para começar!${NC}"
```

---

## 2. Script de Configuração do Banco de Dados

```bash
#!/bin/bash
# setup-db.sh - Configuração do banco de dados

set -e

echo "🗄️  Configurando banco de dados..."

# Gerar cliente Prisma
echo "Gerando cliente Prisma..."
npx prisma generate

# Push schema para o banco
echo "Criando tabelas no banco..."
npx prisma db push

# Executar seed
echo "Executando seed inicial..."
npx prisma db seed

echo "✅ Banco de dados configurado com sucesso!"
```

---

## 3. Package.json - Scripts Úteis

```json
{
  "name": "crescitechmd",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset",
    "stripe:listen": "stripe listen --forward-to localhost:3000/api/webhooks/stripe",
    "email:dev": "email dev",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "dependencies": {
    "next": "14.1.0",
    "react": "^18",
    "react-dom": "^18",
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "next-auth": "^5.0.0-beta.4",
    "@prisma/client": "^5.8.0",
    "prisma": "^5.8.0",
    "zod": "^3.22.4",
    "react-hook-form": "^7.49.3",
    "@hookform/resolvers": "^3.3.4",
    "bcryptjs": "^2.4.3",
    "@types/bcryptjs": "^2.4.6",
    "@stripe/stripe-js": "^2.4.0",
    "stripe": "^14.13.0",
    "@vercel/blob": "^0.19.0",
    "resend": "^3.0.0",
    "react-email": "^2.0.0",
    "recharts": "^2.10.3",
    "nanoid": "^5.0.4",
    "date-fns": "^3.0.6"
  },
  "devDependencies": {
    "tsx": "^4.7.0",
    "prettier": "^3.1.1",
    "@types/node": "^20.10.6",
    "typescript": "^5.3.3"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

---

## 4. Script de Deploy para Vercel

```bash
#!/bin/bash
# deploy.sh - Deploy para produção na Vercel

set -e

echo "🚀 Preparando deploy para produção..."

# Build do projeto
echo "Building projeto..."
npm run build

# Verificar tipos TypeScript
echo "Verificando tipos..."
npm run type-check

# Verificar formatação
echo "Verificando formatação de código..."
npm run format:check

# Deploy para Vercel
echo "Fazendo deploy para Vercel..."
vercel --prod

echo "✅ Deploy concluído!"
echo "🌐 Acesse: https://crescitechmd.vercel.app"
```

---

## 5. Script de Seed do Banco de Dados

```typescript
// prisma/seed.ts

import { PrismaClient, UserRole, PlanType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpar dados existentes (apenas em desenvolvimento)
  if (process.env.NODE_ENV !== 'production') {
    console.log('🗑️  Limpando dados existentes...')
    await prisma.auditLog.deleteMany()
    await prisma.conversion.deleteMany()
    await prisma.referral.deleteMany()
    await prisma.subscription.deleteMany()
    await prisma.credits.deleteMany()
    await prisma.user.deleteMany()
    await prisma.systemConfig.deleteMany()
  }

  // Criar usuário admin
  console.log('👤 Criando usuário admin...')
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'yan@crescitech.com',
      name: 'Yan Guilherme',
      password: adminPassword,
      role: UserRole.ADMIN,
      plan: PlanType.BUSINESS,
      emailVerified: true,
      credits: {
        create: {
          amount: 1000
        }
      }
    }
  })
  console.log(`✅ Admin criado: ${admin.email}`)

  // Criar usuários de teste
  console.log('👥 Criando usuários de teste...')
  
  const freeUserPassword = await bcrypt.hash('password123', 10)
  const freeUser = await prisma.user.create({
    data: {
      email: 'free@example.com',
      name: 'Usuário Free',
      password: freeUserPassword,
      role: UserRole.USER,
      plan: PlanType.FREE,
      emailVerified: true,
      credits: {
        create: {
          amount: 5
        }
      }
    }
  })
  console.log(`✅ Usuário FREE criado: ${freeUser.email}`)

  const proUserPassword = await bcrypt.hash('password123', 10)
  const proUser = await prisma.user.create({
    data: {
      email: 'pro@example.com',
      name: 'Usuário Pro',
      password: proUserPassword,
      role: UserRole.USER,
      plan: PlanType.PRO,
      emailVerified: true,
      credits: {
        create: {
          amount: 200
        }
      }
    }
  })
  console.log(`✅ Usuário PRO criado: ${proUser.email}`)

  // Criar configurações do sistema
  console.log('⚙️  Criando configurações do sistema...')
  await prisma.systemConfig.createMany({
    data: [
      { key: 'MAX_FILE_SIZE_FREE', value: '5242880' }, // 5 MB
      { key: 'MAX_FILE_SIZE_BASIC', value: '10485760' }, // 10 MB
      { key: 'MAX_FILE_SIZE_PRO', value: '20971520' }, // 20 MB
      { key: 'MAX_FILE_SIZE_BUSINESS', value: '52428800' }, // 50 MB
      { key: 'CREDITS_FREE', value: '5' },
      { key: 'CREDITS_BASIC', value: '50' },
      { key: 'CREDITS_PRO', value: '200' },
      { key: 'CREDITS_BUSINESS', value: '1000' },
      { key: 'REFERRAL_BONUS_CREDITS', value: '10' },
      { key: 'CONVERSION_TIMEOUT_SECONDS', value: '60' },
      { key: 'RATE_LIMIT_REQUESTS_PER_WINDOW', value: '100' },
      { key: 'RATE_LIMIT_WINDOW_MS', value: '900000' } // 15 minutos
    ]
  })
  console.log('✅ Configurações do sistema criadas')

  // Criar conversões de exemplo para o usuário pro
  console.log('📄 Criando conversões de exemplo...')
  await prisma.conversion.create({
    data: {
      userId: proUser.id,
      originalFileName: 'exemplo.pdf',
      originalFormat: 'PDF',
      originalSize: 1024000,
      markdownUrl: 'https://example.com/exemplo.md',
      markdownSize: 5120,
      status: 'COMPLETED',
      processingTime: 8,
      preserveImages: true,
      preserveTables: true,
      preserveHeaders: true
    }
  })
  console.log('✅ Conversão de exemplo criada')

  console.log('🎉 Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

---

## 6. Script de Verificação Pré-Deploy

```bash
#!/bin/bash
# pre-deploy.sh - Verificações antes do deploy

set -e

echo "🔍 Executando verificações pré-deploy..."

# Verificar build
echo "1. Verificando build..."
npm run build || exit 1

# Verificar tipos
echo "2. Verificando TypeScript..."
npm run type-check || exit 1

# Verificar lint
echo "3. Verificando lint..."
npm run lint || exit 1

# Verificar formatação
echo "4. Verificando formatação..."
npm run format:check || exit 1

# Verificar variáveis de ambiente essenciais
echo "5. Verificando variáveis de ambiente..."
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL não configurada"
    exit 1
fi

if [ -z "$NEXTAUTH_SECRET" ]; then
    echo "❌ NEXTAUTH_SECRET não configurada"
    exit 1
fi

if [ -z "$STRIPE_SECRET_KEY" ]; then
    echo "❌ STRIPE_SECRET_KEY não configurada"
    exit 1
fi

echo "✅ Todas as verificações passaram!"
echo "🚀 Pronto para deploy!"
```

---

## 7. Script de Backup do Banco

```bash
#!/bin/bash
# backup-db.sh - Backup do banco de dados

set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"

echo "💾 Iniciando backup do banco de dados..."

# Criar diretório de backups se não existir
mkdir -p $BACKUP_DIR

# Fazer backup
pg_dump $DATABASE_URL > $BACKUP_FILE

# Comprimir backup
gzip $BACKUP_FILE

echo "✅ Backup concluído: ${BACKUP_FILE}.gz"

# Manter apenas últimos 7 backups
find $BACKUP_DIR -name "backup_*.sql.gz" -type f -mtime +7 -delete

echo "🗑️  Backups antigos removidos"
```

---

## 8. Script de Reset de Créditos Mensais (Cron)

```typescript
// scripts/reset-credits.ts
// Executar via cron no dia 1 de cada mês às 00:00

import { PrismaClient, PlanType } from '@prisma/client'

const prisma = new PrismaClient()

const CREDITS_BY_PLAN: Record<PlanType, number> = {
  FREE: 5,
  BASIC: 50,
  PRO: 200,
  BUSINESS: 1000
}

async function resetMonthlyCredits() {
  console.log('🔄 Iniciando reset mensal de créditos...')

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  // Buscar usuários que precisam de reset
  const usersToReset = await prisma.user.findMany({
    where: {
      credits: {
        lastReset: {
          lt: startOfMonth
        }
      }
    },
    include: { credits: true }
  })

  console.log(`📊 ${usersToReset.length} usuários para resetar`)

  let resetCount = 0

  for (const user of usersToReset) {
    const newAmount = CREDITS_BY_PLAN[user.plan]

    await prisma.credits.update({
      where: { userId: user.id },
      data: {
        amount: newAmount,
        lastReset: new Date()
      }
    })

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'CREDITS_RESET',
        details: {
          oldAmount: user.credits?.amount || 0,
          newAmount,
          plan: user.plan
        }
      }
    })

    resetCount++
  }

  console.log(`✅ ${resetCount} créditos resetados com sucesso!`)
}

resetMonthlyCredits()
  .catch((e) => {
    console.error('❌ Erro durante reset:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

---

## 9. .gitignore Recomendado

```gitignore
# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# Prisma
prisma/migrations/

# Backups
/backups/

# IDE
.vscode/
.idea/
*.swp
*.swo
```

---

## 10. README.md do Projeto

```markdown
# CrescitechMD

SaaS de conversão de documentos para Markdown utilizando Docling.

## 🚀 Quick Start

\`\`\`bash
# Clone o repositório
git clone https://github.com/crescitech/crescitechmd.git
cd crescitechmd

# Executar setup automático
chmod +x setup.sh
./setup.sh

# Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Setup do banco de dados
npm run db:generate
npm run db:push
npm run db:seed

# Iniciar servidor de desenvolvimento
npm run dev
\`\`\`

Acesse http://localhost:3000

## 📋 Requisitos

- Node.js 18+
- PostgreSQL 15+
- Conta Stripe (teste/produção)
- Conta Vercel (deploy)
- Conta Resend (emails)

## 🛠️ Comandos Úteis

\`\`\`bash
npm run dev          # Desenvolvimento
npm run build        # Build produção
npm run start        # Produção
npm run db:studio    # Prisma Studio
npm run db:reset     # Reset banco
\`\`\`

## 📚 Documentação

Consulte os arquivos de documentação:
- [PRD](./docs/prd.md)
- [Arquitetura](./docs/arquitetura.md)
- [Database Schema](./docs/database-schema.md)
- [Roadmap](./docs/roadmap.md)

## 🔐 Variáveis de Ambiente

Consulte `.env.example` para lista completa.

## 📄 Licença

Propriedade da Crescitech © 2026
\`\`\`

---

**Última atualização:** 01/03/2026
