import type { Locale } from '@/i18n/routing'

export type HomeLink = {
  href: string
  label: string
}

export type HomeCard = {
  alt: string
  category: string
  cta?: string
  excerpt?: string
  href: string
  /**
   * Articles edited in Payload carry a ready R2 URL. Static editorial cards use
   * one of the Unsplash ids below instead.
   */
  imageSrc?: string
  imageId?: string
  meta: string
  title: string
}

export type HomeSection = {
  compact: HomeCard[]
  featured: HomeCard
  id: string
  title: string
  viewAll: HomeLink
}

export type HomeContent = {
  footer: {
    about: {
      links: HomeLink[]
      title: string
    }
    copyright: string
    description: string
    /** Column titles; the links come from Payload. */
    policies: {
      links: HomeLink[]
      title: string
    }
    regionsTitle: string
    sectionsTitle: string
    social: string[]
    tagline: string
  }
  header: {
    homeLabel: string
    marketIndex: string
    marketLabel: string
    menu: string
    nav: HomeLink[]
    newsletter: string
    search: string
    siteName: string
  }
  hero: {
    alt: string
    badges: string[]
    description: string
    imageId: string
    titleAccent: string
    titleAfter: string
  }
  heroZone: {
    featured: HomeCard
    sidebar: {
      items: HomeCard[]
      title: string
      updated: string
    }
  }
  latest: {
    items: HomeCard[]
    title: string
    viewAll: HomeLink
  }
  newsletter: {
    button: string
    description: string
    emailLabel: string
    placeholder: string
    privacy: string
    title: string
  }
  regions: {
    description: string
    items: HomeLink[]
    title: string
  }
  sections: HomeSection[]
}

const images = {
  banner: 'photo-1449157291145-7efd050a4d0e',
  casablanca: 'photo-1512453979798-5ea266f8880c',
  city: 'photo-1479839672679-a46483c0e7c8',
  coast: 'photo-1570129477492-45c003edd2be',
  construction: 'photo-1545324418-cc1a3fa10c00',
  finance: 'photo-1560518883-ce09059eeffa',
  interior: 'photo-1560448204-e02f11c3d0e2',
  interiorTwo: 'photo-1600607687920-4e2a09cf159d',
  interiorThree: 'photo-1600607687939-ce8a6c25118c',
  logistics: 'photo-1582407947304-fd86f028f716',
  marrakech: 'photo-1512917774080-9991f1c4c750',
  office: 'photo-1497366811353-6870744d04b2',
  officeRent: 'photo-1497366754035-f200968a6e72',
  project: 'photo-1515263487990-61b07816b324',
  rabat: 'photo-1449844908441-8829872d2607',
  resort: 'photo-1600047509807-ba8f99d2cdde',
  riad: 'photo-1600585154526-990dced4db0d',
  tanger: 'photo-1503174971373-b1f69850bded',
  tower: 'photo-1486406146926-c627a92ad1ab',
  villa: 'photo-1600585154340-be6161a56a0c',
  work: 'photo-1504307651254-35680f356dfd',
}

