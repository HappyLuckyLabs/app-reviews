import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET all case studies (admin view with full data)
export async function GET() {
  const supabase = await createClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if user is admin (using email as key)
  const { data: userData } = await supabase
    .from('users')
    .select('is_admin')
    .eq('email', user.email)
    .single()

  if (!userData?.is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Fetch all case studies with related data
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
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST create new case study
export async function POST(request: Request) {
  const supabase = await createClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if user is admin (using email as key)
  const { data: userData } = await supabase
    .from('users')
    .select('is_admin')
    .eq('email', user.email)
    .single()

  if (!userData?.is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()

  // Insert case study
  const { data: caseStudy, error: caseStudyError } = await supabase
    .from('case_studies')
    .insert({
      slug: body.slug,
      title: body.title,
      category: body.category,
      revenue: body.revenue,
      downloads: body.downloads,
      founder_type: body.founder_type,
      business_model: body.business_model,
      is_free: body.is_free || false,
      description: body.description,
      app_icon: body.app_icon,
      rating: body.rating,
      onboarding_steps: body.onboarding_steps,
      developer: body.developer,
      content: body.content,
    })
    .select()
    .single()

  if (caseStudyError) {
    return NextResponse.json({ error: caseStudyError.message }, { status: 500 })
  }

  // Insert sections if provided
  if (body.sections && Array.isArray(body.sections)) {
    for (const section of body.sections) {
      const { data: sectionData, error: sectionError } = await supabase
        .from('case_study_sections')
        .insert({
          case_study_id: caseStudy.id,
          section_id: section.section_id,
          section_label: section.section_label,
          intro_text: section.intro_text,
          sort_order: section.sort_order || 0,
        })
        .select()
        .single()

      if (sectionError) {
        console.error('Section error:', sectionError)
        continue
      }

      // Insert accordions for this section
      if (section.accordions && Array.isArray(section.accordions)) {
        for (const accordion of section.accordions) {
          await supabase.from('section_accordions').insert({
            section_id: sectionData.id,
            title: accordion.title,
            content: accordion.content,
            default_open: accordion.default_open || false,
            sort_order: accordion.sort_order || 0,
          })
        }
      }

      // Insert screenshots for this section
      if (section.screenshots && Array.isArray(section.screenshots)) {
        for (const screenshot of section.screenshots) {
          await supabase.from('case_study_screenshots').insert({
            section_id: sectionData.id,
            url: screenshot.url,
            title: screenshot.title,
            sort_order: screenshot.sort_order || 0,
          })
        }
      }
    }
  }

  return NextResponse.json(caseStudy, { status: 201 })
}
