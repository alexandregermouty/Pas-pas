/* Run inside the built app: returns every spoken string with voice and pack. */
(() => {
  const out = []; const add = (text, pack, m) => { if (!text) return; text = ttsNorm(text); if (!text || !/[a-zà-ÿ]/i.test(text)) return; out.push({ t: text, p: pack, m: m ? 1 : 0 }); };
  LESSONS.forEach(l => {
    const P = "L-" + l.id;
    (l.rule && l.rule.ex || []).forEach(e => add(e[0], P));
    lessonCards(l).forEach(c => { add(c.fr, P); add(c.exfr, P); });
    (l.sent || []).forEach(s => add(s[0], P));
    (l.nat || []).forEach(x => add(x[0], P));
    (l.mcq || []).forEach((x, i) => { const q = Q.mcq(l, x, "k"); add(q.hear, P); });
    (l.gap || []).forEach(x => { const q = Q.gapT(l, x, "k"); add(q.hear, P); });
    (l.fix || []).forEach(x => { const q = Q.fix(l, x, "k"); add(q.hear, P); });
    (l.xf || []).forEach(x => add(x[2].split("|")[0], P));
    (l.chat || []).forEach(x => { add(x[0], P); add(x[1], P); });
    (l.phr || []).forEach(x => add(x[0], P));
    [].concat(l.sons || []).forEach(x => (x.ex || []).forEach(e => add(Array.isArray(e) ? e[0] : e, P)));
  });
  IDIOMS.forEach(x => { add(x[0], "practice"); add(x[2], "practice"); });
  CONNECTORS.forEach(c => add(c[3], "practice"));
  REGISTERS.forEach(r => { add(r[0], "practice"); add(r[1], "practice"); add(r[2], "practice"); });
  FAUXAMIS.forEach(f => { add(f[3].split(",")[0], "practice"); add(f[4], "practice"); });
  SPEAK_TOPICS.forEach(t => add(t.q, "practice"));
  ["Bonjour Lan Anh ! On révise un peu de français aujourd'hui ?", "Voilà ma voix."].forEach(t => add(t, "practice"));
  READINGS.forEach(r => r.paras.forEach(p => add(p, "R-" + r.id)));
  LISTENINGS.forEach(r => r.lines.forEach(l => { add(l[1], "A-" + r.id, MALE.has(l[0])); }));
  ["B1", "B2", "C1"].forEach(lv => (EXAMS[lv].po || []).forEach(t => {
    const P = "X-" + lv;
    if (t.kind === "entretien") t.items.forEach(q => add(q, P));
    if (t.kind === "roleplay") t.items.forEach(r => r.lines.forEach(q => add(q, P)));
    if (t.kind === "document") t.items.forEach(d => d.q.forEach(q => add(q, P)));
    if (t.kind === "dossier") t.items.forEach(d => d.q.forEach(q => add(q, P)));
  }));
  if (typeof COURSES !== "undefined") COURSES.forEach(c => (c.extra || []).forEach(x => add(x, "C-" + c.id)));
  const seen = new Set(); const uniq = out.filter(o => { const k = o.m + "|" + o.t; if (seen.has(k)) return false; seen.add(k); return true; });
  uniq.forEach(o => o.k = fnv((o.m ? "m" : "f") + "|" + o.t));
  return uniq;
})()
