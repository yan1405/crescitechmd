import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { uploadMarkdown } from '@/lib/blob-storage'
import { sendConversionCompletedEmail, sendCreditsDepletedEmail } from '@/lib/email'

// ============================================================
// FileFormat mapping (extension → Prisma enum value)
// ============================================================

const EXTENSION_TO_FORMAT: Record<string, string> = {
  pdf: 'PDF',
  docx: 'DOCX',
  pptx: 'PPTX',
  xlsx: 'XLSX',
  png: 'PNG',
  jpeg: 'JPEG',
  jpg: 'JPEG',
  html: 'HTML',
}

function getClientIp(request: NextRequest): string | null {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    null
  )
}

// ============================================================
// POST /api/convert/complete
// Called by the frontend after Render returns the converted markdown.
// Handles: blob upload, credit deduction, DB save, emails.
// ============================================================

export async function POST(request: NextRequest) {
  try {
    // ── 1. Authentication ──
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
    }

    const userId = session.user.id
    const userPlan = session.user.plan

    // ── 2. Parse body ──
    const body = await request.json()
    const {
      markdown,
      fileName,
      fileSize,
      fileExtension,
      processingTime,
      options,
    } = body as {
      markdown: string
      fileName: string
      fileSize: number
      fileExtension: string
      processingTime: number
      options: { preserveImages: boolean; preserveTables: boolean; preserveHeaders: boolean }
    }

    if (!markdown || !fileName) {
      return NextResponse.json(
        { error: 'Dados incompletos. markdown e fileName são obrigatórios.' },
        { status: 400 },
      )
    }

    // ── 3. Check credits (double-check before debiting) ──
    const credits = await prisma.credits.findUnique({
      where: { userId },
    })

    if (!credits || credits.amount <= 0) {
      return NextResponse.json(
        { error: 'Créditos esgotados.' },
        { status: 403 },
      )
    }

    // ── 4. Upload markdown to Vercel Blob ──
    const blobResult = await uploadMarkdown(markdown, fileName)

    // ── 5. Transaction: create Conversion + decrement credit ──
    const fileFormat = EXTENSION_TO_FORMAT[fileExtension?.toLowerCase()] ?? 'PDF'

    const [conversion, updatedCredits] = await prisma.$transaction([
      prisma.conversion.create({
        data: {
          userId,
          originalFileName: fileName,
          originalFormat: fileFormat as 'PDF' | 'DOCX' | 'PPTX' | 'XLSX' | 'PNG' | 'JPEG' | 'HTML',
          originalSize: fileSize ?? 0,
          markdownUrl: blobResult.url,
          markdownSize: blobResult.size,
          preserveImages: options?.preserveImages ?? true,
          preserveTables: options?.preserveTables ?? true,
          preserveHeaders: options?.preserveHeaders ?? true,
          status: 'COMPLETED',
          processingTime: Math.round(processingTime ?? 0),
        },
      }),
      prisma.credits.update({
        where: { userId },
        data: { amount: { decrement: 1 } },
      }),
    ])

    // ── 6. Audit logs (fire-and-forget) ──
    prisma.auditLog
      .createMany({
        data: [
          {
            userId,
            action: 'CONVERSION_SUCCESS',
            details: {
              conversionId: conversion.id,
              fileName,
              format: fileExtension,
              originalSize: fileSize,
              markdownSize: blobResult.size,
              processingTime,
            },
            ipAddress: getClientIp(request),
            userAgent: request.headers.get('user-agent'),
          },
          {
            userId,
            action: 'CREDITS_DEDUCTED',
            details: {
              amount: 1,
              remaining: updatedCredits.amount,
              reason: 'conversion',
              conversionId: conversion.id,
            },
          },
        ],
      })
      .catch((err: unknown) => {
        console.error('Audit log creation failed:', err)
      })

    // ── 7. Email notifications (fire-and-forget) ──
    const userName = session.user.name || 'Usuário'
    const userEmail = session.user.email!
    sendConversionCompletedEmail(
      userName,
      userEmail,
      fileName,
      blobResult.downloadUrl,
      updatedCredits.amount,
    )

    if (updatedCredits.amount === 0) {
      sendCreditsDepletedEmail(userName, userEmail, userPlan)
    }

    // ── Response ──
    return NextResponse.json({
      success: true,
      conversionId: conversion.id,
      previewUrl: blobResult.url,
      downloadUrl: blobResult.downloadUrl,
      creditsRemaining: updatedCredits.amount,
    })
  } catch (error) {
    console.error('Conversion complete API error:', error)

    return NextResponse.json(
      { error: 'Erro interno do servidor. Tente novamente ou contate suporte.' },
      { status: 500 },
    )
  }
}
