import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import React from 'react'

import { StandardCard } from '@/components/Home'
import { HomeIcon } from '@/components/icons'
import { getPathname } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'
import { getRegionAlternates, getRegionPage } from '@/utilities/content'
import { decodeSlug, regionPath } from '@/utilities/urls'

type PageProps = {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

type PageItem = number | 'ellipsis'

const first = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value

const parsePage = (value: string | undefined): number => {
  const parsed = Number.parseInt(value ?? '1', 10)

  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

/** A compact window with first/last pages and ellipses for long archives. */
const paginationWindow = (page: number, totalPages: number): PageItem[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const items: PageItem[] = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(totalPages - 1, page + 1)

  if (start > 2) items.push('ellipsis')
  for (let index = start; index <= end; index += 1) items.push(index)
  if (end < totalPages - 1) items.push('ellipsis')

  items.push(totalPages)

  return items
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug: rawSlug } = await params

  if (!hasLocale(routing.locales, locale)) return {}

  const data = await getRegionPage(decodeSlug(rawSlug), locale, 1)

  if (!data) {
    const t = await getTranslations({ locale, namespace: 'Region' })

    return { title: t('notFound') }
  }

  const alternates = await getRegionAlternates(data.region.id, data.region.slug, locale)
  const languages: Record<string, string> = {}

  for (const alternate of alternates) {
    if (alternate.href) {
      languages[alternate.locale] = getPathname({
        href: alternate.href,
        locale: alternate.locale,
      })
    }
  }

  return {
    alternates: {
      canonical: getPathname({
        href: regionPath(data.region.slug),
        locale,
      }),
      languages,
    },
    title: data.region.name,
  }
}

export default async function RegionPage({ params, searchParams }: PageProps) {
  const { locale, slug: rawSlug } = await params

  if (!hasLocale(routing.locales, locale)) notFound()

  const query = await searchParams
  const page = parsePage(first(query.page))
  const slug = decodeSlug(rawSlug)
  const data = await getRegionPage(slug, locale, page)

  if (!data) notFound()
  // An out-of-range page should not silently show the first page's articles.
  if (data.totalPages > 0 && page > data.totalPages) notFound()

  const t = await getTranslations({ locale, namespace: 'Region' })
  const basePath = regionPath(data.region.slug)
  const pageHref = (pageNumber: number): string =>
    `/${locale}${basePath}${pageNumber > 1 ? `?page=${pageNumber}` : ''}`

  return (
    <main className="mx-auto w-full max-w-content flex-1 px-4 py-8 sm:px-6">
      <nav aria-label={t('breadcrumbLabel')} className="mb-8">
        <ol className="flex min-w-0 flex-wrap items-center gap-2 font-semibold text-meta text-ink-500">
          <li>
            <a
              className="flex items-center gap-1 transition-colors hover:text-green-900"
              href={`/${locale}`}
            >
              <HomeIcon className="h-[17px] w-[17px]" />
              <span>{t('home')}</span>
            </a>
          </li>
          <li aria-hidden="true" className="text-ink-300">
            /
          </li>
          <li aria-current="page" className="min-w-0 max-w-md text-ink-700">
            <span className="block truncate">{data.region.name}</span>
          </li>
        </ol>
      </nav>

      <header className="mb-8 border-b border-line pb-6">
        <p className="mb-2 font-headline text-label font-bold text-gold-700">
          {t('articleCount', { count: data.totalDocs })}
        </p>
        <h1 className="m-0 font-headline text-h1 font-extrabold text-green-900">
          {data.region.name}
        </h1>
      </header>

      {data.cards.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.cards.map((card) => (
            <StandardCard
              card={card}
              key={card.href}
              locale={locale as Locale}
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            />
          ))}
        </div>
      ) : (
        <p className="rounded-card border border-line bg-surface p-8 text-center text-body-ui text-ink-500">
          {t('empty')}
        </p>
      )}

      {data.totalPages > 1 ? (
        <nav
          aria-label={t('pagination')}
          className="mt-12 flex flex-wrap items-center justify-center gap-2 border-t border-line pt-6"
        >
          {page > 1 ? (
            <a
              className="inline-flex h-10 items-center justify-center rounded-card border border-line bg-surface px-4 font-headline text-body-ui font-bold text-green-900 transition-colors hover:border-gold-500"
              href={pageHref(page - 1)}
            >
              {t('previous')}
            </a>
          ) : (
            <span
              aria-disabled="true"
              className="inline-flex h-10 items-center justify-center rounded-card border border-line bg-surface px-4 font-headline text-body-ui font-bold text-ink-300"
            >
              {t('previous')}
            </span>
          )}

          {paginationWindow(page, data.totalPages).map((item, index) =>
            item === 'ellipsis' ? (
              <span className="px-1 text-ink-500" key={`ellipsis-${index}`}>
                …
              </span>
            ) : (
              <a
                aria-current={item === page ? 'page' : undefined}
                className={`inline-flex h-10 min-w-10 items-center justify-center rounded-card border px-3 font-headline text-body-ui font-bold tabular-nums transition-colors ${
                  item === page
                    ? 'border-green-900 bg-green-900 text-gold-300'
                    : 'border-line bg-surface text-green-900 hover:border-gold-500'
                }`}
                href={pageHref(item)}
                key={item}
              >
                {item}
              </a>
            ),
          )}

          {page < data.totalPages ? (
            <a
              className="inline-flex h-10 items-center justify-center rounded-card border border-line bg-surface px-4 font-headline text-body-ui font-bold text-green-900 transition-colors hover:border-gold-500"
              href={pageHref(page + 1)}
            >
              {t('next')}
            </a>
          ) : (
            <span
              aria-disabled="true"
              className="inline-flex h-10 items-center justify-center rounded-card border border-line bg-surface px-4 font-headline text-body-ui font-bold text-ink-300"
            >
              {t('next')}
            </span>
          )}
        </nav>
      ) : null}
    </main>
  )
}
