import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ImageResponse } from 'next/og'

import { homeContent } from '@/content/home'
import type { Locale } from '@/i18n/routing'

/**
 * Shared 1200×630 social card used by the `opengraph-image` routes.
 *
 * The same Cairo file the site already self-hosts is handed to Satori. It is an
 * Arabic variable font, so Satori shapes and joins Arabic glyphs (and applies
 * bidi ordering for mixed Arabic/Latin titles) instead of emitting disconnected
 * letters. Satori lays out in LTR only, so the card mirrors itself manually:
 * right alignment for Arabic, left alignment for French.
 */

export const OG_SIZE = { width: 1200, height: 630 } as const

export const OG_CONTENT_TYPE = 'image/png'

export const OG_ALT = 'Akarat TV'

/**
 * Satori cannot parse variable fonts: it crashes in `parseFvarAxis` before any
 * markup is laid out. The cards therefore use static Cairo instances generated
 * from the variable file the site itself self-hosts (same typeface, one file
 * per weight). They are read once per server process.
 */
const FONT_FILES = [
  { file: 'Cairo-Regular.ttf', weight: 400 },
  { file: 'Cairo-Bold.ttf', weight: 700 },
  { file: 'Cairo-Black.ttf', weight: 900 },
] as const

const fonts = await Promise.all(
  FONT_FILES.map(async ({ file, weight }) => ({
    data: await readFile(path.join(process.cwd(), 'src/fonts', file)),
    name: 'Cairo',
    style: 'normal' as const,
    weight,
  })),
)

const CARD_BACKGROUND = '#0b3b2e'
const ACCENT = '#c9a227'
const ACCENT_LIGHT = '#f0d98a'
const CREAM = '#f7f3e8'

/** Collapses whitespace and cuts long headlines so the card cannot overflow. */
const clamp = (value: string, max: number): string => {
  const text = value.replace(/\s+/g, ' ').trim()

  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
}

const imageCache = new Map<string, string>()

/**
 * Satori needs the bytes, not a URL: inline the hero image as a data URI. The
 * page already stores a medium variant, so the fetch stays small. A failure
 * simply renders the gradient card.
 */
const inlineImage = async (url: string | undefined): Promise<string | null> => {
  if (!url) return null

  const cached = imageCache.get(url)
  if (cached) return cached

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      signal: AbortSignal.timeout(4_000),
    })

    if (!response.ok) return null

    const buffer = Buffer.from(await response.arrayBuffer())
    if (buffer.byteLength > 6_000_000) return null

    const contentType = response.headers.get('content-type')?.split(';')[0] ?? 'image/jpeg'
    const dataURI = `data:${contentType};base64,${buffer.toString('base64')}`

    imageCache.set(url, dataURI)

    return dataURI
  } catch {
    return null
  }
}

type CardOptions = {
  /** Small label above the title: section, region or tagline. */
  eyebrow?: string
  imageURL?: string
  locale: Locale
  title: string
}

