import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkAdminStatus() {
  console.log('🔍 Checking admin status for all users...\n')

  // Get all auth users
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers()

  if (authError) {
    console.log('❌ Error fetching auth users:', authError.message)
    return
  }

  console.log(`Found ${authData.users.length} auth users:\n`)

  for (const authUser of authData.users) {
    console.log(`📧 ${authUser.email}`)
    console.log(`   Auth ID: ${authUser.id}`)

    // Check if user exists in public.users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', authUser.email)
      .maybeSingle()

    if (userError) {
      console.log(`   ❌ Error checking user: ${userError.message}`)
    } else if (!userData) {
      console.log(`   ⚠️  User not found in public.users table`)
    } else {
      console.log(`   ✅ Found in public.users`)
      console.log(`   is_admin: ${userData.is_admin || false}`)
      console.log(`   Fields:`, Object.keys(userData).join(', '))
    }
    console.log('')
  }
}

checkAdminStatus().catch(console.error)
