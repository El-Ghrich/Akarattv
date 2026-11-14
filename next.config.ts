import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

/**
 * Host of the public R2 origin. `r2.dev` hostnames are per bucket and cannot be
 * wildcarded, so it has to be read from the environment rather than hard-coded.
 * When the custom domain is connected later, only R2_PUBLIC_URL changes here.
 */
let mediaHost: string | undefined

try {
  mediaHost = process.env.R2_PUBLIC_URL ? new URL(process.env.R2_PUBLIC_URL).hostname : undefined
} catch {
  mediaHost = undefined
}

const nextConfig: NextConfig = {
  images: {
    /**
     * Only the widths that exist as real objects in the bucket. Next's defaults
     * go up to 3840, which would make it request variants we never generate.
     */
    deviceSizes: [400, 800, 1200, 1600],
    // Fixed-size images (the 48px author avatar) pick from here.
    imageSizes: [48, 96, 128, 256, 384],
    // The optimizer prefers AVIF, then WebP, before falling back to the source.
    formats: ['image/avif', 'image/webp'],
    /**
     * R2 objects are immutable: a new upload is a new key, so a cached byte
     * range never goes stale. Next caps the browser cache at this value, which
     * is what buys us year-long caching while the media lives on `r2.dev`
     * (that origin accepts no Cache-Control of its own yet).
     */
    minimumCacheTTL: 31536000,
    remotePatterns: [
      ...(mediaHost
        ? [
            {
              protocol: 'https' as const,
              hostname: mediaHost,
              pathname: '/**',
            },
          ]
        : []),
      {
        protocol: 'https' as const,
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // YouTube thumbnails for the homepage video section.
      {
        protocol: 'https' as const,
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https' as const,
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
    ],
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      {
        pathname: '/logo.png',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
  /**
   * The `opengraph-image` routes read the self-hosted Cairo file from
   * `src/fonts` at runtime. Tracing usually detects `readFile(join(...))`, but
   * a serverless bundle is unforgiving, so the font is included explicitly.
   */
  outputFileTracingIncludes: {
    '/**/opengraph-image': ['./src/fonts/*.ttf'],
  },
}

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })
