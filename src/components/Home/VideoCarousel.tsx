'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

export type VideoCardData = {
  durationLabel?: string
  href: string
  id: number
  thumbnailUrl: string
  title: string
  viewsLabel?: string
}

type VideoCarouselProps = {
  dir: 'ltr' | 'rtl'
  labels: {
    list: string
    next: string
    play: string
    previous: string
  }
  videos: VideoCardData[]
}

const Chevron = ({ direction }: { direction: 'left' | 'right' }) => (
  <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
    <path
      d={direction === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
    />
  </svg>
)

/**
 * Scroll-snap carousel. Native scrolling does the heavy lifting (touch, wheel,
 * keyboard), while the two buttons move one card at a time.
 *
 * RTL is handled explicitly rather than through CSS transforms: in a `dir=rtl`
 * scroll container `scrollLeft` runs negative, so the sign flips for "next".
 * The arrow glyphs and their positions are `start`/`end` logical values, so
 * the buttons stay on the correct side in both languages.
 */
export const VideoCarousel = ({ dir, labels, videos }: VideoCarouselProps) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canPrevious, setCanPrevious] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const update = useCallback(() => {
    const track = trackRef.current
    if (!track) return

    const max = track.scrollWidth - track.clientWidth
    const position = Math.abs(track.scrollLeft)

    setCanPrevious(position > 4)
    setCanNext(position < max - 4)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    update()
    track.addEventListener('scroll', update, { passive: true })

    const observer = new ResizeObserver(update)
    observer.observe(track)

    return () => {
      track.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [update])

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return

    const card = track.querySelector<HTMLElement>('[data-video-card]')
    // 24px matches the `gap-6` between cards.
    const amount = (card?.offsetWidth ?? track.clientWidth / 3) + 24
    const rtl = window.getComputedStyle(track).direction === 'rtl'
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    track.scrollBy({
      behavior: smooth ? 'smooth' : 'auto',
      left: direction * amount * (rtl ? -1 : 1),
    })
  }

  return (
    <div className="relative" dir={dir}>
      <div
        aria-label={labels.list}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        ref={trackRef}
        role="region"
        tabIndex={0}
      >
        {videos.map((video) => (
          <a
            aria-label={`${labels.play}: ${video.title}`}
            className="group flex w-[85%] shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_25px_rgba(0,0,0,0.18)] transition-transform duration-300 hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 sm:w-[calc((100%_-_1.5rem)/2)] lg:w-[calc((100%_-_3rem)/3)]"
            data-video-card
            href={video.href}
            key={video.id}
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-green-950">
              <Image
                alt=""
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 85vw"
                src={video.thumbnailUrl}
              />
              <div className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/15" />

              <span
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-black/35 text-white shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:border-green-950 group-hover:bg-green-950">
                  <svg className="ms-0.5 h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>

              {video.durationLabel ? (
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/95 px-3.5 py-1 font-headline text-label font-bold text-ink-900 shadow-md">
                  {video.durationLabel}
                </span>
              ) : null}
            </div>

            <div className="flex flex-1 flex-col justify-between p-5">
              <h3 className="m-0 line-clamp-2 font-headline text-base font-extrabold leading-snug text-ink-900 transition-colors group-hover:text-green-700">
                {video.title}
              </h3>
              {video.viewsLabel ? (
                <p className="m-0 mt-2 font-headline text-label font-semibold text-ink-500">
                  {video.viewsLabel}
                </p>
              ) : null}
            </div>
          </a>
        ))}
      </div>

      <button
        aria-label={labels.previous}
        className="absolute start-1 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-green-950/90 text-white shadow-xl backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-green-800 active:scale-95 disabled:pointer-events-none disabled:opacity-0"
        disabled={!canPrevious}
        onClick={() => scrollByCard(-1)}
        type="button"
      >
        <Chevron direction={dir === 'rtl' ? 'right' : 'left'} />
      </button>

      <button
        aria-label={labels.next}
        className="absolute end-1 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-green-950 shadow-xl transition-all duration-200 hover:scale-105 hover:bg-gold-400 active:scale-95 disabled:pointer-events-none disabled:opacity-0"
        disabled={!canNext}
        onClick={() => scrollByCard(1)}
        type="button"
      >
        <Chevron direction={dir === 'rtl' ? 'left' : 'right'} />
      </button>
    </div>
  )
}
