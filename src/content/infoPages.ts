import type { Locale } from '@/i18n/routing'

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

const ar: Record<InfoPageSlug, InfoPageContent> = {
  about: {
    description:
      'تعرّف على مهمة عقارات تيفي، فريق التحرير، والمبادئ التي تحكم تغطيتنا لأسواق العقار والتمويل في المغرب والعالم العربي.',
    eyebrow: 'عن عقارات تيفي',
    intro:
      'عقارات تيفي منصة إخبارية مستقلة أُطلقت عام 2024، متخصصة في تغطية وتحليل أسواق العقار والتمويل والتشريعات الاستثمارية في المغرب والعالم العربي. نعمل على تقديم معلومات واضحة وموثوقة تساعد القارئ على فهم التحولات التي تؤثر على القرار العقاري والاستثماري.',
    jsonLdType: 'AboutPage',
    sections: [
      {
        id: 'mission',
        heading: 'مهمتنا',
        paragraphs: [
          'نهدف إلى سد الفجوة بين الخبر العقاري اليومي والتحليل المعمّق، عبر تقديم محتوى يشرح ما يحدث، ولماذا يحدث، وما الذي قد يعنيه للمستثمرين والساكنين والمهنيين.',
          'نغطي السياسات السكنية، مشاريع البناء، التمويل العقاري، التشريعات، ومؤشرات السوق، مع حرص دائم على التمييز بين الوقائع والآراء والتحليلات.',
        ],
        bullets: [
          'تغطية الأخبار والقرارات التي تؤثر على السوق العقاري.',
          'تحليل البيانات والمؤشرات بلغة مفهومة وغير مبالغ فيها.',
          'نشر أدلة ومقالات توضيحية تخدم القارئ قبل وأثناء اتخاذ القرار.',
        ],
      },
      {
        id: 'story',
        heading: 'قصتنا',
        paragraphs: [
          'انطلقت المنصة عام 2024 بدافع الحاجة إلى مصدر عربي وفرنسي موثوق يتابع العقار بوصفه قطاعاً اقتصادياً واجتماعياً، لا بوصفه مجرد إعلانات وعروض تجارية.',
          'نعمل بنهج رقمي أولاً، وننشر باللغتين العربية والفرنسية ليصل المحتوى إلى القارئ في المغرب والعالم العربي بلغته التي يفضلها.',
        ],
      },
      {
        id: 'independence',
        heading: 'استقلالنا وتمويلنا',
        paragraphs: [
          'نتمتع بخط تحريري مستقل، ولا تؤثر الشراكات التجارية أو الإعلانات في القرارات التحريرية أو في اختيار الأخبار وطريقة تغطيتها.',
          'يُشار بوضوح إلى أي محتوى مدعوم أو مدفوع، ويبقى منفصلاً عن المحتوى التحريري المستقل.',
        ],
      },
      {
        id: 'team',
        heading: 'الفريق وهيئة التحرير',
        paragraphs: [
          'يجمع الفريق بين خبرة التحرير المالي والعقاري وتطوير المنصات الرقمية، مع مراجعة تحريرية مستمرة لما ينشر.',
        ],
      },
      {
        id: 'values',
        heading: 'قيمنا',
        paragraphs: [
          'توجّه هذه المبادئ عملنا اليومي وقراراتنا التحريرية:',
        ],
        bullets: [
          'الاستقلال: لا نملي على وقائعنا مصالح تجارية أو سياسية.',
          'الدقة: نتحقق من المعلومات قبل النشر ونصححها بشفافية عند الحاجة.',
          'التوازن: نعرّض وجهات النظر ذات الصلة دون اختزال أو تضليل.',
          'الشفافية: نوضح مصادرنا ومواضف المحتوى المدعوم.',
          'الخدمة: نكتب لكي يفهم القارئ، لا لكي يُبهَر.',
        ],
      },
    ],
    team: [
      { name: 'Abderrahim Belechkar', role: 'رئيس التحرير' },
      { name: 'Salman El-Ghrich', role: 'مطور المنصة' },
    ],
    title: 'من نحن',
  },

  contact: {
    description:
      'تواصل مع هيئة تحرير عقارات تيفي للأسئلة والتصحيحات والمقترحات، أو للاستفسار عن الإعلان والرعايات والفرص.',
    eyebrow: 'تواصل معنا',
    intro:
      'نرحّب بملاحظاتكم واقتراحاتكم. إذا كنت ترغب في تصحيح معلومة، أو تقديم فكرة تغطية، أو الاستفسار عن شراكة، استخدم البريد الإداري أدناه أو النموذج التجريبي في هذه الصفحة.',
    jsonLdType: 'ContactPage',
    sections: [
      {
        id: 'editorial',
        heading: 'هيئة التحرير',
        paragraphs: [
          'للأسئلة التحريرية، المقترحات، طلبات التصحيح، أو حق الرد، راسلنا عبر البريد الإداري. نقرأ كل الرسائل ونمنح أولوية للملاحظات المتعلقة بدقة المحتوى المنشور.',
        ],
        bullets: [
          'طلبات التصحيح: يفضّل إرفاق رابط المقال والمصدر الذي يثبت الخطأ.',
          'حق الرد: ننشر الردود المهملة وفق سياستنا التحريرية وبعد مراجعة التحرير.',
          'مقترحات التغطية: أرسل فكرة موجزة مع السياق والمصادر المتاحة إن وجدت.',
        ],
      },
      {
        id: 'advertising',
        heading: 'الإعلان والرعايات',
        paragraphs: [
          'للاستفسار عن الإعلان والرعايات والشراكات التجارية، راسلنا عبر البريد نفسه مع كلمة "إعلان" في العنوان.',
          'تُوضَّف جميع المحتويات المدعومة بعلامة واضحة، ولا تُباع التغطية التحريرية المستقلة.',
        ],
      },
      {
        id: 'careers',
        heading: 'الوظائف والفرص',
        paragraphs: [
          'لا نعرض حالياً وظائف مفتوحة، لكننا نرحّب بسير ذاتية لصحفيين ومحللين ومطورين مهتمين بمجال العقار والتمويل.',
          'أرسل نبذة قصيرة وسيرتك الذاتية عبر البريد الإداري مع كلمة "فرصة" في العنوان.',
        ],
      },
    ],
    title: 'اتصل بنا',
  },

  privacy: {
    description:
      'توضح سياسة خصوصية عقارات تيفي البيانات التي نجمعها، كيف نستخدمها، مدة الاحتفاظ بها، وحقوقك في طلب الوصول أو التصحيح أو الحذف.',
    eyebrow: 'السياسات والخصوصية',
    intro:
      'تحترم عقارات تيفي خصوصية زوارها. تشرح هذه السياسة ما نجمعه عند استخدام الموقع، ولماذا نجمعه، ومن يعالجه، وكيف يمكنك ممارسة حقوقك. تسري هذه السياسة اعتباراً من 22 نونبر 2026.',
    jsonLdType: 'WebPage',
    sections: [
      {
        id: 'data-we-collect',
        heading: 'البيانات التي نجمعها',
        paragraphs: [
          'نجمع فقط البيانات اللازمة لتشغيل الموقع والرد على المراسلات وفهم طريقة استخدامه:',
        ],
        bullets: [
          'بيانات الاتصال التي ترسلها طوعاً عبر البريد أو نموذج الاتصال عند تفعيله، مثل الاسم والبريد الإلكتروني والموضوع والرسالة.',
          'معلومات تقنية مثل عنوان IP ونوع المتصفح والصفحة التي زرتها ووقت الزيارة، ضمن سجلات التشغيل والأمان.',
          'بيانات الأخطاء التقنية التي يجمعها Sentry، مثل رسالة الخطأ، مسار الصفحة، ونوع الجهاز أو المتصفح.',
          'بيانات الاستخدام التي يجمعها Google Analytics 4 لقياس الزيارات وتحليل التفاعل مع المحتوى.',
          'ملفات تعريف الارتباط الضرورية للغة والجلسة الإدارية والأمان، إضافة إلى ملف Google Analytics 4 الذي يُحمّل بعد موافقتك فقط.',
        ],
        note: 'نموذج النشرة البريدية المعروض حالياً هو واجهة تجريبية فقط، ولا يخزّن أي عنوان بريد إلكتروني إلى حين ربطه بمزوّد خدمة بريدية.',
      },
      {
        id: 'how-we-use',
        heading: 'كيف نستخدم البيانات',
        paragraphs: [
          'نستخدم البيانات للأغراض التالية فقط:',
        ],
        bullets: [
          'الرد على رسائلكم ومعالجة طلبات التصحيح والشراكة.',
          'تشغيل الموقع وضبط اللغة وحماية حسابات التحرير.',
          'مراقبة الأخطاء التقنية وتحسين استقرار المنصة وأدائها.',
          'فهم أداء المحتوى عبر بيانات إحصائية مجمّعة.',
        ],
      },
      {
        id: 'analytics',
        heading: 'Google Analytics 4',
        paragraphs: [
          'نستخدم Google Analytics 4 لقياس زيارات الموقع وفهم الصفحات الأكثر قراءة وكيفية وصول الزوار إليها. لا يُحمّل هذا البرنامج إلا بعد موافقتك عبر شريط الخصوصية، ولا يعمل على صفحات الإدارة أو معاينات المقالات.',
          'قد تستخدم Google ملفات تعريف ارتباط أو معرّفات مشابهة لجمع معلومات مثل: الصفحات التي تزورها، الأحداث التي تقوم بها على الموقع، المنطقة الجغرافية التقريبية المستنتجة من عنوان IP، نوع المتصفح والجهاز، مصدر الزيارة، ومعرّفات إحصائية لا تحدد هويتك مباشرة.',
          'تُحفظ هذه المعلومات في تقارير إحصائية مجمّعة، وتخضع مدة الاحتفاظ بها لإعدادات حساب Google Analytics. لا نستخدمها لاتخاذ قرارات فردية تؤثر على الزوار، وقد تُعالج Google البيانات في بلدان أخرى وفق سياسة الخصوصية الخاصة بها.',
          'يمكنك سحب موافقتك أو تغييرها في أي وقت عبر رابط «إعدادات ملفات تعريف الارتباط» أسفل الصفحة. إذا رفضت، لا يُحمّل برنامج التحليلات إطلاقاً، وتبقى الملفات الضرورية لتشغيل الموقع فقط.',
        ],
        bullets: [
          'الصفحات المعروضة وعناوينها ومدة البقاء.',
          'أحداث مثل فتح مقال أو الضغط على رابط.',
          'بيانات تقنية مجمّعة: المتصفح، الجهاز، نظام التشغيل، ومصدر الزيارة.',
          'موقع تقريبي على مستوى المدينة أو المنطقة، مشتق من عنوان IP.',
        ],
        note: 'قد تحجب بعض أدوات منع الإعلانات أو التتبع برنامج التحليلات، لذلك تُعدّ أرقام الزيارات مؤشراً مقارناً وليس رقماً مطلقاً.',
      },
      {
        id: 'sentry',
        heading: 'مراقبة الأخطاء التقنية',
        paragraphs: [
          'نستخدم Sentry لتسجيل الأخطاء وتتبع الأداء ورسائل ملاحظات المستخدمين. قد تتضمن هذه البيانات عنوان IP ونوع المتصفح ورابط الصفحة ووقت الحدث.',
          'لا نستخدم Sentry لتسجيل الجلسات المرئية (Session Replay)، ولا نجمع تسجيلات فيديو لسلوك التصفح.',
        ],
      },
      {
        id: 'retention',
        heading: 'مدة الاحتفاظ',
        paragraphs: [
          'نحتفظ بالبيانات لأقصر مدة تخدم الغرض الذي جُمعت من أجله:',
        ],
        bullets: [
          'رسائل الاتصال: حتى 12 شهراً ما لم تكن مرتبطة بطلب ما زال قيد المتابعة.',
          'سجلات التشغيل والأمان وبيانات الأخطاء: حتى 90 يوماً.',
          'بيانات حسابات التحرير: طوال مدة حساب المستخدم النشط.',
          'النشرة البريدية: حتى إلغاء الاشتراك، عند تفعيل الخدمة.',
          'بيانات Google Analytics: وفق مدة الاحتفاظ المضبوطة في حساب التحليلات.',
        ],
      },
      {
        id: 'processors',
        heading: 'المعالجون والخدمات الخارجية',
        paragraphs: [
          'قد تُعالج بياناتك عبر مزوّدي الخدمات التالية:',
        ],
        bullets: [
          'Vercel لاستضافة الموقع وتقديم الصفحات.',
          'مزوّد قاعدة البيانات الذي تستند إليه منصة Payload.',
          'Cloudflare R2 لتخزين الصور والوسائط.',
          'Sentry لمراقبة الأخطاء والأداء.',
          'Google / Google Analytics 4 لتحليل الاستخدام.',
          'مزوّد البريد الإلكتروني عند الرد على مراسلاتك أو تفعيل النشرة.',
        ],
      },
      {
        id: 'rights',
        heading: 'حقوقك',
        paragraphs: [
          'يمكنك طلب الوصول إلى بياناتك أو تصحيحها أو حذفها، أو الاعتراض على معالجتها، أو سحب موافقتك حيثما انطبق ذلك. أرسل طلبك إلى:',
        ],
        bullets: ['akarattv1@gmail.com'],
        note: 'قد نحتفظ ببيانات محدودة عند وجود التزام قانوني أو حاجة لحماية أمن المنصة.',
      },
      {
        id: 'children',
        heading: 'خصوصية الأطفال',
        paragraphs: [
          'لا نستهدف الأطفال دون سن 16 عاماً، ولا نجمع بياناتهم بشكل واعٍ عبر الموقع أو النماذج.',
        ],
      },
      {
        id: 'changes',
        heading: 'تعديلات السياسة',
        paragraphs: [
          'قد نحدّث هذه السياسة عند تغيير ممارساتنا أو الخدمات المستخدمة. يُذكر تاريخ آخر تحديث في أعلى الصفحة، ويسري التعديل فور نشره.',
        ],
      },
    ],
    title: 'سياسة الخصوصية',
  },

  terms: {
    description:
      'تحدد شروط استخدام عقارات تيفي قواعد التصفح، حقوق الملكية الفكرية، إخلاء المسؤولية المالية، وتحديد المسؤولية.',
    eyebrow: 'السياسات والشروط',
    intro:
      'باستخدامك موقع عقارات تيفي، فإنك توافق على هذه الشروط. اقرأها بعناية، وإذا لم توافق عليها فتوقف عن استخدام الموقع.',
    jsonLdType: 'WebPage',
    sections: [
      {
        id: 'acceptance',
        heading: 'قبول الشروط',
        paragraphs: [
          'تسري هذه الشروط على جميع صفحات الموقع ومحتواه. قد يؤدي استمرار الاستخدام بعد تحديث الشروط إلى قبول النسخة المعدّلة.',
        ],
      },
      {
        id: 'acceptable-use',
        heading: 'استخدام الموقع',
        paragraphs: [
          'تلتزم عند استخدام الموقع بما يلي:',
        ],
        bullets: [
          'عدم استخدام الموقع لأغراض غير قانونية أو مخالفة للنظام العام.',
          'عدم محاولة اختراق الأمان أو تعطيل الخدمة أو إرسال طلبات آلية مفرطة.',
          'عدم إرسال معلومات كاذبة أو ضارة عبر أي نموذج أو طريقة اتصال.',
          'احترام حقوق الملكية الفكرية الخاصة بالمنصة وبالغيير.',
        ],
      },
      {
        id: 'intellectual-property',
        heading: 'الملكية الفكرية',
        paragraphs: [
          'جميع المقالات والتصميمات والشعارات والمحتوى المنشور على عقارات تيفي مملوك للمنصة أو لأصحابه، ومحمي بموجب القوانين المعمول بها.',
          'يسمح بالاقتباس المحدود مع ذكر المصدر ورابط المقال الأصلي، ولا يسمح بإعادة نشر المحتوى كاملاً أو استخدامه تجارياً دون إذن كتابي.',
        ],
      },
      {
        id: 'financial-disclaimer',
        heading: 'إخلاء المسؤولية المالية',
        paragraphs: [
          'المحتوى المنشور على عقارات تيفي لأغراض إعلامية وتحليلية عامة فقط، ولا يُعد نصيحة استثمارية أو مالية أو قانونية أو ضماناً لأي عائد.',
          'القرارات العقارية والمالية تقع على مسؤولية القارئ وحده، ويُنصح باستشارة مختص مؤهل قبل اتخاذ أي قرار مالي أو استثماري.',
          'قد تتغير الأسعار والبيانات والمؤشرات بعد النشر، ولا نضمن تحديث كل مقال بشكل مستمر.',
        ],
        note: 'لا نقدّم أي توصية لشراء أو بيع أصل، ولا نقدّم خدمات وساطة مالية.',
      },
      {
        id: 'liability',
        heading: 'تحديد المسؤولية',
        paragraphs: [
          'نبذل جهداً معقولاً لضمان دقة المحتوى، لكننا لا نقدم ضماناً صريحاً أو ضمنياً بشأن اكتماله أو ملاءمته لغرض معين.',
          'لا نتحمل مسؤولية الأضرار غير المباشرة أو الناتجة عن الاعتماد على المعلومات المنشورة، ولا عن انقطاع الخدمة لأسباب خارج عن سيطرتنا.',
        ],
      },
      {
        id: 'external-links',
        heading: 'الروابط الخارجية',
        paragraphs: [
          'قد تحتوي صفحاتنا على روابط إلى مواقع خارجية. لا نتحكم في محتوى تلك المواقع أو سياساتها، ولا يعني وجود الرابط تأييداً لها.',
        ],
      },
      {
        id: 'user-content',
        heading: 'المحتوى المقدم من المستخدمين',
        paragraphs: [
          'إذا أرسلت لنا ملاحظات أو مقترحات أو مواد، فإنك تمنحنا حق استخدامها للرد عليك أو لتطوير المحتوى، مع احترام حقوقك وعدم نشر بياناتك الخاصة دون موافقة.',
        ],
      },
      {
        id: 'changes',
        heading: 'تعديل الشروط',
        paragraphs: [
          'نحتفظ بحق تعديل هذه الشروط في أي وقت. يُنشر التاريخ المحدّث في أعلى الصفحة، ويعمل بالتعديل اعتباراً من تاريخ نشره.',
        ],
      },
      {
        id: 'law',
        heading: 'القانون المطبق',
        paragraphs: [
          'تخضع هذه الشروط وأي نزاع متعلق بها للقانون المغربي، دون مساس بأي قواعد إلزامية أعم.',
        ],
      },
    ],
    title: 'شروط الاستخدام',
  },

  'editorial-policy': {
    description:
      'تشرح السياسة التحريرية لعقارات تيفي كيف نتحقق من المعلومات، نتعامل مع التصحيحات وحق الرد، ونفصل بين التحرير والإعلان.',
    eyebrow: 'السياسة التحريرية',
    intro:
      'تلتزم عقارات تيفي بصحافة دقيقة ومستقلة. توضح هذه السياسة المعايير التي نطبقها عند إعداد المحتوى ونشره وتصحيحه.',
    jsonLdType: 'WebPage',
    sections: [
      {
        id: 'independence',
        heading: 'الاستقلال التحريري',
        paragraphs: [
          'تُتخذ القرارات التحريرية بناءً على الأهمية العامة والمصداقية، لا على اعتبارات تجارية أو ضغوط خارجية.',
          'لا يُسمح للمعلنين أو الشركاء بمراجعة المقالات التحريرية قبل نشرها أو فرض تغيير عليها.',
        ],
      },
      {
        id: 'verification',
        heading: 'التحقق والمصادر',
        paragraphs: [
          'نعتمد على مصادر أولية كلما أمكن، مثل الوثائق الرسمية والبيانات المنشورة والتصريحات الموثقة، ونسعى إلى مصادر متعددة للأخبار المؤثرة.',
        ],
        bullets: [
          'نميّز بوضوح بين الخبر والتحليل والرأي.',
          'ننسب الاقتباسات إلى أصحابها ولا ننسب أقوالاً لم تصدر عنهم.',
          'نراجع الأرقام والتواريخ قبل النشر، ونذكر حدود البيانات عندما تكون جزئية.',
        ],
      },
      {
        id: 'corrections',
        heading: 'التصحيحات',
        paragraphs: [
          'إذا اكتشفنا خطأً مهنياً، نصححه في أقرب وقت وبطريقة شفافة، عادةً خلال 14 يوماً من إبلاغنا أو اكتشافه.',
          'تُضاف ملاحظة تصحيح واضحة إلى المقال عند الحاجة، مع تعديل العنوان أو النص بما يعكس المعلومة الصحيحة.',
          'يمكن إرسال طلبات التصحيح إلى akarattv1@gmail.com مع رابط المقال والمصدر الداعم.',
        ],
      },
      {
        id: 'right-of-reply',
        heading: 'حق الرد',
        paragraphs: [
          'نمنح فرصة رد منصفة للأشخاص أو الجهات التي يرد ذكرها في تغطية نقدية أو مثيرة للجدل، عندما يكون الرد مهماً لفهم الموضوع.',
          'يُراجع الرد تحريرياً، ويُنشر بالشكل المناسب دون إعادة صياغة مضللة.',
        ],
      },
      {
        id: 'conflicts',
        heading: 'تضارب المصالح',
        paragraphs: [
          'يُطلب من المحررين والكتّاب الإفصاح عن أي علاقة مالية أو شخصية قد تؤثر على تغطية موضوع معين.',
          'عند وجود تضارب محتمل، يُعاد تكليف كاتب آخر أو تُضاف ملاحظة إفصاح مناسبة.',
        ],
      },
      {
        id: 'sponsored',
        heading: 'المحتوى المدعوم والإعلان',
        paragraphs: [
          'يُوسم أي محتوى مدعوم أو رعاية أو إعلان بعلامة واضحة، ويُفصل بصرياً عن المحتوى التحريري المستقل.',
          'لا نبيع مواضيع الأخبار أو التغطية التحريرية، ولا نسمح للإعلان بالتأثير على ترتيب الأخبار أو تقييمها.',
        ],
      },
      {
        id: 'ai',
        heading: 'الذكاء الاصطناعي',
        paragraphs: [
          'قد نستخدم أدوات الذكاء الاصطناعي في مهام مساعدة مثل التنظيم أو التلخيص الأولي، مع مراجعة بشرية كاملة قبل النشر.',
          'لا ننشر اقتباسات أو مصادر أو أرقاماً مولّدة آلياً دون التحقق من صحتها، ولا نستخدم الذكاء الاصطناعي لانتحال صفة مراسل أو مصدر.',
        ],
      },
      {
        id: 'anonymous-sources',
        heading: 'المصادر المجهولة',
        paragraphs: [
          'نلجأ إلى المصادر المجهولة فقط عند وجود معلومة مهمة لا يمكن الحصول عليها علناً، وبعد تقييم دافع المصدر ومصداقيته.',
          'تُستخدم هذه المعلومات بأقل قدر ممكن وبمراجعة تحريرية، ولا تُستخدم لتوجيه اتهامات غير مدعومة.',
        ],
      },
      {
        id: 'analysis',
        heading: 'التحليل والآراء',
        paragraphs: [
          'تُوسم مقالات التحليل والرأي بوضوح، وتُقدَّم كاجتهاد تحريري لا كخبر مؤكد.',
          'نسعى إلى عرض المعطيات المتاحة والافتراضات التي يستند إليها التحليل، حتى يتمكن القارئ من تقييمه.',
        ],
      },
      {
        id: 'privacy',
        heading: 'الخصوصية في العمل التحريري',
        paragraphs: [
          'لا ننشر بيانات شخصية خاصة إلا إذا كانت ذات صلة عامة موثقة، وبعد موازنة دقيقة مع حق الخصوصية.',
          'نحمي هوية مصادرنا ونمنع الوصول غير المصرح به إلى معلومات الاتصال التي نستلمها.',
        ],
      },
    ],
    title: 'السياسة التحريرية',
  },
}

