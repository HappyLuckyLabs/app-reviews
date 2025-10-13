import { notFound } from 'next/navigation'
import { getCaseStudyBySlug, getCaseStudies } from '@/lib/mdx'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { createClient } from '@/lib/supabase/server'
import CaseStudyLayout from '@/components/CaseStudyLayout'

export async function generateStaticParams() {
  const caseStudies = await getCaseStudies()
  return caseStudies.map((cs) => ({ slug: cs.slug }))
}

// Example sections - you'll customize these per case study
const getSections = (slug: string) => {
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

// Analysis content for each section
const getAnalysis = (content: string) => {
  return {
    overview: (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Business Overview</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            This section covers the app&apos;s positioning in the market, business model, and overall strategy.
          </p>
          <h3 className="text-xl font-semibold text-gray-900 mt-6">Key Insights</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Market positioning and target audience</li>
            <li>Revenue model and pricing strategy</li>
            <li>Competitive advantages</li>
          </ul>
        </div>
      </div>
    ),
    onboarding: (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Onboarding Experience</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            How the app introduces itself to new users and guides them through the initial setup.
          </p>
          <h3 className="text-xl font-semibold text-gray-900 mt-6">UX Breakdown</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Progressive disclosure of features</li>
            <li>Permission requests and timing</li>
            <li>Value proposition communication</li>
          </ul>
        </div>
      </div>
    ),
    home: (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Home & Navigation</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            The main interface where users spend most of their time.
          </p>
          <h3 className="text-xl font-semibold text-gray-900 mt-6">Design Patterns</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Information architecture</li>
            <li>Navigation patterns</li>
            <li>Content prioritization</li>
          </ul>
        </div>
      </div>
    ),
    features: (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Core Features</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            Deep dive into the app&apos;s main functionality and user workflows.
          </p>
          <h3 className="text-xl font-semibold text-gray-900 mt-6">Feature Analysis</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>User flows and interactions</li>
            <li>Feature discoverability</li>
            <li>Engagement loops</li>
          </ul>
        </div>
      </div>
    ),
    monetization: (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Monetization Strategy</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            How the app converts users into paying customers.
          </p>
          <h3 className="text-xl font-semibold text-gray-900 mt-6">Conversion Tactics</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Paywall positioning and timing</li>
            <li>Pricing psychology</li>
            <li>Value demonstration</li>
          </ul>
        </div>
      </div>
    ),
  }
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

  const sections = getSections(slug)
  const analysis = getAnalysis(caseStudy.content)

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
      analysis={analysis}
      hasAccess={hasAccess}
    />
  )
}
