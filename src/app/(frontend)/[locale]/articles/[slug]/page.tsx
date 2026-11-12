import type { Metadata } from 'next'
import { headers as getHeaders } from 'next/headers'
import { hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { cache } from 'react'
import React from 'react'

import config from '@/payload.config'
import { LiveArticle } from '@/components/LiveArticle'
import { SiteHeader } from '@/components/SiteHeader'
import { getPathname } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'
import { getArticleAlternates } from '@/utilities/articleAlternates'

type PageProps = {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const first = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value

const decodeSlug = (value: string): string => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

/**
 * `fallbackLocale: false` makes the slug locale-strict: `/fr/articles/<arabic-slug>`
 * must not resolve to the Arabic row. Only a slug stored for the requested
 * locale is allowed to match.
 */
const findArticle = cache(async (slug: string, locale: Locale, draft: boolean) => {
  const payload = await getPayload({ config })
  const isID = /^\d+$/.test(slug)

  const result = await payload.find({
    collection: 'articles',
    depth: 2,
    draft,
    fallbackLocale: false,
    limit: 1,
    locale,
    overrideAccess: false,
    where: isID ? { id: { equals: Number(slug) } } : { slug: { equals: slug } },
  })

  return result.docs[0] ?? null
})

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { locale, slug: rawSlug } = await params

  if (!hasLocale(routing.locales, locale)) return {}

  const query = await searchParams
  const preview = first(query.preview) === '1'
  const article = await findArticle(decodeSlug(rawSlug), locale, false)

  if (!article) {
    const t = await getTranslations({ locale, namespace: 'Article' })

    return { title: t('notFound') }
  }

  const routeSlug = article.slug ?? decodeSlug(rawSlug)
  const alternates = await getArticleAlternates(article.id, routeSlug, locale)

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
        href: `/articles/${encodeURIComponent(routeSlug)}`,
        locale,
      }),
      languages,
    },
    description: article.excerpt,
    robots: preview ? { follow: false, index: false } : undefined,
    title: article.title,
  }
}

export default async function ArticlePage({ params, searchParams }: PageProps) {
  const { locale, slug: rawSlug } = await params

  if (!hasLocale(routing.locales, locale)) notFound()

  const slug = decodeSlug(rawSlug)
  const query = await searchParams
  const requestedPreview = first(query.preview) === '1'

  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })

  // Drafts are only readable by logged-in editors. An anonymous visitor can
  // append `?preview=1` to the URL without ever seeing unpublished content.
  const preview = requestedPreview && Boolean(user)
  const article = await findArticle(slug, locale, preview)

  if (!article) notFound()

  const alternates = await getArticleAlternates(article.id, article.slug ?? slug, locale)

  const host = headers.get('host')
  const protocol = headers.get('x-forwarded-proto') ?? 'http'
  const serverURL =
    process.env.NEXT_PUBLIC_SERVER_URL || (host ? `${protocol}://${host}` : 'http://localhost:3000')

  return (
    <div className="article-surface">
      <SiteHeader alternates={alternates} locale={locale} />
      <main className="article-shell">
        <LiveArticle
          initialArticle={article}
          locale={locale}
          preview={preview}
          serverURL={serverURL}
        />
      </main>
    </div>
  )
}
