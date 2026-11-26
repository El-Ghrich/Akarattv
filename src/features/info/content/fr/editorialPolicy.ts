import type { InfoPageContent } from '../types'

export const editorialPolicy: InfoPageContent = {
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
}
