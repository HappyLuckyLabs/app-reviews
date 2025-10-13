'use client'

import { useState } from 'react'
import { Lock } from 'lucide-react'

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
  analysis: {
    [sectionId: string]: React.ReactNode
  }
  hasAccess: boolean
}

export default function CaseStudyLayout({
  metadata,
  sections,
  analysis,
  hasAccess,
}: CaseStudyLayoutProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '')

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar - App Metadata */}
      <aside className="sticky top-0 h-screen w-80 flex-shrink-0 border-r border-gray-200 bg-white p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* App Icon & Title */}
          <div>
            {metadata.appIcon && (
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 text-3xl font-bold text-white shadow-lg">
                {metadata.appIcon}
              </div>
            )}
            <h1 className="text-2xl font-bold text-gray-900">{metadata.title}</h1>
            <p className="mt-1 text-sm text-gray-600">{metadata.category}</p>
          </div>

          {/* Rating */}
          {metadata.rating && (
            <div>
              <div className="text-sm text-gray-500">Rating</div>
              <div className="mt-1 flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(metadata.rating!) ? 'text-yellow-400' : 'text-gray-300'}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="font-semibold text-gray-900">{metadata.rating}</span>
              </div>
            </div>
          )}

          {/* Key Metrics */}
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-500">Revenue/mo</div>
              <div className="mt-1 font-semibold text-gray-900">{metadata.revenue}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Installs/mo</div>
              <div className="mt-1 font-semibold text-gray-900">{metadata.downloads}</div>
            </div>

            {metadata.onboardingSteps && (
              <div>
                <div className="text-sm text-gray-500">Onboarding</div>
                <div className="mt-1 font-semibold text-gray-900">{metadata.onboardingSteps} steps</div>
              </div>
            )}
          </div>

          {/* Developer */}
          {metadata.developer && (
            <div>
              <div className="text-sm text-gray-500">Developer</div>
              <div className="mt-1 font-semibold text-gray-900">{metadata.developer}</div>
            </div>
          )}

          {/* Additional Info */}
          <div className="border-t border-gray-200 pt-4 space-y-3">
            <div>
              <div className="text-sm text-gray-500">Founder Type</div>
              <div className="mt-1 text-sm font-medium text-gray-900">{metadata.founderType}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Business Model</div>
              <div className="mt-1 text-sm font-medium text-gray-900">{metadata.businessModel}</div>
            </div>
          </div>
        </div>
      </aside>

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
        <div className="mx-auto max-w-7xl px-8 py-12">
          {!hasAccess ? (
            <div className="rounded-2xl border-2 border-gray-200 bg-white p-12 text-center">
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
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Screenshots Column */}
              <div>
                <div className="sticky top-24">
                  <div className="space-y-4">
                    {sections
                      .find((s) => s.id === activeSection)
                      ?.screenshots.map((screenshot, idx) => (
                        <div
                          key={idx}
                          className="overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50 p-8 shadow-sm"
                        >
                          <div className="flex h-[600px] items-center justify-center">
                            <div className="text-center text-gray-400">
                              <div className="mb-2 text-sm font-medium">Screenshot {idx + 1}</div>
                              <div className="text-xs">{screenshot}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Analysis Column */}
              <div>
                <div className="prose prose-gray max-w-none">
                  {analysis[activeSection] || (
                    <div className="text-gray-500">No analysis available for this section.</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
