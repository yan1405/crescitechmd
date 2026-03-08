import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs/promises'

// ============================================================
// Types
// ============================================================

export interface ConversionOptions {
  preserveImages: boolean
  preserveTables: boolean
  preserveHeaders: boolean
}

export interface ConversionSuccess {
  success: true
  markdown: string
  processingTime: number
}

export interface ConversionError {
  success: false
  error: string
  errorType: 'CORRUPTED' | 'UNSUPPORTED' | 'TIMEOUT' | 'UNKNOWN'
}

export type ConversionResult = ConversionSuccess | ConversionError

// ============================================================
// Constants
// ============================================================

const CONVERSION_TIMEOUT_MS = 60_000 // 60 seconds
const PYTHON_CMD = process.platform === 'win32' ? 'python3.11' : 'python3.11'
const CONVERT_SCRIPT = path.join(process.cwd(), 'lib', 'docling', 'convert.py')

// ============================================================
// Main conversion function
// ============================================================

export async function convertDocument(
  filePath: string,
  options: ConversionOptions,
): Promise<ConversionResult> {
  // Verify file exists before spawning Python
  try {
    await fs.access(filePath)
  } catch {
    return {
      success: false,
      error: 'Arquivo não encontrado ou corrompido. Tente exportar novamente.',
      errorType: 'CORRUPTED',
    }
  }

  const optionsJson = JSON.stringify(options)

  return new Promise<ConversionResult>((resolve) => {
    let stdout = ''
    let stderr = ''
    let settled = false

    const settle = (result: ConversionResult) => {
      if (settled) return
      settled = true
      resolve(result)
    }

    const child = spawn(PYTHON_CMD, [CONVERT_SCRIPT, filePath, optionsJson], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: process.cwd(),
    })

    // Timeout enforcement
    const timer = setTimeout(() => {
      child.kill('SIGTERM')
      // Give it 2s to die gracefully, then force kill
      setTimeout(() => {
        if (!child.killed) child.kill('SIGKILL')
      }, 2000)

      cleanupFile(filePath)
      settle({
        success: false,
        error:
          'Timeout após 60 segundos. Arquivo muito complexo. Reduza o tamanho ou número de páginas.',
        errorType: 'TIMEOUT',
      })
    }, CONVERSION_TIMEOUT_MS)

    child.stdout.on('data', (data: Buffer) => {
      stdout += data.toString()
    })

    child.stderr.on('data', (data: Buffer) => {
      stderr += data.toString()
    })

    child.on('error', (err) => {
      clearTimeout(timer)
      console.error('Docling subprocess error:', err.message)

      cleanupFile(filePath)
      settle({
        success: false,
        error: 'Erro ao iniciar processo de conversão. Tente novamente ou contate suporte.',
        errorType: 'UNKNOWN',
      })
    })

    child.on('close', (code) => {
      clearTimeout(timer)

      // Try to parse JSON from stdout
      try {
        const result = JSON.parse(stdout.trim()) as ConversionResult

        if (!result.success) {
          cleanupFile(filePath)
        }

        settle(result)
      } catch {
        // stdout wasn't valid JSON
        console.error('Docling stdout parse error. stderr:', stderr)
        console.error('Docling stdout:', stdout.substring(0, 500))

        cleanupFile(filePath)
        settle({
          success: false,
          error: 'Erro ao processar arquivo. Tente novamente ou contate suporte.',
          errorType: 'UNKNOWN',
        })
      }
    })
  })
}

// ============================================================
// Helpers
// ============================================================

async function cleanupFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath)
  } catch {
    // File may already be deleted or not exist — ignore
  }
}
