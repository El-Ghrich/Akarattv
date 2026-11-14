import { getPayload } from 'payload'

import config from '../src/payload.config'

/**
 * Seed script for regions, categories, an author, and five bilingual articles.
 *
 * Run with: npx payload run scripts/seed.ts
 *
 * It is safe to re-run: existing documents are matched by their Arabic slug
 * (or author slug) and updated instead of duplicated.
 */

type LocaleCode = 'ar' | 'fr'

type Block = {
  type: 'heading' | 'paragraph'
  text: string
}

type Localized<T> = Record<LocaleCode, T>

const payload = await getPayload({ config })

const lexical = (blocks: Block[], direction: 'ltr' | 'rtl') => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction,
    children: blocks.map((block) => ({
      type: block.type,
      ...(block.type === 'heading' ? { tag: 'h2' } : {}),
      format: '',
      indent: 0,
      version: 1,
      direction,
      textFormat: 0,
      textStyle: '',
      children: [
        {
          type: 'text',
          text: block.text,
          format: 0,
          detail: 0,
          mode: 'normal',
          style: '',
          version: 1,
        },
      ],
    })),
  },
})

const regions: Array<Localized<{ name: string; slug: string }>> = [
  {
    ar: { name: 'طنجة-تطوان - الحسيمة', slug: 'tanger-tetouan-al-hoceima' },
    fr: { name: 'Tanger-Tétouan-Al Hoceïma', slug: 'tanger-tetouan-al-hoceima' },
  },
  {
    ar: { name: 'الجهة الشرقية', slug: 'oriental' },
    fr: { name: "l'Oriental", slug: 'oriental' },
  },
  {
    ar: { name: 'فاس - مكناس', slug: 'fes-meknes' },
    fr: { name: 'Fès-Meknès', slug: 'fes-meknes' },
  },
  {
    ar: { name: 'الرباط-سلا - القنيطرة', slug: 'rabat-sale-kenitra' },
    fr: { name: 'Rabat-Salé-Kénitra', slug: 'rabat-sale-kenitra' },
  },
  {
    ar: { name: 'بني ملال - خنيفرة', slug: 'beni-mellal-khenifra' },
    fr: { name: 'Béni Mellal-Khénifra', slug: 'beni-mellal-khenifra' },
  },
  {
    ar: { name: 'الدار البيضاء - سطات', slug: 'casablanca-settat' },
    fr: { name: 'Casablanca-Settat', slug: 'casablanca-settat' },
  },
  {
    ar: { name: 'مراكش - أسفي', slug: 'marrakech-safi' },
    fr: { name: 'Marrakech-Safi', slug: 'marrakech-safi' },
  },
  {
    ar: { name: 'درعة - تافيلالت', slug: 'dara-tafilalt' },
    fr: { name: 'Drâa-Tafilalet', slug: 'dara-tafilalt' },
  },
  {
    ar: { name: 'سوس - ماسة', slug: 'souss-massa' },
    fr: { name: 'Souss-Massa', slug: 'souss-massa' },
  },
  {
    ar: { name: 'كلميم - واد نون', slug: 'guelmim-oued-noun' },
    fr: { name: 'Guelmim-Oued Noun', slug: 'guelmim-oued-noun' },
  },
  {
    ar: { name: 'العيون - الساقية الحمراء', slug: 'laayoune-sakia-el-hamra' },
    fr: { name: 'Laâyoune-Sakia El Hamra', slug: 'laayoune-sakia-el-hamra' },
  },
  {
    ar: { name: 'الداخلة - وادي الذهب', slug: 'dakhla-oued-ed-dahab' },
    fr: { name: 'Dakhla-Oued Ed Dahab', slug: 'dakhla-oued-ed-dahab' },
  },
]

const categories: Array<Localized<{ title: string; slug: string; description: string }>> = [
  {
    ar: {
      title: 'سكن اقتصادي',
      slug: 'سكن-اقتصادي',
      description: 'سكن بأسعار مناسبة يلائم الأسر ذات الدخل المحدود.',
    },
    fr: {
      title: 'Logement économique',
      slug: 'logement-economique',
      description: 'Des logements à prix accessible pour les primo-accédants.',
    },
  },
  {
    ar: {
      title: 'سكن متوسط',
      slug: 'سكن-متوسط',
      description: 'عرض متوازن بين السعر وجودة الحياة.',
    },
    fr: {
      title: 'Logement intermédiaire',
      slug: 'logement-intermediaire',
      description: 'Une offre équilibrée entre prix et qualité de vie.',
    },
  },
  {
    ar: {
      title: 'سكن عالي',
      slug: 'سكن-عالي',
      description: 'إقامات راقية وتشطيبات عالية الجودة.',
    },
    fr: {
      title: 'Logement haut standing',
      slug: 'logement-haut-standing',
      description: 'Résidences de prestige et finitions haut de gamme.',
    },
  },
  {
    ar: {
      title: 'بُقع أرضية',
      slug: 'بقع-أرضية',
      description: 'بقع أرضية صالحة للبناء لمشاريعك السكنية.',
    },
    fr: {
      title: 'Lots de terrain',
      slug: 'lots-de-terrain',
      description: 'Terrains constructibles pour vos projets résidentiels.',
    },
  },
  {
    ar: {
      title: 'محلات تجارية',
      slug: 'محلات-تجارية',
      description: 'محلات تجارية في مواقع مميزة لنشاطك.',
    },
    fr: {
      title: 'Locaux commerciaux',
      slug: 'locaux-commerciaux',
      description: 'Espaces commerciaux bien situés pour votre activité.',
    },
  },
  {
    ar: {
      title: 'تجزئات صناعية',
      slug: 'تجزئات-صناعية',
      description: 'مناطق وبقع مخصصة للأنشطة الصناعية.',
    },
    fr: {
      title: 'Lotissements industriels',
      slug: 'lotissements-industriels',
      description: 'Zones et lots dédiés aux activités industrielles.',
    },
  },
]

type ArticleSeed = Localized<{
  title: string
  slug: string
  excerpt: string
  content: Block[]
}> & {
  categorySlug: string
  regionSlug: string
  publishedAt: string
  isFeatured?: boolean
}

