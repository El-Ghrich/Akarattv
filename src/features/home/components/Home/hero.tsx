import Image from 'next/image'

import { CalendarIcon, ShieldCheckIcon, TrendUpIcon } from '@/shared/ui/icons'
import { cardImageUrl, type HomeContent, unsplashUrl } from '@/features/home/content'
import type { Locale } from '@/i18n/routing'

import { Badge, cardHref } from '@/shared/ui/contentCards'

import { CompactCard } from './cards'

export const BrandHero = ({ content, locale }: { content: HomeContent; locale: Locale }) => (
  <section
    aria-label={content.hero.titleAccent}
    className="relative overflow-hidden rounded-card border border-gold-500/30 bg-green-950 shadow-md"
  >
    <div className="relative flex min-h-[380px] items-center justify-center lg:min-h-[420px]">
      <Image
        alt={content.hero.alt}
        className="object-cover object-center"
        // LCP candidate: preload in <head>, high fetch priority, never lazy.
        // `preload` is the Next 16 replacement for the deprecated `priority`.
        fetchPriority="high"
        fill
        preload
        sizes="(max-width: 640px) calc(100vw - 32px), (min-width: 1328px) 1280px, calc(100vw - 48px)"
        src={unsplashUrl(content.hero.imageId, 1600)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-green-950/95 via-green-950/85 to-green-950/70" />
      <div className="pattern-architectural absolute inset-0 opacity-30" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6 p-8 text-center text-white sm:p-12 lg:p-14">
        <h1 className="m-0 text-balance font-headline text-h1 font-extrabold leading-[1.3] sm:text-display">
          <span className="text-gold-400">{content.hero.titleAccent}</span>{' '}
          {content.hero.titleAfter}
        </h1>

        <p className="m-0 max-w-2xl text-pretty text-body-article leading-relaxed text-ink-300">
          {content.hero.description}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <div className="flex flex-col items-center gap-2 rounded-card border border-green-800 bg-green-900/70 px-5 py-2.5 text-meta text-ink-300 sm:flex-row sm:gap-5">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="h-[18px] w-[18px] text-gold-400" />
              <span>{content.hero.badges[0]}</span>
            </div>
            <span aria-hidden="true" className="hidden text-green-800 sm:inline">
              |
            </span>
            <div className="flex items-center gap-2">
              <TrendUpIcon className="h-[18px] w-[18px] text-gold-400" />
              <span>{content.hero.badges[1]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)

export const HeroZone = ({ content, locale }: { content: HomeContent; locale: Locale }) => {
  const featured = content.heroZone.featured
  const sidebar = content.heroZone.sidebar

  return (
    <section
      aria-label={content.header.nav[0]?.label}
      className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12"
    >
      <article className="group relative flex min-h-[460px] flex-col justify-end overflow-hidden rounded-card border border-line bg-green-950 lg:col-span-8">
        <Image
          alt={featured.alt}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          // This card is partly visible on the first screen. Load it eagerly
          // with high priority, but don't preload a second LCP competitor.
          fetchPriority="high"
          fill
          loading="eager"
          sizes="(max-width: 640px) calc(100vw - 32px), (min-width: 1024px) 66vw, calc(100vw - 48px)"
          src={cardImageUrl(featured, 1200)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-green-950 via-green-950/75 to-transparent" />

        <div className="relative z-10 flex flex-col gap-3 p-6 sm:p-10">
          <div>
            <Badge large>{featured.category}</Badge>
          </div>

          <h2 className="m-0 line-clamp-2 font-headline text-h1 font-extrabold leading-tight text-white transition-colors group-hover:text-gold-300 sm:text-display">
            <a className="after:absolute after:inset-0" href={cardHref(locale, featured.href)}>
              {featured.title}
            </a>
          </h2>

          {featured.excerpt ? (
            <p className="m-0 line-clamp-2 max-w-3xl text-body-ui leading-relaxed text-ink-300">
              {featured.excerpt}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 border-t border-white/15 pt-2 font-headline text-meta font-semibold text-ink-300 sm:gap-5">
            <span className="flex items-center gap-1.5 text-gold-300">
              <CalendarIcon className="h-4 w-4" />
              <span>{featured.meta}</span>
            </span>
          </div>
        </div>
      </article>

      <aside
        aria-label={sidebar.title}
        className="flex flex-col justify-between gap-4 lg:col-span-4"
      >
        <div className="flex items-center justify-between gap-3 border-b-2 border-line pb-3">
          <h2 className="m-0 flex items-center gap-2 font-headline text-h3 font-bold text-green-900">
            <span className="h-2.5 w-2.5 rounded-full bg-gold-500" />
            {sidebar.title}
          </h2>
          <span className="text-meta font-semibold text-ink-500">{sidebar.updated}</span>
        </div>

        <div className="flex flex-1 flex-col justify-between gap-4">
          {sidebar.items.map((card) => (
            <CompactCard card={card} key={card.href} locale={locale} />
          ))}
        </div>
      </aside>
    </section>
  )
}
