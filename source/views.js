/* ═══════════════════════════════════════════════════════════════════
   Pas à pas · views — Today, Learn (levels + my courses), lessons, Me
   ═══════════════════════════════════════════════════════════════════ */
const LV = ["B1", "B2", "C1"];
const lvBadge = lv => `<span class="badge lv lv-${lv}">${lv}</span>`;
const row = (a, ic, t, s, end = "", data = "", tint = "") => `<button class="lrow" data-a="${a}" ${data}><div class="ic ${tint}">${ic}</div><div class="tx"><b>${t}</b>${s ? `<span>${s}</span>` : ""}</div>${end ? `<div class="end">${end}</div>` : ""}${IC.chev}</button>`;
const group = rows => `<div class="group">${rows.join("")}</div>`;
const sec = (t, s = "") => `<div class="sec"><b>${t}</b>${s ? `<span>${s}</span>` : ""}</div>`;
const tile = (a, ic, t, s, data = "", best = "") => `<button class="tile" data-a="${a}" ${data}><div class="ic">${ic}</div><b>${t}</b><span>${s}</span>${best ? `<div class="best">${best}</div>` : ""}</button>`;
const EMB = `<img class="emb" src="logo.png" alt="">`;
const TRI = `<div class="tri"><i></i><i></i><i></i></div>`;
A.go = d => go(d.v, Object.assign({}, d));
A.tab = d => tab(d.tab);
A.say = d => say(d.t, { slow: !!d.slow, alt: d.m === "1" });
A.closeSheet = () => closeSheet();
A.setLevel = d => { S.level = d.lv; save(); const c = cur(); c.lv = d.lv; render(); };