export const renderOgImage = async ({
  eyebrow,
  imageURL,
  locale,
  title,
}: CardOptions): Promise<ImageResponse> => {
  const rtl = locale === 'ar'
  const brand = homeContent[locale].header.siteName
  const tagline =
    locale === 'ar' ? 'أخبار العقار في المغرب' : "L'actualité immobilière au Maroc"
  const image = await inlineImage(imageURL)
  const headline = clamp(title, 130)
  const headlineSize = headline.length > 95 ? 52 : headline.length > 65 ? 62 : 72
  const align = rtl ? 'flex-end' : 'flex-start'
  const textAlign = rtl ? 'right' : 'left'

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: CARD_BACKGROUND,
          color: CREAM,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Cairo',
          height: '100%',
          overflow: 'hidden',
          padding: '64px 72px',
          position: 'relative',
          width: '100%',
        }}
      >
        {image ? (
          <img
            alt=""
            src={image}
            style={{
              height: '100%',
              left: 0,
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              width: '100%',
            }}
          />
        ) : null}

        {image ? (
          <div
            style={{
              backgroundImage: rtl
                ? 'linear-gradient(270deg, rgba(7,45,34,0.97) 0%, rgba(7,45,34,0.88) 48%, rgba(7,45,34,0.28) 100%)'
                : 'linear-gradient(90deg, rgba(7,45,34,0.97) 0%, rgba(7,45,34,0.88) 48%, rgba(7,45,34,0.28) 100%)',
              display: 'flex',
              height: '100%',
              left: 0,
              position: 'absolute',
              top: 0,
              width: '100%',
            }}
          />
        ) : null}

        {/* Gold rule along the top edge. */}
        <div
          style={{
            backgroundImage: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_LIGHT}, ${ACCENT})`,
            display: 'flex',
            height: 12,
            left: 0,
            position: 'absolute',
            top: 0,
            width: '100%',
          }}
        />

        {/* Brand row. */}
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: rtl ? 'row-reverse' : 'row',
            justifyContent: 'space-between',
            position: 'relative',
            width: '100%',
          }}
        >
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: rtl ? 'row-reverse' : 'row',
              gap: 18,
            }}
          >
            <div
              style={{
                alignItems: 'center',
                backgroundColor: ACCENT,
                borderRadius: 16,
                color: CARD_BACKGROUND,
                display: 'flex',
                fontSize: 34,
                fontWeight: 900,
                height: 64,
                justifyContent: 'center',
                width: 64,
              }}
            >
              {rtl ? 'ع' : 'A'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.2 }}>{brand}</div>
              <div style={{ color: '#d9d2b4', fontSize: 21, lineHeight: 1.3 }}>{tagline}</div>
            </div>
          </div>

          <div
            style={{
              borderColor: 'rgba(240, 217, 138, 0.55)',
              borderRadius: 999,
              borderStyle: 'solid',
              borderWidth: 2,
              color: ACCENT_LIGHT,
              display: 'flex',
              fontSize: 21,
              fontWeight: 700,
              letterSpacing: 2,
              padding: '10px 22px',
            }}
          >
            {locale.toUpperCase()}
          </div>
        </div>

        {/* Headline block. */}
        <div
          style={{
            alignItems: align,
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-end',
            maxWidth: image ? 880 : 1056,
            paddingBottom: 34,
            position: 'relative',
            textAlign,
            width: '100%',
          }}
        >
          {eyebrow ? (
            <div
              style={{
                color: ACCENT_LIGHT,
                display: 'flex',
                fontSize: 25,
                fontWeight: 700,
                letterSpacing: rtl ? 0 : 3,
                lineHeight: 1.4,
                marginBottom: 14,
                textTransform: rtl ? 'none' : 'uppercase',
              }}
            >
              {clamp(eyebrow, 60)}
            </div>
          ) : null}

          <div
            style={{
              color: '#ffffff',
              fontSize: headlineSize,
              fontWeight: 900,
              lineHeight: 1.22,
            }}
          >
            {headline}
          </div>
        </div>

        {/* Footer rule + wordmark. */}
        <div
          style={{
            alignItems: 'center',
            borderTopColor: 'rgba(240, 217, 138, 0.35)',
            borderTopStyle: 'solid',
            borderTopWidth: 1,
            display: 'flex',
            flexDirection: rtl ? 'row-reverse' : 'row',
            justifyContent: 'space-between',
            paddingTop: 18,
            position: 'relative',
            width: '100%',
          }}
        >
          <div style={{ color: '#cfc7a6', display: 'flex', fontSize: 21, fontWeight: 700 }}>
            {locale === 'ar' ? 'عقارات تيفي' : 'Akarat TV'}
          </div>
          <div style={{ color: '#cfc7a6', display: 'flex', fontSize: 20, letterSpacing: 2 }}>
            AKARATTV
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts,
      headers: {
        // Social crawlers treat an hour-old card as fresh enough.
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    },
  )
}
