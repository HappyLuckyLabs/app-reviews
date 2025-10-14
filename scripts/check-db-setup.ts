import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDatabase() {
  console.log('🔍 Checking database setup...\n')

  // Check if users table exists
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('*')
    .limit(1)

  if (usersError) {
    console.log('❌ Users table error:', usersError.message)
    console.log('   The users table may not exist or have wrong structure')
  } else {
    console.log('✅ Users table exists')
    if (users && users.length > 0) {
      console.log('   Columns:', Object.keys(users[0]).join(', '))
    }
  }

  // Check if case_studies table exists
  const { data: caseStudies, error: csError } = await supabase
    .from('case_studies')
    .select('*')
    .limit(1)

  if (csError) {
    console.log('❌ Case studies table error:', csError.message)
    console.log('   The case_studies table may not exist')
  } else {
    console.log('✅ Case studies table exists')
    console.log(`   Found ${caseStudies?.length || 0} case studies`)
  }

  // Check auth users
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers()

  if (authError) {
    console.log('❌ Auth users error:', authError.message)
  } else {
    console.log(`✅ Found ${authData.users.length} auth users`)
    authData.users.forEach(user => {
      console.log(`   - ${user.email} (id: ${user.id})`)
    })
  }

  console.log('\n📋 Next steps:')
  console.log('   1. If users table has errors, run supabase/schema.sql in SQL Editor')
  console.log('   2. If case_studies table has errors, run supabase/admin-schema.sql')
  console.log('   3. Check that is_admin column exists in users table')
}

checkDatabase().catch(console.error)
