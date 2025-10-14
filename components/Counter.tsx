'use client'

import { motion, useSpring, useTransform } from 'motion/react'
import { useEffect } from 'react'

function Number({ mv, number, height }: { mv: any; number: number; height: number }) {
  let y = useTransform(mv, (latest: number) => {
    let placeValue = latest % 10
    let offset = (10 + number - placeValue) % 10
    let memo = offset * height
    if (offset > 5) {
      memo -= 10 * height
    }
    return memo
  })
  return (
    <motion.span
      className="absolute inset-0 flex items-center justify-center"
      style={{ y }}
    >
      {number}
    </motion.span>
  )
}

function Digit({ place, value, height, digitStyle }: { place: number; value: number; height: number; digitStyle?: React.CSSProperties }) {
  let valueRoundedToPlace = Math.floor(value / place)
  let animatedValue = useSpring(valueRoundedToPlace)
  useEffect(() => {
    animatedValue.set(valueRoundedToPlace)
  }, [animatedValue, valueRoundedToPlace])
  return (
    <div className="relative overflow-hidden" style={{ height, ...digitStyle }}>
      {Array.from({ length: 10 }, (_, i) => (
        <Number key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </div>
  )
}

export default function Counter({
  value,
  fontSize = 100,
  padding = 0,
  places = [100, 10, 1],
  gap = 8,
  textColor = 'black',
  fontWeight = 900,
  containerStyle,
  counterStyle,
  digitStyle,
}: {
  value: number
  fontSize?: number
  padding?: number
  places?: number[]
  gap?: number
  textColor?: string
  fontWeight?: number
  containerStyle?: React.CSSProperties
  counterStyle?: React.CSSProperties
  digitStyle?: React.CSSProperties
}) {
  const height = fontSize + padding
  const defaultCounterStyle = {
    fontSize,
    gap: gap,
    color: textColor,
    fontWeight: fontWeight,
  }
  return (
    <div className="relative inline-block" style={containerStyle}>
      <div className="flex items-center" style={{ ...defaultCounterStyle, ...counterStyle }}>
        {places.map(place => (
          <Digit key={place} place={place} value={value} height={height} digitStyle={digitStyle} />
        ))}
      </div>
    </div>
  )
}
