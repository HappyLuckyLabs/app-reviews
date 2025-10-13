import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Header() {
  let user = null
  let subscriptionStatus = 'free'

  // Only try to get user if Supabase is configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = await createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      user = authUser

      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('subscription_status')
          .eq('id', user.id)
          .single()
        subscriptionStatus = userData?.subscription_status || 'free'
      }
    } catch (error) {
      console.error('Failed to get user:', error)
    }
  }

  const isPaid = subscriptionStatus === 'paid_lifetime' || subscriptionStatus === 'paid_monthly'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          AppPlaybook
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              {isPaid ? (
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/pricing"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
                >
                  Unlock All
                </Link>
              )}
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Sign Out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
