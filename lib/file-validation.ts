import { SUPPORTED_MIME_TYPES, MAX_FILE_SIZES } from '@/lib/validations/convert'

// ============================================================
// Types
// ============================================================

interface FileValidationSuccess {
  valid: true
  file: File
  mimeType: string
  extension: string
  sizeBytes: number
}

interface FileValidationError {
  valid: false
  error: string
  code: 'NO_FILE' | 'INVALID_MIME' | 'FILE_TOO_LARGE'
}

export type FileValidationResult = FileValidationSuccess | FileValidationError

// ============================================================
// Main validation function
// ============================================================

export function validateUploadedFile(
  formData: FormData,
  userPlan: string,
): FileValidationResult {
  // 1. Extract file from FormData
  const file = formData.get('file')

  if (!file || !(file instanceof File)) {
    return {
      valid: false,
      error: 'Nenhum arquivo enviado.',
      code: 'NO_FILE',
    }
  }

  // 2. Validate MIME type
  const extension = SUPPORTED_MIME_TYPES[file.type]

  if (!extension) {
    return {
      valid: false,
      error: 'Formato não suportado. Formatos aceitos: PDF, DOCX, PPTX, XLSX, PNG, JPEG, HTML.',
      code: 'INVALID_MIME',
    }
  }

  // 3. Validate file size against plan limit
  const maxSize = MAX_FILE_SIZES[userPlan] ?? MAX_FILE_SIZES.FREE
  if (file.size > maxSize) {
    const limitMB = Math.round(maxSize / 1_048_576)
    return {
      valid: false,
      error: `Arquivo muito grande. Limite do seu plano: ${limitMB} MB.`,
      code: 'FILE_TOO_LARGE',
    }
  }

  return {
    valid: true,
    file,
    mimeType: file.type,
    extension,
    sizeBytes: file.size,
  }
}
