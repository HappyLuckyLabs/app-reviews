import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function createScreenshotBucket() {
  console.log('📦 Creating case-study-screenshots bucket...\n')

  const { data, error } = await supabase.storage.createBucket('case-study-screenshots', {
    public: true,
    fileSizeLimit: 5242880, // 5MB
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
  })

  if (error) {
    if (error.message.includes('already exists')) {
      console.log('✅ Bucket already exists!')
    } else {
      console.log('❌ Error creating bucket:', error.message)
    }
    return
  }

  console.log('✅ Bucket created successfully!')
  console.log('   Name:', data.name)
  console.log('   Public: true')
  console.log('   Max file size: 5MB')
}

createScreenshotBucket().catch(console.error)
