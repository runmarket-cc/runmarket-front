import Link from 'next/link'
import { cn } from '@/lib/utils'

// RoutePin SVG — running route path resolving into a GPS location pin (Mark A from brand.jsx)
// Colors: route/pin = #FF8A00 (brand orange), dot = white
// Viewbox: 0 0 120 120

interface RoutePinIconProps {
  size?: number
  route?: string
  pin?: string
  dot?: string
  dash?: boolean
  className?: string
}

export function RoutePinIcon({
  size = 32,
  route = '#FF8A00',
  pin = '#FF8A00',
  dot = '#fff',
  dash = true,
  className,
}: RoutePinIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {dash && (
        <g stroke={route} strokeWidth="11" strokeLinecap="round" opacity="0.45">
          <line x1="13" y1="100" x2="27" y2="100" />
          <line x1="20" y1="84" x2="31" y2="84" />
        </g>
      )}
      <path
        d="M26 98 C 44 86, 56 76, 86 60"
        stroke={route}
        strokeWidth="13"
        strokeLinecap="round"
      />
      <path
        d="M86 60 C 77 47 64 43 64 30 C 64 18 74 9 86 9 C 98 9 108 18 108 30 C 108 43 95 47 86 60 Z"
        fill={pin}
      />
      <circle cx="86" cy="29" r="9.5" fill={dot} />
    </svg>
  )
}

interface RunmarketLogoProps {
  /** 'on-dark': white market text / 'on-light': ink market text */
  variant?: 'on-dark' | 'on-light'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showDash?: boolean
}

const sizes = {
  sm: { icon: 24, text: '18px' },
  md: { icon: 30, text: '22px' },
  lg: { icon: 40, text: '30px' },
}

export function RunmarketLogo({
  variant = 'on-dark',
  size = 'md',
  className,
  showDash = true,
}: RunmarketLogoProps) {
  const { icon: iconSize, text: fontSize } = sizes[size]
  const marketColor = variant === 'on-dark' ? '#ffffff' : '#131A22'

  return (
    <Link href="/" className={cn('flex items-center gap-2 shrink-0', className)}>
      <RoutePinIcon size={iconSize} dash={showDash} />
      {/* Wordmark: "런" in orange · "마켓" in white or ink */}
      <span
        style={{
          fontWeight: 800,
          fontSize,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ color: '#FF8A00' }}>런</span>
        <span style={{ color: marketColor }}>마켓</span>
      </span>
    </Link>
  )
}
