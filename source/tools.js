/* ═══════════════════════════════════════════════════════════════════
   Pas à pas · practice tools — reading, listening, dictation, numbers,
   conjugation, connectors, register, false friends, expressions, speaking
   ═══════════════════════════════════════════════════════════════════ */
const best = id => S.best[id] != null ? S.best[id] + "%" : "";
function bestSet(id, sc) { S.best[id] = Math.max(S.best[id] || 0, sc); planMark("prac"); save(); }

V.practice = () => {
  const sug = suggestion();
  const dueC = dueCards().length, dueL = LESSONS.filter(l => isDue(l.id)).length, weak = weakCards().length, mist = S.mistakes.filter(m => !m.soft).length;
  return {
    title: "Pratiquer", sub: "Tous les outils, par compétence",
    html: `<button class="lrow" data-a="${sug.a}" ${sug.data || ""} style="background:linear-gradient(135deg,#1F3E9C,#0E1D52);color:#fff;border:0;padding:16px"><div class="ic" style="background:rgba(255,255,255,.14)">${sug.ic}</div><div class="tx"><span style="color:rgba(255,255,255,.75);font-weight:700;font-size:12px">Suggestion du jour</span><b style="font-family:var(--disp);font-size:21px;font-weight:600">${esc(sug.t)}</b><span style="color:rgba(255,255,255,.8)">${esc(sug.s)}</span></div><span style="color:#fff">${IC.arrow}</span></button>
    ${sec("Réviser", "Mémoriser")}
    ${group([row("reviewCards", "🗂️", "Cartes à revoir", dueC ? plural(dueC, "carte", "cartes") + " en attente" : "Rien à revoir pour l'instant", dueC || "", "", "t-gold"),
      row("reviewLessons", "↻", "Leçons à revoir", dueL ? plural(dueL, "leçon", "leçons") + " à revoir" : "Aucune", dueL || "", "", "t-blue"),
      row("reviewCards", "🩹", "Cartes difficiles", weak ? plural(weak, "carte", "cartes") + " à retravailler" : "Aucune", "", 'data-weak="1"', "t-red"),
      row("go", "📓", "Carnet d'erreurs", plural(mist, "erreur", "erreurs") + " notée" + (mist > 1 ? "s" : ""), "", 'data-v="notebook"', "t-violet")])}
    ${sec("Écouter et lire", "Compréhension")}
    ${group([row("go", "🎧", "Écoute", plural(LISTENINGS.length, "enregistrement", "enregistrements") + " · deux voix", "", 'data-v="listenList"', "t-blue"),
      row("go", "📖", "Lecture", plural(READINGS.length, "texte", "textes") + " avec questions", "", 'data-v="readList"', "t-green"),
      row("dictStart", "✍️", "Dictée", "Écoutez une phrase, écrivez-la", best("dict"), "", "t-gold"),
      row("numStart", "🔢", "Nombres", "Prix, heures, numéros de téléphone", best("num"), "", "t-orange")])}
    ${sec("Grammaire et vocabulaire")}
    ${group([row("go", "🔁", "Conjugaison", "Dix verbes à votre niveau", best("conj"), 'data-v="conj"', "t-blue"),
      row("go", "📚", "Tableaux de verbes", "Tous les temps de 50 verbes", "", 'data-v="conjTable"', "t-violet"),
      row("connStart", "🔗", "Connecteurs", "Cause, concession, but…", best("conn"), "", "t-teal"),
      row("regStart", "🎩", "Registres", "Familier · courant · soutenu", best("reg"), "", "t-gold"),
      row("faStart", "⚠️", "Faux amis", "Actuellement ne veut pas dire actually", best("fa"), "", "t-red"),
      row("idStart", "💬", "Expressions", "Les expressions vraiment utilisées", best("id"), "", "t-green")])}
    ${sec("Parler et écrire", "Production")}
    ${group([row("go", "🎙️", "Parler une minute", "Un sujet, un chrono, votre enregistrement", "", 'data-v="speakList"', "t-red"),
      row("go", "📝", "Écrire", "Sujets d'examen avec chrono et grille", "", 'data-v="exam" data-lv="' + S.level + '"', "t-blue")])}`
  };
};

