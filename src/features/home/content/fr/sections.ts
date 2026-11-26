import { images } from '../images'
import type { HomeContent } from '../types'

export const frSections: HomeContent['sections'] = [
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
]
