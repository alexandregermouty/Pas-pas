/* ═══════════════════════════════════════════════════════════════════
   Pas à pas · views — Today, Learn, lesson pages, flashcards, Me
   ═══════════════════════════════════════════════════════════════════ */
const LV = ["B1", "B2", "C1"];
const lvBadge = lv => `<span class="badge lv lv-${lv}">${lv}</span>`;
const row = (a, ic, t, s, end = "", data = "") => `<button class="lrow" data-a="${a}" ${data}><div class="ic">${ic}</div><div class="tx"><b>${t}</b>${s ? `<span>${s}</span>` : ""}</div>${end ? `<div class="end">${end}</div>` : ""}${IC.chev}</button>`;
const tile = (a, ic, t, s, data = "", best = "") => `<button class="tile" data-a="${a}" ${data}><div class="ic">${ic}</div><b>${t}</b><span>${s}</span>${best ? `<div class="best">${best}</div>` : ""}</button>`;
A.go = d => go(d.v, Object.assign({}, d));
A.tab = d => tab(d.tab);
A.say = d => say(d.t, { slow: !!d.slow });
A.closeSheet = () => closeSheet();
A.setLevel = d => { S.level = d.lv; save(); const c = cur(); c.lv = d.lv; render(); };

/* ── Today ───────────────────────────────────────────────────────── */
V.today = () => {
  const lv = S.level;
  const resumeIds = Object.keys(S.resume).filter(id => LESSON[id]).sort((a, b) => S.resume[b].at - S.resume[a].at);
  const nx = nextLesson(lv);
  const dueC = dueCards().length, dueL = LESSONS.filter(l => isDue(l.id)).length;
  const plan = S.plan[dayKey()] || {};
  let hero;
  if (resumeIds.length) {
    const l = LESSON[resumeIds[0]], r = S.resume[l.id];
    hero = { k: "Unfinished · " + l.lvl, t: l.t, p: `You stopped at question ${r.i + 1} of ${r.qs.length}.`, btn: `<button class="btn primary" data-a="startLesson" data-id="${l.id}" data-resume="1">Continue ▶</button>`, lv: l.lvl };
  } else if (nx) {
    hero = { k: `Next lesson · ${nx.lvl} · ${trackOf(nx).t}`, t: nx.t, p: nx.en, btn: `<button class="btn primary" data-a="go" data-v="lesson" data-id="${nx.id}">Start →</button>`, lv: nx.lvl };
  } else {
    const nlv = LV[LV.indexOf(lv) + 1];
    hero = { k: `Level ${lv} complete`, t: nlv ? `Ready for ${nlv}?` : "Every lesson is done", p: nlv ? "Move up a level, or test yourself with a mock exam." : "Keep the reviews going and train for the DALF C1.", btn: nlv ? `<button class="btn primary" data-a="setLevelGo" data-lv="${nlv}">Go to ${nlv} →</button>` : `<button class="btn primary" data-a="tab" data-tab="exam">Mock exam →</button>`, lv };
  }
  const sug = suggestion();
  const examLine = examCountdown();
  const idiom = IDIOMS[(Math.floor(Date.now() / DAY)) % IDIOMS.length];
  const known = Object.values(S.cards).filter(c => c.b >= 3).length;
  const done = LESSONS.filter(l => lessonState(l.id).done).length;
  return {
    title: "Aujourd'hui", sub: greet(),
    html: `
    <div class="hero"><div class="k">${esc(hero.k)}</div><h3>${esc(hero.t)}</h3><p>${esc(hero.p)}</p>${hero.btn}
      <div class="stripe"><i style="background:var(--b1)"></i><i style="background:var(--b2)"></i><i style="background:var(--c1)"></i><i style="background:var(--rose)"></i><i style="background:var(--gold)"></i></div></div>
    ${examLine}
    <div class="card plan"><h4>Today's plan</h4>
      <div class="step ${plan.rev ? "done" : ""}"><div class="dot">${plan.rev ? "✓" : 1}</div><div class="tx"><b>Review</b><span>${dueC ? plural(dueC, "card", "cards") + " due" : "No cards due"}${dueL ? " · " + plural(dueL, "lesson", "lessons") + " to revisit" : ""}</span></div>
        <button class="btn sm" data-a="${dueC ? "reviewCards" : dueL ? "reviewLessons" : "reviewMistakes"}">${dueC || dueL ? "Go" : "Mistakes"}</button></div>
      <div class="step ${plan.les ? "done" : ""}"><div class="dot">${plan.les ? "✓" : 2}</div><div class="tx"><b>One lesson</b><span>${nx ? esc(nx.t) : "All done at " + lv}</span></div>
        ${nx ? `<button class="btn sm" data-a="go" data-v="lesson" data-id="${nx.id}">Open</button>` : ""}</div>
      <div class="step ${plan.prac ? "done" : ""}"><div class="dot">${plan.prac ? "✓" : 3}</div><div class="tx"><b>${esc(sug.t)}</b><span>${esc(sug.s)}</span></div>
        <button class="btn sm" data-a="${sug.a}" ${sug.data || ""}>Try</button></div>
    </div>
    <div class="stats3"><div class="stat"><b>${streak()}</b><span>day streak</span></div><div class="stat"><b>${known}</b><span>cards known</span></div><div class="stat"><b>${done}/${LESSONS.length}</b><span>lessons</span></div></div>
    ${resumeIds.length > 1 ? `<h3 class="sec">Unfinished lessons</h3>${resumeIds.slice(1).map(id => row("startLesson", "▶", esc(LESSON[id].t), `Question ${S.resume[id].i + 1}/${S.resume[id].qs.length}`, LESSON[id].lvl, `data-id="${id}" data-resume="1"`)).join("")}` : ""}
    <h3 class="sec">Expression of the day</h3>
    <div class="card"><div class="row between"><div style="flex:1"><div class="fr" style="font-size:18px;font-family:var(--disp)">${esc(idiom[0])}</div><div class="en">${esc(idiom[1])}</div></div>${spkBtn(idiom[0])}</div>
      <div class="small" style="margin-top:10px">${esc(idiom[2])}</div><div class="en small">${esc(idiom[3] || "")}</div></div>
    `
  };
};
A.setLevelGo = d => { S.level = d.lv; save(); tab("learn"); };
function greet() { const h = new Date().getHours(); const n = S.set.name || ""; return (h < 5 ? "Bonne nuit" : h < 18 ? "Bonjour" : "Bonsoir") + (n ? ", " + n : ""); }
function examCountdown() {
  if (!S.set.examDate) return "";
  const d = Math.ceil((new Date(S.set.examDate + "T09:00") - Date.now()) / DAY);
  if (isNaN(d) || d < 0) return "";
  const lv = S.set.examLevel; const nm = EXAMS[lv] ? EXAMS[lv].name : lv;
  return `<button class="lrow" data-a="tab" data-tab="exam"><div class="ic">🎯</div><div class="tx"><b>${esc(nm)} in ${plural(d, "day", "days")}</b><span>${new Date(S.set.examDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} · open the mock tasks</span></div>${IC.chev}</button>`;
}
function suggestion() {
  const list = [
    { t: "Listening", s: "A recording at your level, with questions", a: "go", data: 'data-v="listenList"' },
    { t: "Conjugation sprint", s: "Ten verbs in the tenses of your level", a: "conjStart" },
    { t: "Dictation", s: "Five sentences, accents included", a: "dictStart" },
    { t: "Reading", s: "A text at your level, with questions", a: "go", data: 'data-v="readList"' },
    { t: "Speak for one minute", s: "A topic, a timer and your recording", a: "go", data: 'data-v="speakList"' },
    { t: "Connectors", s: "The words that structure an argument", a: "connStart" },
    { t: "Numbers and prices", s: "Hear them, type them", a: "numStart" },
    { t: "Register", s: "Familier, courant, soutenu", a: "regStart" }
  ];
  return list[Math.floor(Date.now() / DAY) % list.length];
}

