-- Case Studies table
CREATE TABLE public.case_studies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  revenue TEXT NOT NULL,
  downloads TEXT NOT NULL,
  founder_type TEXT NOT NULL,
  business_model TEXT NOT NULL,
  is_free BOOLEAN DEFAULT false NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  description TEXT,
  app_icon TEXT,
  rating NUMERIC(2,1),
  onboarding_steps INTEGER,
  developer TEXT,
  content TEXT, -- Full article/story content (markdown)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Case Study Sections (Overview, Onboarding, Home, Features, Monetization)
CREATE TABLE public.case_study_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_study_id UUID REFERENCES public.case_studies(id) ON DELETE CASCADE NOT NULL,
  section_id TEXT NOT NULL, -- 'overview', 'onboarding', 'home', 'features', 'monetization'
  section_label TEXT NOT NULL, -- Display name
  intro_text TEXT, -- Intro paragraph for the section
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(case_study_id, section_id)
);

-- Accordion items within sections
CREATE TABLE public.section_accordions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID REFERENCES public.case_study_sections(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL, -- Markdown content
  default_open BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Screenshots for each section
CREATE TABLE public.case_study_screenshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID REFERENCES public.case_study_sections(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL, -- Screenshot URL (Supabase Storage or external)
  title TEXT NOT NULL, -- Screenshot description
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_study_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_accordions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_study_screenshots ENABLE ROW LEVEL SECURITY;

-- Public read access for all case studies (everyone can view)
CREATE POLICY "Anyone can view case studies" ON public.case_studies
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view sections" ON public.case_study_sections
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view accordions" ON public.section_accordions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view screenshots" ON public.case_study_screenshots
  FOR SELECT USING (true);

-- Admin write access (we'll add admin check later)
-- For now, authenticated users with specific email can manage
CREATE POLICY "Admins can insert case studies" ON public.case_studies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update case studies" ON public.case_studies
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete case studies" ON public.case_studies
  FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert sections" ON public.case_study_sections
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update sections" ON public.case_study_sections
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete sections" ON public.case_study_sections
  FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert accordions" ON public.section_accordions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update accordions" ON public.section_accordions
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete accordions" ON public.section_accordions
  FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can insert screenshots" ON public.case_study_screenshots
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update screenshots" ON public.case_study_screenshots
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete screenshots" ON public.case_study_screenshots
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create indexes for better query performance
CREATE INDEX idx_case_studies_slug ON public.case_studies(slug);
CREATE INDEX idx_case_studies_published_at ON public.case_studies(published_at DESC);
CREATE INDEX idx_case_study_sections_case_study_id ON public.case_study_sections(case_study_id);
CREATE INDEX idx_section_accordions_section_id ON public.section_accordions(section_id);
CREATE INDEX idx_case_study_screenshots_section_id ON public.case_study_screenshots(section_id);

-- Create function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at trigger functions
CREATE TRIGGER on_case_studies_updated
  BEFORE UPDATE ON public.case_studies
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_case_study_sections_updated
  BEFORE UPDATE ON public.case_study_sections
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_section_accordions_updated
  BEFORE UPDATE ON public.section_accordions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_case_study_screenshots_updated
  BEFORE UPDATE ON public.case_study_screenshots
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Add admin role to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
