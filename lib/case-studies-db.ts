import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { CaseStudyWithSections } from './types/database'

// Use service client for reading public data
function getClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Check if Supabase is properly configured
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your_supabase') || supabaseKey.includes('your_supabase')) {
    return null
  }

  return createSupabaseClient(supabaseUrl, supabaseKey)
}

export async function getCaseStudiesFromDB(): Promise<CaseStudyWithSections[]> {
  const supabase = getClient()

  if (!supabase) {
    console.warn('Supabase not configured, returning empty case studies')
    return []
  }

  const { data, error } = await supabase
    .from('case_studies')
    .select(`
      *,
      sections:case_study_sections(
        *,
        accordions:section_accordions(*),
        screenshots:case_study_screenshots(*)
      )
    `)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching case studies:', error)
    return []
  }

  // Sort nested arrays manually
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sorted = data?.map((cs: any) => ({
    ...cs,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sections: cs.sections?.map((section: any) => ({
      ...section,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      accordions: section.accordions?.sort((a: any, b: any) => a.sort_order - b.sort_order) || [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      screenshots: section.screenshots?.sort((a: any, b: any) => a.sort_order - b.sort_order) || []
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })).sort((a: any, b: any) => a.sort_order - b.sort_order) || []
  }))

  return (sorted as CaseStudyWithSections[]) || []
}

export async function getCaseStudyBySlugFromDB(slug: string): Promise<CaseStudyWithSections | null> {
  const supabase = getClient()

  if (!supabase) {
    console.warn('Supabase not configured, case study not found')
    return null
  }

  const { data, error } = await supabase
    .from('case_studies')
    .select(`
      *,
      sections:case_study_sections(
        *,
        accordions:section_accordions(*),
        screenshots:case_study_screenshots(*)
      )
    `)
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching case study:', error)
    return null
  }

  // Sort nested arrays manually
  if (data?.sections) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data as any).sections = (data as any).sections
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((section: any) => ({
        ...section,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        accordions: section.accordions?.sort((a: any, b: any) => a.sort_order - b.sort_order) || [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        screenshots: section.screenshots?.sort((a: any, b: any) => a.sort_order - b.sort_order) || []
      }))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
  }

  return data as CaseStudyWithSections
}

export async function getFreeCaseStudiesFromDB(): Promise<CaseStudyWithSections[]> {
  const allCaseStudies = await getCaseStudiesFromDB()
  return allCaseStudies.filter((cs) => cs.is_free)
}

export async function getLockedCaseStudiesFromDB(): Promise<CaseStudyWithSections[]> {
  const allCaseStudies = await getCaseStudiesFromDB()
  return allCaseStudies.filter((cs) => !cs.is_free)
}