/* ── generic quiz form (used by reading, listening, exam) ────────── */
function quizForm(id, qs, prev) {
  return `<form id="qf" onsubmit="return false">${qs.map((q, i) => {
    const opts = q._o || (q._o = shuffle([q[1], ...q[2]]));
    return `<div class="card flat" data-q="${i}"><div style="font-weight:600;margin-bottom:8px">${i + 1}. ${esc(q[0])}${q[4] ? ` <span class="muted tiny">· ${q[4]} pt${q[4] > 1 ? "s" : ""}</span>` : ""}</div>
      ${opts.map((o, j) => `<label class="chk"><input type="radio" name="q${i}" value="${esc(o)}"><span>${esc(o)}</span></label>`).join("")}<div class="why small muted hide" style="margin-top:6px">${q[3] ? esc(q[3]) : ""}</div></div>`;
  }).join("")}</form><button class="btn primary block" data-a="quizCheck" data-id="${id}">Vérifier mes réponses</button>`;
}
let QF = null; // {id, qs, onScore}
A.quizCheck = d => {
  const { qs, onScore } = QF; let got = 0, max = 0;
  qs.forEach((q, i) => {
    const pts = q[4] || 1; max += pts;
    const el = $(`input[name="q${i}"]:checked`); const card = $(`[data-q="${i}"]`);
    $$(`input[name="q${i}"]`).forEach(x => { x.disabled = true; const lab = x.parentElement; if (x.value === q[1]) lab.style.color = "var(--ok)"; else if (x.checked) lab.style.color = "var(--bad)"; });
    const ok = el && el.value === q[1]; if (ok) got += pts;
    if (!ok) { const o = shuffle([q[1], ...q[2]]); S.mistakes.unshift({ t: Date.now(), q: { t: "mc", k: "Compréhension", prompt: `<div class="qs">${esc(q[0])}</div>`, opts: o, a: o.indexOf(q[1]), why: q[3] || "", model: q[1], cat: QF.cat || "écoute" }, given: el ? el.value : "", cat: QF.cat || "écoute", type: "mc" }); }
    card.style.borderColor = ok ? "var(--ok)" : "var(--bad)"; const w = card.querySelector(".why"); w.classList.remove("hide");
  });
  S.mistakes = S.mistakes.slice(0, 160); logAnswer(qs.length);
  const sc = Math.round(100 * got / max); onScore && onScore(got, max, sc);
  $("#qres").innerHTML = `<div class="card" style="text-align:center"><div class="timer">${got} / ${max}</div><div class="muted">${sc}%${QF.scale ? ` · environ ${Math.round(QF.scale * got / max * 2) / 2} / ${QF.scale} sur le barème de l'examen` : ""}</div></div>`;
  d && $("#qres").scrollIntoView({ behavior: "smooth", block: "center" });
  const b = $('[data-a="quizCheck"]'); if (b) b.remove();
};

