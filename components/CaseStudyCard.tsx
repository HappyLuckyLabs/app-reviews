import Link from 'next/link'
import { Lock, TrendingUp, Download } from 'lucide-react'
import type { Database } from '@/lib/types/database'

type CaseStudy = Database['public']['Tables']['case_studies']['Row']

interface CaseStudyCardProps {
  caseStudy: CaseStudy
  isLocked?: boolean
}

export default function CaseStudyCard({ caseStudy, isLocked = false }: CaseStudyCardProps) {
  const content = (
    <div className={`group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md ${isLocked ? 'opacity-60' : ''}`}>
      {isLocked && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-sm">
          <div className="rounded-full bg-gray-900 p-3">
            <Lock className="h-6 w-6 text-white" />
          </div>
        </div>
      )}

      <div className="p-6">
        {/* App Icon */}
        {caseStudy.app_icon && (
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 text-2xl font-bold text-white">
            {caseStudy.app_icon}
          </div>
        )}

        {/* Title & Category */}
        <div className="mb-3">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {caseStudy.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{caseStudy.category}</p>
        </div>

        {/* Description */}
        <p className="mb-4 text-sm text-gray-600 line-clamp-2">
          {caseStudy.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-1.5 text-sm">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-gray-900">{caseStudy.revenue}</span>
            <span className="text-gray-500">revenue</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Download className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-gray-900">{caseStudy.downloads}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            {caseStudy.business_model}
          </span>
          <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
            {caseStudy.founder_type}
          </span>
        </div>
      </div>
    </div>
  )

  if (isLocked) {
    return (
      <div className="cursor-not-allowed">
        {content}
      </div>
    )
  }

  return (
    <Link href={`/case-study/${caseStudy.slug}`}>
      {content}
    </Link>
  )
}
