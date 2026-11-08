/* Contenu enrichi des leçons : P(id, {...}) complète une leçon existante.
   st : sous-titre · obj : objectifs · r : règle en français {h, p[], w}
   v : visuels (f formule, tab tableau, frise, cmp comparaison, sch schéma)
   doc : document {k, t, d[], q[[question, réponse, [leurres], explication]]}
   g / x / f / m : exercices supplémentaires (trous, transformations, erreurs, QCM)
   prod : production écrite {c consigne, n [min, max], m modèle, k critères} */
function P(id, o) {
  const l = LESSONS.find(x => x.id === id); if (!l) { console.warn("P: leçon inconnue", id); return; }
  if (o.st) l.st = o.st; if (o.obj) l.obj = o.obj;
  if (o.r) l.rfr = o.r; if (o.v) l.vis = o.v; if (o.doc) l.doc = o.doc; if (o.prod) l.prod = o.prod;
  if (o.g) l.gap = (l.gap || []).concat(o.g);
  if (o.x) l.xf = (l.xf || []).concat(o.x);
  if (o.f) l.fix = (l.fix || []).concat(o.f);
  if (o.m) l.mcq = (l.mcq || []).concat(o.m);
}
