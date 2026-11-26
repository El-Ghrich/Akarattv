import Image from 'next/image'

import type { Media } from '@/payload-types'

/** The hero is painted at 1000px at most, so explicit sizes avoid oversized R2 variants. */
const HERO_SIZES =
  '(max-width: 640px) calc(100vw - 32px), (min-width: 1064px) 1000px, calc(100vw - 48px)'

export function ArticleHero({ image, title }: { image: Media | null; title: string }) {
  if (!image?.url) return null

  return (
    <figure className="mx-auto mb-12 max-w-[1000px] overflow-hidden rounded-card border border-line bg-green-950 shadow-xs">
      <div className="aspect-[16/9] w-full overflow-hidden">
        <Image
          alt={image.alt ?? title}
          // Next 16: `preload` replaces the deprecated `priority` prop and
          // emits a responsive <link rel="preload"> in <head>. Pairing it
          // with fetchPriority="high" also marks the <img> itself as high
          // priority. Omitting `loading` keeps it eager (never lazy).
          className="h-full w-full object-cover"
          fetchPriority="high"
          height={image.height ?? 900}
          preload
          sizes={HERO_SIZES}
          src={image.url}
          width={image.width ?? 1600}
        />
      </div>
      {image.caption ? (
        <figcaption className="flex flex-col justify-between gap-2 border-t border-line bg-surface p-3.5 text-meta text-ink-500 sm:flex-row sm:items-center">
          <span className="font-semibold text-ink-700">{image.caption}</span>
        </figcaption>
      ) : null}
    </figure>
  )
}
