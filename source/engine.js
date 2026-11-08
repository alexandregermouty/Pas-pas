/* ═══════════════════════════════════════════════════════════════════
   Pas à pas · engine — questions, sessions, lessons, spaced review
   ═══════════════════════════════════════════════════════════════════ */

/* ── lesson helpers ─────────────────────────────────────────────── */
const LESSON = {};
LESSONS.forEach((l, i) => { l.n = i; LESSON[l.id] = l; });
const lvlLessons = lv => LESSONS.filter(l => l.lvl === lv && !l.course);
const trackOf = l => TRACKS[l.tr] || (l.course ? { t: l.src || "", en: "" } : { t: l.tr, en: "" });
const lessonCards = l => (l.cards || []).map((c, i) => ({ fr: c[0], en: c[1], exfr: c[2] || "", exen: c[3] || "", key: l.id + "#" + i, lid: l.id }));
const allCardsOf = lv => LESSONS.filter(l => !lv || l.lvl === lv).flatMap(lessonCards);
function stars(n) { n = n || 0; return `<span class="stars">${[1, 2, 3].map(i => i <= n ? "★" : "<i>★</i>").join("")}</span>`; }
function lessonState(id) { return S.lessons[id] || {}; }
function isDue(id) { const s = lessonState(id); return s.done && s.due && s.due <= Date.now(); }
function nextLesson(lv) {
  const list = lvlLessons(lv || S.level);
  return list.find(l => S.resume[l.id]) || list.find(l => !lessonState(l.id).done) || null;
}

