import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CaseStudyEditor from '@/components/admin/CaseStudyEditor'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function NewCaseStudyPage() {
  const supabase = await createClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login?redirect=/admin/case-studies/new')
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white px-8 py-4">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-gray-900">Create New Case Study</h1>
      </div>

      <CaseStudyEditor />
    </div>
  )
}
