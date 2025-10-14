import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative rounded-3xl bg-white px-8 py-16 shadow-sm sm:px-16 sm:py-20">
          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-6">
              <div className="inline-block rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                Learn from the best
              </div>

              <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                Find what
                <br />
                works
              </h1>

              <p className="text-lg text-gray-600 max-w-lg">
                Deep-dive into the UX patterns, growth tactics, and monetization strategies behind successful apps
              </p>

              <div className="flex items-center gap-4 pt-4">
                <Link
                  href="#case-studies"
                  className="rounded-full bg-black px-8 py-3.5 text-base font-semibold text-white hover:bg-gray-800 transition-colors shadow-sm"
                >
                  Explore Case Studies
                </Link>
                <Link
                  href="/pricing"
                  className="text-base font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                >
                  View pricing →
                </Link>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-8 shadow-lg">
                {/* Placeholder for hero image - replace with actual image */}
                <div className="aspect-[4/3] flex items-center justify-center">
                  <Image
                    src="/hero-image.png"
                    alt="App interface showcase"
                    width={600}
                    height={450}
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-200 rounded-full opacity-50 blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-200 rounded-full opacity-50 blur-2xl"></div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              <div>
                <div className="text-3xl font-bold text-gray-900">12+</div>
                <div className="mt-1 text-sm text-gray-600">Case Studies</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">$10M+</div>
                <div className="mt-1 text-sm text-gray-600">Combined Revenue</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">50M+</div>
                <div className="mt-1 text-sm text-gray-600">Total Downloads</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">100%</div>
                <div className="mt-1 text-sm text-gray-600">Actionable Insights</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
