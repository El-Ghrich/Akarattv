import React from 'react'

export type IconProps = {
  className?: string
}

const base = 'inline-block shrink-0'

const Svg = ({
  children,
  className,
}: IconProps & {
  children: React.ReactNode
}) => (
  <svg
    aria-hidden="true"
    className={`${base} ${className ?? ''}`}
    fill="none"
    focusable="false"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.8}
    viewBox="0 0 24 24"
  >
    {children}
  </svg>
)

export const CalendarIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <rect height="18" rx="2" width="18" x="3" y="4" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </Svg>
)

export const TrendUpIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="m3 17 6-6 4 4 8-8" />
    <path d="M15 7h6v6" />
  </Svg>
)

export const GlobeIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9s-1.2 6.5-3.6 9c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3Z" />
  </Svg>
)

export const SearchIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Svg>
)

export const MailCheckIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M21 12v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" />
    <path d="m3 7 9 6 5-3.3" />
    <path d="m16 7 2 2 4-4" />
  </Svg>
)

export const ShieldCheckIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
)

export const PlayIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <rect height="14" rx="3" width="20" x="2" y="5" />
    <path d="m10 9 5 3-5 3V9Z" />
  </Svg>
)

export const ArrowIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </Svg>
)

export const MenuIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
)
