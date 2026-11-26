import type { Locale } from '@/i18n/routing'

export type ConsentContent = {
  banner: {
    accept: string
    description: string
    privacyLabel: string
    reject: string
    settings: string
    title: string
  }
  footerSettings: string
  preferences: {
    accept: string
    analyticsDescription: string
    analyticsTitle: string
    close: string
    essentialDescription: string
    essentialTitle: string
    reject: string
    save: string
    statusDenied: string
    statusGranted: string
    title: string
  }
}

export const consentContent: Record<Locale, ConsentContent> = {
  ar: {
    banner: {
      accept: 'قبول الكوكيز',
      description:
        'نستخدم كوكيز للتحليلات لقياس الزيارات. تُفعّل بعد موافقتك، وإذا رفضت تُرسل إحصاءات دون كوكيز إلى Google.',
      privacyLabel: 'سياسة الخصوصية',
      reject: 'رفض الكوكيز',
      settings: 'الإعدادات',
      title: 'ملفات تعريف الارتباط',
    },
    footerSettings: 'إعدادات ملفات تعريف الارتباط',
    preferences: {
      accept: 'قبول الكوكيز',
      analyticsDescription:
        'تساعدنا على معرفة الصفحات الأكثر قراءة ومصدر الزيارات. لا تُحفظ الكوكيز قبل موافقتك؛ وإذا رفضت تُرسل إشارات قياس دون معرّفات تتبع ويمكن سحب الموافقة في أي وقت.',
      analyticsTitle: 'كوكيز التحليلات (Google Analytics 4)',
      close: 'إغلاق',
      essentialDescription:
        'مطلوبة لتشغيل الموقع، حفظ اللغة، وأمان الجلسة. تعمل دائماً ولا يمكن تعطيلها.',
      essentialTitle: 'ملفات ضرورية',
      reject: 'رفض الكوكيز',
      save: 'حفظ التفضيلات',
      statusDenied: 'غير مفعّلة',
      statusGranted: 'مفعّلة',
      title: 'إعدادات ملفات تعريف الارتباط',
    },
  },
  fr: {
    banner: {
      accept: 'Accepter les témoins',
      description:
        'Nous utilisons des témoins d’analyse pour mesurer l’audience. Ils ne sont déposés qu’après votre accord ; en cas de refus, des mesures sans témoins sont envoyées à Google.',
      privacyLabel: 'Politique de confidentialité',
      reject: 'Refuser les témoins',
      settings: 'Paramètres',
      title: 'Témoins de navigation',
    },
    footerSettings: 'Paramètres des témoins',
    preferences: {
      accept: 'Accepter les témoins',
      analyticsDescription:
        'Ils nous aident à savoir quelles pages sont les plus lues et d’où viennent les visites. Aucun témoin n’est déposé avant votre accord ; en cas de refus, Google reçoit des mesures sans identifiant de suivi. Retirables à tout moment.',
      analyticsTitle: 'Témoins d’analyse (Google Analytics 4)',
      close: 'Fermer',
      essentialDescription:
        'Nécessaires au fonctionnement du site, à la gestion de la langue et à la sécurité de la session. Ils sont toujours actifs et ne peuvent pas être désactivés.',
      essentialTitle: 'Témoins essentiels',
      reject: 'Refuser les témoins',
      save: 'Enregistrer les préférences',
      statusDenied: 'Désactivés',
      statusGranted: 'Activés',
      title: 'Paramètres des témoins',
    },
  },
}
