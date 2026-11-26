import { images } from '../images'
import type { HomeContent } from '../types'

export const arCore: Pick<
  HomeContent,
  'footer' | 'regions' | 'header' | 'hero' | 'heroZone' | 'latest' | 'videos'
> = {
  footer: {
    about: {
      links: [
        { href: '/about', label: 'من نحن ومهمتنا' },
        { href: '/about#team', label: 'الفريق وهيئة التحرير' },
        { href: '/editorial-policy', label: 'ميثاق الشرف الصحفي' },
        { href: '/contact#advertising', label: 'الإعلان والرعايات' },
        { href: '/contact#careers', label: 'الوظائف والفرص' },
      ],
      title: 'عن المنصة',
    },
    cookieSettings: 'إعدادات ملفات تعريف الارتباط',
    copyright: 'جميع الحقوق محفوظة © 2026 منصة "عقارات تيفي" (Akarat TV).',
    description:
      'المنصة الإخبارية المستقلة الأولى المتخصصة في تغطية وتحليل أسواق العقار، التمويل، والتشريعات الاستثمارية في المغرب والعالم العربي برؤية مهنية رصينة.',
    policies: {
      links: [
        { href: '/contact', label: 'اتصل بهيئة التحرير' },
        { href: '/privacy', label: 'سياسة الخصوصية' },
        { href: '/terms', label: 'شروط الاستخدام' },
        { href: '/terms#financial-disclaimer', label: 'إخلاء المسؤولية المالية' },
        { absolute: true, href: '/sitemap.xml', label: 'خريطة الموقع' },
      ],
      title: 'السياسات والاتصال',
    },
    regionsTitle: 'المناطق',
    sectionsTitle: 'الأقسام الإخبارية',
    social: [
      { href: 'https://www.youtube.com/@AkaratTv', label: 'YouTube' },
      { href: 'https://www.facebook.com/Akarat.tv', label: 'Facebook' },
      { href: 'https://www.instagram.com/akarattv', label: 'Instagram' },
    ],
    tagline: 'تصميم تحريري رصين وموثوق',
  },
  regions: {
    description: 'اختر جهتك للاطلاع على أحدث الصفقات، المشاريع، والتحليلات المحلية.',
    items: [
      { href: '/regions/casablanca-settat', label: 'الدار البيضاء - سطات' },
      { href: '/regions/rabat-sale-kenitra', label: 'الرباط - سلا - القنيطرة' },
      { href: '/regions/marrakech-safi', label: 'مراكش - أسفي' },
      { href: '/regions/tanger-tetouan-al-hoceima', label: 'طنجة - تطوان - الحسيمة' },
      { href: '/regions/fes-meknes', label: 'فاس - مكناس' },
      { href: '/regions/souss-massa', label: 'سوس - ماسة' },
    ],
    title: 'تصفح حسب الجهة',
  },
  header: {
    homeLabel: 'الصفحة الرئيسية لعقارات تيفي',
    marketIndex: '+1.24%',
    marketLabel: 'مؤشر البورصة العقارية:',
    menu: 'القائمة',
    nav: [
      { href: '#market', label: 'أخبار السوق' },
      { href: '#latest-news', label: 'القوانين والتشريعات' },
      { href: '#projects', label: 'المشاريع العقارية' },
      { href: '#investment', label: 'الاستثمار' },
      { href: '#latest-news', label: 'التمويل والرهن' },
      { href: '#latest-news', label: 'نصائح وأدلة' },
      { href: '#latest-news', label: 'حوارات' },
    ],
    newsletter: 'اشترك في النشرة',
    search: 'بحث',
    siteName: 'عقارات تيفي',
  },
  hero: {
    alt: 'المعمار العقاري الحديث في المغرب',
    badges: ['تحديث مستمر على مدار الساعة', 'مؤشرات أسواق 12 جهة'],
    description:
      'تغطية يومية، تحليلات معمقة وتتبع لمشاريع التطوير الكبرى وأحدث القوانين والتشريعات العقارية والمالية بعيون نخبة من الخبراء والصحفيين المتخصصين.',
    imageId: images.banner,
    titleAccent: 'عقارات تيفي',
    titleAfter: 'أول صحيفة إلكترونية متخصصة في أخبار العقار في المغرب',
  },
  heroZone: {
    featured: {
      alt: 'الأبراج المالية في الدار البيضاء',
      category: 'أخبار السوق',
      cta: 'قراءة التقرير الكامل',
      excerpt:
        'كشف التقرير الفصلي للهيئة الوطنية للتقييم العقاري عن انتعاش لافت في الطلب على العقارات المكتبية والسكنية الفاخرة، مدفوعاً بتدفق رؤوس الأموال المؤسساتية الدولية.',
      href: '#latest-news',
      imageId: images.casablanca,
      meta: 'منذ ساعتين • قراءة: 5 دقائق • بقلم: رضوان المرابط',
      title:
        'مؤشرات الربع الأخير: قفزة بنسبة 18% في حجم الصفقات العقارية الكبرى بالدار البيضاء',
    },
    sidebar: {
      items: [
        {
          alt: 'فيلات مراكش',
          category: 'المشاريع العقارية',
          href: '#projects',
          imageId: images.marrakech,
          meta: 'منذ 35 دقيقة',
          title: 'طرح مرحلة ثانية من المجمعات السكنية البيئية بضواحي مراكش',
        },
        {
          alt: 'ميناء طنجة',
          category: 'الاستثمار',
          href: '#investment',
          imageId: images.tanger,
          meta: 'منذ ساعة واحدة',
          title: 'شراكات استثمارية أجنبية لتطوير الواجهة البحرية واللوجستية بطنجة',
        },
        {
          alt: 'أشغال بناء وتطوير',
          category: 'القوانين والتشريعات',
          href: '#latest-news',
          imageId: images.work,
          meta: 'منذ 3 ساعات',
          title: 'قانون البناء الأخضر الجديد: المعايير الإلزامية للمشاريع الكبرى بدءاً من 2027',
        },
      ],
      title: 'أحدث العناوين',
      updated: 'تحديث مستمر',
    },
  },
  latest: {
    items: [
      {
        alt: 'المجمعات السكنية في الرباط',
        category: 'أخبار السوق',
        cta: 'اقرأ المقال',
        excerpt:
          'أظهرت المؤشرات العقارية نصف السنوية حفاظ الأسعار على توازنها في الأحياء المركزية، مع نشاط ملحوظ في مناطق التوسع الحضري.',
        href: '#market',
        imageId: images.rabat,
        meta: 'منذ 4 ساعات',
        title:
          'تقرير رسمي: استقرار أسعار الشقق السكنية في العاصمة الرباط مع ارتفاع الطلب على الإيجار',
      },
      {
        alt: 'التمويل والرهن العقاري',
        category: 'التمويل والرهن',
        cta: 'اقرأ المقال',
        excerpt:
          'البنوك التشاركية والتجارية تطلق حزمة جديدة من عروض المرابحة والقروض الثابتة بنسب تمويل تغطي حتى 95% من قيمة الأصل.',
        href: '#latest-news',
        imageId: images.finance,
        meta: 'منذ 6 ساعات',
        title:
          'تسهيلات بنكية تفضيلية للمقترضين الشباب في إطار البرامج الوطنية لدعم السكن',
      },
      {
        alt: 'عقارات فاخرة وفيلات',
        category: 'المشاريع العقارية',
        cta: 'اقرأ المقال',
        excerpt:
          'ارتفاع قياسي في الطلب على العقارات الساحلية ذات الإدارة الفندقية المدمجة مع عوائد إيجارية سنوية تصل إلى 8.5%.',
        href: '#projects',
        imageId: images.villa,
        meta: 'منذ 7 ساعات',
        title: 'ازدهار سياحة المنتجعات السكنية في أكادير وتغازوت يجذب مستثمرين من شمال أوروبا',
      },
      {
        alt: 'مكاتب عقارية تجارية',
        category: 'نصائح وأدلة',
        cta: 'اقرأ المقال',
        excerpt:
          'أهم البنود القانونية التي يجب الانتباه إليها في عقود الإيجار طويل الأجل لحماية السيولة والمرونة التشغيلية.',
        href: '#latest-news',
        imageId: images.office,
        meta: 'أمس',
        title:
          'دليل الشركات الناشئة لاختيار المقرات الإدارية المرنة وتفاوض عقود الإيجار التجارية',
      },
    ],
    title: 'آخر الأخبار',
    viewAll: { href: '#latest-news', label: 'عرض الكل' },
  },
  videos: {
    subtitle: 'تغطياتنا وبرامجنا الحصرية الخاصة بقطاع العقار والاستثمار بالمغرب',
    title: 'فيديوهات عقارات تيفي',
  },
}