/* ── Reading ─────────────────────────────────────────────────────── */
V.readList = c => {
  const lv = c.lv || S.level;
  return {
    title: "Lire", sub: "Textes avec questions",
    html: `<div class="seg">${LV.map(x => `<button aria-pressed="${x === lv}" data-a="subLv" data-lv="${x}">${x}</button>`).join("")}</div>
    ${READINGS.filter(r => r.lvl === lv).map(r => row("go", r.exam ? "🎯" : "📖", esc(r.t), `${esc(r.kind || "texte")} · ${countWords(r.paras.join(" "))} mots · ${plural(r.q.length, "question", "questions")}`, best("r:" + r.id), `data-v="read" data-id="${r.id}"`)).join("")}`
  };
};
A.subLv = d => { cur().lv = d.lv; render(); };
V.read = c => {
  const r = READINGS.find(x => x.id === c.id);
  QF = { id: r.id, qs: r.q, cat: "lecture", onScore: (g, m, sc) => bestSet("r:" + r.id, sc) };
  return {
    title: "Lire", sub: r.lvl + " · " + (r.kind || "texte"), after: () => AUD.prefetch("R-" + r.id),
    html: `<h2 class="pg">${esc(r.t)}</h2>${r.src ? `<p class="pg-sub">${esc(r.src)}</p>` : ""}
    <div class="card reading">${r.paras.map(p => `<p data-a="say" data-t="${esc(p)}">${esc(p)}</p>`).join("")}<div class="muted tiny">Touchez un paragraphe pour l'écouter.</div></div>
    ${r.gloss ? `<details class="more card flat"><summary>Aide au vocabulaire</summary>${r.gloss.map(g => `<div class="small" style="padding:4px 0"><b>${esc(g[0])}</b> — <span class="en">${esc(g[1])}</span></div>`).join("")}</details>` : ""}
    <h3 class="sec">Questions</h3>${quizForm(r.id, r.q)}<div id="qres"></div>`
  };
};

