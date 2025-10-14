'use client'

import { useState, useRef } from 'react'
import { Lock } from 'lucide-react'
import { CaseStudyAnalysisDynamic } from './CaseStudyAnalysisDynamic'
import type { Database } from '@/lib/types/database'

interface Section {
  id: string
  label: string
  screenshots: string[]
}

type DBSection = Database['public']['Tables']['case_study_sections']['Row'] & {
  accordions: Database['public']['Tables']['section_accordions']['Row'][]
  screenshots: Database['public']['Tables']['case_study_screenshots']['Row'][]
}

interface CaseStudyLayoutProps {
  metadata: {
    title: string
    category: string
    revenue: string
    downloads: string
    founderType: string
    businessModel: string
    rating?: number
    appIcon?: string
    developer?: string
    onboardingSteps?: number
  }
  sections: Section[]
  caseStudySections: DBSection[]
  hasAccess: boolean
}

// ScreenTag component for linking to screenshots
export function ScreenTag({ index, onClick }: { index: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-full bg-gray-900 px-4 py-2 text-xs font-bold text-white hover:bg-gray-700 transition-colors cursor-pointer uppercase tracking-wide"
    >
      Screen {index + 1}
    </button>
  )
}

export default function CaseStudyLayout({
  metadata,
  sections,
  caseStudySections,
  hasAccess,
}: CaseStudyLayoutProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '')
  const screenshotRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollToScreenshot = (sectionId: string, screenshotIndex: number) => {
    const key = `${sectionId}-${screenshotIndex}`
    const element = screenshotRefs.current[key]

    if (element && scrollContainerRef.current) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header Bar - App Metadata */}
      <div className="sticky top-0 z-20 border-b border-gray-200 bg-white">
        <div className="mx-auto px-8 py-6">
          <div className="flex items-start gap-6">
            {/* App Icon */}
            {metadata.appIcon && (
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-3xl bg-gray-900 text-4xl font-black text-white shadow-lg">
                {metadata.appIcon}
              </div>
            )}

            {/* Title & Category */}
            <div className="flex-1">
              <h1 className="text-3xl font-black text-gray-900">{metadata.title}</h1>
              <p className="mt-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">{metadata.category}</p>
            </div>

            {/* Stats Grid */}
            <div className="flex gap-8">
              {metadata.rating && (
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Rating</div>
                  <div className="mt-1 flex items-center gap-1">
                    <div className="flex text-base">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(metadata.rating!) ? 'text-yellow-400' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-base font-black text-gray-900">{metadata.rating}</span>
                  </div>
                </div>
              )}

              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Revenue/mo</div>
                <div className="mt-1 text-base font-black text-gray-900">{metadata.revenue}</div>
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Installs/mo</div>
                <div className="mt-1 text-base font-black text-gray-900">{metadata.downloads}</div>
              </div>

              {metadata.onboardingSteps && (
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Onboarding</div>
                  <div className="mt-1 text-base font-black text-gray-900">{metadata.onboardingSteps} steps</div>
                </div>
              )}

              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Business Model</div>
                <div className="mt-1 text-base font-black text-gray-900">{metadata.businessModel}</div>
              </div>

              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Founder Type</div>
                <div className="mt-1 text-base font-black text-gray-900">{metadata.founderType}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {/* Section Tabs */}
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
          <div className="px-8">
            <div className="flex gap-1 overflow-x-auto">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`px-6 py-4 text-base font-bold transition-colors whitespace-nowrap ${
                    activeSection === section.id
                      ? 'border-b-2 border-gray-900 text-gray-900'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex h-[calc(100vh-180px)]">
          {!hasAccess ? (
            <div className="flex-1 flex items-center justify-center p-12">
              <div className="rounded-3xl border-2 border-gray-200 bg-white p-16 text-center max-w-2xl">
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                  <Lock className="h-12 w-12 text-gray-900" />
                </div>
                <h2 className="mb-6 text-4xl font-black text-gray-900">
                  Unlock Full Analysis
                </h2>
                <p className="mb-10 text-xl text-gray-600 leading-relaxed">
                  Get access to detailed UX breakdowns, growth tactics, and monetization strategies
                </p>
                <a
                  href="/pricing"
                  className="inline-block rounded-full bg-gray-900 px-10 py-5 text-lg font-bold text-white hover:bg-gray-700 transition-colors"
                >
                  Get Full Access
                </a>
              </div>
            </div>
          ) : (
            <>
              {/* Left Panel - Analysis (60%) */}
              <div className="w-[60%] overflow-y-auto border-r border-gray-200 bg-white p-8">
                <div className="prose prose-gray max-w-none">
                  <CaseStudyAnalysisDynamic
                    sectionId={activeSection}
                    caseStudySections={caseStudySections}
                    scrollToScreenshot={(idx) => scrollToScreenshot(activeSection, idx)}
                  />
                </div>
              </div>

              {/* Right Panel - Screenshots (40%) */}
              <div className="w-[40%] flex-shrink-0 bg-gray-50">
                <div
                  ref={scrollContainerRef}
                  className="h-full overflow-x-auto overflow-y-hidden p-8"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#cbd5e1 #f1f5f9'
                  }}
                >
                  <div className="flex gap-4 h-full items-start">
                    {sections
                      .find((s) => s.id === activeSection)
                      ?.screenshots.map((screenshot, idx) => (
                        <div
                          key={idx}
                          ref={(el) => {
                            screenshotRefs.current[`${activeSection}-${idx}`] = el
                          }}
                          className="flex-shrink-0 w-60"
                        >
                          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50 shadow-sm hover:shadow-md transition-all cursor-pointer">
                            <div className="aspect-[9/19.5] flex items-center justify-center p-6">
                              <div className="text-center text-gray-400">
                                <div className="mb-2 text-xs font-medium">Screenshot {idx + 1}</div>
                                <div className="text-[10px]">{screenshot}</div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 text-[10px] text-gray-500 text-center px-2">{screenshot}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
