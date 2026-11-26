import type { MouseEvent } from 'react'

import type { HomeLink } from '@/features/home/content'

/** Slugs are percent-encoded in hrefs but next-intl may return a decoded path. */
export const normalize = (value: string): string => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export const isCurrent = (item: HomeLink, current: string): boolean =>
  normalize(item.href) === current ||
  (item.children?.some((child) => normalize(child.href) === current) ?? false)

export const isRtl = (): boolean => document.documentElement.dir === 'rtl'

/**
 * The nav scrolls horizontally, and an ancestor with `overflow` would clip an
 * absolutely positioned panel. The dropdown is fixed to the viewport instead,
 * so its coordinates have to be measured from the trigger when it opens.
 */
export const positionDropdown = (details: HTMLDetailsElement) => {
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

/** Close any group containing the clicked link before navigation. */
export const closeOnNavigate = (event: MouseEvent<HTMLAnchorElement>) => {
  let element: HTMLElement | null = event.currentTarget

  while (element) {
    if (element instanceof HTMLDetailsElement) element.open = false
    element = element.parentElement
  }
}
