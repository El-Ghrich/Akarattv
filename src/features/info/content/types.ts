export const infoPageSlugs = [
  'about',
  'contact',
  'privacy',
  'terms',
  'editorial-policy',
] as const

export type InfoPageSlug = (typeof infoPageSlugs)[number]

export const infoLastUpdated = '2026-11-22'

export type InfoSection = {
  bullets?: string[]
  id: string
  heading: string
  note?: string
  paragraphs: string[]
}

export type InfoTeamMember = {
  name: string
  role: string
}

export type InfoContactChannel = {
  href: string
  label: string
  value: string
}

export type InfoContactForm = {
  consentLabel: string
  description: string
  emailLabel: string
  messageLabel: string
  nameLabel: string
  subjectLabel: string
  submitLabel: string
  title: string
  unavailableNote: string
}

export type InfoContact = {
  channels: InfoContactChannel[]
  email: string
  form: InfoContactForm
  mailtoSubject: string
}

export type InfoPageContent = {
  description: string
  eyebrow: string
  intro: string
  jsonLdType: 'AboutPage' | 'ContactPage' | 'WebPage'
  sections: InfoSection[]
  team?: InfoTeamMember[]
  title: string
}

export type InfoUi = {
  breadcrumbHome: string
  breadcrumbLabel: string
  contactTitle: string
  emailUs: string
  home: string
  onThisPage: string
  updatedLabel: string
  updatedValue: string
  visit: string
}
