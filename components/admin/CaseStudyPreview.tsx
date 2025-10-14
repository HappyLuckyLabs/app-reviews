'use client'

import { useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'

interface Section {
  section_id: string
  section_label: string
  intro_text: string
  accordions: {
    title: string
    content: string
    default_open: boolean
  }[]
  screenshots: {
    url: string
    title: string
  }[]
}

interface CaseStudyPreviewProps {
  formData: {
    title: string
    category: string
    revenue: string
    downloads: string
    founder_type: string
    business_model: string
    app_icon: string
    rating: number | null
    onboarding_steps: number | null
    sections: Section[]
  }
}

export default function CaseStudyPreview({ formData }: CaseStudyPreviewProps) {
  const [activeSection, setActiveSection] = useState(formData.sections[0]?.section_id || '')
  const [openAccordions, setOpenAccordions] = useState<Set<number>>(new Set())
  const screenshotRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const activeSectionData = formData.sections.find(s => s.section_id === activeSection)

  const toggleAccordion = (index: number) => {
    const newOpen = new Set(openAccordions)
    if (newOpen.has(index)) {
      newOpen.delete(index)
    } else {
      newOpen.add(index)
    }
    setOpenAccordions(newOpen)
  }

  const scrollToScreenshot = (screenshotIndex: number) => {
    const key = `${activeSection}-${screenshotIndex}`
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
    <div className="h-full flex flex-col bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
      {/* Top Header Bar - App Metadata */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-start gap-4">
            {/* App Icon */}
            {formData.app_icon && (
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-xl font-bold text-white shadow-lg">
                {formData.app_icon}
              </div>
            )}

            {/* Title & Category */}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-gray-900 truncate">{formData.title || 'Untitled'}</h1>
              <p className="text-xs text-gray-600">{formData.category || 'Category'}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mt-4 flex gap-4 flex-wrap text-xs">
            {formData.rating && (
              <div>
                <div className="text-gray-500">Rating</div>
                <div className="mt-1 flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(formData.rating!) ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="font-semibold text-gray-900">{formData.rating}</span>
                </div>
              </div>
            )}

            <div>
              <div className="text-gray-500">Revenue/mo</div>
              <div className="mt-1 font-semibold text-gray-900">{formData.revenue || 'N/A'}</div>
            </div>

            <div>
              <div className="text-gray-500">Installs/mo</div>
              <div className="mt-1 font-semibold text-gray-900">{formData.downloads || 'N/A'}</div>
            </div>

            {formData.onboarding_steps && (
              <div>
                <div className="text-gray-500">Onboarding</div>
                <div className="mt-1 font-semibold text-gray-900">{formData.onboarding_steps} steps</div>
              </div>
            )}

            <div>
              <div className="text-gray-500">Business Model</div>
              <div className="mt-1 font-semibold text-gray-900">{formData.business_model || 'N/A'}</div>
            </div>

            <div>
              <div className="text-gray-500">Founder Type</div>
              <div className="mt-1 font-semibold text-gray-900">{formData.founder_type || 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex gap-1 overflow-x-auto px-4">
          {formData.sections.map((section) => (
            <button
              key={section.section_id}
              onClick={() => setActiveSection(section.section_id)}
              className={`px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                activeSection === section.section_id
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {section.section_label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 min-h-0">
        {/* Left Panel - Analysis */}
        <div className="flex-1 overflow-y-auto bg-white p-4">
          <div className="prose prose-sm max-w-none">
            {activeSectionData?.intro_text && (
              <p className="text-sm text-gray-700 mb-4">{activeSectionData.intro_text}</p>
            )}

            {activeSectionData?.accordions.map((accordion, idx) => (
              <div key={idx} className="mb-3 border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                >
                  <span className="text-sm font-semibold text-gray-900">
                    {accordion.title || `Accordion ${idx + 1}`}
                  </span>
                  <span className="text-gray-400">{openAccordions.has(idx) ? '−' : '+'}</span>
                </button>
                {openAccordions.has(idx) && (
                  <div className="px-4 py-3 text-xs text-gray-700 border-t border-gray-200">
                    {accordion.content ? (
                      <ReactMarkdown
                        components={{
                          a: ({ node, ...props }) => {
                            const text = props.children?.toString() || ''
                            const screenMatch = text.match(/\[Screen (\d+)\]/)
                            if (screenMatch) {
                              const screenNum = parseInt(screenMatch[1]) - 1
                              return (
                                <button
                                  onClick={() => scrollToScreenshot(screenNum)}
                                  className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700 hover:bg-blue-200 transition-colors cursor-pointer"
                                >
                                  {text}
                                </button>
                              )
                            }
                            return <a {...props} className="text-blue-600 hover:underline" />
                          }
                        }}
                      >
                        {accordion.content}
                      </ReactMarkdown>
                    ) : (
                      <span className="text-gray-400 italic">No content yet...</span>
                    )}
                  </div>
                )}
              </div>
            ))}

            {(!activeSectionData?.accordions || activeSectionData.accordions.length === 0) && (
              <p className="text-sm text-gray-400 italic">No accordions added yet. Add some in the editor!</p>
            )}
          </div>
        </div>

        {/* Right Panel - Screenshots */}
        <div className="w-64 flex-shrink-0 bg-gray-50 border-l border-gray-200">
          <div
            ref={scrollContainerRef}
            className="h-full overflow-x-auto overflow-y-hidden p-3"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#cbd5e1 #f1f5f9'
            }}
          >
            <div className="flex gap-2 h-full items-start">
              {activeSectionData?.screenshots.map((screenshot, idx) => (
                <div
                  key={idx}
                  ref={(el) => {
                    screenshotRefs.current[`${activeSection}-${idx}`] = el
                  }}
                  className="flex-shrink-0 w-32"
                >
                  <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all">
                    {screenshot.url ? (
                      <img
                        src={screenshot.url}
                        alt={screenshot.title || `Screenshot ${idx + 1}`}
                        className="w-full h-auto object-cover"
                      />
                    ) : (
                      <div className="aspect-[9/19.5] flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                        <div className="text-center text-gray-400 p-2">
                          <div className="text-[10px] font-medium">Screenshot {idx + 1}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-1 text-[9px] text-gray-500 text-center px-1 line-clamp-2">
                    {screenshot.title || 'Untitled'}
                  </div>
                </div>
              ))}

              {(!activeSectionData?.screenshots || activeSectionData.screenshots.length === 0) && (
                <div className="flex items-center justify-center w-full h-full">
                  <p className="text-xs text-gray-400 italic text-center px-4">
                    No screenshots added yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
