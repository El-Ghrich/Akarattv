import { images } from '../images'
import type { HomeContent } from '../types'

export const arSections: HomeContent['sections'] = [
  {
    compact: [
      {
        alt: 'مؤشر الإيجارات',
        category: 'الإيجار التجاري',
        href: '#market',
        imageId: images.officeRent,
        meta: '10 نونبر 2026',
        title: 'مؤشر الإيجارات المكتبية يسجل استقراراً في منطقة أنفا سيتي',
      },
      {
        alt: 'سوق البناء',
        category: 'مواد البناء',
        href: '#market',
        imageId: images.construction,
        meta: '09 نونبر 2026',
        title: 'تراجع أسعار الإسمنت والحديد يدعم وتيرة إنجاز المشاريع المتوسطة',
      },
      {
        alt: 'رياضات مراكش',
        category: 'العقار العتيق',
        href: '#market',
        imageId: images.riad,
        meta: '08 نونبر 2026',
        title: 'مراكش تسجل طلباً قياسياً على الرياضات التقليدية المحولة لدور ضيافة',
      },
    ],
    featured: {
      alt: 'تحليلات السوق العقاري',
      category: 'تحليل حصري',
      cta: 'تابع قراءة التقرير',
      excerpt:
        'قراءة متأنية في الأرقام الصادرة عن المحافظة العقارية ومؤشرات المعاملات السكنية والتجارية، مع رصد لتطور كلفة المتر المربع في مختلف الأحياء الراقية والمتوسطة بالدار البيضاء والرباط ومراكش.',
      href: '#market',
      imageId: images.city,
      meta: 'منذ يومين • إعداد وحدة التحليلات',
      title: 'خريطة العرض والطلب العقاري في المدن الكبرى: أين تتجه بوصلة الأسعار خلال 2027؟',
    },
    id: 'market',
    title: 'أخبار السوق العقاري',
    viewAll: { href: '#market', label: 'عرض كافة تحليلات السوق' },
  },
  {
    compact: [
      {
        alt: 'برج الرياض',
        category: 'أبراج إدارية',
        href: '#projects',
        imageId: images.tower,
        meta: '10 نونبر 2026',
        title: 'تسليم البرج الإداري الأخضر بحي الرياض بالعاصمة الرباط',
      },
      {
        alt: 'كورنيش طنجة',
        category: 'تطوير ساحلي',
        href: '#projects',
        imageId: images.coast,
        meta: '07 نونبر 2026',
        title: 'كورنيش طنجة الجديد يستعد لافتتاح المجمع الترفيهي والتجاري',
      },
      {
        alt: 'تغازوت باي',
        category: 'منتجعات سكنية',
        href: '#projects',
        imageId: images.resort,
        meta: '05 نونبر 2026',
        title: 'إطلاق إقامات "أوشن باي" الفندقية في محطة تغازوت السياحية',
      },
    ],
    featured: {
      alt: 'المشاريع الحضرية الذكية',
      category: 'مشروع استراتيجي',
      cta: 'استكشف المخطط الهندسي',
      excerpt:
        'القطب الحضري الجديد يوفر أكثر من 4,200 وحدة سكنية متطورة بمواصفات البناء المستدام ومساحات خضراء تفوق 30% من المساحة الإجمالية للمشروع.',
      href: '#projects',
      imageId: images.project,
      meta: 'منذ 3 أيام • تغطية ميدانية',
      title:
        'مدينة "زناتة البيئية": تدشين الشطر السكني الثالث بنظام تدبير ذكي للطاقة والمياه',
    },
    id: 'projects',
    title: 'المشاريع العقارية والتطوير',
    viewAll: { href: '#projects', label: 'عرض كافة المشاريع' },
  },
  {
    compact: [
      {
        alt: 'المكاتب المشتركة',
        category: 'عوائد الأصول',
        href: '#investment',
        imageId: images.interiorTwo,
        meta: '10 نونبر 2026',
        title: 'مقارنة العوائد: المكاتب الإدارية الذكية مقابل الشقق المفروشة',
      },
      {
        alt: 'العقار اللوجستي',
        category: 'العقار اللوجستي',
        href: '#investment',
        imageId: images.logistics,
        meta: '08 نونبر 2026',
        title: 'المستودعات اللوجستية المتطورة تسجل عائداً صافياً يفوق 9.2%',
      },
      {
        alt: 'استثمارات الجالية',
        category: 'مغاربة العالم',
        href: '#investment',
        imageId: images.interiorThree,
        meta: '06 نونبر 2026',
        title: 'دليل الاستفادة من التحفيزات الجبائية المخصصة لمغاربة العالم',
      },
    ],
    featured: {
      alt: 'صناديق الاستثمار العقاري',
      category: 'صناديق OPCI',
      cta: 'قراءة المؤشرات المالية',
      excerpt:
        'تسارع ملحوظ في إقبال الشركات الكبرى والمؤسسات التأمينية على تسييل أصولها الحجرية وتحويلها إلى أدوات مالية ذات عوائد نقدية منتظمة ومخاطر محسوبة.',
      href: '#investment',
      imageId: images.interior,
      meta: 'منذ 4 أيام • دراسة مالية',
      title: 'أصول صناديق الاستثمار العقاري (OPCI) تتجاوز حاجز 90 مليار درهم بالمغرب',
    },
    id: 'investment',
    title: 'الاستثمار والصناديق العقارية',
    viewAll: { href: '#investment', label: 'عرض تحليلات الاستثمار' },
  },
]
