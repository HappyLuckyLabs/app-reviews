'use client'

import { useEffect, useRef, useState } from 'react'

interface Stat {
  value: string
  label: string
}

const stats: Stat[] = [
  { value: '12+', label: 'Case Studies' },
  { value: '$10M+', label: 'Combined Revenue' },
  { value: '50M+', label: 'Total Downloads' },
  { value: '100%', label: 'Actionable Insights' },
]

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 bg-gray-50 border-y border-gray-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-12 gap-y-16 sm:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`transition-all duration-700 ease-out ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="text-5xl sm:text-6xl font-bold text-gray-900 mb-3">
                {stat.value}
              </div>
              <div className="text-base text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
