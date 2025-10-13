'use client'

import { useState, useRef } from 'react'
import { Lock } from 'lucide-react'
import { CaseStudyAnalysis } from './CaseStudyAnalysis'

interface Section {
  id: string
  label: string
  screenshots: string[]
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
  hasAccess: boolean
}

// ScreenTag component for linking to screenshots
export function ScreenTag({ index, onClick }: { index: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200 transition-colors cursor-pointer"
    >
      Screen {index + 1}
    </button>
  )
}

export default function CaseStudyLayout({
  metadata,
  sections,
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
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 text-3xl font-bold text-white shadow-lg">
                {metadata.appIcon}
              </div>
            )}

            {/* Title & Category */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{metadata.title}</h1>
              <p className="mt-1 text-sm text-gray-600">{metadata.category}</p>
            </div>

            {/* Stats Grid */}
            <div className="flex gap-8">
              {metadata.rating && (
                <div>
                  <div className="text-xs text-gray-500">Rating</div>
                  <div className="mt-1 flex items-center gap-1">
                    <div className="flex text-sm">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(metadata.rating!) ? 'text-yellow-400' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{metadata.rating}</span>
                  </div>
                </div>
              )}

              <div>
                <div className="text-xs text-gray-500">Revenue/mo</div>
                <div className="mt-1 text-sm font-semibold text-gray-900">{metadata.revenue}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Installs/mo</div>
                <div className="mt-1 text-sm font-semibold text-gray-900">{metadata.downloads}</div>
              </div>

              {metadata.onboardingSteps && (
                <div>
                  <div className="text-xs text-gray-500">Onboarding</div>
                  <div className="mt-1 text-sm font-semibold text-gray-900">{metadata.onboardingSteps} steps</div>
                </div>
              )}

              <div>
                <div className="text-xs text-gray-500">Business Model</div>
                <div className="mt-1 text-sm font-semibold text-gray-900">{metadata.businessModel}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Founder Type</div>
                <div className="mt-1 text-sm font-semibold text-gray-900">{metadata.founderType}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {/* Section Tabs */}
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-8">
            <div className="flex gap-1 overflow-x-auto">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeSection === section.id
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
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
              <div className="rounded-2xl border-2 border-gray-200 bg-white p-12 text-center max-w-2xl">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                  <Lock className="h-10 w-10 text-blue-600" />
                </div>
                <h2 className="mb-4 text-3xl font-bold text-gray-900">
                  Unlock Full Analysis
                </h2>
                <p className="mb-8 text-lg text-gray-600">
                  Get access to detailed UX breakdowns, growth tactics, and monetization strategies
                </p>
                <a
                  href="/pricing"
                  className="inline-block rounded-lg bg-blue-600 px-8 py-4 text-base font-semibold text-white hover:bg-blue-500 transition-colors"
                >
                  Get Full Access
                </a>
              </div>
            </div>
          ) : (
            <>
              {/* Left Panel - Analysis */}
              <div className="flex-1 overflow-y-auto border-r border-gray-200 bg-white p-8">
                <div className="prose prose-gray max-w-none">
                  <CaseStudyAnalysis
                    sectionId={activeSection}
                    scrollToScreenshot={(idx) => scrollToScreenshot(activeSection, idx)}
                  />
                </div>
              </div>

              {/* Right Panel - Screenshots (Horizontal Scroll) */}
              <div className="w-[640px] flex-shrink-0 bg-gray-50">
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
