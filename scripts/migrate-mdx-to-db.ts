/**
 * Migration script to convert MDX files to database entries
 * Run with: npx tsx scripts/migrate-mdx-to-db.ts
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const contentDirectory = path.join(process.cwd(), 'content')

// Default sections structure
const DEFAULT_SECTIONS = [
  {
    section_id: 'overview',
    section_label: 'Overview & Store',
    sort_order: 0,
    intro_text: 'This section covers the app\'s positioning in the market, business model, and overall strategy.',
    accordions: [
      {
        title: 'Market Positioning & Target Audience',
        content: 'Details about target market and positioning strategy.',
        default_open: true,
        sort_order: 0
      },
      {
        title: 'Revenue Model & Pricing Strategy',
        content: 'Breakdown of revenue streams and pricing approach.',
        default_open: false,
        sort_order: 1
      },
      {
        title: 'Competitive Advantages',
        content: 'Key differentiators in the market.',
        default_open: false,
        sort_order: 2
      }
    ],
    screenshots: [
      { title: 'App Store Header', url: 'placeholder', sort_order: 0 },
      { title: 'App Store Screenshots 1', url: 'placeholder', sort_order: 1 },
      { title: 'App Store Screenshots 2', url: 'placeholder', sort_order: 2 },
      { title: 'Marketing Visual 1', url: 'placeholder', sort_order: 3 },
      { title: 'Marketing Visual 2', url: 'placeholder', sort_order: 4 },
      { title: 'App Icon & Branding', url: 'placeholder', sort_order: 5 }
    ]
  },
  {
    section_id: 'onboarding',
    section_label: 'Onboarding',
    sort_order: 1,
    intro_text: 'How the app introduces itself to new users and guides them through the initial setup.',
    accordions: [
      {
        title: 'Welcome & Value Proposition',
        content: 'First impressions and core value communication.',
        default_open: true,
        sort_order: 0
      },
      {
        title: 'Progressive Disclosure',
        content: 'How features are revealed gradually to prevent overwhelm.',
        default_open: false,
        sort_order: 1
      },
      {
        title: 'Permission Requests',
        content: 'Strategic timing of permission requests.',
        default_open: false,
        sort_order: 2
      }
    ],
    screenshots: [
      { title: 'Welcome Screen', url: 'placeholder', sort_order: 0 },
      { title: 'Value Proposition', url: 'placeholder', sort_order: 1 },
      { title: 'Signup Flow Step 1', url: 'placeholder', sort_order: 2 },
      { title: 'Signup Flow Step 2', url: 'placeholder', sort_order: 3 },
      { title: 'Permission Request', url: 'placeholder', sort_order: 4 },
      { title: 'Setup Complete', url: 'placeholder', sort_order: 5 }
    ]
  },
  {
    section_id: 'home',
    section_label: 'Home & Navigation',
    sort_order: 2,
    intro_text: 'The main interface where users spend most of their time.',
    accordions: [
      {
        title: 'Information Architecture',
        content: 'Content hierarchy and organization.',
        default_open: true,
        sort_order: 0
      },
      {
        title: 'Navigation Patterns',
        content: 'How users move through the app.',
        default_open: false,
        sort_order: 1
      },
      {
        title: 'Content Prioritization',
        content: 'What users see first and why.',
        default_open: false,
        sort_order: 2
      }
    ],
    screenshots: [
      { title: 'Home Screen', url: 'placeholder', sort_order: 0 },
      { title: 'Navigation Drawer', url: 'placeholder', sort_order: 1 },
      { title: 'Bottom Nav', url: 'placeholder', sort_order: 2 },
      { title: 'Menu Options', url: 'placeholder', sort_order: 3 },
      { title: 'Search Interface', url: 'placeholder', sort_order: 4 },
      { title: 'Profile View', url: 'placeholder', sort_order: 5 }
    ]
  },
  {
    section_id: 'features',
    section_label: 'Core Features',
    sort_order: 3,
    intro_text: 'Deep dive into the app\'s main functionality and user workflows.',
    accordions: [
      {
        title: 'User Flows & Interactions',
        content: 'How users accomplish key tasks.',
        default_open: true,
        sort_order: 0
      },
      {
        title: 'Feature Discoverability',
        content: 'How users find and learn advanced features.',
        default_open: false,
        sort_order: 1
      },
      {
        title: 'Engagement Loops',
        content: 'Mechanisms that keep users coming back.',
        default_open: false,
        sort_order: 2
      }
    ],
    screenshots: [
      { title: 'Feature 1 Overview', url: 'placeholder', sort_order: 0 },
      { title: 'Feature 1 In Use', url: 'placeholder', sort_order: 1 },
      { title: 'Feature 2 Overview', url: 'placeholder', sort_order: 2 },
      { title: 'Feature 2 Settings', url: 'placeholder', sort_order: 3 },
      { title: 'Feature 3 Overview', url: 'placeholder', sort_order: 4 },
      { title: 'Feature 3 Results', url: 'placeholder', sort_order: 5 }
    ]
  },
  {
    section_id: 'monetization',
    section_label: 'Monetization',
    sort_order: 4,
    intro_text: 'How the app converts users into paying customers.',
    accordions: [
      {
        title: 'Paywall Positioning & Timing',
        content: 'Strategic placement of conversion points.',
        default_open: true,
        sort_order: 0
      },
      {
        title: 'Pricing Psychology',
        content: 'Psychological principles used in pricing.',
        default_open: false,
        sort_order: 1
      },
      {
        title: 'Value Demonstration',
        content: 'How the app justifies its price.',
        default_open: false,
        sort_order: 2
      }
    ],
    screenshots: [
      { title: 'Paywall Screen', url: 'placeholder', sort_order: 0 },
      { title: 'Pricing Options', url: 'placeholder', sort_order: 1 },
      { title: 'Feature Comparison', url: 'placeholder', sort_order: 2 },
      { title: 'Upgrade CTA', url: 'placeholder', sort_order: 3 },
      { title: 'Purchase Flow', url: 'placeholder', sort_order: 4 },
      { title: 'Success Confirmation', url: 'placeholder', sort_order: 5 }
    ]
  }
]

async function migrateMDXFiles() {
  const files = fs.readdirSync(contentDirectory).filter(f => f.endsWith('.mdx'))

  console.log(`Found ${files.length} MDX files to migrate\n`)

  for (const file of files) {
    console.log(`Processing ${file}...`)

    const filePath = path.join(contentDirectory, file)
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContent)

    // Insert case study
    const { data: caseStudy, error: caseStudyError } = await supabase
      .from('case_studies')
      .insert({
        slug: data.slug,
        title: data.title,
        category: data.category,
        revenue: data.revenue,
        downloads: data.downloads,
        founder_type: data.founderType,
        business_model: data.businessModel,
        is_free: data.isFree || false,
        published_at: data.publishedAt || new Date().toISOString(),
        description: data.description,
        app_icon: data.appIcon,
        rating: data.rating,
        onboarding_steps: data.onboardingSteps,
        developer: data.developer,
        content: content,
      })
      .select()
      .single()

    if (caseStudyError) {
      console.error(`  Error creating case study: ${caseStudyError.message}`)
      continue
    }

    console.log(`  ✓ Created case study: ${caseStudy.title}`)

    // Insert sections with accordions and screenshots
    for (const section of DEFAULT_SECTIONS) {
      const { data: sectionData, error: sectionError } = await supabase
        .from('case_study_sections')
        .insert({
          case_study_id: caseStudy.id,
          section_id: section.section_id,
          section_label: section.section_label,
          intro_text: section.intro_text,
          sort_order: section.sort_order,
        })
        .select()
        .single()

      if (sectionError) {
        console.error(`    Error creating section: ${sectionError.message}`)
        continue
      }

      // Insert accordions
      for (const accordion of section.accordions) {
        await supabase.from('section_accordions').insert({
          section_id: sectionData.id,
          title: accordion.title,
          content: accordion.content,
          default_open: accordion.default_open,
          sort_order: accordion.sort_order,
        })
      }

      // Insert screenshots
      for (const screenshot of section.screenshots) {
        await supabase.from('case_study_screenshots').insert({
          section_id: sectionData.id,
          url: screenshot.url,
          title: screenshot.title,
          sort_order: screenshot.sort_order,
        })
      }

      console.log(`    ✓ Created section: ${section.section_label}`)
    }

    console.log(`  ✓ Complete!\n`)
  }

  console.log('Migration complete!')
}

migrateMDXFiles().catch(console.error)
