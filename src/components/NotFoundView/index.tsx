import React from 'react'

import {
  ArrowIcon,
  ChatIcon,
  HomeIcon,
  InfoIcon,
  ListIcon,
  MailCheckIcon,
  RefreshIcon,
} from '@/components/icons'
import { notFoundContent, type NotFoundSuggestion } from '@/content/notFound'
import type { Locale } from '@/i18n/routing'

export type NotFoundArticle = {
  locale: Locale
  slug: string
  title: string
}

export type NotFoundViewProps = {
  locale: Locale
  otherArticle?: NotFoundArticle | null
}

const localHref = (locale: Locale, path: string): string => `/${locale}${path}`

const suggestionIcon = (icon: NotFoundSuggestion['icon']): React.ReactNode => {
  switch (icon) {
    case 'sections':
      return <ListIcon className="h-5 w-5" />
    case 'about':
      return <InfoIcon className="h-5 w-5" />
    case 'contact':
      return <MailCheckIcon className="h-5 w-5" />
    default:
      return <HomeIcon className="h-5 w-5" />
  }
}

export function NotFoundView({ locale, otherArticle }: NotFoundViewProps) {
  const content = notFoundContent[locale]

  return (
    <main className="not-found-shell relative isolate flex w-full flex-1 items-center overflow-hidden bg-green-950 px-4 py-16 text-white sm:px-6 lg:py-24">
      <div aria-hidden="true" className="not-found-grid absolute inset-0 -z-20" />
      <div
        aria-hidden="true"
        className="absolute -left-40 top-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-green-700/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-52 right-0 -z-10 h-[32rem] w-[32rem] rounded-full bg-gold-700/20 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-content items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1.5 font-headline text-label font-bold uppercase tracking-[0.16em] text-gold-300">
              <RefreshIcon className="h-4 w-4" />
              {content.eyebrow}
            </span>
            <span className="inline-flex items-center gap-2 text-meta font-semibold text-ink-300">
              {content.codeLabel}
              <span className="font-mono text-gold-400">HTTP 404</span>
            </span>
          </div>

          {otherArticle ? (
            <div className="mt-8 rounded-card border border-gold-500/40 bg-white/5 p-6 backdrop-blur-sm">
              <h1 className="m-0 font-headline text-h1 font-extrabold leading-tight text-white">
                {content.unavailableTitle}
              </h1>
              <p className="mb-0 mt-3 max-w-xl text-body-ui leading-relaxed text-ink-300">
                {content.unavailableText}
              </p>
              <p className="mb-0 mt-5 text-meta font-bold text-gold-300">
                {content.availableIn}{' '}
                <span dir={otherArticle.locale === 'ar' ? 'rtl' : 'ltr'} lang={otherArticle.locale}>
                  {otherArticle.title}
                </span>
              </p>
              <a
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-card bg-gold-500 px-5 font-headline text-body-ui font-bold text-green-950 transition-colors hover:bg-gold-400"
                href={localHref(
                  otherArticle.locale,
                  `/articles/${encodeURIComponent(otherArticle.slug)}`,
                )}
              >
                {content.readInOther}
                <ArrowIcon className="h-4 w-4 rtl:rotate-180" />
              </a>
            </div>
          ) : (
            <>
              <h1 className="m-0 mt-7 font-headline text-display font-extrabold leading-tight text-white">
                {content.title}
              </h1>
              <p className="mb-0 mt-5 max-w-xl text-body-article leading-relaxed text-ink-300">
                {content.text}
              </p>
            </>
          )}

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              className="inline-flex h-12 items-center gap-2 rounded-card bg-gold-500 px-6 font-headline text-body-ui font-bold text-green-950 transition-colors hover:bg-gold-400"
              href={localHref(locale, '/')}
            >
              <HomeIcon className="h-5 w-5" />
              {content.home}
              <ArrowIcon className="h-4 w-4 rtl:rotate-180" />
            </a>
            <a
              className="inline-flex h-12 items-center gap-2 rounded-card border border-white/20 bg-white/5 px-6 font-headline text-body-ui font-bold text-white transition-colors hover:border-gold-400 hover:bg-white/10"
              href={localHref(locale, '/#latest-news')}
            >
              <RefreshIcon className="h-4 w-4" />
              {content.latest}
            </a>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {content.suggestions.map((suggestion) => (
              <a
                className="group flex items-center gap-3 rounded-card border border-white/10 bg-white/[0.04] p-4 transition-colors hover:border-gold-500/50 hover:bg-white/[0.08]"
                href={localHref(locale, suggestion.href)}
                key={suggestion.href}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10 text-gold-300">
                  {suggestionIcon(suggestion.icon)}
                </span>
                <span className="min-w-0">
                  <span className="block font-headline text-body-ui font-bold text-white">
                    {suggestion.label}
                  </span>
                  <span className="mt-0.5 block text-meta leading-snug text-ink-300">
                    {suggestion.description}
                  </span>
                </span>
                <ArrowIcon className="ms-auto h-4 w-4 shrink-0 text-gold-400 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </a>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6 text-meta text-ink-300 sm:flex-row sm:items-center sm:justify-between">
            <span className="inline-flex items-center gap-2 font-bold text-gold-300">
              <ChatIcon className="h-4 w-4" />
              {content.helpTitle}
            </span>
            <span>{content.reportText}</span>
          </div>
        </div>

        <div aria-hidden="true" className="not-found-visual relative hidden min-h-[28rem] lg:block">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="not-found-orbit absolute h-[22rem] w-[22rem] rounded-full border border-gold-500/20" />
            <div className="not-found-orbit not-found-orbit--reverse absolute h-[17rem] w-[17rem] rounded-full border border-white/10" />
            <div className="not-found-orbit absolute h-[12rem] w-[12rem] rounded-full border border-gold-400/25" />
            <p className="not-found-number relative m-0 select-none text-center">404</p>
          </div>

          <div className="absolute left-1/2 top-8 -translate-x-1/2 rounded-full border border-white/10 bg-green-900/80 px-4 py-2 font-headline text-label font-bold uppercase tracking-[0.2em] text-gold-300 backdrop-blur-sm">
            Akarat TV
          </div>
          <div className="absolute bottom-10 left-6 rounded-card border border-white/10 bg-green-900/80 px-4 py-3 text-meta font-semibold text-ink-300 backdrop-blur-sm">
            <span className="block font-mono text-lg text-gold-400">/404</span>
            <span className="block text-label uppercase tracking-widest">noindex</span>
          </div>
          <div className="absolute bottom-16 right-4 rounded-card border border-white/10 bg-green-900/80 px-4 py-3 text-meta font-semibold text-ink-300 backdrop-blur-sm">
            <span className="block font-mono text-lg text-gold-400">{locale === 'ar' ? 'ع/ف' : 'FR'}</span>
            <span className="block text-label uppercase tracking-widest">
              {locale === 'ar' ? 'العربية' : 'Français'}
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}

export default NotFoundView
