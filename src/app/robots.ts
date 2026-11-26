import type { MetadataRoute } from 'next'

import { absoluteURL } from '@/features/seo/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/payload-jobs'],
      },
    ],
    sitemap: [absoluteURL('/sitemap.xml'), absoluteURL('/news-sitemap.xml')],
  }
}
