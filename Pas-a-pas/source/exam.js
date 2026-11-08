/* ═══════════════════════════════════════════════════════════════════
   Pas à pas · DELF B1 / DELF B2 / DALF C1 module
   ═══════════════════════════════════════════════════════════════════ */
V.exam = c => {
  const lv = c.lv || S.set.examLevel || S.level; const E = EXAMS[lv];
  const co = LISTENINGS.filter(x => x.lvl === lv && x.exam), ce = READINGS.filter(x => x.lvl === lv && x.exam);
  const done = k => S.exam[lv + ":" + k];
  const mark = k => { const d = done(k); return d ? (d.max ? `${d.got}/${d.max}` : "✓") : ""; };
  return {
    title: "Examen", sub: E.name,
    html: `<div class="seg">${LV.map(x => `<button aria-pressed="${x === lv}" data-a="subLv" data-lv="${x}">${EXAMS[x].name.replace("DELF ", "").replace("DALF ", "")}</button>`).join("")}</div>
    <div class="lhead lv-${lv}"><div class="k">${esc(E.full)}</div><h3>${esc(E.name)}</h3><p>${esc(E.who)}</p></div>
    <div class="card"><table class="fmt"><tr><th>Paper</th><th>Time</th><th>Score</th></tr>
      ${E.papers.map(p => `<tr><td><b>${esc(p.t)}</b><div class="muted small">${esc(p.what)}</div></td><td style="white-space:nowrap">${esc(p.dur)}</td><td>/25</td></tr>`).join("")}</table>
      <div class="callout warn"><span class="k">To pass</span>${esc(E.pass)}</div>
      <div class="muted tiny">Source: ${E.src.map(s => `<a href="${s[1]}" target="_blank" rel="noopener">${esc(s[0])}</a>`).join(" · ")}</div></div>
    ${["CO", "CE", "PE", "PO"].map(k => {
      const P = E.papers.find(p => p.k === k);
      let items = "";
      if (k === "CO") items = co.map(x => row("go", "🎧", esc(x.t), esc(x.kind), mark(x.id), `data-v="listen" data-id="${x.id}" data-exam="1"`)).join("");
      if (k === "CE") items = ce.map(x => row("go", "📖", esc(x.t), esc(x.kind), mark(x.id), `data-v="examRead" data-id="${x.id}"`)).join("");
      if (k === "PE") items = E.pe.map(x => row("go", "📝", esc(x.t), `${esc(x.type)} · ${x.min} words min · ${x.minutes} min`, mark(x.id), `data-v="examWrite" data-lv="${lv}" data-id="${x.id}"`)).join("");
      if (k === "PO") items = E.po.map(x => row("go", "🎙️", esc(x.t), esc(x.sub), mark(x.id), `data-v="examSpeak" data-lv="${lv}" data-id="${x.id}"`)).join("");
      return `<h3 class="sec">${esc(P.t)}</h3>
      <details class="more card flat"><summary>Method and tips</summary><ul class="pts small">${E.tips[k].map(t => `<li>${esc(t)}</li>`).join("")}</ul></details>${items}`;
    }).join("")}
    <h3 class="sec">Useful at ${lv}</h3>${row("go", "📚", "Lessons of this level", esc(LEVELS[lv].name), "", `data-v="learn" data-lv="${lv}"`)}`
  };
};

/* reading paper in exam conditions */
V.examRead = c => {
  const r = READINGS.find(x => x.id === c.id); const E = EXAMS[r.lvl];
  QF = { id: r.id, qs: r.q, cat: "lecture", onScore: (g, m, sc) => { bestSet("r:" + r.id, sc); S.exam[r.lvl + ":" + r.id] = { got: g, max: m, date: Date.now() }; save(); } };
  return {
    title: E.name, sub: "Compréhension des écrits",
    html: `<h2 class="pg">${esc(r.t)}</h2><p class="pg-sub">${esc(r.intro || "Read the document, then answer.")}</p>
    ${timerHtml((r.mins || 20) * 60, `Suggested time · ${r.mins || 20} min`)}
    <div class="card reading">${r.paras.map(p => `<p>${esc(p)}</p>`).join("")}${r.src ? `<div class="muted tiny">${esc(r.src)}</div>` : ""}</div>
    <h3 class="sec">Questions</h3>${quizForm(r.id, r.q)}<div id="qres"></div>`
  };
};

