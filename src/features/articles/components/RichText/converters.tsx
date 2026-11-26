import type {
  JSXConverterArgs,
  JSXConverters,
  JSXConvertersFunction,
} from '@payloadcms/richtext-lexical/react'
import React from 'react'

import { AdSlot } from '@/features/ads/components/AdSlot'
import { InfoIcon } from '@/shared/ui/icons'
import type { Locale } from '@/i18n/routing'
import type { Article, Media } from '@/payload-types'
import type { InArticlePlacement } from '@/features/ads/lib/adPlacement'

import {
  articleHref,
  asMedia,
  dir,
  image,
  infoBoxLabel,
  relatedLabel,
  textColor,
  youtubeId,
} from './helpers'
import type {
  ImageBlockFields,
  InfoBoxFields,
  PullQuoteFields,
  RelatedArticleFields,
  YouTubeFields,
} from './types'

type CreateConvertersArgs = {
  defaultConverters: Parameters<JSXConvertersFunction>[0]['defaultConverters']
  headingIds: WeakMap<object, number>
  locale: Locale
  placement: InArticlePlacement | null
}

export const createConverters = ({
  defaultConverters,
  headingIds,
  locale,
  placement,
}: CreateConvertersArgs) => {
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
      const paragraph = <p dir={dir(node)}>{children.length > 0 ? children : <br />}</p>

      if (!placement?.shouldInject || placement.afterNode !== node) return paragraph

      return (
        <React.Fragment key="in-article-1">
          {paragraph}
          <AdSlot locale={locale} slot="in-article-1" />
        </React.Fragment>
      )
    },

    heading: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children })
      // The article title owns the page's only <h1>. Clamp anything else.
      const tag = node.tag === 'h3' || node.tag === 'h4' || node.tag === 'h5' ? node.tag : 'h2'
      const id = headingIds.get(node)

      return React.createElement(
        tag,
        { dir: dir(node), ...(id ? { id: `section-${id}` } : {}) },
        children,
      )
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
            <InfoIcon className="rich-text__infobox-icon" />
            <div className="rich-text__infobox-body">
              <span className="rich-text__infobox-label">{infoBoxLabel[variant][locale]}</span>
              {fields.title ? (
                <p className="rich-text__infobox-title">{fields.title}</p>
              ) : null}
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </aside>
        )
      },
    },
  } satisfies JSXConverters
}