/* ── Learn ───────────────────────────────────────────────────────── */
V.learn = c => {
  const lv = c.lv || S.level; const L = lvlLessons(lv); const meta = LEVELS[lv];
  const done = L.filter(l => lessonState(l.id).done).length;
  const nx = nextLesson(lv);
  const tracks = uniq(L.map(l => l.tr));
  const dueL = L.filter(l => isDue(l.id)).length;
  return {
    title: "Apprendre", sub: `${meta.name} · ${done}/${L.length} lessons`,
    html: `<div class="seg">${LV.map(x => `<button aria-pressed="${x === lv}" data-a="setLevel" data-lv="${x}">${x}</button>`).join("")}</div>
    <div class="card lv-${lv}" style="border-left:4px solid var(--lv)"><div class="row between"><div><b style="font-size:17px">${esc(meta.name)}</b><div class="muted small">${esc(meta.desc)}</div></div>${lvBadge(lv)}</div>
      <div class="progress" style="margin-top:12px"><i style="width:${Math.round(100 * done / L.length)}%"></i></div>
      <div class="row" style="margin-top:12px">${dueL ? `<button class="btn sm" data-a="reviewLessons">↺ Review ${plural(dueL, "lesson", "lessons")}</button>` : ""}<button class="btn sm ghost" data-a="go" data-v="exam" data-lv="${lv}">${esc(EXAMS[lv].name)} format</button></div></div>
    ${tracks.map(tr => {
      const T = trackOf({ tr }); const items = L.filter(l => l.tr === tr);
      return `<div class="track-h lv-${lv}"><div class="bar"></div><div><b>${esc(T.t)}</b><span>${esc(T.en)}</span></div></div>
      <div class="path lv-${lv}">${items.map(l => {
        const s = lessonState(l.id), r = S.resume[l.id];
        const cls = [s.done ? "done" : "", nx && nx.id === l.id ? "next" : "", isDue(l.id) ? "due" : ""].join(" ");
        return `<button class="node ${cls}" data-a="go" data-v="lesson" data-id="${l.id}"><div class="num">${s.done ? "✓" : L.indexOf(l) + 1}</div><div class="tx"><b>${esc(l.t)}</b><span>${esc(l.en)}</span></div>${r ? `<span class="resume-chip">▶ ${r.i + 1}/${r.qs.length}</span>` : s.done ? stars(s.stars) : ""}</button>`;
      }).join("")}</div>`;
    }).join("")}`
  };
};

