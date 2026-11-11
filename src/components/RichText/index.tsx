import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { defaultColors } from '@payloadcms/richtext-lexical'
import {
  type JSXConverterArgs,
  type JSXConverters,
  type JSXConvertersFunction,
} from '@payloadcms/richtext-lexical/react'
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import type { Article, Media } from '@/payload-types'

type Direction = 'ltr' | 'rtl' | null | undefined

type Locale = 'ar' | 'fr'

/**
 * Lexical stores a direction per block node, but that value is inherited when
 * the editor presses Enter, so a Latin paragraph written right after an Arabic
 * one can be stored as `rtl`. Let the browser infer the base direction from the
 * first strong character instead: that is what makes a single paragraph mixing
 * Arabic, French and numbers render correctly on the frontend.
 */
const dir = (_node: { direction?: Direction }): 'auto' => 'auto'

const localeQuery = (locale: Locale) => `?locale=${locale}`

const articleHref = (reference: unknown, locale: Locale): string => {
  if (reference !== null && typeof reference === 'object') {
    const doc = reference as { id?: number | string; slug?: string | null }

    if (doc.slug) return `/articles/${encodeURIComponent(doc.slug)}${localeQuery(locale)}`
    if (doc.id !== undefined) return `/articles/${doc.id}${localeQuery(locale)}`
  }

  if (typeof reference === 'number' || typeof reference === 'string') {
    return `/articles/${encodeURIComponent(String(reference))}${localeQuery(locale)}`
  }

  return '#'
}

type MediaFields = {
  url?: null | string
  alt?: null | string
  caption?: null | string
  width?: null | number
  height?: null | number
  mimeType?: null | string
  filename?: null | string
}

const asMedia = (value: unknown): MediaFields | null =>
  value !== null && typeof value === 'object' ? (value as MediaFields) : null

