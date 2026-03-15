import 'server-only'
import Stripe from 'stripe'

// Re-export plan config for backwards compatibility in server-only code
export { PLAN_CREDITS, PLAN_DETAILS } from '@/lib/plans'
export type { PlanKey } from '@/lib/plans'

// ============================================================
// Stripe server-side instance
// ============================================================

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    'STRIPE_SECRET_KEY is not defined. Add it to your .env.local file.',
  )
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-02-25.clover',
  typescript: true,
})

// ============================================================
// Price IDs (server-only)
// ============================================================

export const PLAN_PRICES: Record<string, string> = {
  BASIC: process.env.STRIPE_PRICE_BASIC!,
  PRO: process.env.STRIPE_PRICE_PRO!,
  BUSINESS: process.env.STRIPE_PRICE_BUSINESS!,
}
