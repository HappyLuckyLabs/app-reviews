-- Add status column to case_studies table
-- Allows: 'draft', 'ready_to_review', 'published'
-- Default: 'published' (so existing case studies remain visible)

ALTER TABLE public.case_studies
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published'
CHECK (status IN ('draft', 'ready_to_review', 'published'));

-- Create index for filtering by status
CREATE INDEX IF NOT EXISTS idx_case_studies_status ON public.case_studies(status);

-- Update existing case studies to 'published' status
UPDATE public.case_studies
SET status = 'published'
WHERE status IS NULL;

-- Update the RLS policy to only show published case studies to non-admins
DROP POLICY IF EXISTS "Anyone can view case studies" ON public.case_studies;

CREATE POLICY "Anyone can view published case studies" ON public.case_studies
  FOR SELECT USING (
    status = 'published' OR
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE email IN (
        SELECT email FROM public.users WHERE is_admin = true
      )
    )
  );
