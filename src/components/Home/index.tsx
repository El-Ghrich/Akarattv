import Image from 'next/image'
import React from 'react'

import { ArrowIcon, CalendarIcon, MailCheckIcon, ShieldCheckIcon, TrendUpIcon } from '@/components/icons'
import {
  cardImageUrl,
  type HomeCard,
  type HomeContent,
  type HomeSection,
  unsplashUrl,
} from '@/content/home'
import type { Locale } from '@/i18n/routing'
import type { HomeVideo } from '@/utilities/content'

import { VideosSection } from './VideosSection'

const cardHref = (locale: Locale, href: string) => `/${locale}${href}`

const Badge = ({ children, large = false }: { children: React.ReactNode; large?: boolean }) => (
  <span
    className={`inline-flex items-center rounded-full font-headline text-label font-bold text-gold-700 ${
      large ? 'bg-gold-300 px-3.5 py-1 shadow-xs' : 'bg-gold-300/60 px-2.5 py-0.5'
    }`}
  >
    {children}
  </span>
)

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
  small?: boolean
}

const CompactCard = ({ card, locale, small = false }: CompactCardProps) => (
  <article className="group relative flex gap-3.5 rounded-card border border-line bg-surface p-3.5 shadow-xs transition-all hover:border-gold-400">
    <div
      className={`relative shrink-0 overflow-hidden rounded-card bg-green-100 ${
        small ? 'h-20 w-20' : 'h-24 w-24'
      }`}
    >
      <Image
        alt={card.alt}
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        fill
        sizes={small ? '80px' : '96px'}
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

type StandardCardProps = {
  card: HomeCard
  locale: Locale
  large?: boolean
  sizes: string
}

const StandardCard = ({ card, large = false, locale, sizes }: StandardCardProps) => (
  <article className="group relative flex flex-col overflow-hidden rounded-card border border-line bg-surface shadow-xs transition-all duration-200 hover:border-gold-400">
    <div
      className={`relative overflow-hidden bg-green-100 ${
        large ? 'aspect-[16/9]' : 'aspect-[3/2]'
      }`}
    >
      <Image
        alt={card.alt}
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        fill
        sizes={sizes}
        src={cardImageUrl(card, large ? 1200 : 800)}
      />
    </div>

    <div
      className={`flex flex-1 flex-col justify-between ${
        large ? 'p-6' : 'p-5'
      }`}
    >
      <div>
        <div className="mb-2">
          <Badge>{card.category}</Badge>
        </div>
        <h3
          className={`m-0 mb-2 line-clamp-3 font-headline font-bold leading-snug text-ink-900 transition-colors group-hover:text-green-600 ${
            large ? 'text-h3' : 'text-card-title'
          }`}
        >
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

const BrandHero = ({ content, locale }: { content: HomeContent; locale: Locale }) => (
  <section
    aria-label={content.hero.titleAccent}
    className="relative overflow-hidden rounded-card border border-gold-500/30 bg-green-950 shadow-md"
  >
    <div className="relative flex min-h-[380px] items-center justify-center lg:min-h-[420px]">
      <Image
        alt={content.hero.alt}
        className="object-cover object-center"
        fill
        priority
        sizes="(min-width: 1280px) 1280px, 100vw"
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

const HeroZone = ({ content, locale }: { content: HomeContent; locale: Locale }) => {
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
          fill
          sizes="(min-width: 1024px) 66vw, 100vw"
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
            <CompactCard card={card} key={card.title} locale={locale} />
          ))}
        </div>
      </aside>
    </section>
  )
}

const LatestNews = ({ content, locale }: { content: HomeContent; locale: Locale }) => (
  <section aria-labelledby="latest-news-title" id="latest-news">
    <SectionHeader
      id="latest-news-title"
      locale={locale}
      title={content.latest.title}
      viewAll={content.latest.viewAll}
    />

    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {content.latest.items.map((card) => (
        <StandardCard
          card={card}
          key={card.title}
          locale={locale}
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
        />
      ))}
    </div>
  </section>
)

