/* ═══════════════════════════════════════════════════════════════════
   Pas à pas · core — storage, audio, routing, helpers
   ═══════════════════════════════════════════════════════════════════ */
"use strict";
const APP_VERSION = "4.0";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0;[a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (a, n) => shuffle(a).slice(0, n);
const uniq = a => Array.from(new Set(a));
const DAY = 864e5;
const dayKey = d => { d = d || new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const plural = (n, one, many) => n + " " + (n === 1 ? one : many);

/* ── storage ─────────────────────────────────────────────────────── */
const KEY = "pap:state";
const DEFAULT = () => ({
  v: 1, created: Date.now(),
  lessons: {},      // id → {stars, best, done, last, due, reviews, runs}
  cards: {},        // key → {b, due, r, w}
  seen: {},         // itemKey → count
  resume: {},       // lessonId → saved session
  mistakes: [],     // {t, q, given, cat, lesson, type}
  days: {},         // yyyy-mm-dd → answers
  plan: {},         // yyyy-mm-dd → {rev, les, prac}
  best: {},         // toolId → best %
  exam: {},         // taskId → {score, max, date}
  drafts: {},       // writing drafts
  cando: {},        // manual ticks
  level: "B1",
  set: { theme: "auto", voiceMode: "natural", voice: "", rate: 0.95, sound: true, vibe: true, examLevel: "B1", examDate: "", name: "Lan Anh" }
});
let S;
function load() {
  try { S = Object.assign(DEFAULT(), JSON.parse(localStorage.getItem(KEY) || "{}")); S.set = Object.assign(DEFAULT().set, S.set || {}); }
  catch (e) { S = DEFAULT(); }
}
let saveT = 0;
function save() { clearTimeout(saveT); saveT = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast("Mémoire pleine — exportez votre progression dans Moi → Réglages"); } }, 120); }
function saveNow() { clearTimeout(saveT); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }

/* ── theme ───────────────────────────────────────────────────────── */
function applyTheme() {
  const t = S.set.theme;
  const light = t === "light" || (t === "auto" && matchMedia("(prefers-color-scheme: light)").matches);
  document.documentElement.dataset.theme = light ? "light" : "dark";
  const m = $('meta[name="theme-color"]'); if (m) m.content = light ? "#F6F3EE" : "#0A1028";
}

