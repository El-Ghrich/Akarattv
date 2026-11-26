import { MailCheckIcon } from '@/shared/ui/icons'
import type { ArticleContent } from '@/features/articles/content/article'

export function ArticleNewsletter({ content }: { content: ArticleContent }) {
  return (
    <section
      aria-labelledby="article-newsletter-title"
      className="pattern-architectural relative my-14 overflow-hidden rounded-card border border-gold-500/30 bg-green-900 p-8 text-white shadow-md sm:p-10"
      id="newsletter-block"
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <MailCheckIcon className="mb-2 h-8 w-8 text-gold-400" />
        <h2
          className="m-0 mb-2 font-headline text-h2 font-extrabold text-white"
          id="article-newsletter-title"
        >
          {content.newsletter.title}
        </h2>
        <p className="m-0 mb-6 max-w-lg text-body-ui leading-relaxed text-gold-300">
          {content.newsletter.description}
        </p>

        <form
          action="#newsletter-block"
          className="flex w-full max-w-xl flex-col gap-3 sm:flex-row"
        >
          <input
            aria-label={content.newsletter.emailLabel}
            className="h-12 flex-1 rounded-card border border-line bg-surface px-4 text-body-ui text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
            placeholder={content.newsletter.placeholder}
            required
            type="email"
          />
          <button
            className="h-12 whitespace-nowrap rounded-card bg-gold-500 px-8 font-headline text-body-ui font-bold text-green-950 shadow-sm transition-colors hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-green-900"
            type="submit"
          >
            {content.newsletter.button}
          </button>
        </form>
      </div>
    </section>
  )
}
