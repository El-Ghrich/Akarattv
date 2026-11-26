import type { Locale } from '@/i18n/routing'

import type { InfoUi } from './types'

export const infoUi: Record<Locale, InfoUi> = {
  ar: {
    breadcrumbHome: 'الرئيسية',
    breadcrumbLabel: 'مسار التصفح',
    contactTitle: 'تواصل معنا',
    emailUs: 'أرسل رسالة',
    home: '/',
    onThisPage: 'في هذه الصفحة',
    updatedLabel: 'آخر تحديث:',
    updatedValue: '22 نونبر 2026',
    visit: 'زيارة الحساب',
  },
  fr: {
    breadcrumbHome: 'Accueil',
    breadcrumbLabel: 'Fil d’Ariane',
    contactTitle: 'Nous contacter',
    emailUs: 'Écrivez-nous',
    home: '/',
    onThisPage: 'Sur cette page',
    updatedLabel: 'Dernière mise à jour :',
    updatedValue: '22 novembre 2026',
    visit: 'Visiter le profil',
  },
}
