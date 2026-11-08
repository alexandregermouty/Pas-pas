/* ═══════════════════════════════════════════════════════════════════
   Pas à pas · boot — events, navigation, service worker
   ═══════════════════════════════════════════════════════════════════ */
CAT_LABEL.lecture = "Reading";
function boot() {
  load(); applyTheme();
  matchMedia("(prefers-color-scheme: light)").addEventListener?.("change", applyTheme);
  $("#nav").innerHTML = TABS.map(t => `<button role="tab" data-tab="${t.id}" aria-label="${esc(t.en)}">${t.ic}<span>${esc(t.fr)}</span></button>`).join("");
  $("#backBtn").innerHTML = IC.back;
  document.addEventListener("click", e => {
    const navB = e.target.closest("#nav button"); if (navB) { if (SS) A.quitSession(); closeSheet(); tab(navB.dataset.tab); return; }
    if (e.target.closest("#backBtn")) { back(); return; }
    if (e.target.id === "scrim") { closeSheet(); return; }
    const el = e.target.closest("[data-a]"); if (!el) return;
    if (el.tagName === "INPUT" && el.type === "checkbox") return;
    const fn = A[el.dataset.a]; if (!fn) return;
    e.preventDefault(); fn(Object.assign({}, el.dataset), el, e);
  });
  document.addEventListener("change", e => { const el = e.target.closest("[data-c]"); if (el && CHANGE[el.dataset.c]) CHANGE[el.dataset.c](el); const a = e.target.closest('input[type=checkbox][data-a]'); if (a && A[a.dataset.a]) A[a.dataset.a](Object.assign({}, a.dataset), a); });
  document.addEventListener("input", e => { const el = e.target.closest('[data-c="draft"]'); if (el) CHANGE.draft(el); });
  /* phone back gesture: one armed history entry, re-armed after each in-app back */
  history.replaceState({ root: 1 }, ""); history.pushState({ armed: 1 }, "");
  addEventListener("popstate", () => { if (back()) history.pushState({ armed: 1 }, ""); });
  addEventListener("pagehide", () => { if (SS) saveResume(); saveNow(); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) { if (SS) saveResume(); saveNow(); } });
  render();
  setTimeout(() => $("#splash").classList.add("off"), 250);
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => { });
}
boot();
