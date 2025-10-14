import Hero from '@/components/Hero'
import StatsSection from '@/components/StatsSection'
import CaseStudyCard from '@/components/CaseStudyCard'
import { getFreeCaseStudiesFromDB, getLockedCaseStudiesFromDB } from '@/lib/case-studies-db'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default async function Home() {
  const freeCaseStudies = await getFreeCaseStudiesFromDB()
  const lockedCaseStudies = await getLockedCaseStudiesFromDB()

  return (
    <div className="min-h-screen bg-white">
      <Hero />

      {/* Stats Section */}
      <StatsSection />

      {/* Free Case Studies Section */}
      <section id="case-studies" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-4">Free Case Studies</h2>
            <p className="text-xl text-gray-600">
              Get started with these detailed app analyses—completely free
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {freeCaseStudies.map((caseStudy) => (
              <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} />
            ))}
          </div>
        </div>
      </section>

      {/* Locked Case Studies Section */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-4">
                Unlock {lockedCaseStudies.length}+ More
              </h2>
              <p className="text-xl text-gray-600">
                Get instant access to the entire playbook database
              </p>
            </div>
            <Link
              href="/pricing"
              className="flex items-center gap-2 rounded-full bg-gray-900 px-8 py-4 text-base font-semibold text-white hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              Unlock All
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lockedCaseStudies.map((caseStudy) => (
              <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} isLocked />
            ))}
          </div>

          {/* CTA Banner */}
          <div className="mt-16 rounded-3xl bg-gray-900 px-8 sm:px-12 py-16 sm:py-20 text-center">
            <h3 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Ready to learn from the best?
            </h3>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get lifetime access for just $20, or subscribe monthly for $14
            </p>
            <Link
              href="/pricing"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-10 py-5 text-lg font-bold text-gray-900 hover:bg-gray-100 transition-colors"
            >
              View Pricing
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
            <p className="text-base font-semibold text-gray-500">
              © 2024 AppPlaybook. All rights reserved.
            </p>
            <div className="flex gap-8">
              <Link href="/about" className="text-base font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-base font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                Contact
              </Link>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-semibold text-gray-500 hover:text-gray-900 transition-colors"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
