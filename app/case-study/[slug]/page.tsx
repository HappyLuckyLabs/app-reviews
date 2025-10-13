import { notFound } from 'next/navigation'
import { getCaseStudyBySlugFromDB, getCaseStudiesFromDB } from '@/lib/case-studies-db'
import { createClient } from '@/lib/supabase/server'
import CaseStudyLayout from '@/components/CaseStudyLayout'

export async function generateStaticParams() {
  // Only generate static params if database is available
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return []
  }

  try {
    const caseStudies = await getCaseStudiesFromDB()
    return caseStudies.map((cs) => ({ slug: cs.slug }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const caseStudy = await getCaseStudyBySlugFromDB(slug)

  if (!caseStudy) {
    notFound()
  }

  // Check if user has access
  let hasAccess = caseStudy.is_free

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

  // Map database sections to component format
  const sections = caseStudy.sections?.map(section => ({
    id: section.section_id,
    label: section.section_label,
    screenshots: section.screenshots?.map(s => s.title) || []
  })) || []

  return (
    <CaseStudyLayout
      metadata={{
        title: caseStudy.title,
        category: caseStudy.category,
        revenue: caseStudy.revenue,
        downloads: caseStudy.downloads,
        founderType: caseStudy.founder_type,
        businessModel: caseStudy.business_model,
        rating: caseStudy.rating || undefined,
        appIcon: caseStudy.app_icon || undefined,
        developer: caseStudy.developer || undefined,
        onboardingSteps: caseStudy.onboarding_steps || undefined,
      }}
      sections={sections}
      caseStudySections={caseStudy.sections || []}
      hasAccess={hasAccess}
    />
  )
}
