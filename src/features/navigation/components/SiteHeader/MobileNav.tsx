'use client'

import type { RefObject } from 'react'

import { ChevronDownIcon } from '@/shared/ui/icons'
import type { HomeLink } from '@/features/home/content'
import { Link } from '@/i18n/navigation'

import { closeOnNavigate, isCurrent, normalize } from './siteNavUtils'

export type MobileNavProps = {
  items: HomeLink[]
  label: string
  current: string
  navRef: RefObject<HTMLElement | null>
}

export function MobileNav({ items, label, current, navRef }: MobileNavProps) {
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
