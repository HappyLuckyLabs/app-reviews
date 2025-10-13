# Admin CMS Setup Guide

## Overview

You now have a full admin CMS for managing case studies. No more editing MDX files!

## Database Setup

1. **Run the schema migration** in your Supabase SQL Editor:
   ```bash
   # Copy and paste the contents of supabase/admin-schema.sql
   # into your Supabase SQL Editor and run it
   ```

2. **Make yourself an admin**:
   ```sql
   -- In Supabase SQL Editor, run:
   UPDATE users
   SET is_admin = true
   WHERE email = 'your-email@example.com';
   ```

## Migrating Existing MDX Content

To migrate your existing MDX files to the database:

```bash
npx tsx scripts/migrate-mdx-to-db.ts
```

This will:
- Create database entries for all MDX files in `/content`
- Set up default sections (Overview, Onboarding, Home, Features, Monetization)
- Add placeholder accordions and screenshots for each section
- Preserve all metadata and content

## Using the Admin Dashboard

### Access
Go to `/admin` on your site. You must be logged in and marked as admin.

### Creating a Case Study

1. Click "New Case Study"
2. Fill in basic information:
   - **Title**: Full app name
   - **Slug**: URL-friendly identifier (e.g., "notion")
   - **Category**: e.g., "Productivity"
   - **Revenue**: e.g., "$1M+"
   - **Downloads**: e.g., "4M+"
   - **Founder Type**: e.g., "Non-technical"
   - **Business Model**: e.g., "Freemium"
   - **Is Free**: Check if this is a free case study
   - **App Icon**: Single letter or emoji
   - **Rating**: 0-5 stars
   - **Description**: Short summary
   - **Story Content**: Full markdown article (optional, for future use)

3. For each section (Overview, Onboarding, Home, Features, Monetization):
   - **Intro Text**: Brief introduction to the section
   - **Accordions**: Add collapsible content blocks
     - Title: Section heading (e.g., "Market Positioning")
     - Content: Markdown-supported detailed analysis
     - Default Open: Check to expand by default
   - **Screenshots**: Add screenshot references
     - URL: Image URL or placeholder text
     - Title: Screenshot caption

4. Click "Create Case Study"

### Markdown Tips for Accordion Content

You can use markdown in accordion content:
- **Bold**: `**text**`
- *Italic*: `*text*`
- Lists: `- item` or `1. item`
- Links: `[text](url)`
- Code: `` `code` ``

To link to a screenshot, write `[Screen 1]` and it will automatically become a clickable tag.

## Editing Case Studies

1. Go to `/admin`
2. Find the case study in the list
3. Click "Edit"
4. Make your changes
5. Click "Update Case Study"

## Screenshot Management

Currently, screenshots are text placeholders. To add actual images:

### Option 1: Vercel Blob (Recommended for MVP)
```bash
npm install @vercel/blob
```
Then upload images to Vercel Blob and use the URLs

### Option 2: Supabase Storage
1. Create a storage bucket in Supabase
2. Upload screenshots
3. Use the public URLs in the screenshot URL field

### Option 3: External CDN
Upload to Cloudinary, Imgur, or any image host and paste URLs

## Outsourcing Case Study Creation

Share this with your VA or contractor:

1. Give them admin access (set `is_admin = true` for their email)
2. Provide this guide
3. Give them the case study template:

```
Title: [App Name]
Slug: [lowercase-with-hyphens]
Category: [e.g., Health & Wellness]
Revenue: [e.g., $500K+]
Downloads: [e.g., 2M+]
Founder Type: [e.g., Technical]
Business Model: [e.g., Subscription]

Each section should have:
- 3 accordions with detailed analysis
- 6 screenshots with descriptive titles

Focus on:
- Specific UX decisions and why they work
- Business metrics and growth tactics
- Screenshots that illustrate key points
```

## API Endpoints

If you need programmatic access:

- `GET /api/admin/case-studies` - List all
- `POST /api/admin/case-studies` - Create new
- `GET /api/admin/case-studies/[id]` - Get one
- `PUT /api/admin/case-studies/[id]` - Update
- `DELETE /api/admin/case-studies/[id]` - Delete

All require authentication and admin role.

## Troubleshooting

**"Forbidden" error**: Make sure your user has `is_admin = true` in the database

**Can't see case study on site**: Check `is_free` if you're not logged in

**Screenshots not loading**: Verify the URLs are publicly accessible

**Markdown not rendering**: Make sure you're using proper markdown syntax

## Next Steps

1. Run the database migration
2. Make yourself admin
3. Migrate MDX files (or create new case studies from scratch)
4. Test by creating a new case study
5. Share admin access with your VA

Need help? Check the code in `/app/admin` and `/components/admin`
