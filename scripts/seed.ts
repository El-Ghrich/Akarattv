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
  {
    categorySlug: 'logement-intermediaire',
    regionSlug: 'casablanca-settat',
    publishedAt: '2026-10-28T09:00:00.000Z',
    isFeatured: true,
    ar: {
      title: 'الدار البيضاء: كيف يتغير سوق العقار في 2026؟',
      slug: 'الدار-البيضاء-سوق-العقار-2026',
      excerpt:
        'من المتوقع أن يشهد سوق العقار في الدار البيضاء تحولات مهمة خلال 2026، بين ارتفاع الطلب على السكن المتوسط وتطور مشاريع المدن الجديدة.',
      content: [
        { type: 'heading', text: 'طلب متزايد على السكن المتوسط' },
        {
          type: 'paragraph',
          text: 'تشهد الدار البيضاء طلباً متزايداً على الشقق ذات الأسعار المتوسطة، خاصة في الأحياء القريبة من المراكز الاقتصادية ومحطات النقل.',
        },
        {
          type: 'paragraph',
          text: 'ويرى المهنيون أن سنة 2026 ستكون فرصة للمشترين الذين يبحثون عن توازن بين السعر وجودة الحياة، مع توقع إطلاق مشاريع جديدة في الضواحي.',
        },
      ],
    },
    fr: {
      title: 'Casablanca : comment le marché immobilier évolue en 2026',
      slug: 'casablanca-marche-immobilier-2026',
      excerpt:
        'Le marché immobilier casablancais devrait connaître des transformations majeures en 2026, portées par la demande de logements intermédiaires et les nouveaux projets urbains.',
      content: [
        { type: 'heading', text: 'Une demande soutenue pour le logement intermédiaire' },
        {
          type: 'paragraph',
          text: 'Casablanca connaît une demande croissante pour les appartements à prix intermédiaire, notamment dans les quartiers proches des pôles économiques et des axes de transport.',
        },
        {
          type: 'paragraph',
          text: "Les professionnels estiment que 2026 offrira de belles opportunités aux acquéreurs en quête d'un équilibre entre budget et qualité de vie, avec de nouveaux projets attendus en périphérie.",
        },
      ],
    },
  },
  {
    categorySlug: 'logement-economique',
    regionSlug: 'rabat-sale-kenitra',
    publishedAt: '2026-10-20T09:00:00.000Z',
    ar: {
      title: 'دليل شراء الشقق الاقتصادية في الرباط',
      slug: 'دليل-شراء-الشقق-الاقتصادية-الرباط',
      excerpt:
        'نصائح عملية لاختيار شقة اقتصادية في الرباط، من تحديد الميزانية إلى التحقق من الوثائق والموقع.',
      content: [
        { type: 'heading', text: 'حدد ميزانيتك قبل البحث' },
        {
          type: 'paragraph',
          text: 'ابدأ بتحديد المبلغ الإجمالي الذي يمكنك تحمله، بما في ذلك مصاريف التسجيل والرسوم الشهرية.',
        },
        {
          type: 'paragraph',
          text: 'بعد ذلك قارن بين الأحياء من حيث القرب من العمل والمدارس ووسائل النقل، ولا تنسَ التحقق من وثائق الملكية.',
        },
      ],
    },
    fr: {
      title: 'Guide d’achat des appartements économiques à Rabat',
      slug: 'guide-appartements-economiques-rabat',
      excerpt:
        'Nos conseils pratiques pour choisir un appartement économique à Rabat, du budget à la vérification des documents et de l’emplacement.',
      content: [
        { type: 'heading', text: 'Définir son budget avant de chercher' },
        {
          type: 'paragraph',
          text: "Commencez par déterminer le montant total que vous pouvez supporter, frais d'enregistrement et charges mensuelles inclus.",
        },
        {
          type: 'paragraph',
          text: 'Comparez ensuite les quartiers selon la proximité du travail, des écoles et des transports, sans oublier de vérifier les documents de propriété.',
        },
      ],
    },
  },
  {
    categorySlug: 'logement-haut-standing',
    regionSlug: 'marrakech-safi',
    publishedAt: '2026-10-12T09:00:00.000Z',
    ar: {
      title: 'مراكش: الاستثمار في العقارات الفاخرة',
      slug: 'مراكش-الاستثمار-العقارات-الفاخرة',
      excerpt:
        'تظل مراكش وجهة مفضلة للاستثمار العقاري الفاخر بفضل جاذبيتها السياحية ومشاريعها الحديثة.',
      content: [
        { type: 'heading', text: 'لماذا يختار المستثمرون مراكش؟' },
        {
          type: 'paragraph',
          text: 'تجمع مراكش بين الطلب السياحي القوي والبنية التحتية المتطورة، ما يجعلها سوقاً جاذباً للعقارات الفاخرة.',
        },
        {
          type: 'paragraph',
          text: 'وينصح الخبراء بالتركيز على جودة التشطيب والموقع والقرب من المرافق، بدل الاكتفاء بالسعر المنخفض.',
        },
      ],
    },
    fr: {
      title: 'Marrakech : investir dans l’immobilier haut standing',
      slug: 'marrakech-investissement-immobilier-haut-standing',
      excerpt:
        'Marrakech reste une destination privilégiée pour l’immobilier haut standing grâce à son attractivité touristique et ses projets récents.',
      content: [
        { type: 'heading', text: 'Pourquoi les investisseurs choisissent Marrakech' },
        {
          type: 'paragraph',
          text: 'Marrakech combine une forte demande touristique et des infrastructures modernes, ce qui en fait un marché attractif pour le haut standing.',
        },
        {
          type: 'paragraph',
          text: "Les experts recommandent de privilégier la qualité des finitions, l'emplacement et la proximité des commodités plutôt qu'un prix bas.",
        },
      ],
    },
  },
  {
    categorySlug: 'lots-de-terrain',
    regionSlug: 'tanger-tetouan-al-hoceima',
    publishedAt: '2026-10-05T09:00:00.000Z',
    ar: {
      title: 'كيف تختار بقعة أرضية مناسبة في طنجة؟',
      slug: 'اختيار-بقعة-أرضية-طنجة',
      excerpt:
        'من دراسة التصميم الهيكلي إلى التحقق من التزامات التهيئة، إليك الخطوات الأساسية قبل شراء أرض في طنجة.',
      content: [
        { type: 'heading', text: 'تحقق من التصميم الهيكلي' },
        {
          type: 'paragraph',
          text: 'قبل الشراء تأكد من أن البقعة الأرضية مدرجة في منطقة قابلة للبناء ومناسبة لنوع المشروع الذي تخطط له.',
        },
        {
          type: 'paragraph',
          text: 'اطلب أيضاً شهادة الملكية وراجع الالتزامات المرتبطة بالتهيئة والتجزئة مع الجهات المختصة.',
        },
      ],
    },
    fr: {
      title: 'Comment choisir un lot de terrain à Tanger ?',
      slug: 'choisir-lot-terrain-tanger',
      excerpt:
        'De l’étude du plan d’aménagement à la vérification des obligations d’urbanisme, voici les étapes clés avant d’acheter un terrain à Tanger.',
      content: [
        { type: 'heading', text: 'Vérifier le plan d’aménagement' },
        {
          type: 'paragraph',
          text: "Avant l'achat, assurez-vous que le lot se situe dans une zone constructible et qu'il convient au type de projet envisagé.",
        },
        {
          type: 'paragraph',
          text: "Demandez également le certificat de propriété et vérifiez les obligations liées à l'aménagement et au lotissement auprès des autorités compétentes.",
        },
      ],
    },
  },
  {
    categorySlug: 'locaux-commerciaux',
    regionSlug: 'souss-massa',
    publishedAt: '2026-09-28T09:00:00.000Z',
    ar: {
      title: 'أكادير: فرص واعدة في المحلات التجارية',
      slug: 'أكادير-فرص-المحلات-التجارية',
      excerpt:
        'مع النمو الحضري والحركة السياحية، تبرز المحلات التجارية في أكادير كخيار استثماري جدير بالدراسة.',
      content: [
        { type: 'heading', text: 'موقع المحل يصنع الفرق' },
        {
          type: 'paragraph',
          text: 'يعتمد نجاح أي محل تجاري في أكادير على موقعه وقربه من حركة الزوار والمشاة، إضافة إلى سهولة الوصول إليه.',
        },
        {
          type: 'paragraph',
          text: 'قبل الاستثمار، ادرس كثافة المنافسة ونوع النشاط المسموح به في المنطقة، وقدّر العائد المتوقع على المدى المتوسط.',
        },
      ],
    },
    fr: {
      title: 'Agadir : des opportunités prometteuses dans les locaux commerciaux',
      slug: 'agadir-opportunites-locaux-commerciaux',
      excerpt:
        'Portée par la croissance urbaine et le tourisme, l’immobilier commercial à Agadir s’affirme comme une option d’investissement à étudier.',
      content: [
        { type: 'heading', text: 'L’emplacement fait la différence' },
        {
          type: 'paragraph',
          text: "La réussite d'un local commercial à Agadir dépend de son emplacement, de sa proximité avec les flux de visiteurs et de piétons, ainsi que de son accessibilité.",
        },
        {
          type: 'paragraph',
          text: "Avant d'investir, étudiez la concurrence et le type d'activité autorisé dans la zone, puis estimez le rendement attendu à moyen terme.",
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
