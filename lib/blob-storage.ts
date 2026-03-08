import { put, del } from '@vercel/blob'
import { nanoid } from 'nanoid'

// ============================================================
// Types
// ============================================================

export interface BlobUploadResult {
  url: string
  downloadUrl: string
  pathname: string
  size: number
}

// ============================================================
// Upload markdown to Vercel Blob
// ============================================================

export async function uploadMarkdown(
  markdownContent: string,
  originalFileName: string,
): Promise<BlobUploadResult> {
  // Sanitize original filename: remove extension, keep only safe chars, truncate
  const baseName = originalFileName
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50)

  const uniqueId = nanoid(10)
  const now = new Date()
  const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const pathname = `conversions/${yearMonth}/${baseName || 'documento'}_${uniqueId}.md`

  const blob = await put(pathname, markdownContent, {
    access: 'public',
    contentType: 'text/markdown; charset=utf-8',
  })

  return {
    url: blob.url,
    downloadUrl: blob.downloadUrl,
    pathname: blob.pathname,
    size: Buffer.byteLength(markdownContent, 'utf-8'),
  }
}

// ============================================================
// Delete blob (best-effort, non-critical)
// ============================================================

export async function deleteBlob(url: string): Promise<void> {
  try {
    await del(url)
  } catch (error) {
    console.error('Blob deletion failed (non-critical):', error)
  }
}
