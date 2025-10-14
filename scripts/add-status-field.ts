import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function addStatusField() {
  console.log('Adding status field to case_studies table...')

  // Add status column with default 'published' for existing records
  const { error: alterError } = await supabase.rpc('exec_sql', {
    sql: `
      -- Add status column if it doesn't exist
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'case_studies'
          AND column_name = 'status'
        ) THEN
          ALTER TABLE public.case_studies
          ADD COLUMN status TEXT DEFAULT 'published'
          CHECK (status IN ('draft', 'ready_to_review', 'published'));

          -- Create index for filtering by status
          CREATE INDEX IF NOT EXISTS idx_case_studies_status ON public.case_studies(status);

          RAISE NOTICE 'Status column added successfully';
        ELSE
          RAISE NOTICE 'Status column already exists';
        END IF;
      END $$;
    `
  })

  if (alterError) {
    console.error('Error adding status field:', alterError)

    // Fallback: Try direct SQL execution
    console.log('Trying fallback method...')
    console.log('\nPlease run this SQL in your Supabase SQL Editor:')
    console.log(`
-- Add status column to case_studies table
ALTER TABLE public.case_studies
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published'
CHECK (status IN ('draft', 'ready_to_review', 'published'));

-- Create index for filtering by status
CREATE INDEX IF NOT EXISTS idx_case_studies_status ON public.case_studies(status);

-- Update existing case studies to 'published' status
UPDATE public.case_studies SET status = 'published' WHERE status IS NULL;
    `)
    return
  }

  console.log('✓ Status field added successfully')

  // Verify the change
  const { data, error } = await supabase
    .from('case_studies')
    .select('id, title, status')
    .limit(5)

  if (error) {
    console.error('Error verifying change:', error)
  } else {
    console.log('\nSample case studies with status:')
    console.table(data)
  }
}

addStatusField()
