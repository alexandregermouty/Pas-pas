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
    hero = { t: "On y va ?", p: `About 15 minutes: one review, one new lesson, one practice.`, btn: `<button class="cta" data-a="go" data-v="lesson" data-id="${nx.id}">Nouvelle leçon ${IC.arrow}</button>` };
  } else {
    const nlv = LV[LV.indexOf(lv) + 1];
    hero = { t: nlv ? `Bravo, ${lv} terminé !` : "Tout est fait !", p: nlv ? `Move up to ${nlv}, or test yourself with a mock exam.` : "Keep the reviews going and train for the DALF C1.", btn: nlv ? `<button class="cta" data-a="setLevelGo" data-lv="${nlv}">Passer au ${nlv} ${IC.arrow}</button>` : `<button class="cta" data-a="tab" data-tab="exam">Examen blanc ${IC.arrow}</button>` };
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
      ${planRow("rev", 1, "🗂️", "t-gold", "Réviser", dueC ? plural(dueC, "card", "cards") + " due" + (dueL ? " · " + plural(dueL, "lesson", "lessons") : "") : dueL ? plural(dueL, "lesson", "lessons") + " to revisit" : "Nothing due · redo your mistakes", dueC ? "reviewCards" : dueL ? "reviewLessons" : "reviewMistakes")}
      ${planRow("les", 2, "📘", "t-blue", nx ? "Nouvelle leçon · " + esc(nx.t) : "Level " + lv + " complete", nx ? esc(nx.en) : "Choose the next level in Learn", nx ? "go" : "tab", nx ? `data-v="lesson" data-id="${nx.id}"` : `data-tab="learn"`)}
      ${planRow("prac", 3, sug.ic, "t-red", "Pratique · " + esc(sug.t), esc(sug.s), sug.a, sug.data)}
    </div>
    <div class="stats"><div><span class="e">🔥</span><div><b>${streak()}</b><span>day streak</span></div></div><div><span class="e">🃏</span><div><b>${known}</b><span>cards known</span></div></div><div><span class="e">⭐</span><div><b>${done}</b><span>lessons done</span></div></div></div>
    ${resumeIds.length > 1 ? sec("En cours", "Unfinished") + group(resumeIds.slice(1).map(id => row("startLesson", "▶️", esc(LESSON[id].t), `Question ${S.resume[id].i + 1}/${S.resume[id].qs.length}`, LESSON[id].lvl, `data-id="${id}" data-resume="1"`, "t-gold"))) : ""}
    ${courseRows.length ? sec("Mes cours", "Your class books") + group(courseRows) : ""}
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
  return group([row("tab", "🎯", `${esc(nm)} dans ${d} jour${d > 1 ? "s" : ""}`, `${new Date(S.set.examDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} · open the mock tasks`, "", `data-tab="exam"`, "t-red")]);
}
function suggestion() {
  const list = [
    { ic: "🎧", t: "Écoute", s: "A recording at your level, with questions", a: "go", data: 'data-v="listenList"' },
    { ic: "🔁", t: "Conjugaison", s: "Ten verbs in the tenses of your level", a: "conjStart" },
    { ic: "✍️", t: "Dictée", s: "Six sentences, accents included", a: "dictStart" },
    { ic: "📖", t: "Lecture", s: "A text at your level, with questions", a: "go", data: 'data-v="readList"' },
    { ic: "🎙️", t: "Parler une minute", s: "A topic, a timer and your recording", a: "go", data: 'data-v="speakList"' },
    { ic: "🔗", t: "Connecteurs", s: "The words that structure an argument", a: "connStart" },
    { ic: "🔢", t: "Nombres", s: "Prices, times, phone numbers", a: "numStart" },
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
    title: "Apprendre", sub: `${meta.name} · ${done}/${L.length} lessons`,
    html: `${seg}<div class="chips">${LV.map(x => `<button class="chip" aria-pressed="${x === lv}" data-a="setLevel" data-lv="${x}">${x} · ${LEVELS[x].name.split("· ")[1]}</button>`).join("")}</div>
    <div class="lvcard lv-${lv}">${ringSvg(pct, "var(--lv)")}<div class="big">${lv}</div><div style="font-weight:700;margin-top:6px">${esc(meta.name.split("· ")[1])}</div><div class="muted small" style="max-width:70%">${esc(meta.desc)}</div>
      <div class="row" style="margin-top:14px">${nx ? `<button class="btn sm primary" data-a="go" data-v="lesson" data-id="${nx.id}">Next: ${esc(nx.t)}</button>` : ""}${dueL ? `<button class="btn sm" data-a="reviewLessons">↻ ${plural(dueL, "review", "reviews")}</button>` : ""}<button class="btn sm ghost" data-a="go" data-v="exam" data-lv="${lv}">${esc(EXAMS[lv].name)}</button></div></div>
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
    return `<button class="node ${cls}" data-a="go" data-v="lesson" data-id="${l.id}"><div class="num">${s.done ? "✓" : (l.num || items.indexOf(l) + 1)}</div><div class="tx"><b>${esc(l.t)}</b><span>${esc(l.en)}</span></div>${r ? `<span class="resume-chip">▶ ${r.i + 1}/${r.qs.length}</span>` : s.done ? stars(s.stars) : ""}</button>`;
  }).join("")}</div>`;
}
function courseNext(c) { const ls = LESSONS.filter(l => l.course === c.id); const l = ls.find(x => S.resume[x.id]) || ls.find(x => !lessonState(x.id).done); if (!l) return null; const u = c.units.find(u => u.id === l.unit); return Object.assign({ unitT: u ? u.short : "" }, l); }
function learnCourses(c, seg) {
  const cid = c.course || S.course || COURSES[0].id; const C = COURSES.find(x => x.id === cid);
  const ls = LESSONS.filter(l => l.course === cid); const done = ls.filter(l => lessonState(l.id).done).length;
  const nx = courseNext(C);
  return {
    title: "Apprendre", sub: `${C.t} · ${done}/${ls.length} lessons`,
    html: `${seg}<div class="chips">${COURSES.map(x => `<button class="chip" aria-pressed="${x.id === cid}" data-a="setCourse" data-c="${x.id}">${x.ic} ${esc(x.t)}</button>`).join("")}</div>
    <div class="lvcard lv-${cid}">${ringSvg(Math.round(100 * done / ls.length), "var(--lv)")}<div style="font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--lv)">${esc(C.pub)}</div><div style="font-family:var(--disp);font-size:26px;font-weight:600;line-height:1.15;margin-top:4px;max-width:75%">${esc(C.t)}</div><div class="muted small" style="max-width:75%;margin-top:4px">${esc(C.desc)}</div>
      ${nx ? `<div class="row" style="margin-top:14px"><button class="btn sm primary" data-a="go" data-v="lesson" data-id="${nx.id}">Continue: ${esc(nx.t)}</button></div>` : ""}</div>
    ${C.units.map(u => pathHtml(ls.filter(l => l.unit === u.id), cid, u.t, u.en, nx)).join("")}
    <p class="muted tiny" style="margin-top:18px">Follows the structure of ${esc(C.t)} (${esc(C.pub)}). Exercises and sentences are written for this app; the book's own texts and audio are not reproduced.</p>`
  };
}
A.setCourse = d => { S.course = d.c; save(); cur().course = d.c; render(); };

/* ── Lesson page ─────────────────────────────────────────────────── */
V.lesson = c => {
  const l = LESSON[c.id]; if (!l) return { html: "Lesson not found" };
  const s = lessonState(l.id), r = S.resume[l.id], R = l.rule || {};
  const C = l.course && COURSES.find(x => x.id === l.course);
  const lvc = C ? l.course : l.lvl;
  const reads = READINGS.filter(x => (x.lessons || []).includes(l.id));
  const exBtn = e => `<button class="ex" data-a="say" data-t="${esc(e[0])}"><span class="spk">${IC.spk}</span><span><span class="fr">${esc(e[0])}</span><span class="en">${esc(e[1])}</span></span></button>`;
  const links = (l.links || []).filter(id => LESSON[id]);
  return {
    title: C ? C.short : l.lvl, sub: C ? (C.units.find(u => u.id === l.unit) || {}).t : trackOf(l).t,
    html: `<div class="lhead lv-${lvc}"><div class="k">${C ? esc(l.src) : l.lvl + " · " + esc(trackOf(l).t)}</div><h3>${esc(l.t)}</h3><p>${esc(l.en)}</p>${s.done ? `<div style="margin-top:8px">${stars(s.stars)} <span class="small" style="opacity:.85">best ${s.best}%</span></div>` : ""}</div>
    ${r ? `<div class="card" style="border-color:rgba(var(--gold-rgb),.5)"><b>You are part-way through this lesson</b><div class="muted small">Question ${r.i + 1} of ${r.qs.length}</div><div class="row" style="margin-top:12px"><button class="btn primary" data-a="startLesson" data-id="${l.id}" data-resume="1">Continuer ▶</button><button class="btn ghost" data-a="startLesson" data-id="${l.id}">Start again</button></div></div>` : ""}
    ${!r ? `<button class="btn primary block" data-a="startLesson" data-id="${l.id}" style="margin:4px 0 10px">${s.done ? "Practise again" : "Start the lesson"} · ${lessonQueueLen(l)} questions</button>` : ""}
    <div class="grid2"><button class="btn" data-a="go" data-v="cards" data-id="${l.id}">🃏 Cards · ${(l.cards || []).length}</button>
      ${s.done ? `<button class="btn" data-a="startLesson" data-id="${l.id}" data-mode="challenge">⚡ Challenge</button>` : `<button class="btn" data-a="startLesson" data-id="${l.id}" data-mode="quick">✓ Quick check</button>`}</div>
    ${l.task ? `<div class="card"><div class="qk" style="color:var(--lv);--lv:var(--${l.course === "oe2" ? "oe" : "cosmo"})">${C && l.course === "oe2" ? "Tâche visée" : "Tâche finale"}</div><div style="font-weight:600;font-size:16.5px">${esc(l.task)}</div>
      ${l.sf ? `<div class="muted small" style="margin-top:10px">You learn to</div><ul class="pts small" style="margin-top:4px">${l.sf.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
      ${l.gram ? `<div class="muted small" style="margin-top:8px">Grammar in the book</div><div class="kv">${l.gram.map(g => `<span class="chip">${esc(g)}</span>`).join("")}</div>` : ""}</div>` : ""}
    ${R.h ? `<div class="card"><div class="rule-h">${esc(R.h)}</div>
      ${R.pts ? `<ul class="pts">${R.pts.map(p => `<li>${p}</li>`).join("")}</ul>` : ""}
      ${(R.ex || []).length ? `<div style="margin-top:12px">${R.ex.map(exBtn).join("")}</div>` : ""}
      ${R.warn ? `<div class="callout warn"><span class="k">Attention</span>${R.warn}</div>` : ""}
      ${R.vn ? `<div class="callout vn"><span class="k">Cho người Việt</span><span class="vn">${R.vn}</span></div>` : ""}</div>` : ""}
    ${l.sons ? `<div class="card"><div class="qk" style="color:var(--blue)">Sons et intonation</div><div style="font-weight:600">${esc(l.sons.t)}</div><div class="small muted" style="margin:4px 0 8px">${l.sons.tip}</div>${l.sons.ex.map(e => exBtn([e, ""])).join("")}</div>` : ""}
    ${l.repere ? `<div class="callout info"><span class="k">Repère professionnel</span>${l.repere}</div>` : ""}
    ${links.length ? sec("Grammar lessons", "Go deeper") + group(links.map(id => row("go", "📘", esc(LESSON[id].t), LESSON[id].lvl + " · " + esc(LESSON[id].en), lessonState(id).done ? "✓" : "", `data-v="lesson" data-id="${id}"`, "t-blue"))) : ""}
    ${sec(C ? "Phrases utiles" : "Sentences to hear", "Tap to listen")}
    <div class="card" style="padding:6px 16px">${(l.sent || []).slice(0, 8).map(exBtn).join("")}
      ${(l.sent || []).length > 8 ? `<details class="more" style="padding-bottom:10px"><summary>${l.sent.length - 8} more</summary>${l.sent.slice(8).map(exBtn).join("")}</details>` : ""}</div>
    ${reads.length ? sec("Read it in context") + group(reads.map(x => row("go", "📖", esc(x.t), `${x.lvl} · ${x.kind || "text"}`, "", `data-v="read" data-id="${x.id}"`, "t-green"))) : ""}`,
    after: () => AUD.prefetch("L-" + l.id)
  };
};
function lessonQueueLen(l) { return lessonQueue(l, "normal").length; }

/* ── Flashcards ─────────────────────────────────────────────────── */
V.cards = c => {
  const l = LESSON[c.id]; const cs = lessonCards(l); const i = clamp(c.i || 0, 0, cs.length - 1); const k = cs[i];
  return {
    title: "Cartes", sub: l.t,
    html: `<div class="row between" style="margin-top:6px"><span class="muted small">${i + 1} / ${cs.length} · tap the card to flip</span>${spkBtn(k.fr)}</div>
    <div class="fc-wrap"><div class="fc" id="fc" data-a="flip"><div class="face"><div class="w">${esc(k.fr)}</div>${k.exfr ? `<div class="exs muted">${esc(k.exfr)}</div>` : ""}</div>
      <div class="face back"><div class="g">${esc(k.en)}</div>${k.exen ? `<div class="exs"><span class="en">${esc(k.exen)}</span></div>` : ""}</div></div></div>
    <div class="grid2"><button class="btn" data-a="fcMove" data-d="-1" ${i === 0 ? "disabled" : ""}>‹ Previous</button><button class="btn primary" data-a="fcMove" data-d="1">${i === cs.length - 1 ? "Finish" : "Next ›"}</button></div>
    ${k.exfr ? `<button class="btn ghost block" data-a="say" data-t="${esc(k.exfr)}" style="margin-top:10px">▶ Hear the example</button>` : ""}`,
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
    return `<div class="lrow lv-${cls}" style="display:block"><div class="row between"><b>${esc(title)}</b><span class="badge lv">${d.length}/${list.length}</span></div><div class="progress" style="margin:10px 0 6px"><i style="width:${Math.round(100 * d.length / (list.length || 1))}%"></i></div><div class="muted small">${st}/${list.length * 3} stars${extra || ""}</div></div>`; };
  return {
    title: "Moi", sub: (S.set.name || "") + " · " + S.level,
    html: `${sec("Progression")}
    <div class="group">${LV.map(lv => prog(lv, LEVELS[lv].name, lvlLessons(lv), ` · ${Object.keys(S.exam).filter(k => k.startsWith(lv)).length} mock tasks`)).join("")}
      ${COURSES.map(C => prog(C.id, C.t, LESSONS.filter(l => l.course === C.id))).join("")}</div>
    <div class="stats"><div><span class="e">🃏</span><div><b>${cards.length}</b><span>cards</span></div></div><div><span class="e">🧠</span><div><b>${cards.filter(c => c.b >= 3).length}</b><span>known</span></div></div><div><span class="e">🔥</span><div><b>${streak()}</b><span>day streak</span></div></div></div>
    ${sec("Douze semaines", "Activity")}<div class="card"><div class="heat">${heat.join("")}</div></div>
    ${sec("Mes erreurs", "Last 7 days")}
    <div class="card">${cats.length ? cats.map(([k, n]) => `<div class="row between" style="padding:7px 0;border-top:1px solid var(--line)"><span>${esc(CAT_LABEL[k] || k)}</span><b>${n}</b></div>`).join("") : `<span class="muted">No mistakes logged this week.</span>`}
      <div class="row" style="margin-top:12px"><button class="btn sm primary" data-a="reviewMistakes">Redo my mistakes</button><button class="btn sm" data-a="go" data-v="notebook">Notebook</button></div></div>
    ${worstL.length ? group(worstL.map(([id, n]) => row("go", "↻", esc(LESSON[id].t), `${plural(n, "mistake", "mistakes")} this week`, LESSON[id].lvl, `data-v="lesson" data-id="${id}"`, "t-gold"))) : ""}
    ${sec("Je sais…", "Can-do statements")}
    ${LV.map(lv => `<div class="card"><div class="row between"><b>${lv}</b><span class="muted small">${CANDO.filter(x => x.lvl === lv && canDo(x)).length}/${CANDO.filter(x => x.lvl === lv).length}</span></div>${CANDO.filter(x => x.lvl === lv).map(x => { const i = CANDO.indexOf(x); const ok = canDo(x); return `<label class="chk"><input type="checkbox" data-a="cando" data-i="${i}" ${ok ? "checked" : ""}><span>${esc(x.t)}${x.lessons ? `<span class="muted tiny"> · ${x.lessons.filter(id => lessonState(id).done).length}/${x.lessons.length} lessons</span>` : ""}</span></label>`; }).join("")}</div>`).join("")}
    ${sec("Pour le prof", "Report")}
    ${group([row("report", "📋", "Copy this week's report", "A short summary to paste in a message", "", "", "t-blue"), row("go", "⚙️", "Settings", "Voice, theme, exam date, progress", "", `data-v="settings"`, "")])}`
  };
};
const CAT_LABEL = { temps: "Tenses and moods", subjonctif: "Subjunctive", pronoms: "Pronouns", accords: "Agreement", connecteurs: "Connectors", registre: "Register", lexique: "Vocabulary", syntaxe: "Word order", "écoute": "Listening", orthographe: "Spelling", oral: "Speaking", interaction: "Interaction", accents: "Accents", relatifs: "Relative pronouns", hypothese: "Hypothesis", negation: "Negation", argumentation: "Argument", discours: "Reported speech", conjugaison: "Conjugation", nombres: "Numbers", lecture: "Reading", pro: "Professional French", autre: "Other" };
function canDo(x) { if (S.cando[CANDO.indexOf(x)] != null) return S.cando[CANDO.indexOf(x)]; return x.lessons ? x.lessons.every(id => lessonState(id).done) : false; }
A.cando = (d, el) => { S.cando[d.i] = el.checked; save(); };
A.report = () => {
  const since = Date.now() - 7 * DAY; let ans = 0; for (let i = 0; i < 7; i++) ans += S.days[dayKey(new Date(Date.now() - i * DAY))] || 0;
  const done = LESSONS.filter(l => (lessonState(l.id).last || 0) >= since);
  const ms = S.mistakes.filter(m => m.t >= since && !m.soft); const by = {}; ms.forEach(m => by[m.cat] = (by[m.cat] || 0) + 1);
  const txt = `Pas à pas — weekly report (${dayKey()})\nLearner: ${S.set.name || "-"} · current level: ${S.level}\nAnswers this week: ${ans} · streak: ${streak()} days\nLessons practised: ${done.map(l => (l.course ? l.src : l.lvl + " " + l.t)).join("; ") || "none"}\nMain error types: ${Object.entries(by).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, n]) => (CAT_LABEL[k] || k) + " (" + n + ")").join(", ") || "none"}\nRecent mistakes:\n${ms.slice(0, 6).map(m => "- " + (m.q.model || m.q.hear || "") + (m.given ? "  [wrote: " + m.given + "]" : "")).join("\n")}`;
  (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => toast("Report copied"), () => openSheet(`<textarea class="inp" rows="14">${esc(txt)}</textarea>`));
};
V.notebook = () => {
  const ms = S.mistakes.slice(0, 60);
  return {
    title: "Carnet", sub: plural(S.mistakes.length, "mistake", "mistakes"),
    html: `<button class="btn primary block" data-a="reviewMistakes" style="margin:10px 0">Redo up to twelve of them</button>
    ${ms.map(m => `<div class="card"><div class="row between"><span class="badge lv lv-EX">${esc(CAT_LABEL[m.cat] || m.cat)}</span><span class="muted tiny">${new Date(m.t).toLocaleDateString("fr-FR")}</span></div>
      <div style="margin-top:8px;font-weight:600">${esc(m.q.model || (m.q.opts ? m.q.opts[m.q.a] : "") || m.q.hear || "")}</div>${m.given ? `<div class="muted small">You: ${esc(m.given)}</div>` : ""}${m.q.why ? `<div class="small muted" style="margin-top:4px">${m.q.why}</div>` : ""}</div>`).join("") || `<p class="muted">Nothing yet.</p>`}`
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
      <p class="small muted" style="margin:4px 0 10px">${nat ? "Every sentence of the app is recorded with a neural French voice (Kokoro). Sentences that change each time, like conjugation drills and numbers, use the phone's own voice." : "The phone's own French voice reads everything. On iPhone, download an Enhanced voice for better quality (see below)."}</p>
      <label class="small muted">Speed · <span id="rateV">${S.set.rate}</span></label><input type="range" min="0.6" max="1.2" step="0.05" value="${S.set.rate}" data-c="setRate" style="width:100%">
      <div class="row" style="margin-top:8px"><button class="btn sm primary" data-a="say" data-t="Bonjour Lan Anh ! On révise un peu de français aujourd'hui ?">▶ Test</button><button class="btn sm" data-a="dlAudio">⬇︎ Keep all audio offline</button></div>
      <div class="small muted" id="dlInfo" style="margin-top:6px"></div></div>
    <div class="card"><b>Fallback voice</b><p class="small muted" style="margin:4px 0 8px">Used for anything not recorded.</p>
      <select class="inp" data-c="setVoice"><option value="">Best available</option>${WS.fr.map(v => `<option value="${esc(v.voiceURI)}" ${S.set.voice === v.voiceURI ? "selected" : ""}>${esc(v.name)} · ${esc(v.lang)}</option>`).join("")}</select>
      <details class="more"><summary>Better iPhone voice</summary><div class="small" style="margin-top:8px">Settings → Accessibility → Spoken Content → Voices → French (France) → download <b>Audrey (Enhanced)</b> or <b>Thomas (Enhanced)</b>. Then reopen Pas à pas and choose it here.</div></details></div>
    ${sec("Apparence")}
    <div class="card"><label class="small muted">Name</label><input class="inp" value="${esc(S.set.name)}" data-c="setName" style="margin:4px 0 12px">
      <div class="seg" style="margin:0">${[["auto", "Auto"], ["light", "Clair"], ["dark", "Sombre"]].map(([k, t]) => `<button aria-pressed="${S.set.theme === k}" data-a="setTheme" data-k="${k}">${t}</button>`).join("")}</div>
      <label class="chk" style="margin-top:8px"><input type="checkbox" data-c="setSound" ${S.set.sound ? "checked" : ""}><span>Sounds for right and wrong answers</span></label><label class="chk"><input type="checkbox" data-c="setVibe" ${S.set.vibe ? "checked" : ""}><span>Vibration</span></label></div>
    ${sec("Examen")}
    <div class="card"><p class="small muted" style="margin:0 0 8px">Shows a countdown on Today.</p>
      <div class="grid2"><select class="inp" data-c="setExamLevel">${LV.map(l => `<option value="${l}" ${S.set.examLevel === l ? "selected" : ""}>${esc(EXAMS[l].name)}</option>`).join("")}</select><input class="inp" type="date" value="${esc(S.set.examDate)}" data-c="setExamDate"></div></div>
    ${sec("Progression")}
    <div class="card"><p class="small muted" style="margin:0 0 10px">Progress is stored on this phone. Export it to move to another device.</p>
      <div class="row"><button class="btn sm" data-a="exportP">Export</button><label class="btn sm ghost">Import file<input type="file" accept="application/json" data-c="importP" class="hide"></label><button class="btn sm ghost" data-a="pasteImp">Paste</button><button class="btn sm ghost" data-a="resetP" style="color:var(--bad)">Reset</button></div></div>
    ${sec("Installer sur l'iPhone")}
    <div class="card">${["Open this page in <b>Safari</b> (not inside another app).", "Tap the <b>Share</b> button, then <b>Add to Home Screen</b>.", "Name it <b>Pas à pas</b> and tap <b>Add</b>: it opens full screen like an app.", "Come back here and tap <b>Keep all audio offline</b> while on Wi-Fi."].map((t, i) => `<div class="step"><div class="n">${i + 1}</div><div class="small">${t}</div></div>`).join("")}</div>
    <p class="muted tiny">Exam formats: France Éducation international. Course companions follow Cosmopolite 3 and Objectif Express 2 (Hachette FLE). Voices: Kokoro (ff_siwis) and Piper UPMC (Pierre).</p>`
  };
};
A.setTheme = d => { S.set.theme = d.k; save(); applyTheme(); render(); };
A.setVoiceMode = d => { S.set.voiceMode = d.m; save(); render(); say("Voilà ma voix."); };
A.dlAudio = async () => {
  await AUD.init(); const ps = AUD.idx.packs; if (!ps.length) { toast("No recorded audio found"); return; }
  const info = $("#dlInfo"); let n = 0;
  let bad = 0;
  for (const p of ps) { try { const r = await fetch(AUD.src(p)); if (!r.ok) throw 0; await r.blob(); } catch (e) { bad++; } n++; if (info) info.textContent = `Downloading audio… ${n}/${ps.length}`; }
  if (bad) { if (info) info.textContent = `${bad} packs could not be downloaded. Try again on Wi-Fi.`; return; }
  if (info) info.textContent = "All audio is stored on this phone ✓"; toast("Audio ready offline");
};
const CHANGE = {
  setName: el => { S.set.name = el.value.trim(); save(); },
  setVoice: el => { S.set.voice = el.value; save(); WS.speak("Voilà ma voix.", {}); },
  setRate: el => { S.set.rate = +el.value; $("#rateV").textContent = el.value; save(); },
  setSound: el => { S.set.sound = el.checked; save(); hdrIcons(); },
  setVibe: el => { S.set.vibe = el.checked; save(); },
  setExamLevel: el => { S.set.examLevel = el.value; save(); },
  setExamDate: el => { S.set.examDate = el.value; save(); },
  importP: el => { const f = el.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { try { const o = JSON.parse(r.result); if (!o || !o.lessons) throw 0; S = Object.assign(DEFAULT(), o); saveNow(); toast("Progress imported"); render(); } catch (e) { toast("That file is not a Pas à pas export"); } }; r.readAsText(f); }
};
A.exportP = () => {
  const txt = JSON.stringify(S);
  try { const b = new Blob([txt], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "pas-a-pas-progress-" + dayKey() + ".json"; a.click(); } catch (e) { }
  openSheet(`<b>Your progress</b><p class="small muted">If no file was downloaded, copy this text and keep it in a note. To restore it, use Paste on the other device.</p><textarea class="inp" id="expTxt" rows="8">${esc(txt)}</textarea><div class="row" style="margin-top:10px"><button class="btn sm primary" data-a="copyExp">Copy</button></div>`);
};
A.copyExp = () => { const t = $("#expTxt"); (navigator.clipboard ? navigator.clipboard.writeText(t.value) : Promise.reject()).then(() => toast("Copied"), () => { t.select(); toast("Select all and copy"); }); };
A.pasteImp = () => openSheet(`<b>Restore progress</b><p class="small muted">Paste the exported text, then tap Restore.</p><textarea class="inp" id="impTxt" rows="8"></textarea><div class="row" style="margin-top:10px"><button class="btn sm primary" data-a="doImp">Restore</button></div>`);
A.doImp = () => { try { const o = JSON.parse($("#impTxt").value); if (!o || !o.lessons) throw 0; S = Object.assign(DEFAULT(), o); saveNow(); closeSheet(); toast("Progress imported"); render(); } catch (e) { toast("That is not a Pas à pas export"); } };
A.resetP = () => openSheet(`<b>Erase all progress on this device?</b><p class="small muted">Lessons, cards, mistakes and drafts will be deleted. This cannot be undone.</p><div class="row"><button class="btn sm" data-a="closeSheet">Cancel</button><button class="btn sm" style="color:var(--bad)" data-a="doReset">Erase everything</button></div>`);
A.doReset = () => { try { localStorage.removeItem(KEY); } catch (e) { } load(); closeSheet(); render(); toast("Progress erased"); };
function hdrIcons() { const b = $("#sndBtn"); if (b) { b.innerHTML = S.set.sound ? IC.spk : IC.mute; b.classList.toggle("off", !S.set.sound); } const g = $("#setBtn"); if (g) g.innerHTML = IC.gear; }
