import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { deleteBlob } from '@/lib/blob-storage'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
    }

    const { id } = await params

    // Find conversion ensuring ownership
    const conversion = await prisma.conversion.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!conversion) {
      return NextResponse.json({ error: 'Conversão não encontrada.' }, { status: 404 })
    }

    // Delete blob (best-effort)
    await deleteBlob(conversion.markdownUrl)

    // Delete conversion record
    await prisma.conversion.delete({ where: { id } })

    // Audit log (fire-and-forget)
    prisma.auditLog
      .create({
        data: {
          userId: session.user.id,
          action: 'CONVERSION_FAILED', // reused as deletion log
          details: {
            conversionId: id,
            fileName: conversion.originalFileName,
            reason: 'user_deleted',
          },
        },
      })
      .catch((err: unknown) => {
        console.error('Audit log creation failed:', err)
      })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete conversion error:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar conversão. Tente novamente.' },
      { status: 500 },
    )
  }
}