const ar: HomeContent = {
  footer: {
    about: {
      links: [
        { href: '#footer', label: 'من نحن ومهمتنا' },
        { href: '#footer', label: 'الفريق وهيئة التحرير' },
        { href: '#footer', label: 'ميثاق الشرف الصحفي' },
        { href: '#newsletter-section', label: 'الإعلان والرعايات' },
        { href: '#footer', label: 'الوظائف والفرص' },
      ],
      title: 'عن المنصة',
    },
    copyright: 'جميع الحقوق محفوظة © 2026 منصة "عقارات تيفي" (Akarat TV).',
    description:
      'المنصة الإخبارية المستقلة الأولى المتخصصة في تغطية وتحليل أسواق العقار، التمويل، والتشريعات الاستثمارية في المغرب والعالم العربي برؤية مهنية رصينة.',
    policies: {
      links: [
        { href: '#footer', label: 'اتصل بهيئة التحرير' },
        { href: '#footer', label: 'سياسة الخصوصية' },
        { href: '#footer', label: 'شروط الاستخدام' },
        { href: '#footer', label: 'إخلاء المسؤولية المالية' },
        { href: '#footer', label: 'خريطة الموقع' },
      ],
      title: 'السياسات والاتصال',
    },
    regionsTitle: 'المناطق',
    sectionsTitle: 'الأقسام الإخبارية',
    social: ['LinkedIn', 'X (Twitter)', 'YouTube', 'Facebook'],
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
  newsletter: {
    button: 'اشترك الآن مجاناً',
    description:
      'انضم إلى أكثر من 45,000 مستثمر وخبير عقاري. ملخص أسبوعي موثوق لتحركات الأسعار، التعديلات القانونية، وأهم الفرص الاستثمارية.',
    emailLabel: 'البريد الإلكتروني',
    placeholder: 'أدخل بريدك الإلكتروني المهني...',
    privacy: 'نحترم خصوصيتك بالكامل. يمكنك إلغاء الاشتراك بنقرة واحدة في أي وقت.',
    title: 'النشرة الإخبارية العقارية المتخصصة',
  },
  sections: [
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
  ],
}

const fr: HomeContent = {
  footer: {
    about: {
      links: [
        { href: '#footer', label: 'Qui sommes-nous et notre mission' },
        { href: '#footer', label: "L'équipe et la rédaction" },
        { href: '#footer', label: 'Charte déontologique' },
        { href: '#newsletter-section', label: 'Publicité et partenariats' },
        { href: '#footer', label: 'Carrières et opportunités' },
      ],
      title: 'À propos',
    },
    copyright: 'Tous droits réservés © 2026 Akarat TV.',
    description:
      "Le premier média indépendant spécialisé dans la couverture et l'analyse des marchés immobiliers, du financement et des réglementations d'investissement au Maroc et dans le monde arabe, avec une approche professionnelle rigoureuse.",
    policies: {
      links: [
        { href: '#footer', label: 'Contacter la rédaction' },
        { href: '#footer', label: 'Politique de confidentialité' },
        { href: '#footer', label: "Conditions d'utilisation" },
        { href: '#footer', label: 'Avertissement financier' },
        { href: '#footer', label: 'Plan du site' },
      ],
      title: 'Politiques et contact',
    },
    regionsTitle: 'Régions',
    sectionsTitle: 'Rubriques',
    social: ['LinkedIn', 'X (Twitter)', 'YouTube', 'Facebook'],
    tagline: 'Un design éditorial sobre et fiable',
  },
  regions: {
    description:
      'Choisissez votre région pour découvrir les dernières transactions, les projets et les analyses locales.',
    items: [
      { href: '/regions/casablanca-settat', label: 'Casablanca-Settat' },
      { href: '/regions/rabat-sale-kenitra', label: 'Rabat-Salé-Kénitra' },
      { href: '/regions/marrakech-safi', label: 'Marrakech-Safi' },
      { href: '/regions/tanger-tetouan-al-hoceima', label: 'Tanger-Tétouan-Al Hoceïma' },
      { href: '/regions/fes-meknes', label: 'Fès-Meknès' },
      { href: '/regions/souss-massa', label: 'Souss-Massa' },
    ],
    title: 'Parcourir par région',
  },
  header: {
    homeLabel: "Page d'accueil d'Akarat TV",
    marketIndex: '+1.24%',
    marketLabel: 'Indice boursier immobilier :',
    menu: 'Menu',
    nav: [
      { href: '#market', label: 'Actualités du marché' },
      { href: '#latest-news', label: 'Lois et réglementations' },
      { href: '#projects', label: 'Projets immobiliers' },
      { href: '#investment', label: 'Investissement' },
      { href: '#latest-news', label: 'Financement et hypothèque' },
      { href: '#latest-news', label: 'Conseils et guides' },
      { href: '#latest-news', label: 'Entretiens' },
    ],
    newsletter: "S'abonner à la newsletter",
    search: 'Recherche',
    siteName: 'Akarat TV',
  },
  hero: {
    alt: 'Architecture contemporaine au Maroc',
    badges: ['Mise à jour continue 24 h/24', 'Indicateurs de marché dans 12 régions'],
    description:
      "Une couverture quotidienne, des analyses approfondies et un suivi des grands projets de développement ainsi que des dernières lois et réglementations immobilières et financières, avec le regard d'experts et de journalistes spécialisés.",
    imageId: images.banner,
    titleAccent: 'Akarat TV',
    titleAfter: "le premier média en ligne spécialisé dans l'actualité immobilière au Maroc",
  },
  heroZone: {
    featured: {
      alt: 'Tours financières de Casablanca',
      category: 'Actualités du marché',
      cta: 'Lire le rapport complet',
      excerpt:
        "Le rapport trimestriel de l'Autorité nationale de l'évaluation immobilière révèle un net rebond de la demande de bureaux et de logements haut de gamme, porté par l'afflux de capitaux institutionnels internationaux.",
      href: '#latest-news',
      imageId: images.casablanca,
      meta: 'Il y a 2 heures • Lecture : 5 min • Par : Redouane El Mrabet',
      title:
        'Indicateurs du dernier trimestre : bond de 18 % du volume des grandes transactions immobilières à Casablanca',
    },
    sidebar: {
      items: [
        {
          alt: 'Villas à Marrakech',
          category: 'Projets immobiliers',
          href: '#projects',
          imageId: images.marrakech,
          meta: 'Il y a 35 minutes',
          title: "Lancement d'une deuxième phase de résidences écologiques en périphérie de Marrakech",
        },
        {
          alt: 'Port de Tanger',
          category: 'Investissement',
          href: '#investment',
          imageId: images.tanger,
          meta: 'Il y a 1 heure',
          title: 'Des partenariats étrangers pour développer le littoral et la logistique à Tanger',
        },
        {
          alt: 'Chantier de construction',
          category: 'Lois et réglementations',
          href: '#latest-news',
          imageId: images.work,
          meta: 'Il y a 3 heures',
          title:
            'Nouvelle loi sur la construction verte : des normes obligatoires pour les grands projets dès 2027',
        },
      ],
      title: 'Derniers titres',
      updated: 'Mise à jour continue',
    },
  },
  latest: {
    items: [
      {
        alt: 'Résidences à Rabat',
        category: 'Actualités du marché',
        cta: "Lire l'article",
        excerpt:
          "Les indicateurs semestriels montrent des prix stables dans les quartiers centraux, avec une activité notable dans les zones d'extension urbaine.",
        href: '#market',
        imageId: images.rabat,
        meta: 'Il y a 4 heures',
        title:
          'Rapport officiel : stabilisation des prix des appartements à Rabat, avec une demande locative en hausse',
      },
      {
        alt: 'Financement immobilier',
        category: 'Financement et hypothèque',
        cta: "Lire l'article",
        excerpt:
          "Les banques participatives et commerciales lancent une nouvelle gamme d'offres Mourabaha et de prêts à taux fixe couvrant jusqu'à 95 % de la valeur du bien.",
        href: '#latest-news',
        imageId: images.finance,
        meta: 'Il y a 6 heures',
        title:
          "Des facilités bancaires préférentielles pour les jeunes emprunteurs dans le cadre des programmes nationaux d'aide au logement",
      },
      {
        alt: 'Villas et biens haut de gamme',
        category: 'Projets immobiliers',
        cta: "Lire l'article",
        excerpt:
          "Une demande record pour les biens côtiers à gestion hôtelière intégrée, avec des rendements locatifs annuels pouvant atteindre 8,5 %.",
        href: '#projects',
        imageId: images.villa,
        meta: 'Il y a 7 heures',
        title:
          "L'essor des resorts résidentiels à Agadir et Taghazout attire des investisseurs d'Europe du Nord",
      },
      {
        alt: 'Bureaux commerciaux',
        category: 'Conseils et guides',
        cta: "Lire l'article",
        excerpt:
          'Les clauses juridiques à surveiller dans les baux de longue durée pour préserver la trésorerie et la flexibilité opérationnelle.',
        href: '#latest-news',
        imageId: images.office,
        meta: 'Hier',
        title:
          'Le guide des start-up pour choisir des bureaux flexibles et négocier un bail commercial',
      },
    ],
    title: 'Dernières actualités',
    viewAll: { href: '#latest-news', label: 'Voir tout' },
  },
  newsletter: {
    button: "S'abonner gratuitement",
    description:
      "Rejoignez plus de 45 000 investisseurs et experts immobiliers. Un résumé hebdomadaire fiable des mouvements de prix, des évolutions juridiques et des meilleures opportunités d'investissement.",
    emailLabel: 'Adresse e-mail',
    placeholder: 'Saisissez votre e-mail professionnel...',
    privacy: 'Nous respectons totalement votre vie privée. Vous pouvez vous désabonner à tout moment en un clic.',
    title: 'La newsletter immobilière spécialisée',
  },
  sections: [
    {
      compact: [
        {
          alt: 'Indice des loyers',
          category: 'Location commerciale',
          href: '#market',
          imageId: images.officeRent,
          meta: '10 novembre 2026',
          title: "L'indice des loyers de bureaux se stabilise à Anfa City",
        },
        {
          alt: 'Marché de la construction',
          category: 'Matériaux de construction',
          href: '#market',
          imageId: images.construction,
          meta: '9 novembre 2026',
          title:
            "La baisse des prix du ciment et de l'acier soutient le rythme des projets de taille moyenne",
        },
        {
          alt: 'Riads de Marrakech',
          category: 'Immobilier ancien',
          href: '#market',
          imageId: images.riad,
          meta: '8 novembre 2026',
          title:
            "Marrakech enregistre une demande record pour les riads convertis en maisons d'hôtes",
        },
      ],
      featured: {
        alt: 'Analyses du marché immobilier',
        category: 'Analyse exclusive',
        cta: 'Poursuivre la lecture',
        excerpt:
          "Une lecture attentive des chiffres de la Conservation foncière et des indicateurs de transactions résidentielles et commerciales, avec un suivi de l'évolution du prix au mètre carré dans les quartiers huppés et intermédiaires de Casablanca, Rabat et Marrakech.",
        href: '#market',
        imageId: images.city,
        meta: 'Il y a 2 jours • Service analyses',
        title:
          'Carte de l’offre et de la demande dans les grandes villes : où vont les prix en 2027 ?',
      },
      id: 'market',
      title: 'Actualités du marché immobilier',
      viewAll: { href: '#market', label: 'Voir toutes les analyses du marché' },
    },
    {
      compact: [
        {
          alt: 'Tour Ryad',
          category: 'Tours de bureaux',
          href: '#projects',
          imageId: images.tower,
          meta: '10 novembre 2026',
          title: 'Livraison de la tour de bureaux verte du quartier Ryad à Rabat',
        },
        {
          alt: 'Corniche de Tanger',
          category: 'Développement côtier',
          href: '#projects',
          imageId: images.coast,
          meta: '7 novembre 2026',
          title:
            'La nouvelle corniche de Tanger se prépare à inaugurer son complexe de loisirs et commercial',
        },
        {
          alt: 'Taghazout Bay',
          category: 'Resorts résidentiels',
          href: '#projects',
          imageId: images.resort,
          meta: '5 novembre 2026',
          title:
            'Lancement des résidences hôtelières "Ocean Bay" dans la station touristique de Taghazout',
        },
      ],
      featured: {
        alt: 'Projets urbains intelligents',
        category: 'Projet stratégique',
        cta: 'Découvrir le plan architectural',
        excerpt:
          'Le nouveau pôle urbain propose plus de 4 200 logements modernes répondant aux normes de construction durable, avec des espaces verts représentant plus de 30 % de la superficie totale du projet.',
        href: '#projects',
        imageId: images.project,
        meta: 'Il y a 3 jours • Reportage sur le terrain',
        title:
          'Ville "Zenata Éco-Cité" : inauguration du troisième quartier résidentiel avec une gestion intelligente de l’énergie et de l’eau',
      },
      id: 'projects',
      title: 'Projets immobiliers et développement',
      viewAll: { href: '#projects', label: 'Voir tous les projets' },
    },
    {
      compact: [
        {
          alt: 'Bureaux partagés',
          category: 'Rendement des actifs',
          href: '#investment',
          imageId: images.interiorTwo,
          meta: '10 novembre 2026',
          title: 'Comparatif des rendements : bureaux intelligents contre appartements meublés',
        },
        {
          alt: 'Immobilier logistique',
          category: 'Immobilier logistique',
          href: '#investment',
          imageId: images.logistics,
          meta: '8 novembre 2026',
          title: 'Les entrepôts logistiques modernes affichent un rendement net supérieur à 9,2 %',
        },
        {
          alt: 'Investissements de la diaspora',
          category: 'Marocains du monde',
          href: '#investment',
          imageId: images.interiorThree,
          meta: '6 novembre 2026',
          title:
            'Le guide pour bénéficier des incitations fiscales destinées aux Marocains du monde',
        },
      ],
      featured: {
        alt: "Fonds d'investissement immobilier",
        category: 'Fonds OPCI',
        cta: 'Lire les indicateurs financiers',
        excerpt:
          "Les grandes entreprises et les assureurs accélèrent la monétisation de leurs actifs immobiliers en les transformant en instruments financiers à rendement régulier et à risque maîtrisé.",
        href: '#investment',
        imageId: images.interior,
        meta: 'Il y a 4 jours • Étude financière',
        title:
          'Les actifs des OPCI dépassent le seuil de 90 milliards de dirhams au Maroc',
      },
      id: 'investment',
      title: 'Investissement et fonds immobiliers',
      viewAll: { href: '#investment', label: "Voir les analyses d'investissement" },
    },
  ],
}

export const homeContent: Record<Locale, HomeContent> = { ar, fr }

/** Used when a Payload article has no hero image, so cards never render empty. */
export const homeFallbackImageId = images.city

/** Unsplash source at a width large enough for its card. Next optimises from here. */
export const unsplashUrl = (id: string, width: number): string =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`

/** CMS cards use their R2 URL; static editorial cards fall back to Unsplash. */
export const cardImageUrl = (card: Pick<HomeCard, 'imageId' | 'imageSrc'>, width: number): string =>
  card.imageSrc ?? unsplashUrl(card.imageId ?? homeFallbackImageId, width)
