import * as Sentry from '@sentry/nextjs'

const locale = document.documentElement.lang
const isArabic = locale === 'ar'

Sentry.init({
  dsn: 'https://6db9733dc2e317b7042772e63aeb5d1e@o4512474243465216.ingest.de.sentry.io/4512474261225552',
  integrations: [
    Sentry.feedbackIntegration({
      colorScheme: 'system',
      triggerLabel: isArabic ? 'إبلاغ عن مشكلة' : 'Signaler un problème',
      formTitle: isArabic ? 'إبلاغ عن مشكلة' : 'Signaler un problème',
      submitButtonLabel: isArabic ? 'إرسال البلاغ' : 'Envoyer',
      successMessageText: isArabic
        ? 'شكراً لك، تم إرسال بلاغك.'
        : 'Merci, votre signalement a été envoyé.',
    }),
  ],
  // 100% in development, 10% in production. Lower further if traffic grows.
  tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
