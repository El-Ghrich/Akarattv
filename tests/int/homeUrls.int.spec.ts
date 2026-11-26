import { describe, expect, it } from 'vitest'

import { cardImageUrl, unsplashUrl } from '@/features/home/content/urls'
import { homeFallbackImageId, images } from '@/features/home/content/images'

describe('unsplashUrl', () => {
  it('builds a cropped image URL with the requested width', () => {
    expect(unsplashUrl('photo-123', 800)).toBe(
      'https://images.unsplash.com/photo-123?auto=format&fit=crop&w=800&q=80',
    )
  })

  it('does not validate the width', () => {
    expect(unsplashUrl('id', 0)).toContain('w=0')
  })
})

describe('cardImageUrl', () => {
  it('prefers a CMS image source', () => {
    expect(cardImageUrl({ imageSrc: 'https://r2.example/image.jpg', imageId: 'photo-123' }, 640)).toBe(
      'https://r2.example/image.jpg',
    )
  })

  it('uses the card image id when no source is set', () => {
    expect(cardImageUrl({ imageSrc: undefined, imageId: 'photo-123' }, 640)).toBe(
      unsplashUrl('photo-123', 640),
    )
  })

  it('falls back to the shared city image', () => {
    expect(homeFallbackImageId).toBe(images.city)
    expect(cardImageUrl({ imageSrc: undefined, imageId: undefined }, 320)).toBe(
      unsplashUrl(homeFallbackImageId, 320),
    )
  })

  it('keeps an empty source rather than silently falling back', () => {
    expect(cardImageUrl({ imageSrc: '', imageId: 'photo-123' }, 640)).toBe('')
  })
})
