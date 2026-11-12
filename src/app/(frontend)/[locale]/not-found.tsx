import { headers as getHeaders } from 'next/headers'
import { hasLocale } from 'next-intl'
import { getLocale, getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { Link } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'

type TranslatedArticle = {
  slug: string
  title: string
}

type NotFoundContext = {
  locale: Locale
  otherArticle: TranslatedArticle | null
  otherLocale: Locale
}

const articlePathname = /^\/([^/]+)\/articles\/([^/]+)\/?$/

const decodeSlug = (value: string): string => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

/**
 * `notFound()` carries no context, and a not-found boundary receives no route
 * params. The requested URL is therefore read from the `x-pathname` header set
 * by the proxy, then the same slug is looked up in the other locale.
 *
 * A match there means the article is published but has no translation in the
 * requested locale. No match means the slug does not exist at all.
 */
const getNotFoundContext = async (): Promise<NotFoundContext | null> => {
  const headerList = await getHeaders()
  const pathname = headerList.get('x-pathname')

  if (!pathname) return null

  const match = articlePathname.exec(pathname)
  if (!match) return null

  const rawLocale = match[1]
  const rawSlug = match[2]

  if (!rawLocale || !rawSlug || !hasLocale(routing.locales, rawLocale)) return null

  const locale: Locale = rawLocale
  const slug = decodeSlug(rawSlug)
  const otherLocale: Locale = locale === 'ar' ? 'fr' : 'ar'

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'articles',
    depth: 0,
    draft: false,
    // Without this, the lookup could return the Arabic slug as a French one.
    fallbackLocale: false,
    limit: 1,
    locale: otherLocale,
    overrideAccess: false,
    select: { slug: true, title: true },
    where: { slug: { equals: slug } },
  })

  const article = result.docs[0]

  return {
    locale,
    otherArticle:
      article?.slug && article.title ? { slug: article.slug, title: article.title } : null,
    otherLocale,
  }
}

export default async function ArticleNotFound() {
  const context = await getNotFoundContext()
  const t = await getTranslations('NotFound')
  const locale = context?.locale ?? (await getLocale())
  const other = context?.otherArticle
  const otherLocale = context?.otherLocale

  return (
    <main className="not-found">
      <p className="not-found__code">404</p>

      {other && otherLocale ? (
        <>
          <h1 className="not-found__title">{t('unavailableTitle')}</h1>
          <p className="not-found__text">{t('unavailableText')}</p>
          <p className="not-found__other">
            <span>{t('availableIn')}</span>{' '}
            <span dir={otherLocale === 'ar' ? 'rtl' : 'ltr'} lang={otherLocale}>
              {other.title}
            </span>
          </p>
          <Link
            className="not-found__link"
            href={`/articles/${encodeURIComponent(other.slug)}`}
            locale={otherLocale}
          >
            {t('readInOther')}
          </Link>
        </>
      ) : (
        <>
          <h1 className="not-found__title">{t('title')}</h1>
          <p className="not-found__text">{t('text')}</p>
        </>
      )}

      <Link className="not-found__link not-found__link--secondary" href="/" locale={locale}>
        {t('home')}
      </Link>
    </main>
  )
}
