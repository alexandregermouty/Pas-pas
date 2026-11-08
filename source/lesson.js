/* ═══════════════════════════════════════════════════════════════════
   Pas à pas · la leçon complète
   Étapes : objectifs → document → règle (+ visuels) → exemples → erreurs
   fréquentes → vocabulaire → entraînement en 4 niveaux → production.
   ═══════════════════════════════════════════════════════════════════ */
const plain = t => String(t ?? "").replace(/<[^>]+>/g, "").replace(/\*/g, "");
const marked = t => esc(t).replace(/&lt;(\/?)b&gt;/g, "<$1b>").replace(/\*([^*]+)\*/g, "<mark>$1</mark>");
const markHtml = t => String(t ?? "").replace(/\*([^*]+)\*/g, "<mark>$1</mark>");

const NIV = [
  { n: 1, t: "Découvrir", d: "Reconnaître le vocabulaire et la règle", ic: "👀" },
  { n: 2, t: "S'exercer", d: "Appliquer la règle dans des phrases", ic: "✏️" },
  { n: 3, t: "Approfondir", d: "Corriger, construire, transformer", ic: "🧩" },
  { n: 4, t: "Produire", d: "Écouter, traduire, parler, écrire", ic: "🎯" }
];
function nivState(id) { return (S.niv || {})[id] || {}; }
function nivNext(l) { const s = nivState(l.id); return NIV.find(v => !s[v.n]) || null; }

