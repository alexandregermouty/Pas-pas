/* ═══════════════════════════════════════════════════════════════════
   Course companions — follow the structure (units, tasks, grammar,
   vocabulary, sounds) of Lan Anh's class books. All sentences and
   exercises are original; no text or audio from the books is copied.
   ═══════════════════════════════════════════════════════════════════ */
const COURSES = [
  { id: "cosmo3", t: "Cosmopolite 3", short: "Cosmopolite 3", pub: "Hachette FLE · B1", ic: "🌍", tint: "t-teal",
    desc: "Français général vers le DELF B1 : huit dossiers de quatre leçons.",
    units: [
      { id: "d1", short: "Dossier 1", t: "Dossier 1 · Vivre ailleurs", en: "S'expatrier, se loger, la ville" },
      { id: "d2", short: "Dossier 2", t: "Dossier 2 · Le quotidien à l'étranger", en: "Problèmes du quotidien, santé, démarches" },
      { id: "d3", short: "Dossier 3", t: "Dossier 3 · Sortir et partager", en: "Sorties, esprit d'équipe, famille, fêtes" },
      { id: "d4", short: "Dossier 4", t: "Dossier 4 · Agir autrement", en: "Vivre durablement, consommer autrement" },
      { id: "d5", short: "Dossier 5", t: "Dossier 5 · Études et travail", en: "Études, candidatures, expérience, métiers" },
      { id: "d6", short: "Dossier 6", t: "Dossier 6 · Les médias", en: "Presse, réseaux sociaux, fausses informations" },
      { id: "d7", short: "Dossier 7", t: "Dossier 7 · Innovation", en: "Jeunes talents, science, économie de l'innovation" },
      { id: "d8", short: "Dossier 8", t: "Dossier 8 · Arts et culture", en: "Art, spectacle vivant, cinéma, livres" }
    ] },
  { id: "oe2", t: "Objectif Express 2", short: "Objectif Express 2", pub: "Hachette FLE · français professionnel B1–B2", ic: "💼", tint: "t-orange",
    desc: "Français professionnel : collègues, réunions, vente, ressources humaines, projets, rapports.",
    units: [
      { id: "u1", short: "Unité 1", t: "Unité 1 · Nouveaux collaborateurs", en: "Rencontrer ses collègues, s'intégrer" },
      { id: "u2", short: "Unité 2", t: "Unité 2 · Produits et services", en: "Décrire et promouvoir une offre" },
      { id: "u3", short: "Unité 3", t: "Unité 3 · Organiser son travail", en: "Rendez-vous, réunions, comptes rendus" },
      { id: "u4", short: "Unité 4", t: "Unité 4 · Vendre", en: "Enquêtes, entretiens de vente, conditions de vente" },
      { id: "u5", short: "Unité 5", t: "Unité 5 · À l'international", en: "Missions à l'étranger, imprévus de voyage" },
      { id: "u6", short: "Unité 6", t: "Unité 6 · Événements professionnels", en: "Inviter, prononcer un discours, faire un bilan" },
      { id: "u7", short: "Unité 7", t: "Unité 7 · Travailler en collaboration", en: "Remue-méninges, documents partagés, planification" },
      { id: "u8", short: "Unité 8", t: "Unité 8 · Ressources humaines", en: "Contrats, entretien annuel, démission" },
      { id: "u9", short: "Unité 9", t: "Unité 9 · Litiges", en: "Réclamations et litiges" },
      { id: "u10", short: "Unité 10", t: "Unité 10 · Projets", en: "Rôles, cadrage, mesures correctives" },
      { id: "u11", short: "Unité 11", t: "Unité 11 · S'informer", en: "Conflit social, actualité économique, débat" },
      { id: "u12", short: "Unité 12", t: "Unité 12 · Rendre compte", en: "Rapports, audits, résultats" }
    ] }
];
