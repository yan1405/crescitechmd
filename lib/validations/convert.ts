import { z } from 'zod/v4'

export const conversionOptionsSchema = z.object({
  preserveImages: z.boolean().default(true),
  preserveTables: z.boolean().default(true),
  preserveHeaders: z.boolean().default(true),
})

export const SUPPORTED_FORMATS = [
  'pdf',
  'docx',
  'pptx',
  'xlsx',
  'png',
  'jpeg',
  'jpg',
  'html',
] as const

export const SUPPORTED_MIME_TYPES: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'text/html': 'html',
}

export const MAX_FILE_SIZES: Record<string, number> = {
  FREE: 5_242_880, // 5 MB
  BASIC: 10_485_760, // 10 MB
  PRO: 20_971_520, // 20 MB
  BUSINESS: 52_428_800, // 50 MB
}

export type ConversionOptionsInput = z.infer<typeof conversionOptionsSchema>
export type SupportedFormat = (typeof SUPPORTED_FORMATS)[number]
