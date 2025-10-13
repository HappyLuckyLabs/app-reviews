'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { ScreenTag } from './CaseStudyLayout'
import type { Database } from '@/lib/types/database'
import ReactMarkdown from 'react-markdown'

type DBSection = Database['public']['Tables']['case_study_sections']['Row'] & {
  accordions: Database['public']['Tables']['section_accordions']['Row'][]
  screenshots: Database['public']['Tables']['case_study_screenshots']['Row'][]
}

interface CaseStudyAnalysisDynamicProps {
  sectionId: string
  caseStudySections: DBSection[]
  scrollToScreenshot: (index: number) => void
}

interface AccordionProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}

function Accordion({ title, defaultOpen = false, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {isOpen ? (
          <ChevronDown className="h-5 w-5 text-gray-600" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-600" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 bg-white space-y-3 text-gray-700">
          {children}
        </div>
      )}
    </div>
  )
}

export function CaseStudyAnalysisDynamic({
  sectionId,
  caseStudySections,
  scrollToScreenshot
}: CaseStudyAnalysisDynamicProps) {
  // Find the current section
  const currentSection = caseStudySections.find(s => s.section_id === sectionId)

  if (!currentSection) {
    return <div className="text-gray-500">No analysis available for this section.</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{currentSection.section_label}</h2>

      {currentSection.intro_text && (
        <div className="space-y-4 mb-6 text-gray-700">
          <ReactMarkdown>
            {currentSection.intro_text}
          </ReactMarkdown>
        </div>
      )}

      {currentSection.accordions && currentSection.accordions.length > 0 && (
        <div className="space-y-3 mt-6">
          {currentSection.accordions.map((accordion) => (
            <Accordion
              key={accordion.id}
              title={accordion.title}
              defaultOpen={accordion.default_open}
            >
              <ReactMarkdown
                components={{
                  // Custom renderer for linking to screenshots
                  // Users can write [Screen 1] in markdown and it'll become a tag
                  a: ({ node, children, ...props }) => {
                    const text = String(children)
                    const screenMatch = text.match(/^Screen (\d+)$/i)

                    if (screenMatch) {
                      const screenIndex = parseInt(screenMatch[1]) - 1
                      return (
                        <ScreenTag
                          index={screenIndex}
                          onClick={() => scrollToScreenshot(screenIndex)}
                        />
                      )
                    }

                    return <a {...props}>{children}</a>
                  }
                }}
              >
                {accordion.content}
              </ReactMarkdown>
            </Accordion>
          ))}
        </div>
      )}

      {(!currentSection.accordions || currentSection.accordions.length === 0) && (
        <div className="text-gray-500 italic">No content yet. Add accordions in the admin panel.</div>
      )}
    </div>
  )
}