/* ── Today ───────────────────────────────────────────────────────── */
V.today = () => {
  const lv = S.level;
  const resumeIds = Object.keys(S.resume).filter(id => LESSON[id]).sort((a, b) => S.resume[b].at - S.resume[a].at);
  const nx = nextLesson(lv);
  const dueC = dueCards().length, dueL = LESSONS.filter(l => isDue(l.id)).length;
  const plan = S.plan[dayKey()] || {};
  const nDone = ["rev", "les", "prac"].filter(k => plan[k]).length;
  let hero;
  if (resumeIds.length) {
    const l = LESSON[resumeIds[0]], r = S.resume[l.id];
    hero = { t: "On continue ?", p: `${l.t} · question ${r.i + 1} sur ${r.qs.length}`, btn: `<button class="cta" data-a="startLesson" data-id="${l.id}" data-resume="1">Continuer ${IC.arrow}</button>` };
  } else if (nx) {
    hero = { t: "On y va ?", p: `Environ 15 minutes : une révision, une nouvelle leçon, un entraînement.`, btn: `<button class="cta" data-a="go" data-v="lesson" data-id="${nx.id}">Nouvelle leçon ${IC.arrow}</button>` };
  } else {
    const nlv = LV[LV.indexOf(lv) + 1];
    hero = { t: nlv ? `Bravo, ${lv} terminé !` : "Tout est fait !", p: nlv ? `Passez au ${nlv}, ou testez-vous avec un examen blanc.` : "Continuez les révisions et entraînez-vous pour le DALF C1.", btn: nlv ? `<button class="cta" data-a="setLevelGo" data-lv="${nlv}">Passer au ${nlv} ${IC.arrow}</button>` : `<button class="cta" data-a="tab" data-tab="exam">Examen blanc ${IC.arrow}</button>` };
  }
  const sug = suggestion();
  const idiom = IDIOMS[(Math.floor(Date.now() / DAY)) % IDIOMS.length];
  const known = Object.values(S.cards).filter(c => c.b >= 3).length;
  const done = LESSONS.filter(l => lessonState(l.id).done).length;
  const planRow = (k, n, ic, tint, t, s, a, data) => `<button class="lrow ${plan[k] ? "done" : ""}" data-a="${a}" ${data || ""}><div class="num">${plan[k] ? "✓" : n}</div><div class="ic ${tint}">${ic}</div><div class="tx"><b>${t}</b><span>${s}</span></div>${IC.chev}</button>`;
  const courseRows = COURSES.map(c => { const l = courseNext(c); return l ? row("go", c.ic, `${esc(c.short)} · ${esc(l.unitT)}`, esc(l.t), "", `data-v="lesson" data-id="${l.id}"`, c.tint) : ""; }).filter(Boolean);
  return {
    title: "Aujourd'hui", sub: greet(),
    html: `
    <div class="hero">${EMB}<div class="pill">Plan du jour · ${nDone}/3</div><h3>${esc(hero.t)}</h3><p>${esc(hero.p)}</p>${hero.btn}${TRI}</div>
    ${examCountdown()}
    ${sec("Plan du jour", nDone + " / 3")}
    <div class="group plan">
      ${planRow("rev", 1, "🗂️", "t-gold", "Réviser", dueC ? plural(dueC, "carte", "cartes") + " à revoir" + (dueL ? " · " + plural(dueL, "leçon", "leçons") : "") : dueL ? plural(dueL, "leçon", "leçons") + " à revoir" : "Rien à revoir · refaites vos erreurs", dueC ? "reviewCards" : dueL ? "reviewLessons" : "reviewMistakes")}
      ${planRow("les", 2, "📘", "t-blue", nx ? "Nouvelle leçon · " + esc(nx.t) : "Niveau " + lv + " terminé", nx ? esc(nx.st || nx.en) : "Choisissez le niveau suivant dans Apprendre", nx ? "go" : "tab", nx ? `data-v="lesson" data-id="${nx.id}"` : `data-tab="learn"`)}
      ${planRow("prac", 3, sug.ic, "t-red", "Pratique · " + esc(sug.t), esc(sug.s), sug.a, sug.data)}
    </div>
    <div class="stats"><div><span class="e">🔥</span><div><b>${streak()}</b><span>jours de suite</span></div></div><div><span class="e">🃏</span><div><b>${known}</b><span>cartes maîtrisées</span></div></div><div><span class="e">⭐</span><div><b>${done}</b><span>leçons terminées</span></div></div></div>
    ${resumeIds.length > 1 ? sec("En cours", "Leçons commencées") + group(resumeIds.slice(1).map(id => row("startLesson", "▶️", esc(LESSON[id].t), `Question ${S.resume[id].i + 1}/${S.resume[id].qs.length}`, LESSON[id].lvl, `data-id="${id}" data-resume="1"`, "t-gold"))) : ""}
    ${courseRows.length ? sec("Mes cours", "Vos manuels") + group(courseRows) : ""}
    ${sec("Expression du jour")}
    <div class="card"><div class="row between" style="flex-wrap:nowrap"><div style="flex:1"><div style="font-family:var(--disp);font-size:22px;font-weight:600;line-height:1.2">${esc(idiom[0])}</div><div class="en" style="margin-top:2px">${esc(idiom[1])}</div></div>${spkBtn(idiom[0])}</div>
      <button class="ex" data-a="say" data-t="${esc(idiom[2])}" style="margin-top:10px;border-top:1px solid var(--line)"><span class="spk">${IC.spk}</span><span><span class="fr">${esc(idiom[2])}</span><span class="en">${esc(idiom[3] || "")}</span></span></button></div>`,
    after: () => { const n = nx || (resumeIds[0] && LESSON[resumeIds[0]]); if (n) AUD.prefetch("L-" + n.id); }
  };
};
A.setLevelGo = d => { S.level = d.lv; save(); tab("learn"); };
function greet() { const h = new Date().getHours(); const n = S.set.name || ""; return (h < 5 ? "Bonne nuit" : h < 18 ? "Bonjour" : "Bonsoir") + (n ? ", " + n : "") + " · " + S.level; }
function examCountdown() {
  if (!S.set.examDate) return "";
  const d = Math.ceil((new Date(S.set.examDate + "T09:00") - Date.now()) / DAY);
  if (isNaN(d) || d < 0) return "";
  const lv = S.set.examLevel; const nm = EXAMS[lv] ? EXAMS[lv].name : lv;
  return group([row("tab", "🎯", `${esc(nm)} dans ${d} jour${d > 1 ? "s" : ""}`, `${new Date(S.set.examDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} · ouvrir les épreuves blanches`, "", `data-tab="exam"`, "t-red")]);
}
function suggestion() {
  const list = [
    { ic: "🎧", t: "Écoute", s: "Un enregistrement à votre niveau, avec des questions", a: "go", data: 'data-v="listenList"' },
    { ic: "🔁", t: "Conjugaison", s: "Dix verbes aux temps de votre niveau", a: "conjStart" },
    { ic: "✍️", t: "Dictée", s: "Six phrases, accents compris", a: "dictStart" },
    { ic: "📖", t: "Lecture", s: "Un texte à votre niveau, avec des questions", a: "go", data: 'data-v="readList"' },
    { ic: "🎙️", t: "Parler une minute", s: "Un sujet, un chrono et votre enregistrement", a: "go", data: 'data-v="speakList"' },
    { ic: "🔗", t: "Connecteurs", s: "Les mots qui structurent un argument", a: "connStart" },
    { ic: "🔢", t: "Nombres", s: "Prix, heures, numéros de téléphone", a: "numStart" },
    { ic: "🎩", t: "Registres", s: "Familier, courant, soutenu", a: "regStart" }
  ];
  return list[Math.floor(Date.now() / DAY) % list.length];
}

