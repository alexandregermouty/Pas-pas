/* ═══════════════════════════════════════════════════════════════════
   Pas à pas · explanations in English after every answer
   - analyses the verb forms of the right answer and of a wrong one
   - explains the function words involved (GLOSS)
   - picks the section of the lesson's English explanation that fits
   ═══════════════════════════════════════════════════════════════════ */
const PERS = ["je", "tu", "il / elle / on", "nous", "vous", "ils / elles"];
const lc = s => String(s ?? "").toLowerCase().replace(/[’`´]/g, "'").trim();

/* ── conjugation tables, regular verbs generated on the fly ─────── */
const _gen = {};
/* a few irregular verbs that are not in the conjugation tables */
const IRR = {
  pleuvoir: { en: "to rain", s3: ["pleut", "pleuvait", "pleuvra", "pleuvrait", "pleuve", "plut"], pp: "plu", aux: "avoir", ppr: "pleuvant" },
  falloir: { en: "to be necessary", s3: ["faut", "fallait", "faudra", "faudrait", "faille", "fallut"], pp: "fallu", aux: "avoir" },
  valoir: { en: "to be worth", s3: ["vaut", "valait", "vaudra", "vaudrait", "vaille", "valut"], pp: "valu", aux: "avoir" },
  "s'asseoir": { en: "to sit down", s3: ["assied", "asseyait", "assiéra", "assiérait", "asseye", "assit"], pp: "assis", aux: "être" },
  résoudre: { en: "to solve", s3: ["résout", "résolvait", "résoudra", "résoudrait", "résolve", "résolut"], pp: "résolu", aux: "avoir" },
  rire: { en: "to laugh", s3: ["rit", "riait", "rira", "rirait", "rie", "rit"], pp: "ri", aux: "avoir" },
  apprendre: { en: "to learn", base: "prendre", pre: "ap" }, comprendre: { en: "to understand", base: "prendre", pre: "com" }, surprendre: { en: "to surprise", base: "prendre", pre: "sur" },
  permettre: { en: "to allow", base: "mettre", pre: "per" }, promettre: { en: "to promise", base: "mettre", pre: "pro" }, admettre: { en: "to admit", base: "mettre", pre: "ad" },
  revenir: { en: "to come back", base: "venir", pre: "re" }, parvenir: { en: "to manage to", base: "venir", pre: "par" }, obtenir: { en: "to obtain", base: "tenir", pre: "ob" }, maintenir: { en: "to maintain", base: "tenir", pre: "main" },
  décrire: { en: "to describe", base: "écrire", pre: "d" }, inscrire: { en: "to register", base: "écrire", pre: "ins", cut: 1 }, reconnaître: { en: "to recognise", base: "connaître", pre: "re" }, paraître: { en: "to seem", base: "connaître", pre: "pa", cut: 3 },
  produire: { en: "to produce", base: "conduire", pre: "pro", cut: 3 }, construire: { en: "to build", base: "conduire", pre: "constr", cut: 4 }, réduire: { en: "to reduce", base: "conduire", pre: "ré", cut: 3 },
  revoir: { en: "to see again", base: "voir", pre: "re" }, prévoir: { en: "to foresee", base: "voir", pre: "pré" }, découvrir: { en: "to discover", base: "ouvrir", pre: "déc", cut: 1 }, offrir: { en: "to offer", base: "ouvrir", pre: "off", cut: 3 },
  sentir: { en: "to feel", base: "partir", pre: "sen", cut: 3 }, servir: { en: "to serve", base: "dormir", pre: "ser", cut: 3 }, mentir: { en: "to lie", base: "partir", pre: "men", cut: 3 }
};
function genVerb(inf) {
  if (_gen[inf] !== undefined) return _gen[inf];
  let t = null;
  const X = IRR[inf];
  if (X && X.s3) {
    const one = f => [null, null, f, null, null, null];
    t = { pres: one(X.s3[0]), imp: one(X.s3[1]), fut: one(X.s3[2]), cond: one(X.s3[3]), subj: one(X.s3[4]), ps: one(X.s3[5]), pp: X.pp, aux: X.aux, en: X.en, ppr: X.ppr || "" };
  } else if (X && X.base) {
    const b = genVerb(X.base), cut = X.cut || 0, fx = f => f == null ? f : X.pre + f.slice(cut);
    if (b) { t = {}; ["pres", "imp", "fut", "cond", "subj", "ps"].forEach(k => t[k] = b[k].map(fx)); t.pp = fx(b.pp); t.ppr = fx(b.ppr); t.aux = X.base === "venir" ? "être" : b.aux; t.en = X.en; }
  } else if (VERBS[inf]) {
    const d = VERBS[inf];
    t = { pres: conjSimple(inf, "pres"), imp: conjSimple(inf, "imp"), fut: conjSimple(inf, "fut"), cond: conjSimple(inf, "cond"), subj: conjSimple(inf, "subj"), ps: conjSimple(inf, "ps"), pp: d.pp, aux: d.aux === "e" ? "être" : "avoir", en: d.en };
    t.ppr = (inf === "être" ? "ét" : inf === "avoir" ? "ay" : inf === "savoir" ? "sach" : t.imp[0].replace(/ais$/, "")) + "ant";
  } else if (/er$/.test(inf) && inf.length > 3) {
    const st = inf.slice(0, -2), soft = /g$/.test(st) ? "e" : "", ced = /c$/.test(st);
    const nst = ced ? st.slice(0, -1) + "ç" : st + soft;
    const pres = [st + "e", st + "es", st + "e", nst + "ons", st + "ez", st + "ent"];
    const imp = ["ais", "ais", "ait", "ions", "iez", "aient"].map((e, i) => (i === 3 || i === 4 ? st : nst) + e);
    t = { pres, imp, fut: ENDS.fut.map(e => inf + e), cond: ENDS.cond.map(e => inf + e), subj: [st + "e", st + "es", st + "e", st + "ions", st + "iez", st + "ent"],
      ps: ["ai", "as", "a", "âmes", "âtes", "èrent"].map((e, i) => (i < 4 && !/^è/.test(e) ? nst : st) + e), pp: st + "é", ppr: nst + "ant", aux: "avoir" };
  } else if (/ir$/.test(inf) && inf.length > 3) {
    const st = inf.slice(0, -2), s2 = st + "iss";
    t = { pres: [st + "is", st + "is", st + "it", s2 + "ons", s2 + "ez", s2 + "ent"], imp: ENDS.imp.map(e => s2 + e), fut: ENDS.fut.map(e => inf + e), cond: ENDS.cond.map(e => inf + e),
      subj: ENDS.subj.map(e => s2 + e), ps: ENDS.ps.i.map(e => st + e), pp: st + "i", ppr: s2 + "ant", aux: "avoir" };
  } else if (/re$/.test(inf) && inf.length > 3) {
    const st = inf.slice(0, -2);
    t = { pres: [st + "s", st + "s", st, st + "ons", st + "ez", st + "ent"], imp: ENDS.imp.map(e => st + e), fut: ENDS.fut.map(e => st + "r" + e), cond: ENDS.cond.map(e => st + "r" + e),
      subj: ENDS.subj.map(e => st + e), ps: ENDS.ps.i.map(e => st + e), pp: st + "u", ppr: st + "ant", aux: "avoir" };
  }
  if (t) t.inf = inf;
  return (_gen[inf] = t);
}
const AUXF = {};
["avoir", "être"].forEach(a => ["pres", "imp", "fut", "cond", "subj", "ps"].forEach(tn => conjSimple(a, tn).forEach((f, i) => { (AUXF[f] = AUXF[f] || []).push({ a, t: tn, i }); })));
const COMP_OF = { pres: "pc", imp: "pqp", fut: "futant", cond: "condp", subj: "subjp", ps: "pa" };
const TN = Object.assign({}, ...Object.entries(TENSES).map(([k, v]) => ({ [k]: v.fr })), { inf: "infinitif", pp: "participe passé", ppr: "participe présent", ger: "gérondif (en + participe présent)", pa: "passé antérieur", impe: "impératif" });
const ETRE_V = new Set("aller venir arriver partir entrer rentrer sortir monter descendre naître mourir rester tomber retourner passer devenir revenir parvenir intervenir décéder apparaître".split(" "));
const PP_INF = {}; Object.keys(VERBS).forEach(v => { PP_INF[VERBS[v].pp] = v; });

function infCandidates(form, hint) {
  const c = [];
  if (hint) hint.split(/[\s,/|]+/).filter(h => /(er|ir|re|oir)$/.test(h)).forEach(h => c.push(lc(h).replace(/^(se |s')/, "")));
  Object.keys(VERBS).forEach(v => c.push(v)); Object.keys(IRR).forEach(v => c.push(v));
  const f = form;
  ["eraient", "erions", "eriez", "erais", "erait", "erons", "eront", "erez", "eras", "erai", "era", "aient", "èrent", "âmes", "âtes", "ions", "iez", "ais", "ait", "ons", "ez", "ent", "es", "e", "ai", "as", "a", "é", "ée", "és", "ées", "ant"].forEach(e => {
    if (f.endsWith(e) && f.length > e.length + 1) { const st = f.slice(0, -e.length); c.push(st + "er"); if (/ç$/.test(st)) c.push(st.slice(0, -1) + "cer"); if (/ge$/.test(st)) c.push(st.slice(0, -1) + "er"); }
  });
  ["issaient", "issions", "issiez", "issais", "issait", "issons", "issez", "issent", "isse", "isses", "irent", "iront", "irons", "irez", "irai", "iras", "ira", "is", "it", "i", "ie", "ies"].forEach(e => {
    if (f.endsWith(e) && f.length > e.length + 1) c.push(f.slice(0, -e.length) + "ir");
  });
  ["aient", "ions", "iez", "ais", "ait", "ons", "ez", "ent", "ra", "rai", "ras", "ront", "rons", "rez", "s", "u", "ue", "us", "ues", "e", "es"].forEach(e => {
    if (f.endsWith(e) && f.length > e.length + 1) c.push(f.slice(0, -e.length) + "re");
  });
  if (/(er|ir|re|oir)$/.test(f)) c.push(f);
  return uniq(c);
}
let KNOWN_INF = null;
function knownInf() {
  if (KNOWN_INF) return KNOWN_INF;
  KNOWN_INF = new Set([...Object.keys(VERBS), ...Object.keys(IRR)]);
  const STOP = new Set("outre entre contre notre votre autre lettre titre centre ordre livre chiffre offre nombre membre cadre genre libre propre pauvre quatre mètre ministre fenêtre théâtre poivre sucre légère guère hier fier cher mer amer premier dernier entier hiver super désir loisir plaisir avenir soir espoir devoir pouvoir savoir".split(" "));
  const add = s => { const w = String(s || "").toLowerCase().replace(/^(se |s')/, "").split(/[\s,/|()…]+/)[0] || ""; if (/^[a-zàâçéèêëîïôûùüœ-]{3,}(er|ir|re|oir)$/.test(w) && (!STOP.has(w) || VERBS[w])) KNOWN_INF.add(w); };
  LESSONS.forEach(l => { (l.cards || []).forEach(c => add(c[0])); (l.gap || []).forEach(x => add(x[2])); });
  (typeof CONJ_LIST !== "undefined" ? CONJ_LIST : []).forEach(add);
  return KNOWN_INF;
}
function findSimple(form, hint) {
  const out = [], K = knownInf();
  for (const inf of infCandidates(form, hint)) {
    if (!K.has(inf) && !(hint && lc(hint).includes(inf))) continue;
    const t = genVerb(inf); if (!t) continue;
    if (inf === form) out.push({ inf, t: "inf", p: [] });
    for (const tn of ["pres", "imp", "fut", "cond", "subj", "ps"]) {
      const p = []; (t[tn] || []).forEach((f, i) => { if (f && f === form) p.push(i); });
      if (p.length) out.push({ inf, t: tn, p });
    }
    if (t.ppr === form) out.push({ inf, t: "ppr", p: [] });
    if (t.pp && [t.pp, t.pp + "e", t.pp + "s", t.pp + "es"].includes(form)) out.push({ inf, t: "pp", p: [], agree: form.slice(t.pp.length) });
    if (out.length && (VERBS[inf] || (hint && hint.includes(inf)))) break;
  }
  // regular guesses can collide (e.g. a noun ending in -e): keep only the first verb found
  if (!out.length) return [];
  const first = out[0].inf; return out.filter(o => o.inf === first);
}
const PRE = new Set(["que", "qu'", "je", "j'", "tu", "il", "elle", "on", "nous", "vous", "ils", "elles", "ne", "n'"]);
const REFL = new Set(["me", "m'", "te", "t'", "se", "s'"]);
const OBJ = new Set(["le", "la", "les", "l'", "lui", "leur", "y", "en"]);
/* analyse a verb group such as "suis allée", "avons visité", "a été coupée", "pleuvait", "fasses" */
function morph(str, hint, ctx) {
  let w = lc(str).replace(/[.!?,;:…«»"]/g, " ").replace(/(\b[mtsljnd]|qu)'/g, "$1' ").split(/\s+/).filter(Boolean);
  if (!w.length || w.length > 5) return null;
  let refl = false, obj = null, neg = false, stripEn = false;
  while (w.length > 1 && (PRE.has(w[0]) || REFL.has(w[0]) || OBJ.has(w[0]))) { if (REFL.has(w[0])) refl = true; if (OBJ.has(w[0])) obj = w[0]; if (w[0] === "en") stripEn = true; if (/^n/.test(w[0])) neg = true; w.shift(); }
  w = w.filter(x => !["pas", "plus", "jamais", "rien", "point"].includes(x) || !(neg = true));
  if (GLOSS[lc(str)] || /\b(mien|tien|sien|nôtre|vôtre)/.test(lc(str))) return null;
  if (w.length === 1) {
    if (w[0] === "en") return null;
    let r = findSimple(w[0], hint);
    if (!hint) r = r.filter(o => VERBS[o.inf] || /(ais|ait|aient|ions|iez|rai|ras|rons|rez|ront|èrent|âmes|îmes|ant)$/.test(w[0]) || o.t === "inf");
    if (!r.length) return null;
    let pick = r;
    const PREF = ["pp", "pres", "imp", "fut", "cond", "subj", "ppr", "inf", "ps"];
    pick = r.slice().sort((x, y) => PREF.indexOf(x.t) - PREF.indexOf(y.t));
    if (r.length > 1 && ctx) { const c = lc(ctx); const sj = r.find(x => x.t === "subj"); if (sj && /(^|[\s'"«])(que\s|qu')[^.?!]{0,30}_{2,}/.test(c)) pick = [sj, ...pick.filter(x => x !== sj)]; }
    if (r.some(x => x.t === "ps") && /passé simple|passesimple/.test(lc(ctx || ""))) pick = [r.find(x => x.t === "ps"), ...pick.filter(x => x.t !== "ps")];
    if (stripEn && pick[0].t === "pp") return null;
    if (pick[0].t === "ppr" && /^en\s/.test(lc(str))) pick = [{ ...pick[0], t: "ger" }];
    return { form: str, inf: pick[0].inf, opts: pick, refl, simple: true };
  }
  const aux = AUXF[w[0]];
  if (aux && (w.length === 2 || (w.length === 3 && w[1] === "été"))) {
    let pas = false, pp = w[1];
    if (w[1] === "été" && w.length >= 3) { pas = true; pp = w[2]; }
    else if (w[0] && /^(été|eu)$/.test(w[1]) && w.length === 2) { /* passé composé of être/avoir */ }
    const base = pp.replace(/(es|e|s)$/, "");
    let inf = null;
    if (hint) for (const h of infCandidates(pp, hint).slice(0, 3)) { const g = genVerb(h); if (g && g.pp && [g.pp, g.pp + "e", g.pp + "s", g.pp + "es"].includes(pp)) { inf = h; break; } }
    inf = inf || PP_INF[pp] || PP_INF[base] || PP_INF[base + "s"] || PP_INF[base + "t"];
    if (!inf) for (const h of Object.keys(IRR)) { const g = genVerb(h); if (g && g.pp && [g.pp, g.pp + "e", g.pp + "s", g.pp + "es"].includes(pp)) { inf = h; break; } }
    if (!inf && hint) inf = infCandidates(pp, hint)[0];
    if (!inf && /é(e|s|es)?$/.test(pp)) inf = pp.replace(/é(e|s|es)?$/, "er");
    if (!inf && /i(e|s|es)?$/.test(pp)) inf = pp.replace(/i(e|s|es)?$/, "ir");
    const g = inf && genVerb(inf); const basepp = g ? g.pp : pp;
    const agree = pp.length > basepp.length && pp.startsWith(basepp) ? pp.slice(basepp.length) : "";
    const a = pas ? aux.filter(x => x.a === "avoir") : aux;
    if (!a.length) return null;
    const uses = uniq(a.map(x => x.t)); const ix = uniq(a.map(x => x.i));
    // être + participle of a verb that normally takes avoir = passive (or adjective)
    if (!pas && a[0].a === "être" && !refl && inf && !ETRE_V.has(inf) && !(IRR[inf] && IRR[inf].base === "venir"))
      return { form: str, inf, compound: true, auxV: "être", auxT: uses, p: ix, tense: uses, pp, agree, passive: true, simplePass: true, refl, obj };
    return { form: str, inf, compound: true, auxV: a[0].a, auxT: uses, p: ix, tense: uses.map(t => COMP_OF[t]), pp, agree, passive: pas, refl, obj };
  }
  return null;
}
const persTxt = p => p && p.length ? uniq(p).map(i => PERS[i]).join(" or ") : "";
const enOf = inf => { const t = inf && genVerb(inf); return t && t.en ? ` (${t.en})` : ""; };
function morphHtml(m, full) {
  if (!m) return "";
  if (m.simple) {
    const o = m.opts[0], tn = TN[o.t] || o.t;
    let s = `<b>${esc(m.form)}</b> → <i>${esc(m.inf)}</i>${esc(enOf(m.inf))}, <b>${esc(tn)}</b>${o.p.length ? `, ${esc(persTxt(o.p))} form` : ""}`;
    const others = m.opts.slice(1).filter(x => x.t !== o.t);
    if (others.length) s += ` (the same spelling is also the ${others.map(x => TN[x.t]).join(" / ")})`;
    if (o.t === "pp" && o.agree) s += `. The ending <b>-${esc(o.agree)}</b> is an agreement (${o.agree.includes("e") ? "feminine" : ""}${o.agree === "es" ? " " : ""}${o.agree.includes("s") ? "plural" : ""})`;
    s += ".";
    if (full && TENSE_USE[o.t]) s += ` ${TENSE_USE[o.t]}`;
    return s;
  }
  const tn = m.tense.map(t => TN[t] || t).join(" / ");
  let s = `<b>${esc(m.form)}</b> → ${m.inf ? `<i>${esc(m.inf)}</i>${esc(enOf(m.inf))}, ` : ""}<b>${m.passive ? "passive voice, " : ""}${esc(tn)}</b>${m.p.length ? `, ${esc(persTxt(m.p))} form` : ""}. `;
  s += m.passive ? `It is built with <b>être</b> conjugated in the ${esc(tn)} (<i>${esc(m.form.split(/\s+/).slice(0, -1).join(" "))}</i>) + the past participle <i>${esc(m.pp)}</i>, which agrees with the subject.${m.simplePass ? " (The same structure can also be read as être + an adjective describing a state: <i>la porte est fermée</i>.)" : ""}`
    : `It is built with the auxiliary <b>${m.auxV}</b> in the ${esc(m.auxT.map(t => TN[t]).join(" / "))} + the past participle <i>${esc(m.pp)}</i>.`;
  if (!m.passive && m.auxV === "être") s += m.refl ? ` Pronominal verbs (with <i>me, te, se…</i>) always take être; the participle agrees with the subject when the reflexive pronoun is a direct object.` : ` Verbs of movement and change of state (<i>aller, venir, arriver, partir, naître, mourir, rester, tomber…</i>) take être, and the participle agrees with the subject like an adjective.`;
  if (m.agree && !m.passive) s += ` The ending <b>-${esc(m.agree)}</b> marks the agreement (${m.agree.includes("e") ? "feminine" : ""}${m.agree === "es" ? " and " : ""}${m.agree.includes("s") ? "plural" : ""})${m.auxV === "avoir" ? ": with avoir, the participle agrees only with a direct object placed before the verb (<i>l', la, les, que</i>)" : ""}.`;
  if (full) m.tense.forEach(t => { if (TENSE_USE[t]) s += ` ${TENSE_USE[t]}`; });
  return s;
}

/* ── function words ─────────────────────────────────────────────── */
const GKEYS = Object.keys(GLOSS).sort((a, b) => b.length - a.length);
function glossFor(str, max = 2) {
  const s = " " + lc(str).replace(/[.!?,;:…«»"()]/g, " ").replace(/\s+/g, " ") + " ";
  const hits = []; let rest = s;
  for (const k of GKEYS) {
    if (hits.length >= max) break;
    const kk = " " + k + " ", kk2 = " " + k;
    if (rest.includes(kk) || (k.endsWith("'") && rest.includes(kk2))) { hits.push(k); rest = rest.split(kk).join(" # "); }
  }
  return hits.map(k => GLOSS[k]);
}

/* ── picking the right section of the lesson explanation ────────── */
function secMatch(lid, text) {
  const e = EN[lid]; if (!e || !e.s) return -1;
  const t = " " + deacc(lc(plain(text))).replace(/[.!?,;:…«»"()]/g, " ") + " ";
  if (!e._df) { e._df = {}; e.s.forEach(s => uniq((s[2] || "").split("|").filter(Boolean).map(k => deacc(lc(k)))).forEach(k => e._df[k] = (e._df[k] || 0) + 1)); }
  let best = -1, bs = 0;
  e.s.forEach((s, i) => {
    let sc = 0; uniq((s[2] || "").split("|").filter(Boolean).map(k => deacc(lc(k)))).forEach(kk => { if (kk.length > 2 ? t.includes(kk) : t.includes(" " + kk + " ")) sc += (kk.length > 6 ? 1.5 : 1) / e._df[kk]; });
    if (sc > bs + 1e-9) { bs = sc; best = i; }
  });
  return best;
}
function secHtml(s) { return `<div class="xsec"><b>${s[0]}</b><div>${s[1]}</div></div>`; }
function lessonEnHtml(lid, open) {
  const e = EN[lid]; if (!e || !e.s) return "";
  return `<details class="xall"${open ? " open" : ""}><summary>The whole lesson explained in English</summary>${e.s.map(secHtml).join("")}</details>`;
}

/* differing words between two sentences (for "quelle phrase est correcte ?") */
function diffWords(good, bad) {
  const A = tokenize(good), B = tokenize(bad);
  let i = 0; while (i < A.length && i < B.length && norm(A[i]) === norm(B[i])) i++;
  let j = 0; while (j < A.length - i && j < B.length - i && norm(A[A.length - 1 - j]) === norm(B[B.length - 1 - j])) j++;
  return [A.slice(i, A.length - j).join(" "), B.slice(i, B.length - j).join(" ")];
}

/* ── the English panel shown after an answer ────────────────────── */
function explainEn(q, ok, o) {
  if (!q || q.t === "match") return "";
  const parts = [];
  const right = q.answ || (q.opts && q.opts[q.a]) || q.model || q.text || "";
  let given = !ok && o.given && norm(o.given) !== norm(right) ? o.given : "";
  if (q.tr) parts.push(`<p><span class="xk">Meaning</span>${esc(q.tr)}</p>`);
  if (q.whyEn) parts.push(`<p>${q.whyEn}</p>`);
  // grammar of the right answer and of the wrong one
  let R = right, G = given;
  if (q.bad && q.t === "nat") { [R, G] = diffWords(q.answ, q.bad); if (ok) G = ""; }
  if (q.t === "fix") { R = q.good; G = ok ? "" : (o.given && o.given !== q.good ? o.given : q.bad); }
  const short = s => s && tokenize(s).length <= 5;
  const gram = [];
  // an auxiliary alone in the blank: analyse it with the participle that follows
  const withNext = x => {
    if (!x || !q.hear || tokenize(x).length !== 1 || !AUXF[lc(x)]) return x;
    const t = tokenize(q.hear).map(w => lc(w).replace(/[.,;:!?…«»]/g, "")), i = t.indexOf(lc(R));
    const nx = i >= 0 ? t[i + 1] : null;
    return nx && morph(x + " " + nx, q.hint) ? x + " " + nx : x;
  };
  let mR = null;
  if (short(R) && !/^(rec|recall|listen)$/.test(q.kind || "")) {
    const R2 = withNext(R);
    mR = morph(R2, q.hint, q.hear || q.answ); if (mR) gram.push(morphHtml(mR, true));
    glossFor(R, mR ? 1 : 2).forEach(g => gram.push(g));
  }
  if (G && short(G)) {
    const G2 = R !== withNext(R) && AUXF[lc(G)] ? G + " " + withNext(R).split(" ").slice(1).join(" ") : G;
    const m = morph(G2, q.hint, q.hear); const gl = glossFor(G, 1);
    const tOf = x => x && (x.simple ? x.opts[0].t : x.tense.join("/"));
    const pOf = x => x && (x.simple ? x.opts[0].p : x.p) || [];
    if (m && mR && m.inf === mR.inf && tOf(m) === tOf(mR) && pOf(m).join() !== pOf(mR).join())
      gram.push(`<span class="xno">Why not <b>${esc(G)}</b>?</span> It is the right verb in the right tense, but the <b>${esc(persTxt(pOf(m)))}</b> form. Look at the subject of the sentence: it needs the <b>${esc(persTxt(pOf(mR)))}</b> form, <b>${esc(R)}</b>. Check the ending every time — in French, each person has its own.`);
    else if (m) gram.push(`<span class="xno">Why not <b>${esc(G)}</b>?</span> ${morphHtml(m, false)} ${m.simple && TENSE_USE[m.opts[0].t] ? TENSE_USE[m.opts[0].t].split(". ")[0].replace(/\.$/, "") + "." : ""}`);
    else if (gl.length && !gram.includes(gl[0])) gram.push(`<span class="xno">Why not <b>${esc(G)}</b>?</span> ${gl[0]}`);
  }
  if (q.t === "fix" && q.bad) gram.unshift(`The mistake was <b>${esc(q.bad)}</b>; the correct form is <b>${esc(q.good)}</b>.`);
  if (gram.length) parts.push(`<div class="xk">Grammar</div>${gram.map(g => `<p>${g}</p>`).join("")}`);
  // the matching part of the lesson
  if (q.lid && EN[q.lid]) {
    const i = secMatch(q.lid, [q.hear, right, q.bad, q.why, q.hint, q.c].filter(Boolean).join(" "));
    const s = EN[q.lid].s[i >= 0 ? i : 0];
    if (s) parts.push(`<div class="xk">${i >= 0 ? "The rule behind it" : "The key idea of this lesson"}</div>${secHtml(s)}`);
    parts.push(lessonEnHtml(q.lid));
  }
  if (q.t === "speak") parts.push(`<p class="small">Speech recognition checks that your sentence can be understood; it cannot hear every detail of your accent. Use <b>Comparer</b> to listen to the model and to yourself one after the other.</p>`);
  if (q.t === "write") parts.push(`<p class="small">Read the model slowly: underline the structures from this lesson, then check your text against each point of the checklist. A good answer does not need to look like the model — it needs to do what the task asks, with the grammar of the lesson used correctly.</p>`);
  if (!parts.length) return "";
  return `<div class="xen"><div class="xen-h"><span class="flag">EN</span>Explanation</div>${parts.join("")}</div>`;
}

/* comprehension questions on a lesson document */
function docQEn(l, q) {
  const e = EN[l.id]; if (!e || !e.tr) return "";
  const quote = ((q[3] || "").match(/«\s*([^»]{6,})»/) || [])[1];
  const needle = deacc(lc(plain(quote || q[1]))).replace(/…/g, "").slice(0, 28).trim();
  let idx = -1;
  l.doc.d.forEach((p, i) => { const t = deacc(lc(plain(Array.isArray(p) ? p[1] : p))); if (idx < 0 && needle && t.includes(needle)) idx = i; });
  if (idx < 0 || !e.tr[idx]) return "";
  return `<div class="xen small"><div class="xen-h"><span class="flag">EN</span>Where the answer is</div><p>${esc(e.tr[idx])}</p></div>`;
}
