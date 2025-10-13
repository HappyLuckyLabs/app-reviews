import { notFound } from 'next/navigation'
import { getCaseStudyBySlug, getCaseStudies } from '@/lib/mdx'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Lock, TrendingUp, Download, User, DollarSign } from 'lucide-react'

export async function generateStaticParams() {
  const caseStudies = await getCaseStudies()
  return caseStudies.map((cs) => ({ slug: cs.slug }))
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const caseStudy = await getCaseStudyBySlug(slug)

  if (!caseStudy) {
    notFound()
  }

  // Check if user has access
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let hasAccess = caseStudy.isFree

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

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex items-start gap-6">
            {/* App Icon */}
            {caseStudy.appIcon && (
              <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-400 to-blue-600 text-4xl font-bold text-white shadow-lg">
                {caseStudy.appIcon}
              </div>
            )}

            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-4xl font-bold text-gray-900">{caseStudy.title}</h1>
                <p className="mt-2 text-lg text-gray-600">{caseStudy.category}</p>
              </div>

              {/* Stats Bar */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-green-100 p-2">
                    <TrendingUp className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Revenue</div>
                    <div className="font-semibold text-gray-900">{caseStudy.revenue}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <Download className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Downloads</div>
                    <div className="font-semibold text-gray-900">{caseStudy.downloads}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-purple-100 p-2">
                    <User className="h-5 w-5 text-purple-700" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Founder Type</div>
                    <div className="font-semibold text-gray-900">{caseStudy.founderType}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-orange-100 p-2">
                    <DollarSign className="h-5 w-5 text-orange-700" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Business Model</div>
                    <div className="font-semibold text-gray-900">{caseStudy.businessModel}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        {hasAccess ? (
          <article className="prose prose-lg prose-gray max-w-none">
            <MDXRemote source={caseStudy.content} />
          </article>
        ) : (
          <div className="rounded-2xl border-2 border-gray-200 bg-gray-50 p-12 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
              <Lock className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              This case study is locked
            </h2>
            <p className="mb-8 text-lg text-gray-600">
              Unlock this and {/* TODO: calculate total */ }28+ more case studies with full access
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/pricing"
                className="rounded-lg bg-blue-600 px-8 py-4 text-base font-semibold text-white hover:bg-blue-500 transition-colors"
              >
                Get Full Access
              </Link>
              {!user && (
                <Link
                  href="/auth/login"
                  className="rounded-lg border-2 border-gray-300 px-8 py-4 text-base font-semibold text-gray-900 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
