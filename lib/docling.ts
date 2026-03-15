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

// Subprocess fallback (local dev)
const PYTHON_CMD = process.env.PYTHON_CMD ?? (process.platform === 'win32' ? 'python' : 'python3')
const CONVERT_SCRIPT = path.join(process.cwd(), 'lib', 'docling', 'convert.py')

// External API (production)
const DOCLING_API_URL = process.env.DOCLING_API_URL
const DOCLING_API_KEY = process.env.DOCLING_API_KEY

// ============================================================
// Main conversion function (strategy pattern)
// ============================================================

export async function convertDocument(
  filePath: string,
  options: ConversionOptions,
): Promise<ConversionResult> {
  if (DOCLING_API_URL) {
    return convertViaApi(filePath, options)
  }
  return convertViaSubprocess(filePath, options)
}

// ============================================================
// Strategy 1: External API (production)
// ============================================================

async function convertViaApi(
  filePath: string,
  options: ConversionOptions,
): Promise<ConversionResult> {
  let fileBuffer: Buffer
  try {
    fileBuffer = await fs.readFile(filePath)
  } catch {
    return {
      success: false,
      error: 'Arquivo não encontrado ou corrompido. Tente exportar novamente.',
      errorType: 'CORRUPTED',
    }
  }

  const fileName = path.basename(filePath)
  const blob = new Blob([new Uint8Array(fileBuffer)])
  const formData = new FormData()
  formData.append('file', blob, fileName)
  formData.append('options', JSON.stringify(options))

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), CONVERSION_TIMEOUT_MS)

    const response = await fetch(`${DOCLING_API_URL}/convert`, {
      method: 'POST',
      headers: {
        'X-API-Key': DOCLING_API_KEY ?? '',
      },
      body: formData,
      signal: controller.signal,
    })

    clearTimeout(timer)

    const result: ConversionResult = await response.json()
    return result
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        error:
          'Timeout após 60 segundos. Arquivo muito complexo. Reduza o tamanho ou número de páginas.',
        errorType: 'TIMEOUT',
      }
    }

    console.error('[docling] API request error:', {
      url: DOCLING_API_URL,
      error: error instanceof Error ? error.message : String(error),
    })

    return {
      success: false,
      error: 'Erro ao conectar com o serviço de conversão. Tente novamente ou contate suporte.',
      errorType: 'UNKNOWN',
    }
  }
}

// ============================================================
// Strategy 2: Local subprocess (dev fallback)
// ============================================================

async function convertViaSubprocess(
  filePath: string,
  options: ConversionOptions,
): Promise<ConversionResult> {
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
      setTimeout(() => {
        if (!child.killed) child.kill('SIGKILL')
      }, 2000)

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
      console.error('[docling] Subprocess spawn error:', {
        message: err.message,
        code: (err as NodeJS.ErrnoException).code,
        pythonCmd: PYTHON_CMD,
        script: CONVERT_SCRIPT,
      })

      const hint = (err as NodeJS.ErrnoException).code === 'ENOENT'
        ? ` Python command "${PYTHON_CMD}" não encontrado. Defina PYTHON_CMD no .env.local.`
        : ''

      settle({
        success: false,
        error: `Erro ao iniciar processo de conversão.${hint} Tente novamente ou contate suporte.`,
        errorType: 'UNKNOWN',
      })
    })

    child.on('close', (code) => {
      clearTimeout(timer)

      try {
        const result = JSON.parse(stdout.trim()) as ConversionResult
        settle(result)
      } catch {
        console.error('[docling] stdout parse error:', {
          exitCode: code,
          stderr: stderr.substring(0, 1000),
          stdout: stdout.substring(0, 500),
          pythonCmd: PYTHON_CMD,
        })

        settle({
          success: false,
          error: 'Erro ao processar arquivo. Tente novamente ou contate suporte.',
          errorType: 'UNKNOWN',
        })
      }
    })
  })
}
