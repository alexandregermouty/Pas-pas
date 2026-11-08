/* ═══════════════════════════════════════════════════════════════════
   Verbs — present forms are written out; other tenses are derived with
   the standard rules (imparfait from nous, subjonctif from ils/nous,
   futur and conditionnel from the future stem). Irregular subjunctives
   and passé simple stems are stored explicitly.
   ═══════════════════════════════════════════════════════════════════ */
const TENSES = {
  pres: { fr: "présent", en: "present" },
  pc: { fr: "passé composé", en: "perfect" },
  imp: { fr: "imparfait", en: "imperfect" },
  pqp: { fr: "plus-que-parfait", en: "pluperfect" },
  fut: { fr: "futur simple", en: "future" },
  futant: { fr: "futur antérieur", en: "future perfect" },
  cond: { fr: "conditionnel présent", en: "conditional" },
  condp: { fr: "conditionnel passé", en: "past conditional" },
  subj: { fr: "subjonctif présent", en: "present subjunctive" },
  subjp: { fr: "subjonctif passé", en: "past subjunctive" },
  ps: { fr: "passé simple", en: "simple past (written)" }
};
const PRON = { std: ["je", "tu", "il / elle", "nous", "vous", "ils / elles"], subj: ["que je", "que tu", "qu'il / qu'elle", "que nous", "que vous", "qu'ils / qu'elles"] };
const v6 = s => s.split(" ");
const VERBS = {
  "être": { en: "to be", pres: v6("suis es est sommes êtes sont"), pp: "été", aux: "a", fut: "ser", imp: "ét", ps: ["f", "u"], subj: v6("sois sois soit soyons soyez soient") },
  "avoir": { en: "to have", pres: v6("ai as a avons avez ont"), pp: "eu", aux: "a", fut: "aur", ps: ["e", "u"], subj: v6("aie aies ait ayons ayez aient") },
  "aller": { en: "to go", pres: v6("vais vas va allons allez vont"), pp: "allé", aux: "e", fut: "ir", ps: ["all", "a"], subj: v6("aille ailles aille allions alliez aillent") },
  "faire": { en: "to do, to make", pres: v6("fais fais fait faisons faites font"), pp: "fait", aux: "a", fut: "fer", ps: ["f", "i"], subj: v6("fasse fasses fasse fassions fassiez fassent") },
  "dire": { en: "to say", pres: v6("dis dis dit disons dites disent"), pp: "dit", aux: "a", fut: "dir", ps: ["d", "i"] },
  "pouvoir": { en: "can, to be able to", pres: v6("peux peux peut pouvons pouvez peuvent"), pp: "pu", aux: "a", fut: "pourr", ps: ["p", "u"], subj: v6("puisse puisses puisse puissions puissiez puissent") },
  "vouloir": { en: "to want", pres: v6("veux veux veut voulons voulez veulent"), pp: "voulu", aux: "a", fut: "voudr", ps: ["voul", "u"], subj: v6("veuille veuilles veuille voulions vouliez veuillent") },
  "savoir": { en: "to know (a fact)", pres: v6("sais sais sait savons savez savent"), pp: "su", aux: "a", fut: "saur", ps: ["s", "u"], subj: v6("sache saches sache sachions sachiez sachent") },
  "devoir": { en: "must, to owe", pres: v6("dois dois doit devons devez doivent"), pp: "dû", aux: "a", fut: "devr", ps: ["d", "u"] },
  "venir": { en: "to come", pres: v6("viens viens vient venons venez viennent"), pp: "venu", aux: "e", fut: "viendr", ps: ["v", "in"] },
  "devenir": { en: "to become", pres: v6("deviens deviens devient devenons devenez deviennent"), pp: "devenu", aux: "e", fut: "deviendr", ps: ["dev", "in"] },
  "tenir": { en: "to hold", pres: v6("tiens tiens tient tenons tenez tiennent"), pp: "tenu", aux: "a", fut: "tiendr", ps: ["t", "in"], lv: "B2" },
  "prendre": { en: "to take", pres: v6("prends prends prend prenons prenez prennent"), pp: "pris", aux: "a", fut: "prendr", ps: ["pr", "i"] },
  "mettre": { en: "to put", pres: v6("mets mets met mettons mettez mettent"), pp: "mis", aux: "a", fut: "mettr", ps: ["m", "i"] },
  "voir": { en: "to see", pres: v6("vois vois voit voyons voyez voient"), pp: "vu", aux: "a", fut: "verr", ps: ["v", "i"] },
  "croire": { en: "to believe", pres: v6("crois crois croit croyons croyez croient"), pp: "cru", aux: "a", fut: "croir", ps: ["cr", "u"] },
  "recevoir": { en: "to receive", pres: v6("reçois reçois reçoit recevons recevez reçoivent"), pp: "reçu", aux: "a", fut: "recevr", ps: ["reç", "u"] },
  "vivre": { en: "to live", pres: v6("vis vis vit vivons vivez vivent"), pp: "vécu", aux: "a", fut: "vivr", ps: ["véc", "u"] },
  "écrire": { en: "to write", pres: v6("écris écris écrit écrivons écrivez écrivent"), pp: "écrit", aux: "a", fut: "écrir", ps: ["écriv", "i"] },
  "lire": { en: "to read", pres: v6("lis lis lit lisons lisez lisent"), pp: "lu", aux: "a", fut: "lir", ps: ["l", "u"] },
  "connaître": { en: "to know (a person, a place)", pres: v6("connais connais connaît connaissons connaissez connaissent"), pp: "connu", aux: "a", fut: "connaîtr", ps: ["conn", "u"] },
  "boire": { en: "to drink", pres: v6("bois bois boit buvons buvez boivent"), pp: "bu", aux: "a", fut: "boir", ps: ["b", "u"] },
  "ouvrir": { en: "to open", pres: v6("ouvre ouvres ouvre ouvrons ouvrez ouvrent"), pp: "ouvert", aux: "a", fut: "ouvrir", ps: ["ouvr", "i"] },
  "partir": { en: "to leave", pres: v6("pars pars part partons partez partent"), pp: "parti", aux: "e", fut: "partir", ps: ["part", "i"] },
  "sortir": { en: "to go out", pres: v6("sors sors sort sortons sortez sortent"), pp: "sorti", aux: "e", fut: "sortir", ps: ["sort", "i"] },
  "dormir": { en: "to sleep", pres: v6("dors dors dort dormons dormez dorment"), pp: "dormi", aux: "a", fut: "dormir", ps: ["dorm", "i"] },
  "suivre": { en: "to follow", pres: v6("suis suis suit suivons suivez suivent"), pp: "suivi", aux: "a", fut: "suivr", ps: ["suiv", "i"], lv: "B2" },
  "courir": { en: "to run", pres: v6("cours cours court courons courez courent"), pp: "couru", aux: "a", fut: "courr", ps: ["cour", "u"], lv: "B2" },
  "conduire": { en: "to drive", pres: v6("conduis conduis conduit conduisons conduisez conduisent"), pp: "conduit", aux: "a", fut: "conduir", ps: ["conduis", "i"], lv: "B2" },
  "craindre": { en: "to fear", pres: v6("crains crains craint craignons craignez craignent"), pp: "craint", aux: "a", fut: "craindr", ps: ["craign", "i"], lv: "C1" },
  "naître": { en: "to be born", pres: v6("nais nais naît naissons naissez naissent"), pp: "né", aux: "e", fut: "naîtr", ps: ["naqu", "i"], lv: "B2" },
  "mourir": { en: "to die", pres: v6("meurs meurs meurt mourons mourez meurent"), pp: "mort", aux: "e", fut: "mourr", ps: ["mour", "u"], lv: "B2" },
  "plaire": { en: "to please", pres: v6("plais plais plaît plaisons plaisez plaisent"), pp: "plu", aux: "a", fut: "plair", ps: ["pl", "u"], lv: "B2" },
  "envoyer": { en: "to send", pres: v6("envoie envoies envoie envoyons envoyez envoient"), pp: "envoyé", aux: "a", fut: "enverr", ps: ["envoy", "a"] },
  "acheter": { en: "to buy", pres: v6("achète achètes achète achetons achetez achètent"), pp: "acheté", aux: "a", fut: "achèter", ps: ["achet", "a"] },
  "appeler": { en: "to call", pres: v6("appelle appelles appelle appelons appelez appellent"), pp: "appelé", aux: "a", fut: "appeller", ps: ["appel", "a"] },
  "préférer": { en: "to prefer", pres: v6("préfère préfères préfère préférons préférez préfèrent"), pp: "préféré", aux: "a", fut: "préférer", ps: ["préfér", "a"] },
  "manger": { en: "to eat", pres: v6("mange manges mange mangeons mangez mangent"), pp: "mangé", aux: "a", fut: "manger", ps: ["mange", "a"] },
  "commencer": { en: "to begin", pres: v6("commence commences commence commençons commencez commencent"), pp: "commencé", aux: "a", fut: "commencer", ps: ["commenç", "a"] },
  "parler": { en: "to speak", pres: v6("parle parles parle parlons parlez parlent"), pp: "parlé", aux: "a", fut: "parler", ps: ["parl", "a"] },
  "arriver": { en: "to arrive", pres: v6("arrive arrives arrive arrivons arrivez arrivent"), pp: "arrivé", aux: "e", fut: "arriver", ps: ["arriv", "a"] },
  "rester": { en: "to stay", pres: v6("reste restes reste restons restez restent"), pp: "resté", aux: "e", fut: "rester", ps: ["rest", "a"] },
  "tomber": { en: "to fall", pres: v6("tombe tombes tombe tombons tombez tombent"), pp: "tombé", aux: "e", fut: "tomber", ps: ["tomb", "a"] },
  "finir": { en: "to finish", pres: v6("finis finis finit finissons finissez finissent"), pp: "fini", aux: "a", fut: "finir", ps: ["fin", "i"] },
  "choisir": { en: "to choose", pres: v6("choisis choisis choisit choisissons choisissez choisissent"), pp: "choisi", aux: "a", fut: "choisir", ps: ["chois", "i"] },
  "réussir": { en: "to succeed", pres: v6("réussis réussis réussit réussissons réussissez réussissent"), pp: "réussi", aux: "a", fut: "réussir", ps: ["réuss", "i"] },
  "attendre": { en: "to wait", pres: v6("attends attends attend attendons attendez attendent"), pp: "attendu", aux: "a", fut: "attendr", ps: ["attend", "i"] },
  "répondre": { en: "to answer", pres: v6("réponds réponds répond répondons répondez répondent"), pp: "répondu", aux: "a", fut: "répondr", ps: ["répond", "i"] },
  "perdre": { en: "to lose", pres: v6("perds perds perd perdons perdez perdent"), pp: "perdu", aux: "a", fut: "perdr", ps: ["perd", "i"] },
  "vendre": { en: "to sell", pres: v6("vends vends vend vendons vendez vendent"), pp: "vendu", aux: "a", fut: "vendr", ps: ["vend", "i"] }
};
const ENDS = {
  imp: ["ais", "ais", "ait", "ions", "iez", "aient"], fut: ["ai", "as", "a", "ons", "ez", "ont"], cond: ["ais", "ais", "ait", "ions", "iez", "aient"],
  subj: ["e", "es", "e", "ions", "iez", "ent"],
  ps: { a: ["ai", "as", "a", "âmes", "âtes", "èrent"], i: ["is", "is", "it", "îmes", "îtes", "irent"], u: ["us", "us", "ut", "ûmes", "ûtes", "urent"], in: ["ins", "ins", "int", "înmes", "întes", "inrent"] }
};
function glue(stem, end) {
  if (/^[iîè]/.test(end) && /ge$/.test(stem)) stem = stem.slice(0, -1);
  if (/^[iîè]/.test(end) && /ç$/.test(stem)) stem = stem.slice(0, -1) + "c";
  return stem + end;
}
function conjSimple(v, t) {
  const d = VERBS[v];
  if (t === "pres") return d.pres.slice();
  if (t === "imp") { const st = d.imp || d.pres[3].replace(/ons$/, ""); return ENDS.imp.map(e => glue(st, e)); }
  if (t === "fut") return ENDS.fut.map(e => d.fut + e);
  if (t === "cond") return ENDS.cond.map(e => d.fut + e);
  if (t === "subj") {
    if (d.subj) return d.subj.slice();
    const s1 = d.pres[5].replace(/ent$/, ""); const imp = conjSimple(v, "imp");
    return [s1 + "e", s1 + "es", s1 + "e", imp[3], imp[4], s1 + "ent"];
  }
  if (t === "ps") { const [st, ty] = d.ps; return ENDS.ps[ty].map(e => glue(st, e)); }
}
const COMPOUND = { pc: "pres", pqp: "imp", futant: "fut", condp: "cond", subjp: "subj" };
function conj(v, t) {
  if (!COMPOUND[t]) return conjSimple(v, t);
  const d = VERBS[v]; const aux = conjSimple(d.aux === "e" ? "être" : "avoir", COMPOUND[t]);
  return aux.map((a, i) => {
    if (d.aux !== "e") return a + " " + d.pp;
    const pl = i >= 3, base = d.pp;
    const forms = pl ? [base + "s", base + "es"] : [base, base + "e"];
    if (i === 4) forms.push(base, base + "e");
    return forms.map(f => a + " " + f).join("|");
  });
}
