# AppPlaybook - Complete Setup Guide

## What's Been Built

A complete MVP for AppPlaybook with:
- ✅ Homepage with hero section and case study grid
- ✅ 2 FREE case studies (Rootd + Superhuman)
- ✅ 10 LOCKED placeholder case studies
- ✅ Full authentication system (email/password)
- ✅ Stripe payment integration ($20 lifetime or $14/month)
- ✅ Protected dashboard
- ✅ MDX-powered case study pages
- ✅ Responsive design with Tailwind CSS

## Quick Start (5 Steps)

### 1. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (2-3 minutes)
3. Go to **Settings → API** and copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key (click "Reveal" first)

4. Go to **SQL Editor** and paste the entire contents of `supabase/schema.sql`
5. Click **Run** to create the database tables

### 2. Set Up Stripe

1. Go to [stripe.com](https://stripe.com) and create an account (or use test mode)
2. Go to **Developers → API Keys** and copy:
   - Publishable key
   - Secret key

3. Set up webhook (for production):
   - Go to **Developers → Webhooks**
   - Click **Add endpoint**
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `customer.subscription.deleted`
   - Copy the **Signing secret**

### 3. Configure Environment Variables

Update `.env.local` with your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Locally

```bash
cd app-playbook
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel

1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-github-repo-url
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com) and click **Import Project**
3. Select your GitHub repo
4. Add all environment variables from `.env.local`
5. Update `NEXT_PUBLIC_APP_URL` to your Vercel domain
6. Deploy!

7. Update Stripe webhook URL to your Vercel domain

## Project Structure

```
app-playbook/
├── app/
│   ├── api/
│   │   ├── checkout/         # Stripe checkout session
│   │   └── webhooks/stripe/  # Handle Stripe webhooks
│   ├── auth/
│   │   ├── login/           # Login page
│   │   ├── signup/          # Sign up page
│   │   ├── callback/        # Auth callback handler
│   │   └── signout/         # Sign out handler
│   ├── case-study/[slug]/   # Dynamic case study pages
│   ├── dashboard/           # Protected dashboard
│   ├── payment/success/     # Post-payment success page
│   ├── pricing/             # Pricing page
│   └── page.tsx             # Homepage
├── components/
│   ├── CaseStudyCard.tsx    # Case study card component
│   ├── Header.tsx           # Site header with auth
│   └── Hero.tsx             # Homepage hero section
├── content/                 # MDX case studies
│   ├── rootd.mdx           # FREE: Rootd case study
│   ├── superhuman.mdx      # FREE: Superhuman case study
│   └── *.mdx               # 10 locked placeholder case studies
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Browser Supabase client
│   │   ├── server.ts       # Server Supabase client
│   │   └── middleware.ts   # Auth middleware
│   ├── mdx.ts              # MDX file parsing
│   ├── stripe.ts           # Stripe configuration
│   └── types.ts            # TypeScript types
└── supabase/
    └── schema.sql          # Database schema
```

## Testing the Flow

### 1. Test Authentication
- Go to `/auth/signup`
- Create an account with a test email
- You should be redirected to `/pricing`

### 2. Test Payment (Test Mode)
- Use Stripe test card: `4242 4242 4242 4242`
- Any future expiry date
- Any CVC
- Complete checkout
- You should be redirected to `/payment/success`

### 3. Test Access
- Go to `/dashboard`
- You should see all 12 case studies
- Click on any case study to view it
- Try viewing a locked case study without paying (should show paywall)

## Adding More Case Studies

1. Create a new `.mdx` file in `content/` folder:

```mdx
---
title: "App Name"
slug: "app-slug"
category: "Productivity"
revenue: "$100K+"
downloads: "1M+"
founderType: "Technical"
businessModel: "Freemium"
isFree: false
publishedAt: "2024-01-15"
description: "Short description of the app"
appIcon: "A"
---

## Origin Story

Content here...

## Growth Playbook

More content...
```

2. The case study will automatically appear on the site

## Next Steps (Post-MVP)

After validating with real users, consider adding:

### Week 2-3:
- [ ] Search functionality
- [ ] Filter by category, revenue, founder type
- [ ] User dashboard improvements
- [ ] More complete case studies (aim for 5+ full ones)

### Month 2:
- [ ] Email notifications
- [ ] User reading progress tracking
- [ ] Bookmarking/favoriting
- [ ] Social share buttons

### Month 3+:
- [ ] Comments/discussions
- [ ] User-submitted case studies
- [ ] API access
- [ ] Mobile app

## Troubleshooting

### Build Errors
- Make sure all environment variables are set
- Check that Supabase schema is created
- Verify Stripe keys are correct

### Authentication Issues
- Check Supabase project is active
- Verify email confirmation settings in Supabase dashboard
- Check browser console for errors

### Payment Issues
- Use Stripe test mode for development
- Check webhook endpoint is receiving events
- Verify webhook secret matches

### Content Issues
- Make sure `content/` folder exists
- Check MDX frontmatter is valid
- Verify `isFree` is set correctly

## Support

- **Supabase Docs:** https://supabase.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **Next.js Docs:** https://nextjs.org/docs

## License

MIT
