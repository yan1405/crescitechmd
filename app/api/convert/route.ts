import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import os from 'node:os'
import path from 'node:path'
import fs from 'node:fs/promises'
import { nanoid } from 'nanoid'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { convertDocument } from '@/lib/docling'
import type { ConversionOptions } from '@/lib/docling'
import { validateUploadedFile } from '@/lib/file-validation'
import { uploadMarkdown } from '@/lib/blob-storage'
import { conversionOptionsSchema } from '@/lib/validations/convert'
import { sendConversionCompletedEmail, sendCreditsDepletedEmail } from '@/lib/email'

// ============================================================
// Rate limiting (in-memory, per-instance)
// ============================================================

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 10
const rateLimitMap = new Map<string, number[]>()

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(userId) ?? []
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)

  if (recent.length >= RATE_LIMIT_MAX) {
    rateLimitMap.set(userId, recent)
    return false
  }

  recent.push(now)
  rateLimitMap.set(userId, recent)
  return true
}

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

// ============================================================
// Helpers
// ============================================================

async function cleanupTempFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath)
  } catch {
    // File may already be deleted — ignore
  }
}

function getClientIp(request: NextRequest): string | null {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    null
  )
}

// ============================================================
// POST /api/convert
// ============================================================

export async function POST(request: NextRequest) {
  let tempFilePath: string | null = null

  try {
    // ── 1. Authentication ──
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
    }

    const userId = session.user.id
    const userPlan = session.user.plan

    // ── 2. Rate limiting ──
    if (!checkRateLimit(userId)) {
      return NextResponse.json(
        { error: 'Muitas requisições. Aguarde um momento antes de tentar novamente.' },
        { status: 429 },
      )
    }

    // ── 3. Check credits ──
    const credits = await prisma.credits.findUnique({
      where: { userId },
    })

    if (!credits || credits.amount <= 0) {
      return NextResponse.json(
        { error: 'Créditos esgotados. Faça upgrade do seu plano para continuar convertendo.' },
        { status: 403 },
      )
    }

    // ── 4. Parse FormData and validate file ──
    const formData = await request.formData()
    const validation = validateUploadedFile(formData, userPlan)

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // ── 5. Parse conversion options ──
    const rawOptions = {
      preserveImages: formData.get('preserveImages') !== 'false',
      preserveTables: formData.get('preserveTables') !== 'false',
      preserveHeaders: formData.get('preserveHeaders') !== 'false',
    }
    const parsed = conversionOptionsSchema.safeParse(rawOptions)
    const options: ConversionOptions = parsed.success
      ? parsed.data
      : { preserveImages: true, preserveTables: true, preserveHeaders: true }

    // ── 6. Save file to temp directory ──
    const tempFileName = `crescitechmd_${nanoid(12)}.${validation.extension}`
    tempFilePath = path.join(os.tmpdir(), tempFileName)

    const fileBuffer = Buffer.from(await validation.file.arrayBuffer())
    await fs.writeFile(tempFilePath, fileBuffer)

    // ── 7. Execute Docling conversion ──
    const conversionResult = await convertDocument(tempFilePath, options)

    if (!conversionResult.success) {
      await cleanupTempFile(tempFilePath)
      tempFilePath = null

      // Log failure
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'CONVERSION_FAILED',
          details: {
            fileName: validation.file.name,
            format: validation.extension,
            size: validation.sizeBytes,
            error: conversionResult.error,
            errorType: conversionResult.errorType,
          },
          ipAddress: getClientIp(request),
          userAgent: request.headers.get('user-agent'),
        },
      })

      return NextResponse.json({ error: conversionResult.error }, { status: 422 })
    }

    // ── 8. Upload markdown to Vercel Blob ──
    const blobResult = await uploadMarkdown(conversionResult.markdown, validation.file.name)

    // ── 9. Cleanup temp file ──
    await cleanupTempFile(tempFilePath)
    tempFilePath = null

    // ── 10. Transaction: create Conversion + decrement credit ──
    const fileFormat = EXTENSION_TO_FORMAT[validation.extension] ?? 'PDF'

    const [conversion, updatedCredits] = await prisma.$transaction([
      prisma.conversion.create({
        data: {
          userId,
          originalFileName: validation.file.name,
          originalFormat: fileFormat as 'PDF' | 'DOCX' | 'PPTX' | 'XLSX' | 'PNG' | 'JPEG' | 'HTML',
          originalSize: validation.sizeBytes,
          markdownUrl: blobResult.url,
          markdownSize: blobResult.size,
          preserveImages: options.preserveImages,
          preserveTables: options.preserveTables,
          preserveHeaders: options.preserveHeaders,
          status: 'COMPLETED',
          processingTime: Math.round(conversionResult.processingTime),
        },
      }),
      prisma.credits.update({
        where: { userId },
        data: { amount: { decrement: 1 } },
      }),
    ])

    // ── 11. Audit logs (fire-and-forget) ──
    prisma.auditLog
      .createMany({
        data: [
          {
            userId,
            action: 'CONVERSION_SUCCESS',
            details: {
              conversionId: conversion.id,
              fileName: validation.file.name,
              format: validation.extension,
              originalSize: validation.sizeBytes,
              markdownSize: blobResult.size,
              processingTime: conversionResult.processingTime,
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

    // ── 12. Email notifications (fire-and-forget) ──
    const userName = session.user.name || 'Usuário'
    const userEmail = session.user.email!
    sendConversionCompletedEmail(
      userName,
      userEmail,
      validation.file.name,
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
    console.error('Conversion API error:', error)

    if (tempFilePath) {
      await cleanupTempFile(tempFilePath)
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor. Tente novamente ou contate suporte.' },
      { status: 500 },
    )
  }
}
