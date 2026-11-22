import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://6db9733dc2e317b7042772e63aeb5d1e@o4512474243465216.ingest.de.sentry.io/4512474261225552',
  // Logs are enabled by default; use `Sentry.logger.*` to emit them.
  // 100% in development, 10% in production.
  tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,
})