/* ── Listening ───────────────────────────────────────────────────── */
V.listenList = c => {
  const lv = c.lv || S.level;
  return {
    title: "Écouter", sub: "Enregistrements avec questions",
    html: `<div class="seg">${LV.map(x => `<button aria-pressed="${x === lv}" data-a="subLv" data-lv="${x}">${x}</button>`).join("")}</div>
    ${LISTENINGS.filter(r => r.lvl === lv).map(r => row("go", r.exam ? "🎯" : "🎧", esc(r.t), `${esc(r.kind)} · ${plural(r.q.length, "question", "questions")}`, best("l:" + r.id), `data-v="listen" data-id="${r.id}"`)).join("")}`
  };
};
let LS = { plays: 0 };
V.listen = c => {
  const r = LISTENINGS.find(x => x.id === c.id); const exam = !!c.exam;
  LS = { id: r.id, plays: 0, max: exam ? (r.plays || 2) : 99 };
  QF = { id: r.id, qs: r.q, cat: "écoute", scale: exam ? null : null, onScore: (g, m, sc) => { bestSet("l:" + r.id, sc); if (exam) { S.exam[r.lvl + ":" + r.id] = { got: g, max: m, date: Date.now() }; save(); } $("#scr").classList.remove("hide"); } };
  return {
    title: "Écouter", sub: r.lvl + " · " + r.kind, after: () => AUD.prefetch("A-" + r.id),
    html: `<h2 class="pg">${esc(r.t)}</h2><p class="pg-sub">${esc(r.intro || "Lisez d'abord les questions, puis écoutez.")}</p>
    <div class="card" style="text-align:center"><button class="bigplay" data-a="lsPlay">${IC.play}</button><div class="muted tiny">${uniq(r.lines.map(x => x[0])).join(" · ")}</div>
      <div class="muted small" id="lsInfo">${exam ? `Conditions d'examen : ${r.plays || 2} écoute${(r.plays || 2) > 1 ? "s" : ""}` : "Écoutez autant de fois que vous voulez"}</div>
      <div class="row" style="justify-content:center;margin-top:8px"><button class="btn sm ghost" data-a="lsStop">Arrêter</button>${!exam ? `<button class="btn sm ghost" data-a="lsPlay" data-slow="1">Plus lent</button>` : ""}</div></div>
    <h3 class="sec">Questions</h3>${quizForm(r.id, r.q)}<div id="qres"></div>
    <div id="scr" class="${exam ? "hide" : ""}"><details class="more card flat"><summary>Transcription</summary><div class="script">${r.lines.map(l => `<div class="line" data-a="say" data-t="${esc(l[1])}" data-m="${MALE.has(l[0]) ? 1 : 0}"><b>${esc(l[0])}</b><span>${esc(l[1])}</span></div>`).join("")}</div></details></div>`
  };
};
A.lsPlay = d => {
  const r = LISTENINGS.find(x => x.id === LS.id);
  if (LS.plays >= LS.max) { toast("Plus d'écoute possible en conditions d'examen"); return; }
  LS.plays++; $("#lsInfo").textContent = `Écoute ${LS.plays}${LS.max < 99 ? " sur " + LS.max : ""}…`;
  TTS.play(r.lines, { rate: (S.set.rate || .95) * (d.slow ? .8 : 1), onend: () => { $("#lsInfo") && ($("#lsInfo").textContent = LS.max < 99 ? `${LS.max - LS.plays} écoute(s) restante(s)` : "Terminé — réécoutez quand vous voulez"); } });
};
A.lsStop = () => TTS.stop();

/* ── Dictation ──────────────────────────────────────────────────── */
A.dictStart = () => {
  const lv = S.level; const ls = lvlLessons(lv);
  const pool = ls.flatMap(l => (l.sent || []).map((s, i) => ({ l, s, k: l.id + ":s" + i }))).filter(o => tokenize(o.s[0]).length <= 16);
  const items = leastSeen(pool, o => o.k + "d", 6);
  startSession({ kind: "tool", title: "Dictée · " + lv, noRepair: true, qs: items.map(o => Object.assign(Q.dict(o.l, o.s, o.k + "d"), { lid: o.l.id })), onDone: sc => { bestSet("dict", sc); return { msg: "Dictée · " + lv }; } });
};

/* ── Numbers ────────────────────────────────────────────────────── */
function numFr(n) {
  const u = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
  const t = ["", "", "vingt", "trente", "quarante", "cinquante", "soixante"];
  const two = n => {
    if (n < 20) return u[n];
    if (n < 70) { const d = Math.floor(n / 10), r = n % 10; return t[d] + (r === 1 ? " et un" : r ? "-" + u[r] : ""); }
    if (n < 80) return n === 71 ? "soixante et onze" : "soixante-" + u[n - 60];
    if (n === 80) return "quatre-vingts";
    return "quatre-vingt-" + u[n - 80];
  };
  const three = n => { const c = Math.floor(n / 100), r = n % 100; let s = c === 0 ? "" : c === 1 ? "cent" : u[c] + " cent" + (r === 0 ? "s" : ""); if (r) s += (s ? " " : "") + two(r); return s || "zéro"; };
  if (n < 1000) return three(n);
  const m = Math.floor(n / 1000), r = n % 1000;
  return (m === 1 ? "mille" : three(m).replace(/cents$/, "cent") + " mille") + (r ? " " + three(r) : "");
}
function numItem() {
  const kind = pick(["n", "n", "price", "phone", "time", "year"], 1)[0]; const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  if (kind === "n") { const n = pick([R(70, 99), R(70, 99), R(100, 999), R(1000, 9999)], 1)[0]; return { tts: numFr(n), acc: [String(n), n.toLocaleString("fr-FR").replace(/ | /g, " ")], model: String(n), k: "Écrivez le nombre" }; }
  if (kind === "price") { const e = R(2, 99), c = pick([0, 50, 20, 90, 95, 75, 30], 1)[0]; return { tts: numFr(e) + " euros" + (c ? " " + numFr(c) : ""), acc: [`${e},${String(c).padStart(2, "0")}`, `${e}.${String(c).padStart(2, "0")}`, ...(c ? [] : [String(e)])], model: `${e},${String(c).padStart(2, "0")} €`, k: "Écrivez le prix (ex. : 12,50)" }; }
  if (kind === "phone") { const g = [pick(["06", "07", "01"], 1)[0], ...[1, 2, 3, 4].map(() => String(R(10, 99)))]; return { tts: g.map(x => x === "06" ? "zéro six" : x === "07" ? "zéro sept" : x === "01" ? "zéro un" : numFr(+x)).join(", "), acc: [g.join(" "), g.join(""), g.join(".")], model: g.join(" "), k: "Écrivez le numéro de téléphone" }; }
  if (kind === "time") { const h = R(7, 23), m = pick([5, 10, 15, 20, 25, 30, 40, 45, 50, 55], 1)[0]; return { tts: numFr(h) + (h === 1 ? " heure " : " heures ") + numFr(m), acc: [`${h}h${m}`, `${h}:${m}`, `${h} h ${m}`, `${h}h ${m}`], model: `${h} h ${m}`, k: "Écrivez l'heure (ex. : 14h45)" }; }
  const y = R(1950, 2030); return { tts: numFr(y), acc: [String(y)], model: String(y), k: "Écrivez l'année" };
}
A.numStart = () => {
  const qs = Array.from({ length: 10 }, () => { const it = numItem(); return { t: "type", k: it.k, prompt: `<div class="muted small" style="text-align:center">Écoutez</div>`, play: it.tts, acc: it.acc, model: it.model, why: esc(it.tts), hear: it.tts, short: true, cat: "nombres" }; });
  startSession({ kind: "tool", title: "Nombres", noRepair: true, qs, onDone: sc => { bestSet("num", sc); return { msg: "Nombres, prix, heures" }; } });
};

/* ── Conjugation ────────────────────────────────────────────────── */
const TENSE_SETS = { B1: ["pres", "pc", "imp", "fut", "cond", "subj"], B2: ["pres", "pc", "imp", "pqp", "fut", "futant", "cond", "condp", "subj"], C1: ["imp", "pqp", "futant", "condp", "subj", "subjp", "ps"] };
V.conj = () => {
  const lv = S.level;
  return {
    title: "Conjugaison", sub: "Sprint de conjugaison",
    html: `<p class="pg-sub" style="margin-top:12px">Dix questions. Les temps dépendent du niveau choisi.</p>
    ${LV.map(l => `<button class="lrow" data-a="conjStart" data-lv="${l}"><div class="ic">${lvBadge(l)}</div><div class="tx"><b>Temps du ${l}</b><span>${TENSE_SETS[l].map(t => TENSES[t].fr).join(" · ")}</span></div>${IC.chev}</button>`).join("")}
    <button class="btn block" data-a="go" data-v="conjTable" style="margin-top:12px">Consulter un tableau de conjugaison</button>`
  };
};
A.conjStart = d => {
  const lv = d.lv || S.level; const ts = TENSE_SETS[lv];
  const verbs = Object.keys(VERBS).filter(v => (VERBS[v].lv || "B1") <= lv || lv === "C1");
  const qs = Array.from({ length: 10 }, () => {
    const v = pick(verbs, 1)[0], t = pick(ts, 1)[0], p = Math.floor(Math.random() * 6);
    const forms = conj(v, t); const f = forms[p];
    const pro = PRON[t === "subj" || t === "subjp" ? "subj" : "std"][p];
    const f0 = f.split("|")[0]; const pr = elide(pro, f0);
    const sp = pr.split(" / ")[0]; const hear = /'$/.test(sp) ? sp + f0 : sp + " " + f0;
    return { t: "type", k: TENSES[t].fr, prompt: `<div class="qs">${esc(pr)} <span class="blank">?</span></div><div class="muted small">${esc(v)} · ${esc(TENSES[t].fr)} <span class="en">(${esc(TENSES[t].en)})</span></div>`, acc: f, model: f0, why: `<b>${esc(v)}</b> · ${esc(TENSES[t].fr)}<br>${conjTableHtml(v, t)}`, hear, short: true, cat: "conjugaison" };
  });
  startSession({ kind: "tool", title: "Conjugaison · " + lv, qs, onDone: sc => { bestSet("conj", sc); return { msg: "Conjugaison · " + lv }; } });
};
function elide(pro, form) { if (/^je$/.test(pro) && /^[aeiouéèêhâîôy]/i.test(form)) return "j'"; if (/^que je$/.test(pro) && /^[aeiouéèêhâîôy]/i.test(form)) return "que j'"; return pro; }
function conjWithPro(pro, f) { const e = elide(pro, f); return /'$/.test(e) ? e + f : e + " " + f; }
function conjTableHtml(v, t) { const f = conj(v, t); const P = PRON[t === "subj" || t === "subjp" ? "subj" : "std"]; return `<table class="fmt conj" style="margin-top:6px">${f.map((x, i) => `<tr><td class="muted">${esc(elide(P[i], x))}</td><td><b>${esc(x.split("|")[0])}</b></td></tr>`).join("")}</table>`; }
V.conjTable = c => {
  const v = c.verb || "venir";
  return {
    title: "Tableaux de verbes", sub: v,
    html: `<select class="inp" data-c="conjPick" style="margin-top:12px">${Object.keys(VERBS).sort((a, b) => a.localeCompare(b, "fr")).map(x => `<option ${x === v ? "selected" : ""}>${x}</option>`).join("")}</select>
    <div class="muted small" style="margin:8px 0">${esc(VERBS[v].en)} · auxiliaire <b>${VERBS[v].aux === "e" ? "être" : "avoir"}</b> · participe passé <b>${esc(VERBS[v].pp)}</b></div>
    ${Object.keys(TENSES).map(t => `<div class="card flat"><div class="row between"><b>${esc(TENSES[t].fr)}</b><span class="en small">${esc(TENSES[t].en)}</span></div>${conjTableHtml(v, t)}</div>`).join("")}`
  };
};
CHANGE.conjPick = el => { cur().verb = el.value; render(); };

/* ── Connectors, register, false friends, expressions ───────────── */
A.connStart = () => {
  const lv = S.level; const pool = CONNECTORS.filter(c => c[5] <= lv || lv === "C1");
  const qs = pick(pool, 10).map((c, i) => {
    if (i % 2 === 0) {
      const o = optsFrom(FN[c[1]], Object.values(FN), 3);
      return { t: "mc", k: "Qu'exprime ce connecteur ?", prompt: `<div class="qp">${esc(c[0])}</div><div class="muted small">${esc(c[2])}</div>`, ...o, why: `${esc(c[3])}<br><span class="en">${esc(c[4])}</span>`, hear: c[3], cat: "connecteurs" };
    }
    const others = CONNECTORS.filter(x => x[1] !== c[1] && x[2] === c[2]).map(x => x[0]);
    const o = optsFrom(c[0], others.length >= 3 ? others : CONNECTORS.filter(x => x[1] !== c[1]).map(x => x[0]), 3);
    const s = c[3].replace(connRe(c[0]), m => /'$/.test(m) ? "____ " : "____");
    return { t: "mc", k: "Choisissez le connecteur", prompt: `<div class="qs">${fmtBlank(s)}</div><div class="qen">${esc(c[4])}</div>`, ...o, why: `<b>${esc(c[0])}</b> — ${esc(FN[c[1]])} · ${esc(c[2])}`, hear: c[3], cat: "connecteurs" };
  });
  startSession({ kind: "tool", title: "Connecteurs", qs, onDone: sc => { bestSet("conn", sc); return { msg: "Connecteurs · " + lv }; } });
};
function connRe(w) { return new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/que$/, "qu(?:e|')"), "i"); }
A.regStart = () => {
  const qs = pick(REGISTERS, 10).map((r, i) => {
    if (i % 3 === 2) { const o = optsFrom(r[0], [r[1], r[2]], 2); return { t: "mc", k: "Laquelle est familière ?", prompt: `<div class="qen">${esc(r[3])}</div>`, ...o, why: `familier: <b>${esc(r[0])}</b><br>courant: ${esc(r[1])}<br>soutenu: ${esc(r[2])}`, hear: r[0], cat: "registre" }; }
    const other = REGISTERS.filter(x => x !== r).map(x => x[2]);
    const o = optsFrom(r[2], [r[0], ...pick(other, 2)], 3);
    return { t: "mc", k: "Dites-le en registre soutenu", prompt: `<div class="qp">${esc(r[1])}</div><div class="qen">${esc(r[3])}</div>`, ...o, why: `familier: ${esc(r[0])}<br>courant: ${esc(r[1])}<br>soutenu: <b>${esc(r[2])}</b>`, hear: r[2], cat: "registre" };
  });
  startSession({ kind: "tool", title: "Registres", qs, onDone: sc => { bestSet("reg", sc); return { msg: "Familier · courant · soutenu" }; } });
};
A.faStart = () => {
  const qs = pick(FAUXAMIS, 10).map((f, i) => {
    if (i % 2 === 0) { const o = optsFrom(f[1], [f[2], ...pick(FAUXAMIS.filter(x => x !== f).map(x => x[1]), 2)], 3); return { t: "mc", k: "Que veut dire… ?", prompt: `<div class="qp">${esc(f[0])}</div>`, ...o, why: `${esc(f[4])}<br><span class="en">${esc(f[5])}</span><br>« ${esc(f[2])} » en français : <b>${esc(f[3])}</b>`, hear: f[4], cat: "lexique" }; }
    const o = optsFrom(f[3], [f[0], ...pick(FAUXAMIS.filter(x => x !== f).map(x => x[3]), 2)], 3);
    return { t: "mc", k: "Comment le dire en français ?", prompt: `<div class="qp en" style="font-style:italic">${esc(f[2])}</div>`, ...o, why: `<b>${esc(f[0])}</b> signifie « ${esc(f[1])} », et non « ${esc(f[2])} ».`, hear: f[3], cat: "lexique" };
  });
  startSession({ kind: "tool", title: "Faux amis", qs, onDone: sc => { bestSet("fa", sc); return { msg: "Faux amis" }; } });
};
A.idStart = () => {
  const lv = S.level; const pool = IDIOMS.filter(x => (x[4] || "B1") <= lv || lv === "C1");
  const qs = pick(pool, 10).map((x, i) => {
    if (i % 2) { const o = optsFrom(x[0], pool.filter(y => y !== x).map(y => y[0]), 3); return { t: "mc", k: "Quelle expression ?", prompt: `<div class="qp en" style="font-style:italic">${esc(x[1])}</div>`, ...o, why: `${esc(x[2])}<br><span class="en">${esc(x[3])}</span>`, hear: x[2], cat: "lexique" }; }
    const o = optsFrom(x[1], pool.filter(y => y !== x).map(y => y[1]), 3);
    return { t: "mc", k: "Que veut dire… ?", prompt: `<div class="qp">${esc(x[0])}</div><div class="small muted">${esc(x[2])}</div>`, audio: x[2], ...o, why: `<span class="en">${esc(x[3])}</span>`, hear: x[0], cat: "lexique" };
  });
  startSession({ kind: "tool", title: "Expressions", qs, onDone: sc => { bestSet("id", sc); return { msg: "Expressions" }; } });
};

/* ── timers and recorder (shared with the exam) ─────────────────── */
const TM = { id: 0, left: 0, run: false, el: null };
function timerHtml(sec, label = "") { TM.left = sec; TM.total = sec; TM.run = false; clearInterval(TM.id); return `<div class="card flat" style="text-align:center"><div class="muted small">${esc(label)}</div><div class="timer" id="tm">${fmtT(sec)}</div><div class="row" style="justify-content:center"><button class="btn sm" data-a="tmGo" id="tmB">Démarrer</button><button class="btn sm ghost" data-a="tmReset">Remettre à zéro</button></div></div>`; }
const fmtT = s => { s = Math.max(0, Math.round(s)); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(x).padStart(2, "0"); };
A.tmGo = () => {
  TM.run = !TM.run; $("#tmB").textContent = TM.run ? "Pause" : "Reprendre"; clearInterval(TM.id);
  if (TM.run) { const end = Date.now() + TM.left * 1000; TM.id = setInterval(() => { TM.left = (end - Date.now()) / 1000; const e = $("#tm"); if (!e) { clearInterval(TM.id); return; } e.textContent = fmtT(TM.left); if (TM.left <= 0) { clearInterval(TM.id); TM.run = false; blip(true); e.style.color = "var(--rose)"; e.textContent = "0:00"; $("#tmB").textContent = "Terminé"; toast("Temps écoulé"); } }, 250); }
};
A.tmReset = () => { clearInterval(TM.id); TM.run = false; TM.left = TM.total; $("#tm").textContent = fmtT(TM.total); $("#tm").style.color = ""; $("#tmB").textContent = "Démarrer"; };
function recHtml(key) { return `<div class="card flat"><b>Votre enregistrement</b><div class="rec" style="margin-top:8px"><button class="btn sm primary" data-a="recGo" data-k="${esc(key)}" id="recB">● Enregistrer</button><button class="btn sm" data-a="recPlay" data-k="${esc(key)}">▶ Réécouter</button><span id="recS" class="muted small"></span></div><audio id="recA" class="hide"></audio></div>`; }
A.recGo = async d => {
  if (Rec.mr) { const b = await Rec.stop(); $("#recB").textContent = "● Réenregistrer"; $("#recS").textContent = "Enregistré sur ce téléphone"; if (b) await IDB.put(d.k, b); planMark("prac"); logAnswer(1); return; }
  TTS.stop(); if (await Rec.start()) { $("#recB").innerHTML = "■ Arrêter"; $("#recS").innerHTML = `<span class="recdot"></span> enregistrement`; }
};
A.recPlay = async d => { const b = await IDB.get(d.k).catch(() => null); if (!b) { toast("Pas encore d'enregistrement"); return; } const a = $("#recA"); a.src = URL.createObjectURL(b); a.play(); };

/* ── Speak for a minute ─────────────────────────────────────────── */
V.speakList = c => {
  const lv = c.lv || S.level;
  return {
    title: "Parler", sub: "Parler une minute",
    html: `<div class="seg">${LV.map(x => `<button aria-pressed="${x === lv}" data-a="subLv" data-lv="${x}">${x}</button>`).join("")}</div>
    ${SPEAK_TOPICS.filter(t => t.lvl === lv).map((t, i) => row("go", "🎙️", esc(t.t), esc(t.q), "", `data-v="speak" data-id="${SPEAK_TOPICS.indexOf(t)}"`)).join("")}`
  };
};
V.speak = c => {
  const t = SPEAK_TOPICS[+c.id]; const sec = t.lvl === "B1" ? 60 : t.lvl === "B2" ? 90 : 120;
  return {
    title: "Parler", sub: t.lvl,
    html: `<h2 class="pg">${esc(t.t)}</h2><div class="card"><div class="qs">${esc(t.q)}</div>${spkBtn(t.q)}</div>
    <details class="more card flat"><summary>Idées et phrases utiles</summary><ul class="pts small">${t.ideas.map(x => `<li>${esc(x)}</li>`).join("")}</ul></details>
    ${timerHtml(sec, `Parlez pendant ${fmtT(sec)}`)}${recHtml("speak:" + c.id)}
    <div class="card flat"><b>Auto-évaluation</b>${SPEAK_CHECK[t.lvl].map(x => `<label class="chk"><input type="checkbox"><span>${esc(x)}</span></label>`).join("")}</div>`
  };
};
const SPEAK_CHECK = {
  B1: ["J'ai parlé toute la minute sans longs silences", "J'ai donné une raison ou un exemple (parce que, par exemple)", "J'ai utilisé correctement au moins deux temps du passé", "J'ai terminé par une phrase claire"],
  B2: ["J'ai annoncé mon point de vue dès le début", "J'ai donné deux arguments, chacun avec un exemple", "J'ai utilisé des connecteurs (d'abord, en revanche, c'est pourquoi)", "J'ai utilisé au moins une fois le subjonctif ou le conditionnel", "J'ai conclu et nuancé ma position"],
  C1: ["J'ai introduit le sujet et une question à traiter (problématique)", "J'ai annoncé un plan en deux ou trois parties", "J'ai relié les parties par des transitions", "J'ai utilisé un vocabulaire précis et varié, sans répétitions", "J'ai nuancé (certes… mais, il n'en demeure pas moins que)", "J'ai conclu et ouvert le sujet"]
};
