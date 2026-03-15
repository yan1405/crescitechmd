import { loadStripe } from '@stripe/stripe-js'

let stripePromise: ReturnType<typeof loadStripe> | null = null

export function getStripeClient() {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (!key) {
      console.warn('[stripe-client] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined.')
      return null
    }
    stripePromise = loadStripe(key)
  }
  return stripePromise
}