/* ── Learn ───────────────────────────────────────────────────────── */
V.learn = c => {
  const mode = c.mode || S.learnMode || "levels";
  const seg = `<div class="seg"><button aria-pressed="${mode === "levels"}" data-a="learnMode" data-m="levels">Parcours B1 → C1</button><button aria-pressed="${mode === "courses"}" data-a="learnMode" data-m="courses">Mes cours</button></div>`;
  if (mode === "courses") return learnCourses(c, seg);
  const lv = c.lv || S.level; const L = lvlLessons(lv); const meta = LEVELS[lv];
  const done = L.filter(l => lessonState(l.id).done).length;
  const nx = nextLesson(lv);
  const tracks = uniq(L.map(l => l.tr));
  const dueL = L.filter(l => isDue(l.id)).length;
  const pct = Math.round(100 * done / L.length);
  return {
    title: "Apprendre", sub: `${meta.name} · ${done}/${L.length} leçons`,
    html: `${seg}<div class="chips">${LV.map(x => `<button class="chip" aria-pressed="${x === lv}" data-a="setLevel" data-lv="${x}">${x} · ${LEVELS[x].name.split("· ")[1]}</button>`).join("")}</div>
    <div class="lvcard lv-${lv}">${ringSvg(pct, "var(--lv)")}<div class="big">${lv}</div><div style="font-weight:700;margin-top:6px">${esc(meta.name.split("· ")[1])}</div><div class="muted small" style="max-width:70%">${esc(meta.desc)}</div>
      <div class="row" style="margin-top:14px">${nx ? `<button class="btn sm primary" data-a="go" data-v="lesson" data-id="${nx.id}">Suivante : ${esc(nx.t)}</button>` : ""}${dueL ? `<button class="btn sm" data-a="reviewLessons">↻ ${plural(dueL, "révision", "révisions")}</button>` : ""}<button class="btn sm ghost" data-a="go" data-v="exam" data-lv="${lv}">${esc(EXAMS[lv].name)}</button></div></div>
    ${tracks.map(tr => { const T = trackOf({ tr }); return pathHtml(L.filter(l => l.tr === tr), lv, T.t, T.en, nx); }).join("")}`
  };
};
A.learnMode = d => { S.learnMode = d.m; save(); cur().mode = d.m; render(); };
function ringSvg(pct, col) { const C = 2 * Math.PI * 22; return `<svg class="ring" width="58" height="58" viewBox="0 0 58 58"><circle cx="29" cy="29" r="22" stroke="var(--s3)" stroke-width="6" fill="none"/><circle cx="29" cy="29" r="22" stroke="${col}" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct / 100)}" transform="rotate(-90 29 29)"/><text x="29" y="33" text-anchor="middle" font-size="12" font-weight="800" fill="var(--ink)">${pct}%</text></svg>`; }
function pathHtml(items, lvClass, title, sub, nx) {
  return `<div class="unit-h lv-${lvClass}"><div class="dot"></div><div><b>${esc(title)}</b><span>${esc(sub)}</span></div></div>
  <div class="path lv-${lvClass}">${items.map(l => {
    const s = lessonState(l.id), r = S.resume[l.id];
    const cls = [s.done ? "done" : "", nx && nx.id === l.id ? "next" : "", isDue(l.id) ? "due" : ""].join(" ");
    return `<button class="node ${cls}" data-a="go" data-v="lesson" data-id="${l.id}"><div class="num">${s.done ? "✓" : (l.num || items.indexOf(l) + 1)}</div><div class="tx"><b>${esc(l.t)}</b><span>${esc(l.st || l.en)}</span></div>${r ? `<span class="resume-chip">▶ ${r.i + 1}/${r.qs.length}</span>` : s.done ? stars(s.stars) : ""}</button>`;
  }).join("")}</div>`;
}
function courseNext(c) { const ls = LESSONS.filter(l => l.course === c.id); const l = ls.find(x => S.resume[x.id]) || ls.find(x => !lessonState(x.id).done); if (!l) return null; const u = c.units.find(u => u.id === l.unit); return Object.assign({ unitT: u ? u.short : "" }, l); }
function learnCourses(c, seg) {
  const cid = c.course || S.course || COURSES[0].id; const C = COURSES.find(x => x.id === cid);
  const ls = LESSONS.filter(l => l.course === cid); const done = ls.filter(l => lessonState(l.id).done).length;
  const nx = courseNext(C);
  return {
    title: "Apprendre", sub: `${C.t} · ${done}/${ls.length} leçons`,
    html: `${seg}<div class="chips">${COURSES.map(x => `<button class="chip" aria-pressed="${x.id === cid}" data-a="setCourse" data-c="${x.id}">${x.ic} ${esc(x.t)}</button>`).join("")}</div>
    <div class="lvcard lv-${cid}">${ringSvg(Math.round(100 * done / ls.length), "var(--lv)")}<div style="font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--lv)">${esc(C.pub)}</div><div style="font-family:var(--disp);font-size:26px;font-weight:600;line-height:1.15;margin-top:4px;max-width:75%">${esc(C.t)}</div><div class="muted small" style="max-width:75%;margin-top:4px">${esc(C.desc)}</div>
      ${nx ? `<div class="row" style="margin-top:14px"><button class="btn sm primary" data-a="go" data-v="lesson" data-id="${nx.id}">Continuer : ${esc(nx.t)}</button></div>` : ""}</div>
    ${C.units.map(u => pathHtml(ls.filter(l => l.unit === u.id), cid, u.t, u.en, nx)).join("")}
    <p class="muted tiny" style="margin-top:18px">Suit la progression de ${esc(C.t)} (${esc(C.pub)}). Les exercices et les phrases ont été écrits pour cette application ; les textes et les enregistrements du manuel ne sont pas reproduits.</p>`
  };
}
A.setCourse = d => { S.course = d.c; save(); cur().course = d.c; render(); };

