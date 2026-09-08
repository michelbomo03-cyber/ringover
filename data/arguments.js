// Banque d'argumentaires par secteur — EA Plus Formation / EA Sup Alternance
// Chaque secteur = douleurs métier + arguments IA + autres formations pertinentes + objections types

module.exports = {
  Commerce: {
    opco: "OPCO EP",
    douleurs: [
      "Concurrence du e-commerce et des grandes enseignes",
      "Temps perdu sur les tâches administratives (facturation, relances, stocks)",
      "Difficulté à fidéliser et à personnaliser la relation client",
    ],
    argumentsIA: [
      "Un chatbot IA qui répond aux clients 24h/24 sur le site ou les réseaux sociaux, sans effectif supplémentaire",
      "Des outils de prévision des ventes et de gestion des stocks pilotés par IA pour éviter la rupture ou le surstock",
      "La génération automatique de fiches produits et de posts réseaux sociaux avec l'IA générative (gain de temps immédiat)",
      "Des recommandations produits personnalisées pour augmenter le panier moyen",
    ],
    autresFormations: [
      "Techniques de vente et négociation",
      "Management d'équipe en point de vente",
      "Digitalisation / e-commerce",
      "Anglais commercial",
    ],
  },

  Restauration: {
    opco: "AKTO (secteur HCR)",
    douleurs: [
      "Gaspillage alimentaire et gestion des coûts matières",
      "Réservations et avis clients chronophages à gérer",
      "Turnover du personnel et formation continue obligatoire (hygiène)",
    ],
    argumentsIA: [
      "Des outils IA de prévision d'affluence pour ajuster les commandes et réduire le gaspillage",
      "Un chatbot de réservation et de réponse automatisée aux avis clients (Google, TripAdvisor)",
      "L'optimisation de la carte et des prix par analyse des ventes",
      "La génération automatique de visuels et posts réseaux sociaux pour la communication",
    ],
    autresFormations: [
      "Hygiène alimentaire HACCP (obligatoire, à renouveler)",
      "Gestion des coûts et de la marge",
      "Management d'équipe en cuisine et en salle",
    ],
  },

  "Hôtellerie": {
    opco: "AKTO (secteur HCR)",
    douleurs: [
      "Yield management et tarification multi-plateformes (Booking, Airbnb, direct)",
      "Gestion de l'e-réputation et des avis clients",
      "Personnalisation de l'expérience client à grande échelle",
    ],
    argumentsIA: [
      "Le revenue management par IA : tarification dynamique optimisée automatiquement selon la demande",
      "Un chatbot conciergerie multilingue disponible 24h/24 pour les clients",
      "L'automatisation de la veille et de la réponse aux avis en ligne",
      "La personnalisation des offres et du parcours client grâce à l'analyse de données",
    ],
    autresFormations: [
      "Langues étrangères appliquées à l'accueil",
      "Relation client et accueil",
      "Sécurité incendie (obligatoire)",
      "Management hôtelier",
    ],
  },

  Construction: {
    opco: "Constructys",
    douleurs: [
      "Devis et métrés chronophages",
      "Suivi de chantier et coordination des équipes",
      "Pénurie de main d'œuvre qualifiée",
      "Charge administrative et veille réglementaire",
    ],
    argumentsIA: [
      "Des outils IA pour générer des devis et métrés automatiquement à partir de plans",
      "La planification et le suivi de chantier assistés par IA (délais, ressources)",
      "La détection d'anomalies et de risques sécurité par analyse d'images (drones, photos chantier)",
      "L'automatisation de la veille réglementaire et des tâches administratives",
    ],
    autresFormations: [
      "CACES et habilitations sécurité (obligatoires)",
      "Gestion de chantier et lecture de plans",
      "Management d'équipe BTP",
    ],
  },

  "Commerce (artisanat alimentaire)": {
    opco: "OPCO EP",
    douleurs: [
      "Gestion des stocks de produits frais et anticipation de la demande",
      "Concurrence de la grande distribution",
      "Temps limité pour la communication et le digital",
    ],
    argumentsIA: [
      "Prévision de la demande par IA pour limiter les pertes sur produits frais",
      "Génération automatique de contenus pour les réseaux sociaux (annonces, promos)",
      "Chatbot pour la prise de commandes en ligne",
    ],
    autresFormations: [
      "Hygiène alimentaire",
      "Techniques de vente en boutique",
      "Digitalisation / vente en ligne",
    ],
  },
};

// Objections fréquentes (génériques, tous secteurs)
module.exports.objectionsGenerales = [
  {
    objection: "Je n'ai pas le temps de me former",
    reponse: "Les parcours EA Plus Formation sont modulaires et peuvent être suivis en petites sessions, y compris à distance. On adapte au rythme de l'entreprise.",
  },
  {
    objection: "Je n'y connais rien en IA",
    reponse: "La formation est conçue pour les débutants : prise en main pratique, cas concrets du métier, aucun prérequis technique.",
  },
  {
    objection: "Ça doit coûter cher",
    reponse: "La formation peut être financée via l'OPCO dont dépend l'entreprise (voir OPCO indiqué), parfois sans reste à charge selon l'effectif et les droits disponibles.",
  },
  {
    objection: "On verra plus tard",
    reponse: "Les budgets de formation OPCO sont souvent annuels : mieux vaut mobiliser les droits disponibles avant qu'ils ne soient perdus.",
  },
];