/* writing paper */
V.examWrite = c => {
  const E = EXAMS[c.lv]; const t = E.pe.find(x => x.id === c.id); const key = c.lv + ":" + t.id;
  const draft = S.drafts[key] || ""; const draft2 = S.drafts[key + ":2"] || "";
  const area = (k, val, min, label, max) => `<div class="card flat"><div class="row between"><b>${esc(label)}</b><span class="wc" id="wc-${k}">${countWords(val)} words</span></div><textarea class="inp" rows="12" data-c="draft" data-k="${k}" data-min="${min}" data-max="${max || ""}" spellcheck="true" lang="fr" placeholder="Écrivez ici…">${esc(val)}</textarea></div>`;
  return {
    title: E.name, sub: "Production écrite",
    html: `<h2 class="pg">${esc(t.t)}</h2><p class="pg-sub">${esc(t.type)} · ${t.min} words minimum${t.max ? ", " + t.max + " maximum" : ""} · ${t.minutes} min</p>
    ${t.docs ? t.docs.map(d => `<div class="card reading"><div class="muted small" style="margin-bottom:6px">${esc(d.src || "")}</div><h4>${esc(d.t)}</h4>${d.text.map(p => `<p>${esc(p)}</p>`).join("")}</div>`).join("") : ""}
    <div class="card"><div class="qk">Consigne</div>${t.prompt.map(p => `<p style="margin:6px 0">${esc(p)}</p>`).join("")}</div>
    ${timerHtml(t.minutes * 60, "Exam time")}
    <details class="more card flat"><summary>Suggested plan</summary><ol class="pts small">${t.plan.map(p => `<li>${esc(p)}</li>`).join("")}</ol></details>
    <details class="more card flat"><summary>Useful phrases</summary><ul class="pts small">${t.phrases.map(p => `<li>${esc(p)}</li>`).join("")}</ul></details>
    ${t.part2 ? area(key, draft, t.min, "Part 1 · " + t.part1, t.max) + `<div class="card"><div class="qk">Part 2 · Essai argumenté</div><p>${esc(t.part2)}</p><div class="muted small">${t.min2} words minimum</div></div>` + area(key + ":2", draft2, t.min2, "Part 2 · essay") : area(key, draft, t.min, "Your text")}
    <div class="card flat"><b>Check against the exam criteria</b><p class="small muted" style="margin:4px 0">Based on the DELF/DALF evaluation grid. Tick what is true of your text.</p>
      ${E.grid.PE.map((g, i) => `<label class="chk"><input type="checkbox" data-c="gridTick"><span>${esc(g)}</span></label>`).join("")}
      <button class="btn sm" data-a="peDone" data-k="${key}" style="margin-top:10px">Save this attempt</button></div>`
  };
};
CHANGE.draft = el => {
  S.drafts[el.dataset.k] = el.value; save();
  const n = countWords(el.value), min = +el.dataset.min; const w = $("#wc-" + CSS.escape(el.dataset.k));
  const max = +el.dataset.max || 0, over = max && n > max;
  if (w) { w.textContent = n + " words" + (n < min ? ` · ${min - n} to go` : over ? ` · ${n - max} over the limit` : ""); w.classList.toggle("okc", n >= min && !over); w.style.color = over ? "var(--bad)" : ""; }
};
CHANGE.gridTick = () => { };
A.peDone = d => { const n = $$('[data-c="gridTick"]').filter(x => x.checked).length, m = $$('[data-c="gridTick"]').length; S.exam[d.k] = { got: n, max: m, date: Date.now() }; planMark("prac"); logAnswer(5); save(); toast(`Saved · ${n}/${m} criteria met`); };