const image = (
  media: MediaFields,
  alt: string,
  caption?: null | string,
  eager?: boolean,
): React.ReactNode => {
  if (!media.url) return null

  return (
    <figure className="rich-text__figure" dir="auto">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={alt}
        decoding="async"
        height={media.height ?? undefined}
        loading={eager ? 'eager' : 'lazy'}
        src={media.url}
        width={media.width ?? undefined}
      />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}

type ImageBlockFields = {
  alt?: null | string
  caption?: null | string
  image?: Media | number | null
}

type PullQuoteFields = {
  attribution?: null | string
  quote?: null | string
}

type RelatedArticleFields = {
  article?: Article | number | null
}

type YouTubeFields = {
  caption?: null | string
  title?: null | string
  url?: null | string
}

type InfoBoxFields = {
  body?: null | string
  title?: null | string
  variant?: 'info' | 'tip' | 'warning' | null
}

const YOUTUBE_ID =
  /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/i

const youtubeId = (url?: null | string): string | null => {
  if (!url) return null

  return YOUTUBE_ID.exec(url)?.[1] ?? null
}

const infoBoxLabel: Record<NonNullable<InfoBoxFields['variant']>, Record<Locale, string>> = {
  info: { ar: 'معلومة', fr: 'Information' },
  tip: { ar: 'نصيحة', fr: 'Conseil' },
  warning: { ar: 'تحذير', fr: 'Avertissement' },
}

const relatedLabel: Record<Locale, string> = {
  ar: 'مقال ذو صلة',
  fr: 'Article lié',
}

const textColor = (node: { color?: unknown }): string | undefined => {
  if (typeof node.color !== 'string') return undefined

  const palette = defaultColors.text as Record<string, { css?: { color?: string } } | undefined>

  return palette[node.color]?.css?.color
}

export type RichTextProps = {
  className?: string
  content: Article['content'] | null | undefined
  locale: Locale
}

/**
 * Renders Payload's Lexical JSON as semantic HTML.
 *
 * Everything that has a native semantic element gets one: figures with
 * captions, block quotes with citations, ordered/unordered lists, etc.
 * `dir` is set on every block so Arabic, French and numbers can coexist.
 */
export function RichText({ className, content, locale }: RichTextProps) {
  if (!content) return null

  const converters: JSXConvertersFunction = ({ defaultConverters }) => {
    const textConverter = defaultConverters.text

    return {
      ...defaultConverters,

      // Payload's default text converter ignores custom text colours. Wrap the
      // rendered text in a span when the TextState feature stored one.
      text: (args: JSXConverterArgs) => {
        const rendered =
          typeof textConverter === 'function' ? textConverter(args as never) : textConverter
        const color = textColor(args.node as { color?: unknown })

        if (!color) return rendered

        return <span style={{ color }}>{rendered}</span>
      },

      paragraph: ({ node, nodesToJSX }) => {
        const children = nodesToJSX({ nodes: node.children })

        return (
          <p dir={dir(node)}>{children.length > 0 ? children : <br />}</p>
        )
      },

      heading: ({ node, nodesToJSX }) => {
        const children = nodesToJSX({ nodes: node.children })
        // The article title owns the page's only <h1>. Clamp anything else.
        const tag = node.tag === 'h3' || node.tag === 'h4' || node.tag === 'h5' ? node.tag : 'h2'

        return React.createElement(tag, { dir: dir(node) }, children)
      },

      quote: ({ node, nodesToJSX }) => {
        const children = nodesToJSX({ nodes: node.children })

        return <blockquote dir={dir(node)}>{children}</blockquote>
      },

      list: ({ node, nodesToJSX }) => {
        const children = nodesToJSX({ nodes: node.children })
        const tag = node.tag === 'ol' ? 'ol' : 'ul'

        return React.createElement(
          tag,
          { className: `list-${node.listType ?? 'bullet'}`, dir: dir(node) },
          children,
        )
      },

      upload: ({ node }) => {
        const uploadNode = node as unknown as {
          fields?: { alt?: null | string; caption?: null | string }
          value?: Media | number | null
        }
        const media = asMedia(uploadNode.value)

        if (!media) return null

        // Non-image uploads are rendered as a download link.
        if (media.mimeType && !media.mimeType.startsWith('image/')) {
          return (
            <p>
              <a href={media.url ?? '#'} rel="noopener noreferrer">
                {media.filename ?? media.url ?? 'Download'}
              </a>
            </p>
          )
        }

        const alt = uploadNode.fields?.alt || media.alt || ''

        return image(media, alt, uploadNode.fields?.caption ?? media.caption)
      },

      blocks: {
        imageBlock: ({ node }) => {
          const fields = node.fields as unknown as ImageBlockFields
          const media = asMedia(fields.image)

          if (!media) return null

          return image(media, fields.alt || media.alt || '', fields.caption)
        },

        pullQuote: ({ node }) => {
          const fields = node.fields as unknown as PullQuoteFields

          if (!fields.quote) return null

          return (
            <figure className="rich-text__pullquote">
              <blockquote dir="auto">
                <p>{fields.quote}</p>
              </blockquote>
              {fields.attribution ? (
                <figcaption>
                  <cite>{fields.attribution}</cite>
                </figcaption>
              ) : null}
            </figure>
          )
        },

        relatedArticle: ({ node }) => {
          const fields = node.fields as unknown as RelatedArticleFields
          const article = fields.article

          if (article === null || article === undefined) return null

          const populated =
            typeof article === 'object'
              ? (article as Pick<Article, 'excerpt' | 'slug' | 'title'>)
              : null

          return (
            <aside className="rich-text__related" dir="auto">
              <span className="rich-text__related-label">{relatedLabel[locale]}</span>
              <a href={articleHref(article, locale)}>
                <span className="rich-text__related-title">
                  {populated?.title ?? relatedLabel[locale]}
                </span>
                {populated?.excerpt ? (
                  <span className="rich-text__related-excerpt">{populated.excerpt}</span>
                ) : null}
              </a>
            </aside>
          )
        },

        youtube: ({ node }) => {
          const fields = node.fields as unknown as YouTubeFields
          const id = youtubeId(fields.url)

          if (!id) return null

          return (
            <figure className="rich-text__video">
              <div className="rich-text__video-frame">
                <iframe
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  src={`https://www.youtube-nocookie.com/embed/${id}`}
                  title={fields.title || 'YouTube'}
                />
              </div>
              {fields.caption ? <figcaption>{fields.caption}</figcaption> : null}
            </figure>
          )
        },

        infoBox: ({ node }) => {
          const fields = node.fields as unknown as InfoBoxFields

          if (!fields.body) return null

          const variant = fields.variant ?? 'info'
          const paragraphs = fields.body
            .split(/\n{2,}|\r?\n/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean)

          return (
            <aside
              className={`rich-text__infobox rich-text__infobox--${variant}`}
              dir="auto"
              role="note"
            >
              <span className="rich-text__infobox-label">{infoBoxLabel[variant][locale]}</span>
              {fields.title ? (
                <p className="rich-text__infobox-title">{fields.title}</p>
              ) : null}
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </aside>
          )
        },
      },
    } satisfies JSXConverters
  }

  return (
    <LexicalRichText
      className={className ?? 'rich-text'}
      converters={converters}
      data={content as unknown as SerializedEditorState}
    />
  )
}

export default RichText