function lessonQueueLen(l) { return lessonQueue(l, "normal").length; }

/* ── Flashcards ─────────────────────────────────────────────────── */
V.cards = c => {
  const l = LESSON[c.id]; const cs = lessonCards(l); const i = clamp(c.i || 0, 0, cs.length - 1); const k = cs[i];
  return {
    title: "Cartes", sub: l.t,
    html: `<div class="row between" style="margin-top:6px"><span class="muted small">${i + 1} / ${cs.length} · touchez la carte pour la retourner</span>${spkBtn(k.fr)}</div>
    <div class="fc-wrap"><div class="fc" id="fc" data-a="flip"><div class="face"><div class="w">${esc(k.fr)}</div>${k.exfr ? `<div class="exs muted">${esc(k.exfr)}</div>` : ""}</div>
      <div class="face back"><div class="g">${esc(k.en)}</div>${k.exen ? `<div class="exs"><span class="en">${esc(k.exen)}</span></div>` : ""}</div></div></div>
    <div class="grid2"><button class="btn" data-a="fcMove" data-d="-1" ${i === 0 ? "disabled" : ""}>‹ Précédente</button><button class="btn primary" data-a="fcMove" data-d="1">${i === cs.length - 1 ? "Terminer" : "Suivante ›"}</button></div>
    ${k.exfr ? `<button class="btn ghost block" data-a="say" data-t="${esc(k.exfr)}" style="margin-top:10px">▶ Écouter l'exemple</button>` : ""}`,
    after: () => setTimeout(() => say(k.fr), 200)
  };
};
A.flip = () => $("#fc").classList.toggle("flip");
A.fcMove = d => { const c = cur(); const l = LESSON[c.id]; const n = (c.i || 0) + +d.d; if (n >= l.cards.length) { back(); return; } c.i = Math.max(0, n); render(); };