/* ── visual blocks ─────────────────────────────────────────────── */
const VCOL = { b: "var(--blue2)", r: "var(--red)", g: "var(--gold)", v: "var(--ok)", n: "var(--dim)" };
function frise(v) {
  const W = 340, x = p => 18 + (W - 36) * p / 100, rows = (v.s || []).length;
  const top = 14, axisY = top + rows * 24 + 16;
  let svg = `<line x1="10" y1="${axisY}" x2="${W - 6}" y2="${axisY}" stroke="var(--line2)" stroke-width="2"/><path d="M${W - 12} ${axisY - 5} L${W - 4} ${axisY} L${W - 12} ${axisY + 5}" fill="none" stroke="var(--line2)" stroke-width="2"/>`;
  (v.s || []).forEach(([lab, a, b, c], i) => { const y = top + i * 24; const col = VCOL[c || "b"];
    svg += `<rect x="${x(a)}" y="${y + 8}" width="${Math.max(6, x(b) - x(a))}" height="9" rx="4.5" fill="${col}" opacity=".9"/><text x="${x(a)}" y="${y + 4}" font-size="11.5" fill="var(--ink)" font-weight="600">${esc(lab)}</text>`; });
  (v.p || []).forEach(([lab, a, c], i) => { const col = VCOL[c || "r"];
    svg += `<line x1="${x(a)}" y1="${top}" x2="${x(a)}" y2="${axisY}" stroke="${col}" stroke-width="1.5" stroke-dasharray="3 3"/><circle cx="${x(a)}" cy="${axisY}" r="6" fill="${col}"/><text x="${x(a)}" y="${axisY + 21 + (i % 2) * 13}" font-size="11.5" text-anchor="middle" fill="${col}" font-weight="700">${esc(lab)}</text>`; });
  if (v.now != null) svg += `<rect x="${x(v.now) - 1}" y="${axisY - 10}" width="2" height="20" fill="var(--ink)"/><text x="${x(v.now)}" y="${axisY - 14}" font-size="10.5" text-anchor="middle" fill="var(--dim)" font-weight="700">MAINTENANT</text>`;
  const H = axisY + 21 + ((v.p || []).length > 1 ? 16 : 4);
  return `<svg class="frise" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(v.t || "frise")}">${svg}</svg>`;
}
function visual(v) {
  const head = v.t ? `<div class="vis-t">${esc(v.t)}</div>` : "";
  if (v.k === "f") return `<div class="vis">${head}<div class="formula">${v.c.map(([t, c], i) => `${i ? `<span class="plus">+</span>` : ""}<span class="fchip ${c || ""}">${esc(t)}</span>`).join("")}</div>${v.ex ? `<div class="vis-ex">${marked(v.ex)}</div>` : ""}</div>`;
  if (v.k === "tab") return `<div class="vis">${head}<div class="tabwrap"><table class="vtab"><thead><tr>${v.h.map(h => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${v.r.map(r => `<tr>${r.map(c => `<td>${marked(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div></div>`;
  if (v.k === "frise") return `<div class="vis">${head}${frise(v)}${v.ex ? `<div class="vis-ex">${marked(v.ex)}</div>` : ""}</div>`;
  if (v.k === "cmp") return `<div class="vis">${head}<div class="cmp">${[v.a, v.b].map((s, i) => `<div class="cmp-c ${i ? "r" : "b"}"><div class="cmp-h">${esc(s[0])}</div>${s[1].map(x => `<div class="cmp-i">${marked(x)}</div>`).join("")}</div>`).join("")}</div></div>`;
  if (v.k === "sch") return `<div class="vis">${head}<div class="sch">${v.s.map((x, i) => `${i ? `<span class="arr">→</span>` : ""}<span class="sch-i">${marked(x)}</span>`).join("")}</div>${v.ex ? `<div class="vis-ex">${marked(v.ex)}</div>` : ""}</div>`;
  return "";
}

/* ── the lesson page ───────────────────────────────────────────── */
const stepH = (n, t, s) => `<div class="lstep"><span class="n">${n}</span><div><b>${esc(t)}</b>${s ? `<span>${esc(s)}</span>` : ""}</div></div>`;
V.lesson = c => {
  const l = LESSON[c.id]; if (!l) return { html: "Leçon introuvable" };
  const s = lessonState(l.id), ns = nivState(l.id), R = l.rule || {}, F = l.rfr || {};
  const C = l.course && COURSES.find(x => x.id === l.course);
  const lvc = C ? l.course : l.lvl;
  const reads = READINGS.filter(x => (x.lessons || []).includes(l.id));
  const exBtn = e => `<div class="exrow"><button class="ex" data-a="say" data-t="${esc(plain(e[0]))}"><span class="spk">${IC.spk}</span><span><span class="fr">${marked(e[0])}</span>${e[1] ? `<span class="en">${esc(e[1])}</span>` : ""}</span></button><button class="exmic" data-a="pron" data-t="${esc(plain(e[0]))}" data-en="${esc(e[1] || "")}" data-lid="${l.id}" aria-label="Prononcer">${IC.mic}</button></div>`;
  const X = EN[l.id] || {}, enOn = S.set.en !== false;
  const links = (l.links || []).filter(id => LESSON[id]);
  const nx = nivNext(l); let k = 0; const N = () => ++k;
  const done = NIV.filter(v => ns[v.n]).length;
  const path = `<div class="nivpath">${NIV.map(v => { const st = ns[v.n]; return `<button class="niv ${st ? "ok" : ""} ${nx && nx.n === v.n ? "cur" : ""}" data-a="startNiv" data-id="${l.id}" data-n="${v.n}">
      <span class="dot">${st ? "✓" : v.n}</span><span class="tx"><b>Niveau ${v.n} · ${v.t}</b><span>${v.d} · ${lessonQueue(l, "n" + v.n).length} questions</span></span><span class="st">${st ? stars(st) : v.ic}</span></button>`; }).join("")}</div>`;
  const pts = F.p || [], epts = R.pts || [];
  const nats = l.nat || [];
  const r = S.resume[l.id];
  return {
    title: C ? C.short : l.lvl, sub: C ? (C.units.find(u => u.id === l.unit) || {}).t : trackOf(l).t,
    html: `<div class="lhead lv-${lvc}"><div class="k">${C ? esc(l.src) : l.lvl + " · " + esc(trackOf(l).t)}</div><h3>${esc(l.t)}</h3><p>${esc(l.st || l.en)}</p>${l.st ? `<p class="lh-en">${esc(l.en)}</p>` : ""}
      <div class="lh-prog"><i style="width:${25 * done}%"></i></div><div class="lh-meta">${done}/4 niveaux${s.best ? ` · meilleur score ${s.best} %` : ""}</div></div>
    ${r ? `<button class="btn primary block" data-a="startLesson" data-id="${l.id}" data-resume="1" style="margin:4px 0 6px">Reprendre · question ${r.i + 1}/${r.qs.length}</button>`
      : `<button class="btn primary block" data-a="startNiv" data-id="${l.id}" data-n="${(nx || NIV[0]).n}" style="margin:4px 0 6px">${nx ? `${nx.n === 1 ? "Commencer" : "Continuer"} · Niveau ${nx.n} ${nx.t}` : "Refaire le niveau 1"}</button>`}

    ${(l.obj || l.task) ? stepH(N(), "Objectifs", "Ce que vous saurez faire") + `<div class="card">
      ${l.task ? `<div class="qk" style="color:var(--${l.course === "oe2" ? "oe" : "cosmo"})">${l.course === "oe2" ? "Tâche visée" : "Tâche finale"}</div><div style="font-weight:600;font-size:16.5px;margin-bottom:8px">${esc(l.task)}</div>` : ""}
      ${l.obj ? `<ul class="obj">${l.obj.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
      ${l.gram ? `<div class="muted small" style="margin-top:10px">Grammaire du manuel</div><div class="kv">${l.gram.map(g => `<span class="chip">${esc(g)}</span>`).join("")}</div>` : ""}</div>` : ""}

    ${l.doc ? stepH(N(), "Le document", "Lisez et écoutez, puis répondez") + `<div class="card doc">
      <div class="row between"><span class="chip sm">${esc(l.doc.k || "Texte")}</span><span class="row" style="gap:6px">${X.tr ? `<button class="btn sm ghost" data-a="docEn">EN</button>` : ""}<button class="btn sm" data-a="docPlay" data-id="${l.id}">${IC.play} Écouter</button></span></div>
      <h4 class="doc-t">${esc(l.doc.t)}</h4>
      ${l.doc.d.map((p, i) => (Array.isArray(p) ? `<p class="dl"><b>${esc(p[0])} :</b> ${marked(p[1])}</p>` : `<p>${marked(p)}</p>`) + (X.tr && X.tr[i] ? `<p class="dtr">${esc(X.tr[i])}</p>` : "")).join("")}
      ${X.tr ? `<div class="muted tiny">Touchez <b>EN</b> pour afficher la traduction anglaise sous chaque paragraphe.</div>` : ""}
      <div class="muted tiny">Les mots en <mark>surligné</mark> illustrent le point de grammaire.</div></div>
      ${l.doc.q ? `<div class="card"><div class="qk">Avez-vous compris ?</div><div id="docq">${quizForm("doc", docQs(l))}<div id="qres"></div></div></div>` : ""}` : ""}

    ${(F.h || R.h) ? stepH(N(), "La règle", "Comprendre le fonctionnement") + `<div class="card rulecard${enOn ? " en-on" : ""}" id="rc">
      <div class="row between" style="align-items:flex-start;gap:10px"><div class="rule-h">${markHtml(F.h || R.h)}</div>${F.h && R.h ? `<button class="btn sm ghost enbtn" data-a="enToggle">EN</button>` : ""}</div>
      ${F.h && R.h ? `<div class="engl rule-en">${R.h}</div>` : ""}
      ${(F.h ? pts : epts).length ? `<ul class="pts">${(F.h ? pts : epts).map((p, i) => `<li>${markHtml(p)}${F.h && epts[i] ? `<div class="engl">${epts[i]}</div>` : ""}</li>`).join("")}</ul>` : ""}
      ${(l.vis || []).map(visual).join("")}
      ${(F.w || R.warn) ? `<div class="callout warn"><span class="k">Attention</span>${markHtml(F.w || R.warn)}${F.w && R.warn ? `<div class="engl">${R.warn}</div>` : ""}</div>` : ""}
      </div>` : ""}
    ${X.s ? stepH(N(), "Explained in English", "The whole rule, step by step") + `<div class="card xlesson"><div class="xen-h"><span class="flag">EN</span>In depth</div>${X.s.map(secHtml).join("")}</div>` : ""}

    ${l.sons ? `<div class="card"><div class="qk" style="color:var(--blue)">Sons et intonation</div><div style="font-weight:600">${esc(l.sons.t)}</div><div class="small muted" style="margin:4px 0 8px">${l.sons.tip}</div>${l.sons.ex.map(e => exBtn([e, ""])).join("")}</div>` : ""}
    ${l.repere ? `<div class="callout info"><span class="k">Repère professionnel</span>${l.repere}</div>` : ""}

    ${(R.ex || []).length ? stepH(N(), "Exemples", "Touchez pour écouter") + `<div class="card" style="padding:6px 16px">${R.ex.map(exBtn).join("")}</div>` : ""}

    ${nats.length ? stepH(N(), "Erreurs fréquentes", "À éviter") + `<div class="card errs">${nats.map(n => `<div class="err"><div class="bad">✗ ${esc(n[1])}</div><div class="good">✓ ${esc(n[0])}</div><div class="why small muted">${esc(n[2] || "")}</div></div>`).join("")}</div>` : ""}

    ${stepH(N(), "Vocabulaire", `${(l.cards || []).length} mots et expressions`)}
    <div class="card voc">${(l.cards || []).map(cd => `<button class="vw" data-a="say" data-t="${esc(cd[0])}"><b>${esc(cd[0])}</b><span>${esc(cd[1])}</span></button>`).join("")}
      <button class="btn block" data-a="go" data-v="cards" data-id="${l.id}" style="margin-top:12px">🃏 Réviser avec les cartes</button></div>

    ${stepH(N(), "S'entraîner", "Quatre niveaux, du plus simple au plus exigeant")}
    ${path}
    ${l.prod ? `<div class="card prodcard"><div class="qk">Production écrite · niveau 4</div><div style="font-weight:600">${esc(l.prod.c)}</div><div class="muted small" style="margin-top:4px">${l.prod.n[0]} à ${l.prod.n[1]} mots · un modèle de réponse vous sera proposé</div></div>` : ""}

    ${links.length ? sec("Pour aller plus loin", "Leçons de grammaire liées") + group(links.map(id => row("go", "📘", esc(LESSON[id].t), LESSON[id].lvl + " · " + esc(LESSON[id].st || LESSON[id].en), lessonState(id).done ? "✓" : "", `data-v="lesson" data-id="${id}"`, "t-blue"))) : ""}
    ${sec(C ? "Phrases utiles" : "Phrases à écouter", "Touchez pour écouter")}
    <div class="card" style="padding:6px 16px">${(l.sent || []).slice(0, 8).map(exBtn).join("")}
      ${(l.sent || []).length > 8 ? `<details class="more" style="padding-bottom:10px"><summary>${l.sent.length - 8} de plus</summary>${l.sent.slice(8).map(exBtn).join("")}</details>` : ""}</div>
    ${reads.length ? sec("Lire en contexte") + group(reads.map(x => row("go", "📖", esc(x.t), `${x.lvl} · ${x.kind || "texte"}`, "", `data-v="read" data-id="${x.id}"`, "t-green"))) : ""}`,
    after: () => { AUD.prefetch("L-" + l.id); if (l.doc && l.doc.q) QF = { id: "doc", qs: docQs(l), onScore: () => {} }; }
  };
};
A.enToggle = () => { const rc = $("#rc"); if (rc) { rc.classList.toggle("en-on"); S.set.en = rc.classList.contains("en-on"); save(); } };
A.docEn = (d, el) => { const c = el.closest(".doc"); if (c) { c.classList.toggle("tr-on"); el.classList.toggle("on"); } };
const docQs = l => l.doc.q.map(q => [q[0], q[1], q[2], q[3] || "", undefined, typeof docQEn === "function" ? docQEn(l, q) : ""]);
A.docPlay = d => {
  const l = LESSON[d.id]; if (!l || !l.doc) return;
  TTS.play(l.doc.d.map(p => Array.isArray(p) ? [p[0], plain(p[1])] : ["", plain(p)]));
};
A.startNiv = d => {
  const l = LESSON[d.id], n = +d.n;
  delete S.resume[l.id];
  startSession({ kind: "lesson", lid: l.id, mode: "n" + n, qs: lessonQueue(l, "n" + n), title: `${l.t} · niveau ${n}`, onDone: (sc, st) => lessonDone(l, sc, st, "n" + n) });
};
