import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-09-30.clover',
  typescript: true,
})

export const PRICE_ONE_TIME = 2000 // $20 in cents
export const PRICE_MONTHLY = 1400 // $14 in cents
