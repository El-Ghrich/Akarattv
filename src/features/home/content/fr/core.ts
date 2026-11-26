import { images } from '../images'
import type { HomeContent } from '../types'

export const frCore: Pick<
  HomeContent,
  'footer' | 'regions' | 'header' | 'hero' | 'heroZone' | 'latest' | 'videos'
> = {
  footer: {
    about: {
      links: [
        { href: '/about', label: 'Qui sommes-nous et notre mission' },
        { href: '/about#team', label: "L'équipe et la rédaction" },
        { href: '/editorial-policy', label: 'Charte déontologique' },
        { href: '/contact#advertising', label: 'Publicité et partenariats' },
        { href: '/contact#careers', label: 'Carrières et opportunités' },
      ],
      title: 'À propos',
    },
    cookieSettings: 'Paramètres des témoins',
    copyright: 'Tous droits réservés © 2026 Akarat TV.',
    description:
      "Le premier média indépendant spécialisé dans la couverture et l'analyse des marchés immobiliers, du financement et des réglementations d'investissement au Maroc et dans le monde arabe, avec une approche professionnelle rigoureuse.",
    policies: {
      links: [
        { href: '/contact', label: 'Contacter la rédaction' },
        { href: '/privacy', label: 'Politique de confidentialité' },
        { href: '/terms', label: "Conditions d'utilisation" },
        { href: '/terms#financial-disclaimer', label: 'Avertissement financier' },
        { absolute: true, href: '/sitemap.xml', label: 'Plan du site' },
      ],
      title: 'Politiques et contact',
    },
    regionsTitle: 'Régions',
    sectionsTitle: 'Rubriques',
    social: [
      { href: 'https://www.youtube.com/@AkaratTv', label: 'YouTube' },
      { href: 'https://www.facebook.com/Akarat.tv', label: 'Facebook' },
      { href: 'https://www.instagram.com/akarattv', label: 'Instagram' },
    ],
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
  videos: {
    subtitle:
      "Nos reportages et programmes exclusifs sur l'immobilier et l'investissement au Maroc",
    title: 'Vidéos Akarat TV',
  },
}
