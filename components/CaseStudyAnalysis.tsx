'use client'

import { ScreenTag } from './CaseStudyLayout'

interface CaseStudyAnalysisProps {
  sectionId: string
  scrollToScreenshot: (index: number) => void
}

export function CaseStudyAnalysis({ sectionId, scrollToScreenshot }: CaseStudyAnalysisProps) {
  const analysisContent: { [key: string]: React.ReactNode } = {
    overview: (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Business Overview</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            This section covers the app&apos;s positioning in the market, business model, and overall strategy.
            Check out the <ScreenTag index={0} onClick={() => scrollToScreenshot(0)} /> for the App Store header
            and <ScreenTag index={1} onClick={() => scrollToScreenshot(1)} /> for the first set of screenshots.
          </p>
          <h3 className="text-xl font-semibold text-gray-900 mt-6">Key Insights</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Market positioning and target audience <ScreenTag index={2} onClick={() => scrollToScreenshot(2)} /></li>
            <li>Revenue model and pricing strategy <ScreenTag index={3} onClick={() => scrollToScreenshot(3)} /></li>
            <li>Competitive advantages <ScreenTag index={4} onClick={() => scrollToScreenshot(4)} /></li>
          </ul>
        </div>
      </div>
    ),
    onboarding: (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Onboarding Experience</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            How the app introduces itself to new users and guides them through the initial setup.
            The <ScreenTag index={0} onClick={() => scrollToScreenshot(0)} /> sets the tone with a compelling welcome message.
          </p>
          <h3 className="text-xl font-semibold text-gray-900 mt-6">UX Breakdown</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Progressive disclosure of features <ScreenTag index={1} onClick={() => scrollToScreenshot(1)} /> <ScreenTag index={2} onClick={() => scrollToScreenshot(2)} /></li>
            <li>Permission requests and timing <ScreenTag index={4} onClick={() => scrollToScreenshot(4)} /></li>
            <li>Value proposition communication <ScreenTag index={1} onClick={() => scrollToScreenshot(1)} /></li>
          </ul>
        </div>
      </div>
    ),
    home: (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Home & Navigation</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            The main interface where users spend most of their time. See the <ScreenTag index={0} onClick={() => scrollToScreenshot(0)} /> for the main home screen layout.
          </p>
          <h3 className="text-xl font-semibold text-gray-900 mt-6">Design Patterns</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Information architecture <ScreenTag index={0} onClick={() => scrollToScreenshot(0)} /></li>
            <li>Navigation patterns <ScreenTag index={1} onClick={() => scrollToScreenshot(1)} /> <ScreenTag index={2} onClick={() => scrollToScreenshot(2)} /></li>
            <li>Content prioritization <ScreenTag index={4} onClick={() => scrollToScreenshot(4)} /></li>
          </ul>
        </div>
      </div>
    ),
    features: (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Core Features</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            Deep dive into the app&apos;s main functionality and user workflows. Start with <ScreenTag index={0} onClick={() => scrollToScreenshot(0)} /> to see the feature overview.
          </p>
          <h3 className="text-xl font-semibold text-gray-900 mt-6">Feature Analysis</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>User flows and interactions <ScreenTag index={1} onClick={() => scrollToScreenshot(1)} /> <ScreenTag index={2} onClick={() => scrollToScreenshot(2)} /></li>
            <li>Feature discoverability <ScreenTag index={3} onClick={() => scrollToScreenshot(3)} /></li>
            <li>Engagement loops <ScreenTag index={4} onClick={() => scrollToScreenshot(4)} /> <ScreenTag index={5} onClick={() => scrollToScreenshot(5)} /></li>
          </ul>
        </div>
      </div>
    ),
    monetization: (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Monetization Strategy</h2>
        <div className="space-y-4 text-gray-700">
          <p>
            How the app converts users into paying customers. The paywall design in <ScreenTag index={0} onClick={() => scrollToScreenshot(0)} /> is particularly well-executed.
          </p>
          <h3 className="text-xl font-semibold text-gray-900 mt-6">Conversion Tactics</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Paywall positioning and timing <ScreenTag index={0} onClick={() => scrollToScreenshot(0)} /> <ScreenTag index={3} onClick={() => scrollToScreenshot(3)} /></li>
            <li>Pricing psychology <ScreenTag index={1} onClick={() => scrollToScreenshot(1)} /> <ScreenTag index={2} onClick={() => scrollToScreenshot(2)} /></li>
            <li>Value demonstration <ScreenTag index={4} onClick={() => scrollToScreenshot(4)} /> <ScreenTag index={5} onClick={() => scrollToScreenshot(5)} /></li>
          </ul>
        </div>
      </div>
    ),
  }

  return analysisContent[sectionId] || <div className="text-gray-500">No analysis available for this section.</div>
}
