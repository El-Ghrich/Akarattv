import React from 'react'

import { JsonLd } from '@/features/seo/components/JsonLd'
import { HomeIcon, MailCheckIcon } from '@/shared/ui/icons'
import {
  infoContact,
  infoContent,
  infoLastUpdated,
  infoUi,
  type InfoContact,
  type InfoPageSlug,
  type InfoSection,
  type InfoUi,
} from '@/features/info/content'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { breadcrumbJsonLd, infoPageJsonLd } from '@/features/seo/lib/seo'
import { infoPageHref } from '@/features/info/lib/infoPages'

export type InfoPageProps = {
  locale: Locale
  slug: InfoPageSlug
}

const Section = ({ section }: { section: InfoSection }) => (
  <section className="scroll-mt-24" id={section.id}>
    <h2 className="m-0 font-headline text-h3 font-bold text-green-900">{section.heading}</h2>

    <div className="mt-3 space-y-4">
      {section.paragraphs.map((paragraph) => (
        <p className="m-0 text-body-ui leading-[1.9] text-ink-700" key={paragraph}>
          {paragraph}
        </p>
      ))}

      {section.bullets?.length ? (
        <ul className="list-disc space-y-2 ps-5 text-body-ui leading-[1.9] text-ink-700">
          {section.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      ) : null}

      {section.note ? (
        <p className="m-0 rounded-card border border-gold-300 bg-gold-300/10 p-4 text-meta leading-relaxed text-ink-700">
          {section.note}
        </p>
      ) : null}
    </div>
  </section>
)

const ContactChannels = ({ contact, ui }: { contact: InfoContact; ui: InfoUi }) => (
  <ul className="flex list-none flex-col gap-2.5 p-0 text-meta text-ink-700">
    {contact.channels.map((channel) => (
      <li className="flex flex-col gap-0.5" key={channel.href}>
        <span className="font-bold text-green-900">{channel.label}</span>
        <a
          className="break-all transition-colors hover:text-green-700"
          href={channel.href}
          rel={channel.href.startsWith('http') ? 'noreferrer' : undefined}
          target={channel.href.startsWith('http') ? '_blank' : undefined}
        >
          {channel.value}
        </a>
      </li>
    ))}
    <li className="pt-1">
      <a
        className="inline-flex items-center gap-2 font-bold text-green-900 transition-colors hover:text-green-700"
        href={`mailto:${contact.email}?subject=${encodeURIComponent(contact.mailtoSubject)}`}
      >
        <MailCheckIcon className="h-4 w-4 text-gold-700" />
        {ui.emailUs}
      </a>
    </li>
  </ul>
)

const ContactForm = ({ contact }: { contact: InfoContact }) => {
  const form = contact.form

  return (
    <section className="scroll-mt-24 rounded-card border border-line bg-surface p-6" id="contact-form">
      <h2 className="m-0 font-headline text-h3 font-bold text-green-900">{form.title}</h2>
      <p className="mb-6 mt-2 text-meta leading-relaxed text-ink-500">{form.description}</p>

      <form action="#" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-meta font-bold text-ink-700">
          {form.nameLabel}
          <input
            className="rounded-card border border-line bg-canvas px-3 py-2.5 text-body-ui font-normal text-ink-900 outline-none focus:border-gold-500"
            name="name"
            placeholder={form.nameLabel}
            type="text"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-meta font-bold text-ink-700">
          {form.emailLabel}
          <input
            className="rounded-card border border-line bg-canvas px-3 py-2.5 text-body-ui font-normal text-ink-900 outline-none focus:border-gold-500"
            name="email"
            placeholder="name@example.com"
            type="email"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-meta font-bold text-ink-700 sm:col-span-2">
          {form.subjectLabel}
          <input
            className="rounded-card border border-line bg-canvas px-3 py-2.5 text-body-ui font-normal text-ink-900 outline-none focus:border-gold-500"
            name="subject"
            placeholder={form.subjectLabel}
            type="text"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-meta font-bold text-ink-700 sm:col-span-2">
          {form.messageLabel}
          <textarea
            className="min-h-32 rounded-card border border-line bg-canvas px-3 py-2.5 text-body-ui font-normal text-ink-900 outline-none focus:border-gold-500"
            name="message"
            placeholder={form.messageLabel}
            rows={5}
          />
        </label>

        <label className="flex items-start gap-2 text-meta font-normal leading-relaxed text-ink-700 sm:col-span-2">
          <input className="mt-1 accent-green-900" name="consent" type="checkbox" />
          <span>{form.consentLabel}</span>
        </label>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <button
            aria-disabled="true"
            className="inline-flex h-11 cursor-not-allowed items-center justify-center rounded-card bg-green-900 px-5 font-headline text-body-ui font-bold text-gold-300 opacity-60"
            disabled
            title={form.unavailableNote}
            type="button"
          >
            {form.submitLabel}
          </button>
          <p className="m-0 text-meta text-ink-500">{form.unavailableNote}</p>
        </div>
      </form>
    </section>
  )
}

export function InfoPage({ locale, slug }: InfoPageProps) {
  const content = infoContent[locale][slug]
  const ui = infoUi[locale]
  const contact = slug === 'contact' ? infoContact[locale] : null
  const path = infoPageHref(slug, locale)

  return (
    <main className="mx-auto w-full max-w-content flex-1 px-4 py-8 sm:px-6">
      <JsonLd
        data={[
          infoPageJsonLd({
            dateModified: infoLastUpdated,
            description: content.description,
            locale,
            path,
            title: content.title,
            type: content.jsonLdType,
          }),
          breadcrumbJsonLd([
            { name: ui.breadcrumbHome, path: `/${locale}` },
            { name: content.title, path },
          ]),
        ]}
      />

      <nav aria-label={ui.breadcrumbLabel} className="mb-8">
        <ol className="flex list-none flex-wrap items-center gap-2 p-0 font-semibold text-meta text-ink-500">
          <li>
            <Link
              className="flex items-center gap-1 transition-colors hover:text-green-900"
              href={ui.home}
              locale={locale}
            >
              <HomeIcon className="h-[17px] w-[17px]" />
              <span>{ui.breadcrumbHome}</span>
            </Link>
          </li>
          <li aria-hidden="true" className="text-ink-300">
            /
          </li>
          <li aria-current="page" className="text-ink-700">
            {content.title}
          </li>
        </ol>
      </nav>

      <header className="mb-10 border-b border-line pb-8">
        <p className="m-0 font-headline text-label font-bold uppercase tracking-[0.18em] text-gold-700">
          {content.eyebrow}
        </p>
        <h1 className="m-0 mt-3 font-headline text-h1 font-extrabold text-green-900">
          {content.title}
        </h1>
        <p className="mt-4 max-w-3xl text-body-article leading-relaxed text-ink-700">
          {content.intro}
        </p>
        <p className="m-0 mt-5 text-meta font-semibold text-ink-500">
          {ui.updatedLabel} {ui.updatedValue}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="flex flex-col gap-10 lg:col-span-8">
          {contact ? <ContactForm contact={contact} /> : null}

          {content.sections.map((section) => (
            <React.Fragment key={section.id}>
              <Section section={section} />
              {section.id === 'team' && content.team?.length ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {content.team.map((member) => (
                    <div className="rounded-card border border-line bg-surface p-5" key={member.name}>
                      <p className="m-0 font-headline text-card-title font-bold text-green-900">
                        {member.name}
                      </p>
                      <p className="m-0 mt-1 text-meta font-semibold text-gold-700">
                        {member.role}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </React.Fragment>
          ))}
        </div>

        <aside className="flex h-fit flex-col gap-5 lg:col-span-4 lg:sticky lg:top-6">
          <div className="rounded-card border border-line bg-surface p-5">
            <h2 className="m-0 font-headline text-h3 font-bold text-green-900">{ui.onThisPage}</h2>
            <ul className="mt-4 flex list-none flex-col gap-2.5 p-0 text-meta text-ink-700">
              {content.sections.map((section) => (
                <li key={section.id}>
                  <a className="transition-colors hover:text-green-900" href={`#${section.id}`}>
                    {section.heading}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {contact ? (
            <div className="rounded-card border border-line bg-surface p-5">
              <h2 className="m-0 font-headline text-h3 font-bold text-green-900">
                {ui.contactTitle}
              </h2>
              <div className="mt-4">
                <ContactChannels contact={contact} ui={ui} />
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </main>
  )
}

export default InfoPage