/* ── Me ──────────────────────────────────────────────────────────── */
V.me = () => {
  const cards = Object.values(S.cards);
  const heat = []; for (let i = 83; i >= 0; i--) { const n = S.days[dayKey(new Date(Date.now() - i * DAY))] || 0; heat.push(`<i class="${n >= 60 ? "l3" : n >= 25 ? "l2" : n ? "l1" : ""}" title="${n}"></i>`); }
  const since = Date.now() - 7 * DAY; const ms = S.mistakes.filter(m => m.t >= since);
  const byCat = {}; ms.forEach(m => { byCat[m.cat] = (byCat[m.cat] || 0) + 1; });
  const cats = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  const byL = {}; ms.forEach(m => { if (m.lid) byL[m.lid] = (byL[m.lid] || 0) + 1; });
  const worstL = Object.entries(byL).sort((a, b) => b[1] - a[1]).slice(0, 3).filter(x => LESSON[x[0]]);
  const prog = (cls, title, list, extra) => { const d = list.filter(l => lessonState(l.id).done); const st = d.reduce((a, l) => a + (lessonState(l.id).stars || 0), 0);
    return `<div class="lrow lv-${cls}" style="display:block"><div class="row between"><b>${esc(title)}</b><span class="badge lv">${d.length}/${list.length}</span></div><div class="progress" style="margin:10px 0 6px"><i style="width:${Math.round(100 * d.length / (list.length || 1))}%"></i></div><div class="muted small">${st}/${list.length * 3} étoiles${extra || ""}</div></div>`; };
  return {
    title: "Moi", sub: (S.set.name || "") + " · " + S.level,
    html: `${sec("Progression")}
    <div class="group">${LV.map(lv => prog(lv, LEVELS[lv].name, lvlLessons(lv), ` · ${Object.keys(S.exam).filter(k => k.startsWith(lv)).length} épreuves blanches`)).join("")}
      ${COURSES.map(C => prog(C.id, C.t, LESSONS.filter(l => l.course === C.id))).join("")}</div>
    <div class="stats"><div><span class="e">🃏</span><div><b>${cards.length}</b><span>cartes</span></div></div><div><span class="e">🧠</span><div><b>${cards.filter(c => c.b >= 3).length}</b><span>maîtrisées</span></div></div><div><span class="e">🔥</span><div><b>${streak()}</b><span>jours de suite</span></div></div></div>
    ${sec("Douze semaines", "Activité")}<div class="card"><div class="heat">${heat.join("")}</div></div>
    ${sec("Mes erreurs", "7 derniers jours")}
    <div class="card">${cats.length ? cats.map(([k, n]) => `<div class="row between" style="padding:7px 0;border-top:1px solid var(--line)"><span>${esc(CAT_LABEL[k] || k)}</span><b>${n}</b></div>`).join("") : `<span class="muted">Aucune erreur cette semaine.</span>`}
      <div class="row" style="margin-top:12px"><button class="btn sm primary" data-a="reviewMistakes">Refaire mes erreurs</button><button class="btn sm" data-a="go" data-v="notebook">Carnet</button></div></div>
    ${worstL.length ? group(worstL.map(([id, n]) => row("go", "↻", esc(LESSON[id].t), `${plural(n, "erreur", "erreurs")} cette semaine`, LESSON[id].lvl, `data-v="lesson" data-id="${id}"`, "t-gold"))) : ""}
    ${sec("Je sais…", "Ce que je sais faire")}
    ${LV.map(lv => `<div class="card"><div class="row between"><b>${lv}</b><span class="muted small">${CANDO.filter(x => x.lvl === lv && canDo(x)).length}/${CANDO.filter(x => x.lvl === lv).length}</span></div>${CANDO.filter(x => x.lvl === lv).map(x => { const i = CANDO.indexOf(x); const ok = canDo(x); return `<label class="chk"><input type="checkbox" data-a="cando" data-i="${i}" ${ok ? "checked" : ""}><span>${esc(x.t)}${x.lessons ? `<span class="muted tiny"> · ${x.lessons.filter(id => lessonState(id).done).length}/${x.lessons.length} leçons</span>` : ""}</span></label>`; }).join("")}</div>`).join("")}
    ${sec("Pour le prof", "Bilan")}
    ${group([row("report", "📋", "Copier le bilan de la semaine", "Un court résumé à coller dans un message", "", "", "t-blue"), row("go", "⚙️", "Réglages", "Voix, thème, date d'examen, progression", "", `data-v="settings"`, "")])}`
  };
};
const CAT_LABEL = { temps: "Temps et modes", subjonctif: "Subjonctif", pronoms: "Pronoms", accords: "Accords", connecteurs: "Connecteurs", registre: "Registre", lexique: "Vocabulaire", syntaxe: "Ordre des mots", "écoute": "Compréhension", orthographe: "Orthographe", oral: "Oral", interaction: "Interaction", accents: "Accents", relatifs: "Pronoms relatifs", hypothese: "Hypothèse", negation: "Négation", argumentation: "Argumentation", discours: "Discours rapporté", conjugaison: "Conjugaison", nombres: "Nombres", lecture: "Lecture", pro: "Français professionnel", "écrit": "Production écrite", autre: "Autre" };
function canDo(x) { if (S.cando[CANDO.indexOf(x)] != null) return S.cando[CANDO.indexOf(x)]; return x.lessons ? x.lessons.every(id => lessonState(id).done) : false; }
A.cando = (d, el) => { S.cando[d.i] = el.checked; save(); };
A.report = () => {
  const since = Date.now() - 7 * DAY; let ans = 0; for (let i = 0; i < 7; i++) ans += S.days[dayKey(new Date(Date.now() - i * DAY))] || 0;
  const done = LESSONS.filter(l => (lessonState(l.id).last || 0) >= since);
  const ms = S.mistakes.filter(m => m.t >= since && !m.soft); const by = {}; ms.forEach(m => by[m.cat] = (by[m.cat] || 0) + 1);
  const txt = `Pas à pas — bilan de la semaine (${dayKey()})\nApprenante : ${S.set.name || "-"} · niveau actuel : ${S.level}\nRéponses cette semaine : ${ans} · série : ${streak()} jours\nLeçons travaillées : ${done.map(l => (l.course ? l.src : l.lvl + " " + l.t)).join("; ") || "aucune"}\nPrincipaux types d'erreurs : ${Object.entries(by).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, n]) => (CAT_LABEL[k] || k) + " (" + n + ")").join(", ") || "aucun"}\nErreurs récentes :\n${ms.slice(0, 6).map(m => "- " + (m.q.model || m.q.hear || "") + (m.given ? "  [réponse : " + m.given + "]" : "")).join("\n")}`;
  (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => toast("Bilan copié"), () => openSheet(`<textarea class="inp" rows="14">${esc(txt)}</textarea>`));
};
V.notebook = () => {
  const ms = S.mistakes.slice(0, 60);
  return {
    title: "Carnet", sub: plural(S.mistakes.length, "erreur", "erreurs"),
    html: `<button class="btn primary block" data-a="reviewMistakes" style="margin:10px 0">En refaire jusqu'à douze</button>
    ${ms.map(m => `<div class="card"><div class="row between"><span class="badge lv lv-EX">${esc(CAT_LABEL[m.cat] || m.cat)}</span><span class="muted tiny">${new Date(m.t).toLocaleDateString("fr-FR")}</span></div>
      <div style="margin-top:8px;font-weight:600">${esc(m.q.model || (m.q.opts ? m.q.opts[m.q.a] : "") || m.q.hear || "")}</div>${m.given ? `<div class="muted small">Votre réponse : ${esc(m.given)}</div>` : ""}${m.q.why ? `<div class="small muted" style="margin-top:4px">${m.q.why}</div>` : ""}</div>`).join("") || `<p class="muted">Rien pour l'instant.</p>`}`
  };
};

