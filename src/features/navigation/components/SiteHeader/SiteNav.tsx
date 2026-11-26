'use client'

import { useCallback, useEffect, useRef } from 'react'

import type { HomeLink } from '@/features/home/content'
import { usePathname } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'

import { DesktopNav } from './DesktopNav'
import { MobileNav } from './MobileNav'
import { isRtl, normalize } from './siteNavUtils'

type Variant = 'desktop' | 'mobile'

export type SiteNavProps = {
  items: HomeLink[]
  label: string
  locale: Locale
  variant?: Variant
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
    return <MobileNav current={current} items={items} label={label} navRef={navRef} />
  }

  return (
    <DesktopNav
      current={current}
      items={items}
      label={label}
      locale={locale}
      navRef={navRef}
      onScroll={closeGroups}
      onScrollNav={scrollNav}
    />
  )
}
