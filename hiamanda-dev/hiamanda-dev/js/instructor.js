/* horizon.dev — Instructor View. Stays in sync with the workspace in another window. */
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
  function sessionMinutes(p) {
    const L = p.lesson; if (!L) return p.minutes;
    return L.opening.minutes + L.closing.minutes + p.steps.reduce((t, st) => t + (st.lesson ? st.lesson.minutes : 0), 0);
  }

  /* ---------- class timer: tracks real time against the planned run of show */
  let timerStart = store.get("hi.it.timer", 0), timerTick = 0;
  function renderTimer() {
    const b = $("#class-timer");
    if (!b) return;
    if (!timerStart) { b.classList.remove("is-on"); b.textContent = "Start class timer"; return; }
    const secs = Math.floor((Date.now() - timerStart) / 1000);
    const hh = Math.floor(secs / 3600), mm = Math.floor(secs / 60) % 60, ss = secs % 60;
    const t = (hh ? hh + ":" + String(mm).padStart(2, "0") : mm) + ":" + String(ss).padStart(2, "0");
    b.classList.add("is-on");
    b.textContent = `Class time ${t}${P ? ` of ~${sessionMinutes(P)} min` : ""}`;
  }
  function toggleTimer() {
    timerStart = timerStart ? 0 : Date.now();
    store.set("hi.it.timer", timerStart);
    clearInterval(timerTick);
    if (timerStart) timerTick = setInterval(renderTimer, 1000);
    renderTimer();
  }
  if (timerStart) timerTick = setInterval(renderTimer, 1000);

  function renderFlow(flow) {
    // group beats into parts: what to say, then the lines to type right under it
    const parts = [];
    flow.beats.forEach((b, i) => {
      if (b.kind === "say" || !parts.length) parts.push({ say: b.kind === "say" ? b.text : [], code: [] });
      if (b.kind === "code") parts[parts.length - 1].code.push(i);
    });
    return `<div class="it-flow">${parts.map((pt, n) => `
      <section class="it-beat">
        <h2 class="it-beat-label">Part ${n + 1}</h2>
        ${pt.say.length ? `<div class="it-say">${pt.say.map(t => `<p>${esc(t)}</p>`).join("")}</div>` : ""}
        ${pt.code.map(i => `<div class="it-type">
          <div class="it-type-head"><span>Type</span><button class="it-copy-chunk" data-chunk="${i}" title="Copy these lines">Copy</button></div>
          <pre class="it-chunk"><code>${highlight(flow.beats[i].code, P.lang)}</code></pre>
        </div>`).join("")}
      </section>`).join("")}</div>`;
  }

  function renderSelect() {
    $("#project-select").innerHTML = `<option value="">Choose a project…</option>` +
      PROJECTS.map(p => `<option value="${p.id}" ${P && P.id === p.id ? "selected" : ""}>${p.lesson ? `Session ${p.lesson.session}: ` : ""}${esc(p.world.name)} · ${esc(p.title)}</option>`).join("");
  }

  function renderRail() {
    if (!P) { $("#rail").innerHTML = ""; return; }
    const n = P.steps.length;
    const L = P.lesson;
    const item = (i, num, title, min) => `<button class="rail-item ${view === i ? "is-active" : ""} ${live.project === P.id && live.step === i ? "is-live" : ""}" data-view="${i}"><span class="rail-num">${num}</span><span class="rail-title">${esc(title)}${min ? `<small>${min} min</small>` : ""}</span></button>`;
    $("#rail").innerHTML = (L ? `<div class="rail-head">${esc(L.series)}<b>Session ${L.session}</b><span>about ${sessionMinutes(P)} minutes</span></div>` : "") +
      item(0, "▶", "Opening", L && L.opening.minutes) + `<div class="rail-gap"></div>` +
      P.steps.map((s, i) => item(i + 1, i + 1, s.title, s.lesson && s.lesson.minutes)).join("") + `<div class="rail-gap"></div>` + item(n + 1, "✓", "Wrap-up and questions", L && L.closing.minutes);
    const a = $("#rail .is-active"); if (a) a.scrollIntoView({ block: "nearest" });
  }

  function renderMain(flash) {
    const main = $("#main");
    if (!P) {
      main.innerHTML = `<div class="it-empty"><span class="mark" style="display:inline-block;width:40px;height:40px"></span>
        <h1>Waiting for a project</h1>
        <p>Open a project in the horizon.dev window and this screen will follow along, step by step. You can also pick one from the menu above.</p>
        <p>Keyboard: <kbd>←</kbd> <kbd>→</kbd> move between steps · <kbd>F</kbd> follow on or off</p></div>`;
      return;
    }
    const n = P.steps.length;
    const L = P.lesson || {};
    const series = L.session ? `${esc(L.series)} · Session ${L.session}` : "";
    const totalMin = sessionMinutes(P);
    const list = arr => `<ul>${arr.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
    let html = "";
    if (view === 0) {
      const b = P.briefing, o = L.opening || { talk: b.talk, setup: [], minutes: 5 };
      const segs = [["Welcome and setup", o.minutes]].concat(P.steps.map((st, i) => [`${i + 1}. ${st.title}`, st.lesson ? st.lesson.minutes : 5]), [["Wrap-up and questions", L.closing ? L.closing.minutes : 5]]);
      let clock = 0;
      html = `
        <p class="it-kicker">${series} ${series ? "· " : ""}Opening</p>
        <h1 class="world-title">${esc(P.world.name)}</h1>
        <p class="it-sub">${esc(P.title)} · ${esc(P.difficulty)} · ${n} steps · about ${totalMin} minutes of class</p>
        <section class="it-talk"><h2>Script · about ${o.minutes} min</h2>${paras(o.talk)}</section>
        <div class="it-two">
          <div class="it-box"><h2>Setup check before you start</h2>
            <ul class="it-checklist">${(o.setup || []).map((x, i) => `<li><label><input type="checkbox" data-setup="${i}"> ${esc(x)}</label></li>`).join("")}</ul></div>
          <div class="it-box"><h2>Where they'd use this at work</h2>${list(b.jobUse)}</div>
        </div>
        <div class="it-box it-runshow"><h2>Run of show</h2>
          <table>${segs.map(([t, m]) => { const at = clock; clock += m; return `<tr><td class="at">${at}:00</td><td>${esc(t)}</td><td class="len">${m} min</td></tr>`; }).join("")}</table>
        </div>`;
    } else if (view > n) {
      const c = L.closing || { talk: P.wrapUp, homework: [], questions: [], minutes: 5 };
      html = `
        <p class="it-kicker">${series} ${series ? "· " : ""}Closing</p>
        <h1 class="world-title">Wrap-up and questions</h1>
        <section class="it-talk"><h2>Script · about ${c.minutes} min</h2>${paras(c.talk)}</section>
        <div class="it-box"><h2>What they can do now</h2><ul class="it-recap">${P.recap.map(r => `<li>${esc(r)}</li>`).join("")}</ul></div>
        <div class="it-two">
          <div class="it-box"><h2>Homework to assign</h2><ol class="it-ol">${(c.homework || []).map(h => `<li>${esc(h)}</li>`).join("")}</ol></div>
          <div class="it-box"><h2>Questions people usually ask</h2>${(c.questions || []).map(q => `<div class="it-qa"><b>${esc(q.q)}</b><p>${esc(q.a)}</p></div>`).join("")}</div>
        </div>
        ${c.next ? `<p class="it-next"><b>Up next:</b> ${esc(c.next)}</p>` : ""}`;
    } else {
      const s = P.steps[view - 1], ls = s.lesson || {};
      html = `
        <p class="it-kicker">${series} ${series ? "· " : ""}${esc(P.world.name)} · Step ${view} of ${n}${ls.minutes ? ` · about ${ls.minutes} min` : ""}</p>
        <h1 class="world-title">${esc(s.title)}</h1>
        ${s.ask ? `<p class="it-ask">${esc(s.ask)}</p>` : ""}
        <p class="it-task"><b>On their screen:</b> ${esc(s.task)}</p>
        ${ls.flow ? renderFlow(ls.flow) : `<section class="it-talk"><h2>Script</h2>${paras(ls.talk || s.talk)}</section>
        <section class="it-code"><div class="it-code-head"><h2>Type along</h2><span class="file">${esc(P.file)}</span><button class="btn it-copy" data-copy>Copy code</button></div><pre><code>${highlight(s.code, P.lang)}</code></pre></section>`}
        <section class="it-run">
          <h2 class="it-beat-label">Run it</h2>
          ${ls.flow && ls.flow.run.length ? `<div class="it-say">${ls.flow.run.map(t => `<p>${esc(t)}</p>`).join("")}</div>` : ""}
          <div class="it-see"><h3>What they'll see</h3><p>${esc(s.see)}</p></div>
        </section>
        ${ls.check ? `<div class="it-two">
          <div class="it-box it-checkin"><h2>Check in with the class</h2><p class="q">${esc(ls.check.q)}</p>
            <details><summary>Show the answer</summary><p>${esc(ls.check.a)}</p></details></div>
          <div class="it-box it-watch"><h2>Watch for in the chat</h2>${list(ls.watch || [])}</div>
        </div>` : ""}
        ${ls.recap ? `<p class="it-takeaway"><b>Takeaway</b>${esc(ls.recap)}</p>` : ""}
        <details class="it-ref"><summary>Reference: full code, line by line, and key terms</summary>
          <section class="it-code">
            <div class="it-code-head"><h2>All the code for this step</h2><span class="file">${esc(P.file)}</span><button class="btn it-copy" data-copy>Copy all</button></div>
            <pre><code>${highlight(s.code, P.lang)}</code></pre>
            ${ls.lines ? `<div class="it-lines"><h2>Line by line</h2><dl>${ls.lines.map(([c, m]) => `<dt><code>${esc(c)}</code></dt><dd>${esc(m)}</dd>`).join("")}</dl></div>` : ""}
          </section>
          ${s.clues ? `<div class="it-two">
            <div class="it-box"><h2>How do I know what to use?</h2>${list(s.clues)}</div>
            <div class="it-box"><h2>What the words mean</h2><dl class="it-terms">${(s.terms || []).map(([t, m]) => `<dt>${esc(t)}</dt><dd>${esc(m)}</dd>`).join("")}</dl></div>
          </div>` : ""}
          <div class="it-two">
            <div class="it-box"><h2>What I'm doing</h2>${list(s.doing)}</div>
            <div class="it-box"><h2>Why</h2>${list(s.whyList)}</div>
          </div>
        </details>`;
    }
    html += `<div class="it-nav">
      <button class="btn" data-go="-1" ${view === 0 ? "disabled" : ""}>Previous</button>
      <button class="btn" data-go="1" ${view === n + 1 ? "disabled" : ""}>Next</button></div>`;
    main.innerHTML = `<div class="it-wrap">${html}</div>`;
    main.scrollTop = 0;
    if (flash) { main.classList.remove("flash"); void main.offsetWidth; main.classList.add("flash"); }
  }

  function render(flash) { Worlds.apply(document.body, P ? P.world : null); renderSelect(); renderRail(); renderMain(flash); updateJump(); renderTimer(); }

  function updateJump() {
    const j = $("#jump");
    const show = !follow && live.project && (!P || live.project !== P.id || live.step !== view);
    j.hidden = !show;
    if (show) {
      const lp = byId(live.project);
      const n = lp ? lp.steps.length : 0;
      const where = live.step === 0 ? "the opening" : live.step > n ? "the wrap-up" : `step ${live.step}`;
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
    const ch = e.target.closest("[data-chunk]");
    if (ch) {
      const st = P.steps[view - 1], b = st.lesson.flow.beats[+ch.dataset.chunk];
      navigator.clipboard.writeText(b.code).then(() => { ch.textContent = "Copied"; setTimeout(() => ch.textContent = "Copy", 1200); }, () => toast("Couldn't copy. Select the code instead."));
      return;
    }
    if (e.target.closest("[data-copy]")) {
      const s = P.steps[view - 1];
      navigator.clipboard.writeText(s.code).then(() => toast("Code copied"), () => toast("Couldn't copy. Select the code instead."));
    }
  });
  $("#follow").addEventListener("click", () => setFollow(!follow));
  $("#class-timer").addEventListener("click", toggleTimer);
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
