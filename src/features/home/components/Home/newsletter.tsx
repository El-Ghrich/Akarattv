import { MailCheckIcon, ShieldCheckIcon } from '@/shared/ui/icons'
import type { HomeContent } from '@/features/home/content'

export const NewsletterBand = ({ content }: { content: HomeContent }) => (
  <section
    aria-labelledby="newsletter-title"
    className="relative overflow-hidden rounded-card border border-gold-500/20 bg-green-900 p-8 text-white shadow-md sm:p-12"
    id="newsletter-section"
  >
    <div
      aria-hidden="true"
      className="newsletter-backdrop pointer-events-none absolute inset-0"
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-gradient-to-br from-green-950/55 via-green-900/45 to-green-900/35"
    />

    <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gold-500/40 bg-green-800 text-gold-400">
        <MailCheckIcon className="h-6 w-6" />
      </div>

      <h2
        className="m-0 mb-2 font-headline text-h1 font-extrabold text-white"
        id="newsletter-title"
      >
        {content.newsletter.title}
      </h2>

      <p className="m-0 mb-8 max-w-xl text-body-article leading-relaxed text-gold-300">
        {content.newsletter.description}
      </p>

      <form action="#newsletter-section" className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <input
            aria-label={content.newsletter.emailLabel}
            className="h-12 w-full rounded-card border border-line bg-surface px-4 text-body-ui text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
            placeholder={content.newsletter.placeholder}
            type="email"
          />
        </div>
        <button
          className="h-12 whitespace-nowrap rounded-card bg-gold-500 px-8 font-headline text-body-ui font-bold text-green-950 shadow-sm transition-colors hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-green-900"
          type="submit"
        >
          {content.newsletter.button}
        </button>
      </form>

      <p className="m-0 mt-4 flex items-center gap-2 text-meta text-ink-300">
        <ShieldCheckIcon className="h-[15px] w-[15px] text-gold-400" />
        <span>{content.newsletter.privacy}</span>
      </p>
    </div>
  </section>
)
