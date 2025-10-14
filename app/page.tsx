import Hero from '@/components/Hero'
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
      <section className="py-16 bg-gray-50 border-y border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div>
              <div className="text-4xl font-bold text-gray-900">12+</div>
              <div className="mt-2 text-sm text-gray-600">Case Studies</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900">$10M+</div>
              <div className="mt-2 text-sm text-gray-600">Combined Revenue</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900">50M+</div>
              <div className="mt-2 text-sm text-gray-600">Total Downloads</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900">100%</div>
              <div className="mt-2 text-sm text-gray-600">Actionable Insights</div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Case Studies Section */}
      <section id="case-studies" className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Free Case Studies</h2>
            <p className="mt-2 text-lg text-gray-600">
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
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Unlock {lockedCaseStudies.length}+ More Case Studies
              </h2>
              <p className="mt-2 text-lg text-gray-600">
                Get instant access to the entire playbook database
              </p>
            </div>
            <Link
              href="/pricing"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white hover:bg-blue-500 transition-colors"
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
          <div className="mt-12 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-center">
            <h3 className="text-2xl font-bold text-white sm:text-3xl">
              Ready to learn from the best?
            </h3>
            <p className="mt-4 text-lg text-blue-100">
              Get lifetime access for just $20, or subscribe monthly for $14
            </p>
            <Link
              href="/pricing"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold text-blue-600 hover:bg-gray-100 transition-colors"
            >
              View Pricing
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="text-sm text-gray-500">
              © 2024 AppPlaybook. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/about" className="text-sm text-gray-500 hover:text-gray-900">
                About
              </Link>
              <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-900">
                Contact
              </Link>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-gray-900"
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