/* ── Settings ────────────────────────────────────────────────────── */
V.settings = () => {
  WS.load();
  const nat = S.set.voiceMode !== "device";
  return {
    title: "Réglages", sub: "Pas à pas " + APP_VERSION,
    html: `${sec("Voix", "Audio")}
    <div class="card"><div class="seg" style="margin-top:0"><button aria-pressed="${nat}" data-a="setVoiceMode" data-m="natural">Voix naturelle</button><button aria-pressed="${!nat}" data-a="setVoiceMode" data-m="device">Voix de l'iPhone</button></div>
      <p class="small muted" style="margin:4px 0 10px">${nat ? "Toutes les phrases de l'application sont enregistrées avec une voix française naturelle. Ce qui change à chaque fois, comme la conjugaison et les nombres, est lu par la voix du téléphone." : "La voix française du téléphone lit tout. Sur iPhone, téléchargez une voix « améliorée » pour une meilleure qualité (voir plus bas)."}</p>
      <label class="small muted">Vitesse · <span id="rateV">${S.set.rate}</span></label><input type="range" min="0.6" max="1.2" step="0.05" value="${S.set.rate}" data-c="setRate" style="width:100%">
      <div class="row" style="margin-top:8px"><button class="btn sm primary" data-a="say" data-t="Bonjour Lan Anh ! On révise un peu de français aujourd'hui ?">▶ Test</button><button class="btn sm" data-a="dlAudio">⬇︎ Garder tout l'audio hors ligne</button></div>
      <div class="small muted" id="dlInfo" style="margin-top:6px"></div></div>
    <div class="card"><b>Voix de secours</b><p class="small muted" style="margin:4px 0 8px">Utilisée pour tout ce qui n'est pas enregistré.</p>
      <select class="inp" data-c="setVoice"><option value="">Meilleure voix disponible</option>${WS.fr.map(v => `<option value="${esc(v.voiceURI)}" ${S.set.voice === v.voiceURI ? "selected" : ""}>${esc(v.name)} · ${esc(v.lang)}</option>`).join("")}</select>
      <details class="more"><summary>Une meilleure voix sur iPhone</summary><div class="small" style="margin-top:8px">Réglages → Accessibilité → Contenu énoncé → Voix → Français (France) → téléchargez <b>Audrey (améliorée)</b> ou <b>Thomas (amélioré)</b>. Rouvrez ensuite Pas à pas et choisissez-la ici.</div></details></div>
    ${sec("Apparence")}
    <div class="card"><label class="small muted">Prénom</label><input class="inp" value="${esc(S.set.name)}" data-c="setName" style="margin:4px 0 12px">
      <div class="seg" style="margin:0">${[["auto", "Auto"], ["light", "Clair"], ["dark", "Sombre"]].map(([k, t]) => `<button aria-pressed="${S.set.theme === k}" data-a="setTheme" data-k="${k}">${t}</button>`).join("")}</div>
      <label class="chk" style="margin-top:8px"><input type="checkbox" data-c="setSound" ${S.set.sound ? "checked" : ""}><span>Sons pour les bonnes et mauvaises réponses</span></label><label class="chk"><input type="checkbox" data-c="setVibe" ${S.set.vibe ? "checked" : ""}><span>Vibration</span></label></div>
    ${sec("Examen")}
    <div class="card"><p class="small muted" style="margin:0 0 8px">Affiche un compte à rebours sur l'écran Aujourd'hui.</p>
      <div class="grid2"><select class="inp" data-c="setExamLevel">${LV.map(l => `<option value="${l}" ${S.set.examLevel === l ? "selected" : ""}>${esc(EXAMS[l].name)}</option>`).join("")}</select><input class="inp" type="date" value="${esc(S.set.examDate)}" data-c="setExamDate"></div></div>
    ${sec("Progression")}
    <div class="card"><p class="small muted" style="margin:0 0 10px">La progression est enregistrée sur ce téléphone. Exportez-la pour la transférer sur un autre appareil.</p>
      <div class="row"><button class="btn sm" data-a="exportP">Exporter</button><label class="btn sm ghost">Importer un fichier<input type="file" accept="application/json" data-c="importP" class="hide"></label><button class="btn sm ghost" data-a="pasteImp">Coller</button><button class="btn sm ghost" data-a="resetP" style="color:var(--bad)">Réinitialiser</button></div></div>
    ${sec("Installer sur l'iPhone")}
    <div class="card">${["Ouvrez cette page dans <b>Safari</b> (et non dans une autre application).", "Touchez le bouton <b>Partager</b>, puis <b>Sur l'écran d'accueil</b>.", "Nommez-la <b>Pas à pas</b> et touchez <b>Ajouter</b> : elle s'ouvre en plein écran, comme une application.", "Revenez ici et touchez <b>Garder tout l'audio hors ligne</b> en Wi-Fi."].map((t, i) => `<div class="step"><div class="n">${i + 1}</div><div class="small">${t}</div></div>`).join("")}</div>
    <p class="muted tiny">Formats d'examen : France Éducation international. Leçons de cours d'après la progression de Cosmopolite 3 et d'Objectif Express 2 (Hachette FLE). Voix : Kokoro (ff_siwis) et Piper UPMC (Pierre).</p>`
  };
};
A.setTheme = d => { S.set.theme = d.k; save(); applyTheme(); render(); };
A.setVoiceMode = d => { S.set.voiceMode = d.m; save(); render(); say("Voilà ma voix."); };
A.dlAudio = async () => {
  await AUD.init(); const ps = AUD.idx.packs; if (!ps.length) { toast("Aucun enregistrement trouvé"); return; }
  const info = $("#dlInfo"); let n = 0;
  let bad = 0;
  for (const p of ps) { try { const r = await fetch(AUD.src(p)); if (!r.ok) throw 0; await r.blob(); } catch (e) { bad++; } n++; if (info) info.textContent = `Téléchargement de l'audio… ${n}/${ps.length}`; }
  if (bad) { if (info) info.textContent = `${bad} paquets n'ont pas pu être téléchargés. Réessayez en Wi-Fi.`; return; }
  if (info) info.textContent = "Tout l'audio est enregistré sur ce téléphone ✓"; toast("Audio disponible hors ligne");
};
const CHANGE = {
  setName: el => { S.set.name = el.value.trim(); save(); },
  setVoice: el => { S.set.voice = el.value; save(); WS.speak("Voilà ma voix.", {}); },
  setRate: el => { S.set.rate = +el.value; $("#rateV").textContent = el.value; save(); },
  setSound: el => { S.set.sound = el.checked; save(); hdrIcons(); },
  setVibe: el => { S.set.vibe = el.checked; save(); },
  setExamLevel: el => { S.set.examLevel = el.value; save(); },
  setExamDate: el => { S.set.examDate = el.value; save(); },
  importP: el => { const f = el.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { try { const o = JSON.parse(r.result); if (!o || !o.lessons) throw 0; S = Object.assign(DEFAULT(), o); saveNow(); toast("Progression importée"); render(); } catch (e) { toast("Ce fichier n'est pas une sauvegarde Pas à pas"); } }; r.readAsText(f); }
};
A.exportP = () => {
  const txt = JSON.stringify(S);
  try { const b = new Blob([txt], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "pas-a-pas-progress-" + dayKey() + ".json"; a.click(); } catch (e) { }
  openSheet(`<b>Votre progression</b><p class="small muted">Si aucun fichier n'a été téléchargé, copiez ce texte et gardez-le dans une note. Pour le restaurer, utilisez « Coller » sur l'autre appareil.</p><textarea class="inp" id="expTxt" rows="8">${esc(txt)}</textarea><div class="row" style="margin-top:10px"><button class="btn sm primary" data-a="copyExp">Copier</button></div>`);
};
A.copyExp = () => { const t = $("#expTxt"); (navigator.clipboard ? navigator.clipboard.writeText(t.value) : Promise.reject()).then(() => toast("Copié"), () => { t.select(); toast("Sélectionnez tout et copiez"); }); };
A.pasteImp = () => openSheet(`<b>Restaurer la progression</b><p class="small muted">Collez le texte exporté, puis touchez « Restaurer ».</p><textarea class="inp" id="impTxt" rows="8"></textarea><div class="row" style="margin-top:10px"><button class="btn sm primary" data-a="doImp">Restaurer</button></div>`);
A.doImp = () => { try { const o = JSON.parse($("#impTxt").value); if (!o || !o.lessons) throw 0; S = Object.assign(DEFAULT(), o); saveNow(); closeSheet(); toast("Progression importée"); render(); } catch (e) { toast("Ce n'est pas une sauvegarde Pas à pas"); } };
A.resetP = () => openSheet(`<b>Effacer toute la progression sur cet appareil ?</b><p class="small muted">Les leçons, les cartes, les erreurs et les brouillons seront supprimés. Cette action est irréversible.</p><div class="row"><button class="btn sm" data-a="closeSheet">Annuler</button><button class="btn sm" style="color:var(--bad)" data-a="doReset">Tout effacer</button></div>`);
A.doReset = () => { try { localStorage.removeItem(KEY); } catch (e) { } load(); closeSheet(); render(); toast("Progression effacée"); };
function hdrIcons() { const b = $("#sndBtn"); if (b) { b.innerHTML = S.set.sound ? IC.spk : IC.mute; b.classList.toggle("off", !S.set.sound); } const g = $("#setBtn"); if (g) g.innerHTML = IC.gear; }