/* ── question builders (plain objects, safe to save) ───────────── */
function optsFrom(right, pool, n = 3) {
  const p = uniq(pool.filter(x => x && norm(x) !== norm(right)));
  const o = shuffle([right, ...pick(p, n)]);
  return { opts: o, a: o.indexOf(right) };
}
function poolEn(l) { return uniq([...lessonCards(l).map(c => c.en), ...LESSONS.filter(x => x.lvl === l.lvl && x !== l).flatMap(x => (x.cards || []).map(c => c[1]))]); }
function poolFr(l) { return uniq([...lessonCards(l).map(c => c.fr), ...LESSONS.filter(x => x.lvl === l.lvl && x !== l).flatMap(x => (x.cards || []).map(c => c[0]))]); }
function sameLessonFirst(l, right, field) {
  const own = lessonCards(l).map(c => c[field]).filter(x => x !== right);
  const other = (field === "en" ? poolEn(l) : poolFr(l)).filter(x => x !== right && !own.includes(x));
  return [...pick(own, 3), ...pick(other, 3)].slice(0, 3);
}
const Q = {
  rec(l, c) { const o = optsFrom(c.en, sameLessonFirst(l, c.en, "en")); return { t: "mc", k: "Recognise", prompt: `<div class="qp">${esc(c.fr)}</div>`, audio: c.fr, ...o, why: c.exfr ? `${c.exfr}<br><span class="en">${esc(c.exen)}</span>` : "", hear: c.fr, cat: "lexique", ik: c.key, lid: l.id, ck: c.key }; },
  recall(l, c) { const o = optsFrom(c.fr, sameLessonFirst(l, c.fr, "fr")); return { t: "mc", k: "Say it in French", prompt: `<div class="qp en" style="font-style:italic">${esc(c.en)}</div>`, ...o, why: c.exfr ? esc(c.exfr) : "", hear: c.fr, cat: "lexique", ik: c.key, lid: l.id, ck: c.key }; },
  listen(l, c) { const o = optsFrom(c.en, sameLessonFirst(l, c.en, "en")); return { t: "mc", k: "Listen", prompt: `<div class="muted small" style="text-align:center">Listen and choose the meaning</div>`, play: c.fr, ...o, why: `<b>${esc(c.fr)}</b>`, hear: c.fr, cat: "écoute", ik: c.key, lid: l.id, ck: c.key }; },
  listenS(l, s, k) { const pool = (l.sent || []).filter(x => x[0] !== s[0]).map(x => x[1]); const o = optsFrom(s[1], pool.length >= 3 ? pool : [...pool, ...poolEn(l)]); return { t: "mc", k: "Listen", prompt: `<div class="muted small" style="text-align:center">Listen and choose the meaning</div>`, play: s[0], ...o, why: `<b>${esc(s[0])}</b>`, hear: s[0], cat: "écoute", ik: k, lid: l.id }; },
  match(l, cs) { return { t: "match", k: "Match the pairs", pairs: cs.map(c => [c.fr, c.en]), cat: "lexique", lid: l.id, ik: l.id + "#match" }; },
  nat(l, x, k) { const o = optsFrom(x[0], [x[1]], 1); return { t: "mc", k: "Which one is correct?", prompt: `<div class="muted small">Choose the sentence a French speaker would write.</div>`, ...o, why: x[2], hear: x[0], cat: l.cat, ik: k, lid: l.id }; },
  mcq(l, x, k) { const o = optsFrom(x[1], x[2], 3); return { t: "mc", k: "Choose", prompt: `<div class="qs">${fmtBlank(x[0])}</div>`, ...o, why: x[3] || "", hear: /_{2,}/.test(x[0]) ? fillBlank(x[0], x[1]) : x[1], cat: l.cat, ik: k, lid: l.id }; },
  gapC(l, x, k) { const right = x[1].split("|")[0]; const o = optsFrom(right, x[4] || [], 3); return { t: "mc", k: "Fill the gap", prompt: `<div class="qs">${fmtBlank(x[0])}</div>${x[2] ? `<div class="muted small">(${esc(x[2])})</div>` : ""}${x[3] ? `<div class="qen">${esc(x[3])}</div>` : ""}`, ...o, why: gapWhy(l, x), hear: fillBlank(x[0], right), cat: l.cat, ik: k, lid: l.id }; },
  gapT(l, x, k) { const right = x[1].split("|")[0]; return { t: "type", k: "Type the missing word", prompt: `<div class="qs">${fmtBlank(x[0])}</div>${x[2] ? `<div class="muted small">(${esc(x[2])})</div>` : ""}${x[3] ? `<div class="qen">${esc(x[3])}</div>` : ""}`, acc: x[1], model: right, why: gapWhy(l, x), hear: fillBlank(x[0], right), cat: l.cat, ik: k, lid: l.id, short: true }; },
  fix(l, x, k) { return { t: "fix", k: "Find the mistake", s: x[0], bad: x[1], good: x[2], why: x[3], opts: shuffle([x[2], ...(x[4] || [])]), hear: x[0].replace(x[1], x[2]), cat: l.cat, ik: k, lid: l.id }; },
  build(l, s, k) { return { t: "build", k: "Build the sentence", en: s[1], words: shuffle(tokenize(s[0])), ans: s[0], hear: s[0], cat: "syntaxe", ik: k, lid: l.id }; },
  trans(l, x, k) { return { t: "type", k: "Transform", prompt: `<div class="muted small">${esc(x[0])}</div><div class="qs">${esc(x[1])}</div>`, acc: x[2], model: x[2].split("|")[0], why: "", hear: x[2].split("|")[0], self: true, cat: l.cat, ik: k, lid: l.id }; },
  chat(l, x, k) { const o = optsFrom(x[1], x[2], 3); return { t: "mc", k: "Reply", prompt: `<div class="chatb"><div><div class="who">They say</div><div class="bub">${esc(x[0])}</div></div></div><div class="muted small">Choose the best reply.</div>`, audio: x[0], ...o, why: x[3] || "", hear: x[1], cat: "interaction", ik: k, lid: l.id }; },
  dict(l, s, k) { return { t: "type", k: "Dictation", prompt: `<div class="muted small" style="text-align:center">Listen and write what you hear</div>`, play: s[0], acc: s[0], model: s[0], why: `<span class="en">${esc(s[1])}</span>`, hear: s[0], self: true, long: true, cat: "orthographe", ik: k, lid: l.id }; },
  tr(l, s, k) { return { t: "type", k: "Translate into French", prompt: `<div class="qp en" style="font-style:italic">${esc(s[1])}</div>`, acc: s[0], model: s[0], why: "", hear: s[0], self: true, long: true, cat: l.cat, ik: k, lid: l.id }; },
  speak(l, s, k) { return { t: "speak", k: "Say it aloud", text: s[0], en: s[1], hear: s[0], cat: "oral", ik: k, lid: l.id }; }
};
function fmtBlank(s) { return esc(s).replace(/_{2,}/g, '<span class="blank">?</span>'); }
function fillBlank(s, a) { return String(s).replace(/_{2,}/, a).replace(/\s*\([^)]*\)/g, "").trim(); }
function gapWhy(l, x) { return x[5] || (l.rule && l.rule.h ? esc(l.rule.h) : ""); }

