'use client'

import React, { useEffect, useState } from 'react'

import { ListIcon } from '@/components/icons'
import type { ArticleHeading } from '@/utilities/article'

export type ArticleTocProps = {
  headings: ArticleHeading[]
  title: string
}

/**
 * Highlights the section the reader is currently in. The offset matches the
 * sticky header plus the breathing room above the first heading.
 */
export function ArticleToc({ headings, title }: ArticleTocProps) {
  const ids = headings.map((heading) => heading.id).join('|')
  const [activeId, setActiveId] = useState(headings[0]?.id ?? '')

  useEffect(() => {
    if (headings.length === 0) return

    const update = () => {
      let current = headings[0]?.id ?? ''

      for (const heading of headings) {
        const element = document.getElementById(heading.id)
        if (element && element.getBoundingClientRect().top <= 160) current = heading.id
      }

      setActiveId(current)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })

    return () => window.removeEventListener('scroll', update)
    // `ids` is the stable representation of the heading list; the effect only
    // needs to re-subscribe when a different set of sections is rendered.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids])

  if (headings.length === 0) return null

  return (
    <div className="rounded-card border border-line bg-surface p-5 shadow-xs">
      <div className="mb-3 flex items-center gap-2 border-b border-line pb-3">
        <ListIcon className="h-5 w-5 text-gold-500" />
        <h2 className="m-0 font-headline text-body-ui font-bold text-green-900">{title}</h2>
      </div>

      <nav aria-label={title} className="flex flex-col gap-2.5 text-meta font-semibold">
        {headings.map((heading) => {
          const active = heading.id === activeId

          return (
            <a
              aria-current={active ? 'location' : undefined}
              className={`border-s-2 pe-2 ps-2 transition-colors ${
                active
                  ? 'border-gold-500 font-bold text-gold-700'
                  : 'border-transparent text-ink-500 hover:text-green-900'
              } ${heading.level === 3 ? 'ps-5 text-[13px]' : ''}`}
              href={`#${heading.id}`}
              key={heading.id}
            >
              {heading.text}
            </a>
          )
        })}
      </nav>
    </div>
  )
}

export default ArticleToc
