'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react'
import ImageUpload from './ImageUpload'
import CaseStudyPreview from './CaseStudyPreview'

interface Section {
  section_id: string
  section_label: string
  intro_text: string
  sort_order: number
  accordions: {
    title: string
    content: string
    default_open: boolean
    sort_order: number
  }[]
  screenshots: {
    url: string
    title: string
    sort_order: number
  }[]
}

interface CaseStudyFormData {
  slug: string
  title: string
  category: string
  revenue: string
  downloads: string
  founder_type: string
  business_model: string
  is_free: boolean
  description: string
  app_icon: string
  rating: number | null
  onboarding_steps: number | null
  developer: string
  content: string
  sections: Section[]
}

const DEFAULT_SECTIONS: Section[] = [
  {
    section_id: 'overview',
    section_label: 'Overview & Store',
    intro_text: '',
    sort_order: 0,
    accordions: [],
    screenshots: []
  },
  {
    section_id: 'onboarding',
    section_label: 'Onboarding',
    intro_text: '',
    sort_order: 1,
    accordions: [],
    screenshots: []
  },
  {
    section_id: 'home',
    section_label: 'Home & Navigation',
    intro_text: '',
    sort_order: 2,
    accordions: [],
    screenshots: []
  },
  {
    section_id: 'features',
    section_label: 'Core Features',
    intro_text: '',
    sort_order: 3,
    accordions: [],
    screenshots: []
  },
  {
    section_id: 'monetization',
    section_label: 'Monetization',
    intro_text: '',
    sort_order: 4,
    accordions: [],
    screenshots: []
  }
]

interface CaseStudyEditorProps {
  initialData?: Partial<CaseStudyFormData>
  caseStudyId?: string
}