/* ── lesson queue ───────────────────────────────────────────────── */
function lessonQueue(l, mode) {
  const cards = lessonCards(l), sent = l.sent || [];
  const k = (t, i) => l.id + ":" + t + i;
  const take = (arr, t, n) => leastSeen(arr.map((x, i) => ({ x, i })), o => k(t, o.i), n);
  const q = [];
  const C = take(cards, "c", 8).map(o => o.x);
  const sents = take(sent, "s", 10);
  const shortS = sents.filter(o => tokenize(o.x[0]).length <= 12);
  const gaps = take(l.gap || [], "g", 5), fixes = take(l.fix || [], "f", 3), nats = take(l.nat || [], "n", 3),
    mcqs = take(l.mcq || [], "m", 3), trs = take(l.xf || [], "t", 2), chats = take(l.chat || [], "h", 2);
  if (mode === "quick") {
    gaps[0] && q.push(Q.gapT(l, gaps[0].x, k("g", gaps[0].i)));
    mcqs[0] && q.push(Q.mcq(l, mcqs[0].x, k("m", mcqs[0].i)));
    fixes[0] && q.push(Q.fix(l, fixes[0].x, k("f", fixes[0].i)));
    return q;
  }
  if (mode !== "challenge") {
    C[0] && q.push(Q.rec(l, C[0])); C[1] && q.push(Q.rec(l, C[1]));
    if (C[2]) q.push(Q.listen(l, C[2]));
    if (cards.length >= 4) q.push(Q.match(l, pick(cards, 4)));
    C[3] && q.push(Q.recall(l, C[3]));
  }
  nats.slice(0, mode === "challenge" ? 1 : 2).forEach(o => q.push(Q.nat(l, o.x, k("n", o.i))));
  mcqs.slice(0, 2).forEach(o => q.push(Q.mcq(l, o.x, k("m", o.i))));
  chats[0] && q.push(Q.chat(l, chats[0].x, k("h", chats[0].i)));
  gaps.slice(0, mode === "challenge" ? 4 : 3).forEach((o, i) => q.push(i === 0 && mode !== "challenge" ? Q.gapC(l, o.x, k("g", o.i)) : Q.gapT(l, o.x, k("g", o.i))));
  fixes.slice(0, 2).forEach(o => q.push(Q.fix(l, o.x, k("f", o.i))));
  shortS.slice(0, 2).forEach(o => q.push(Q.build(l, o.x, k("s", o.i))));
  trs.slice(0, mode === "challenge" ? 2 : 1).forEach(o => q.push(Q.trans(l, o.x, k("t", o.i))));
  const rest = sents.filter(o => !shortS.slice(0, 2).includes(o));
  const r = rest.length >= 3 ? rest : sents;
  r[0] && q.push(Q.dict(l, r[0].x, k("s", r[0].i)));
  r[1] && q.push(Q.tr(l, r[1].x, k("s", r[1].i)));
  if (mode === "challenge" && r[2]) q.push(Q.dict(l, r[2].x, k("s", r[2].i)));
  (r[2] || r[0]) && q.push(Q.speak(l, (r[2] || r[0]).x, k("s", (r[2] || r[0]).i)));
  chats[1] && q.push(Q.chat(l, chats[1].x, k("h", chats[1].i)));
  return q;
}

