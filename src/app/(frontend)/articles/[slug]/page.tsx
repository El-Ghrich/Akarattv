import type { Metadata } from 'next'
import { headers as getHeaders } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { LiveArticle } from '@/components/LiveArticle'

type Locale = 'ar' | 'fr'

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const asLocale = (value: string | string[] | undefined): Locale => (value === 'fr' ? 'fr' : 'ar')

const first = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value

const decodeSlug = (value: string): string => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

const findArticle = async ({
  draft,
  locale,
  slug,
}: {
  draft: boolean
  locale: Locale
  slug: string
}) => {
  const payload = await getPayload({ config })
  const isID = /^\d+$/.test(slug)

  const result = await payload.find({
    collection: 'articles',
    depth: 2,
    draft,
    limit: 1,
    locale,
    overrideAccess: false,
    where: isID ? { id: { equals: Number(slug) } } : { slug: { equals: slug } },
  })

  return result.docs[0] ?? null
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const query = await searchParams
  const locale = asLocale(query.locale)
  const preview = first(query.preview) === '1'
  const article = await findArticle({ draft: false, locale, slug: decodeSlug(slug) })

  if (!article) {
    return { title: 'Article introuvable' }
  }

  return {
    description: article.excerpt,
    robots: preview ? { follow: false, index: false } : undefined,
    title: article.title,
  }
}

export default async function ArticlePage({ params, searchParams }: PageProps) {
  const { slug: rawSlug } = await params
  const slug = decodeSlug(rawSlug)
  const query = await searchParams
  const locale = asLocale(query.locale)
  const requestedPreview = first(query.preview) === '1'

  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })

  // Drafts are only readable by logged-in editors. An anonymous visitor can
  // append `?preview=1` to the URL without ever seeing unpublished content.
  const preview = requestedPreview && Boolean(user)
  const article = await findArticle({ draft: preview, locale, slug })

  if (!article) {
    notFound()
  }

  const host = headers.get('host')
  const protocol = headers.get('x-forwarded-proto') ?? 'http'
  const serverURL =
    process.env.NEXT_PUBLIC_SERVER_URL || (host ? `${protocol}://${host}` : 'http://localhost:3000')

  return (
    <main className="article-shell">
      <LiveArticle
        initialArticle={article}
        locale={locale}
        preview={preview}
        serverURL={serverURL}
      />
    </main>
  )
}
