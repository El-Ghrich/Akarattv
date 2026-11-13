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

export const HomeIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="m3 10 9-7 9 7" />
    <path d="M5 9v11h14V9" />
    <path d="M9 20v-6h6v6" />
  </Svg>
)

export const ShareIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4" />
  </Svg>
)

export const LinkIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1L10.7 5" />
    <path d="M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20.1l1.3-1.1" />
  </Svg>
)

export const ClockIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
)

export const RefreshIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" />
    <path d="M3 12A9 9 0 0 1 18.5 5.8L21 8" />
    <path d="M3 21v-5h5M21 3v5h-5" />
  </Svg>
)

export const ListIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M9 5h11M9 12h11M9 19h11" />
    <path d="M4 5h.01M4 12h.01M4 19h.01" />
  </Svg>
)

export const InfoIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </Svg>
)

export const ChatIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.7 8.7 0 0 1-3.8-.9L3 21l1.8-4.8a8.4 8.4 0 0 1-.8-3.7 8.4 8.4 0 0 1 8.5-8.4 8.4 8.4 0 0 1 8.5 8.4Z" />
  </Svg>
)

export const CopyCheckIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <rect height="13" rx="2" width="13" x="8" y="8" />
    <path d="M4 16V5a2 2 0 0 1 2-2h9" />
    <path d="m10.5 14 2 2 4-4" />
  </Svg>
)
