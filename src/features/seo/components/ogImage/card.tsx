import type { Locale } from '@/i18n/routing'

import { clamp } from './image'
import { ACCENT, ACCENT_LIGHT, CARD_BACKGROUND, CREAM } from './theme'

type OgImageCardProps = {
  /** Small label above the title: section, region or tagline. */
  eyebrow?: string
  brand: string
  headline: string
  headlineSize: number
  image: string | null
  locale: Locale
  rtl: boolean
  tagline: string
}

/**
 * Shared 1200×630 social card used by the `opengraph-image` routes.
 *
 * The site's Arabic face (Cairo) is handed to Satori so Arabic glyphs are
 * shaped and joined (and bidi ordering applies to mixed Arabic/Latin titles)
 * instead of emitting disconnected letters. Satori lays out in LTR only, so the
 * card mirrors itself manually: right alignment for Arabic, left for French.
 */
export function OgImageCard({
  brand,
  eyebrow,
  headline,
  headlineSize,
  image,
  locale,
  rtl,
  tagline,
}: OgImageCardProps) {
  const align = rtl ? 'flex-end' : 'flex-start'
  const textAlign = rtl ? 'right' : 'left'

  return (
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
  )
}
