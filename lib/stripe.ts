import Stripe from 'stripe'

// ============================================================
// Stripe server-side instance
// ============================================================

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
  typescript: true,
})

// ============================================================
// Plan configuration
// ============================================================

export const PLAN_PRICES: Record<string, string> = {
  BASIC: process.env.STRIPE_PRICE_BASIC!,
  PRO: process.env.STRIPE_PRICE_PRO!,
  BUSINESS: process.env.STRIPE_PRICE_BUSINESS!,
}

export const PLAN_CREDITS: Record<string, number> = {
  FREE: 5,
  BASIC: 50,
  PRO: 200,
  BUSINESS: 1000,
}

export const PLAN_DETAILS = {
  FREE: { name: 'Gratuito', price: 0, credits: 5, maxFileSize: '5 MB' },
  BASIC: { name: 'Básico', price: 9, credits: 50, maxFileSize: '10 MB' },
  PRO: { name: 'Pro', price: 19, credits: 200, maxFileSize: '20 MB' },
  BUSINESS: { name: 'Business', price: 39, credits: 1000, maxFileSize: '50 MB' },
} as const

export type PlanKey = keyof typeof PLAN_DETAILS