/* ── text normalisation and answer checking ─────────────────────── */
function norm(s) {
  return String(s ?? "").toLowerCase()
    .replace(/[’`´ʼ]/g, "'").replace(/[«»"“”]/g, "").replace(/ | /g, " ")
    .replace(/\s*'\s*/g, "'").replace(/\s*-\s*/g, "-")
    .replace(/\s*([,;:!?.…])\s*/g, "$1 ").replace(/[\s,;:!?.…]+$/g, "")
    .replace(/\s+/g, " ").trim();
}
const deacc = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/œ/g, "oe").replace(/æ/g, "ae");
function check(given, accepts) {
  const g = norm(given);
  const list = [].concat(accepts).flatMap(a => String(a).split("|")).map(norm);
  if (list.includes(g)) return { ok: true };
  const gd = deacc(g);
  if (list.some(a => deacc(a) === gd)) return { ok: true, accent: true };
  return { ok: false };
}
function wordsOf(s) { return deacc(norm(s)).replace(/[,;:!?.…]/g, " ").split(/[\s']+/).filter(Boolean); }
function similarity(a, b) {
  const A = wordsOf(a), B = wordsOf(b);
  if (!A.length && !B.length) return 1;
  const d = Array.from({ length: A.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= B.length; j++) d[0][j] = j;
  for (let i = 1; i <= A.length; i++) for (let j = 1; j <= B.length; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (A[i - 1] === B[j - 1] ? 0 : 1));
  return 1 - d[A.length][B.length] / Math.max(A.length, B.length);
}
function countWords(t) { return (String(t).replace(/['’]/g, "' ").match(/[A-Za-zÀ-ÿœŒæÆ0-9]+(?:-[A-Za-zÀ-ÿœŒ0-9]+)*/g) || []).length; }
function tokenize(s) {
  const raw = String(s).replace(/\s+/g, " ").trim().split(" ");
  const out = [];
  raw.forEach(w => { if (/^[?!:;»…]+$/.test(w) && out.length) out[out.length - 1] += " " + w; else if (/^«$/.test(w)) out.push(w); else if (out.length && /^«$/.test(out[out.length - 1])) out[out.length - 1] += " " + w; else out.push(w); });
  return out;
}

/* ── audio: recorded neural voice first, device voice as fallback ── */
const SILENT = "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYwLjE2LjEwMAAAAAAAAAAAAAAA//OEwAAAAAAAAAAAAEluZm8AAAAPAAAABwAAA2AAVVVVVVVVVVVVVVVVVVVxcXFxcXFxcXFxcXFxcY6Ojo6Ojo6Ojo6Ojo6Oqqqqqqqqqqqqqqqqqqqqx8fHx8fHx8fHx8fHx8fj4+Pj4+Pj4+Pj4+Pj4///////////////////AAAAAExhdmM2MC4zMQAAAAAAAAAAAAAAACQEIAAAAAAAAANgmVBi7QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//NExAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExFMAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKYAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NExKwAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NExKwAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
const MALE = new Set(["Journaliste", "Paul Garnier", "Mehdi", "Publicité", "Chronique", "Pierre", "Examinateur", "Alex", "Marchand", "Agent", "Vendeur", "Hugo", "Animateur", "Julien", "Client", "Paul", "Médecin", "Étudiant, 22 ans", "Médecin, 38 ans", "Thomas", "Karim", "Marc", "Minh"]);
function ttsNorm(t) { return String(t ?? "").replace(/_{2,}/g, "…").replace(/\s+/g, " ").trim(); }
function fnv(s) { let h = 0x811c9dc5; for (const x of new TextEncoder().encode(s)) { h ^= x; h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(36); }
const AUD = {
  idx: null, loading: null, packs: {}, _el: null, unlocked: false,
  init() { if (this.loading) return this.loading; this.loading = fetch("audio/index.json").then(r => r.ok ? r.json() : null).then(j => { this.idx = j && j.c ? j : { packs: [], c: {} }; }).catch(() => { this.idx = { packs: [], c: {} }; }); return this.loading; },
  entry(text, m) { return this.idx && this.idx.c[fnv((m ? "m" : "f") + "|" + ttsNorm(text))]; },
  src(p) { return "audio/" + p + ".bin?v=" + (this.idx && this.idx.v || 0); },
  pack(p) { if (!this.packs[p]) this.packs[p] = fetch(this.src(p)).then(r => { if (!r.ok) throw new Error("pack"); return r.arrayBuffer(); }).catch(e => { delete this.packs[p]; throw e; }); return this.packs[p]; },
  prefetch(p) { this.init().then(() => { if (this.idx.packs.includes(p)) this.pack(p).catch(() => { }); }); },
  async url(text, m) { await this.init(); const e = this.entry(text, m); if (!e) return null; const buf = await this.pack(this.idx.packs[e[0]]); return URL.createObjectURL(new Blob([buf.slice(e[1], e[1] + e[2])], { type: "audio/mpeg" })); },
  el() { if (!this._el) { const a = new Audio(); a.preload = "auto"; a.setAttribute("playsinline", ""); this._el = a; } return this._el; },
  unlock() { if (this.unlocked) return; this.unlocked = true; try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (e) { } const a = this.el(); a.src = SILENT; a.play().catch(() => { this.unlocked = false; }); }
};
const WS = {
  ok: typeof speechSynthesis !== "undefined" && typeof SpeechSynthesisUtterance !== "undefined",
  voices: [], fr: [],
  load() {
    if (!this.ok) return;
    const all = speechSynthesis.getVoices() || [];
    const score = v => (v.lang === "fr-FR" || v.lang === "fr_FR" ? 50 : /^fr/i.test(v.lang) ? 10 : -100)
      + (/premium|enhanced|natural|neural|online|améliorée|amélioré/i.test(v.name) ? 14 : 0) + (/google/i.test(v.name) ? 8 : 0)
      + (/audrey|thomas|aurélie|marie|denise|henri|vivienne|remy|rémy|eloise|julie/i.test(v.name) ? 4 : 0)
      + (/canada|québec|belg|suisse|switz/i.test(v.name + v.lang) ? -6 : 0);
    this.voices = all; this.fr = all.filter(v => /^fr/i.test(v.lang)).sort((a, b) => score(b) - score(a));
  },
  voice(i = 0) {
    if (!this.fr.length) this.load();
    if (S.set.voice) { const v = this.fr.find(x => x.voiceURI === S.set.voice); if (v) return i ? (this.fr.find(x => x !== v && x.lang === v.lang) || v) : v; }
    return this.fr[i] || this.fr[0] || null;
  },
  speak(text, o) {
    if (!this.ok) { o.onend && setTimeout(o.onend, 50); return; }
    const u = new SpeechSynthesisUtterance(ttsNorm(text));
    const v = this.voice(o.alt ? 1 : 0); if (v) u.voice = v;
    u.lang = (v && v.lang) || "fr-FR";
    u.rate = (S.set.rate || 0.95) * (o.slow ? 0.72 : 1);
    u.pitch = o.alt && this.fr.length < 2 ? 0.82 : 1;
    if (o.onend) { u.onend = o.onend; u.onerror = o.onend; }
    speechSynthesis.speak(u); try { speechSynthesis.resume(); } catch (e) { }
  }
};
if (WS.ok) { WS.load(); speechSynthesis.onvoiceschanged = () => WS.load(); }
const TTS = {
  seq: 0,
  get fr() { return WS.fr; },
  get ok() { return true; },
  load() { WS.load(); },
  stop() { this.seq++; try { if (WS.ok) speechSynthesis.cancel(); } catch (e) { } const a = AUD._el; if (a) { try { a.pause(); a.onended = null; } catch (e) { } } },
  speak(text, o = {}) {
    if (!text) { o.onend && setTimeout(o.onend, 50); return; }
    if (!o.keep) this.stop();
    const my = this.seq;
    const device = () => { if (my === this.seq) WS.speak(text, o); };
    if (S.set.voiceMode === "device") return device();
    AUD.url(text, o.alt).then(u => {
      if (my !== this.seq) return;
      if (!u) return device();
      const a = AUD.el(); a.onended = null; a.onerror = null;
      a.src = u; a.playbackRate = clamp((S.set.rate || 0.95) / 0.95 * (o.slow ? 0.75 : 1), 0.5, 1.6);
      try { a.preservesPitch = true; a.webkitPreservesPitch = true; } catch (e) { }
      a.onended = () => { URL.revokeObjectURL(u); o.onend && o.onend(); };
      a.onerror = () => { URL.revokeObjectURL(u); device(); };
      a.play().catch(() => device());
    }).catch(device);
  },
  /* lines: [[speaker,text],...] — male speakers use the second voice */
  play(lines, o = {}) {
    this.stop(); const my = this.seq; let i = 0;
    const next = () => {
      if (my !== this.seq) return;
      if (i >= lines.length) { o.onend && o.onend(); return; }
      const [who, txt] = lines[i++]; o.online && o.online(i - 1);
      this.speak(txt, { keep: true, alt: MALE.has(who), slow: o.slow, onend: () => setTimeout(next, o.gap ?? 380) });
    };
    next();
  }
};
const say = (t, o) => TTS.speak(t, o);

/* ── speech recognition and recording ───────────────────────────── */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
function listenOnce(cb) {
  if (!SR) return cb(null, "unsupported");
  const r = new SR(); r.lang = "fr-FR"; r.interimResults = false; r.maxAlternatives = 3;
  let done = false;
  r.onresult = e => { done = true; const alts = Array.from(e.results[0]).map(a => a.transcript); cb(alts); };
  r.onerror = e => { if (!done) { done = true; cb(null, e.error); } };
  r.onend = () => { if (!done) { done = true; cb(null, "nothing"); } };
  try { r.start(); } catch (e) { cb(null, "busy"); }
  return r;
}
const IDB = {
  db: null,
  open() { return this.db ? Promise.resolve(this.db) : new Promise((res, rej) => { const q = indexedDB.open("pap-audio", 1); q.onupgradeneeded = () => q.result.createObjectStore("rec"); q.onsuccess = () => { this.db = q.result; res(this.db); }; q.onerror = () => rej(q.error); }); },
  async put(k, v) { const db = await this.open(); return new Promise(r => { const t = db.transaction("rec", "readwrite"); t.objectStore("rec").put(v, k); t.oncomplete = () => r(true); t.onerror = () => r(false); }); },
  async get(k) { const db = await this.open(); return new Promise(r => { const q = db.transaction("rec").objectStore("rec").get(k); q.onsuccess = () => r(q.result || null); q.onerror = () => r(null); }); }
};
const Rec = {
  mr: null, chunks: [], stream: null,
  async start() {
    if (!navigator.mediaDevices || !window.MediaRecorder) { toast("Recording is not available in this browser"); return false; }
    try { this.stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
    catch (e) { toast("Microphone permission was refused"); return false; }
    this.chunks = []; this.mr = new MediaRecorder(this.stream);
    this.mr.ondataavailable = e => e.data.size && this.chunks.push(e.data);
    this.mr.start(); return true;
  },
  stop() {
    return new Promise(res => {
      if (!this.mr) return res(null);
      this.mr.onstop = () => { const b = new Blob(this.chunks, { type: this.mr.mimeType || "audio/webm" }); this.stream.getTracks().forEach(t => t.stop()); this.mr = null; res(b); };
      this.mr.stop();
    });
  }
};

/* ── feedback: sound and vibration ──────────────────────────────── */
let AC = null;
function blip(ok) {
  if (S.set.vibe && navigator.vibrate) navigator.vibrate(ok ? 12 : [20, 40, 20]);
  if (!S.set.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const t = AC.currentTime, g = AC.createGain(); g.connect(AC.destination);
    const notes = ok ? [660, 990] : [220, 180];
    notes.forEach((f, i) => { const o = AC.createOscillator(); o.type = ok ? "sine" : "triangle"; o.frequency.value = f; o.connect(g); o.start(t + i * .09); o.stop(t + i * .09 + .14); });
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.12, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + .32);
  } catch (e) { }
}
let toastT;
function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), 2400); }

/* ── icons ───────────────────────────────────────────────────────── */
const IC = {
  back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
  x: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  chev: '<svg class="chev" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>',
  spk: '<svg viewBox="0 0 24 24"><path d="M4 10v4h3l4 3V7L7 10H4Z"/><path d="M15 9.5c1 1.3 1 3.7 0 5"/><path d="M17.6 7.5c2 2.4 2 6.6 0 9"/></svg>',
  play: '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg>',
  mic: '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>',
  today: '<svg viewBox="0 0 24 24"><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/><circle cx="12" cy="12" r="4"/></svg>',
  learn: '<svg viewBox="0 0 24 24"><path d="M4 18h4v-4h4v-4h4V6h4"/><path d="M4 21h16"/></svg>',
  practice: '<svg viewBox="0 0 24 24"><path d="M5 19l4-4M14 6l4 4M12 8l4 4-7 7H5v-4z"/><path d="M15 3l6 6"/></svg>',
  exam: '<svg viewBox="0 0 24 24"><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/><path d="M4 7v14"/></svg>',
  me: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" style="width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  mute: '<svg viewBox="0 0 24 24"><path d="M4 10v4h3l4 3V7L7 10H4Z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/></svg>',
  gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>'
};
const spkBtn = (t, cls = "") => `<button class="ibtn ${cls}" data-a="say" data-t="${esc(t)}" aria-label="Écouter">${IC.spk}</button>`;

/* ── router ──────────────────────────────────────────────────────── */
const TABS = [
  { id: "today", fr: "Aujourd'hui", en: "Today", ic: '<svg viewBox="0 0 24 24"><path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z"/></svg>' },
  { id: "learn", fr: "Apprendre", en: "Learn", ic: '<svg viewBox="0 0 24 24"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5zM20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z"/></svg>' },
  { id: "practice", fr: "Pratiquer", en: "Practice", ic: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/></svg>' },
  { id: "exam", fr: "Examen", en: "DELF · DALF", ic: '<svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="5"/><path d="M8.5 13 7 21l5-2.5 5 2.5-1.5-8"/></svg>' },
  { id: "me", fr: "Moi", en: "Me", ic: IC.me }
];
let stack = [{ view: "today" }];
const cur = () => stack[stack.length - 1];
const V = {};      // views
const A = {};      // actions
let SS = null;     // running session
function go(view, p = {}) { TTS.stop(); stack.push(Object.assign({ view }, p)); render(); scrollTo(0, 0); }
function tab(id) { TTS.stop(); stack = [{ view: id }]; render(); scrollTo(0, 0); }
function back() {
  TTS.stop();
  if ($("#scrim").classList.contains("on")) return closeSheet();
  if (SS) return A.quitSession();
  if (stack.length > 1) { stack.pop(); render(); return true; }
  if (stack[0].view !== "today") { tab("today"); return true; }
  return false;
}
function rootTab() { return stack[0].view; }
function render() {
  const c = cur(), fn = V[c.view];
  const out = fn ? fn(c) : { title: "?", html: "" };
  $("#stage").innerHTML = `<div class="fade">${out.html}</div>`;
  $("#hTitle").textContent = out.title || "Pas à pas";
  $("#hSub").textContent = out.sub || "";
  $("#backBtn").classList.toggle("on", stack.length > 1);
  $$("#nav button").forEach(b => b.setAttribute("aria-selected", b.dataset.tab === rootTab()));
  out.after && out.after();
}
function openSheet(html) { $("#sheet").innerHTML = `<div class="row between" style="margin-bottom:8px"><button class="btn sm ghost" data-a="closeSheet">‹ Retour</button></div>` + html; $("#scrim").classList.add("on"); }
function closeSheet() { $("#scrim").classList.remove("on"); TTS.stop(); if (typeof PR !== "undefined" && PR.cur) { if (PR.cur.recording) stopRec(true); if (PR.cur.player) PR.cur.player.pause(); if (PR.cur.sel === "#labbox") PR.cur = null; } return true; }

/* ── activity log ────────────────────────────────────────────────── */
function logAnswer(n = 1) { const k = dayKey(); S.days[k] = (S.days[k] || 0) + n; save(); }
function streak() {
  let n = 0, d = new Date();
  if (!S.days[dayKey(d)]) d = new Date(Date.now() - DAY);
  while (S.days[dayKey(d)]) { n++; d = new Date(d.getTime() - DAY); }
  return n;
}
function planMark(k) { const d = dayKey(); S.plan[d] = Object.assign(S.plan[d] || {}, { [k]: true }); save(); }
function seenBump(k) { S.seen[k] = (S.seen[k] || 0) + 1; }
function leastSeen(items, keyFn, n) {
  return shuffle(items).sort((a, b) => (S.seen[keyFn(a)] || 0) - (S.seen[keyFn(b)] || 0)).slice(0, n);
}
