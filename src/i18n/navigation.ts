import { createNavigation } from 'next-intl/navigation'

import { routing } from './routing'

/**
 * Locale-aware wrappers around Next's navigation APIs. `href` values stay
 * unprefixed (`/articles/slug`); the active `locale` is added automatically.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
