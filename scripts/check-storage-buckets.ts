import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkStorageBuckets() {
  console.log('🗄️  Checking Supabase Storage buckets...\n')

  const { data: buckets, error } = await supabase.storage.listBuckets()

  if (error) {
    console.log('❌ Error fetching buckets:', error.message)
    return
  }

  if (buckets.length === 0) {
    console.log('⚠️  No storage buckets found')
    console.log('\n📋 Next steps:')
    console.log('   1. Create a bucket called "case-study-screenshots" in Supabase Storage')
    console.log('   2. Set it to public (or configure RLS policies)')
    console.log('   3. Then we can add image upload functionality')
    return
  }

  console.log(`✅ Found ${buckets.length} storage bucket(s):\n`)

  for (const bucket of buckets) {
    console.log(`📦 ${bucket.name}`)
    console.log(`   ID: ${bucket.id}`)
    console.log(`   Public: ${bucket.public}`)
    console.log(`   Created: ${bucket.created_at}`)
    console.log('')
  }
}

checkStorageBuckets().catch(console.error)