/* ── Lesson page ─────────────────────────────────────────────────── */
V.lesson = c => {
  const l = LESSON[c.id]; if (!l) return { html: "Lesson not found" };
  const s = lessonState(l.id), r = S.resume[l.id], R = l.rule || {};
  const reads = (typeof READINGS !== "undefined" ? READINGS : []).filter(x => (x.lessons || []).includes(l.id));
  return {
    title: l.t, sub: `${l.lvl} · ${trackOf(l).t}`,
    html: `<div class="lhead lv-${l.lvl}"><div class="k">${l.lvl} · ${esc(trackOf(l).t)}</div><h3>${esc(l.t)}</h3><p>${esc(l.en)}</p>${s.done ? `<div style="margin-top:8px">${stars(s.stars)} <span class="small" style="opacity:.85">best ${s.best}%</span></div>` : ""}</div>
    ${r ? `<div class="card" style="border-color:rgba(var(--gold-rgb),.5)"><b>You are part-way through this lesson</b><div class="muted small">Question ${r.i + 1} of ${r.qs.length}</div><div class="row" style="margin-top:10px"><button class="btn primary" data-a="startLesson" data-id="${l.id}" data-resume="1">Continue ▶</button><button class="btn ghost" data-a="startLesson" data-id="${l.id}">Start again</button></div></div>` : ""}
    <div class="card"><div class="rule-h">${esc(R.h || "")}</div>
      ${R.pts ? `<ul class="pts">${R.pts.map(p => `<li>${p}</li>`).join("")}</ul>` : ""}
      ${(R.ex || []).length ? `<div style="margin-top:12px">${R.ex.map(e => `<button class="ex" data-a="say" data-t="${esc(e[0])}"><span class="spk">${IC.spk}</span><span><span class="fr">${esc(e[0])}</span><span class="en">${esc(e[1])}</span></span></button>`).join("")}</div>` : ""}
      ${R.warn ? `<div class="callout warn"><span class="k">Attention</span>${R.warn}</div>` : ""}
      ${R.vn ? `<div class="callout vn"><span class="k">Cho người Việt</span><span class="vn">${R.vn}</span></div>` : ""}
      ${R.more ? `<details class="more"><summary>More detail</summary><div class="small" style="margin-top:8px">${R.more}</div></details>` : ""}
    </div>
    <div style="display:flex;flex-direction:column;gap:10px;margin:16px 0">
      ${!r ? `<button class="btn primary block" data-a="startLesson" data-id="${l.id}">${s.done ? "Practise again" : "Start the lesson"} · ${lessonQueueLen(l)} questions</button>` : ""}
      <div class="grid2"><button class="btn" data-a="go" data-v="cards" data-id="${l.id}">Flashcards · ${(l.cards || []).length}</button>
      ${s.done ? `<button class="btn" data-a="startLesson" data-id="${l.id}" data-mode="challenge">Challenge</button>` : `<button class="btn" data-a="startLesson" data-id="${l.id}" data-mode="quick">I know this · quick check</button>`}</div>
    </div>
    <h3 class="sec">Sentences to hear</h3>
    <div class="card flat">${(l.sent || []).slice(0, 8).map(e => `<button class="ex" data-a="say" data-t="${esc(e[0])}"><span class="spk">${IC.spk}</span><span><span class="fr">${esc(e[0])}</span><span class="en">${esc(e[1])}</span></span></button>`).join("")}
      ${(l.sent || []).length > 8 ? `<details class="more"><summary>${l.sent.length - 8} more</summary>${l.sent.slice(8).map(e => `<button class="ex" data-a="say" data-t="${esc(e[0])}"><span class="spk">${IC.spk}</span><span><span class="fr">${esc(e[0])}</span><span class="en">${esc(e[1])}</span></span></button>`).join("")}</details>` : ""}</div>
    ${reads.length ? `<h3 class="sec">Read it in context</h3>${reads.map(x => row("go", "📖", esc(x.t), `${x.lvl} · ${x.kind || "text"}`, "", `data-v="read" data-id="${x.id}"`)).join("")}` : ""}`
  };
};
function lessonQueueLen(l) { return lessonQueue(l, "normal").length; }

