'use client'

import { motion, useSpring, useTransform } from 'motion/react'
import { useEffect } from 'react'

export default function Counter({
  value,
  fontSize = 60,
  textColor = '#111827',
  fontWeight = 900,
}: {
  value: number
  fontSize?: number
  textColor?: string
  fontWeight?: number
}) {
  const spring = useSpring(0, {
    stiffness: 100,
    damping: 30,
  })

  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  )

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return (
    <motion.span
      style={{
        fontSize,
        color: textColor,
        fontWeight,
        display: 'inline-block',
      }}
    >
      {display}
    </motion.span>
  )
}
