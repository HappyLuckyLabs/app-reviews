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
    <div className={`group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:border-gray-900 hover:shadow-lg ${isLocked ? 'opacity-60' : ''}`}>
      {isLocked && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <div className="rounded-full bg-gray-900 p-4">
            <Lock className="h-7 w-7 text-white" />
          </div>
        </div>
      )}

      <div className="p-8">
        {/* App Icon */}
        {caseStudy.app_icon && (
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-900 text-3xl font-black text-white">
            {caseStudy.app_icon}
          </div>
        )}

        {/* Title & Category */}
        <div className="mb-4">
          <h3 className="text-2xl font-black text-gray-900 mb-2">
            {caseStudy.title}
          </h3>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{caseStudy.category}</p>
        </div>

        {/* Description */}
        <p className="mb-6 text-base text-gray-600 line-clamp-3 leading-relaxed">
          {caseStudy.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-6 border-t border-gray-100 pt-6 mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <div>
              <div className="font-black text-gray-900">{caseStudy.revenue}</div>
              <div className="text-xs text-gray-500">revenue</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-gray-900" />
            <div>
              <div className="font-black text-gray-900">{caseStudy.downloads}</div>
              <div className="text-xs text-gray-500">downloads</div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-gray-100 px-4 py-2 text-xs font-bold text-gray-900 uppercase tracking-wide">
            {caseStudy.business_model}
          </span>
          <span className="rounded-full bg-gray-100 px-4 py-2 text-xs font-bold text-gray-900 uppercase tracking-wide">
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