/* ── Flashcards ─────────────────────────────────────────────────── */
V.cards = c => {
  const l = LESSON[c.id]; const cs = lessonCards(l); const i = clamp(c.i || 0, 0, cs.length - 1); const k = cs[i];
  return {
    title: "Flashcards", sub: l.t,
    html: `<div class="row between"><span class="muted small">${i + 1} / ${cs.length} · tap to flip</span>${spkBtn(k.fr)}</div>
    <div class="fc-wrap"><div class="fc" id="fc" data-a="flip"><div class="face"><div class="w">${esc(k.fr)}</div>${k.exfr ? `<div class="exs muted">${esc(k.exfr)}</div>` : ""}</div>
      <div class="face back"><div class="g">${esc(k.en)}</div>${k.exen ? `<div class="exs"><span class="en">${esc(k.exen)}</span></div>` : ""}</div></div></div>
    <div class="grid2"><button class="btn" data-a="fcMove" data-d="-1" ${i === 0 ? "disabled" : ""}>‹ Previous</button><button class="btn primary" data-a="fcMove" data-d="1">${i === cs.length - 1 ? "Finish" : "Next ›"}</button></div>`,
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
  return {
    title: "Moi", sub: S.set.name ? S.set.name + " · " + S.level : S.level,
    html: `<div class="row between"><h2 class="pg">Progress</h2><button class="ibtn" data-a="go" data-v="settings" aria-label="Settings">${IC.gear}</button></div>
    ${LV.map(lv => { const L = lvlLessons(lv); const d = L.filter(l => lessonState(l.id).done); const st = d.reduce((a, l) => a + (lessonState(l.id).stars || 0), 0);
      return `<div class="card flat lv-${lv}"><div class="row between"><b>${esc(LEVELS[lv].name)}</b>${lvBadge(lv)}</div><div class="progress" style="margin:10px 0 6px"><i style="width:${Math.round(100 * d.length / L.length)}%"></i></div><div class="muted small">${d.length}/${L.length} lessons · ${st}/${L.length * 3} stars · ${Object.keys(S.exam).filter(k => k.startsWith(lv)).length} mock tasks done</div></div>`; }).join("")}
    <div class="stats3"><div class="stat"><b>${cards.length}</b><span>cards</span></div><div class="stat"><b>${cards.filter(c => c.b >= 3).length}</b><span>known</span></div><div class="stat"><b>${streak()}</b><span>day streak</span></div></div>
    <h3 class="sec">Last twelve weeks</h3><div class="card flat"><div class="heat">${heat.join("")}</div></div>
    <h3 class="sec">Error profile · last 7 days</h3>
    <div class="card flat">${cats.length ? cats.map(([k, n]) => `<div class="row between" style="padding:6px 0;border-top:1px solid var(--line)"><span>${esc(CAT_LABEL[k] || k)}</span><b>${n}</b></div>`).join("") + (worstL.length ? `<div class="muted small" style="margin-top:10px">Lessons to revisit:</div>${worstL.map(([id, n]) => row("go", "↺", esc(LESSON[id].t), `${plural(n, "mistake", "mistakes")} this week`, LESSON[id].lvl, `data-v="lesson" data-id="${id}"`)).join("")}` : "") : `<span class="muted">No mistakes logged this week.</span>`}
      <div class="row" style="margin-top:10px"><button class="btn sm" data-a="reviewMistakes">Redo my mistakes</button><button class="btn sm ghost" data-a="go" data-v="notebook">Open the notebook</button></div></div>
    <h3 class="sec">I can…</h3>
    ${LV.map(lv => `<div class="card flat"><div class="row between"><b>${lv}</b><span class="muted small">${CANDO.filter(x => x.lvl === lv && canDo(x)).length}/${CANDO.filter(x => x.lvl === lv).length}</span></div>${CANDO.filter(x => x.lvl === lv).map(x => { const i = CANDO.indexOf(x); const ok = canDo(x); return `<label class="chk"><input type="checkbox" data-a="cando" data-i="${i}" ${ok ? "checked" : ""}><span>${esc(x.t)}${x.lessons ? `<span class="muted tiny"> · ${x.lessons.filter(id => lessonState(id).done).length}/${x.lessons.length} lessons</span>` : ""}</span></label>`; }).join("")}</div>`).join("")}
    <h3 class="sec">Report for a teacher</h3>
    <div class="card flat"><p class="small muted" style="margin-top:0">A short weekly summary you can paste into a message.</p><button class="btn sm" data-a="report">Copy this week's report</button></div>`
  };
};
const CAT_LABEL = { temps: "Tenses and moods", subjonctif: "Subjunctive", pronoms: "Pronouns", accords: "Agreement", connecteurs: "Connectors", registre: "Register", lexique: "Vocabulary", syntaxe: "Word order", "écoute": "Listening", orthographe: "Spelling", oral: "Speaking", interaction: "Interaction", accents: "Accents", relatifs: "Relative pronouns", hypothese: "Hypothesis", negation: "Negation", argumentation: "Argument", discours: "Reported speech", conjugaison: "Conjugation", nombres: "Numbers", autre: "Other" };
function canDo(x) { if (S.cando[CANDO.indexOf(x)] != null) return S.cando[CANDO.indexOf(x)]; return x.lessons ? x.lessons.every(id => lessonState(id).done) : false; }
A.cando = (d, el) => { S.cando[d.i] = el.checked; save(); };
A.report = () => {
  const since = Date.now() - 7 * DAY; let ans = 0; for (let i = 0; i < 7; i++) ans += S.days[dayKey(new Date(Date.now() - i * DAY))] || 0;
  const done = LESSONS.filter(l => (lessonState(l.id).last || 0) >= since);
  const ms = S.mistakes.filter(m => m.t >= since && !m.soft); const by = {}; ms.forEach(m => by[m.cat] = (by[m.cat] || 0) + 1);
  const txt = `Pas à pas — weekly report (${dayKey()})\nLearner: ${S.set.name || "-"} · current level: ${S.level}\nAnswers this week: ${ans} · streak: ${streak()} days\nLessons practised: ${done.map(l => l.lvl + " " + l.t).join("; ") || "none"}\nMain error types: ${Object.entries(by).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, n]) => (CAT_LABEL[k] || k) + " (" + n + ")").join(", ") || "none"}\nRecent mistakes:\n${ms.slice(0, 6).map(m => "- " + (m.q.model || m.q.hear || "") + (m.given ? "  [wrote: " + m.given + "]" : "")).join("\n")}`;
  (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => toast("Report copied"), () => openSheet(`<textarea class="inp" rows="14">${esc(txt)}</textarea>`));
};
V.notebook = () => {
  const ms = S.mistakes.slice(0, 60);
  return {
    title: "Mistake notebook", sub: plural(S.mistakes.length, "entry", "entries"),
    html: `<button class="btn primary block" data-a="reviewMistakes" style="margin:10px 0">Redo up to twelve of them</button>
    ${ms.map(m => `<div class="card flat"><div class="row between"><span class="badge lv lv-EX">${esc(CAT_LABEL[m.cat] || m.cat)}</span><span class="muted tiny">${new Date(m.t).toLocaleDateString("en-GB")}</span></div>
      <div style="margin-top:8px;font-weight:600">${esc(m.q.model || (m.q.opts ? m.q.opts[m.q.a] : "") || m.q.hear || "")}</div>${m.given ? `<div class="muted small">You: ${esc(m.given)}</div>` : ""}${m.q.why ? `<div class="small muted" style="margin-top:4px">${m.q.why}</div>` : ""}</div>`).join("") || `<p class="muted">Nothing yet.</p>`}`
  };
};

/* ── Settings ────────────────────────────────────────────────────── */
V.settings = () => {
  TTS.load();
  return {
    title: "Settings", sub: "Pas à pas " + APP_VERSION,
    html: `<div class="card flat">
      <label class="small muted">Name</label><input class="inp" id="setName" value="${esc(S.set.name)}" data-c="setName">
      <div style="height:12px"></div><label class="small muted">Theme</label>
      <div class="seg">${[["auto", "Auto"], ["dark", "Dark"], ["light", "Light"]].map(([k, t]) => `<button aria-pressed="${S.set.theme === k}" data-a="setTheme" data-k="${k}">${t}</button>`).join("")}</div>
    </div>
    <div class="card flat"><b>Voice</b><p class="small muted" style="margin:4px 0 8px">French voices installed on this device. Phones often offer better "enhanced" voices in their speech settings.</p>
      <select class="inp" id="setVoice" data-c="setVoice"><option value="">Best available</option>${TTS.fr.map(v => `<option value="${esc(v.voiceURI)}" ${S.set.voice === v.voiceURI ? "selected" : ""}>${esc(v.name)} · ${esc(v.lang)}</option>`).join("")}</select>
      <div style="height:10px"></div><label class="small muted">Speed · <span id="rateV">${S.set.rate}</span></label><input type="range" min="0.6" max="1.2" step="0.05" value="${S.set.rate}" id="setRate" data-c="setRate" style="width:100%">
      <button class="btn sm" data-a="say" data-t="Bonjour Lan Anh ! On révise un peu de français aujourd'hui ?">Test the voice</button>
      ${!TTS.fr.length ? `<div class="callout warn"><span class="k">No French voice found</span>Add a French voice in your phone's text-to-speech settings, then reopen the app.</div>` : ""}</div>
    <div class="card flat"><label class="chk"><input type="checkbox" data-c="setSound" ${S.set.sound ? "checked" : ""}><span>Sounds for right and wrong answers</span></label><label class="chk"><input type="checkbox" data-c="setVibe" ${S.set.vibe ? "checked" : ""}><span>Vibration</span></label></div>
    <div class="card flat"><b>Exam date</b><p class="small muted" style="margin:4px 0 8px">Shows a countdown on Today.</p>
      <div class="grid2"><select class="inp" data-c="setExamLevel">${LV.map(l => `<option value="${l}" ${S.set.examLevel === l ? "selected" : ""}>${esc(EXAMS[l].name)}</option>`).join("")}</select><input class="inp" type="date" value="${esc(S.set.examDate)}" data-c="setExamDate"></div></div>
    <div class="card flat"><b>Progress</b><p class="small muted" style="margin:4px 0 8px">Progress is stored in this browser only. Export it to move to another phone.</p>
      <div class="row"><button class="btn sm" data-a="exportP">Export</button><label class="btn sm ghost">Import file<input type="file" accept="application/json" data-c="importP" class="hide"></label><button class="btn sm ghost" data-a="pasteImp">Paste</button><button class="btn sm ghost" data-a="resetP" style="color:var(--bad)">Reset</button></div></div>
    <p class="muted tiny">Exam formats: France Éducation international. Content written for this app — check anything that sounds off with a teacher.</p>`
  };
};
A.setTheme = d => { S.set.theme = d.k; save(); applyTheme(); render(); };
const CHANGE = {
  setName: el => { S.set.name = el.value.trim(); save(); },
  setVoice: el => { S.set.voice = el.value; save(); say("Voilà ma voix."); },
  setRate: el => { S.set.rate = +el.value; $("#rateV").textContent = el.value; save(); },
  setSound: el => { S.set.sound = el.checked; save(); },
  setVibe: el => { S.set.vibe = el.checked; save(); },
  setExamLevel: el => { S.set.examLevel = el.value; save(); },
  setExamDate: el => { S.set.examDate = el.value; save(); },
  importP: el => { const f = el.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { try { const o = JSON.parse(r.result); if (!o || !o.lessons) throw 0; S = Object.assign(DEFAULT(), o); saveNow(); toast("Progress imported"); render(); } catch (e) { toast("That file is not a Pas à pas export"); } }; r.readAsText(f); }
};
A.exportP = () => {
  const txt = JSON.stringify(S);
  try { const b = new Blob([txt], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "pas-a-pas-progress-" + dayKey() + ".json"; a.click(); } catch (e) { }
  openSheet(`<b>Your progress</b><p class="small muted">If no file was downloaded, copy this text and save it in a note. To restore it, paste it below on the other device.</p><textarea class="inp" id="expTxt" rows="8">${esc(txt)}</textarea><div class="row" style="margin-top:10px"><button class="btn sm primary" data-a="copyExp">Copy</button></div>`);
};
A.copyExp = () => { const t = $("#expTxt"); (navigator.clipboard ? navigator.clipboard.writeText(t.value) : Promise.reject()).then(() => toast("Copied"), () => { t.select(); toast("Select all and copy"); }); };
A.pasteImp = () => openSheet(`<b>Restore progress</b><p class="small muted">Paste the exported text, then tap Restore.</p><textarea class="inp" id="impTxt" rows="8"></textarea><div class="row" style="margin-top:10px"><button class="btn sm primary" data-a="doImp">Restore</button></div>`);
A.doImp = () => { try { const o = JSON.parse($("#impTxt").value); if (!o || !o.lessons) throw 0; S = Object.assign(DEFAULT(), o); saveNow(); closeSheet(); toast("Progress imported"); render(); } catch (e) { toast("That is not a Pas à pas export"); } };
A.resetP = () => openSheet(`<b>Erase all progress on this device?</b><p class="small muted">Lessons, cards, mistakes and drafts will be deleted. This cannot be undone.</p><div class="row"><button class="btn sm" data-a="closeSheet">Cancel</button><button class="btn sm" style="color:var(--bad)" data-a="doReset">Erase everything</button></div>`);
A.doReset = () => { try { localStorage.removeItem(KEY); } catch (e) { } load(); closeSheet(); render(); toast("Progress erased"); };
