import type { InfoPageContent } from '../types'

export const about: InfoPageContent = {
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
}
