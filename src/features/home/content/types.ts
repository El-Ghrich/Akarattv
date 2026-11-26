import type { Locale } from '@/i18n/routing'

export type HomeLink = {
  /** Use the root href as-is instead of prefixing it with the active locale. */
  absolute?: boolean
  /** Present on grouped nav entries; each child is still a real archive route. */
  children?: HomeLink[]
  href: string
  label: string
}

export type HomeCard = {
  alt: string
  category: string
  cta?: string
  excerpt?: string
  href: string
  /**
   * Articles edited in Payload carry a ready R2 URL. Static editorial cards use
   * one of the Unsplash ids below instead.
   */
  imageSrc?: string
  imageId?: string
  meta: string
  title: string
}

export type HomeSection = {
  compact: HomeCard[]
  featured: HomeCard
  id: string
  title: string
  viewAll: HomeLink
}

export type HomeContent = {
  footer: {
    about: {
      links: HomeLink[]
      title: string
    }
    cookieSettings: string
    copyright: string
    description: string
    /** Column titles; the links come from Payload. */
    policies: {
      links: HomeLink[]
      title: string
    }
    regionsTitle: string
    sectionsTitle: string
    social: HomeLink[]
    tagline: string
  }
  header: {
    homeLabel: string
    marketIndex: string
    marketLabel: string
    menu: string
    nav: HomeLink[]
    newsletter: string
    search: string
    siteName: string
  }
  hero: {
    alt: string
    badges: string[]
    description: string
    imageId: string
    titleAccent: string
    titleAfter: string
  }
  heroZone: {
    featured: HomeCard
    sidebar: {
      items: HomeCard[]
      title: string
      updated: string
    }
  }
  latest: {
    items: HomeCard[]
    title: string
    viewAll: HomeLink
  }
  newsletter: {
    button: string
    description: string
    emailLabel: string
    placeholder: string
    privacy: string
    title: string
  }
  regions: {
    description: string
    items: HomeLink[]
    title: string
  }
  sections: HomeSection[]
  videos: {
    subtitle: string
    title: string
  }
}
