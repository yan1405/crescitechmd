// prisma/seed.ts

import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, UserRole, PlanType } from '../app/generated/prisma/client'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Iniciando seed do banco de dados...')

  // Admin user
  const adminPassword = await bcrypt.hash('Yan.1405', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'yansilva@crescitech.com.br' },
    update: {},
    create: {
      email: 'yansilva@crescitech.com.br',
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
  console.log(`Admin criado: ${admin.email}`)

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
  console.log('Configuracoes do sistema criadas')

  console.log('Seed concluido com sucesso!')
}

main()
  .catch((e) => {
    console.error('Erro durante seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
