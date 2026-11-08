/* ═══════════════════════════════════════════════════════════════════
   Pas à pas · atelier de prononciation
   1. listen to the model, with the phonetic transcription (IPA) of each word
   2. record yourself; speech recognition checks each word
   3. compare: model and recording one after the other, with their
      rhythm and melody drawn on the same time scale
   4. tips in English for the sounds to work on
   ═══════════════════════════════════════════════════════════════════ */
const PR = { ipa: null, loading: null, cur: null };
PR.load = () => PR.loading || (PR.loading = fetch("ipa.json").then(r => r.ok ? r.json() : null).then(j => { PR.ipa = j || { s: {}, w: {} }; }).catch(() => { PR.ipa = { s: {}, w: {} }; }));
const prToks = t => String(t).split(/\s+/).filter(w => /[A-Za-zÀ-ÿœŒ0-9]/.test(w));
const prClean = w => w.toLowerCase().replace(/’/g, "'").replace(/^[^\wÀ-ÿœŒ]+|[^\wÀ-ÿœŒ']+$/g, "");
function prIpa(text) {
  const tk = prToks(text), I = PR.ipa || { s: {}, w: {} };
  const ctx = I.s[fnv("f|" + ttsNorm(text))];
  return tk.map((w, i) => {
    const iso = I.w[prClean(w)] || "", c = ctx ? ctx[i] : iso;
    const li = c && iso && c !== iso && c.startsWith(iso) && c.length === iso.length + 1 && /[ztnʁp]/.test(c.slice(-1)) && i < tk.length - 1 ? c.slice(-1) : "";
    return { w, ipa: c || iso, iso, li };
  });
}

/* ── phonetic tips (English) ───────────────────────────────────── */
const PHON = [
  { id: "r", ipa: /ʁ/, t: "The French R /ʁ/", d: "Made at the back of the throat, like a very soft gargle: keep the tip of your tongue down, touching your lower teeth, and let the back of the tongue come close to the soft palate. Never roll it and never curl the tongue as for the English r. Practise with <i>gargarisme</i>, then <i>Paris, très, merci</i>." },
  { id: "y", ipa: /y(?!i)|y$/, sp: /u/, t: "The sound /y/ (u, û)", d: "Say <i>ee</i> as in <i>see</i>, keep your tongue exactly there, then round and push your lips forward as if you were going to whistle. It is different from /u/ (<i>ou</i>): <i>tu</i> /ty/ ≠ <i>tout</i> /tu/, <i>dessus</i> ≠ <i>dessous</i>." },
  { id: "u", ipa: /u/, sp: /o[uùû]/, t: "The sound /u/ (ou)", d: "Lips very round and pushed forward, tongue pulled back, as in English <i>food</i> but tighter and shorter, with no glide at the end." },
  { id: "an", ipa: /ɑ̃/, t: "The nasal vowel /ɑ̃/ (an, en, am, em)", d: "Open your mouth as for the <i>a</i> of <i>father</i>, then let the air go out through your nose as well. Do not close with an n or m: the tongue does not move. <i>Enfant</i> /ɑ̃fɑ̃/ has two nasals and no n at all." },
  { id: "on", ipa: /ɔ̃/, t: "The nasal vowel /ɔ̃/ (on, om)", d: "Round your lips as for <i>o</i>, more closed than for /ɑ̃/, and let the air go through your nose. No n at the end: <i>bon</i> /bɔ̃/, <i>nous avons</i> /avɔ̃/. Contrast <i>vent</i> /vɑ̃/ and <i>vont</i> /vɔ̃/." },
  { id: "in", ipa: /ɛ̃|œ̃/, t: "The nasal vowel /ɛ̃/ (in, ain, ein, un, im)", d: "Spread your lips as for the <i>a</i> of <i>cat</i> and let the air go through your nose, without an n or ng at the end. Most speakers in France say <i>un</i> with the same sound: <i>vin, pain, plein, un</i>." },
  { id: "eu", ipa: /ø/, t: "The closed /ø/ (eu in deux, peu)", d: "Say /e/ (<i>é</i>) and round your lips without moving your tongue. Lips rounded and quite closed: <i>deux, peu, heureux, il pleut</i>." },
  { id: "oe", ipa: /œ(?!̃)/, t: "The open /œ/ (eu, œu in heure, sœur)", d: "Say /ɛ/ (<i>è</i>) and round your lips: the mouth is more open than for /ø/. It appears mostly before a pronounced consonant: <i>heure, sœur, jeune, professeur</i>." },
  { id: "e", ipa: /(^|[^ɛ])e/, sp: /é|er$|ez$/, t: "The closed /e/ (é, -er, -ez)", d: "Lips spread, mouth almost closed, a short and tense sound. Do not glide to <i>ee</i> as in English <i>day</i>: French /e/ stays the same from start to finish. <i>Parler, parlez, parlé</i> all end with this sound." },
  { id: "è", ipa: /ɛ(?!̃)/, t: "The open /ɛ/ (è, ê, ai, -et)", d: "Open your mouth more than for /e/, as in English <i>bed</i>. The imparfait endings <i>-ais, -ait, -aient</i> are pronounced /ɛ/ in careful French: <i>j'étais</i> /ʒetɛ/." },
  { id: "schwa", ipa: /ə/, t: "The \"e muet\" /ə/", d: "The <i>e</i> of <i>le, je, de, petit</i> is short, relaxed and unstressed, close to a rounded \"uh\". In everyday speech it often disappears: <i>je ne sais pas</i> → /ʃɛpa/, <i>petit</i> → /pti/. Never stress it." },
  { id: "ui", ipa: /ɥ/, t: "The glide /ɥ/ (ui in huit, nuit)", d: "Start with /y/ (lips rounded, tongue forward) and slide quickly to <i>ee</i>, all in one syllable: <i>huit</i> /ɥit/, <i>depuis</i> /dəpɥi/, <i>je suis</i> /ʒəsɥi/." },
  { id: "oi", ipa: /wa/, sp: /oi|oy/, t: "oi = /wa/", d: "<i>oi</i> is always pronounced /wa/: <i>moi, trois, voiture, soirée</i>." },
  { id: "gn", ipa: /ɲ/, t: "gn = /ɲ/", d: "Like the <i>ny</i> of <i>canyon</i>: <i>montagne, Espagne, signer</i>." },
  { id: "ch", ipa: /ʃ/, t: "ch = /ʃ/", d: "Like English <i>sh</i>, never <i>tch</i>: <i>chercher, chose, marché</i>." },
  { id: "j", ipa: /ʒ/, t: "j, ge, gi = /ʒ/", d: "Like the <i>s</i> of <i>measure</i>, never <i>dj</i>: <i>je, jour, voyage, gilet</i>." },
  { id: "ent", sp: /[a-zé]ent$/, test: (w, ipa) => !/ɑ̃$/.test(ipa), t: "Silent -ent in verbs", d: "In the 3rd person plural, the ending <i>-ent</i> is not pronounced at all: <i>ils parlent</i> sounds exactly like <i>il parle</i> /paʁl/. Only the context (and liaison) shows the plural." },
  { id: "fin", sp: /[^aeiouyéè][stdxzp]$|[aeiouéè][stdxz]$/i, test: (w, ipa) => /[aeiouyɛɔøœəɑ̃ɔ̃ɛ̃œ̃]$/.test(ipa), t: "Silent final consonants", d: "Most final consonants are silent: <i>-s, -t, -d, -x, -z, -p</i> (<i>petit</i> /pəti/, <i>grand</i> /ɡʁɑ̃/, <i>trop</i> /tʁo/). The usual exceptions are <i>c, r, f, l</i> (remember the word CaReFuL): <i>avec, finir, neuf, avril</i>." },
  { id: "h", sp: /^h/i, t: "The silent h", d: "The letter h is never pronounced: <i>hôtel</i> /otɛl/, <i>heure</i> /œʁ/. Most words allow elision and liaison (<i>l'hôtel, les‿hôtels</i>); a few (h aspiré) do not: <i>le haricot, les | héros</i>." }
];
const PHON_GENERAL = [
  { id: "rythme", t: "Rhythm and stress", d: "French has no strong word stress. Give every syllable about the same length and put a slight lengthening on the <b>last syllable of each group of words</b> (<i>je suis arrivée | à Paris | en novembre</i>). Link the words of a group together without pauses." },
  { id: "liaison", t: "Liaison", d: "A normally silent final consonant is pronounced and joined to the next word when that word starts with a vowel or a silent h: <i>les‿enfants</i> /lezɑ̃fɑ̃/, <i>nous‿avons</i> /nuzavɔ̃/, <i>un‿ami</i>. It is compulsory after articles, pronouns and short adverbs; the ‿ sign in the transcription shows where." }
];
function prTips(items, focus) {
  const out = [], seen = new Set();
  const consider = (it) => PHON.forEach(r => {
    if (seen.has(r.id)) return;
    const w = prClean(it.w);
    const ok = (r.ipa ? r.ipa.test(it.iso || it.ipa) : true) && (r.sp ? r.sp.test(w) : true) && (r.test ? r.test(w, it.iso || it.ipa) : true) && (r.ipa || r.sp);
    if (ok) { seen.add(r.id); out.push({ r, w: it.w, ipa: it.iso || it.ipa }); }
  });
  focus.forEach(consider);
  items.forEach(consider);
  return out;
}

/* ── comparing what was heard with the sentence ─────────────────── */
const UNITS = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize"];
const TENS = ["", "dix", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante", "quatre-vingt", "quatre-vingt"];
function numFr(n) {
  n = +n; if (!(n >= 0) || n > 9999) return String(n);
  if (n <= 16) return UNITS[n];
  if (n < 100) { const t = Math.floor(n / 10), u = n % 10; if (t === 7 || t === 9) return TENS[t] + (t === 7 && u === 1 ? " et " : "-") + UNITS[10 + u]; if (u === 0) return TENS[t] + (t === 8 ? "s" : ""); if (t === 1) return "dix-" + UNITS[u]; return TENS[t] + (u === 1 && t !== 8 ? " et un" : "-" + UNITS[u]); }
  if (n < 1000) { const h = Math.floor(n / 100), r = n % 100; return (h > 1 ? UNITS[h] + " cent" + (r ? "" : "s") : "cent") + (r ? " " + numFr(r) : ""); }
  const k = Math.floor(n / 1000), r = n % 1000; return (k > 1 ? numFr(k) + " mille" : "mille") + (r ? " " + numFr(r) : "");
}
function phonKey(w) {
  let s = w.toLowerCase().replace(/[’']/g, "").replace(/-/g, "");
  if (/^(les|des|mes|tes|ses|ces|est|et|es|ai|aie|aies|ait)$/.test(s)) s = s[0] === "a" ? "E" : s[0] + "E";
  else {
    if (s.length > 2) s = s.replace(/s$/, "");
    s = s.replace(/(aient|ais|ait|ai|ée|é|ez|er|et)$/, "E").replace(/[xz]$/, "");
    if (s.length > 4) s = s.replace(/ent$/, "");
    s = s.replace(/[td]$/, "").replace(/e$/, "");
  }
  s = s.replace(/eau|au|ô/g, "o").replace(/ou|où|oû/g, "U").replace(/qu|q|c(?=[aouUo])|k|ck/g, "k").replace(/ç|c(?=[eiyEé])|ss/g, "s").replace(/ph/g, "f").replace(/gn/g, "N").replace(/h/g, "")
    .replace(/[ae]n(?![aeiouéèê])|[ae]m(?=[bp])/g, "A").replace(/on(?![aeiouéè])|om(?=[bp])/g, "O").replace(/(ain|ein|in|un|im|yn)(?![aeiouéè])/g, "I")
    .replace(/[éèêë]|ai|ei/g, "E").replace(/(.)\1/g, "$1");
  return deacc(s);
}
function charSim(a, b) {
  if (a === b) return 1; const m = a.length, n = b.length; if (!m || !n) return 0;
  const d = Array.from({ length: m + 1 }, (_, i) => [i]); for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return 1 - d[m][n] / Math.max(m, n);
}
const heardWords = s => String(s).replace(/’/g, "'").replace(/\b([jlmtsdnc]|qu) (?=[aeiouyéèêàâîôûh])/gi, "$1'").replace(/\d+/g, n => " " + numFr(n) + " ").split(/[\s,.;:!?«»"]+/).filter(Boolean);
function prAlign(tokens, heard) {
  const T = tokens.map(w => phonKey(prClean(w))), H = heardWords(heard).map(w => phonKey(prClean(w)));
  const m = T.length, n = H.length, D = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0)), B = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) { D[i][0] = i; B[i][0] = 1; } for (let j = 1; j <= n; j++) { D[0][j] = j * .6; B[0][j] = 2; }
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    const sub = D[i - 1][j - 1] + (1 - charSim(T[i - 1], H[j - 1])), del = D[i - 1][j] + 1, ins = D[i][j - 1] + .6;
    if (sub <= del && sub <= ins) { D[i][j] = sub; B[i][j] = 0; } else if (del <= ins) { D[i][j] = del; B[i][j] = 1; } else { D[i][j] = ins; B[i][j] = 2; }
  }
  const st = Array(m).fill("miss"); let i = m, j = n;
  while (i > 0 || j > 0) {
    const b = i > 0 && j > 0 ? B[i][j] : i > 0 ? 1 : 2;
    if (b === 0) { const s = charSim(T[i - 1], H[j - 1]); st[i - 1] = s === 1 ? "ok" : s >= .6 ? "near" : "miss"; i--; j--; }
    else if (b === 1) i--; else j--;
  }
  const score = Math.round(100 * st.reduce((a, s) => a + (s === "ok" ? 1 : s === "near" ? .5 : 0), 0) / Math.max(1, m));
  return { st, score };
}

/* ── audio analysis: envelope and pitch ─────────────────────────── */
let PAC = null;
const prAC = () => (PAC = PAC || new (window.AudioContext || window.webkitAudioContext)());
function decodeAB(ab) { const ac = prAC(); return new Promise((res, rej) => { const p = ac.decodeAudioData(ab, res, rej); if (p && p.then) p.then(res, rej); }); }
function analyse(buf) {
  let x = buf.getChannelData(0), sr = buf.sampleRate; const f = Math.max(1, Math.floor(sr / 16000));
  if (f > 1) { const y = new Float32Array(Math.floor(x.length / f)); for (let i = 0; i < y.length; i++) y[i] = x[i * f]; x = y; sr = sr / f; }
  const hop = Math.round(sr * .02), win = Math.round(sr * .04), N = Math.max(0, Math.floor((x.length - win) / hop));
  const rms = new Float32Array(N); let mx = 0;
  for (let k = 0; k < N; k++) { let s = 0; for (let i = 0; i < win; i++) { const v = x[k * hop + i]; s += v * v; } rms[k] = Math.sqrt(s / win); if (rms[k] > mx) mx = rms[k]; }
  let a = 0, b = N - 1; while (a < N && rms[a] < mx * .08) a++; while (b > a && rms[b] < mx * .08) b--;
  const lo = Math.floor(sr / 420), hi = Math.floor(sr / 70), f0 = new Float32Array(N);
  for (let k = a; k <= b; k++) {
    if (rms[k] < mx * .18) continue;
    const o = k * hop; let best = 0, bl = 0, e0 = 0;
    for (let i = 0; i < win; i++) e0 += x[o + i] * x[o + i];
    for (let L = lo; L <= hi && o + win + L < x.length; L++) {
      let c = 0, e1 = 0; for (let i = 0; i < win; i++) { c += x[o + i] * x[o + i + L]; e1 += x[o + i + L] * x[o + i + L]; }
      const r = c / Math.sqrt(e0 * e1 + 1e-9); if (r > best) { best = r; bl = L; }
    }
    if (best > .55 && bl) f0[k] = sr / bl;
  }
  const v = Array.from(f0.slice(a, b + 1)).filter(Boolean).sort((p, q) => p - q), med = v.length ? v[v.length >> 1] : 0;
  return { rms: rms.slice(a, b + 1), f0: f0.slice(a, b + 1), mx, med, dur: (b - a + 1) * .02 };
}
function endSlope(A) {
  const st = Array.from(A.f0).map(v => v ? 12 * Math.log2(v / A.med) : null), n = st.length; if (!A.med || n < 10) return 0;
  const tail = st.slice(Math.floor(n * .7)).filter(v => v != null), mid = st.slice(Math.floor(n * .35), Math.floor(n * .7)).filter(v => v != null);
  if (tail.length < 3 || mid.length < 3) return 0;
  const avg = a => a.reduce((p, q) => p + q, 0) / a.length;
  return Math.max(...tail.slice(-4)) - avg(mid) > 2.5 ? 1 : avg(tail.slice(-4)) - avg(mid) < -2 ? -1 : 0;
}
function drawTracks(cv, tracks) {
  const dpr = window.devicePixelRatio || 1, W = cv.clientWidth || 320, H = 150; cv.width = W * dpr; cv.height = H * dpr; cv.style.height = H + "px";
  const g = cv.getContext("2d"); g.scale(dpr, dpr); g.clearRect(0, 0, W, H);
  const css = getComputedStyle(document.body), col = n => css.getPropertyValue(n).trim() || "#888";
  const T = Math.max(...tracks.filter(Boolean).map(t => t.dur), 1), sx = (W - 12) / T, rowH = H / 2;
  tracks.forEach((t, r) => {
    const y0 = r * rowH, mid = y0 + rowH / 2 + 4; const c = col(r ? "--red" : "--blue2");
    g.fillStyle = col("--dim"); g.font = "600 11px system-ui, sans-serif"; g.fillText(r ? "Vous" : "Modèle", 4, y0 + 12);
    if (!t) { g.fillText("—", 60, y0 + 12); return; }
    g.fillText(t.dur.toFixed(1).replace(".", ",") + " s", 60, y0 + 12);
    g.globalAlpha = .28; g.fillStyle = c;
    for (let k = 0; k < t.rms.length; k++) { const h = (t.rms[k] / t.mx) * (rowH * .32); g.fillRect(6 + k * .02 * sx, mid - h, Math.max(1, .02 * sx - .5), 2 * h); }
    g.globalAlpha = 1; g.fillStyle = c;
    for (let k = 0; k < t.f0.length; k++) if (t.f0[k] && t.med) { const s = 12 * Math.log2(t.f0[k] / t.med); const y = mid - Math.max(-9, Math.min(9, s)) * (rowH * .4 / 9); g.beginPath(); g.arc(6 + k * .02 * sx, y, 2, 0, 7); g.fill(); }
  });
}

/* ── the lab ────────────────────────────────────────────────────── */
function prKey(t) { return fnv("p|" + ttsNorm(t)); }
function labWords(L) {
  return `<div class="pw">${L.items.map((it, i) => `<span class="pwi ${L.st ? L.st[i] : ""}" data-a="say" data-t="${esc(prClean(it.w))}"><b>${esc(it.w)}</b><i>${it.ipa ? "/" + esc(it.iso || it.ipa) + "/" : "&nbsp;"}</i></span>${it.li ? `<span class="pli" title="liaison">‿${esc(it.li)}</span>` : ""}`).join("")}</div>`;
}
function labRender() {
  const L = PR.cur; if (!L) return; const box = $(L.sel); if (!box) return;
  const best = (S.pron || {})[prKey(L.text)];
  const res = L.res;
  box.innerHTML = `<div class="lab">
    ${L.list ? `<div class="row between" style="margin-bottom:6px"><button class="btn sm ghost" data-a="prNav" data-d="-1" ${L.i ? "" : "disabled"}>‹</button><span class="muted small">Phrase ${L.i + 1} / ${L.list.length}</span><button class="btn sm ghost" data-a="prNav" data-d="1" ${L.i < L.list.length - 1 ? "" : "disabled"}>›</button></div>` : ""}
    <div class="card flat labcard">${labWords(L)}${L.en ? `<div class="qen">${esc(L.en)}</div>` : ""}
      <div class="row" style="margin-top:10px;gap:8px">${spkBtn(L.text)}<button class="btn sm ghost" data-a="say" data-t="${esc(L.text)}" data-slow="1">Plus lent</button>${best != null ? `<span class="muted small" style="margin-left:auto">Meilleur score : ${best} %</span>` : ""}</div>
      <div class="muted tiny" style="margin-top:6px">Sous chaque mot : sa prononciation en alphabet phonétique (API). Touchez un mot pour l'entendre seul.</div></div>
    <div class="recwrap">
      <button class="bigplay rec ${L.recording ? "on" : ""}" data-a="prRec" aria-label="${L.recording ? "Arrêter" : "Enregistrer"}">${L.recording ? '<svg viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor"/></svg>' : IC.mic.replace("<svg", '<svg style="fill:none;stroke:currentColor;stroke-width:2"')}</button>
      <canvas id="prMeter" class="meter ${L.recording ? "" : "hide"}"></canvas>
      <div class="muted small" style="text-align:center">${L.recording ? "Je vous écoute… lisez la phrase, puis touchez ■" : L.busy ? "Analyse…" : res ? "Touchez le micro pour réessayer" : "Écoutez le modèle, puis touchez le micro et lisez la phrase"}</div>
    </div>
    ${res ? labResult(L) : ""}
  </div>`;
  if (L.recording) meterLoop();
  if (res && (L.mA || L.uA)) requestAnimationFrame(() => { const cv = $("#prCv"); if (cv) drawTracks(cv, [L.mA, L.uA]); });
}
function labResult(L) {
  const r = L.res, sc = r.score;
  const verdict = sc == null ? "" : sc >= 85 ? "Très bien prononcé !" : sc >= 65 ? "Bien — quelques mots à retravailler" : "À retravailler";
  const weak = L.items.filter((_, i) => L.st && L.st[i] !== "ok");
  const tips = prTips(L.items, weak).slice(0, sc != null && sc >= 85 ? 2 : 4);
  const notes = [];
  if (L.mA && L.uA) {
    const ratio = L.uA.dur / L.mA.dur;
    if (ratio > 1.45) notes.push(`You took ${Math.round((ratio - 1) * 100)}% longer than the model. That is normal while practising; next time, try to say each group of words in one breath, without stopping between the words.`);
    else if (ratio < .7) notes.push("You spoke much faster than the model: slow down a little so that every syllable is clear.");
    const ms = endSlope(L.mA), us = endSlope(L.uA);
    if (ms === 1 && us !== 1) notes.push("At the end of the sentence the model's voice <b>goes up</b> (a question, or a pause before more information). Let your voice rise on the last syllable.");
    if (ms === -1 && us === 1) notes.push("The model's voice <b>falls</b> at the end, as in any statement; yours goes up, which sounds like a question. Let your voice drop on the last syllable.");
  }
  return `<div class="card labres">
    ${sc != null ? `<div class="row" style="gap:14px;align-items:center"><div class="pscore ${sc >= 85 ? "ok" : sc >= 65 ? "mid" : "no"}">${sc}<small>%</small></div><div><div style="font-weight:700;font-size:17px">${verdict}</div><div class="muted small">J'ai entendu : « ${esc(r.heard)} »</div></div></div>
      <div class="muted tiny" style="margin-top:8px"><span class="lg ok"></span> bien reconnu <span class="lg near"></span> presque <span class="lg miss"></span> pas reconnu</div>`
      : `<div style="font-weight:700">Écoutez et comparez</div><div class="muted small">${esc(r.why || "La reconnaissance vocale n'est pas disponible ici : comparez votre enregistrement avec le modèle, puis évaluez-vous.")}</div>`}
    <div class="qk" style="margin-top:14px">Comparer</div>
    <div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn sm" data-a="prPlay" data-w="m">${IC.play} Modèle</button><button class="btn sm" data-a="prPlay" data-w="u" ${L.uUrl ? "" : "disabled"}>${IC.play} Vous</button><button class="btn sm primary" data-a="prPlay" data-w="mu" ${L.uUrl ? "" : "disabled"}>${IC.play} Modèle puis vous</button></div>
    ${L.mA || L.uA ? `<canvas id="prCv" class="prcv"></canvas><div class="muted tiny">Barres : l'énergie de la voix (le rythme). Points : la mélodie (l'intonation), mesurée par rapport à la hauteur moyenne de chaque voix.</div>` : ""}
  </div>
  <div class="xen"><div class="xen-h"><span class="flag">EN</span>Pronunciation explained</div>
    ${sc != null ? `<p>${sc >= 85 ? "Every word was recognised (or almost): your pronunciation is clear." : weak.length ? `Work on: ${weak.map(it => `<b>${esc(it.w)}</b> /${esc(it.iso || it.ipa)}/`).join(", ")}. Listen to each word alone (tap it), repeat it three times, then say the whole sentence again.` : ""}</p>` : ""}
    ${notes.map(n => `<p>${n}</p>`).join("")}
    ${tips.map(t => `<div class="xsec"><b>${t.r.t}</b> <span class="muted small">— ${esc(t.w)} /${esc(t.ipa)}/</span><div>${t.r.d}</div></div>`).join("")}
    ${L.items.some(it => it.li) ? `<div class="xsec"><b>${PHON_GENERAL[1].t}</b><div>${PHON_GENERAL[1].d}</div></div>` : ""}
    <div class="xsec"><b>${PHON_GENERAL[0].t}</b><div>${PHON_GENERAL[0].d}</div></div>
    <p class="small muted">The score comes from the phone's speech recognition: it checks that each word can be understood, not every detail of your accent. A word in orange or red is the first place to look.</p>
  </div>
  <div class="row" style="gap:8px;margin-top:10px">
    ${L.onDone ? `<button class="btn primary" style="flex:1" data-a="prDone" data-ok="${sc == null ? 1 : sc >= 65 ? 1 : 0}">${sc == null ? "C'était bien" : "Valider"}</button>${sc == null ? `<button class="btn" style="flex:1" data-a="prDone" data-ok="0">À retravailler</button>` : ""}`
      : sc == null ? `<button class="btn" style="flex:1" data-a="prSelf" data-ok="1">😊 C'était bien</button><button class="btn" style="flex:1" data-a="prSelf" data-ok="0">🔁 À retravailler</button>` : ""}
    ${L.list && L.i < L.list.length - 1 ? `<button class="btn ${L.onDone ? "" : "primary"}" style="flex:1" data-a="prNav" data-d="1">Phrase suivante →</button>` : ""}
  </div>`;
}
let meterRAF = 0;
function meterLoop() {
  cancelAnimationFrame(meterRAF);
  const L = PR.cur, cv = $("#prMeter"); if (!L || !L.an || !cv) return;
  const dpr = window.devicePixelRatio || 1, W = cv.clientWidth || 240, H = 36; cv.width = W * dpr; cv.height = H * dpr;
  const g = cv.getContext("2d"), d = new Uint8Array(L.an.fftSize), col = getComputedStyle(document.body).getPropertyValue("--red").trim() || "#d33";
  const hist = [];
  const step = () => {
    if (!PR.cur || !PR.cur.recording) return;
    L.an.getByteTimeDomainData(d); let s = 0; for (const v of d) s += (v - 128) * (v - 128); hist.push(Math.min(1, Math.sqrt(s / d.length) / 40)); if (hist.length > 80) hist.shift();
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H); g.fillStyle = col;
    hist.forEach((v, i) => { const h = Math.max(2, v * H); g.fillRect(i * (W / 80), (H - h) / 2, W / 80 - 1, h); });
    meterRAF = requestAnimationFrame(step);
  };
  step();
}
async function loadModel(L) {
  try {
    const u = await AUD.url(L.text, false); if (!u) return;
    L.mUrl = u; const ab = await (await fetch(u)).arrayBuffer(); L.mA = analyse(await decodeAB(ab));
  } catch (e) { }
}
function openLab(o) {
  if (PR.cur && PR.cur.recording) stopRec(true);
  const L = PR.cur = { text: o.text, en: o.en || "", lid: o.lid, sel: o.sel || "#labbox", onDone: o.onDone, list: o.list, i: o.i || 0 };
  PR.load().then(() => { if (PR.cur !== L) return; L.items = prIpa(L.text); labRender(); });
  L.items = prIpa(L.text);
  labRender(); loadModel(L);
}
A.pron = d => {
  const l = d.lid && LESSON[d.lid];
  const list = l ? labList(l) : null; let i = list ? list.findIndex(x => x[0] === d.t) : -1;
  openSheet(`<div class="qk">Atelier de prononciation</div><div id="labbox"></div>`);
  openLab(i >= 0 ? { text: list[i][0], en: list[i][1], lid: d.lid, list, i } : { text: d.t, en: d.en });
};
const labList = l => uniq([...(l.rule && l.rule.ex || []), ...(l.sent || []), ...((l.sons && l.sons.ex) || []).map(e => [e, ""])].map(e => JSON.stringify([plain(e[0]), e[1] || ""]))).map(s => JSON.parse(s)).filter(e => prToks(e[0]).length <= 25);
A.prNav = d => { const L = PR.cur; if (!L || !L.list) return; const i = Math.max(0, Math.min(L.list.length - 1, L.i + +d.d)); TTS.stop(); openLab({ text: L.list[i][0], en: L.list[i][1], lid: L.lid, list: L.list, i, sel: L.sel, onDone: L.onDone }); };
A.prRec = async () => {
  const L = PR.cur; if (!L || L.busy) return;
  if (L.recording) return stopRec();
  TTS.stop(); if (L.player) { L.player.pause(); L.player = null; }
  if (!navigator.mediaDevices || !window.MediaRecorder) { toast("L'enregistrement n'est pas disponible dans ce navigateur"); return; }
  L.alts = []; L.srErr = null; L.res = null; L.st = null;
  // start recognition first, while we are still inside the tap
  if (SR) {
    try {
      const r = L.sr = new SR(); r.lang = "fr-FR"; r.interimResults = false; r.maxAlternatives = 5; r.continuous = false;
      r.onresult = e => { for (const res of e.results) if (res.isFinal || true) L.alts = Array.from(res).map(a => a.transcript); };
      r.onerror = e => { L.srErr = e.error; };
      r.onend = () => { L.srEnded = true; if (L.recording) setTimeout(() => { if (PR.cur === L && L.recording) stopRec(); }, 350); };
      L.srEnded = false; r.start();
    } catch (e) { L.srErr = "start"; }
  }
  try { L.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }); }
  catch (e) { toast("L'accès au micro a été refusé"); try { L.sr && L.sr.abort(); } catch (x) { } return; }
  L.chunks = []; L.mr = new MediaRecorder(L.stream);
  L.mr.ondataavailable = e => e.data.size && L.chunks.push(e.data);
  L.mr.start();
  try { const ac = prAC(); ac.resume && ac.resume(); const src = ac.createMediaStreamSource(L.stream); L.an = ac.createAnalyser(); L.an.fftSize = 1024; src.connect(L.an); } catch (e) { }
  L.recording = true; L.t0 = Date.now();
  const max = Math.max(6, prToks(L.text).length * .9 + 3) * 1000;
  L.timer = setTimeout(() => { if (PR.cur === L && L.recording) stopRec(); }, max);
  labRender();
};
function stopRec(silent) {
  const L = PR.cur; if (!L || !L.recording) return;
  L.recording = false; clearTimeout(L.timer); cancelAnimationFrame(meterRAF);
  try { L.sr && !L.srEnded && L.sr.stop(); } catch (e) { }
  if (silent) { try { L.mr.stop(); } catch (e) { } L.stream && L.stream.getTracks().forEach(t => t.stop()); return; }
  L.busy = true; labRender();
  L.mr.onstop = async () => {
    L.stream.getTracks().forEach(t => t.stop());
    const blob = new Blob(L.chunks, { type: L.mr.mimeType || "audio/webm" });
    if (L.uUrl) URL.revokeObjectURL(L.uUrl);
    L.uUrl = URL.createObjectURL(blob);
    try { L.uA = analyse(await decodeAB(await blob.arrayBuffer())); } catch (e) { L.uA = null; }
    // wait a moment for the last recognition result
    const t0 = Date.now(); while (SR && L.sr && !L.srEnded && Date.now() - t0 < 2500) await new Promise(r => setTimeout(r, 120));
    finishLab(L);
  };
  L.mr.stop();
}
function finishLab(L) {
  L.busy = false;
  if (L.alts && L.alts.length) {
    const tk = L.items.map(it => it.w);
    const best = L.alts.map(a => ({ a, ...prAlign(tk, a) })).sort((x, y) => y.score - x.score)[0];
    L.st = best.st; L.res = { score: best.score, heard: best.a };
    S.pron = S.pron || {}; const k = prKey(L.text); S.pron[k] = Math.max(S.pron[k] || 0, best.score); save();
  } else {
    L.st = null;
    L.res = { score: null, why: !SR ? "La reconnaissance vocale n'est pas disponible dans ce navigateur : comparez votre enregistrement avec le modèle, puis évaluez-vous." : L.srErr === "not-allowed" || L.srErr === "service-not-allowed" ? "La reconnaissance vocale a été refusée (Réglages de l'iPhone → Safari → Micro, et Dictée activée). Comparez votre enregistrement avec le modèle, puis évaluez-vous." : "Je n'ai pas pu reconnaître la phrase. Comparez votre enregistrement avec le modèle, puis évaluez-vous — ou réessayez plus près du micro." };
  }
  if (PR.cur === L) labRender();
}
A.prPlay = d => {
  const L = PR.cur; if (!L) return; TTS.stop(); if (L.player) { L.player.pause(); L.player = null; }
  const play = (w, next) => {
    if (w === "m" && !L.mUrl) { TTS.speak(L.text, { onend: next }); return; }
    const a = L.player = new Audio(w === "m" ? L.mUrl : L.uUrl); a.onended = () => next && setTimeout(next, 450); a.play().catch(() => { });
  };
  if (d.w === "mu") play("m", () => play("u")); else play(d.w);
};
A.prSelf = d => { const L = PR.cur; if (!L) return; toast(d.ok === "1" ? "Bravo !" : "On réessaie : écoutez le modèle mot par mot."); if (d.ok === "1" && L.list && L.i < L.list.length - 1) A.prNav({ d: 1 }); };
A.prDone = d => { const L = PR.cur; if (!L || !L.onDone) return; const cb = L.onDone; L.onDone = null; cb(d.ok === "1", L.res && L.res.heard || "", L.res && L.res.score); };
/* used by the speaking question in the lesson exercises */
function mountLab(sel, o) { openLab(Object.assign({ sel }, o)); }

/* ── practice tool: Prononciation ───────────────────────────────── */
V.pronList = c => {
  const lv = c.lv || S.level;
  const ls = LESSONS.filter(l => (lv === "cours" ? l.course : l.lvl === lv && !l.course));
  return {
    title: "Prononciation", sub: "Écouter, s'enregistrer, comparer",
    html: `<div class="card"><div style="font-weight:600">Comment ça marche</div><div class="small muted" style="margin-top:4px">Choisissez une leçon. Pour chaque phrase : écoutez le modèle, enregistrez-vous, puis comparez. Le score indique les mots bien reconnus ; les conseils en anglais expliquent les sons à travailler.</div></div>
      <div class="seg">${[...LV, "cours"].map(x => `<button aria-pressed="${x === lv}" data-a="subLv" data-lv="${x}">${x === "cours" ? "Mes cours" : x}</button>`).join("")}</div>
      ${group(ls.map(l => { const L = labList(l), done = L.filter(e => (S.pron || {})[prKey(e[0])] >= 85).length; return row("pronLesson", "🎙️", esc(l.t), `${L.length} phrases${done ? ` · ${done} réussies` : ""}`, "", `data-id="${l.id}"`, "t-red"); }))}`
  };
};
A.pronLesson = d => { const l = LESSON[d.id], list = labList(l); if (!list.length) return; openSheet(`<div class="qk">${esc(l.t)}</div><div id="labbox"></div>`); openLab({ text: list[0][0], en: list[0][1], lid: l.id, list, i: 0 }); };
