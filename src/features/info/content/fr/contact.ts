import type { InfoPageContent } from '../types'

export const contact: InfoPageContent = {
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
}
