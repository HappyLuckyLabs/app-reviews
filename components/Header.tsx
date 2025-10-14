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
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white font-bold">
            A
          </div>
          <span className="text-xl font-semibold text-gray-900">AppPlaybook</span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-8">
          <Link
            href="/#case-studies"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Case Studies
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Pricing
          </Link>

          {user ? (
            <>
              {isPaid && (
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Dashboard
                </Link>
              )}
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Sign Out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
