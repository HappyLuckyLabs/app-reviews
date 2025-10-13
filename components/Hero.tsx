import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            The playbook database for successful apps
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Learn exactly how indie founders built $100K+ apps. Growth tactics, UX insights, monetization strategies—all in one place.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="#case-studies"
              className="rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
            >
              Browse Case Studies
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg border-2 border-gray-300 px-6 py-3 text-base font-semibold text-gray-900 hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              Get Full Access
            </Link>
          </div>
          <p className="mt-8 text-sm text-gray-500">
            Join 500+ founders learning from successful apps
          </p>
        </div>
      </div>
    </section>
  )
}
