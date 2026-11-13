import type { Metadata } from 'next'
import { headers as getHeaders } from 'next/headers'
import { hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { LiveArticle } from '@/components/LiveArticle'
import { getPathname } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'
import { getArticleAlternates } from '@/utilities/articleAlternates'
import { getArticle, getLatestArticles } from '@/utilities/content'
import { decodeSlug } from '@/utilities/urls'

type PageProps = {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const first = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { locale, slug: rawSlug } = await params

  if (!hasLocale(routing.locales, locale)) return {}

  const query = await searchParams
  const preview = first(query.preview) === '1'
  const article = await getArticle(decodeSlug(rawSlug), locale, false)

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
  const article = await getArticle(slug, locale, preview)

  if (!article) notFound()

  const latest = await getLatestArticles(locale, article.id)

  const host = headers.get('host')
  const protocol = headers.get('x-forwarded-proto') ?? 'http'
  const serverURL =
    process.env.NEXT_PUBLIC_SERVER_URL || (host ? `${protocol}://${host}` : 'http://localhost:3000')
  const shareUrl = `${serverURL.replace(/\/$/, '')}/${locale}/articles/${encodeURIComponent(
    article.slug ?? slug,
  )}`

  return (
    <main className="mx-auto w-full max-w-content flex-1 px-4 py-8 sm:px-6">
      <LiveArticle
        initialArticle={article}
        latest={latest}
        locale={locale}
        preview={preview}
        serverURL={serverURL}
        shareUrl={shareUrl}
      />
    </main>
  )
}
