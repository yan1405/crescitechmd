# CrescitechMD - Database Schema

**Versão:** 1.0  
**Database:** PostgreSQL 15+  
**ORM:** Prisma

---

## Schema Prisma completo

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// USUÁRIOS E AUTENTICAÇÃO
// ============================================

enum UserRole {
  USER
  ADMIN
}

enum PlanType {
  FREE
  BASIC
  PRO
  BUSINESS
}

model User {
  id            String       @id @default(uuid())
  email         String       @unique
  name          String?
  password      String       // bcrypt hash
  role          UserRole     @default(USER)
  plan          PlanType     @default(FREE)
  emailVerified Boolean      @default(false)
  
  // Relações
  credits       Credits?
  conversions   Conversion[]
  subscription  Subscription?
  referrals     Referral[]   @relation("Referrer")
  referredBy    Referral?    @relation("Referred")
  auditLogs     AuditLog[]
  
  // Timestamps
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
  
  @@index([email])
  @@index([plan])
}

// ============================================
// SISTEMA DE CRÉDITOS
// ============================================

model Credits {
  id              String    @id @default(uuid())
  userId          String    @unique
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  amount          Int       @default(5)  // Créditos disponíveis
  lastReset       DateTime  @default(now())  // Última renovação mensal
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([userId])
}

// ============================================
// CONVERSÕES
// ============================================

enum ConversionStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}

enum FileFormat {
  PDF
  DOCX
  PPTX
  XLSX
  PNG
  JPEG
  HTML
}

model Conversion {
  id                String            @id @default(uuid())
  userId            String
  user              User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Arquivo original
  originalFileName  String
  originalFormat    FileFormat
  originalSize      Int               // bytes
  
  // Arquivo convertido
  markdownUrl       String            // Vercel Blob URL
  markdownSize      Int?              // bytes
  
  // Configurações de conversão
  preserveImages    Boolean           @default(true)
  preserveTables    Boolean           @default(true)
  preserveHeaders   Boolean           @default(true)
  
  // Status
  status            ConversionStatus  @default(PENDING)
  errorMessage      String?
  
  // Processamento
  processingTime    Int?              // segundos
  
  // Timestamps
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  
  @@index([userId])
  @@index([status])
  @@index([createdAt])
}

// ============================================
// ASSINATURAS STRIPE
// ============================================

enum SubscriptionStatus {
  ACTIVE
  CANCELED
  PAST_DUE
  PAUSED
}

model Subscription {
  id                    String              @id @default(uuid())
  userId                String              @unique
  user                  User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Stripe
  stripeCustomerId      String              @unique
  stripeSubscriptionId  String              @unique
  stripePriceId         String
  
  // Plano
  plan                  PlanType
  status                SubscriptionStatus
  
  // Datas
  currentPeriodStart    DateTime
  currentPeriodEnd      DateTime
  canceledAt            DateTime?
  
  // Timestamps
  createdAt             DateTime            @default(now())
  updatedAt             DateTime            @updatedAt
  
  @@index([userId])
  @@index([stripeCustomerId])
  @@index([status])
}

// ============================================
// SISTEMA DE REFERÊNCIA
// ============================================

enum ReferralStatus {
  PENDING     // Indicado cadastrou mas não converteu
  CONVERTED   // Indicado fez primeiro pagamento
  REWARDED    // Referenciador recebeu bônus
}

model Referral {
  id              String          @id @default(uuid())
  
  // Quem indicou
  referrerId      String
  referrer        User            @relation("Referrer", fields: [referrerId], references: [id], onDelete: Cascade)
  
  // Quem foi indicado
  referredId      String          @unique
  referred        User            @relation("Referred", fields: [referredId], references: [id], onDelete: Cascade)
  
  // Código único de indicação
  referralCode    String          @unique
  
  // Status e recompensas
  status          ReferralStatus  @default(PENDING)
  creditsAwarded  Int             @default(0)
  
  // Timestamps
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  
  @@index([referrerId])
  @@index([referralCode])
  @@index([status])
}

// ============================================
// LOGS DE AUDITORIA
// ============================================

enum AuditAction {
  USER_LOGIN
  USER_LOGOUT
  USER_SIGNUP
  CONVERSION_START
  CONVERSION_SUCCESS
  CONVERSION_FAILED
  PLAN_UPGRADED
  PLAN_DOWNGRADED
  PLAN_CANCELED
  PAYMENT_SUCCESS
  PAYMENT_FAILED
  CREDITS_ADDED
  CREDITS_DEDUCTED
  CREDITS_RESET
  REFERRAL_CREATED
  REFERRAL_CONVERTED
}

model AuditLog {
  id          String      @id @default(uuid())
  userId      String?
  user        User?       @relation(fields: [userId], references: [id], onDelete: SetNull)
  
  action      AuditAction
  details     Json?       // Dados adicionais em JSON
  ipAddress   String?
  userAgent   String?
  
  createdAt   DateTime    @default(now())
  
  @@index([userId])
  @@index([action])
  @@index([createdAt])
}

// ============================================
// MÉTRICAS E ANALYTICS
// ============================================

model DailyMetrics {
  id                    String    @id @default(uuid())
  date                  DateTime  @unique @db.Date
  
  // Usuários
  newUsers              Int       @default(0)
  activeUsers           Int       @default(0)
  
  // Conversões
  totalConversions      Int       @default(0)
  successfulConversions Int       @default(0)
  failedConversions     Int       @default(0)
  
  // Receita
  mrr                   Decimal   @default(0) @db.Decimal(10, 2)
  newSubscriptions      Int       @default(0)
  canceledSubscriptions Int       @default(0)
  
  // Planos
  freeUsers             Int       @default(0)
  basicUsers            Int       @default(0)
  proUsers              Int       @default(0)
  businessUsers         Int       @default(0)
  
  // Referências
  newReferrals          Int       @default(0)
  convertedReferrals    Int       @default(0)
  
  createdAt             DateTime  @default(now())
  
  @@index([date])
}

