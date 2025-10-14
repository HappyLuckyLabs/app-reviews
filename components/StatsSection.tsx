'use client'

import { useEffect, useRef, useState } from 'react'
import Counter from './Counter'

interface Stat {
  value: number
  suffix: string
  label: string
  places?: number[]
}

const stats: Stat[] = [
  { value: 12, suffix: '+', label: 'Case Studies', places: [10, 1] },
  { value: 10, suffix: 'M+', label: 'Combined Revenue', places: [10, 1] },
  { value: 50, suffix: 'M+', label: 'Total Downloads', places: [10, 1] },
  { value: 100, suffix: '%', label: 'Actionable Insights', places: [100, 10, 1] },
]

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [startCount, setStartCount] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Delay the counter start slightly for better effect
          setTimeout(() => setStartCount(true), 200)
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
              <div className="text-5xl sm:text-6xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                {stat.label === 'Combined Revenue' && <span>$</span>}
                <Counter
                  value={startCount ? stat.value : 0}
                  fontSize={56}
                  textColor="#111827"
                  fontWeight={900}
                />
                <span>{stat.suffix}</span>
              </div>
              <div className="text-base text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
