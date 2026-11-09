/* HiAmanda.dev — Instructor View. Stays in sync with the workspace in another window. */
(function () {
  "use strict";
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const PROJECTS = window.PROJECTS;
  const byId = id => PROJECTS.find(p => p.id === id);
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  let P = null, view = 0, follow = true, live = { project: null, step: 0 };
  let scale = store.get("hi.it.scale", 1);

  /* ---------- tiny syntax highlighter for Python and SQL */
  const PY_KW = new Set("import from as def return for in if else elif while with not and or is None True False lambda try except finally raise class pass break continue global".split(" "));
  const SQL_KW = new Set("SELECT FROM WHERE GROUP BY ORDER LIMIT AS AND OR NOT NULL IS JOIN LEFT ON INSERT INTO VALUES CREATE TABLE PRIMARY KEY FOREIGN REFERENCES INTEGER TEXT REAL DESC ASC COUNT SUM ROUND AVG MIN MAX DISTINCT HAVING IN".split(" "));
  function highlight(code, lang) {
    const out = [];
    const re = lang === "sql"
      ? /(--[^\n]*)|('(?:[^']|'')*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z_0-9]*)(?=\s*\()|([A-Za-z_][A-Za-z_0-9]*)|(\s+|.)/g
      : /(#[^\n]*)|(f?"(?:\\.|[^"\\])*"|f?'(?:\\.|[^'\\])*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z_0-9]*)(?=\s*\()|([A-Za-z_][A-Za-z_0-9]*)|(\s+|.)/g;
    let m;
    while ((m = re.exec(code))) {
      const [all, com, str, num, fn, word] = m;
      if (com) out.push(`<span class="tok-com">${esc(com)}</span>`);
      else if (str) out.push(`<span class="tok-str">${esc(str)}</span>`);
      else if (num) out.push(`<span class="tok-num">${esc(num)}</span>`);
      else if (fn) out.push((lang === "sql" ? SQL_KW.has(fn.toUpperCase()) : PY_KW.has(fn)) ? `<span class="tok-kw">${esc(fn)}</span>` : `<span class="tok-fn">${esc(fn)}</span>`);
      else if (word) out.push((lang === "sql" ? SQL_KW.has(word.toUpperCase()) : PY_KW.has(word)) ? `<span class="tok-kw">${esc(word)}</span>` : esc(word));
      else out.push(esc(all));
    }
    return out.join("").split("\n").map(l => `<span class="ln">${l || " "}</span>`).join("");
  }
  const paras = t => t.split(/\n\s*\n/).map(p => `<p>${esc(p.replace(/\s*\n\s*/g, " "))}</p>`).join("");

  function toast(text) {
    const t = $("#toast"); t.textContent = text; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 1800);
  }

  /* ---------- rendering */
  function renderSelect() {
    $("#project-select").innerHTML = `<option value="">Choose a project…</option>` +
      PROJECTS.map(p => `<option value="${p.id}" ${P && P.id === p.id ? "selected" : ""}>${esc(p.title)}</option>`).join("");
  }

  function renderRail() {
    if (!P) { $("#rail").innerHTML = ""; return; }
    const n = P.steps.length;
    const item = (i, num, title) => `<button class="rail-item ${view === i ? "is-active" : ""} ${live.project === P.id && live.step === i ? "is-live" : ""}" data-view="${i}"><span class="rail-num">${num}</span><span>${esc(title)}</span></button>`;
    $("#rail").innerHTML = item(0, "▶", "Before you start") + `<div class="rail-gap"></div>` +
      P.steps.map((s, i) => item(i + 1, i + 1, s.title)).join("") + `<div class="rail-gap"></div>` + item(n + 1, "✓", "Wrap-up");
    const a = $("#rail .is-active"); if (a) a.scrollIntoView({ block: "nearest" });
  }

  function renderMain(flash) {
    const main = $("#main");
    if (!P) {
      main.innerHTML = `<div class="it-empty"><span class="mark" style="display:inline-block;width:40px;height:40px"></span>
        <h1>Waiting for a project</h1>
        <p>Open a project in the HiAmanda.dev window and this screen will follow along, step by step. You can also pick one from the menu above.</p>
        <p>Keyboard: <kbd>←</kbd> <kbd>→</kbd> move between steps · <kbd>F</kbd> follow on or off</p></div>`;
      return;
    }
    const n = P.steps.length;
    let html = "";
    if (view === 0) {
      const b = P.briefing;
      html = `
        <p class="it-kicker">${esc(P.title)} · Before you start</p>
        <h1>What we're doing, and why it matters at work</h1>
        <p class="it-task"><b>Mission:</b> ${esc(b.mission)}</p>
        <section class="it-talk"><h2>Talk track</h2>${paras(b.talk)}</section>
        <div class="it-two">
          <div class="it-box"><h2>Where you'd use this at work</h2><ul>${b.jobUse.map(j => `<li>${esc(j)}</li>`).join("")}</ul></div>
          <div class="it-box"><h2>This project</h2><ul>
            <li>${esc(P.difficulty)} · about ${P.minutes} minutes · ${n} steps</li>
            <li>You'll write: ${esc(P.file)}</li>
            <li>Sample files: ${P.files.map(esc).join(", ")}</li>
            <li>Skills: ${P.skills.map(esc).join(", ")}</li></ul></div>
        </div>`;
    } else if (view > n) {
      html = `
        <p class="it-kicker">${esc(P.title)} · Wrap-up</p>
        <h1>Wrap-up</h1>
        <section class="it-talk"><h2>Talk track</h2>${paras(P.wrapUp)}</section>
        <div class="it-box"><h2>Skills they learned</h2><ul class="it-recap">${P.recap.map(r => `<li>${esc(r)}</li>`).join("")}</ul></div>`;
    } else {
      const s = P.steps[view - 1];
      html = `
        <p class="it-kicker">${esc(P.title)} · Step ${view} of ${n}</p>
        <h1>${esc(s.title)}</h1>
        <p class="it-task"><b>On their screen:</b> ${esc(s.task)}</p>
        <div class="it-two">
          <div class="it-box"><h2>What I'm doing</h2><ul>${s.doing.map(d => `<li>${esc(d)}</li>`).join("")}</ul></div>
          <div class="it-box"><h2>Why</h2><ul>${s.whyList.map(d => `<li>${esc(d)}</li>`).join("")}</ul></div>
        </div>
        <section class="it-code">
          <div class="it-code-head"><h2>Code to add</h2><span class="file">${esc(P.file)}</span><button class="btn it-copy" data-copy>Copy code</button></div>
          <pre><code>${highlight(s.code, P.lang)}</code></pre>
        </section>
        <section class="it-talk"><h2>Talk track</h2>${paras(s.talk)}</section>
        <section class="it-see"><h2>What you'll see when you run it</h2><p>${esc(s.see)}</p></section>`;
    }
    html += `<div class="it-nav">
      <button class="btn" data-go="-1" ${view === 0 ? "disabled" : ""}>Previous</button>
      <button class="btn" data-go="1" ${view === n + 1 ? "disabled" : ""}>Next</button></div>`;
    main.innerHTML = `<div class="it-wrap">${html}</div>`;
    main.scrollTop = 0;
    if (flash) { main.classList.remove("flash"); void main.offsetWidth; main.classList.add("flash"); }
  }

  function render(flash) { renderSelect(); renderRail(); renderMain(flash); updateJump(); }

  function updateJump() {
    const j = $("#jump");
    const show = !follow && live.project && (!P || live.project !== P.id || live.step !== view);
    j.hidden = !show;
    if (show) {
      const lp = byId(live.project);
      const n = lp ? lp.steps.length : 0;
      const where = live.step === 0 ? "the briefing" : live.step > n ? "the wrap-up" : `step ${live.step}`;
      j.textContent = `Workspace is on ${where}. Jump there`;
    }
  }

  function setFollow(on) {
    follow = on;
    const b = $("#follow");
    b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", on);
    $("#follow-text").textContent = on ? "Following your workspace" : "Not following";
    if (on) applyLive(true);
    updateJump();
  }

  function applyLive(force) {
    if (!live.project) { if (force || follow) { updateJump(); renderRail(); } return; }
    if (!follow && !force) { renderRail(); updateJump(); return; }
    const changed = !P || P.id !== live.project || view !== live.step;
    P = byId(live.project) || P;
    view = live.step;
    render(changed);
  }

  function onLive(msg) {
    if (!msg || msg.type !== "state") return;
    live = { project: msg.project, step: msg.step };
    applyLive(false);
  }

  /* ---------- events */
  let channel = null;
  try { channel = new BroadcastChannel("hiamanda-instructor"); channel.onmessage = e => onLive(e.data); } catch (e) {}
  window.addEventListener("storage", e => { if (e.key === "hi.live" && e.newValue) onLive(JSON.parse(e.newValue)); });

  function go(d) {
    if (!P) return;
    const n = P.steps.length;
    const v = Math.max(0, Math.min(n + 1, view + d));
    if (v === view) return;
    view = v;
    if (follow && live.project) setFollow(false);
    render(true);
  }

  document.addEventListener("click", e => {
    const r = e.target.closest("[data-view]"); if (r) { view = +r.dataset.view; if (follow && live.project) setFollow(false); render(true); return; }
    const g = e.target.closest("[data-go]"); if (g) { go(+g.dataset.go); return; }
    if (e.target.closest("[data-copy]")) {
      const s = P.steps[view - 1];
      navigator.clipboard.writeText(s.code).then(() => toast("Code copied"), () => toast("Couldn't copy. Select the code instead."));
    }
  });
  $("#follow").addEventListener("click", () => setFollow(!follow));
  $("#jump").addEventListener("click", () => setFollow(true));
  $("#project-select").addEventListener("change", e => {
    if (!e.target.value) return;
    P = byId(e.target.value); view = 0;
    if (follow && live.project && live.project !== P.id) setFollow(false);
    render(true);
  });
  function setScale(v) {
    scale = Math.max(0.8, Math.min(1.6, Math.round(v * 10) / 10));
    document.body.style.setProperty("--scale", scale); store.set("hi.it.scale", scale);
  }
  $("#size-up").addEventListener("click", () => setScale(scale + 0.1));
  $("#size-down").addEventListener("click", () => setScale(scale - 0.1));
  document.addEventListener("keydown", e => {
    if (e.target.closest("select, input, textarea")) return;
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    if (e.key === "f" || e.key === "F") setFollow(!follow);
  });

  setScale(scale);
  const saved = store.get("hi.live", null);
  if (saved) { live = { project: saved.project, step: saved.step }; }
  applyLive(true);
  render(false);
  if (channel) channel.postMessage({ type: "hello" });
})();