// ============================================
// CONFIGURAÇÕES DO SISTEMA
// ============================================

model SystemConfig {
  id        String   @id @default(uuid())
  key       String   @unique
  value     String
  updatedAt DateTime @updatedAt
  
  @@index([key])
}
```

---

## Relacionamentos

```
User (1) ──────────────── (1) Credits
User (1) ──────────────── (N) Conversion
User (1) ──────────────── (1) Subscription
User (1) ──────────────── (N) Referral (como referrer)
User (1) ──────────────── (1) Referral (como referred)
User (1) ──────────────── (N) AuditLog
```

---

## Índices otimizados

### Queries frequentes otimizadas

```sql
-- Buscar usuário por email (login)
CREATE INDEX idx_user_email ON "User"(email);

-- Listar conversões por usuário
CREATE INDEX idx_conversion_userid ON "Conversion"("userId");

-- Conversões recentes (dashboard)
CREATE INDEX idx_conversion_createdat ON "Conversion"("createdAt" DESC);

-- Status de assinaturas ativas
CREATE INDEX idx_subscription_status ON "Subscription"(status);

-- Logs de auditoria por data
CREATE INDEX idx_auditlog_createdat ON "AuditLog"("createdAt" DESC);

-- Referências por código
CREATE INDEX idx_referral_code ON "Referral"("referralCode");
```

---

## Migrations iniciais

### 1. Criar tabelas base

```bash
npx prisma migrate dev --name init
```

### 2. Seed inicial

```typescript
// prisma/seed.ts

import { PrismaClient, UserRole, PlanType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'yan@crescitech.com' },
    update: {},
    create: {
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

  // System configs
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
      { key: 'CONVERSION_TIMEOUT_SECONDS', value: '60' }
    ],
    skipDuplicates: true
  })

  console.log('✅ Seed completed:', { admin })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

---

## Queries úteis

### Obter créditos disponíveis

```typescript
const credits = await prisma.credits.findUnique({
  where: { userId },
  select: { amount: true }
})
```

### Criar conversão

```typescript
const conversion = await prisma.conversion.create({
  data: {
    userId,
    originalFileName: file.name,
    originalFormat: FileFormat.PDF,
    originalSize: file.size,
    markdownUrl: blobUrl,
    status: ConversionStatus.COMPLETED,
    preserveImages: true,
    preserveTables: true,
    processingTime: 15
  }
})

// Decrementar crédito
await prisma.credits.update({
  where: { userId },
  data: { amount: { decrement: 1 } }
})
```

### Histórico de conversões

```typescript
const conversions = await prisma.conversion.findMany({
  where: { userId },
  orderBy: { createdAt: 'desc' },
  take: 20,
  select: {
    id: true,
    originalFileName: true,
    originalFormat: true,
    markdownUrl: true,
    status: true,
    createdAt: true
  }
})
```

### Dashboard admin - métricas

```typescript
const metrics = await prisma.$transaction([
  // Total de usuários
  prisma.user.count(),
  
  // Usuários por plano
  prisma.user.groupBy({
    by: ['plan'],
    _count: true
  }),
  
  // Conversões hoje
  prisma.conversion.count({
    where: {
      createdAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    }
  }),
  
  // MRR (soma dos planos ativos)
  prisma.subscription.findMany({
    where: { status: 'ACTIVE' },
    include: { user: true }
  })
])
```

### Reset mensal de créditos

```typescript
// Executar via cron job (1º dia de cada mês)
const usersToReset = await prisma.user.findMany({
  where: {
    credits: {
      lastReset: {
        lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    }
  },
  include: { credits: true }
})

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
      details: { amount: newAmount, plan: user.plan }
    }
  })
}
```

### Sistema de referência

```typescript
// Gerar código único
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8)

const referralCode = nanoid() // ex: "A3K9M2X7"

// Criar referência
await prisma.referral.create({
  data: {
    referrerId: currentUserId,
    referredId: newUserId,
    referralCode,
    status: 'PENDING'
  }
})

// Quando indicado faz primeiro pagamento
await prisma.$transaction([
  // Atualizar status da referência
  prisma.referral.update({
    where: { referredId: newUserId },
    data: {
      status: 'CONVERTED',
      creditsAwarded: 10
    }
  }),
  
  // Adicionar créditos bônus ao referenciador
  prisma.credits.update({
    where: { userId: referrerId },
    data: { amount: { increment: 10 } }
  }),
  
  // Log de auditoria
  prisma.auditLog.create({
    data: {
      userId: referrerId,
      action: 'REFERRAL_CONVERTED',
      details: { referredId: newUserId, bonusCredits: 10 }
    }
  })
])
```

---

## Backup e manutenção

### Backup manual

```bash
# Exportar schema
npx prisma db pull

# Dump completo do banco
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Limpeza de dados antigos

```typescript
// Deletar logs de auditoria > 90 dias
await prisma.auditLog.deleteMany({
  where: {
    createdAt: {
      lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    }
  }
})

// Deletar conversões falhadas > 30 dias
await prisma.conversion.deleteMany({
  where: {
    status: 'FAILED',
    createdAt: {
      lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }
  }
})
```

---

**Última atualização:** 01/03/2026