const CategorySection = ({ locale, section }: { locale: Locale; section: HomeSection }) => {
  const hasCompact = section.compact.length > 0

  return (
    <section aria-labelledby={`${section.id}-title`} className="pt-2" id={section.id}>
      <SectionHeader
        id={`${section.id}-title`}
        locale={locale}
        title={section.title}
        viewAll={section.viewAll}
      />

      <div
        className={`grid grid-cols-1 items-stretch gap-6 ${
          hasCompact ? 'lg:grid-cols-12' : ''
        }`}
      >
        <div className={hasCompact ? 'lg:col-span-8' : undefined}>
          <StandardCard
            card={section.featured}
            large
            locale={locale}
            sizes={hasCompact ? '(min-width: 1024px) 66vw, 100vw' : '100vw'}
          />
        </div>

        {hasCompact ? (
          <div className="flex flex-col justify-between gap-4 lg:col-span-4">
            {section.compact.map((card) => (
              <CompactCard card={card} key={card.title} locale={locale} small />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

const RegionChips = ({ content, locale }: { content: HomeContent; locale: Locale }) => (
  <section
    aria-labelledby="regions-browse-title"
    className="rounded-card border border-line bg-surface p-8 shadow-xs"
    id="regions"
  >
    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
      <div>
        <h2
          className="m-0 mb-1 font-headline text-h2 font-bold text-green-900"
          id="regions-browse-title"
        >
          {content.regions.title}
        </h2>
        <p className="m-0 text-body-ui text-ink-500">{content.regions.description}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {content.regions.items.map((region) => (
          <a
            className="inline-flex items-center rounded-full border border-line bg-surface px-6 py-2.5 font-headline text-body-ui font-bold text-ink-900 shadow-xs transition-colors hover:border-gold-500 hover:bg-green-100 hover:text-green-900"
            href={cardHref(locale, region.href)}
            key={region.href + region.label}
          >
            <span>{region.label}</span>
          </a>
        ))}
      </div>
    </div>
  </section>
)

const NewsletterBand = ({ content }: { content: HomeContent }) => (
  <section
    aria-labelledby="newsletter-title"
    className="relative overflow-hidden rounded-card border border-gold-500/20 bg-green-900 p-8 text-white shadow-md sm:p-12"
    id="newsletter-section"
  >
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: "url('/bg.svg')" }}
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-gradient-to-br from-green-950/55 via-green-900/45 to-green-900/35"
    />

    <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gold-500/40 bg-green-800 text-gold-400">
        <MailCheckIcon className="h-6 w-6" />
      </div>

      <h2
        className="m-0 mb-2 font-headline text-h1 font-extrabold text-white"
        id="newsletter-title"
      >
        {content.newsletter.title}
      </h2>

      <p className="m-0 mb-8 max-w-xl text-body-article leading-relaxed text-gold-300">
        {content.newsletter.description}
      </p>

      <form action="#newsletter-section" className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <input
            aria-label={content.newsletter.emailLabel}
            className="h-12 w-full rounded-card border border-line bg-surface px-4 text-body-ui text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
            placeholder={content.newsletter.placeholder}
            type="email"
          />
        </div>
        <button
          className="h-12 whitespace-nowrap rounded-card bg-gold-500 px-8 font-headline text-body-ui font-bold text-green-950 shadow-sm transition-colors hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-green-900"
          type="submit"
        >
          {content.newsletter.button}
        </button>
      </form>

      <p className="m-0 mt-4 flex items-center gap-2 text-meta text-ink-300">
        <ShieldCheckIcon className="h-[15px] w-[15px] text-gold-400" />
        <span>{content.newsletter.privacy}</span>
      </p>
    </div>
  </section>
)

export type HomeSectionsProps = {
  content: HomeContent
  locale: Locale
  videos: HomeVideo[]
}

export const HomeSections = ({ content, locale, videos }: HomeSectionsProps) => (
  <>
    <BrandHero content={content} locale={locale} />
    <HeroZone content={content} locale={locale} />
    <LatestNews content={content} locale={locale} />
    <VideosSection content={content.videos} locale={locale} videos={videos} />
    {/* Only the first two category blocks belong on the homepage; the header
        still lists every category. */}
    {content.sections.slice(0, 2).map((section) => (
      <CategorySection key={section.id} locale={locale} section={section} />
    ))}
    <RegionChips content={content} locale={locale} />
    <NewsletterBand content={content} />
  </>
)

export { BrandHero, HeroZone, LatestNews, NewsletterBand, RegionChips, StandardCard }
