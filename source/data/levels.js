/* ═══════════════════════════════════════════════════════════════════
   Levels, tracks, can-do statements
   Can-do statements paraphrase the CEFR descriptors used by DELF/DALF.
   ═══════════════════════════════════════════════════════════════════ */
const LEVELS = {
  B1: { name: "B1 · Niveau seuil", desc: "Raconter, donner et justifier une opinion, se débrouiller avec assurance au quotidien." },
  B2: { name: "B2 · Niveau avancé", desc: "Argumenter, nuancer, suivre un débat et rédiger un texte structuré et convaincant." },
  C1: { name: "C1 · Niveau autonome", desc: "S'exprimer avec aisance et précision, synthétiser des documents, construire une argumentation complexe." }
};
const TRACKS = {
  recit: { t: "Raconter", en: "Raconter une histoire au passé" },
  phrase: { t: "Construire la phrase", en: "Pronoms, relatifs, négation" },
  futur: { t: "Projeter et supposer", en: "Futur, conditionnel, hypothèse" },
  opinion: { t: "Donner son avis", en: "Opinion, subjonctif, comparaison" },
  logique: { t: "Relier les idées", en: "Cause, conséquence, opposition, but" },
  style: { t: "Écrire et parler mieux", en: "Registre, discours rapporté, style" },
  argu: { t: "Argumenter", en: "Construire et défendre une position" },
  temps2: { t: "Maîtriser les temps", en: "Conditionnel passé, concordance des temps, antériorité" },
  phrase2: { t: "Phrases complexes", en: "Relatifs composés, passif, participes" },
  nuance: { t: "Nuancer", en: "Doute, modalisation, nuance" },
  ecrit: { t: "L'écrit soutenu", en: "Nominalisation, inversion, temps littéraires" },
  pensee: { t: "Penser en français", en: "Concession, hypothèse et précision au C1" },
  methode: { t: "Méthode DALF", en: "Synthèse, essai et exposé oral" }
};
const CANDO = [
  { lvl: "B1", t: "Je peux raconter une histoire ou une expérience au passé, avec le décor et les événements.", lessons: ["b1-pc-imp", "b1-pqp"] },
  { lvl: "B1", t: "Je peux parler de mes projets, de mes espoirs et de mes objectifs.", lessons: ["b1-futur", "b1-cond"] },
  { lvl: "B1", t: "Je peux donner mon opinion et la justifier.", lessons: ["b1-opinion", "b1-cause"] },
  { lvl: "B1", t: "Je peux exprimer des sentiments, des souhaits et des obligations avec le subjonctif.", lessons: ["b1-subj"] },
  { lvl: "B1", t: "Je peux éviter les répétitions avec les pronoms (le, lui, y, en).", lessons: ["b1-pronoms", "b1-y-en"] },
  { lvl: "B1", t: "Je peux relier des phrases avec qui, que, où et dont.", lessons: ["b1-relatifs"] },
  { lvl: "B1", t: "Je peux rapporter ce que quelqu'un a dit ou demandé.", lessons: ["b1-indirect"] },
  { lvl: "B1", t: "Je peux écrire une lettre ou un message de forum de 160 mots pour donner mon point de vue.", lessons: ["b1-ecrire"] },
  { lvl: "B2", t: "Je peux défendre un point de vue avec des arguments, des exemples et des contre-arguments.", lessons: ["b2-argu", "b2-concession"] },
  { lvl: "B2", t: "Je peux employer le subjonctif après les conjonctions (bien que, pour que, avant que…).", lessons: ["b2-subj"] },
  { lvl: "B2", t: "Je peux parler de ce qui aurait pu se passer (si + plus-que-parfait).", lessons: ["b2-condpasse"] },
  { lvl: "B2", t: "Je peux rapporter une conversation au passé avec les bons temps.", lessons: ["b2-concordance"] },
  { lvl: "B2", t: "Je peux exprimer avec précision la cause, la conséquence et le but.", lessons: ["b2-cause", "b2-but"] },
  { lvl: "B2", t: "Je peux écrire une lettre formelle ou un texte argumenté de 250 mots.", lessons: ["b2-lettre", "b2-argu"] },
  { lvl: "B2", t: "Je peux nuancer et exprimer le doute ou la certitude.", lessons: ["b2-doute"] },
  { lvl: "B2", t: "Je peux utiliser le passif et les participes pour écrire de façon plus concise.", lessons: ["b2-passif", "b2-participe"] },
  { lvl: "C1", t: "Je peux synthétiser plusieurs documents de façon objective, avec mes propres mots.", lessons: ["c1-synthese", "c1-nominal"] },
  { lvl: "C1", t: "Je peux rédiger un essai structuré, avec une problématique et un plan.", lessons: ["c1-essai"] },
  { lvl: "C1", t: "Je peux faire un exposé structuré de dix minutes et débattre avec un jury.", lessons: ["c1-expose"] },
  { lvl: "C1", t: "Je peux concéder et nuancer avec des structures avancées (avoir beau, quoique, si… que).", lessons: ["c1-concession"] },
  { lvl: "C1", t: "Je peux passer du registre familier au courant et au soutenu.", lessons: ["c1-registres"] },
  { lvl: "C1", t: "Je peux reconnaître les temps littéraires quand je lis.", lessons: ["c1-passesimple"] },
  { lvl: "C1", t: "Je peux modaliser mon discours (il se pourrait que, force est de constater…).", lessons: ["c1-modal"] },
  { lvl: "C1", t: "Je peux employer un vocabulaire précis et idiomatique au lieu de mots généraux.", lessons: ["c1-lexique"] }
];
const LESSONS = [];
const L = o => LESSONS.push(o);