const fr: Record<InfoPageSlug, InfoPageContent> = {
  about: {
    description:
      "Découvrez la mission d'Akarat TV, son équipe et les principes qui guident sa couverture des marchés immobiliers et financiers au Maroc et dans le monde arabe.",
    eyebrow: "À propos d'Akarat TV",
    intro:
      "Akarat TV est un média d'information indépendant lancé en 2024, spécialisé dans la couverture et l'analyse des marchés immobiliers, du financement et des réglementations d'investissement au Maroc et dans le monde arabe. Nous publions des informations claires et fiables pour aider le lecteur à comprendre les évolutions qui influencent ses décisions immobilières et financières.",
    jsonLdType: 'AboutPage',
    sections: [
      {
        id: 'mission',
        heading: 'Notre mission',
        paragraphs: [
          "Nous voulons combler l'écart entre l'actualité immobilière quotidienne et l'analyse approfondie, en expliquant ce qui se passe, pourquoi cela se produit et ce que cela peut signifier pour les investisseurs, les habitants et les professionnels.",
          'Nous couvrons les politiques du logement, les projets de construction, le financement immobilier, les réglementations et les indicateurs de marché, en distinguant toujours les faits des opinions et des analyses.',
        ],
        bullets: [
          "Couvrir les actualités et décisions qui affectent le marché immobilier.",
          'Analyser les données et indicateurs dans un langage clair et mesuré.',
          'Publier des guides pédagogiques utiles avant et pendant la prise de décision.',
        ],
      },
      {
        id: 'story',
        heading: 'Notre histoire',
        paragraphs: [
          'La plateforme est née en 2024 du besoin d’une source de référence en arabe et en français, capable de traiter l’immobilier comme un secteur économique et social et non comme une simple suite d’annonces commerciales.',
          'Nous adoptons une approche numérique avant tout et publions en arabe et en français afin de toucher le lecteur au Maroc et dans le monde arabe dans sa langue préférée.',
        ],
      },
      {
        id: 'independence',
        heading: 'Notre indépendance',
        paragraphs: [
          'Notre ligne éditoriale est indépendante. Les partenariats commerciaux et la publicité n’influencent ni nos choix éditoriaux ni notre manière de traiter un sujet.',
          'Tout contenu sponsorisé ou payant est clairement identifié et reste séparé de l’information rédactionnelle indépendante.',
        ],
      },
      {
        id: 'team',
        heading: "L'équipe et la rédaction",
        paragraphs: [
          'Notre équipe réunit une expertise en journalisme économique et immobilier et en développement de plateformes numériques, avec une relecture éditoriale permanente des contenus publiés.',
        ],
      },
      {
        id: 'values',
        heading: 'Nos valeurs',
        paragraphs: ['Ces principes guident notre travail quotidien et nos décisions éditoriales :'],
        bullets: [
          'Indépendance : aucun intérêt commercial ou politique ne dicte nos faits.',
          'Exactitude : nous vérifions avant de publier et corrigeons de manière transparente.',
          'Équilibre : nous présentons les points de vue pertinents sans simplification trompeuse.',
          'Transparence : nous précisons nos sources et signalons les contenus sponsorisés.',
          'Service : nous écrivons pour être compris, pas pour impressionner.',
        ],
      },
    ],
    team: [
      { name: 'Abderrahim Belechkar', role: 'Rédacteur en chef' },
      { name: 'Salman El-Ghrich', role: 'Développeur de la plateforme' },
    ],
    title: 'Qui sommes-nous',
  },

  contact: {
    description:
      "Contactez la rédaction d'Akarat TV pour une question, une correction, une proposition ou une demande relative à la publicité et aux partenariats.",
    eyebrow: 'Nous contacter',
    intro:
      'Nous sommes à l’écoute de vos remarques et suggestions. Pour signaler une erreur, proposer un sujet ou vous renseigner sur un partenariat, utilisez l’adresse ci-dessous ou le formulaire de démonstration présenté sur cette page.',
    jsonLdType: 'ContactPage',
    sections: [
      {
        id: 'editorial',
        heading: 'La rédaction',
        paragraphs: [
          'Pour toute question éditoriale, proposition, demande de correction ou droit de réponse, écrivez-nous à l’adresse générale. Nous lisons tous les messages et traitons en priorité les remarques relatives à l’exactitude des contenus publiés.',
        ],
        bullets: [
          'Corrections : joignez de préférence le lien de l’article et la source qui établit l’erreur.',
          'Droit de réponse : nous publions les réponses pertinentes selon notre politique éditoriale et après relecture.',
          'Suggestions de sujets : envoyez une idée concise avec son contexte et ses sources si possible.',
        ],
      },
      {
        id: 'advertising',
        heading: 'Publicité et partenariats',
        paragraphs: [
          'Pour toute demande relative à la publicité, au parrainage ou aux partenariats commerciaux, écrivez-nous à la même adresse en indiquant « Publicité » dans l’objet.',
          'Tous les contenus sponsorisés sont signalés clairement et restent distincts de l’information rédactionnelle indépendante.',
        ],
      },
      {
        id: 'careers',
        heading: 'Carrières et opportunités',
        paragraphs: [
          'Aucun poste n’est actuellement ouvert, mais nous accueillons les candidatures de journalistes, analystes et développeurs intéressés par l’immobilier et la finance.',
          'Envoyez une courte présentation et votre CV à l’adresse générale en indiquant « Opportunité » dans l’objet.',
        ],
      },
    ],
    title: 'Contact',
  },

  privacy: {
    description:
      "La politique de confidentialité d'Akarat TV explique quelles données nous collectons, comment nous les utilisons, combien de temps nous les conservons et quels sont vos droits.",
    eyebrow: 'Politiques et confidentialité',
    intro:
      'Akarat TV respecte la vie privée de ses visiteurs. Cette politique explique ce que nous collectons lorsque vous utilisez le site, pourquoi, qui traite ces données et comment exercer vos droits. Elle est applicable à compter du 22 novembre 2026.',
    jsonLdType: 'WebPage',
    sections: [
      {
        id: 'data-we-collect',
        heading: 'Données collectées',
        paragraphs: [
          'Nous ne collectons que les données nécessaires au fonctionnement du site, à la réponse aux messages et à la compréhension de son utilisation :',
        ],
        bullets: [
          'Les coordonnées que vous nous envoyez volontairement par courriel ou via le formulaire de contact lorsqu’il sera actif, telles que le nom, l’adresse électronique, l’objet et le message.',
          'Des informations techniques comme l’adresse IP, le type de navigateur, la page consultée et l’heure de la visite, dans les journaux techniques et de sécurité.',
          'Les données d’erreur collectées par Sentry, notamment le message d’erreur, le chemin de la page et le type d’appareil ou de navigateur.',
          'Les données d’audience collectées par Google Analytics 4 pour mesurer les visites et analyser l’interaction avec les contenus.',
          'Les témoins nécessaires à la langue, à la session administrative et à la sécurité, ainsi que le témoin de Google Analytics 4, chargé uniquement après votre accord.',
        ],
        note: 'Le formulaire de newsletter actuellement affiché est une maquette et ne stocke aucune adresse électronique tant qu’il n’est pas relié à un service d’envoi.',
      },
      {
        id: 'how-we-use',
        heading: 'Utilisation des données',
        paragraphs: ['Nous utilisons ces données uniquement pour :'],
        bullets: [
          'Répondre à vos messages et traiter les demandes de correction ou de partenariat.',
          'Assurer le fonctionnement du site, la gestion de la langue et la protection des comptes éditoriaux.',
          'Surveiller les erreurs techniques et améliorer la stabilité et les performances de la plateforme.',
          'Comprendre la performance des contenus à partir de données statistiques agrégées.',
        ],
      },
      {
        id: 'analytics',
        heading: 'Google Analytics 4',
        paragraphs: [
          'Nous utilisons Google Analytics 4 pour mesurer les visites et comprendre quelles pages sont les plus lues ainsi que le parcours des visiteurs. Ce programme ne se charge qu’après votre accord via le bandeau de confidentialité ; il ne s’exécute ni sur les pages d’administration ni sur les aperçus d’articles.',
          'Google peut utiliser des témoins ou des identifiants similaires pour collecter des informations telles que : les pages consultées, les actions effectuées sur le site, une zone géographique approximative déduite de l’adresse IP, le type de navigateur et d’appareil, la source de la visite et des identifiants statistiques qui ne vous identifient pas directement.',
          'Ces informations alimentent des rapports statistiques agrégés, dont la durée de conservation dépend des paramètres du compte Google Analytics. Nous ne les utilisons pas pour prendre des décisions individuelles affectant les visiteurs. Google peut traiter ces données dans d’autres pays, conformément à sa propre politique de confidentialité.',
          'Vous pouvez retirer ou modifier votre accord à tout moment via le lien « Paramètres des témoins » en bas de page. En cas de refus, le programme d’analyse n’est jamais chargé ; seuls les témoins nécessaires au fonctionnement du site restent actifs.',
        ],
        bullets: [
          'Les pages consultées, leurs titres et le temps passé.',
          'Les actions effectuées, comme l’ouverture d’un article ou le clic sur un lien.',
          'Des données techniques agrégées : navigateur, appareil, système d’exploitation et source de la visite.',
          'Une localisation approximative, à l’échelle de la ville ou de la région, déduite de l’adresse IP.',
        ],
        note: 'Certains outils de blocage de la publicité ou du suivi peuvent empêcher le chargement de l’analyse. Les chiffres de fréquentation doivent donc être lus comme un indicateur comparatif, et non comme une valeur absolue.',
      },
      {
        id: 'sentry',
        heading: 'Surveillance technique',
        paragraphs: [
          'Nous utilisons Sentry pour enregistrer les erreurs, suivre les performances et recueillir les commentaires des utilisateurs. Ces données peuvent inclure l’adresse IP, le type de navigateur, le chemin de la page et l’heure de l’événement.',
          'Nous n’utilisons pas Sentry pour enregistrer des sessions visuelles (Session Replay) et ne collectons pas de vidéos du comportement de navigation.',
        ],
      },
      {
        id: 'retention',
        heading: 'Durée de conservation',
        paragraphs: [
          'Nous conservons les données le temps nécessaire à la finalité pour laquelle elles ont été collectées :',
        ],
        bullets: [
          'Messages de contact : jusqu’à 12 mois, sauf s’ils sont liés à une demande encore en cours.',
          'Journaux techniques, journaux de sécurité et données d’erreur : jusqu’à 90 jours.',
          'Données des comptes éditoriaux : pendant toute la durée de vie du compte actif.',
          'Newsletter : jusqu’au désabonnement, une fois le service activé.',
          'Données Google Analytics : selon la durée de conservation configurée dans le compte d’analyse.',
        ],
      },
      {
        id: 'processors',
        heading: 'Traitants et services tiers',
        paragraphs: ['Vos données peuvent être traitées par les fournisseurs suivants :'],
        bullets: [
          'Vercel pour l’hébergement et la diffusion des pages.',
          'Le fournisseur de base de données utilisé par la plateforme Payload.',
          'Cloudflare R2 pour le stockage des images et médias.',
          'Sentry pour la surveillance des erreurs et des performances.',
          'Google / Google Analytics 4 pour l’analyse d’audience.',
          'Le fournisseur de messagerie lorsque nous répondons à vos messages ou activons la newsletter.',
        ],
      },
      {
        id: 'rights',
        heading: 'Vos droits',
        paragraphs: [
          'Vous pouvez demander l’accès à vos données, leur rectification ou leur suppression, vous opposer à leur traitement ou retirer votre consentement lorsque celui-ci s’applique. Envoyez votre demande à :',
        ],
        bullets: ['akarattv1@gmail.com'],
        note: 'Nous pouvons conserver certaines données en cas d’obligation légale ou de besoin de protéger la sécurité de la plateforme.',
      },
      {
        id: 'children',
        heading: 'Vie privée des enfants',
        paragraphs: [
          'Nous ne nous adressons pas aux enfants de moins de 16 ans et ne collectons pas sciemment leurs données via le site ou les formulaires.',
        ],
      },
      {
        id: 'changes',
        heading: 'Modifications de la politique',
        paragraphs: [
          'Nous pouvons mettre à jour cette politique si nos pratiques ou les services utilisés évoluent. La date de dernière mise à jour figure en haut de la page et la modification prend effet dès sa publication.',
        ],
      },
    ],
    title: 'Politique de confidentialité',
  },

  terms: {
    description:
      "Les conditions d'utilisation d'Akarat TV définissent les règles de navigation, les droits de propriété intellectuelle, l'avertissement financier et la limitation de responsabilité.",
    eyebrow: 'Politiques et conditions',
    intro:
      'En utilisant le site Akarat TV, vous acceptez ces conditions. Veuillez les lire attentivement ; si vous ne les acceptez pas, cessez d’utiliser le site.',
    jsonLdType: 'WebPage',
    sections: [
      {
        id: 'acceptance',
        heading: 'Acceptation des conditions',
        paragraphs: [
          'Ces conditions s’appliquent à toutes les pages du site et à son contenu. La poursuite de l’utilisation après une mise à jour vaut acceptation de la version modifiée.',
        ],
      },
      {
        id: 'acceptable-use',
        heading: 'Utilisation du site',
        paragraphs: ['Lors de votre utilisation du site, vous vous engagez à :'],
        bullets: [
          'Ne pas utiliser le site à des fins illégales ou contraires à l’ordre public.',
          'Ne pas tenter de compromettre la sécurité, de perturber le service ou d’envoyer des requêtes automatisées excessives.',
          'Ne pas transmettre d’informations fausses ou nuisibles via un formulaire ou un autre moyen de contact.',
          'Respecter les droits de propriété intellectuelle de la plateforme et des tiers.',
        ],
      },
      {
        id: 'intellectual-property',
        heading: 'Propriété intellectuelle',
        paragraphs: [
          'Les articles, éléments graphiques, logos et contenus publiés sur Akarat TV appartiennent à la plateforme ou à leurs ayants droit et sont protégés par les lois applicables.',
          'Une citation limitée est autorisée avec mention de la source et lien vers l’article original. La republication intégrale ou l’utilisation commerciale du contenu nécessite une autorisation écrite.',
        ],
      },
      {
        id: 'financial-disclaimer',
        heading: 'Avertissement financier',
        paragraphs: [
          'Le contenu publié sur Akarat TV est fourni à des fins d’information et d’analyse générale uniquement. Il ne constitue pas un conseil en investissement, financier ou juridique, ni une garantie de rendement.',
          'Les décisions immobilières et financières relèvent de la seule responsabilité du lecteur. Il est recommandé de consulter un professionnel qualifié avant toute décision financière ou d’investissement.',
          'Les prix, données et indicateurs peuvent évoluer après publication et nous ne garantissons pas la mise à jour permanente de chaque article.',
        ],
        note: 'Nous ne formulons aucune recommandation d’achat ou de vente d’actif et ne fournissons pas de services d’intermédiation financière.',
      },
      {
        id: 'liability',
        heading: 'Limitation de responsabilité',
        paragraphs: [
          'Nous déployons des efforts raisonnables pour assurer l’exactitude du contenu, mais nous ne garantissons ni son exhaustivité ni son adéquation à un usage particulier.',
          'Nous ne sommes pas responsables des dommages indirects résultant de l’utilisation des informations publiées, ni des interruptions de service dues à des causes hors de notre contrôle.',
        ],
      },
      {
        id: 'external-links',
        heading: 'Liens externes',
        paragraphs: [
          'Nos pages peuvent contenir des liens vers des sites tiers. Nous ne contrôlons ni leur contenu ni leurs politiques, et la présence d’un lien ne constitue pas une approbation.',
        ],
      },
      {
        id: 'user-content',
        heading: 'Contenus soumis par les utilisateurs',
        paragraphs: [
          'Si vous nous envoyez des commentaires, suggestions ou documents, vous nous autorisez à les utiliser pour vous répondre ou améliorer le contenu, dans le respect de vos droits et sans publier vos données privées sans accord.',
        ],
      },
      {
        id: 'changes',
        heading: 'Modification des conditions',
        paragraphs: [
          'Nous nous réservons le droit de modifier ces conditions à tout moment. La date actualisée figure en haut de la page et la modification prend effet à compter de sa publication.',
        ],
      },
      {
        id: 'law',
        heading: 'Droit applicable',
        paragraphs: [
          'Ces conditions et tout litige afférent sont soumis au droit marocain, sans préjudice des règles impératives applicables.',
        ],
      },
    ],
    title: "Conditions d'utilisation",
  },

  'editorial-policy': {
    description:
      "La politique éditoriale d'Akarat TV explique notre vérification des faits, notre traitement des corrections et du droit de réponse, et la séparation entre rédaction et publicité.",
    eyebrow: 'Politique éditoriale',
    intro:
      'Akarat TV s’engage en faveur d’un journalisme exact et indépendant. Cette politique définit les normes appliquées à la préparation, la publication et la correction des contenus.',
    jsonLdType: 'WebPage',
    sections: [
      {
        id: 'independence',
        heading: 'Indépendance éditoriale',
        paragraphs: [
          'Les décisions éditoriales reposent sur l’intérêt général et la crédibilité, et non sur des considérations commerciales ou des pressions extérieures.',
          'Les annonceurs et partenaires ne peuvent ni relire les articles rédactionnels avant publication ni imposer des modifications.',
        ],
      },
      {
        id: 'verification',
        heading: 'Vérification et sources',
        paragraphs: [
          'Nous privilégions les sources primaires lorsque cela est possible, comme les documents officiels, les données publiées et les déclarations documentées, et nous recherchons plusieurs sources pour les informations importantes.',
        ],
        bullets: [
          'Nous distinguons clairement l’information, l’analyse et l’opinion.',
          'Nous attribuons les citations à leurs auteurs et n’inventons jamais de propos ou de sources.',
          'Nous vérifions les chiffres et les dates avant publication et précisons les limites des données partielles.',
        ],
      },
      {
        id: 'corrections',
        heading: 'Corrections',
        paragraphs: [
          'Lorsque nous constatons une erreur professionnelle, nous la corrigeons aussi rapidement que possible et de façon transparente, généralement dans un délai de 14 jours après signalement ou découverte.',
          'Une note de correction explicite est ajoutée à l’article si nécessaire, et le titre ou le texte est ajusté pour refléter l’information exacte.',
          'Les demandes de correction peuvent être envoyées à akarattv1@gmail.com avec le lien de l’article et la source justificative.',
        ],
      },
      {
        id: 'right-of-reply',
        heading: 'Droit de réponse',
        paragraphs: [
          'Nous offrons une réponse équitable aux personnes ou entités mentionnées dans une couverture critique ou contestée, lorsque cette réponse est utile à la compréhension du sujet.',
          'La réponse est relue par la rédaction et publiée sous une forme adaptée, sans reformulation trompeuse.',
        ],
      },
      {
        id: 'conflicts',
        heading: 'Conflits d’intérêts',
        paragraphs: [
          'Les éditeurs et auteurs doivent signaler tout lien financier ou personnel susceptible d’influencer le traitement d’un sujet.',
          'En cas de conflit potentiel, un autre auteur est désigné ou une note d’information appropriée est ajoutée.',
        ],
      },
      {
        id: 'sponsored',
        heading: 'Contenus sponsorisés et publicité',
        paragraphs: [
          'Tout contenu sponsorisé, parrainé ou publicitaire est clairement signalé et séparé visuellement du contenu rédactionnel indépendant.',
          'Nous ne vendons ni sujets d’actualité ni couverture rédactionnelle, et la publicité n’influence pas le classement ou l’évaluation des informations.',
        ],
      },
      {
        id: 'ai',
        heading: 'Intelligence artificielle',
        paragraphs: [
          'Nous pouvons utiliser des outils d’intelligence artificielle pour des tâches d’aide comme l’organisation ou un résumé préliminaire, avec une relecture humaine complète avant publication.',
          'Nous ne publions pas de citations, sources ou chiffres générés automatiquement sans vérification, et nous n’utilisons pas l’intelligence artificielle pour usurper l’identité d’un journaliste ou d’une source.',
        ],
      },
      {
        id: 'anonymous-sources',
        heading: 'Sources anonymes',
        paragraphs: [
          'Nous recourons à des sources anonymes uniquement lorsqu’une information importante ne peut être obtenue publiquement, après évaluation de leur motivation et de leur crédibilité.',
          'Ces informations sont utilisées de manière limitée et après relecture éditoriale, et ne servent pas à formuler des accusations non étayées.',
        ],
      },
      {
        id: 'analysis',
        heading: 'Analyse et opinions',
        paragraphs: [
          'Les articles d’analyse et d’opinion sont clairement signalés et présentés comme un travail éditorial, et non comme une information confirmée.',
          'Nous cherchons à exposer les données disponibles et les hypothèses sur lesquelles repose l’analyse afin que le lecteur puisse l’évaluer.',
        ],
      },
      {
        id: 'privacy',
        heading: 'Vie privée dans le travail éditorial',
        paragraphs: [
          'Nous ne publions des données personnelles que lorsqu’elles présentent un intérêt public documenté, après une mise en balance attentive avec le droit à la vie privée.',
          'Nous protégeons l’identité de nos sources et empêchons tout accès non autorisé aux coordonnées que nous recevons.',
        ],
      },
    ],
    title: 'Politique éditoriale',
  },
}

export const infoContent: Record<Locale, Record<InfoPageSlug, InfoPageContent>> = {
  ar,
  fr,
}

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
