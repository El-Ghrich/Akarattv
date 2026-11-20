'use client'

import React, { useEffect, useRef } from 'react'

import { ChevronDownIcon } from '@/components/icons'
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

const isCurrent = (item: HomeLink, current: string): boolean =>
  normalize(item.href) === current ||
  (item.children?.some((child) => normalize(child.href) === current) ?? false)

/**
 * Category navigation. Every item is a real archive route, so the active item
 * is simply the current pathname. Grouped entries (the three housing archives)
 * open a dropdown instead of navigating, but each child still has its own URL.
 */
export function SiteNav({ items, label, variant = 'desktop' }: SiteNavProps) {
  const pathname = usePathname()
  const current = normalize(pathname)
  const navRef = useRef<HTMLElement>(null)

  // Native <details> handles click and keyboard toggling; this only closes a
  // leftover group when the user taps elsewhere or presses Escape.
  useEffect(() => {
    const closeGroups = () => {
      navRef.current?.querySelectorAll<HTMLDetailsElement>('details[open]').forEach((group) => {
        group.open = false
      })
    }
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) closeGroups()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeGroups()
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  /** Close the group (and, on mobile, the hamburger) after navigating. */
  const closeOnNavigate = (event: React.MouseEvent<HTMLAnchorElement>) => {
    let element: HTMLElement | null = event.currentTarget

    while (element) {
      if (element instanceof HTMLDetailsElement) element.open = false
      element = element.parentElement
    }
  }

  if (variant === 'mobile') {
    return (
      <nav aria-label={label} className="flex flex-col" ref={navRef}>
        {items.map((item) => {
          const active = isCurrent(item, current)

          if (item.children?.length) {
            return (
              <details className="site-nav-group" key={item.label}>
                <summary
                  className={`flex cursor-pointer list-none items-center justify-between gap-3 rounded px-3 py-2.5 font-headline text-body-ui font-bold transition-colors [&::-webkit-details-marker]:hidden ${
                    active
                      ? 'bg-green-800 text-gold-300'
                      : 'text-white/90 hover:bg-green-800 hover:text-gold-300'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronDownIcon className="site-nav-chevron h-4 w-4 transition-transform" />
                </summary>

                <div className="site-nav-sublist">
                  {item.children.map((child) => {
                    const childActive = normalize(child.href) === current

                    return (
                      <Link
                        aria-current={childActive ? 'true' : undefined}
                        className={`rounded px-3 py-2 font-headline text-body-ui font-bold transition-colors ${
                          childActive
                            ? 'bg-green-800 text-gold-300'
                            : 'text-white/80 hover:bg-green-800 hover:text-gold-300'
                        }`}
                        href={child.href}
                        key={child.href + child.label}
                        onClick={closeOnNavigate}
                      >
                        {child.label}
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
              className={`rounded px-3 py-2.5 font-headline text-body-ui font-bold transition-colors ${
                active
                  ? 'bg-green-800 text-gold-300'
                  : 'text-white/90 hover:bg-green-800 hover:text-gold-300'
              }`}
              href={item.href}
              key={item.href + item.label}
              onClick={closeOnNavigate}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    )
  }

  return (
    <nav
      aria-label={label}
      className="site-nav hidden min-w-0 flex-1 items-center gap-1 lg:flex"
      ref={navRef}
    >
      {items.map((item) => {
        const active = isCurrent(item, current)

        if (item.children?.length) {
          return (
            <details className="site-nav-group relative shrink-0" key={item.label}>
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
  )
}
