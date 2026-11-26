import type { Locale } from '@/i18n/routing'

export type ArticleContent = {
  breadcrumb: {
    home: string
    label: string
  }
  draft: string
  latest: {
    more: string
    title: string
  }
  meta: {
    published: string
    reading: (minutes: number) => string
    updated: string
  }
  newsletter: {
    button: string
    description: string
    emailLabel: string
    placeholder: string
    title: string
  }
  related: {
    more: string
    read: string
    title: string
  }
  share: {
    bottom: string
    copied: string
    copy: string
    facebook: string
    linkedin: string
    top: string
    whatsapp: string
    x: string
  }
  toc: string
}

const ar: ArticleContent = {
  breadcrumb: {
    home: 'الرئيسية',
    label: 'مسار التصفح',
  },
  draft: 'معاينة المسودة',
  latest: {
    more: 'المزيد',
    title: 'آخر الأخبار',
  },
  meta: {
    published: 'نُشر',
    reading: (minutes) => `قراءة: ${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`,
    updated: 'آخر تحديث',
  },
  newsletter: {
    button: 'اشترك الآن',
    description:
      'انضم لنخبة المستثمرين والمهتمين بالشأن العقاري وتوصل بملخص أسبوعي موثوق ومجاني.',
    emailLabel: 'البريد الإلكتروني',
    placeholder: 'أدخل بريدك الإلكتروني المهني...',
    title: 'لا تفوّت أي تحديث في القوانين وأسعار العقار',
  },
  related: {
    more: 'المزيد من أخبار السوق',
    read: 'اقرأ المقال',
    title: 'مقالات ذات صلة',
  },
  share: {
    bottom: 'هل وجدت هذا التقرير مفيداً؟ شاركه الآن:',
    copied: 'تم نسخ الرابط',
    copy: 'نسخ الرابط',
    facebook: 'مشاركة عبر فيسبوك',
    linkedin: 'مشاركة عبر لينكد إن',
    top: 'شارك التحليل:',
    whatsapp: 'مشاركة عبر واتساب',
    x: 'مشاركة عبر إكس',
  },
  toc: 'محتويات المقال',
}

const fr: ArticleContent = {
  breadcrumb: {
    home: 'Accueil',
    label: "Fil d'Ariane",
  },
  draft: 'Aperçu du brouillon',
  latest: {
    more: 'Plus',
    title: 'Dernières actualités',
  },
  meta: {
    published: 'Publié',
    reading: (minutes) => `Lecture : ${minutes} min`,
    updated: 'Dernière mise à jour',
  },
  newsletter: {
    button: "S'abonner",
    description:
      "Rejoignez les investisseurs et les passionnés d'immobilier et recevez chaque semaine un résumé fiable et gratuit.",
    emailLabel: 'Adresse e-mail',
    placeholder: 'Saisissez votre e-mail professionnel...',
    title: 'Ne manquez aucune évolution des lois et des prix immobiliers',
  },
  related: {
    more: "Plus d'actualités du marché",
    read: "Lire l'article",
    title: 'Articles similaires',
  },
  share: {
    bottom: 'Cet article vous a-t-il été utile ? Partagez-le :',
    copied: 'Lien copié',
    copy: 'Copier le lien',
    facebook: 'Partager sur Facebook',
    linkedin: 'Partager sur LinkedIn',
    top: "Partagez l'analyse :",
    whatsapp: 'Partager sur WhatsApp',
    x: 'Partager sur X',
  },
  toc: "Sommaire de l'article",
}

export const articleContent: Record<Locale, ArticleContent> = { ar, fr }
