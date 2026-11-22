'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  retry,
}: {
  error: unknown
  retry: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <h2>حدث خطأ ما / Une erreur est survenue</h2>
        <button type="button" onClick={() => retry()}>
          إعادة المحاولة / Réessayer
        </button>
      </body>
    </html>
  )
}
