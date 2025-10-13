# AppPlaybook

The playbook database for successful apps. Learn exactly how indie founders built $100K+ apps.

## Setup Instructions

### 1. Install Dependencies

```bash
cd app-playbook
npm install
```

### 2. Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your credentials
3. Run the schema from `supabase/schema.sql` in the SQL Editor
4. Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Configure Stripe

1. Create an account at [stripe.com](https://stripe.com)
2. Get your API keys from Dashboard > Developers > API keys
3. Update `.env.local` with your Stripe credentials:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

4. Set up webhook endpoint:
   - Go to Stripe Dashboard > Developers > Webhooks
   - Add endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `customer.subscription.deleted`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Deploy to Vercel

1. Push your code to GitHub
2. Import the repo at [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

## Project Structure

```
app-playbook/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── checkout/         # Stripe checkout
│   │   └── webhooks/stripe/  # Stripe webhooks
│   ├── auth/                 # Auth pages
│   ├── case-study/[slug]/    # Dynamic case study pages
│   ├── dashboard/            # Protected dashboard
│   ├── payment/success/      # Payment success page
│   ├── pricing/              # Pricing page
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Homepage
├── components/               # React components
│   ├── CaseStudyCard.tsx
│   ├── Header.tsx
│   └── Hero.tsx
├── content/                  # MDX case studies
│   ├── rootd.mdx
│   ├── superhuman.mdx
│   └── ...
├── lib/                      # Utilities
│   ├── supabase/             # Supabase clients
│   ├── mdx.ts                # MDX utilities
│   ├── stripe.ts             # Stripe config
│   └── types.ts              # TypeScript types
└── supabase/
    └── schema.sql            # Database schema
```

## Features

- **Homepage** with hero section and case study grid
- **Case study pages** with MDX support
- **Authentication** (email/password)
- **Payment** via Stripe (one-time or subscription)
- **Protected dashboard** with all case studies
- **Responsive design** with Tailwind CSS

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Payments:** Stripe
- **Content:** MDX (Markdown)
- **Deployment:** Vercel

## Adding New Case Studies

1. Create a new `.mdx` file in the `content/` directory
2. Add frontmatter with metadata:

```mdx
---
title: "App Name"
slug: "app-slug"
category: "Category"
revenue: "$XXX"
downloads: "XXX"
founderType: "Technical/Non-technical"
businessModel: "Freemium/Subscription"
isFree: true/false
publishedAt: "2024-01-01"
description: "Short description"
appIcon: "A"
---

## Your content here...
```

3. The case study will automatically appear on the site

## License

MIT
