/* ═══════════════════════════════════════════════════════════════════
   Levels, tracks, can-do statements
   Can-do statements paraphrase the CEFR descriptors used by DELF/DALF.
   ═══════════════════════════════════════════════════════════════════ */
const LEVELS = {
  B1: { name: "B1 · Niveau seuil", desc: "Tell a story, give and justify an opinion, handle everyday situations with confidence." },
  B2: { name: "B2 · Niveau avancé", desc: "Argue, nuance, follow a debate and write a structured, convincing text." },
  C1: { name: "C1 · Niveau autonome", desc: "Express yourself fluently and precisely, synthesise documents, build a complex argument." }
};
const TRACKS = {
  recit: { t: "Raconter", en: "Telling a story in the past" },
  phrase: { t: "Construire la phrase", en: "Pronouns, relatives, negation" },
  futur: { t: "Projeter et supposer", en: "Future, conditional, hypothesis" },
  opinion: { t: "Donner son avis", en: "Opinion, subjunctive, comparing" },
  logique: { t: "Relier les idées", en: "Cause, consequence, contrast, purpose" },
  style: { t: "Écrire et parler mieux", en: "Register, reported speech, style" },
  argu: { t: "Argumenter", en: "Building and defending a position" },
  temps2: { t: "Maîtriser les temps", en: "Past conditional, sequence of tenses, anteriority" },
  phrase2: { t: "Phrases complexes", en: "Compound relatives, passive, participles" },
  nuance: { t: "Nuancer", en: "Doubt, modality, hedging" },
  ecrit: { t: "L'écrit soutenu", en: "Nominalisation, inversion, literary tenses" },
  pensee: { t: "Penser en français", en: "Concession, hypothesis and precision at C1" },
  methode: { t: "Méthode DALF", en: "Synthesis, essay and oral presentation" }
};
const CANDO = [
  { lvl: "B1", t: "I can tell a story or an experience in the past, with the background and the events.", lessons: ["b1-pc-imp", "b1-pqp"] },
  { lvl: "B1", t: "I can talk about my plans, hopes and goals.", lessons: ["b1-futur", "b1-cond"] },
  { lvl: "B1", t: "I can give my opinion and justify it with reasons.", lessons: ["b1-opinion", "b1-cause"] },
  { lvl: "B1", t: "I can express feelings, wishes and obligations with the subjunctive.", lessons: ["b1-subj"] },
  { lvl: "B1", t: "I can avoid repetition with pronouns (le, lui, y, en).", lessons: ["b1-pronoms", "b1-y-en"] },
  { lvl: "B1", t: "I can link sentences with qui, que, où and dont.", lessons: ["b1-relatifs"] },
  { lvl: "B1", t: "I can report what someone said or asked.", lessons: ["b1-indirect"] },
  { lvl: "B1", t: "I can write a 160-word letter or forum post giving my point of view.", lessons: ["b1-ecrire"] },
  { lvl: "B2", t: "I can defend a point of view with arguments, examples and counter-arguments.", lessons: ["b2-argu", "b2-concession"] },
  { lvl: "B2", t: "I can use the subjunctive after conjunctions (bien que, pour que, avant que…).", lessons: ["b2-subj"] },
  { lvl: "B2", t: "I can talk about what would have happened (si + plus-que-parfait).", lessons: ["b2-condpasse"] },
  { lvl: "B2", t: "I can report a conversation in the past with the right tenses.", lessons: ["b2-concordance"] },
  { lvl: "B2", t: "I can express cause, consequence and purpose precisely.", lessons: ["b2-cause", "b2-but"] },
  { lvl: "B2", t: "I can write a formal letter or a 250-word argued text.", lessons: ["b2-lettre", "b2-argu"] },
  { lvl: "B2", t: "I can nuance and express doubt or certainty.", lessons: ["b2-doute"] },
  { lvl: "B2", t: "I can use passive and participial structures to write more concisely.", lessons: ["b2-passif", "b2-participe"] },
  { lvl: "C1", t: "I can summarise several documents objectively in my own words.", lessons: ["c1-synthese", "c1-nominal"] },
  { lvl: "C1", t: "I can write a structured essay with a problématique and a plan.", lessons: ["c1-essai"] },
  { lvl: "C1", t: "I can give a ten-minute structured presentation and debate with a jury.", lessons: ["c1-expose"] },
  { lvl: "C1", t: "I can concede and qualify with advanced structures (avoir beau, quoique, si… que).", lessons: ["c1-concession"] },
  { lvl: "C1", t: "I can switch register between familier, courant and soutenu.", lessons: ["c1-registres"] },
  { lvl: "C1", t: "I can recognise literary tenses when I read.", lessons: ["c1-passesimple"] },
  { lvl: "C1", t: "I can hedge and modalise (il se pourrait que, force est de constater…).", lessons: ["c1-modal"] },
  { lvl: "C1", t: "I can use idiomatic and precise vocabulary instead of general words.", lessons: ["c1-lexique"] }
];
const LESSONS = [];
const L = o => LESSONS.push(o);
