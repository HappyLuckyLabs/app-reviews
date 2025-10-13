# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AppPlaybook is a Next.js application that provides a curated database of case studies for successful apps. The platform features both free and paid content with authentication, payments via Stripe, and a full admin CMS for managing case studies.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, Supabase (PostgreSQL + Auth), Stripe, MDX

## Development Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Build for production with Turbopack
npm run start            # Start production server
npm run lint             # Run ESLint

# Database migration
npx tsx scripts/migrate-mdx-to-db.ts  # Migrate MDX files to database
```

## Architecture Overview

### Content System - Dual Mode Architecture

The app supports **two content sources** that can coexist:

1. **Legacy MDX System** (`lib/mdx.ts`): Reads `.mdx` files from `/content` directory
2. **Database CMS** (`lib/case-studies-db.ts`): Reads from Supabase tables

**Current state:** The app is transitioning to database-driven content. Case study pages (`app/case-study/[slug]/page.tsx`) read from the database via `getCaseStudyBySlugFromDB()`.

### Database Schema - Relational Structure

Case studies are stored in a relational structure:

```
case_studies (main table)
└── case_study_sections (5 sections: overview, onboarding, home, features, monetization)
    ├── section_accordions (collapsible content blocks with markdown)
    └── case_study_screenshots (image URLs with titles)
```

**Key tables:**
- `case_studies`: Metadata (title, slug, category, revenue, founder type, business model, etc.)
- `case_study_sections`: Sections with intro text
- `section_accordions`: Collapsible analysis blocks with markdown content
- `case_study_screenshots`: Screenshot URLs and titles
- `users`: User accounts with `subscription_status` and `is_admin` flags

**Access Control:**
- Free case studies: `is_free = true`
- Paid case studies: Requires `subscription_status` = `paid_lifetime` or `paid_monthly`
- Admin CMS: Requires `is_admin = true` in users table

### Supabase Client Patterns

**Three different client types are used:**

1. **Server Client** (`lib/supabase/server.ts`): For server components and API routes, uses cookie-based sessions
2. **Anon Client** (`lib/case-studies-db.ts`): For public data reads, uses `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Browser Client** (`lib/supabase/client.ts`): For client components, uses `createBrowserClient()`

### Admin CMS System

**Location:** `/app/admin/*` and `/app/api/admin/*`

**Admin flow:**
1. User must be authenticated and have `is_admin = true` in database
2. Admin endpoints (`/api/admin/case-studies`) check both auth and admin status
3. Admin UI (`/app/admin/page.tsx`) allows CRUD operations on case studies
4. Forms support creating sections, accordions, and screenshots inline

**Making a user admin:**
```sql
UPDATE users SET is_admin = true WHERE email = 'user@example.com';
```

### Payment Flow - Stripe Integration

1. User clicks "Get Access" → Redirected to `/pricing`
2. User selects plan → API route `/api/checkout` creates Stripe checkout session
3. Stripe redirects to `/payment/success` on completion
4. Webhook `/api/webhooks/stripe` listens for `checkout.session.completed` and `customer.subscription.deleted`
5. Webhook updates `users.subscription_status` in database

**Stripe webhook signature verification is required** - webhook secret must be set in `.env.local`

### Authentication Flow

- Uses Supabase Auth (email/password)
- Sign up: `/auth/signup` → Creates user in `auth.users` AND `public.users` (via trigger or manual insert)
- Login: `/auth/login` → Sets session cookie
- Protected routes use `createClient()` from `lib/supabase/server.ts` to check `getUser()`

### Case Study Rendering

**Path:** `/case-study/[slug]` → `app/case-study/[slug]/page.tsx`

**Rendering logic:**
1. Fetch case study from database via `getCaseStudyBySlugFromDB(slug)`
2. Check user authentication and subscription status
3. Set `hasAccess = is_free || (user && (paid_lifetime || paid_monthly))`
4. Pass data to `CaseStudyLayout` component
5. `CaseStudyLayout` renders sections with accordions and screenshots

**Components:**
- `CaseStudyLayout`: Main layout with header bar and side-by-side panels
- `CaseStudyAnalysis`: Renders accordions and screenshots for a section
- `CaseStudyCard`: Grid card for homepage/dashboard

### Environment Variables Required

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

## Path Aliases

TypeScript is configured with `@/*` mapping to root:
```typescript
import { createClient } from '@/lib/supabase/server'
```

## Database Setup

1. Run `supabase/schema.sql` first (creates users table, sets up auth trigger)
2. Run `supabase/admin-schema.sql` (creates case study tables and admin field)
3. Make user admin: `UPDATE users SET is_admin = true WHERE email = '...'`
4. Optionally migrate MDX: `npx tsx scripts/migrate-mdx-to-db.ts`

## Key Files to Know

- `lib/case-studies-db.ts`: All database queries for case studies
- `lib/supabase/server.ts`: Server-side Supabase client factory
- `app/case-study/[slug]/page.tsx`: Case study page with access control
- `app/api/admin/case-studies/route.ts`: Admin CRUD endpoints
- `components/CaseStudyLayout.tsx`: Main case study layout component
- `lib/types/database.ts`: TypeScript types for all database tables

## Important Notes

- **Turbopack is enabled** for both dev and build commands
- **Screenshots are text placeholders by default** - upload to Vercel Blob, Supabase Storage, or external CDN for actual images
- **Admin access is database-driven** - no hardcoded admin emails in code
- **Case studies use markdown in accordion content** - rendered with `react-markdown` and `@tailwindcss/typography`
- **RLS policies** on all tables allow public read but require auth for writes
