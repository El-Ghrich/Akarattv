'use client'

import type { RefObject } from 'react'

import { ChevronDownIcon } from '@/shared/ui/icons'
import type { HomeLink } from '@/features/home/content'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'

import { closeOnNavigate, isCurrent, normalize, positionDropdown } from './siteNavUtils'

export type DesktopNavProps = {
  items: HomeLink[]
  label: string
  locale: Locale
  current: string
  navRef: RefObject<HTMLElement | null>
  onScroll: () => void
  onScrollNav: (direction: -1 | 1) => void
}

export function DesktopNav({
  items,
  label,
  locale,
  current,
  navRef,
  onScroll,
  onScrollNav,
}: DesktopNavProps) {
  return (
    <div className="hidden min-w-0 flex-1 items-center gap-1 lg:flex">
      <button
        aria-label={locale === 'ar' ? 'السابق' : 'Précédent'}
        className="inline-flex h-8 w-6 shrink-0 items-center justify-center rounded text-gold-400 transition-colors hover:bg-green-800 hover:text-gold-300"
        onClick={() => onScrollNav(-1)}
        type="button"
      >
        <ChevronDownIcon className={locale !== 'ar' ? "h-4 w-4 rotate-90" : "h-4 w-4 -rotate-90 "} />
      </button>

      <nav
        aria-label={label}
        className="site-nav flex min-w-0 flex-1 items-center gap-1 overflow-x-auto px-1"
        onScroll={onScroll}
        ref={navRef}
      >
        {items.map((item) => {
          const active = isCurrent(item, current)

          if (item.children?.length) {
            return (
              <details
                className="site-nav-group shrink-0"
                key={item.label}
                onToggle={(event) => {
                  if (event.currentTarget.open) positionDropdown(event.currentTarget)
                }}
              >
                <summary
                  className={`relative flex cursor-pointer list-none items-center gap-1.5 rounded px-3 py-2.5 font-headline text-[15px] font-bold leading-tight transition-colors [&::-webkit-details-marker]:hidden ${
                    active ? 'text-gold-300' : 'text-white/90 hover:text-gold-400'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronDownIcon className="site-nav-chevron h-3.5 w-3.5 transition-transform" />
                  {active ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-3 bottom-0 h-[3px] rounded-full bg-gold-500"
                    />
                  ) : null}
                </summary>

                <div className="site-nav-dropdown">
                  {item.children.map((child) => {
                    const childActive = normalize(child.href) === current

                    return (
                      <Link
                        aria-current={childActive ? 'true' : undefined}
                        className="site-nav-dropdown-link"
                        href={child.href}
                        key={child.href + child.label}
                        onClick={closeOnNavigate}
                      >
                        <span aria-hidden="true" className="site-nav-dropdown-dot" />
                        <span>{child.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </details>
            )
          }

          return (
            <Link
              aria-current={active ? 'true' : undefined}
              className={`relative shrink-0 whitespace-nowrap rounded px-3 py-2.5 font-headline text-[15px] font-bold leading-tight transition-colors ${
                active ? 'text-gold-300' : 'text-white/90 hover:text-gold-400'
              }`}
              href={item.href}
              key={item.href + item.label}
            >
              <span>{item.label}</span>
              {active ? (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-3 bottom-0 h-[3px] rounded-full bg-gold-500"
                />
              ) : null}
            </Link>
          )
        })}
      </nav>

      <button
        aria-label={locale === 'ar' ? 'التالي' : 'Suivant'}
        className="inline-flex h-8 w-6 shrink-0 items-center justify-center rounded text-gold-400 transition-colors hover:bg-green-800 hover:text-gold-300"
        onClick={() => onScrollNav(1)}
        type="button"
      >
        <ChevronDownIcon className={locale !== 'ar' ? "h-4 w-4 -rotate-90" : "h-4 w-4 rotate-90 "} />
      </button>
    </div>
  )
}