const articles: ArticleSeed[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // 1. Casablanca — logement intermédiaire
  // ───────────────────────────────────────────────────────────────────────────
  {
    categorySlug: 'logement-intermediaire',
    regionSlug: 'casablanca-settat',
    publishedAt: '2026-10-28T09:00:00.000Z',
    isFeatured: true,
    ar: {
      title: 'الدار البيضاء: كيف يتغير سوق العقار في 2026؟',
      slug: 'الدار-البيضاء-سوق-العقار-2026',
      excerpt:
        'من المتوقع أن يشهد سوق العقار في الدار البيضاء تحولات مهمة خلال 2026، بين ارتفاع الطلب على السكن المتوسط، وتطور مشاريع المدن الجديدة، وتحسن ظروف التمويل. قراءة تحليلية في المحركات الأربعة الأساسية لهذا التحول.',
      content: [
        { type: 'heading', text: 'لماذا تعتبر 2026 سنة مفصلية لسوق العقار في الدار البيضاء؟' },
        {
          type: 'paragraph',
          text: 'تشهد العاصمة الاقتصادية للمملكة تحولاً هيكلياً في سوق العقار، مدفوعاً بمزيج من النمو الديموغرافي، وتوسع الطبقة الوسطى، والاستثمارات الكبرى في البنية التحتية. ومن المتوقع أن تترك هذه العوامل أثراً واضحاً على الأسعار وأنماط الطلب خلال سنة 2026.',
        },
        {
          type: 'paragraph',
          text: 'فبعد سنوات من الركود النسبي الذي أعقب جائحة كوفيد-19، عاد القطاع العقاري إلى مسار النمو، وإن بشكل انتقائي؛ إذ يتركز الطلب على المنتجات المتوسطة الجودة ذات الأسعار المعقولة، في حين يظل الطلب على العقارات الفاخرة محصوراً في شرائح محدودة.',
        },
        { type: 'heading', text: 'طلب متزايد على السكن المتوسط' },
        {
          type: 'paragraph',
          text: 'يشهد القطاع تزايداً ملحوظاً في الطلب على الشقق ذات الأسعار المتوسطة، خصوصاً في الأحياء القريبة من المراكز الاقتصادية ومحطات النقل. فالأسر الشابة والموظفون في القطاع الخاص يبحثون عن سكن يوفق بين القرب من أماكن العمل وجودة الحياة وبين القدرة الشرائية المحدودة.',
        },
        {
          type: 'paragraph',
          text: 'ويشير المهنيون إلى أن هذا الطلب انعكس على نشاط البناء في مناطق مثل بوسكورة، ودار بوعزة، والنواصر، حيث تُطلق مشاريع سكنية جديدة بمواصفات عالية وأسعار تنافسية. في المقابل، يبقى عرض الشقق المتوسطة أقل من الطلب، ما قد يدفع الأسعار إلى الارتفاع التدريجي خلال الأشهر القادمة.',
        },
        { type: 'heading', text: 'التوسع العمراني والمدن الجديدة كمجال للاستثمار' },
        {
          type: 'paragraph',
          text: 'تلعب مشاريع المدن الجديدة دوراً محورياً في إعادة رسم الخريطة العقارية للدار البيضاء. فالمدينة الكبرى تعتمد على نموذج التوسع الأفقي عبر ضواحٍ جديدة، ما يفتح المجال أمام مشترين كانوا يستبعدون السكن في المركز بسبب الأسعار المرتفعة.',
        },
        {
          type: 'paragraph',
          text: 'ومن أبرز هذه المشاريع، المدينة الجديدة بالداخلة بضواحي النواصر، و"تامسنا" على محور الرباط، إضافة إلى مشاريع تهيئة الشريط الساحلي الجنوبي. غير أن هذه المشاريع تطرح تحديات تتعلق بتوفر المرافق العمومية في الوقت المناسب، وتأخر ربطها بشبكات النقل، ما قد يؤثر على جاذبيتها على المدى القصير.',
        },
        { type: 'heading', text: 'البنية التحتية ومحطات النقل كمحرك للأسعار' },
        {
          type: 'paragraph',
          text: 'يشكل تطوير شبكة النقل الحضري أحد أهم العوامل التي يعوّل عليها المشترون والمستثمرون على حد سواء. فامتداد خطوط الطرامواي والقطار الكهربائي السريع (RER) نحو الضواحي يرفع من قيمة العقارات القريبة من المحطات بشكل ملموس.',
        },
        {
          type: 'paragraph',
          text: 'وقد لوحظ في السنوات الأخيرة أن الأحياء المرتبطة بمحطات النقل الجديدة تشهد ارتفاعاً في الأسعار يتراوح بين 10% و20% خلال سنوات قليلة من تشغيل المحطة. وينصح الخبراء المشترين بأن يأخذوا في الحسبان خطط التهيئة المستقبلية لشبكة النقل عند تقييم أي عقار.',
        },
        { type: 'heading', text: 'التمويل وأسعار الفائدة' },
        {
          type: 'paragraph',
          text: 'لا يمكن الحديث عن سوق العقار دون التطرق إلى ظروف التمويل. فأسعار الفائدة على القروض العقارية تؤثر بشكل مباشر على قدرة الأسر على الاقتراض، وبالتالي على الطلب الفعلي على السكن. ومع تحسن مؤشرات الاقتصاد الكلي وانخفاض التضخم تدريجياً، يُتوقع أن تشهد أسعار الفائدة تحسناً نسبياً خلال 2026، ما قد يعيد بعض الزخم إلى سوق القروض.',
        },
        {
          type: 'paragraph',
          text: 'غير أن البنوك لا تزال حذرة في منح القروض، وتعتمد معايير صارمة لتقييم ملفات المقترضين، ما يجعل الحصول على تمويل عقاري تحدياً بالنسبة لبعض الفئات، خاصة الأسر الشابة التي لم تُكوّن بعد سجلاً ائتمانياً كافياً.',
        },
        { type: 'heading', text: 'خلاصة ونصائح للمشتري' },
        {
          type: 'paragraph',
          text: 'يمكن القول إن سوق الدار البيضاء في 2026 سوق انتقائي، يكافئ المشتري المطلع والمستعد جيداً. فالتخطيط المالي السليم، والتحقق من وضعية العقار القانونية، ومقارنة عدة عروض، هي خطوات لا غنى عنها.',
        },
        {
          type: 'paragraph',
          text: 'كما يُنصح بالمتابعة الدقيقة للمشاريع الكبرى الجاري إنجازها في محيط العقار المستهدف، لأنها المؤشر الأكثر موثوقية على تطور قيمته على المدى المتوسط.',
        },
      ],
    },
    fr: {
      title: 'Casablanca : comment le marché immobilier évolue en 2026',
      slug: 'casablanca-marche-immobilier-2026',
      excerpt:
        'Le marché immobilier casablancais devrait connaître des transformations majeures en 2026, portées par la demande de logements intermédiaires, les projets urbains et l’évolution des conditions de financement. Analyse des quatre moteurs de cette mutation.',
      content: [
        { type: 'heading', text: 'Pourquoi 2026 est une année charnière pour l’immobilier à Casablanca' },
        {
          type: 'paragraph',
          text: 'La capitale économique du Royaume connaît une transformation structurelle de son marché immobilier, portée par la croissance démographique, l’essor des classes moyennes et les grands investissements dans les infrastructures. Ces facteurs devraient laisser une empreinte visible sur les prix et les dynamiques de la demande en 2026.',
        },
        {
          type: 'paragraph',
          text: 'Après plusieurs années de relative atonie consécutive à la pandémie, le secteur immobilier a retrouvé le chemin de la croissance, mais de manière sélective : la demande se concentre sur les produits de gamme intermédiaire au rapport qualité-prix attractif, tandis que le segment du luxe reste limité à une clientèle restreinte.',
        },
        { type: 'heading', text: 'Une demande soutenue pour le logement intermédiaire' },
        {
          type: 'paragraph',
          text: 'Le marché enregistre une hausse marquée de la demande pour les appartements à prix intermédiaire, en particulier dans les quartiers proches des pôles économiques et des axes de transport. Les jeunes ménages et les salariés du privé recherchent un logement conciliant proximité du travail, qualité de vie et budget maîtrisé.',
        },
        {
          type: 'paragraph',
          text: 'Les professionnels observent que cette demande s’est traduite par une activité de construction soutenue dans des zones comme Bouskoura, Dar Bouazza et Nouaceur, où de nouveaux projets résidentiels sont lancés avec des standards élevés et des prix compétitifs. En revanche, l’offre de logements intermédiaires reste inférieure à la demande, ce qui pourrait pousser les prix à la hausse progressive dans les mois à venir.',
        },
        { type: 'heading', text: 'L’expansion urbaine et les nouvelles villes comme terrain d’investissement' },
        {
          type: 'paragraph',
          text: 'Les projets de villes nouvelles jouent un rôle central dans la recomposition de la carte immobilière casablancaise. Le Grand Casablanca mise sur un modèle d’expansion horizontale à travers de nouvelles périphéries, ouvrant la voie à des acquéreurs qui excluaient auparavant le centre en raison de prix prohibitifs.',
        },
        {
          type: 'paragraph',
          text: 'Parmi les projets phares figurent la nouvelle ville de Dakhla près de Nouaceur, Tamesna sur l’axe de Rabat, ainsi que les aménagements du littoral sud. Ces projets soulèvent toutefois des défis liés à la disponibilité en temps voulu des équipements publics et au raccordement aux réseaux de transport, ce qui peut affecter leur attractivité à court terme.',
        },
        { type: 'heading', text: 'Infrastructures et pôles de transport, moteurs des prix' },
        {
          type: 'paragraph',
          text: 'Le développement du réseau de transport urbain constitue l’un des principaux facteurs sur lesquels comptent acheteurs et investisseurs. L’extension des lignes de tramway et du RER vers les périphéries revalorise sensiblement les biens situés à proximité des stations.',
        },
        {
          type: 'paragraph',
          text: 'On a pu observer ces dernières années que les quartiers desservis par les nouvelles stations connaissent une hausse des prix comprise entre 10 % et 20 % en quelques années d’exploitation. Les experts conseillent aux acquéreurs de tenir compte des plans d’aménagement futurs du réseau de transport lors de l’évaluation d’un bien.',
        },
        { type: 'heading', text: 'Financement et taux d’intérêt' },
        {
          type: 'paragraph',
          text: 'On ne peut aborder le marché immobilier sans évoquer les conditions de financement. Les taux d’intérêt des crédits immobiliers influent directement sur la capacité d’emprunt des ménages, donc sur la demande effective de logements. Avec l’amélioration progressive des indicateurs macroéconomiques et la détente de l’inflation, une amélioration relative des taux est attendue en 2026, ce qui pourrait redonner un certain élan au marché du crédit.',
        },
        {
          type: 'paragraph',
          text: 'Les banques restent néanmoins prudentes dans l’octroi de crédits et appliquent des critères stricts d’évaluation des dossiers, ce qui rend l’obtention d’un financement immobilier difficile pour certaines catégories, en particulier les jeunes ménages qui n’ont pas encore constitué un historique de crédit suffisant.',
        },
        { type: 'heading', text: 'Conclusion et conseils à l’acheteur' },
        {
          type: 'paragraph',
          text: 'On peut affirmer que le marché casablancais de 2026 est un marché sélectif, qui récompense l’acheteur informé et bien préparé. Une planification financière rigoureuse, la vérification de la situation juridique du bien et la comparaison de plusieurs offres sont des étapes indispensables.',
        },
        {
          type: 'paragraph',
          text: 'Il est également recommandé de suivre attentivement les grands projets en cours autour du bien visé, car ils constituent l’indicateur le plus fiable de l’évolution de sa valeur à moyen terme.',
        },
      ],
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 2. Rabat — logement économique
  // ───────────────────────────────────────────────────────────────────────────
  {
    categorySlug: 'logement-economique',
    regionSlug: 'rabat-sale-kenitra',
    publishedAt: '2026-10-20T09:00:00.000Z',
    ar: {
      title: 'دليل شراء الشقق الاقتصادية في الرباط',
      slug: 'دليل-شراء-الشقق-الاقتصادية-الرباط',
      excerpt:
        'نصائح عملية لاختيار شقة اقتصادية في الرباط، من تحديد الميزانية الحقيقية إلى اختيار الحي، والتحقق من الوثائق، والاستفادة من برامج الدعم، وزيارة العقار وتقييمه.',
      content: [
        { type: 'heading', text: 'الميزانية قبل كل شيء' },
        {
          type: 'paragraph',
          text: 'قبل البدء في البحث عن شقة اقتصادية في الرباط، من الضروري تحديد الميزانية الإجمالية التي يمكنك تحملها. لا تقتصر الميزانية على سعر البيع فقط، بل تشمل أيضاً مصاريف التسجيل، وأتعاب الموثق، ورسوم الصيانة الشهرية، والتأمين، والضرائب المحلية.',
        },
        {
          type: 'paragraph',
          text: 'يُنصح بقاعدة عامة: ألا تتجاوز الأقساط الشهرية للقرض العقاري ثلث الدخل الصافي للأسرة، حتى تحافظ على هامش أمان مالي في مواجهة الظروف الطارئة. كما يجب التفكير في تكاليف التجهيز والتهيئة الداخلية، إذ يمكن أن تمثل ما بين 5% و10% من قيمة العقار.',
        },
        { type: 'heading', text: 'اختيار الحي المناسب' },
        {
          type: 'paragraph',
          text: 'الرباط مدينة متنوعة، ويختلف مستوى الأسعار من حي إلى آخر بشكل كبير. ففي حين تبقى أحياء مثل أكدال والرياض مرتفعة الثمن، توفر مناطق مثل سلا، وتمارة، والصخيرات، والتقدم خيارات أكثر ملاءمة للميزانيات المحدودة.',
        },
        {
          type: 'paragraph',
          text: 'عند اختيار الحي، يُنصح بدراسة القرب من مكان العمل، وتوفر المدارس والمرافق الصحية، ووسائل النقل، وجودة البنية التحتية بشكل عام. كما يُنصح بزيارة الحي في أوقات مختلفة من اليوم، وخاصة في المساء، للتعرف على طبيعته، وهدوئه، ومستوى الخدمات القريبة.',
        },
        { type: 'heading', text: 'الوثائق القانونية والتحقق منها' },
        {
          type: 'paragraph',
          text: 'قبل توقيع أي التزام، يجب التحقق من الوثائق القانونية للعقار. ويشمل ذلك شهادة الملكية (الرسم العقاري)، ورخصة السكن، ومحضر تسليم الأشغال، ودفاتر الالتزامات والتحملات الخاصة بالإقامة.',
        },
        {
          type: 'paragraph',
          text: 'من المهم أيضاً التأكد من عدم وجود رهون أو نزاعات قضائية على العقار، والحصول على شهادة سلبية من المحافظة العقارية. ويُنصح بالاستعانة بموثق معتمد لمراجعة الوثائق قبل التوقيع، لأن الخلل القانوني قد يكلف المشتري خسائر كبيرة.',
        },
        { type: 'heading', text: 'برامج الدعم والتمويل' },
        {
          type: 'paragraph',
          text: 'يمكن للمشتري الاستفادة من برامج الدعم الحكومي والصناديق المتخصصة، مثل صندوق الدعم السكني، الذي يمنح دعماً مباشراً للأسر ذات الدخل المتوسط. كما توفر البنوك المغربية منتجات تمويلية متنوعة تختلف من حيث نسبة الفائدة، ومدة القرض، ونسبة التمويل، ما يسمح للمشتري بمقارنة العروض واختيار الأنسب منها.',
        },
        {
          type: 'paragraph',
          text: 'ويُنصح بالحصول على موافقة مبدئية على القرض قبل الشروع في البحث الجدي، لأن ذلك يمنح المشتري تفويضاً واضحاً بشأن الميزانية المتاحة، ويسرّع المفاوضات مع البائع أو المطور العقاري.',
        },
        { type: 'heading', text: 'زيارة العقار وتقييمه' },
        {
          type: 'paragraph',
          text: 'عند زيارة الشقة، يجب التحقق من جودة التشطيبات، ومن حالة السباكة والكهرباء، ومن حجم الإضاءة الطبيعية والتهوية، ومن عزل الرطوبة والحرارة. كما يُنصح بفحص العزل الصوتي والرطوبة في الجدران والأسقف، والاستفسار عن حالة الأجزاء المشتركة والصيانة الدورية للإقامة.',
        },
        {
          type: 'paragraph',
          text: 'وفي الختام، فإن الشقة الاقتصادية الجيدة ليست الأرخص، بل تلك التي توفر أفضل توازن بين السعر والجودة والموقع وإمكانية إعادة البيع مستقبلاً. وهذا التوازن هو ما يحمي استثمارك على المدى الطويل.',
        },
      ],
    },
    fr: {
      title: 'Guide d’achat des appartements économiques à Rabat',
      slug: 'guide-appartements-economiques-rabat',
      excerpt:
        'Nos conseils pratiques pour choisir un appartement économique à Rabat : du budget réel à la vérification des documents, en passant par le choix du quartier, les aides publiques et la visite du bien.',
      content: [
        { type: 'heading', text: 'Le budget avant tout' },
        {
          type: 'paragraph',
          text: 'Avant de commencer la recherche d’un appartement économique à Rabat, il est indispensable de définir le budget global que vous pouvez supporter. Celui-ci ne se limite pas au prix de vente : il inclut aussi les frais d’enregistrement, les honoraires du notaire, les charges mensuelles de copropriété, l’assurance et les impôts locaux.',
        },
        {
          type: 'paragraph',
          text: 'On recommande en règle générale que les mensualités du crédit immobilier ne dépassent pas le tiers du revenu net du ménage, afin de conserver une marge de sécurité financière face aux imprévus. Il faut également anticiper les frais d’aménagement et d’équipement intérieur, qui peuvent représenter entre 5 % et 10 % de la valeur du bien.',
        },
        { type: 'heading', text: 'Bien choisir son quartier' },
        {
          type: 'paragraph',
          text: 'Rabat est une ville diversifiée, où le niveau des prix varie fortement d’un quartier à l’autre. Si des quartiers comme Agdal et Riad restent chers, des zones comme Salé, Témara, Skhirat et Takaddoum offrent des options plus adaptées aux budgets limités.',
        },
        {
          type: 'paragraph',
          text: 'Lors du choix du quartier, il est conseillé d’étudier la proximité du lieu de travail, la disponibilité des écoles et des structures de santé, les moyens de transport et la qualité générale des infrastructures. Il est également recommandé de visiter le quartier à différents moments de la journée, notamment le soir, pour en découvrir l’ambiance, le calme et le niveau des services de proximité.',
        },
        { type: 'heading', text: 'Les documents juridiques et leur vérification' },
        {
          type: 'paragraph',
          text: 'Avant toute signature, il faut vérifier les documents juridiques du bien : certificat de propriété (conservation foncière), permis d’habiter, procès-verbal de réception des travaux, et règlement de copropriété.',
        },
        {
          type: 'paragraph',
          text: 'Il importe aussi de s’assurer de l’absence d’hypothèques ou de litiges sur le bien, et d’obtenir un certificat négatif auprès de la conservation foncière. Il est recommandé de faire appel à un notaire de confiance pour examiner les documents avant signature, car un vice juridique peut coûter très cher à l’acquéreur.',
        },
        { type: 'heading', text: 'Aides et financement' },
        {
          type: 'paragraph',
          text: 'L’acquéreur peut bénéficier de programmes d’aide publique et de fonds dédiés, comme le Fonds d’aide au logement, qui accorde une aide directe aux ménages à revenu intermédiaire. Les banques marocaines proposent par ailleurs une gamme variée de produits de financement, qui diffèrent par le taux d’intérêt, la durée du crédit et le taux de financement, ce qui permet à l’acquéreur de comparer les offres et de choisir la plus adaptée.',
        },
        {
          type: 'paragraph',
          text: 'Il est conseillé d’obtenir un accord de principe de la banque avant de commencer une recherche sérieuse, car cela donne à l’acquéreur une vision claire du budget disponible et accélère les négociations avec le vendeur ou le promoteur.',
        },
        { type: 'heading', text: 'Visiter et évaluer le bien' },
        {
          type: 'paragraph',
          text: 'Lors de la visite, il faut vérifier la qualité des finitions, l’état de la plomberie et de l’électricité, la luminosité naturelle et la ventilation, ainsi que l’isolation contre l’humidité et la chaleur. Il est également recommandé de contrôler l’isolation phonique et l’humidité dans les murs et les plafonds, et de s’informer sur l’état des parties communes et l’entretien périodique de la résidence.',
        },
        {
          type: 'paragraph',
          text: 'En conclusion, un bon appartement économique n’est pas le moins cher, mais celui qui offre le meilleur équilibre entre prix, qualité, emplacement et potentiel de revente futur. C’est cet équilibre qui protège votre investissement sur le long terme.',
        },
      ],
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 3. Marrakech — logement haut standing
  // ───────────────────────────────────────────────────────────────────────────
  {
    categorySlug: 'logement-haut-standing',
    regionSlug: 'marrakech-safi',
    publishedAt: '2026-10-12T09:00:00.000Z',
    ar: {
      title: 'مراكش: الاستثمار في العقارات الفاخرة',
      slug: 'مراكش-الاستثمار-العقارات-الفاخرة',
      excerpt:
        'تظل مراكش وجهة مفضلة للاستثمار العقاري الفاخر بفضل جاذبيتها السياحية ومشاريعها الحديثة. دليل عملي لأنواع العقارات، والمناطق الواعدة، والعائد المتوقع، والمخاطر الواجب مراعاتها.',
      content: [
        { type: 'heading', text: 'لماذا يختار المستثمرون مراكش؟' },
        {
          type: 'paragraph',
          text: 'تجمع مراكش بين قوة الجذب السياحي والبنية التحتية الحديثة، ما يجعلها سوقاً جاذباً للعقارات الفاخرة على المستوى الوطني والدولي. وتُعزز هذه الجاذبية عوامل إضافية، منها المناخ المعتدل، والتراث الثقافي، والمطار الدولي الذي يربطها بأهم العواصم العالمية.',
        },
        {
          type: 'paragraph',
          text: 'كما أن الطلب على الإيجار السياحي قصير المدى يضيف مصدر دخل إضافياً للمستثمرين، ما يرفع من جاذبية الاستثمار العقاري في المدينة. غير أن هذه الجاذبية تستوجب دراسة دقيقة للسوق، لأن العائد المتوقع يختلف باختلاف المنطقة ونوع العقار.',
        },
        { type: 'heading', text: 'أنواع العقارات الفاخرة في مراكش' },
        {
          type: 'paragraph',
          text: 'تتنوع العقارات الفاخرة في مراكش بين الفيلات الحديثة ذات المسابح، والرياضات التقليدية في المدينة القديمة، والشقق الفاخرة داخل إقامات مغلقة. وتختلف كل فئة من حيث السعر والعائد والمخاطر، إذ توفر الفيلات الحديثة عائداً إيجارياً مرتفعاً لكن بتكاليف صيانة أعلى.',
        },
        {
          type: 'paragraph',
          text: 'أما الرياضات فتمثل فرصة استثمارية فريدة ترتبط بالتراث المعماري، وتجذب شريحة من السياح الباحثين عن تجربة أصيلة. في حين تجذب الشقق الفاخرة داخل الإقامات شريحة من المقيمين الأجانب والمغاربة المقيمين بالخارج، الباحثين عن الأمن والخدمات القريبة.',
        },
        { type: 'heading', text: 'المناطق الواعدة' },
        {
          type: 'paragraph',
          text: 'تشمل المناطق الواعدة للاستثمار الفاخر في مراكش النخيل، وتاركة، وأكافاي، والحي الشتوي، حيث تركز المشاريع الحديثة على الفيلات والإقامات الراقية. وتتميز منطقة النخيل بقربها من المطار والمرافق السياحية، ما يجعلها وجهة مفضلة للاستثمار الإيجاري.',
        },
        {
          type: 'paragraph',
          text: 'في حين يستهدف حي أكافاي شريحة الأعمال والمقيمين الدائمين. أما المدينة القديمة فتظل سوقاً متخصصاً يتطلب خبرة معمولية وقانونية، لكنه يقدم فرصاً فريدة لمن يعرف قواعد اللعبة.',
        },
        { type: 'heading', text: 'العائد على الاستثمار والمخاطر' },
        {
          type: 'paragraph',
          text: 'يتراوح العائد الإيجاري السنوي في مراكش عادة بين 4% و7% في العقارات الفاخرة، مع فروقات مرتبطة بالموقع ونوع العقار ومستوى الخدمات. غير أن هذا العائد يجب أن يوازن بين الإيجار الطويل الأمد، الذي يوفر استقراراً أكبر، والإيجار السياحي قصير المدى، الذي يقدم عائداً أعلى لكنه أكثر عرضة للتقلبات الموسمية.',
        },
        {
          type: 'paragraph',
          text: 'ومن المخاطر الواجب مراعاتها: تقلب الطلب السياحي، وتكاليف الصيانة المرتفعة، والتغيرات التنظيمية المتعلقة بالإيجار قصير المدى. كما يجب الحذر من المشاريع العقارية غير المكتملة أو غير المرخصة، والتحقق دائماً من وضعيتها القانونية قبل الاستثمار.',
        },
        { type: 'heading', text: 'نصائح للمستثمر' },
        {
          type: 'paragraph',
          text: 'يُنصح المستثمر بالاستعانة بخبير عقاري محلي لتقييم العقار والمنطقة، ودراسة السوق الإيجاري بعناية قبل الشراء. كما يجب التحقق من وضعية العقار القانونية، ومن رخصة البناء، ومن أي التزامات تتعلق بالتصميم الهيكلي، خاصة في العقارات القديمة.',
        },
        {
          type: 'paragraph',
          text: 'وأخيراً، فإن الاستثمار في مراكش يستدعي نظرة طويلة الأمد، وتركيزاً على الجودة والموقع بدل الاكتفاء بالسعر المنخفض. فالعقار الفاخر الجيد هو الذي يجمع بين الموقع الاستراتيجي والتشطيب المتقن وإمكانية التسويق الإيجاري.',
        },
      ],
    },
    fr: {
      title: 'Marrakech : investir dans l’immobilier haut standing',
      slug: 'marrakech-investissement-immobilier-haut-standing',
      excerpt:
        'Marrakech reste une destination privilégiée pour l’immobilier haut standing grâce à son attractivité touristique et ses projets récents. Guide pratique des types de biens, des zones prometteuses, du rendement attendu et des risques à considérer.',
      content: [
        { type: 'heading', text: 'Pourquoi les investisseurs choisissent Marrakech' },
        {
          type: 'paragraph',
          text: 'Marrakech combine la puissance d’attraction touristique et des infrastructures modernes, ce qui en fait un marché attractif pour l’immobilier haut de gamme, tant sur le plan national qu’international. Cette attractivité est renforcée par d’autres facteurs : un climat tempéré, un patrimoine culturel exceptionnel et un aéroport international la reliant aux grandes capitales mondiales.',
        },
        {
          type: 'paragraph',
          text: 'La demande locative touristique de courte durée ajoute par ailleurs une source de revenus supplémentaire pour les investisseurs, ce qui renforce l’attrait de l’immobilier dans la ville. Cette attractivité exige toutefois une étude fine du marché, car le rendement attendu varie selon la zone et le type de bien.',
        },
        { type: 'heading', text: 'Les types de biens haut standing à Marrakech' },
        {
          type: 'paragraph',
          text: 'L’immobilier haut standing à Marrakech se décline en villas modernes avec piscine, riads traditionnels dans la médina et appartements haut de gamme au sein de résidences fermées. Chaque catégorie diffère par le prix, le rendement et le risque : les villas modernes offrent un rendement locatif élevé mais des coûts d’entretien plus importants.',
        },
        {
          type: 'paragraph',
          text: 'Les riads représentent quant à eux une opportunité unique liée au patrimoine architectural, et attirent une clientèle de touristes en quête d’authenticité. Les appartements haut standing en résidence attirent une clientèle de résidents étrangers et de Marocains résidents à l’étranger, à la recherche de sécurité et de services de proximité.',
        },
        { type: 'heading', text: 'Les zones prometteuses' },
        {
          type: 'paragraph',
          text: 'Les zones prometteuses pour l’investissement haut standing à Marrakech incluent la Palmeraie, Targa, l’Agdal et l’Hivernage, où les projets récents se concentrent sur les villas et résidences de prestige. La Palmeraie se distingue par sa proximité avec l’aéroport et les infrastructures touristiques, ce qui en fait une destination privilégiée pour l’investissement locatif.',
        },
        {
          type: 'paragraph',
          text: 'L’Agdal cible quant à lui la clientèle d’affaires et les résidents permanents. La médina reste un marché de niche qui exige une expertise architecturale et juridique, mais qui offre des opportunités uniques à ceux qui en maîtrisent les règles.',
        },
        { type: 'heading', text: 'Rendement et risques' },
        {
          type: 'paragraph',
          text: 'Le rendement locatif annuel à Marrakech se situe généralement entre 4 % et 7 % dans le haut standing, avec des écarts liés à l’emplacement, au type de bien et au niveau de services. Ce rendement doit toutefois être mis en balance entre la location longue durée, plus stable, et la location touristique de courte durée, qui offre un rendement supérieur mais reste exposée aux variations saisonnières.',
        },
        {
          type: 'paragraph',
          text: 'Parmi les risques à considérer : la volatilité de la demande touristique, les coûts d’entretien élevés et l’évolution réglementaire concernant la location courte durée. Il faut aussi se méfier des projets inachevés ou non autorisés, et toujours vérifier la situation juridique du bien avant d’investir.',
        },
        { type: 'heading', text: 'Conseils à l’investisseur' },
        {
          type: 'paragraph',
          text: 'Il est recommandé à l’investisseur de s’appuyer sur un expert immobilier local pour évaluer le bien et le quartier, et d’étudier le marché locatif en amont de l’achat. Il convient aussi de vérifier la situation juridique du bien, le permis de construire et les éventuelles obligations liées au plan d’aménagement, en particulier pour les biens anciens.',
        },
        {
          type: 'paragraph',
          text: 'Enfin, l’investissement à Marrakech exige une vision à long terme et une priorité accordée à la qualité et à l’emplacement plutôt qu’au prix bas. Un bon bien haut standing est celui qui combine emplacement stratégique, finitions soignées et potentiel locatif.',
        },
      ],
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 4. Tanger — lots de terrain
  // ───────────────────────────────────────────────────────────────────────────
  {
    categorySlug: 'lots-de-terrain',
    regionSlug: 'tanger-tetouan-al-hoceima',
    publishedAt: '2026-10-05T09:00:00.000Z',
    ar: {
      title: 'كيف تختار بقعة أرضية مناسبة في طنجة؟',
      slug: 'اختيار-بقعة-أرضية-طنجة',
      excerpt:
        'من دراسة التصميم الهيكلي إلى التحقق من الوثائق القانونية ودراسة التربة، إليك الخطوات الأساسية قبل شراء أرض في طنجة، مع نصائح حول الالتزامات والتمويل.',
      content: [
        { type: 'heading', text: 'التصميم الهيكلي وقابلية البناء' },
        {
          type: 'paragraph',
          text: 'قبل شراء أي بقعة أرضية في طنجة، يجب التأكد أولاً من أن الأرض مدرجة في منطقة قابلة للبناء ضمن التصميم الهيكلي المعتمد. فبعض الأراضي قد تكون مصنفة كأراضٍ فلاحية أو غابوية أو محمية، ما يجعل بناؤها غير ممكن أو يتطلب إجراءات استثنائية.',
        },
        {
          type: 'paragraph',
          text: 'يُنصح بالحصول على شهادة التصميم الهيكلي من الجماعة أو الوكالة الحضرية، والتحقق من الاستعمالات المسموح بها داخل المنطقة، ومن معامل الاستغلال، ومن الارتفاعات المسموح بها، لأن كل هذه العناصر تحدد ما يمكنك بناؤه مستقبلاً.',
        },
        { type: 'heading', text: 'الوثائق والإجراءات القانونية' },
        {
          type: 'paragraph',
          text: 'تشمل الوثائق الأساسية التي يجب التحقق منها: الرسم العقاري (شهادة الملكية)، وشهادة الملكية الحديثة، وشهادة التصميم الهيكلي، ودفتر التحملات الخاص بالتجزئة إذا كانت الأرض ضمن تجزئة.',
        },
        {
          type: 'paragraph',
          text: 'ويجب أيضاً التأكد من عدم وجود رهون أو نزاعات قانونية على الأرض، والحصول على شهادة سلبية من المحافظة العقارية. ويُنصح بالاستعانة بموثق للتحقق من صحة الوثائق قبل التوقيع، فقد يكلف الإهمال في هذا الجانب المشتري خسائر كبيرة.',
        },
        { type: 'heading', text: 'دراسة التربة والطبوغرافيا' },
        {
          type: 'paragraph',
          text: 'لا يقل الجانب التقني أهمية عن الجانب القانوني، فالتربة والطبوغرافيا تؤثران بشكل مباشر على تكلفة البناء واستقرار المنشآت. يُنصح بإجراء دراسة جيوتقنية للتربة لمعرفة طبيعتها وقدرتها على تحمل الأساسات، خاصة في المناطق المنحدرة أو القريبة من الساحل.',
        },
        {
          type: 'paragraph',
          text: 'كما يجب التحقق من مستوى الماء الجوفي، ومن خطر الفيضانات، ومن انحدار الأرض الذي قد يستلزم أعمال تسوية مكلفة. هذه الدراسات قد تبدو تكلفة إضافية، لكنها تحمي من مفاجآت قد تصل إلى مئات الآلاف من الدراهم أثناء البناء.',
        },
        { type: 'heading', text: 'الالتزامات والرسوم' },
        {
          type: 'paragraph',
          text: 'يترتب على شراء الأرض مجموعة من الالتزامات والرسوم، منها رسوم التسجيل، والرسم العقاري، والرسوم البلدية، والضريبة على الأرباح العقارية عند البيع. وإذا كانت الأرض ضمن تجزئة، فقد تكون هناك التزامات تتعلق بتهيئة الطرق وشبكات الماء والكهرباء والصرف الصحي، وهو ما يجب التحقق منه قبل الشراء.',
        },
        {
          type: 'paragraph',
          text: 'كما يجب التأكد من أن الأرض غير خاضعة لالتزامات خاصة، مثل الارتفاقات أو التخصيص لأغراض معينة، أو القيود المرتبطة بالمناطق الساحلية أو الغابوية.',
        },
        { type: 'heading', text: 'التمويل والضمانات' },
        {
          type: 'paragraph',
          text: 'تمويل شراء الأرض يختلف عن تمويل السكن، إذ تقدم البنوك عادة نسبة تمويل أقل من قيمة الأرض مقارنة بالعقار المبني، وقد تطلب ضمانات إضافية. يُنصح بالحصول على موافقة مبدئية على التمويل قبل الشروع في البحث، لتحديد الميزانية المتاحة بدقة.',
        },
        {
          type: 'paragraph',
          text: 'وفي الختام، فإن شراء أرض ناجح هو الذي يوازن بين الموقع والسعر والوضعية القانونية والقابلية التقنية للبناء، وليس فقط بين السعر والمساحة. فالأرض الرخيصة التي تتطلب تكاليف تهيئة ضخمة قد تكون أغلى من أرض بسعر أعلى ولكن جاهزة للبناء.',
        },
      ],
    },
    fr: {
      title: 'Comment choisir un lot de terrain à Tanger ?',
      slug: 'choisir-lot-terrain-tanger',
      excerpt:
        'De l’étude du plan d’aménagement à la vérification des documents juridiques et à l’étude du sol, voici les étapes clés avant d’acheter un terrain à Tanger, avec des conseils sur les obligations et le financement.',
      content: [
        { type: 'heading', text: 'Le plan d’aménagement et la constructibilité' },
        {
          type: 'paragraph',
          text: 'Avant d’acheter un lot de terrain à Tanger, il faut d’abord s’assurer que le terrain est situé dans une zone constructible selon le plan d’aménagement en vigueur. Certains terrains peuvent être classés en zone agricole, forestière ou protégée, ce qui rend la construction impossible ou soumise à des procédures exceptionnelles.',
        },
        {
          type: 'paragraph',
          text: 'Il est recommandé d’obtenir un certificat de plan d’aménagement auprès de la commune ou de l’agence urbaine, et de vérifier les usages autorisés dans la zone, le coefficient d’occupation des sols et les hauteurs autorisées, car ces éléments déterminent ce que vous pourrez construire.',
        },
        { type: 'heading', text: 'Les documents et procédures juridiques' },
        {
          type: 'paragraph',
          text: 'Les documents essentiels à vérifier comprennent : le certificat de propriété (conservation foncière), le certificat de propriété récent, le certificat de plan d’aménagement et le cahier des charges du lotissement lorsque le terrain en fait partie.',
        },
        {
          type: 'paragraph',
          text: 'Il faut aussi s’assurer de l’absence d’hypothèques ou de litiges sur le terrain, et obtenir un certificat négatif auprès de la conservation foncière. Il est conseillé de faire appel à un notaire pour vérifier l’authenticité des documents avant signature, une négligence sur ce point pouvant coûter très cher à l’acquéreur.',
        },
        { type: 'heading', text: 'Étude du sol et topographie' },
        {
          type: 'paragraph',
          text: 'L’aspect technique n’est pas moins important que l’aspect juridique : la nature du sol et la topographie influent directement sur le coût de construction et la stabilité des ouvrages. Il est recommandé de réaliser une étude géotechnique du sol pour connaître sa nature et sa capacité à supporter les fondations, en particulier dans les zones en pente ou proches du littoral.',
        },
        {
          type: 'paragraph',
          text: 'Il faut également vérifier le niveau de la nappe phréatique, le risque d’inondation et la déclivité du terrain, qui peut nécessiter des travaux de nivellement coûteux. Ces études peuvent sembler représenter un surcoût, mais elles protègent contre des surprises qui peuvent se chiffrer en centaines de milliers de dirhams pendant la construction.',
        },
        { type: 'heading', text: 'Obligations et frais' },
        {
          type: 'paragraph',
          text: 'L’achat d’un terrain entraîne un ensemble d’obligations et de frais : droits d’enregistrement, taxe foncière, redevances communales et impôt sur les plus-values immobilières en cas de revente. Si le terrain fait partie d’un lotissement, des obligations peuvent porter sur l’aménagement des voiries et des réseaux d’eau, d’électricité et d’assainissement, à vérifier avant l’achat.',
        },
        {
          type: 'paragraph',
          text: 'Il convient également de s’assurer que le terrain n’est pas soumis à des contraintes particulières, telles que des servitudes, des affectations spécifiques, ou des restrictions liées aux zones littorales ou forestières.',
        },
        { type: 'heading', text: 'Financement et garanties' },
        {
          type: 'paragraph',
          text: 'Le financement de l’achat d’un terrain diffère de celui d’un logement : les banques accordent généralement un taux de financement inférieur à la valeur du terrain par rapport à un bien bâti, et peuvent exiger des garanties supplémentaires. Il est conseillé d’obtenir un accord de principe de financement avant de commencer la recherche, afin de définir précisément le budget disponible.',
        },
        {
          type: 'paragraph',
          text: 'En conclusion, un achat de terrain réussi est celui qui équilibre emplacement, prix, situation juridique et constructibilité technique, et non seulement prix et surface. Un terrain bon marché qui exige des travaux d’aménagement lourds peut coûter plus cher qu’un terrain mieux situé mais prêt à construire.',
        },
      ],
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 5. Agadir — locaux commerciaux
  // ───────────────────────────────────────────────────────────────────────────
  {
    categorySlug: 'locaux-commerciaux',
    regionSlug: 'souss-massa',
    publishedAt: '2026-09-28T09:00:00.000Z',
    ar: {
      title: 'أكادير: فرص واعدة في المحلات التجارية',
      slug: 'أكادير-فرص-المحلات-التجارية',
      excerpt:
        'مع النمو الحضري والحركة السياحية، تبرز المحلات التجارية في أكادير كخيار استثماري جدير بالدراسة. دليل عملي للموقع، والتراخيص، والمنافسة، والعائد، والعقد التجاري.',
      content: [
        { type: 'heading', text: 'الموقع والحركة' },
        {
          type: 'paragraph',
          text: 'يعتمد نجاح أي محل تجاري في أكادير على موقعه وقربه من حركة الزوار والمشاة، إضافة إلى سهولة الوصول إليه. فالمواقع القريبة من الكورنيش، والمراكز التجارية، والأسواق الكبرى، والمناطق السياحية، توفر حركة زوار أعلى، لكنها تتطلب أيضاً إيجارات أعلى.',
        },
        {
          type: 'paragraph',
          text: 'ويُنصح بدراسة الحركة في أوقات مختلفة من اليوم والأسبوع، ومراقبة تدفق المارة والسيارات قبل اتخاذ القرار. كما يجب التحقق من سهولة الوصول إلى المحل، ومن توفر مواقف السيارات، ومن وضوح الواجهة التجارية، لأن كل هذه العناصر تؤثر على جذب الزبائن.',
        },
        { type: 'heading', text: 'النشاط والتراخيص' },
        {
          type: 'paragraph',
          text: 'يحدد نوع النشاط المسموح به في المنطقة جدوى الاستثمار في المحل التجاري. فبعض المناطق مخصصة للأنشطة التجارية، وأخرى للأنشطة الخدمية أو السياحية، وثالثة مختلطة. قبل التوقيع على عقد الإيجار أو الشراء، يجب التحقق من رخصة النشاط، ومن إمكانية الحصول على التراخيص اللازمة من الجماعة أو الجهات المختصة.',
        },
        {
          type: 'paragraph',
          text: 'كما يجب التأكد من مطابقة المحل للمعايير التقنية المطلوبة في النشاط المستهدف، مثل التهوية، والسلامة، وإمكانية الوصول، والتجهيزات الصحية.',
        },
        { type: 'heading', text: 'المنافسة والسوق' },
        {
          type: 'paragraph',
          text: 'دراسة المنافسة في المنطقة المستهدفة خطوة أساسية لتقييم جدوى المشروع. فوجود منافسين قريبين قد يكون مؤشراً على حيوية السوق، لكنه قد يشكل تهديداً إذا كانت السوق مشبعة. يُنصح بدراسة نوع النشاط السائد في المنطقة، وحجم الطلب، وسلوك الزبائن، والموسمية المرتبطة بالنشاط السياحي.',
        },
        {
          type: 'paragraph',
          text: 'كما يمكن الاستعانة ببيانات الجماعة أو غرف التجارة للحصول على صورة أوضح عن دينامية المنطقة، وعن المشاريع التنموية المستقبلية التي قد تؤثر على جاذبيتها.',
        },
        { type: 'heading', text: 'العائد والتكاليف' },
        {
          type: 'paragraph',
          text: 'يعتمد العائد على الاستثمار في المحل التجاري على الفرق بين الإيجار أو سعر الشراء وبين الإيرادات المتوقعة من النشاط. ويجب أن تشمل دراسة الجدوى جميع التكاليف، من إيجار أو قرض، إلى التجهيز، والتأمين، والضرائب، والرسوم البلدية، وتكاليف الصيانة.',
        },
        {
          type: 'paragraph',
          text: 'ويُعتبر حساب فترة الاسترداد مؤشراً مهماً لاتخاذ القرار، وخاصة في الأنشطة التي تتطلب استثماراً أولياً كبيراً. كما يُنصح بالتفكير في المرونة المستقبلية للمحل، وإمكانية تغيير النشاط عند الحاجة، لأن ذلك يقلل من مخاطر الاستثمار.',
        },
        { type: 'heading', text: 'العقد والإجراءات' },
        {
          type: 'paragraph',
          text: 'عند إبرام عقد الإيجار التجاري، يجب الانتباه إلى مدة العقد، وشروط التجديد، والزيادة السنوية في الإيجار، ومسؤولية الصيانة والإصلاحات. وفي حالة الشراء، يجب التحقق من الرسم العقاري، والرخصة، ودفتر التحملات، وأي التزامات تتعلق بالإقامة أو التجزئة.',
        },
        {
          type: 'paragraph',
          text: 'ويُنصح دائماً بالاستعانة بمستشار قانوني لمراجعة العقد قبل التوقيع، وضمان حماية حقوق المستثمر على المدى الطويل. فبند واحد مهمل في العقد قد يكلفك خسائر كبيرة بعد سنوات من الاستغلال.',
        },
      ],
    },
    fr: {
      title: 'Agadir : des opportunités prometteuses dans les locaux commerciaux',
      slug: 'agadir-opportunites-locaux-commerciaux',
      excerpt:
        'Portée par la croissance urbaine et le tourisme, l’immobilier commercial à Agadir s’affirme comme une option d’investissement à étudier. Guide pratique de l’emplacement, des autorisations, du rendement et du bail commercial.',
      content: [
        { type: 'heading', text: 'Emplacement et flux' },
        {
          type: 'paragraph',
          text: 'La réussite d’un local commercial à Agadir dépend de son emplacement, de sa proximité avec les flux de visiteurs et de piétons, ainsi que de son accessibilité. Les emplacements proches de la corniche, des centres commerciaux, des grands marchés et des zones touristiques offrent une fréquentation plus élevée, mais exigent aussi des loyers plus élevés.',
        },
        {
          type: 'paragraph',
          text: 'Il est conseillé d’étudier les flux à différents moments de la journée et de la semaine, et d’observer le passage des piétons et des véhicules avant de prendre une décision. Il faut aussi vérifier la facilité d’accès au local, la disponibilité de stationnements et la visibilité de la façade, car ces éléments influencent directement l’attraction de la clientèle.',
        },
        { type: 'heading', text: 'Activité et autorisations' },
        {
          type: 'paragraph',
          text: 'Le type d’activité autorisé dans la zone détermine la viabilité de l’investissement dans le local. Certaines zones sont réservées aux activités commerciales, d’autres aux activités de services ou touristiques, d’autres encore sont mixtes. Avant de signer un bail ou un acte d’achat, il faut vérifier l’autorisation d’activité et la possibilité d’obtenir les autorisations nécessaires auprès de la commune ou des autorités compétentes.',
        },
        {
          type: 'paragraph',
          text: 'Il convient aussi de s’assurer que le local respecte les normes techniques requises pour l’activité visée, telles que la ventilation, la sécurité, l’accessibilité et les installations sanitaires.',
        },
        { type: 'heading', text: 'Concurrence et marché' },
        {
          type: 'paragraph',
          text: 'L’étude de la concurrence dans la zone ciblée est une étape essentielle pour évaluer la faisabilité du projet. La présence de concurrents proches peut être le signe d’un marché dynamique, mais peut aussi représenter une menace si le marché est saturé. Il est recommandé d’étudier le type d’activité dominant dans la zone, le volume de la demande, le comportement des clients et la saisonnalité liée au tourisme.',
        },
        {
          type: 'paragraph',
          text: 'On peut également s’appuyer sur les données de la commune ou des chambres de commerce pour obtenir une vision plus claire de la dynamique de la zone et des projets de développement futurs susceptibles d’affecter son attractivité.',
        },
        { type: 'heading', text: 'Rendement et coûts' },
        {
          type: 'paragraph',
          text: 'Le rendement d’un investissement dans un local commercial dépend de l’écart entre le loyer ou le prix d’achat et les revenus attendus de l’activité. L’étude de faisabilité doit intégrer l’ensemble des coûts : loyer ou crédit, aménagement, assurance, impôts, redevances communales et frais d’entretien.',
        },
        {
          type: 'paragraph',
          text: 'Le calcul de la période de retour sur investissement constitue un indicateur important de décision, en particulier pour les activités nécessitant un investissement initial important. Il est également conseillé de réfléchir à la flexibilité future du local et à sa capacité à accueillir une autre activité, ce qui réduit le risque de l’investissement.',
        },
        { type: 'heading', text: 'Contrat et procédures' },
        {
          type: 'paragraph',
          text: 'Lors de la conclusion d’un bail commercial, il convient de prêter attention à la durée du contrat, aux conditions de renouvellement, à la revalorisation annuelle du loyer et à la responsabilité des travaux d’entretien et de réparation. En cas d’achat, il faut vérifier le certificat de propriété, l’autorisation, le cahier des charges et toute obligation liée à la résidence ou au lotissement.',
        },
        {
          type: 'paragraph',
          text: 'Il est toujours recommandé de faire appel à un conseil juridique pour examiner le contrat avant signature, afin de garantir la protection des droits de l’investisseur sur le long terme. Une clause négligée peut entraîner des pertes importantes après plusieurs années d’exploitation.',
        },
      ],
    },
  },
]
const seedLocalizedCollection = async ({
  collection,
  data,
}: {
  collection: 'regions' | 'categories'
  data: Localized<Record<string, unknown>>
}) => {
  const arSlug = data.ar.slug as string
  const existing = await payload.find({
    collection,
    depth: 0,
    limit: 1,
    locale: 'ar',
    overrideAccess: true,
    where: { slug: { equals: arSlug } },
  })

  const arData = { ...data.ar } as any
  const frData = { ...data.fr } as any

  let id: number | string
  if (existing.docs[0]) {
    const updated = await payload.update({
      collection,
      data: arData,
      id: existing.docs[0].id,
      locale: 'ar',
      overrideAccess: true,
    })
    id = updated.id
  } else {
    const created = await payload.create({
      collection,
      data: arData,
      locale: 'ar',
      overrideAccess: true,
    })
    id = created.id
  }

  await payload.update({
    collection,
    data: frData,
    id,
    locale: 'fr',
    overrideAccess: true,
  })

  return id
}

const seedAuthor = async () => {
  const existing = await payload.find({
    collection: 'authors',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: 'akarattv' } },
  })

  const arData = {
    bio: 'محتوى تحريري حول العقار والسكن في المغرب.',
    jobTitle: 'فريق التحرير',
    name: 'أكارتيف',
    slug: 'akarattv',
  }

  const frData = {
    bio: 'Contenus éditoriaux sur l’immobilier et le logement au Maroc.',
    jobTitle: 'Équipe éditoriale',
    name: 'Akarattv',
    slug: 'akarattv',
  }

  let id: number | string
  if (existing.docs[0]) {
    const updated = await payload.update({
      collection: 'authors',
      data: arData,
      id: existing.docs[0].id,
      locale: 'ar',
      overrideAccess: true,
    })
    id = updated.id
  } else {
    const created = await payload.create({
      collection: 'authors',
      data: arData,
      locale: 'ar',
      overrideAccess: true,
    })
    id = created.id
  }

  await payload.update({
    collection: 'authors',
    data: frData,
    id,
    locale: 'fr',
    overrideAccess: true,
  })

  return id
}

const seedArticles = async ({
  authorID,
  categoryIDs,
  mediaID,
  regionIDs,
}: {
  authorID: number | string
  categoryIDs: Map<string, number | string>
  mediaID: number | string
  regionIDs: Map<string, number | string>
}) => {
  for (const article of articles) {
    const categoryID = categoryIDs.get(article.categorySlug)
    const regionID = regionIDs.get(article.regionSlug)

    if (!categoryID) throw new Error(`Missing category: ${article.categorySlug}`)
    if (!regionID) throw new Error(`Missing region: ${article.regionSlug}`)

    const existing = await payload.find({
      collection: 'articles',
      depth: 0,
      draft: true,
      limit: 1,
      locale: 'ar',
      overrideAccess: true,
      where: { slug: { equals: article.ar.slug } },
    })

    const arData = {
      _status: 'published' as const,
      author: authorID,
      category: categoryID,
      content: lexical(article.ar.content, 'rtl'),
      excerpt: article.ar.excerpt,
      heroImage: mediaID,
      isFeatured: article.isFeatured ?? false,
      publishedAt: article.publishedAt,
      region: regionID,
      slug: article.ar.slug,
      title: article.ar.title,
    }

    const frData = {
      _status: 'published' as const,
      content: lexical(article.fr.content, 'ltr'),
      excerpt: article.fr.excerpt,
      slug: article.fr.slug,
      title: article.fr.title,
    }

    let id: number | string
    if (existing.docs[0]) {
      const updated = await payload.update({
        collection: 'articles',
        data: arData as any,
        draft: false,
        id: existing.docs[0].id,
        locale: 'ar',
        overrideAccess: true,
      })
      id = updated.id
    } else {
      const created = await payload.create({
        collection: 'articles',
        data: arData as any,
        draft: false,
        locale: 'ar',
        overrideAccess: true,
      })
      id = created.id
    }

    await payload.update({
      collection: 'articles',
      data: frData as any,
      draft: false,
      id,
      locale: 'fr',
      overrideAccess: true,
    })

    console.log(`Seeded article: ${article.fr.title} (id ${id})`)
  }
}

const main = async () => {
  const media = await payload.findByID({
    collection: 'media',
    depth: 0,
    id: 1,
    overrideAccess: true,
  })

  const regionIDs = new Map<string, number | string>()
  for (const region of regions) {
    const id = await seedLocalizedCollection({ collection: 'regions', data: region })
    regionIDs.set(region.fr.slug, id)
    console.log(`Seeded region: ${region.fr.name} (id ${id})`)
  }

  const categoryIDs = new Map<string, number | string>()
  for (const category of categories) {
    const id = await seedLocalizedCollection({ collection: 'categories', data: category })
    categoryIDs.set(category.fr.slug, id)
    console.log(`Seeded category: ${category.fr.title} (id ${id})`)
  }

  const authorID = await seedAuthor()
  console.log(`Seeded author: Akarattv (id ${authorID})`)

  await seedArticles({
    authorID,
    categoryIDs,
    mediaID: media.id,
    regionIDs,
  })

  console.log('Seed complete.')
}

await main()
await payload.destroy()
process.exit(0)
