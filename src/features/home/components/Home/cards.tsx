import Image from 'next/image'

import { cardImageUrl, type HomeCard, type HomeSection } from '@/features/home/content'
import type { Locale } from '@/i18n/routing'
import { Badge, cardHref } from '@/shared/ui/contentCards'
import { ArrowIcon } from '@/shared/ui/icons'

type SectionHeaderProps = {
  id: string
  locale: Locale
  title: string
  viewAll: HomeSection['viewAll']
}

const SectionHeader = ({ id, locale, title, viewAll }: SectionHeaderProps) => (
  <div className="mb-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line pb-3">
    <div>
      <h2 className="m-0 font-headline text-h2 font-bold text-green-900" id={id}>
        {title}
      </h2>
      <div className="mt-1 h-[3px] w-12 rounded-full bg-gold-500" />
    </div>
    <a
      className="group inline-flex shrink-0 items-center gap-1.5 font-headline text-body-ui font-bold text-green-600 transition-colors hover:text-green-700"
      href={cardHref(locale, viewAll.href)}
    >
      <span>{viewAll.label}</span>
      <ArrowIcon className="h-[19px] w-[19px] transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
    </a>
  </div>
)

type CompactCardProps = {
  card: HomeCard
  locale: Locale
}

export const CompactCard = ({ card, locale }: CompactCardProps) => (
  <article className="group relative flex gap-3.5 rounded-card border border-line bg-surface p-3.5 shadow-xs transition-all hover:border-gold-400">
    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-card bg-green-100">
      <Image
        alt={card.alt}
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        fill
        sizes="96px"
        src={cardImageUrl(card, 400)}
      />
    </div>

    <div className="flex min-w-0 flex-1 flex-col justify-between">
      <div>
        <span className="mb-1 block font-headline text-label font-bold text-gold-700">
          {card.category}
        </span>
        <h3 className="m-0 line-clamp-2 font-headline text-body-ui font-bold leading-snug text-ink-900 transition-colors group-hover:text-green-600">
          <a className="after:absolute after:inset-0" href={cardHref(locale, card.href)}>
            {card.title}
          </a>
        </h3>
      </div>
      <span className="mt-2 text-meta text-ink-500">{card.meta}</span>
    </div>
  </article>
)

type FeaturedStoryProps = {
  card: HomeCard
  label: string
  locale: Locale
}

/**
 * Section lead: image first, then the headline and its metadata underneath.
 * The image height is capped so the block keeps its presence without taking
 * over the screen.
 */
const FeaturedStory = ({ card, label, locale }: FeaturedStoryProps) => (
  <article className="group relative flex flex-col overflow-hidden rounded-card border border-line bg-surface shadow-xs transition-all duration-200 hover:border-gold-400">
    <div className="relative h-[220px] overflow-hidden bg-green-100 sm:h-[260px] lg:h-[280px]">
      <Image
        alt={card.alt}
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        fill
        sizes="(min-width: 1024px) 56vw, 100vw"
        src={cardImageUrl(card, 1200)}
      />
    </div>

    <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
      <div>
        <Badge>{label}</Badge>
      </div>

      <h3 className="m-0 line-clamp-3 font-headline text-h3 font-bold leading-snug text-ink-900 transition-colors group-hover:text-green-600">
        <a className="after:absolute after:inset-0" href={cardHref(locale, card.href)}>
          {card.title}
        </a>
      </h3>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3 text-meta text-ink-500">
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

export const CategorySection = ({ locale, section }: { locale: Locale; section: HomeSection }) => {
  const hasCompact = section.compact.length > 0
  const featuredLabel = locale === 'ar' ? 'خبر رئيسي' : 'À la une'

  return (
    <section aria-labelledby={`${section.id}-title`} className="pt-2" id={section.id}>
      <SectionHeader
        id={`${section.id}-title`}
        locale={locale}
        title={section.title}
        viewAll={section.viewAll}
      />

      <div
        className={`grid grid-cols-1 items-start gap-6 ${
          hasCompact ? 'lg:grid-cols-12' : ''
        }`}
      >
        <div className={hasCompact ? 'lg:col-span-7' : undefined}>
          <FeaturedStory card={section.featured} label={featuredLabel} locale={locale} />
        </div>

        {hasCompact ? (
          <div className="flex flex-col gap-4 lg:col-span-5">
            {section.compact.map((card) => (
              <CompactCard card={card} key={card.href} locale={locale} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