export default function CaseStudyEditor({ initialData, caseStudyId }: CaseStudyEditorProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [formData, setFormData] = useState<CaseStudyFormData>({
    slug: initialData?.slug || '',
    title: initialData?.title || '',
    category: initialData?.category || '',
    revenue: initialData?.revenue || '',
    downloads: initialData?.downloads || '',
    founder_type: initialData?.founder_type || '',
    business_model: initialData?.business_model || '',
    is_free: initialData?.is_free || false,
    description: initialData?.description || '',
    app_icon: initialData?.app_icon || '',
    rating: initialData?.rating || null,
    onboarding_steps: initialData?.onboarding_steps || null,
    developer: initialData?.developer || '',
    content: initialData?.content || '',
    sections: initialData?.sections || DEFAULT_SECTIONS,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = caseStudyId
        ? `/api/admin/case-studies/${caseStudyId}`
        : '/api/admin/case-studies'

      const method = caseStudyId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to save case study')
      }

      router.push('/admin')
      router.refresh()
    } catch (error) {
      console.error('Error saving case study:', error)
      alert('Failed to save case study. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addAccordion = (sectionIndex: number) => {
    const newSections = [...formData.sections]
    newSections[sectionIndex].accordions.push({
      title: '',
      content: '',
      default_open: false,
      sort_order: newSections[sectionIndex].accordions.length,
    })
    setFormData({ ...formData, sections: newSections })
  }

  const removeAccordion = (sectionIndex: number, accordionIndex: number) => {
    const newSections = [...formData.sections]
    newSections[sectionIndex].accordions.splice(accordionIndex, 1)
    setFormData({ ...formData, sections: newSections })
  }

  const addScreenshot = (sectionIndex: number) => {
    const newSections = [...formData.sections]
    newSections[sectionIndex].screenshots.push({
      url: '',
      title: '',
      sort_order: newSections[sectionIndex].screenshots.length,
    })
    setFormData({ ...formData, sections: newSections })
  }

  const removeScreenshot = (sectionIndex: number, screenshotIndex: number) => {
    const newSections = [...formData.sections]
    newSections[sectionIndex].screenshots.splice(screenshotIndex, 1)
    setFormData({ ...formData, sections: newSections })
  }

  return (
    <div className="flex h-[calc(100vh-120px)]">
      {/* Left: Form Editor */}
      <div className={`${showPreview ? 'w-1/2' : 'w-full'} overflow-y-auto border-r border-gray-200 bg-white transition-all`}>
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Toggle Preview Button */}
          <div className="flex items-center justify-end sticky top-0 bg-white py-2 z-10 border-b border-gray-200 -mx-8 px-8 -mt-8 mb-6">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPreview ? 'Hide' : 'Show'} Preview
            </button>
          </div>

          {/* Basic Info */}
          <div className="rounded-lg bg-gray-50 p-6 border border-gray-200">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Basic Information</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Slug</label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Revenue</label>
            <input
              type="text"
              required
              value={formData.revenue}
              onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
              placeholder="e.g., $1M+"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Downloads</label>
            <input
              type="text"
              required
              value={formData.downloads}
              onChange={(e) => setFormData({ ...formData, downloads: e.target.value })}
              placeholder="e.g., 4M+"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Founder Type</label>
            <input
              type="text"
              required
              value={formData.founder_type}
              onChange={(e) => setFormData({ ...formData, founder_type: e.target.value })}
              placeholder="e.g., Non-technical"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Business Model</label>
            <input
              type="text"
              required
              value={formData.business_model}
              onChange={(e) => setFormData({ ...formData, business_model: e.target.value })}
              placeholder="e.g., Freemium"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">App Icon (emoji/letter)</label>
            <input
              type="text"
              value={formData.app_icon}
              onChange={(e) => setFormData({ ...formData, app_icon: e.target.value })}
              placeholder="e.g., R or 📱"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rating (0-5)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={formData.rating || ''}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value ? parseFloat(e.target.value) : null })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Onboarding Steps</label>
            <input
              type="number"
              value={formData.onboarding_steps || ''}
              onChange={(e) => setFormData({ ...formData, onboarding_steps: e.target.value ? parseInt(e.target.value) : null })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Developer</label>
            <input
              type="text"
              value={formData.developer}
              onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_free}
                onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">Free Case Study</span>
            </label>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">Story Content (Markdown)</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={10}
            placeholder="Write the full case study story here using Markdown..."
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
      </div>

          {/* Sections */}
          {formData.sections.map((section, sectionIndex) => (
            <div key={section.section_id} className="rounded-lg bg-gray-50 p-6 border border-gray-200">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">{section.section_label}</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Intro Text</label>
            <textarea
              value={section.intro_text}
              onChange={(e) => {
                const newSections = [...formData.sections]
                newSections[sectionIndex].intro_text = e.target.value
                setFormData({ ...formData, sections: newSections })
              }}
              rows={2}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          {/* Accordions */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">Accordions</h3>
              <button
                type="button"
                onClick={() => addAccordion(sectionIndex)}
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-500"
              >
                <Plus className="h-4 w-4" />
                Add Accordion
              </button>
            </div>
            <div className="space-y-4">
              {section.accordions.map((accordion, accordionIndex) => (
                <div key={accordionIndex} className="rounded-md border border-gray-200 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <input
                      type="text"
                      value={accordion.title}
                      onChange={(e) => {
                        const newSections = [...formData.sections]
                        newSections[sectionIndex].accordions[accordionIndex].title = e.target.value
                        setFormData({ ...formData, sections: newSections })
                      }}
                      placeholder="Accordion title"
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeAccordion(sectionIndex, accordionIndex)}
                      className="ml-2 text-red-600 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <textarea
                    value={accordion.content}
                    onChange={(e) => {
                      const newSections = [...formData.sections]
                      newSections[sectionIndex].accordions[accordionIndex].content = e.target.value
                      setFormData({ ...formData, sections: newSections })
                    }}
                    rows={3}
                    placeholder="Accordion content (Markdown supported)"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                  <label className="mt-2 flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={accordion.default_open}
                      onChange={(e) => {
                        const newSections = [...formData.sections]
                        newSections[sectionIndex].accordions[accordionIndex].default_open = e.target.checked
                        setFormData({ ...formData, sections: newSections })
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    />
                    <span className="ml-2 text-gray-600">Open by default</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Screenshots */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">Screenshots</h3>
              <button
                type="button"
                onClick={() => addScreenshot(sectionIndex)}
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-500"
              >
                <Plus className="h-4 w-4" />
                Add Screenshot
              </button>
            </div>
            <div className="space-y-6">
              {section.screenshots.map((screenshot, screenshotIndex) => (
                <div key={screenshotIndex} className="rounded-md border border-gray-200 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-700">Screenshot {screenshotIndex + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeScreenshot(sectionIndex, screenshotIndex)}
                      className="text-red-600 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                    <ImageUpload
                      value={screenshot.url}
                      onChange={(url) => {
                        const newSections = [...formData.sections]
                        newSections[sectionIndex].screenshots[screenshotIndex].url = url
                        setFormData({ ...formData, sections: newSections })
                      }}
                      onRemove={() => {
                        const newSections = [...formData.sections]
                        newSections[sectionIndex].screenshots[screenshotIndex].url = ''
                        setFormData({ ...formData, sections: newSections })
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
                    <input
                      type="text"
                      value={screenshot.title}
                      onChange={(e) => {
                        const newSections = [...formData.sections]
                        newSections[sectionIndex].screenshots[screenshotIndex].title = e.target.value
                        setFormData({ ...formData, sections: newSections })
                      }}
                      placeholder="Screenshot caption or title"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        ))}

          {/* Submit */}
          <div className="flex items-center justify-end gap-4 sticky bottom-0 bg-white py-4 border-t border-gray-200 -mx-8 px-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : caseStudyId ? 'Update Case Study' : 'Create Case Study'}
            </button>
          </div>
        </form>
      </div>

      {/* Right: Live Preview */}
      {showPreview && (
        <div className="w-1/2 overflow-hidden">
          <CaseStudyPreview formData={formData} />
        </div>
      )}
    </div>
  )
}
