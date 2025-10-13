import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
        </div>

        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          Payment Successful!
        </h1>

        <p className="mb-8 text-lg text-gray-600">
          Welcome to AppPlaybook! You now have full access to all case studies.
        </p>

        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500 transition-colors"
          >
            View All Case Studies
          </Link>

          <Link
            href="/"
            className="block text-sm text-gray-600 hover:text-gray-900"
          >
            Back to homepage
          </Link>
        </div>

        <div className="mt-12 rounded-lg bg-blue-50 p-6 text-left">
          <h3 className="mb-2 font-semibold text-gray-900">What&apos;s next?</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Browse 30+ detailed app case studies</li>
            <li>• Learn from successful indie founders</li>
            <li>• Discover growth tactics and strategies</li>
            <li>• New case studies added weekly</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
