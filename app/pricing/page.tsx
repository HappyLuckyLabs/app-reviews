import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Check } from 'lucide-react'
import Link from 'next/link'

export default async function PricingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If not logged in, redirect to signup
  if (!user) {
    redirect('/auth/signup')
  }

  // Check if already paid
  const { data: userData } = await supabase
    .from('users')
    .select('subscription_status')
    .eq('id', user.id)
    .single()

  const isPaid = userData?.subscription_status === 'paid_lifetime' ||
                 userData?.subscription_status === 'paid_monthly'

  if (isPaid) {
    redirect('/dashboard')
  }

  const features = [
    'Access to 30+ detailed app case studies',
    'New case studies added weekly',
    'Deep dive into UX, growth, and monetization',
    'Learn from $100K+ revenue apps',
    'Steal proven tactics and strategies',
    'Filter by category, revenue, and more',
    'Mobile-friendly reading experience',
    'Lifetime updates and improvements',
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Choose Your Plan
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Unlock the entire playbook database and start learning today
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Lifetime Plan */}
          <div className="relative rounded-2xl border-2 border-blue-600 bg-white p-8 shadow-lg">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white">
              Best Value
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Lifetime Access</h2>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-5xl font-bold text-gray-900">$20</span>
                <span className="text-gray-500">one-time</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">Pay once, access forever</p>
            </div>

            <ul className="mb-8 space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="h-5 w-5 flex-shrink-0 text-blue-600" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <form action="/api/checkout" method="POST">
              <input type="hidden" name="priceType" value="lifetime" />
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-6 py-4 text-base font-semibold text-white hover:bg-blue-500 transition-colors"
              >
                Get Lifetime Access
              </button>
            </form>
          </div>

          {/* Monthly Plan */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Monthly</h2>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-5xl font-bold text-gray-900">$14</span>
                <span className="text-gray-500">per month</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">Cancel anytime</p>
            </div>

            <ul className="mb-8 space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="h-5 w-5 flex-shrink-0 text-gray-600" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <form action="/api/checkout" method="POST">
              <input type="hidden" name="priceType" value="monthly" />
              <button
                type="submit"
                className="w-full rounded-lg border-2 border-gray-300 px-6 py-4 text-base font-semibold text-gray-900 hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                Subscribe Monthly
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Secure payment powered by Stripe. Cancel your subscription anytime.
          </p>
          <Link href="/" className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-500">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
