import type { InfoPageContent } from '../types'

export const privacy: InfoPageContent = {
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
        'Les témoins nécessaires à la langue, à la session administrative et à la sécurité. Le conteneur Google Tag Manager, qui héberge la balise Google Analytics 4, est chargé sur les pages publiques avec tous les stockages refusés par défaut : aucun témoin d’analyse n’est déposé avant votre accord, et des mesures sans témoins sont envoyées en cas de refus ou d’absence de choix.',
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
        'Nous utilisons un conteneur Google Tag Manager pour diffuser la balise Google Analytics 4, qui mesure les visites et permet de comprendre quelles pages sont les plus lues ainsi que le parcours des visiteurs. Nous appliquons le « mode de consentement avancé » de Google (Consent Mode v2) : le conteneur est chargé sur les pages publiques après avoir refusé tous les stockages par défaut, donc aucun témoin d’analyse n’est déposé avant votre choix. En cas de refus ou d’absence d’interaction avec le bandeau, Google reçoit des signaux de mesure sans témoins ni identifiant de suivi, utilisés pour des statistiques agrégées et la modélisation. Le conteneur ne s’exécute ni sur les pages d’administration ni sur les aperçus d’articles.',
        'Après votre accord seulement, Google peut utiliser des témoins ou des identifiants similaires pour collecter des informations telles que : les pages consultées, les actions effectuées sur le site, une zone géographique approximative déduite de l’adresse IP, le type de navigateur et d’appareil, la source de la visite et des identifiants statistiques qui ne vous identifient pas directement. En cas de refus, seules des données agrégées limitées sont transmises, sans dépôt de témoins.',
        'Ces informations alimentent des rapports statistiques agrégés, dont la durée de conservation dépend des paramètres du compte Google Analytics. Nous ne les utilisons pas pour prendre des décisions individuelles affectant les visiteurs. Google peut traiter ces données dans d’autres pays, conformément à sa propre politique de confidentialité.',
        'Vous pouvez retirer ou modifier votre accord à tout moment via le lien « Paramètres des témoins » en bas de page. Lors d’un retrait ou d’un refus, Google cesse d’écrire des témoins d’analyse et revient aux signaux de mesure sans traceur ; seuls les témoins nécessaires au fonctionnement du site restent actifs.',
      ],
      bullets: [
        'Les pages consultées, leurs titres et le temps passé.',
        'Les actions effectuées, comme l’ouverture d’un article ou le clic sur un lien.',
        'Des données techniques agrégées : navigateur, appareil, système d’exploitation et source de la visite.',
        'Une localisation approximative, à l’échelle de la ville ou de la région, déduite de l’adresse IP.',
        'Des signaux de mesure sans témoins en cas de refus ou d’absence de choix, utilisés uniquement pour des statistiques agrégées.',
      ],
      note: 'Certains outils de blocage de la publicité ou du suivi peuvent empêcher le chargement du conteneur ou de l’analyse. Les chiffres de fréquentation doivent donc être lus comme un indicateur comparatif, et non comme une valeur absolue.',
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
        'Google / Google Tag Manager et Google Analytics 4 pour la diffusion des balises d’audience.',
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
}
