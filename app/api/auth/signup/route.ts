import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { customAlphabet } from 'nanoid'
import { prisma } from '@/lib/prisma'
import { signupSchema } from '@/lib/validations/auth'
import { sendWelcomeEmail } from '@/lib/email'

const generateReferralCode = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8)

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const parsed = signupSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, email, password, referralCode } = parsed.data

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 409 }
      )
    }

    // Hash password with bcrypt (10 rounds)
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate unique referral code for the new user
    let newUserCode = generateReferralCode()
    while (await prisma.user.findUnique({ where: { referralCode: newUserCode } })) {
      newUserCode = generateReferralCode()
    }

    // If referralCode provided, find the referrer (silently ignore invalid codes)
    let referrerId: string | null = null
    if (referralCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode },
        select: { id: true },
      })
      if (referrer) {
        referrerId = referrer.id
      }
    }

    // Credits: 5 base + 5 bonus if referred
    const initialCredits = referrerId ? 10 : 5

    // Create user + credits + referral record (if applicable)
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'USER',
          plan: 'FREE',
          referralCode: newUserCode,
          credits: {
            create: { amount: initialCredits },
          },
        },
        select: {
          id: true,
          email: true,
          name: true,
          plan: true,
        },
      })

      // Create Referral record linking referrer -> new user
      if (referrerId) {
        await tx.referral.create({
          data: {
            referrerId,
            referredId: newUser.id,
            referralCode: referralCode!,
            status: 'PENDING',
          },
        })
      }

      return newUser
    })

    // Audit logs (fire-and-forget)
    prisma.auditLog
      .create({
        data: {
          userId: user.id,
          action: 'USER_SIGNUP',
          details: { referralCode: referralCode || null, referrerId },
        },
      })
      .catch((err: unknown) => console.error('Audit log failed:', err))

    if (referrerId) {
      prisma.auditLog
        .create({
          data: {
            userId: referrerId,
            action: 'REFERRAL_CREATED',
            details: { referredUserId: user.id, referralCode },
          },
        })
        .catch((err: unknown) => console.error('Audit log failed:', err))
    }

    // Welcome email (fire-and-forget)
    sendWelcomeEmail(name, email, newUserCode, initialCredits)

    return NextResponse.json(
      { message: 'Conta criada com sucesso', user },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
