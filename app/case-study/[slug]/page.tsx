import { notFound } from 'next/navigation'
import { getCaseStudyBySlug, getCaseStudies } from '@/lib/mdx'
import { createClient } from '@/lib/supabase/server'
import CaseStudyLayout from '@/components/CaseStudyLayout'

export async function generateStaticParams() {
  const caseStudies = await getCaseStudies()
  return caseStudies.map((cs) => ({ slug: cs.slug }))
}

// Example sections - you'll customize these per case study
const getSections = () => {
  // Default sections for all case studies with more screenshots to demo scrolling
  return [
    {
      id: 'overview',
      label: 'Overview & Store',
      screenshots: [
        'App Store Header',
        'App Store Screenshots 1',
        'App Store Screenshots 2',
        'Marketing Visual 1',
        'Marketing Visual 2',
        'App Icon & Branding'
      ]
    },
    {
      id: 'onboarding',
      label: 'Onboarding',
      screenshots: [
        'Welcome Screen',
        'Value Proposition',
        'Signup Flow Step 1',
        'Signup Flow Step 2',
        'Permission Request',
        'Setup Complete'
      ]
    },
    {
      id: 'home',
      label: 'Home & Navigation',
      screenshots: [
        'Home Screen',
        'Navigation Drawer',
        'Bottom Nav',
        'Menu Options',
        'Search Interface',
        'Profile View'
      ]
    },
    {
      id: 'features',
      label: 'Core Features',
      screenshots: [
        'Feature 1 Overview',
        'Feature 1 In Use',
        'Feature 2 Overview',
        'Feature 2 Settings',
        'Feature 3 Overview',
        'Feature 3 Results'
      ]
    },
    {
      id: 'monetization',
      label: 'Monetization',
      screenshots: [
        'Paywall Screen',
        'Pricing Options',
        'Feature Comparison',
        'Upgrade CTA',
        'Purchase Flow',
        'Success Confirmation'
      ]
    },
  ]
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const caseStudy = await getCaseStudyBySlug(slug)

  if (!caseStudy) {
    notFound()
  }

  // Check if user has access
  let hasAccess = caseStudy.isFree

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user && !hasAccess) {
        const { data: userData } = await supabase
          .from('users')
          .select('subscription_status')
          .eq('id', user.id)
          .single()

        const isPaid = userData?.subscription_status === 'paid_lifetime' ||
                       userData?.subscription_status === 'paid_monthly'
        hasAccess = isPaid
      }
    } catch (error) {
      console.error('Error checking access:', error)
    }
  }

  const sections = getSections()

  return (
    <CaseStudyLayout
      metadata={{
        title: caseStudy.title,
        category: caseStudy.category,
        revenue: caseStudy.revenue,
        downloads: caseStudy.downloads,
        founderType: caseStudy.founderType,
        businessModel: caseStudy.businessModel,
        rating: caseStudy.rating,
        appIcon: caseStudy.appIcon,
        developer: caseStudy.developer,
        onboardingSteps: caseStudy.onboardingSteps,
      }}
      sections={sections}
      hasAccess={hasAccess}
    />
  )
}
