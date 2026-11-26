import Image from 'next/image'
import React from 'react'

import { cardImageUrl, type HomeCard } from '@/features/home/content'
import type { Locale } from '@/i18n/routing'
import { ArrowIcon } from '@/shared/ui/icons'

export const cardHref = (locale: Locale, href: string) => `/${locale}${href}`

export const Badge = ({ children, large = false }: { children: React.ReactNode; large?: boolean }) => (
  <span
    className={`inline-flex items-center rounded-full font-headline text-label font-bold text-gold-700 ${
      large ? 'bg-gold-300 px-3.5 py-1 shadow-xs' : 'bg-gold-300/60 px-2.5 py-0.5'
    }`}
  >
    {children}
  </span>
)

type StandardCardProps = {
  card: HomeCard
  locale: Locale
  sizes: string
}

/** Shared archive card used by category and region pages. */
export const StandardCard = ({ card, locale, sizes }: StandardCardProps) => (
  <article className="group relative flex flex-col overflow-hidden rounded-card border border-line bg-surface shadow-xs transition-all duration-200 hover:border-gold-400">
    <div className="relative aspect-[3/2] overflow-hidden bg-green-100">
      <Image
        alt={card.alt}
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        fill
        sizes={sizes}
        src={cardImageUrl(card, 800)}
      />
    </div>

    <div className="flex flex-1 flex-col justify-between p-5">
      <div>
        <div className="mb-2">
          <Badge>{card.category}</Badge>
        </div>
        <h3 className="m-0 mb-2 line-clamp-3 font-headline text-card-title font-bold leading-snug text-ink-900 transition-colors group-hover:text-green-600">
          <a className="after:absolute after:inset-0" href={cardHref(locale, card.href)}>
            {card.title}
          </a>
        </h3>
        {card.excerpt ? (
          <p className="m-0 mb-4 line-clamp-2 text-body-ui leading-relaxed text-ink-700">
            {card.excerpt}
          </p>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line pt-3 text-meta text-ink-500">
        <span className="min-w-0">{card.meta}</span>
        {card.cta ? (
          <span className="inline-flex shrink-0 items-center gap-1 font-bold text-green-600">
            <span>{card.cta}</span>
            <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
          </span>
        ) : null}
      </div>
    </div>
  </article>
)
