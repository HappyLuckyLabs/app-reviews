import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CaseStudyEditor from '@/components/admin/CaseStudyEditor'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function EditCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login?redirect=/admin/case-studies/' + id)
  }

  // Check if user is admin (using email as key)
  const { data: userData } = await supabase
    .from('users')
    .select('is_admin')
    .eq('email', user.email)
    .single()

  if (!userData?.is_admin) {
    redirect('/')
  }

  // Fetch case study
  const { data: caseStudy } = await supabase
    .from('case_studies')
    .select(`
      *,
      sections:case_study_sections(
        *,
        accordions:section_accordions(*),
        screenshots:case_study_screenshots(*)
      )
    `)
    .eq('id', id)
    .single()

  if (!caseStudy) {
    redirect('/admin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Case Study</h1>
          <p className="mt-2 text-sm text-gray-600">
            Update {caseStudy.title}
          </p>
        </div>

        <CaseStudyEditor initialData={caseStudy} caseStudyId={id} />
      </div>
    </div>
  )
}