/* ── sessions ───────────────────────────────────────────────────── */
function startSession(o) {
  if (!o.qs || !o.qs.length) { toast("Nothing to practise here yet"); return; }
  SS = Object.assign({ i: 0, res: [], wrong: [], repair: false, title: "Practice" }, o);
  if (o.lid) AUD.prefetch("L-" + o.lid);
  document.body.classList.add("insession");
  renderQ();
}
function saveResume() {
  if (!SS || !SS.lid || SS.kind !== "lesson" || SS.i === 0 || SS.done) return;
  S.resume[SS.lid] = { qs: SS.qs, i: SS.i, res: SS.res, wrong: SS.wrong, mode: SS.mode, repair: SS.repair, at: Date.now() };
  const ids = Object.keys(S.resume).sort((a, b) => S.resume[b].at - S.resume[a].at);
  ids.slice(6).forEach(id => delete S.resume[id]);
  saveNow();
}
A.quitSession = () => {
  TTS.stop();
  if (SS && SS.kind === "lesson" && SS.i > 0 && !SS.done) { saveResume(); toast(`Saved at question ${SS.i + 1}`); }
  SS = null; document.body.classList.remove("insession"); $("#fb").classList.remove("on");
  render();
  return true;
};
function sessTop() {
  const n = SS.qs.length, p = Math.round(100 * SS.i / n);
  return `<div class="sess-top"><button class="x" data-a="quitSession" aria-label="Back">${IC.x}</button><div class="progress"><i style="width:${p}%"></i></div><div class="cnt">${SS.repair ? "↻ " : ""}${SS.i + 1}/${n}</div></div>`;
}
function renderQ() {
  const q = SS.qs[SS.i]; SS.answered = false; SS.sel = null;
  let body = "";
  const head = `<div class="qk">${esc(q.k)}</div>`;
  const playBtn = q.play ? `<button class="bigplay" data-a="qplay" aria-label="Play">${IC.play}</button><button class="btn sm ghost slowbtn" data-a="qplay" data-slow="1">Slower</button>` : "";
  const audioBtn = q.audio ? `<div class="row" style="margin:6px 0">${spkBtn(q.audio)}</div>` : "";
  if (q.t === "mc") {
    body = `${head}${q.prompt}${audioBtn}${playBtn}<div class="opts">${q.opts.map((o, i) => `<button class="opt" data-a="mc" data-i="${i}"><span class="l">${"ABCDEF"[i]}</span><span>${esc(o)}</span></button>`).join("")}</div>`;
  } else if (q.t === "type") {
    body = `${head}${q.prompt}${audioBtn}${playBtn}
      ${q.long ? `<textarea class="inp" id="ans" rows="3" autocapitalize="sentences" spellcheck="false" placeholder="Écris ici…"></textarea>` : `<input class="inp" id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Écris ici…">`}
      ${accentBar()}
      <div class="checkbar"><button class="btn primary block" data-a="checkType">Check</button></div>`;
  } else if (q.t === "build") {
    body = `${head}<div class="qp en" style="font-style:italic">${esc(q.en)}</div><div class="tiles" id="built"></div><div class="tiles bank">${q.words.map((w, i) => `<button class="tk" data-a="tk" data-i="${i}">${esc(w)}</button>`).join("")}</div>
      <div class="row"><button class="btn sm ghost" data-a="tkUndo">Undo</button></div><div class="checkbar"><button class="btn primary block" data-a="checkBuild">Check</button></div>`;
    SS.built = [];
  } else if (q.t === "match") {
    SS.m = { L: shuffle(q.pairs.map((p, i) => ({ t: p[0], i }))), R: shuffle(q.pairs.map((p, i) => ({ t: p[1], i }))), sel: null, done: 0, err: 0 };
    body = `${head}<div class="muted small">Tap a French phrase, then its meaning.</div><div class="match"><div style="display:flex;flex-direction:column;gap:10px" id="mLc"></div><div style="display:flex;flex-direction:column;gap:10px" id="mRc"></div></div>`;
  } else if (q.t === "fix") {
    const toks = tokenize(q.s); SS.fixStage = 0;
    body = `${head}<div class="muted small">Tap the word or words that are wrong.</div><div class="tiles bank" id="fixs">${toks.map((w, i) => `<button class="tk" data-a="fixTap" data-i="${i}">${esc(w)}</button>`).join("")}</div><div id="fixOpts"></div>`;
  } else if (q.t === "speak") {
    body = `${head}<div class="qp">${esc(q.text)}</div><div class="qen">${esc(q.en)}</div><div class="row" style="margin:12px 0">${spkBtn(q.text)}<button class="btn sm ghost" data-a="say" data-t="${esc(q.text)}" data-slow="1">Slower</button></div>
      <button class="bigplay rec" data-a="speakGo" aria-label="Speak">${IC.mic.replace("<svg", '<svg style="fill:none;stroke:currentColor;stroke-width:2"')}</button>
      <div id="spkOut" class="muted small" style="text-align:center">${SR ? "Tap the microphone and read the sentence aloud." : "Your browser cannot check speech. Listen, repeat aloud, then rate yourself."}</div>
      <div class="row" style="justify-content:center;margin-top:14px"><button class="btn sm" data-a="selfRate" data-ok="1">I said it well</button><button class="btn sm ghost" data-a="selfRate" data-ok="0">Not yet</button></div>`;
  }
  $("#stage").innerHTML = `<div class="fade">${sessTop()}${body}</div>`;
  if (q.t === "match") {
    $("#mLc").innerHTML = SS.m.L.map(x => `<button class="opt" data-a="mL" data-i="${x.i}">${esc(x.t)}</button>`).join("");
    $("#mRc").innerHTML = SS.m.R.map(x => `<button class="opt en" style="font-style:italic" data-a="mR" data-i="${x.i}">${esc(x.t)}</button>`).join("");
  }
  const inp = $("#ans"); if (inp) { inp.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); A.checkType(); } }); setTimeout(() => inp.focus({ preventScroll: true }), 60); }
  if (q.play) setTimeout(() => say(q.play), 250);
  scrollTo(0, 0);
}
function accentBar() { return `<div class="accents">${["é", "è", "ê", "à", "â", "ù", "û", "ô", "î", "ï", "ç", "œ", "ë", "É"].map(c => `<button data-a="acc" data-c="${c}" tabindex="-1">${c}</button>`).join("")}</div>`; }
A.acc = d => { const i = $("#ans"); if (!i) return; const s = i.selectionStart ?? i.value.length, e = i.selectionEnd ?? s; i.value = i.value.slice(0, s) + d.c + i.value.slice(e); i.focus(); i.selectionStart = i.selectionEnd = s + 1; };
A.qplay = d => { const q = SS.qs[SS.i]; say(q.play, { slow: !!d.slow }); };
A.mc = (d, el) => {
  if (SS.answered) return; const q = SS.qs[SS.i]; const i = +d.i; const ok = i === q.a;
  $$(".opt").forEach((b, j) => { b.disabled = true; if (j === q.a) b.classList.add("right"); else if (j === i) b.classList.add("wrong"); });
  answer(ok, { given: q.opts[i], right: q.opts[q.a] });
};
A.checkType = () => {
  if (SS.answered) return; const q = SS.qs[SS.i]; const v = ($("#ans").value || "").trim();
  if (!v) { $("#ans").classList.add("shake"); setTimeout(() => $("#ans").classList.remove("shake"), 350); return; }
  const r = check(v, q.acc);
  if (r.ok) return answer(true, { given: v, right: q.model, accent: r.accent });
  if (q.self) {
    const sim = similarity(v, q.model);
    return answer(false, { given: v, right: q.model, self: true, sim });
  }
  answer(false, { given: v, right: q.model });
};
A.tk = (d, el) => { if (SS.answered) return; SS.built.push(+d.i); el.classList.add("used"); drawBuilt(); };
A.tkUndo = () => { if (SS.answered) return; const i = SS.built.pop(); if (i == null) return; $$(".tiles.bank .tk")[i].classList.remove("used"); drawBuilt(); };
A.tkOut = d => { if (SS.answered) return; const pos = +d.p; const i = SS.built.splice(pos, 1)[0]; $$(".tiles.bank .tk")[i].classList.remove("used"); drawBuilt(); };
function drawBuilt() { const q = SS.qs[SS.i]; $("#built").innerHTML = SS.built.map((i, p) => `<button class="tk" data-a="tkOut" data-p="${p}">${esc(q.words[i])}</button>`).join(""); }
A.checkBuild = () => {
  if (SS.answered) return; const q = SS.qs[SS.i];
  if (!SS.built.length) return;
  const s = SS.built.map(i => q.words[i]).join(" ");
  const r = check(s, q.ans);
  answer(r.ok, { given: s, right: q.ans });
};
A.mL = (d, el) => { if (SS.answered) return; $$("#mLc .opt").forEach(b => b.classList.remove("sel")); el.classList.add("sel"); SS.m.sel = +d.i; };
A.mR = (d, el) => {
  if (SS.answered || SS.m.sel == null) return; const q = SS.qs[SS.i];
  const L = $(`#mLc .opt[data-i="${SS.m.sel}"]`);
  if (+d.i === SS.m.sel) {
    L.classList.add("right", "gone"); el.classList.add("right", "gone"); say(q.pairs[SS.m.sel][0]); SS.m.done++; SS.m.sel = null;
    if (SS.m.done === q.pairs.length) setTimeout(() => answer(SS.m.err < 2, { given: "", right: "" , silent: SS.m.err < 2}), 350);
  } else { SS.m.err++; el.classList.add("shake", "wrong"); blip(false); setTimeout(() => el.classList.remove("shake", "wrong"), 400); }
};
A.fixTap = (d, el) => {
  if (SS.answered || SS.fixStage) return; const q = SS.qs[SS.i];
  const toks = tokenize(q.s); const i = +d.i;
  const bads = badIdx(q.s, q.bad);
  if (bads.includes(i)) {
    SS.fixStage = 1; bads.forEach(j => $$("#fixs .tk")[j].classList.add("pick"));
    $("#fixOpts").innerHTML = `<div class="muted small" style="margin-top:12px">Replace <b>${esc(q.bad)}</b> with:</div><div class="opts">${q.opts.map((o, j) => `<button class="opt" data-a="fixOpt" data-i="${j}"><span class="l">${"ABCDEF"[j]}</span><span>${esc(o)}</span></button>`).join("")}</div>`;
  } else {
    el.classList.add("bad"); bads.forEach(j => $$("#fixs .tk")[j].classList.add("pick"));
    answer(false, { given: toks[i], right: q.s.replace(q.bad, q.good) });
  }
};
A.fixOpt = d => {
  if (SS.answered) return; const q = SS.qs[SS.i]; const o = q.opts[+d.i]; const ok = o === q.good;
  $$("#fixOpts .opt").forEach((b, j) => { b.disabled = true; if (q.opts[j] === q.good) b.classList.add("right"); else if (j === +d.i) b.classList.add("wrong"); });
  answer(ok, { given: o, right: q.s.replace(q.bad, q.good) });
};
function badIdx(s, bad) {
  const toks = tokenize(s); const start = s.indexOf(bad), end = start + bad.length; const out = []; let pos = 0;
  toks.forEach((t, i) => { const at = s.indexOf(t.split(" ")[0], pos); const e = at + t.length; if (at < end && e > start) out.push(i); pos = at + 1; });
  return out.length ? out : [0];
}
let recog = null;
A.speakGo = () => {
  const q = SS.qs[SS.i]; if (SS.answered) return;
  if (!SR) { say(q.text); return; }
  TTS.stop(); $("#spkOut").innerHTML = `<span class="recdot"></span> Listening…`;
  recog = listenOnce((alts, err) => {
    if (!alts) { $("#spkOut").textContent = err === "not-allowed" ? "Microphone permission was refused. Rate yourself instead." : "I did not catch that. Try again, or rate yourself."; return; }
    const best = alts.map(a => ({ a, s: similarity(a, q.text) })).sort((x, y) => y.s - x.s)[0];
    const ok = best.s >= 0.75;
    $("#spkOut").innerHTML = `I heard: <b>${esc(best.a)}</b> · ${Math.round(best.s * 100)}%`;
    if (ok) answer(true, { given: best.a, right: q.text });
    else if (best.s >= 0.5) $("#spkOut").innerHTML += `<br>Close. Try once more, or rate yourself.`;
    else answer(false, { given: best.a, right: q.text });
  });
};
A.selfRate = d => { if (SS.answered) return; const q = SS.qs[SS.i]; answer(d.ok === "1", { given: "", right: q.text || q.model }); };

/* ── answering and feedback ─────────────────────────────────────── */
function answer(ok, o = {}) {
  const q = SS.qs[SS.i]; SS.answered = true; SS.last = { ok, o };
  if (q.ik) seenBump(q.ik);
  logAnswer();
  if (!o.self || ok) record(ok, o);
  blip(ok);
  showFb(ok, o);
}
function record(ok, o) {
  const q = SS.qs[SS.i];
  SS.res.push(ok ? 1 : 0);
  if (!ok) {
    if (!SS.repair) SS.wrong.push(SS.i);
    S.mistakes.unshift({ t: Date.now(), q, given: o.given || "", cat: q.cat || "autre", lid: q.lid || "", type: q.t });
    S.mistakes = S.mistakes.slice(0, 160);
  } else if (o.accent) {
    S.mistakes.unshift({ t: Date.now(), q, given: o.given || "", cat: "accents", lid: q.lid || "", type: q.t, soft: true });
    S.mistakes = S.mistakes.slice(0, 160);
  }
  if (q.ck) cardUpdate(q.ck, ok);
  save();
}
function showFb(ok, o) {
  const q = SS.qs[SS.i]; const fb = $("#fb");
  let html;
  if (o.self && !ok) {
    html = `<h4>Compare with the model</h4>
      <div class="muted small">You wrote</div><div class="ans" style="font-weight:500">${esc(o.given)}</div>
      <div class="muted small" style="margin-top:6px">Model ${o.sim != null ? `· ${Math.round(o.sim * 100)}% of words match` : ""}</div><div class="ans">${esc(q.model)}</div>
      ${q.why ? `<div class="why">${q.why}</div>` : ""}
      <div class="row" style="margin-top:10px">${spkBtn(q.hear || q.model)}<button class="btn primary" style="flex:1" data-a="selfFb" data-ok="1">Mine is also right</button><button class="btn" style="flex:1" data-a="selfFb" data-ok="0">I made a mistake</button></div>`;
    fb.className = "sheet-fb on";
  } else {
    const title = ok ? (o.accent ? "Correct — check the accents" : pick(["Bien joué !", "Exactement !", "Parfait !", "C'est ça !", "Très bien !"], 1)[0]) : pick(["Pas tout à fait", "Presque…", "Pas encore"], 1)[0];
    const showAns = !ok || o.accent || q.t === "type" || q.t === "fix" || q.t === "build";
    html = `<h4>${ok ? "✓" : "✕"} ${esc(title)}</h4>
      ${showAns && o.right ? `<div class="ans">${esc(o.right)}</div>` : ""}
      ${!ok && o.given && q.t !== "mc" ? `<div class="muted small">You wrote: ${esc(o.given)}</div>` : ""}
      ${q.why ? `<div class="why">${q.why}</div>` : ""}
      <div class="row" style="margin-top:10px">${q.hear ? spkBtn(q.hear) : ""}<button class="btn primary" style="flex:1" data-a="next">Continue →</button></div>`;
    fb.className = "sheet-fb on " + (ok ? "ok" : "no");
  }
  fb.innerHTML = `<div class="in">${html}</div>`;
  if (ok && q.hear && q.t !== "match") setTimeout(() => say(q.hear), 150);
}
A.selfFb = d => { const ok = d.ok === "1"; record(ok, SS.last.o); blip(ok); A.next(); };
A.next = () => {
  $("#fb").classList.remove("on"); TTS.stop();
  if (recog) { try { recog.abort(); } catch (e) { } recog = null; }
  SS.i++;
  if (SS.i >= SS.qs.length) {
    if (!SS.repair && SS.wrong.length && SS.noRepair !== true) {
      SS.mainRes = SS.res.slice(); SS.repair = true;
      SS.qs = SS.wrong.slice(0, 8).map(i => SS.qs[i]); SS.wrong = []; SS.i = 0; SS.res = [];
      toast("Mistakes come back once more"); renderQ(); return;
    }
    return finishSession();
  }
  if (SS.kind === "lesson") saveResume();
  renderQ();
};
function finishSession() {
  SS.done = true;
  const res = SS.mainRes || SS.res; const n = res.length || 1;
  const score = Math.round(100 * res.reduce((a, b) => a + b, 0) / n);
  const st = score >= 90 ? 3 : score >= 75 ? 2 : 1;
  const r = SS.onDone ? (SS.onDone(score, st) || {}) : {};
  if (SS.lid) delete S.resume[SS.lid];
  save();
  const C = 2 * Math.PI * 62;
  $("#stage").innerHTML = `<div class="fade" style="text-align:center;padding-top:20px">
    <svg class="ring" viewBox="0 0 150 150"><circle cx="75" cy="75" r="62" stroke="var(--s3)" stroke-width="12" fill="none"/><circle cx="75" cy="75" r="62" stroke="url(#gr)" stroke-width="12" fill="none" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - score / 100)}" transform="rotate(-90 75 75)" style="transition:stroke-dashoffset 1s"/>
    <defs><linearGradient id="gr"><stop offset="0" stop-color="var(--ok)"/><stop offset="1" stop-color="var(--gold)"/></linearGradient></defs>
    <text x="75" y="84" text-anchor="middle" font-size="30" font-weight="700" fill="var(--ink)" font-family="Fraunces,Georgia,serif">${score}%</text></svg>
    ${SS.kind === "lesson" ? `<div class="res-stars">${[1, 2, 3].map(i => i <= st ? "★" : "<i>★</i>").join("")}</div>` : ""}
    <div class="res-h">${score >= 90 ? "Excellent !" : score >= 75 ? "Très bien !" : score >= 50 ? "C'est un bon début" : "On continue !"}</div>
    <p class="muted">${esc(r.msg || SS.title)}</p>
    <div style="display:flex;flex-direction:column;gap:10px;margin-top:20px">
      ${r.extra || ""}
      <button class="btn primary block" data-a="endSession">Done</button>
    </div></div>`;
  scrollTo(0, 0);
}
A.endSession = () => { SS = null; document.body.classList.remove("insession"); render(); };

/* ── lessons: start, finish ─────────────────────────────────────── */
A.startLesson = d => {
  const l = LESSON[d.id]; const mode = d.mode || "normal";
  if (d.resume && S.resume[l.id]) {
    const r = S.resume[l.id];
    return startSession({ kind: "lesson", lid: l.id, mode: r.mode, qs: r.qs, i: r.i, res: r.res, wrong: r.wrong, repair: r.repair, title: l.t, onDone: (sc, st) => lessonDone(l, sc, st, r.mode) });
  }
  delete S.resume[l.id];
  startSession({ kind: "lesson", lid: l.id, mode, qs: lessonQueue(l, mode), title: l.t, noRepair: mode === "quick", onDone: (sc, st) => lessonDone(l, sc, st, mode) });
};
function lessonDone(l, score, st, mode) {
  const s = S.lessons[l.id] || {};
  const firstTime = !s.done;
  if (mode === "quick") {
    if (score < 100) return { msg: "Not quite yet — do the full lesson to lock it in." };
    st = 2;
  }
  s.done = true; s.runs = (s.runs || 0) + 1; s.last = Date.now();
  s.stars = Math.max(s.stars || 0, st); s.best = Math.max(s.best || 0, score);
  s.reviews = firstTime ? 0 : (s.reviews || 0) + (s.due && s.due <= Date.now() ? 1 : 0);
  const iv = [2, 5, 12, 30, 60, 120][Math.min(s.reviews, 5)];
  s.due = Date.now() + iv * DAY * (score < 60 ? 0.5 : 1);
  S.lessons[l.id] = s;
  lessonCards(l).forEach(c => { if (!S.cards[c.key]) S.cards[c.key] = { b: 0, due: Date.now() + DAY, r: 0, w: 0 }; });
  planMark("les"); save();
  const nx = lvlLessons(l.lvl).find(x => !lessonState(x.id).done && x.id !== l.id);
  return {
    msg: `${l.t} · ${firstTime ? (l.cards || []).length + " new cards added to review" : "next review in " + plural(iv, "day", "days")}`,
    extra: nx ? `<button class="btn block" data-a="endThen" data-go="lesson" data-id="${nx.id}">Next: ${esc(nx.t)} →</button>` : ""
  };
}
A.endThen = d => { SS = null; document.body.classList.remove("insession"); stack = [{ view: "learn" }]; go(d.go, { id: d.id }); };

/* ── spaced review of cards ─────────────────────────────────────── */
const BOX_DAYS = [1, 2, 4, 8, 16, 35, 80];
function cardUpdate(key, ok) {
  const c = S.cards[key]; if (!c) return;
  if (ok) { c.r++; c.b = Math.min(c.b + 1, BOX_DAYS.length - 1); c.due = Date.now() + BOX_DAYS[c.b] * DAY; }
  else { c.w++; c.b = Math.max(0, c.b - 2); c.due = Date.now() + 0.4 * DAY; }
}
function dueCards() { const now = Date.now(); return Object.keys(S.cards).filter(k => S.cards[k].due <= now && cardByKey(k)); }
function cardByKey(k) { const [id, i] = k.split("#"); const l = LESSON[id]; if (!l || !l.cards || !l.cards[+i]) return null; return lessonCards(l)[+i]; }
function weakCards() { return Object.keys(S.cards).filter(k => cardByKey(k) && S.cards[k].w >= 2 && S.cards[k].w >= S.cards[k].r / 2); }
function cardQs(keys) {
  return keys.map(k => {
    const c = cardByKey(k), l = LESSON[c.lid], b = S.cards[k].b;
    if (b <= 1) return Math.random() < .6 ? Q.rec(l, c) : Q.listen(l, c);
    if (b <= 3) return Q.recall(l, c);
    return Object.assign({ t: "type", k: "Type it in French", prompt: `<div class="qp en" style="font-style:italic">${esc(c.en)}</div>${c.exen ? `<div class="muted small">${esc(c.exen)}</div>` : ""}`, acc: c.fr, model: c.fr, why: c.exfr ? esc(c.exfr) : "", hear: c.fr, self: c.fr.split(" ").length > 3, cat: "lexique", ik: k, lid: l.id, ck: k });
  });
}
A.reviewCards = d => {
  const keys = d.weak ? pick(weakCards(), 15) : shuffle(dueCards()).slice(0, 20);
  if (!keys.length) { toast(d.weak ? "No weak cards — well done" : "Nothing due right now"); return; }
  startSession({ kind: "cards", title: d.weak ? "Weak cards" : "Card review", qs: cardQs(keys), onDone: sc => { planMark("rev"); return { msg: `${keys.length} cards reviewed` }; } });
};
A.reviewLessons = () => {
  const due = LESSONS.filter(l => isDue(l.id)).slice(0, 5);
  if (!due.length) { toast("No lesson is due for review"); return; }
  const qs = [];
  due.forEach(l => { const q = lessonQueue(l, "challenge"); qs.push(...pick(q.filter(x => ["type", "fix", "mc"].includes(x.t)), 3)); });
  startSession({ kind: "lessonReview", title: "Lesson review", qs: shuffle(qs), onDone: (sc) => {
    due.forEach(l => { const s = S.lessons[l.id]; s.reviews = (s.reviews || 0) + 1; s.due = Date.now() + [2, 5, 12, 30, 60, 120][Math.min(s.reviews, 5)] * DAY * (sc < 60 ? .5 : 1); });
    planMark("rev"); save(); return { msg: due.map(l => l.t).join(" · ") };
  } });
};
A.reviewMistakes = () => {
  const ms = S.mistakes.filter(m => m.q && !m.soft).slice(0, 40);
  const seen = new Set(); const qs = [];
  ms.forEach(m => { const k = m.q.ik || JSON.stringify(m.q).slice(0, 80); if (!seen.has(k) && qs.length < 12) { seen.add(k); qs.push(m.q); } });
  if (!qs.length) { toast("Your mistake notebook is empty"); return; }
  startSession({ kind: "mistakes", title: "Mistake notebook", qs: shuffle(qs), onDone: () => { planMark("rev"); return { msg: "Mistakes revisited" }; } });
};
