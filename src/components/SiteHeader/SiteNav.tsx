'use client'

import React, { useCallback, useEffect, useRef } from 'react'

import { ChevronDownIcon } from '@/components/icons'
import type { HomeLink } from '@/content/home'
import { Link, usePathname } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'

type Variant = 'desktop' | 'mobile'

export type SiteNavProps = {
  items: HomeLink[]
  label: string
  locale: Locale
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

const isRtl = (): boolean => document.documentElement.dir === 'rtl'

/**
 * The nav scrolls horizontally, and an ancestor with `overflow` would clip an
 * absolutely positioned panel. The dropdown is fixed to the viewport instead,
 * so its coordinates have to be measured from the trigger when it opens.
 */
const positionDropdown = (details: HTMLDetailsElement) => {
  const panel = details.querySelector<HTMLElement>('.site-nav-dropdown')
  const trigger = details.querySelector<HTMLElement>('summary')
  if (!panel || !trigger) return

  const rect = trigger.getBoundingClientRect()
  const gutter = 16
  const panelWidth = panel.offsetWidth
  const panelHeight = panel.offsetHeight

  panel.style.top = `${rect.bottom + 12}px`
  panel.style.bottom = 'auto'

  if (isRtl()) {
    const right = Math.max(
      gutter,
      Math.min(window.innerWidth - rect.right, window.innerWidth - panelWidth - gutter),
    )
    panel.style.right = `${right}px`
    panel.style.left = 'auto'
  } else {
    const left = Math.max(
      gutter,
      Math.min(rect.left, window.innerWidth - panelWidth - gutter),
    )
    panel.style.left = `${left}px`
    panel.style.right = 'auto'
  }

  if (rect.bottom + 12 + panelHeight > window.innerHeight - gutter) {
    panel.style.top = 'auto'
    panel.style.bottom = `${window.innerHeight - rect.top + 12}px`
  }
}

/**
 * Category navigation. Every item is a real archive route, so the active item
 * is simply the current pathname. Grouped entries (the three housing archives)
 * open a dropdown instead of navigating, but each child still has its own URL.
 */
export function SiteNav({ items, label, locale, variant = 'desktop' }: SiteNavProps) {
  const pathname = usePathname()
  const current = normalize(pathname)
  const navRef = useRef<HTMLElement>(null)

  const closeGroups = useCallback(() => {
    navRef.current?.querySelectorAll<HTMLDetailsElement>('details[open]').forEach((group) => {
      group.open = false
    })
  }, [])

  // Native <details> handles click and keyboard toggling; this only closes a
  // leftover group when the user taps elsewhere, scrolls or resizes.
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) closeGroups()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeGroups()
    }
    const onViewportChange = () => closeGroups()

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onViewportChange)
    window.addEventListener('scroll', onViewportChange, true)

    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onViewportChange)
      window.removeEventListener('scroll', onViewportChange, true)
    }
  }, [closeGroups])

  const closeOnNavigate = (event: React.MouseEvent<HTMLAnchorElement>) => {
    let element: HTMLElement | null = event.currentTarget

    while (element) {
      if (element instanceof HTMLDetailsElement) element.open = false
      element = element.parentElement
    }
  }

  const scrollNav = (direction: -1 | 1) => {
    const nav = navRef.current
    if (!nav) return

    const step = Math.max(180, nav.clientWidth * 0.7)
    nav.scrollBy({
      behavior: 'smooth',
      left: step * direction * (isRtl() ? -1 : 1),
    })
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
    <div className="hidden min-w-0 flex-1 items-center gap-1 lg:flex">
      <button
        aria-label={locale === 'ar' ? 'السابق' : 'Précédent'}
        className="inline-flex h-8 w-6 shrink-0 items-center justify-center rounded text-gold-400 transition-colors hover:bg-green-800 hover:text-gold-300"
        onClick={() => scrollNav(-1)}
        type="button"
      >
        <ChevronDownIcon className="h-4 w-4 rotate-90" />
      </button>

      <nav
        aria-label={label}
        className="site-nav flex min-w-0 flex-1 items-center gap-1 overflow-x-auto px-1"
        onScroll={closeGroups}
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
        onClick={() => scrollNav(1)}
        type="button"
      >
        <ChevronDownIcon className="h-4 w-4 -rotate-90" />
      </button>
    </div>
  )
}
