'use client'

import React from 'react'

import type { HomeLink } from '@/content/home'
import { Link, usePathname } from '@/i18n/navigation'

type Variant = 'desktop' | 'mobile'

export type SiteNavProps = {
  items: HomeLink[]
  label: string
  variant?: Variant
}

/** Slugs are percent-encoded in hrefs but next-intl may return a decoded path. */
const normalize = (value: string): string => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

/**
 * Category navigation. Every item is a real archive route, so the active item
 * is simply the current pathname. There is no hash/scroll behaviour here.
 */
export function SiteNav({ items, label, variant = 'desktop' }: SiteNavProps) {
  const pathname = usePathname()
  const current = normalize(pathname)

  if (variant === 'mobile') {
    return (
      <nav aria-label={label} className="flex flex-col">
        {items.map((item) => {
          const isActive = current === normalize(item.href)

          return (
            <Link
              aria-current={isActive ? 'true' : undefined}
              className={`rounded px-3 py-2.5 font-headline text-body-ui font-bold transition-colors ${
                isActive
                  ? 'bg-green-800 text-gold-300'
                  : 'text-white/90 hover:bg-green-800 hover:text-gold-300'
              }`}
              href={item.href}
              key={item.href + item.label}
              onClick={(event) => event.currentTarget.closest('details')?.removeAttribute('open')}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    )
  }

  return (
    <nav aria-label={label} className="hidden items-center gap-1 lg:flex">
      {items.map((item) => {
        const isActive = current === normalize(item.href)

        return (
          <Link
            aria-current={isActive ? 'true' : undefined}
            className={`relative px-3 py-2 font-headline text-body-ui font-bold transition-colors ${
              isActive ? 'text-gold-300' : 'text-white/90 hover:text-gold-400'
            }`}
            href={item.href}
            key={item.href + item.label}
          >
            <span>{item.label}</span>
            {isActive ? (
              <span
                aria-hidden="true"
                className="absolute inset-x-3 bottom-0 h-[3px] rounded-full bg-gold-500"
              />
            ) : null}
          </Link>
        )
      })}
    </nav>
  )
}
