import React from 'react'

/**
 * Renders structured data (`application/ld+json`).
 *
 * `<` is escaped because a title or excerpt containing `</script>` would
 * otherwise close the tag early. JSON.stringify already escapes quotes, so the
 * remaining escape makes the payload safe inside a `<script>` element.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
