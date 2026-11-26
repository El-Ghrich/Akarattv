import type { Locale } from '@/i18n/routing'

import type { InfoContact } from './types'

const contactEmail = 'akarattv1@gmail.com'

export const infoContact: Record<Locale, InfoContact> = {
  ar: {
    channels: [
      {
        href: `mailto:${contactEmail}`,
        label: 'البريد الإلكتروني',
        value: contactEmail,
      },
      {
        href: 'https://www.youtube.com/@AkaratTv',
        label: 'YouTube',
        value: '@AkaratTv',
      },
      {
        href: 'https://www.facebook.com/Akarat.tv',
        label: 'Facebook',
        value: 'Akarat.tv',
      },
      {
        href: 'https://www.instagram.com/akarattv',
        label: 'Instagram',
        value: '@akarattv',
      },
    ],
    email: contactEmail,
    form: {
      consentLabel: 'أوافق على استخدام معلوماتي للرد على رسالتي.',
      description:
        'هذا نموذج تجريبي؛ سيُفعّل الإرسال عند ربط المنصة بخدمة بريدية. يمكنك استخدام البريد الإلكتروني أدناه مباشرة.',
      emailLabel: 'البريد الإلكتروني',
      messageLabel: 'الرسالة',
      nameLabel: 'الاسم',
      subjectLabel: 'الموضوع',
      submitLabel: 'إرسال الرسالة',
      title: 'أرسل رسالة إلى هيئة التحرير',
      unavailableNote: 'الإرسال عبر النموذج غير مفعّل حالياً',
    },
    mailtoSubject: 'رسالة من موقع عقارات تيفي',
  },
  fr: {
    channels: [
      {
        href: `mailto:${contactEmail}`,
        label: 'Courriel',
        value: contactEmail,
      },
      {
        href: 'https://www.youtube.com/@AkaratTv',
        label: 'YouTube',
        value: '@AkaratTv',
      },
      {
        href: 'https://www.facebook.com/Akarat.tv',
        label: 'Facebook',
        value: 'Akarat.tv',
      },
      {
        href: 'https://www.instagram.com/akarattv',
        label: 'Instagram',
        value: '@akarattv',
      },
    ],
    email: contactEmail,
    form: {
      consentLabel: 'J’accepte que mes informations soient utilisées pour répondre à mon message.',
      description:
        'Ce formulaire est une maquette ; l’envoi sera activé lorsque la plateforme sera reliée à un service de messagerie. Vous pouvez écrire directement à l’adresse ci-dessous.',
      emailLabel: 'Adresse électronique',
      messageLabel: 'Message',
      nameLabel: 'Nom',
      subjectLabel: 'Objet',
      submitLabel: 'Envoyer le message',
      title: 'Écrire à la rédaction',
      unavailableNote: 'L’envoi via le formulaire n’est pas encore activé',
    },
    mailtoSubject: 'Message depuis le site Akarat TV',
  },
}
