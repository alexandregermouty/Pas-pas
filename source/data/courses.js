/* ═══════════════════════════════════════════════════════════════════
   Course companions — follow the structure (units, tasks, grammar,
   vocabulary, sounds) of Lan Anh's class books. All sentences and
   exercises are original; no text or audio from the books is copied.
   ═══════════════════════════════════════════════════════════════════ */
const COURSES = [
  { id: "cosmo3", t: "Cosmopolite 3", short: "Cosmopolite 3", pub: "Hachette FLE · B1", ic: "🌍", tint: "t-teal",
    desc: "General French towards the DELF B1: eight dossiers, four lessons each.",
    units: [
      { id: "d1", short: "Dossier 1", t: "Dossier 1 · Vivre ailleurs", en: "Moving abroad, housing, the city" },
      { id: "d2", short: "Dossier 2", t: "Dossier 2 · Le quotidien à l'étranger", en: "Everyday problems, health, paperwork" },
      { id: "d3", short: "Dossier 3", t: "Dossier 3 · Sortir et partager", en: "Outings, team spirit, family, celebrations" },
      { id: "d4", short: "Dossier 4", t: "Dossier 4 · Agir autrement", en: "Sustainable living and responsible consumption" },
      { id: "d5", short: "Dossier 5", t: "Dossier 5 · Études et travail", en: "Studies, applications, experience, jobs" },
      { id: "d6", short: "Dossier 6", t: "Dossier 6 · Les médias", en: "Press, social media, fake news" },
      { id: "d7", short: "Dossier 7", t: "Dossier 7 · Innovation", en: "Young talents, science, the innovation economy" },
      { id: "d8", short: "Dossier 8", t: "Dossier 8 · Arts et culture", en: "Art, live shows, cinema, books" }
    ] },
  { id: "oe2", t: "Objectif Express 2", short: "Objectif Express 2", pub: "Hachette FLE · français professionnel B1–B2", ic: "💼", tint: "t-orange",
    desc: "French for work: colleagues, meetings, sales, HR, projects, reporting.",
    units: [
      { id: "u1", short: "Unité 1", t: "Unité 1 · Nouveaux collaborateurs", en: "Meeting colleagues, settling in" },
      { id: "u2", short: "Unité 2", t: "Unité 2 · Produits et services", en: "Describing and promoting an offer" },
      { id: "u3", short: "Unité 3", t: "Unité 3 · Organiser son travail", en: "Appointments, meetings, minutes" },
      { id: "u4", short: "Unité 4", t: "Unité 4 · Vendre", en: "Surveys, sales talks, terms of sale" },
      { id: "u5", short: "Unité 5", t: "Unité 5 · À l'international", en: "Missions abroad, travel problems" },
      { id: "u6", short: "Unité 6", t: "Unité 6 · Événements professionnels", en: "Inviting, speeches, reviewing an event" },
      { id: "u7", short: "Unité 7", t: "Unité 7 · Travailler en collaboration", en: "Brainstorming, shared documents, planning" },
      { id: "u8", short: "Unité 8", t: "Unité 8 · Ressources humaines", en: "Contracts, appraisal, resignation" },
      { id: "u9", short: "Unité 9", t: "Unité 9 · Litiges", en: "Complaints and disputes" },
      { id: "u10", short: "Unité 10", t: "Unité 10 · Projets", en: "Project roles, scoping, corrective action" },
      { id: "u11", short: "Unité 11", t: "Unité 11 · S'informer", en: "Social conflict, economic news, debate" },
      { id: "u12", short: "Unité 12", t: "Unité 12 · Rendre compte", en: "Reports, audits, results" }
    ] }
];