/* speaking paper */
V.examSpeak = c => {
  const E = EXAMS[c.lv]; const t = E.po.find(x => x.id === c.id); const key = c.lv + ":" + t.id;
  const sec = s => `<h3 class="sec">${esc(s)}</h3>`;
  let body = "";
  if (t.kind === "entretien") {
    body = `<div class="card"><p>${esc(t.intro)}</p></div>${timerHtml(t.speak * 60, "Speaking time")}
    ${t.items.map((q, i) => `<button class="ex" data-a="say" data-t="${esc(q)}"><span class="spk">${IC.spk}</span><span><span class="fr">${esc(q)}</span></span></button>`).join("")}
    <button class="btn block" data-a="examinerAsk" data-lv="${c.lv}" data-id="${t.id}" style="margin-top:12px">Examiner: ask me a random question</button>`;
  } else if (t.kind === "roleplay") {
    body = t.items.map((r, i) => `<div class="card"><div class="qk">Sujet ${i + 1}</div><b>${esc(r.t)}</b><p style="margin:6px 0">${esc(r.sit)}</p><div class="muted small">The examiner plays: ${esc(r.ex)}</div>
      <details class="more"><summary>Examiner's lines</summary>${r.lines.map(l => `<button class="ex" data-a="say" data-t="${esc(l)}"><span class="spk">${IC.spk}</span><span class="fr">${esc(l)}</span></button>`).join("")}</details>
      <details class="more"><summary>Useful phrases</summary><ul class="pts small">${r.phrases.map(p => `<li>${esc(p)}</li>`).join("")}</ul></details></div>`).join("") + timerHtml(t.speak * 60, "Role-play time");
  } else if (t.kind === "document") {
    const i = clamp(+(c.n || 0), 0, t.items.length - 1); const d = t.items[i];
    body = `<div class="row">${t.items.map((x, j) => `<button class="chip" aria-pressed="${j === i}" data-a="poDoc" data-n="${j}">Doc ${j + 1}</button>`).join("")}</div>
    <div class="card reading"><div class="muted small">${esc(d.src || "")}</div><h4>${esc(d.t)}</h4>${d.text.map(p => `<p>${esc(p)}</p>`).join("")}</div>
    ${d.task ? `<div class="card"><div class="qk">Consigne</div><p style="margin:0">${esc(d.task)}</p></div>` : ""}
    ${timerHtml(t.prep * 60, `Preparation · ${t.prep} min`)}
    <details class="more card flat"><summary>Suggested plan</summary><ol class="pts small">${t.plan.map(p => `<li>${esc(p)}</li>`).join("")}</ol></details>
    ${sec("Then speak")}<div class="muted small">${esc(t.speakNote)}</div>${recHtml(key + ":" + i)}
    ${sec("The examiner's questions")}${d.q.map(q => `<button class="ex" data-a="say" data-t="${esc(q)}"><span class="spk">${IC.spk}</span><span class="fr">${esc(q)}</span></button>`).join("")}`;
  } else if (t.kind === "dossier") {
    const i = clamp(+(c.n || 0), 0, t.items.length - 1); const d = t.items[i];
    body = `<div class="row">${t.items.map((x, j) => `<button class="chip" aria-pressed="${j === i}" data-a="poDoc" data-n="${j}">Dossier ${j + 1}</button>`).join("")}</div>
    <div class="card"><div class="qk">Thème</div><b style="font-size:17px">${esc(d.t)}</b></div>
    ${d.docs.map((x, j) => `<div class="card reading"><div class="muted small">Document ${j + 1} · ${esc(x.src || "")}</div><h4>${esc(x.t)}</h4>${x.text.map(p => `<p>${esc(p)}</p>`).join("")}</div>`).join("")}
    <div class="card"><div class="qk">Consigne</div><p style="margin:0">${esc(t.task)}</p></div>
    ${timerHtml(t.prep * 60, `Preparation · ${t.prep} min`)}
    <details class="more card flat"><summary>Possible problématique and plan</summary><p class="small"><b>${esc(d.prob)}</b></p><ol class="pts small">${d.plan.map(p => `<li>${esc(p)}</li>`).join("")}</ol></details>
    ${sec("Exposé")}<div class="muted small">${esc(t.speakNote)}</div>${recHtml(key + ":" + i)}
    ${sec("Discussion with the jury")}${d.q.map(q => `<button class="ex" data-a="say" data-t="${esc(q)}"><span class="spk">${IC.spk}</span><span class="fr">${esc(q)}</span></button>`).join("")}`;
  }
  return {
    title: E.name, sub: "Production orale",
    html: `<h2 class="pg">${esc(t.t)}</h2><p class="pg-sub">${esc(t.sub)}</p>${body}
    <div class="card flat"><b>Check against the exam criteria</b>${E.grid.PO.map(g => `<label class="chk"><input type="checkbox" data-c="gridTick"><span>${esc(g)}</span></label>`).join("")}
      <button class="btn sm" data-a="peDone" data-k="${key}" style="margin-top:10px">Save this attempt</button></div>`
  };
};
A.poDoc = d => { cur().n = d.n; render(); };
A.examinerAsk = d => { const t = EXAMS[d.lv].po.find(x => x.id === d.id); say(pick(t.items, 1)[0]); };
