import type { InfoPageContent } from '../types'

export const terms: InfoPageContent = {
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
}
