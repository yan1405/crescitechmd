import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { validateUploadedFile } from '@/lib/file-validation'
import { conversionOptionsSchema } from '@/lib/validations/convert'

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
// POST /api/convert
// Returns proxy URL + API key for frontend to call Render directly.
// This avoids the Vercel 60s serverless timeout on the free plan.
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
    const options = parsed.success
      ? parsed.data
      : { preserveImages: true, preserveTables: true, preserveHeaders: true }

    // ── 6. Return proxy info for frontend to call Render directly ──
    const proxyUrl = process.env.DOCLING_API_URL
    if (!proxyUrl) {
      console.error('[convert] DOCLING_API_URL is not configured')
      return NextResponse.json(
        { error: 'Serviço de conversão não configurado. Contate suporte.' },
        { status: 503 },
      )
    }

    return NextResponse.json({
      proxyUrl: `${proxyUrl}/convert`,
      apiKey: process.env.DOCLING_API_KEY ?? '',
      options,
    })
  } catch (error) {
    console.error('Conversion API error:', error)

    return NextResponse.json(
      { error: 'Erro interno do servidor. Tente novamente ou contate suporte.' },
      { status: 500 },
    )
  }
}
