import type { Locale } from '@/i18n/routing'

export type NotFoundSuggestion = {
  description: string
  href: string
  icon: 'about' | 'contact' | 'home' | 'sections'
  label: string
}

export type NotFoundContent = {
  availableIn: string
  codeLabel: string
  eyebrow: string
  helpText: string
  helpTitle: string
  home: string
  latest: string
  readInOther: string
  reportText: string
  suggestions: NotFoundSuggestion[]
  text: string
  title: string
  unavailableText: string
  unavailableTitle: string
}

export const notFoundContent: Record<Locale, NotFoundContent> = {
  ar: {
    availableIn: 'متوفرة بالفرنسية:',
    codeLabel: 'رمز الخطأ',
    eyebrow: 'مسار غير صالح',
    helpText: 'إذا كنت تعتقد أن هذا الرابط يجب أن يعمل، أخبر هيئة التحرير وسنتحقق منه.',
    helpTitle: 'هل وجدت رابطاً معطوباً؟',
    home: 'العودة إلى الرئيسية',
    latest: 'تصفح أحدث المقالات',
    readInOther: 'اقرأ بالفرنسية',
    reportText: 'راسلنا على akarattv1@gmail.com',
    suggestions: [
      {
        description: 'العودة إلى الصفحة الرئيسية لعقارات تيفي.',
        href: '/',
        icon: 'home',
        label: 'الرئيسية',
      },
      {
        description: 'تابع أحدث الأخبار والتحليلات العقارية.',
        href: '/#latest-news',
        icon: 'sections',
        label: 'أحدث المقالات',
      },
      {
        description: 'تعرّف على مهمتنا وفريق التحرير.',
        href: '/about',
        icon: 'about',
        label: 'من نحن',
      },
      {
        description: 'أرسل لنا ملاحظة أو طلب تصحيح.',
        href: '/contact',
        icon: 'contact',
        label: 'اتصل بنا',
      },
    ],
    text: 'ربما تم نقل الصفحة أو حذفها أو أن الرابط كُتب بشكل غير صحيح. لا تقلق، الطريق إلى المحتوى أقرب مما يبدو.',
    title: 'الصفحة غير موجودة',
    unavailableText: 'المقال موجود، لكن النسخة العربية لم تُنشر بعد.',
    unavailableTitle: 'النسخة العربية غير متوفرة',
  },
  fr: {
    availableIn: 'Disponible en arabe :',
    codeLabel: 'Code de l’erreur',
    eyebrow: 'Adresse invalide',
    helpText: 'Si vous pensez que ce lien devrait fonctionner, prévenez la rédaction ; nous vérifierons.',
    helpTitle: 'Un lien semble cassé ?',
    home: 'Retour à l’accueil',
    latest: 'Voir les derniers articles',
    readInOther: 'Lire en arabe',
    reportText: 'Écrivez-nous à akarattv1@gmail.com',
    suggestions: [
      {
        description: 'Revenir à la page d’accueil d’Akarat TV.',
        href: '/',
        icon: 'home',
        label: 'Accueil',
      },
      {
        description: 'Suivre les dernières actualités et analyses immobilières.',
        href: '/#latest-news',
        icon: 'sections',
        label: 'Derniers articles',
      },
      {
        description: 'Découvrir notre mission et notre équipe.',
        href: '/about',
        icon: 'about',
        label: 'Qui sommes-nous',
      },
      {
        description: 'Nous envoyer une remarque ou une demande de correction.',
        href: '/contact',
        icon: 'contact',
        label: 'Contact',
      },
    ],
    text: 'La page a peut-être été déplacée, supprimée, ou l’adresse comporte une erreur. Pas d’inquiétude : le contenu est plus proche qu’il n’y paraît.',
    title: 'Page introuvable',
    unavailableText: 'L’article existe, mais sa version française n’a pas encore été publiée.',
    unavailableTitle: 'Version française indisponible',
  },
}

export const localeFromPathname = (pathname: string | null): Locale =>
  pathname?.match(/^\/fr(?:\/|$)/) ? 'fr' : 'ar'
