'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { ScreenTag } from './CaseStudyLayout'

interface CaseStudyAnalysisProps {
  sectionId: string
  scrollToScreenshot: (index: number) => void
}

interface AccordionProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}

function Accordion({ title, defaultOpen = false, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {isOpen ? (
          <ChevronDown className="h-5 w-5 text-gray-600" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-600" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 bg-white space-y-3 text-gray-700">
          {children}
        </div>
      )}
    </div>
  )
}

export function CaseStudyAnalysis({ sectionId, scrollToScreenshot }: CaseStudyAnalysisProps) {
  const analysisContent: { [key: string]: React.ReactNode } = {
    overview: (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Overview</h2>
        <div className="space-y-4">
          <p className="text-gray-700">
            This section covers the app&apos;s positioning in the market, business model, and overall strategy.
            Check out the <ScreenTag index={0} onClick={() => scrollToScreenshot(0)} /> for the App Store header
            and <ScreenTag index={1} onClick={() => scrollToScreenshot(1)} /> for the first set of screenshots.
          </p>

          <div className="space-y-3 mt-6">
            <Accordion title="Market Positioning & Target Audience" defaultOpen={true}>
              <p>
                The app targets a specific demographic with clear pain points. The positioning is evident in
                <ScreenTag index={2} onClick={() => scrollToScreenshot(2)} /> where they showcase their unique value proposition.
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Clear target user persona defined</li>
                <li>Differentiation from competitors highlighted</li>
                <li>Value proposition communicated effectively</li>
              </ul>
            </Accordion>

            <Accordion title="Revenue Model & Pricing Strategy">
              <p>
                Detailed breakdown of how the app generates revenue. See <ScreenTag index={3} onClick={() => scrollToScreenshot(3)} />
                for pricing presentation.
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Freemium vs. Premium tiers clearly defined</li>
                <li>Pricing psychology techniques employed</li>
                <li>Conversion funnel optimized for monetization</li>
              </ul>
            </Accordion>

            <Accordion title="Competitive Advantages">
              <p>
                Key differentiators that set this app apart in the market, shown in <ScreenTag index={4} onClick={() => scrollToScreenshot(4)} />.
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Unique features not found in competitors</li>
                <li>Superior UX/UI design choices</li>
                <li>Better performance or functionality</li>
              </ul>
            </Accordion>
          </div>
        </div>
      </div>
    ),
    onboarding: (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Onboarding Experience</h2>
        <div className="space-y-4">
          <p className="text-gray-700">
            How the app introduces itself to new users and guides them through the initial setup.
            The <ScreenTag index={0} onClick={() => scrollToScreenshot(0)} /> sets the tone with a compelling welcome message.
          </p>

          <div className="space-y-3 mt-6">
            <Accordion title="Welcome & Value Proposition" defaultOpen={true}>
              <p>
                First impressions matter. The welcome screen in <ScreenTag index={0} onClick={() => scrollToScreenshot(0)} /> immediately
                communicates the core value and sets user expectations.
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Clear headline communicating main benefit</li>
                <li>Visual hierarchy guides user attention</li>
                <li>CTA is prominent and actionable</li>
              </ul>
            </Accordion>

            <Accordion title="Progressive Disclosure">
              <p>
                The app reveals features gradually across <ScreenTag index={1} onClick={() => scrollToScreenshot(1)} /> and
                <ScreenTag index={2} onClick={() => scrollToScreenshot(2)} />, preventing overwhelm.
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>One concept per screen approach</li>
                <li>Visual demonstrations of key features</li>
                <li>Skip option allows user control</li>
              </ul>
            </Accordion>

            <Accordion title="Permission Requests">
              <p>
                Strategic timing of permission requests shown in <ScreenTag index={4} onClick={() => scrollToScreenshot(4)} />
                maximizes approval rates.
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Requests made in context of use</li>
                <li>Clear explanation of why permission needed</li>
                <li>Graceful handling of denial</li>
              </ul>
            </Accordion>
          </div>
        </div>
      </div>
    ),
    home: (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Home & Navigation</h2>
        <div className="space-y-4">
          <p className="text-gray-700">
            The main interface where users spend most of their time. See the <ScreenTag index={0} onClick={() => scrollToScreenshot(0)} /> for the main home screen layout.
          </p>

          <div className="space-y-3 mt-6">
            <Accordion title="Information Architecture" defaultOpen={true}>
              <p>
                The home screen in <ScreenTag index={0} onClick={() => scrollToScreenshot(0)} /> demonstrates a well-organized
                content hierarchy that prioritizes key actions.
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Primary actions are immediately visible</li>
                <li>Content grouped logically by function</li>
                <li>White space used effectively for clarity</li>
              </ul>
            </Accordion>

            <Accordion title="Navigation Patterns">
              <p>
                Multiple navigation methods shown in <ScreenTag index={1} onClick={() => scrollToScreenshot(1)} /> and
                <ScreenTag index={2} onClick={() => scrollToScreenshot(2)} /> provide flexibility and discoverability.
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Tab bar for primary sections</li>
                <li>Hamburger menu for secondary features</li>
                <li>Consistent navigation across all screens</li>
              </ul>
            </Accordion>

            <Accordion title="Content Prioritization">
              <p>
                Smart prioritization visible in <ScreenTag index={4} onClick={() => scrollToScreenshot(4)} />
                ensures users see what matters most.
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Most important content above the fold</li>
                <li>Visual weight draws attention to key items</li>
                <li>Progressive loading for better performance</li>
              </ul>
            </Accordion>
          </div>
        </div>
      </div>
    ),
    features: (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Core Features</h2>
        <div className="space-y-4">
          <p className="text-gray-700">
            Deep dive into the app&apos;s main functionality and user workflows. Start with <ScreenTag index={0} onClick={() => scrollToScreenshot(0)} /> to see the feature overview.
          </p>

          <div className="space-y-3 mt-6">
            <Accordion title="User Flows & Interactions" defaultOpen={true}>
              <p>
                The core user flows shown in <ScreenTag index={1} onClick={() => scrollToScreenshot(1)} /> and
                <ScreenTag index={2} onClick={() => scrollToScreenshot(2)} /> are optimized for minimal friction.
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Intuitive step-by-step processes</li>
                <li>Clear feedback for every action</li>
                <li>Easy error recovery mechanisms</li>
              </ul>
            </Accordion>

            <Accordion title="Feature Discoverability">
              <p>
                Smart onboarding and UI patterns in <ScreenTag index={3} onClick={() => scrollToScreenshot(3)} />
                help users find advanced functionality.
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Tooltips and contextual hints</li>
                <li>Progressive feature introduction</li>
                <li>Empty states guide next actions</li>
              </ul>
            </Accordion>

            <Accordion title="Engagement Loops">
              <p>
                Retention mechanics demonstrated in <ScreenTag index={4} onClick={() => scrollToScreenshot(4)} /> and
                <ScreenTag index={5} onClick={() => scrollToScreenshot(5)} /> keep users coming back.
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Notifications timed strategically</li>
                <li>Reward systems and gamification</li>
                <li>Social proof and sharing features</li>
              </ul>
            </Accordion>
          </div>
        </div>
      </div>
    ),
    monetization: (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Monetization Strategy</h2>
        <div className="space-y-4">
          <p className="text-gray-700">
            How the app converts users into paying customers. The paywall design in <ScreenTag index={0} onClick={() => scrollToScreenshot(0)} /> is particularly well-executed.
          </p>

          <div className="space-y-3 mt-6">
            <Accordion title="Paywall Positioning & Timing" defaultOpen={true}>
              <p>
                Strategic paywall placement shown in <ScreenTag index={0} onClick={() => scrollToScreenshot(0)} /> and
                <ScreenTag index={3} onClick={() => scrollToScreenshot(3)} /> maximizes conversion without hurting experience.
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Appears after value demonstration</li>
                <li>Natural breaks in user flow</li>
                <li>Multiple touchpoints throughout journey</li>
              </ul>
            </Accordion>

            <Accordion title="Pricing Psychology">
              <p>
                The pricing presentation in <ScreenTag index={1} onClick={() => scrollToScreenshot(1)} /> and
                <ScreenTag index={2} onClick={() => scrollToScreenshot(2)} /> leverages proven psychological principles.
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Anchor pricing with highest tier first</li>
                <li>Value comparison between tiers</li>
                <li>Scarcity or urgency elements</li>
              </ul>
            </Accordion>

            <Accordion title="Value Demonstration">
              <p>
                Clear benefit communication in <ScreenTag index={4} onClick={() => scrollToScreenshot(4)} /> and
                <ScreenTag index={5} onClick={() => scrollToScreenshot(5)} /> justifies the price.
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Feature comparison charts</li>
                <li>Social proof and testimonials</li>
                <li>Money-back guarantee or trial period</li>
              </ul>
            </Accordion>
          </div>
        </div>
      </div>
    ),
  }

  return analysisContent[sectionId] || <div className="text-gray-500">No analysis available for this section.</div>
}
