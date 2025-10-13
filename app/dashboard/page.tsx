import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getCaseStudies } from '@/lib/mdx'
import CaseStudyCard from '@/components/CaseStudyCard'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Check subscription status
  const { data: userData } = await supabase
    .from('users')
    .select('subscription_status')
    .eq('id', user.id)
    .single()

  const subscriptionStatus = userData?.subscription_status || 'free'
  const isPaid = subscriptionStatus === 'paid_lifetime' || subscriptionStatus === 'paid_monthly'

  if (!isPaid) {
    redirect('/pricing')
  }

  const allCaseStudies = await getCaseStudies()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900">
            All Case Studies
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {allCaseStudies.length} in-depth app analyses
          </p>
        </div>

        {/* Stats Bar */}
        <div className="mb-8 grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500">Subscription</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">
              {subscriptionStatus === 'paid_lifetime' ? 'Lifetime' : 'Monthly'}
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500">Total Case Studies</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">
              {allCaseStudies.length}
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <div className="text-sm text-gray-500">Categories</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">
              {new Set(allCaseStudies.map((cs) => cs.category)).size}
            </div>
          </div>
        </div>

        {/* Search & Filters (Placeholder for MVP) */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search case studies..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allCaseStudies.map((caseStudy) => (
            <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} />
          ))}
        </div>

        {allCaseStudies.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-lg text-gray-500">
              No case studies available yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
