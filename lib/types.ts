export type SubscriptionStatus = 'free' | 'paid_lifetime' | 'paid_monthly'

export interface User {
  id: string
  email: string
  subscription_status: SubscriptionStatus
  stripe_customer_id?: string
  created_at: string
}

export interface CaseStudyMetadata {
  title: string
  slug: string
  category: string
  revenue: string
  downloads: string
  founderType: string
  businessModel: string
  isFree: boolean
  publishedAt: string
  description: string
  appIcon?: string
  rating?: number
  onboardingSteps?: number
  developer?: string
}

export interface CaseStudy extends CaseStudyMetadata {
  content: string
}
