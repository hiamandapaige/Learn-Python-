/* horizon.dev — the app: welcome, project picker, workspace, quest cards, completion. */
(function () {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = (id, cls = "") => `<svg class="${cls}"><use href="#${id}"/></svg>`;
  const PROJECTS = window.PROJECTS;
  const byId = id => PROJECTS.find(p => p.id === id);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------- storage */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    del(k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  const progressOf = id => store.get("hi.p." + id, null);
  const saveProgress = (id, data) => store.set("hi.p." + id, data);
  const doneMap = () => store.get("hi.done", {});

  /* ---------------------------------------------------------- instructor sync */
  let channel = null;
  try { channel = new BroadcastChannel("hiamanda-instructor"); } catch (e) {}
  const live = { project: null, step: 0 };
  function broadcast() {
    const msg = { type: "state", project: live.project, step: live.step, at: Date.now() };
    store.set("hi.live", msg);
    if (channel) channel.postMessage(msg);
  }
  if (channel) channel.onmessage = e => { if (e.data && e.data.type === "hello") broadcast(); };

  function toast(text) {
    const t = $("#toast");
    t.textContent = text; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2200);
  }

  function showScreen(id) {
    $$(".screen").forEach(s => s.classList.remove("is-active", "enter"));
    const el = $("#screen-" + id);
    el.classList.add("is-active");
    if (!reduceMotion) { void el.offsetWidth; el.classList.add("enter"); }
  }

  /* ==========================================================
     SCREEN 1 · WELCOME
     ========================================================== */
  const TIPS = [
    "Python counts from 0. The first item in a list is item 0.",
    "A variable is a labeled box that holds a value.",
    "A CSV file is a spreadsheet saved as plain text, one row per line.",
    "Error messages are clues, not failures. Read the last line first.",
    "In SQL, text values go in single quotes, like WHERE region = 'South'.",
    "Indentation matters in Python. Code inside a loop is pushed in by four spaces.",
    "An API is a website made for programs instead of people.",
    "SELECT picks the columns. WHERE picks the rows.",
    "Name your variables so future you knows what's inside.",
    "Copying code is fine. Understanding why it works is the goal."
  ];

  const Welcome = (() => {
    const canvas = $("#welcome-canvas");
    const g = canvas.getContext("2d");
    let W = 0, H = 0, DPR = 1, t0 = performance.now(), raf = 0, energy = 0.25, warp = 0;
    const GLYPHS = ["def", "{ }", "( )", "=", "SELECT", "for", "in", "[ ]", ":", "#", "0", "1", "pd", "import", "if", "*", ";", "JOIN", "print", "...", "λ", "==", "WHERE", "csv", "+=", "</>", "True", "None", "AS", "json"];
    let parts = [], dust = [], lastTime = 0;

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      g.setTransform(DPR, 0, 0, DPR, 0, 0);
      Alley.resize(W, H, DPR);
    }
    function seed() {
      parts = Array.from({ length: 30 }, (_, i) => ({
        txt: GLYPHS[i % GLYPHS.length],
        a: 1.6 + Math.random() * 2.2,
        squash: 0.22 + Math.random() * 0.22,
        tilt: (Math.random() - 0.5) * 0.9,
        speed: (0.12 + Math.random() * 0.22) * (Math.random() < 0.5 ? 1 : -1),
        phase: Math.random() * Math.PI * 2,
        size: 10 + Math.random() * 5
      }));
      dust = Array.from({ length: 70 }, () => ({
        x: Math.random(), y: Math.random(), v: 0.004 + Math.random() * 0.012,
        txt: GLYPHS[Math.floor(Math.random() * GLYPHS.length)], a: 0.04 + Math.random() * 0.12, s: 9 + Math.random() * 4
      }));
    }
    function center() {
      const [cx, cy] = Alley.geo.orb;
      return { cx, cy, R: Math.min(W, H) * (W < 860 ? 0.085 : 0.1) };
    }
    function drawParticle(p, time, cx, cy, R, front) {
      const th = p.phase + time * p.speed * (1 + warp * 6);
      const z = Math.sin(th);
      if ((z >= 0) !== front) return;
      const ex = Math.cos(th) * p.a * R * (1 + warp * 2.2);
      const ey = z * p.a * R * p.squash;
      const x = cx + ex * Math.cos(p.tilt) - ey * Math.sin(p.tilt);
      const y = cy + ex * Math.sin(p.tilt) + ey * Math.cos(p.tilt);
      const depth = (z + 1) / 2;
      const alpha = (front ? 0.55 + depth * 0.45 : 0.12 + depth * 0.25) * (0.6 + energy * 0.4);
      g.font = `500 ${(p.size * (0.75 + depth * 0.45)).toFixed(1)}px "JetBrains Mono", monospace`;
      g.fillStyle = front ? `rgba(240, 220, 255, ${alpha})` : `rgba(157, 107, 255, ${alpha})`;
      if (front) { g.shadowColor = "rgba(224, 92, 255, .9)"; g.shadowBlur = 10 * depth; }
      g.fillText(p.txt, x, y);
      g.shadowBlur = 0;
    }
    function frame(now) {
      const time = reduceMotion ? 8 : (now - t0) / 1000;
      const { cx, cy, R } = center();
      const dt = Math.min(0.05, Math.max(0, time - lastTime)); lastTime = time;
      g.globalCompositeOperation = "source-over";
      // the alley: walls, wet floor, props and the glowing street at the far end
      Alley.drawBack(g, time);

      // floating code dust
      g.textAlign = "center"; g.textBaseline = "middle";
      dust.forEach(d => {
        if (!reduceMotion) { d.y -= d.v / 60 * (1 + warp * 20); if (d.y < -0.05) { d.y = 1.05; d.x = Math.random(); } }
        g.font = `${d.s}px "JetBrains Mono", monospace`;
        g.fillStyle = `rgba(187, 152, 255, ${d.a * 0.6})`;
        g.fillText(d.txt, d.x * W, d.y * H);
      });

      // far glow
      const pulse = 1 + Math.sin(time * 1.6) * 0.035 + energy * 0.08;
      let gr = g.createRadialGradient(cx, cy, 0, cx, cy, R * 4.2 * pulse);
      gr.addColorStop(0, `rgba(224, 92, 255, ${0.18 + energy * 0.22})`);
      gr.addColorStop(0.35, `rgba(124, 58, 237, ${0.12 + energy * 0.12})`);
      gr.addColorStop(1, "rgba(3, 2, 5, 0)");
      g.fillStyle = gr; g.fillRect(0, 0, W, H);

      // orbit paths
      g.strokeStyle = "rgba(157, 107, 255, .14)"; g.lineWidth = 1;
      [[1.6, .3, -.25], [2.25, .38, .3], [2.7, .24, .05]].forEach(([a, sq, tl]) => {
        g.beginPath(); g.ellipse(cx, cy, a * R, a * R * sq, tl, 0, Math.PI * 2); g.stroke();
      });

      parts.forEach(p => drawParticle(p, time, cx, cy, R, false));

      // the orb
      g.globalCompositeOperation = "lighter";
      const r = R * pulse;
      gr = g.createRadialGradient(cx, cy, 0, cx, cy, r * 1.25);
      gr.addColorStop(0, "rgba(255,255,255,1)");
      gr.addColorStop(0.12, "rgba(250, 220, 255, .95)");
      gr.addColorStop(0.32, "rgba(224, 92, 255, .85)");
      gr.addColorStop(0.62, "rgba(124, 58, 237, .55)");
      gr.addColorStop(1, "rgba(76, 29, 149, 0)");
      g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, r * 1.25, 0, Math.PI * 2); g.fill();
      // energy arcs swirling inside
      for (let i = 0; i < 7; i++) {
        const rot = time * (0.6 + i * 0.13) * (i % 2 ? 1 : -1) + i;
        const rr = r * (0.45 + (i % 4) * 0.13);
        g.strokeStyle = `rgba(${i % 2 ? "255, 210, 255" : "187, 152, 255"}, ${0.22 + energy * 0.2})`;
        g.lineWidth = 1.2 + (i % 3) * 0.6;
        g.beginPath(); g.ellipse(cx, cy, rr, rr * (0.35 + (i % 3) * 0.2), rot * 0.7, rot, rot + Math.PI * (0.6 + (i % 3) * 0.25)); g.stroke();
      }
      g.globalCompositeOperation = "source-over";
      parts.forEach(p => drawParticle(p, time, cx, cy, R, true));

      // neon signs, steam, fog and rain sit in front of everything else
      Alley.drawFront(g, time, dt, reduceMotion);

      if (!reduceMotion) raf = requestAnimationFrame(frame);
    }
    function start() { resize(); seed(); cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); }
    window.addEventListener("resize", () => { if ($("#screen-welcome").classList.contains("is-active")) resize(); });
    return {
      start,
      setEnergy(v) { energy = v; },
      warp() { warp = 0; const s = performance.now(); const step = n => { warp = Math.min(1, (n - s) / 700); if (warp < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); },
      stop() { cancelAnimationFrame(raf); }
    };
  })();

  let monaco = null;
  async function boot() {
    Welcome.start();
    // rotating tips
    let ti = Math.floor(Math.random() * TIPS.length);
    const tipEl = $("#tip-text");
    tipEl.textContent = TIPS[ti];
    const tipTimer = setInterval(() => {
      tipEl.classList.add("fade");
      setTimeout(() => { ti = (ti + 1) % TIPS.length; tipEl.textContent = TIPS[ti]; tipEl.classList.remove("fade"); }, 400);
    }, 4800);

    // loader: stage targets + slow creep, so the bar always moves
    const STAGES = { start: [6, "Starting up…"], python: [58, "Booting Python…"], sqlite: [74, "Loading the database engine…"], workspace: [84, "Preparing your workspace…"], editor: [94, "Loading the code editor…"], done: [100, "Ready"] };
    let shown = 0, target = 6, cap = 6;
    const fill = $("#loader-fill"), pct = $("#loader-pct"), status = $("#loader-status");
    const stage = name => { const [p, label] = STAGES[name]; cap = p; target = Math.max(target, Math.min(p, shown + 4)); status.textContent = label; };
    const creep = setInterval(() => {
      target = Math.min(cap, target + (cap - target) * 0.08 + 0.15);
      shown += (target - shown) * 0.25;
      fill.style.width = shown.toFixed(1) + "%";
      pct.textContent = Math.round(shown) + "%";
      Welcome.setEnergy(0.25 + shown / 100 * 0.75);
    }, 60);
    stage("start");

    const minTime = new Promise(r => setTimeout(r, 3400));
    try {
      const pyDone = Runtime.bootPython(stage);
      const edDone = Runtime.loadMonaco().then(m => { monaco = m; }).catch(err => { console.warn("Editor failed to load, using the simple editor.", err); });
      await pyDone;
      stage("editor");
      await edDone;
      await minTime;
      stage("done");
      target = 100; cap = 100;
      await new Promise(r => setTimeout(r, 450));
      clearInterval(creep);
      fill.style.width = "100%"; pct.textContent = "100%";
      $("#loader").classList.add("done");
      // warm up pandas quietly so the first pandas project opens fast
      Runtime.loadPandas().catch(() => {});
      readyToStart();
    } catch (err) {
      console.error(err);
      clearInterval(creep);
      status.textContent = "Something went wrong";
      $("#loader-error").hidden = false;
    }
    $("#loader-retry").onclick = () => location.reload();

    function readyToStart() {
      const btn = $("#press-start");
      if (window.matchMedia("(pointer: coarse)").matches) btn.textContent = "Tap to begin";
      btn.hidden = false;
      let gone = false;
      const go = (e) => {
        if (gone) return;
        if (e && e.type === "keydown" && (e.metaKey || e.ctrlKey || e.altKey)) return;
        if (e && e.target && e.target.closest && e.target.closest("[data-sound-toggle]")) return;
        gone = true;
        window.removeEventListener("keydown", go); $("#screen-welcome").removeEventListener("pointerdown", go);
        clearInterval(tipTimer);
        Sound.unlock(); Sound.start();
        Welcome.warp();
        const w = $("#screen-welcome"); w.classList.add("leaving");
        setTimeout(() => { Welcome.stop(); w.classList.remove("leaving"); Picker.show(); }, reduceMotion ? 50 : 700);
      };
      window.addEventListener("keydown", go);
      $("#screen-welcome").addEventListener("pointerdown", go);
    }
  }

  /* ==========================================================
     SCREEN 2 · PICKER
     ========================================================== */
  const Picker = (() => {
    let featured = 0, filter = "all", query = "", timer = 0, paused = false;
    const FEATURE_MS = 9000;

    const langChip = p => `<span class="chip plain">${icon(p.lang === "sql" ? "i-db" : "i-snake")}${p.lang === "sql" ? "SQL" : "Python"}</span>`;
    const lvlChip = p => `<span class="chip lvl-${p.difficulty.toLowerCase()}">${esc(p.difficulty)}</span>`;
    const timeChip = p => `<span class="chip plain">${icon("i-clock")}~${p.minutes} min</span>`;
    const doneBadge = `<span class="done-badge">${icon("i-check")}Completed</span>`;

    function statusOf(p) {
      if (doneMap()[p.id]) return "done";
      const pr = progressOf(p.id);
      return pr && pr.step > 0 ? "progress" : "new";
    }

    function renderFeature(swap) {
      const p = PROJECTS[featured];
      const st = statusOf(p), pr = progressOf(p.id);
      const label = st === "progress" ? `Continue · step ${Math.min(pr.step, p.steps.length)} of ${p.steps.length}` : st === "done" ? "Play again" : "Start project";
      const el = $("#feature");
      el.innerHTML = `
        <div class="feature-art">${Art.project(p.art)}</div>
        <div class="feature-shade"></div>
        <div class="feature-body">
          <div class="feature-kicker">${st === "done" ? doneBadge : `<span class="mark small"></span>Project ${featured + 1} of ${PROJECTS.length}`}</div>
          <h2>${esc(p.title)}</h2>
          <p>${esc(p.tagline)} ${esc(p.briefing.mission.split(". ")[0])}.</p>
          <div class="feature-meta">${lvlChip(p)}${timeChip(p)}${p.skills.map(s => `<span class="chip">${esc(s)}</span>`).join("")}</div>
          <div class="feature-actions"><button class="btn btn-primary btn-lg" data-open="${p.id}">${icon("i-play")}${label}</button></div>
        </div>`;
      if (swap && !reduceMotion) { el.classList.remove("swap"); void el.offsetWidth; el.classList.add("swap"); }
      $$(".thumb").forEach((t, i) => {
        t.classList.toggle("is-active", i === featured);
        t.setAttribute("aria-selected", i === featured);
        const bar = t.querySelector(".thumb-timer");
        bar.classList.remove("run"); void bar.offsetWidth;
        if (i === featured && !paused && !reduceMotion) bar.classList.add("run");
      });
    }

    function renderThumbs() {
      $("#thumbs").style.setProperty("--feature-ms", FEATURE_MS + "ms");
      $("#thumbs").innerHTML = PROJECTS.map((p, i) => `
        <button class="thumb" role="tab" data-i="${i}">
          <span class="thumb-art">${Art.project(p.art)}</span>
          <span class="thumb-title">${esc(p.title)}</span>
          <span class="thumb-timer"></span>
        </button>`).join("");
    }

    function matches(p) {
      if (filter === "python" && p.lang !== "python") return false;
      if (filter === "sql" && p.lang !== "sql") return false;
      if (filter === "done" && !doneMap()[p.id]) return false;
      if (!query) return true;
      const hay = [p.title, p.tagline, p.difficulty, ...p.skills].join(" ").toLowerCase();
      return query.toLowerCase().split(/\s+/).every(w => hay.includes(w));
    }

    function renderCards() {
      const list = PROJECTS.filter(matches);
      $("#cards").innerHTML = list.map(p => {
        const st = statusOf(p), pr = progressOf(p.id);
        return `
        <button class="card ${st === "progress" ? "in-progress" : ""}" data-open="${p.id}">
          <div class="card-art" ${st === "progress" ? `data-progress="Step ${Math.min(pr.step, p.steps.length)} of ${p.steps.length}"` : ""}>${Art.project(p.art)}${st === "done" ? doneBadge : ""}</div>
          <div class="card-body">
            <h3 class="card-title">${esc(p.title)}</h3>
            <div class="card-meta">${lvlChip(p)}<span>${icon("i-clock")}</span><span>~${p.minutes} min</span><span>·</span><span>${p.steps.length} steps</span></div>
            <div class="card-skills">${p.skills.map(s => `<span>${esc(s)}</span>`).join("")}</div>
          </div>
        </button>`;
      }).join("");
      $("#cards-empty").hidden = list.length > 0;
      const titles = { all: "All projects", python: "Python projects", sql: "SQL projects", done: "Completed" };
      $("#grid-title").textContent = query ? `Results for "${query}"` : titles[filter];
      const done = Object.keys(doneMap()).filter(id => byId(id)).length;
      $("#progress-count").textContent = `${done} of ${PROJECTS.length}`;
      $("#progress-fill").style.width = (done / PROJECTS.length * 100) + "%";
    }

    function rotate() {
      clearInterval(timer);
      if (reduceMotion) return;
      timer = setInterval(() => { if (!paused) { featured = (featured + 1) % PROJECTS.length; renderFeature(true); } }, FEATURE_MS);
    }

    function bind() {
      $("#thumbs").addEventListener("click", e => {
        const b = e.target.closest(".thumb"); if (!b) return;
        Sound.click(); featured = +b.dataset.i; renderFeature(true); rotate();
      });
      const area = $(".picker-scroll");
      area.addEventListener("click", e => {
        const b = e.target.closest("[data-open]"); if (!b) return;
        Sound.open(); Workspace.open(byId(b.dataset.open));
      });
      area.addEventListener("pointerover", e => {
        const b = e.target.closest(".card, .thumb, .btn");
        if (b && b !== area._last) { area._last = b; Sound.hover(); }
      });
      $("#feature").addEventListener("pointerenter", () => { paused = true; renderFeature(false); });
      $("#feature").addEventListener("pointerleave", () => { paused = false; renderFeature(false); rotate(); });
      $$(".side-link").forEach(b => b.addEventListener("click", () => {
        Sound.click(); filter = b.dataset.filter;
        $$(".side-link").forEach(x => x.classList.toggle("is-active", x === b));
        renderCards();
      }));
      $("#search").addEventListener("input", e => { query = e.target.value.trim(); renderCards(); });
    }

    let bound = false;
    return {
      show() {
        if (!bound) { bind(); renderThumbs(); bound = true; }
        showScreen("picker");
        Sound.ambient(0.045);
        renderFeature(false); renderCards(); rotate();
        live.project = null; live.step = 0; broadcast();
      },
      stop() { clearInterval(timer); }
    };
  })();

  /* ==========================================================
     SCREEN 3 · WORKSPACE
     ========================================================== */
  const Workspace = (() => {
    let P = null;                 // current project
    let state = null;             // { code, step, hintsUsed, startedAt, passed }
    let ed = null;                // editor adapter
    let tabs = [];                // open tab names
    let activeTab = null;
    let known = new Set();        // files we've already shown
    let hint = 0;                 // 0 none, 1 nudge, 2 code
    let feedback = null;          // { ok, message }
    let mode = "center";          // center | docked
    let minimized = false;
    let runningNow = false;

    /* ---------- editor adapter (Monaco, or a plain textarea if Monaco can't load) */
    function makeEditor() {
      if (monaco) {
        monaco.editor.defineTheme("hiamanda", {
          base: "vs-dark", inherit: true,
          rules: [
            { token: "", foreground: "E6DEF5" },
            { token: "comment", foreground: "6F6585", fontStyle: "italic" },
            { token: "keyword", foreground: "C792FF" },
            { token: "string", foreground: "F2B8FF" },
            { token: "number", foreground: "FFBF73" },
            { token: "delimiter", foreground: "A89DBD" },
            { token: "type", foreground: "8FD6FF" },
            { token: "predefined", foreground: "8FD6FF" },
            { token: "operator", foreground: "C792FF" }
          ],
          colors: {
            "editor.background": "#07050C", "editor.foreground": "#E6DEF5",
            "editorLineNumber.foreground": "#3E3456", "editorLineNumber.activeForeground": "#BB98FF",
            "editor.lineHighlightBackground": "#120C1E", "editor.lineHighlightBorder": "#00000000",
            "editor.selectionBackground": "#5B26B888", "editor.inactiveSelectionBackground": "#4C1D9555",
            "editorCursor.foreground": "#E05CFF",
            "editorIndentGuide.background1": "#1A1428", "editorIndentGuide.activeBackground1": "#3A2D57",
            "editorBracketMatch.background": "#4C1D9544", "editorBracketMatch.border": "#9D6BFF",
            "scrollbarSlider.background": "#21193399", "scrollbarSlider.hoverBackground": "#2E2347AA",
            "editorWidget.background": "#110C1B", "editorWidget.border": "#261D3A",
            "editorSuggestWidget.background": "#110C1B", "editorSuggestWidget.border": "#261D3A",
            "editorSuggestWidget.selectedBackground": "#2A1A4A", "editorGutter.background": "#07050C",
            "editorError.foreground": "#FF7A93", "editorOverviewRuler.border": "#00000000"
          }
        });
        const editor = monaco.editor.create($("#editor"), {
          theme: "hiamanda", fontFamily: '"JetBrains Mono", ui-monospace, Menlo, monospace', fontSize: 14, lineHeight: 22,
          minimap: { enabled: false }, automaticLayout: true, padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false, smoothScrolling: true, cursorBlinking: "smooth", cursorSmoothCaretAnimation: "on",
          renderLineHighlight: "all", bracketPairColorization: { enabled: true }, guides: { indentation: true },
          tabSize: 4, insertSpaces: true, wordWrap: "off", fixedOverflowWidgets: true, overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true, scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
          quickSuggestions: false, suggestOnTriggerCharacters: false, wordBasedSuggestions: "off", parameterHints: { enabled: false }
        });
        if (document.fonts) document.fonts.ready.then(() => monaco.editor.remeasureFonts());
        const models = {};
        let decos = [];
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => runCode(false));
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => { save(); toast("Saved"); });
        editor.onDidChangeCursorPosition(e => { $("#sb-pos").textContent = `Ln ${e.position.lineNumber}, Col ${e.position.column}`; });
        return {
          kind: "monaco",
          open(name, text, lang, readOnly) {
            let m = models[name];
            if (!m) { m = models[name] = monaco.editor.createModel(text, lang); if (!readOnly) m.onDidChangeContent(onEdit); }
            else if (readOnly) m.setValue(text);
            editor.setModel(m);
            editor.updateOptions({ readOnly, tabSize: lang === "sql" ? 2 : 4 });
            m.updateOptions({ tabSize: lang === "sql" ? 2 : 4, insertSpaces: true });
          },
          value(name) { return models[name] ? models[name].getValue() : ""; },
          setValue(name, v) { if (models[name]) models[name].setValue(v); },
          drop(name) { if (models[name]) { models[name].dispose(); delete models[name]; } },
          dropAll() { Object.keys(models).forEach(k => { models[k].dispose(); delete models[k]; }); },
          append(name, code) {
            const m = models[name]; if (!m) return;
            const v = m.getValue(), trimmed = v.replace(/\s+$/, "");
            const a = m.getPositionAt(trimmed.length), b = m.getPositionAt(v.length);
            const text = (trimmed ? "\n\n" : "") + code + "\n";
            m.pushEditOperations([], [{ range: new monaco.Range(a.lineNumber, a.column, b.lineNumber, b.column), text }], () => null);
            editor.revealLine(m.getLineCount()); editor.setPosition({ lineNumber: m.getLineCount(), column: 1 });
          },
          markError(line) {
            decos = editor.deltaDecorations(decos, line ? [{ range: new monaco.Range(line, 1, line, 1), options: { isWholeLine: true, className: "err-line", linesDecorationsClassName: "err-gutter" } }] : []);
          },
          goto(line) { editor.revealLineInCenter(line); editor.setPosition({ lineNumber: line, column: 1 }); editor.focus(); },
          focus() { editor.focus(); },
          layout() { editor.layout(); }
        };
      }
      // fallback editor
      const ta = $("#editor-fallback"); ta.hidden = false; $("#editor").hidden = true;
      const docs = {}; let cur = null;
      ta.addEventListener("input", () => { if (cur && !docs[cur].ro) { docs[cur].text = ta.value; onEdit(); } });
      ta.addEventListener("keydown", e => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); runCode(false); }
        if (e.key === "Tab") { e.preventDefault(); const s = ta.selectionStart; ta.setRangeText("    ", s, ta.selectionEnd, "end"); ta.dispatchEvent(new Event("input")); }
      });
      return {
        kind: "textarea",
        open(name, text, lang, readOnly) { if (!docs[name] || readOnly) docs[name] = { text, ro: readOnly }; cur = name; ta.value = docs[name].text; ta.readOnly = readOnly; },
        value(name) { return docs[name] ? docs[name].text : ""; },
        setValue(name, v) { if (docs[name]) docs[name].text = v; if (cur === name) ta.value = v; },
        drop(name) { delete docs[name]; },
        dropAll() { Object.keys(docs).forEach(k => delete docs[k]); },
        append(name, code) { const v = docs[name].text.replace(/\s+$/, ""); this.setValue(name, (v ? v + "\n\n" : "") + code + "\n"); onEdit(); },
        markError() {}, goto() { ta.focus(); }, focus() { ta.focus(); }, layout() {}
      };
    }

    const fileKind = n => n.endsWith(".py") ? "py" : n.endsWith(".sql") ? "sql" : n.endsWith(".db") ? "db" : n.endsWith(".csv") ? "csv" : "file";
    const fileIcon = n => { const k = fileKind(n); return k === "db" ? `<span class="file-ico db">${icon("i-db")}</span>` : `<span class="file-ico ${k}">${k === "file" ? "TXT" : k.toUpperCase()}</span>`; };
    const langFor = n => n.endsWith(".py") ? "python" : (n.endsWith(".sql") || n.endsWith(".db")) ? "sql" : "plaintext";

    let saveTimer = 0;
    function onEdit() {
      $("#sb-saved").textContent = "Editing…";
      ed.markError(null);
      clearTimeout(saveTimer); saveTimer = setTimeout(save, 500);
    }
    function save() {
      if (!P || !state) return;
      state.code = ed.value(P.file);
      saveProgress(P.id, state);
      $("#sb-saved").textContent = "Saved";
    }

    /* ---------- explorer + tabs */
    function renderFiles(fresh = []) {
      let files = [];
      try { files = Runtime.listFiles(P).map(f => f.name); } catch (e) { files = P.files.slice(); }
      const names = [P.file, ...files.filter(n => n !== P.file)];
      $("#file-list").innerHTML = names.map(n => `
        <li><button class="file ${n === activeTab ? "is-open" : ""} ${fresh.includes(n) ? "just-made" : ""}" data-file="${esc(n)}">
          ${fileIcon(n)}<span>${esc(n)}</span>${fresh.includes(n) || (!P.files.includes(n) && n !== P.file) ? `<span class="new-dot">new</span>` : ""}
        </button></li>`).join("");
      return files;
    }
    function renderTabs() {
      $("#tabs").innerHTML = tabs.map(n => `
        <button class="tab ${n === activeTab ? "is-active" : ""}" role="tab" data-tab="${esc(n)}" aria-selected="${n === activeTab}">
          ${fileIcon(n)}<span>${esc(n)}</span>${n === P.file ? "" : `<span class="tab-ro">read-only</span><span class="tab-x" data-close="${esc(n)}" aria-label="Close ${esc(n)}">${icon("i-close")}</span>`}
        </button>`).join("");
    }
    function openTab(name) {
      if (!tabs.includes(name)) tabs.push(name);
      activeTab = name;
      if (name === P.file) ed.open(name, state.code, langFor(name), false);
      else {
        let text = "";
        try { text = Runtime.readFile(P, name); } catch (e) { text = "This file couldn't be opened."; }
        ed.open(name, text, langFor(name), true);
      }
      $("#sb-lang").textContent = name === P.file ? (P.lang === "sql" ? "SQL" : "Python") : (fileKind(name) === "db" ? "Database summary" : "Plain text (read-only)");
      renderTabs(); renderFiles();
    }
    function closeTab(name) {
      tabs = tabs.filter(t => t !== name); ed.drop(name);
      if (activeTab === name) openTab(P.file); else renderTabs();
    }

    /* ---------- output drawer */
    function openDrawer(open) {
      $("#drawer").classList.toggle("is-open", open);
      $("#screen-workspace").classList.toggle("drawer-open", open);
    }
    function renderOutput(res, ms) {
      const body = $("#drawer-body");
      let html = "";
      if (P.lang === "python") {
        html += res.output ? `<pre class="out-text">${esc(res.output.replace(/\s+$/, ""))}</pre>` : (res.error ? "" : `<p class="out-empty">Your code ran, but didn't print anything. Use print( ) to show results here.</p>`);
      } else {
        if (!res.tables.length && !res.error) html += `<p class="out-empty">Nothing ran yet. Write a query and end it with a semicolon ;</p>`;
        res.tables.forEach(t => {
          if (t.kind === "msg") { html += `<p class="out-msg">${esc(t.text)} <span style="color:var(--text-faint)">(line ${t.line})</span></p>`; return; }
          const isNum = t.rows.length ? t.cols.map((_, i) => t.rows.every(r => r[i] === null || typeof r[i] === "number")) : [];
          html += `<div class="out-table-wrap"><div class="out-table-cap">Query on <button data-goto="${t.line}">line ${t.line}</button> · ${t.total} row${t.total === 1 ? "" : "s"}${t.total > t.rows.length ? ` (showing ${t.rows.length})` : ""}</div>
            <table class="out-table"><thead><tr>${t.cols.map(c => `<th>${esc(c)}</th>`).join("")}</tr></thead>
            <tbody>${t.rows.map(r => `<tr>${r.map((v, i) => v === null ? `<td class="null">NULL</td>` : `<td class="${isNum[i] ? "num" : ""}">${esc(typeof v === "number" && !Number.isInteger(v) ? +v.toFixed(4) : v)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
        });
      }
      if (res.error) {
        const e = res.error;
        html += `<div class="out-error"><div class="out-error-head">${esc(e.type)}${e.line ? ` <button data-goto="${e.line}">on line ${e.line}</button>` : ""}</div>
          <div class="out-error-msg">${esc(e.message)}</div><p class="out-error-why"><b>What this means:</b> ${esc(e.friendly)}</p></div>`;
        ed.markError(activeTab === P.file ? e.line : null);
      }
      body.innerHTML = html;
      // jump to the newest result: the last query table, or the end of the printed output
      const lastTable = body.querySelectorAll(".out-table-wrap");
      if (res.error || P.lang === "python") body.scrollTop = body.scrollHeight;
      else if (lastTable.length) body.scrollTop = lastTable[lastTable.length - 1].offsetTop - 8;
      else body.scrollTop = 0;
      $("#drawer-offline").hidden = !res.offline;
      $("#drawer-time").textContent = `Ran in ${ms < 1000 ? ms + " ms" : (ms / 1000).toFixed(1) + " s"}`;
      openDrawer(true);
    }

    /* ---------- running code */
    async function runCode(withCheck) {
      if (!P || runningNow) return;
      runningNow = true;
      const btn = $("#ws-run"); btn.classList.add("running");
      Sound.run();
      if (activeTab !== P.file) openTab(P.file);
      save();
      const code = ed.value(P.file);
      try {
        if (P.needsPandas || /\bimport\s+pandas|\bfrom\s+pandas/.test(code)) await ensurePandas();
        await new Promise(r => requestAnimationFrame(() => setTimeout(r, 30)));
        const before = new Set(known);
        Runtime.prepare(P);
        const step = P.steps[state.step - 1];
        const t = performance.now();
        const res = Runtime.run(P, code, withCheck && step ? step.check : "");
        const ms = Math.round(performance.now() - t);
        renderOutput(res, ms);
        const files = renderFiles();
        const fresh = files.filter(n => !before.has(n));
        files.forEach(n => known.add(n));
        if (fresh.length) renderFiles(fresh);
        tabs.filter(n => n !== P.file).forEach(n => { if (!files.includes(n)) closeTab(n); });
        if (withCheck) handleCheck(res);
      } catch (err) {
        console.error(err);
        renderOutput({ output: "", tables: [], error: { type: "Problem", message: String(err && err.message || err), line: null, friendly: "Something went wrong running your code. Refresh the page if it keeps happening." } }, 0);
      } finally {
        runningNow = false; btn.classList.remove("running");
      }
    }

    async function ensurePandas() {
      const box = $("#ws-loading");
      let shown = false;
      const t = setTimeout(() => { shown = true; $("#ws-loading-text").textContent = "Loading pandas, Python's data tool…"; box.hidden = false; }, 120);
      try { await Runtime.loadPandas(); } finally { clearTimeout(t); if (shown) box.hidden = true; }
    }

    function handleCheck(res) {
      const ok = res.check && res.check.ok;
      const step = P.steps[state.step - 1];
      feedback = ok ? { ok: true, message: step.success } : { ok: false, message: res.check ? res.check.message : "I couldn't check that. Try running it again." };
      if (ok) { state.passed = true; save(); Sound.success(); }
      else Sound.error();
      if (mode !== "docked") { mode = "docked"; }
      minimized = false;
      renderQuest();
      const q = $("#quest");
      if (!ok && !reduceMotion) { q.classList.remove("shake"); void q.offsetWidth; q.classList.add("shake"); }
      updateProgressBar();
    }

    /* ---------- quest cards */
    const stepBar = (n, now, doneUpTo) => `<div class="quest-steps" aria-hidden="true">${Array.from({ length: n }, (_, i) => `<i class="${i < doneUpTo ? "done" : i === now ? "now" : ""}"></i>`).join("")}</div>`;
    function doneCount() { return Math.max(0, state.step - 1) + (state.passed ? 1 : 0); }

    function updateProgressBar() {
      const n = P.steps.length;
      $("#ws-progress-fill").style.width = (doneCount() / n * 100) + "%";
      $("#ws-step-label").textContent = state.step === 0 ? "Briefing" : state.step > n ? "Complete" : `Step ${state.step} of ${n}`;
    }

    function renderQuest() {
      const q = $("#quest"), scrim = $("#quest-scrim");
      q.hidden = false;
      q.className = "quest";
      const n = P.steps.length;

      if (state.step === 0 || mode === "center") {
        scrim.hidden = false;
        q.classList.add("is-center");
        q.setAttribute("aria-modal", "true");
        if (state.step === 0) {
          const b = P.briefing;
          q.innerHTML = `
            <button class="quest-esc" data-act="accept" aria-label="Close and start"><span class="ring">${icon("i-close")}</span>ESC</button>
            <div class="quest-banner"><div class="art">${Art.project(P.art)}</div>
              <div class="quest-banner-body">
                <div class="quest-project"><span class="mark"></span>Mission briefing</div>
                <h2 class="quest-title" id="quest-title">${esc(P.title)}</h2>
                <div class="feature-meta" style="margin-top:12px">${`<span class="chip lvl-${P.difficulty.toLowerCase()}">${esc(P.difficulty)}</span>`}<span class="chip plain">${icon("i-clock")}~${P.minutes} min</span><span class="chip plain">${n} steps</span></div>
              </div>
            </div>
            <div class="quest-obj">
              <div class="quest-tile">${icon("i-flag")}</div>
              <div class="quest-obj-text"><p class="quest-task">${esc(b.mission)}</p></div>
            </div>
            <div class="quest-section">
              <h3>Where you'd use this at work</h3>
              <ul class="quest-list">${b.jobUse.map(j => `<li>${esc(j)}</li>`).join("")}</ul>
            </div>
            <div class="quest-section" style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;justify-content:space-between">
              <div class="quest-files">${P.files.map(f => `<span class="chip plain">${esc(f)}</span>`).join("")}<span class="chip plain">${esc(P.file)}</span></div>
              <button class="btn btn-primary btn-lg" data-act="accept">${icon("i-play")}Accept mission</button>
            </div>`;
        } else {
          const s = P.steps[state.step - 1];
          q.innerHTML = `
            <button class="quest-esc" data-act="accept" aria-label="Close and start"><span class="ring">${icon("i-close")}</span>ESC</button>
            <div class="quest-banner"><div class="art">${Art.project(P.art)}</div>
              <div class="quest-banner-body">
                <div class="quest-project"><span class="mark"></span>${esc(P.title)} · Step ${state.step} of ${n}</div>
                <h2 class="quest-title" id="quest-title">${esc(s.title)}</h2>
                ${stepBar(n, state.step - 1, state.step - 1)}
              </div>
            </div>
            <div class="quest-obj">
              <div class="quest-tile">${state.step}</div>
              <div class="quest-obj-text">
                <p class="quest-task">${esc(s.task)}</p>
                <p class="quest-why"><b>Why it matters:</b> ${esc(s.why)}</p>
              </div>
              <button class="btn btn-primary btn-lg" data-act="accept">Accept quest</button>
            </div>`;
        }
        setTimeout(() => { const b = q.querySelector(".btn-primary"); if (b) b.focus(); }, 60);
        return;
      }

      // docked
      scrim.hidden = true;
      q.classList.add("is-docked");
      q.setAttribute("aria-modal", "false");
      if (minimized) q.classList.add("is-min");
      if (state.passed) q.classList.add("passed");
      const s = P.steps[state.step - 1];
      const last = state.step === n;
      let fb = "";
      if (feedback) fb = feedback.ok
        ? `<div class="feedback good"><b>Quest complete</b>${esc(feedback.message)}</div>`
        : `<div class="feedback bad"><b>Not quite yet</b>${esc(feedback.message)}</div>`;
      let hintHtml = "";
      if (hint >= 1 && !state.passed) {
        hintHtml = `<div class="hint"><b>Hint</b>${esc(s.nudge)}
          ${hint >= 2 ? `<pre><code>${esc(s.code)}</code></pre><div class="hint-actions"><button class="btn" data-act="copy">${icon("i-copy")}Copy</button><button class="btn" data-act="insert">Add to my code</button></div>` : `<div class="hint-actions" style="margin-top:8px"><button class="btn btn-ghost" data-act="hint2">Show me the code</button></div>`}
        </div>`;
      }
      const actions = state.passed
        ? `<button class="btn btn-ok" data-act="next">${last ? `${icon("i-trophy")}Finish project` : "Next step"}</button><button class="btn btn-ghost" data-act="check">Check again</button>`
        : `<button class="btn btn-primary" data-act="check">${icon("i-check")}Check my work</button>${hint === 0 ? `<button class="btn btn-ghost" data-act="hint1">${icon("i-bulb")}Hint</button>` : ""}`;
      q.innerHTML = `
        <div class="dock-head">
          <div class="dock-row">
            <span class="dock-num">${state.step}/${n}</span>
            <span class="dock-title" id="quest-title">${esc(s.title)}</span>
            <button class="icon-btn" data-act="expand" title="Show this step in the middle" aria-label="Show this step in the middle">${icon("i-expand")}</button>
            <button class="icon-btn dock-min" data-act="min" title="${minimized ? "Expand" : "Minimize"}" aria-label="${minimized ? "Expand" : "Minimize"}">${icon("i-chevron")}</button>
          </div>
          ${stepBar(n, state.step - 1, doneCount())}
        </div>
        <div class="dock-body">
          <p class="dock-task">${esc(s.task)}</p>
          <p class="dock-why"><b>Why:</b> ${esc(s.why)}</p>
          ${fb}${hintHtml}
          <div class="dock-actions">${actions}</div>
        </div>`;
    }

    function onQuestAction(act) {
      const s = P.steps[state.step - 1];
      switch (act) {
        case "accept":
          if (state.step === 0) {
            state.step = 1; state.passed = false; state.startedAt = state.startedAt || Date.now();
            mode = "center"; hint = 0; feedback = null; save(); Sound.open();
            live.step = 1; broadcast();
          } else { mode = "docked"; Sound.dock(); setTimeout(() => ed.focus(), 50); }
          updateProgressBar(); renderQuest(); break;
        case "expand": mode = "center"; Sound.click(); renderQuest(); break;
        case "min": minimized = !minimized; Sound.click(); renderQuest(); break;
        case "check": Sound.click(); runCode(true); break;
        case "hint1": hint = 1; state.hintsUsed = (state.hintsUsed || 0) + 1; save(); Sound.hint(); renderQuest(); break;
        case "hint2": hint = 2; Sound.hint(); renderQuest(); break;
        case "copy": navigator.clipboard && navigator.clipboard.writeText(s.code).then(() => toast("Code copied"), () => toast("Couldn't copy. Select the code and copy it instead.")); break;
        case "insert": if (activeTab !== P.file) openTab(P.file); ed.append(P.file, s.code); toast("Added to the bottom of your file"); break;
        case "next":
          if (state.step >= P.steps.length) { finish(); break; }
          state.step += 1; state.passed = false; hint = 0; feedback = null; mode = "center"; minimized = false;
          save(); Sound.open(); live.step = state.step; broadcast(); updateProgressBar(); renderQuest(); break;
      }
    }

    /* ---------- completion */
    function finish() {
      const n = P.steps.length;
      const mins = Math.max(1, Math.round((Date.now() - (state.startedAt || Date.now())) / 60000));
      const done = doneMap();
      done[P.id] = { minutes: mins, hints: state.hintsUsed || 0, at: Date.now() };
      store.set("hi.done", done);
      state.step = n + 1; state.passed = false; save();
      live.step = n + 1; broadcast();
      $("#quest").hidden = true; $("#quest-scrim").hidden = true;
      updateProgressBar();
      const next = PROJECTS[(PROJECTS.indexOf(P) + 1) % PROJECTS.length];
      const c = $("#complete");
      c.innerHTML = `
        <div class="complete-card">
          <div class="complete-badge">${icon("i-trophy")}</div>
          <p class="complete-kicker">Mission complete</p>
          <h2 id="complete-title">${esc(P.title)}</h2>
          <p class="complete-sub">You finished every step. That's a real project you can talk about.</p>
          <div class="complete-stats">
            <div class="complete-stat"><b>${n}</b><span>steps cleared</span></div>
            <div class="complete-stat"><b>${mins} min</b><span>time spent</span></div>
            <div class="complete-stat"><b>${state.hintsUsed || 0}</b><span>hints used</span></div>
          </div>
          <div class="complete-skills"><h3>You can now:</h3><ul>${P.recap.map(r => `<li>${icon("i-check")}${esc(r)}</li>`).join("")}</ul></div>
          <div class="complete-actions">
            <button class="btn btn-lg" data-done="stay">Keep exploring my code</button>
            <button class="btn btn-lg" data-done="home">Back to projects</button>
            <button class="btn btn-primary btn-lg" data-done="next">${icon("i-play")}Next: ${esc(next.title)}</button>
          </div>
        </div>`;
      c.hidden = false;
      Sound.complete();
      Confetti.burst();
      c.onclick = e => {
        const b = e.target.closest("[data-done]"); if (!b) return;
        Sound.click(); c.hidden = true;
        if (b.dataset.done === "home") leave();
        else if (b.dataset.done === "next") { Workspace.open(next); }
      };
    }

    /* ---------- open / leave */
    async function open(project) {
      Picker.stop();
      P = project;
      $("#complete").hidden = true;
      showScreen("workspace");
      Sound.ambient(0.016);
      if (!ed) ed = makeEditor(); else ed.dropAll();
      $("#ws-title").textContent = P.title;
      $("#ws-folder").textContent = P.id;
      $("#sb-runtime").textContent = P.lang === "sql" ? "SQLite database · runs in your browser" : "Python 3 · runs in your browser";
      openDrawer(false); $("#drawer-body").innerHTML = "";
      const saved = progressOf(P.id);
      state = saved && saved.step <= P.steps.length ? saved : { code: P.starter + "\n", step: 0, hintsUsed: 0, startedAt: 0, passed: false };
      if (saved && saved.step > P.steps.length) state = { code: P.starter + "\n", step: 0, hintsUsed: 0, startedAt: 0, passed: false };
      if (typeof state.code !== "string") state.code = P.starter + "\n";
      hint = 0; feedback = null; minimized = false; mode = "center";
      if (P.needsPandas) await ensurePandas();
      Runtime.prepare(P);
      known = new Set(P.files);
      tabs = [P.file]; activeTab = P.file;
      openTab(P.file);
      updateProgressBar();
      live.project = P.id; live.step = state.step; broadcast();
      if (state.step > 0) {
        mode = "docked";
        toast(`Welcome back. You're on step ${state.step} of ${P.steps.length}.`);
      }
      renderQuest();
      setTimeout(() => ed.layout(), 50);
    }

    function leave() {
      save();
      $("#quest").hidden = true; $("#quest-scrim").hidden = true; $("#complete").hidden = true;
      P = null;
      Picker.show();
    }

    function restart() {
      if (!P) return;
      if (!confirm(`Start "${P.title}" over? Your code for this project will be cleared.`)) return;
      store.del("hi.p." + P.id);
      Sound.click();
      open(P);
    }

    /* ---------- bindings */
    $("#quest").addEventListener("click", e => { const b = e.target.closest("[data-act]"); if (b) onQuestAction(b.dataset.act); });
    $("#quest-scrim").addEventListener("click", () => onQuestAction("accept"));
    $("#ws-run").addEventListener("click", () => runCode(false));
    $("#ws-back").addEventListener("click", () => { Sound.click(); leave(); });
    $("#ws-restart").addEventListener("click", restart);
    $("#drawer-close").addEventListener("click", () => openDrawer(false));
    $("#drawer-body").addEventListener("click", e => { const b = e.target.closest("[data-goto]"); if (b) { if (activeTab !== P.file) openTab(P.file); ed.goto(+b.dataset.goto); } });
    $("#file-list").addEventListener("click", e => { const b = e.target.closest("[data-file]"); if (b) { Sound.click(); openTab(b.dataset.file); } });
    $("#tabs").addEventListener("click", e => {
      const x = e.target.closest("[data-close]"); if (x) { e.stopPropagation(); closeTab(x.dataset.close); return; }
      const t = e.target.closest("[data-tab]"); if (t) openTab(t.dataset.tab);
    });
    document.addEventListener("keydown", e => {
      if (!$("#screen-workspace").classList.contains("is-active") || !P) return;
      if (e.key === "Escape" && !$("#quest").hidden && $("#quest").classList.contains("is-center")) { e.preventDefault(); onQuestAction("accept"); }
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && ed && ed.kind !== "monaco") return;
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && document.activeElement && !document.activeElement.closest("#editor")) { e.preventDefault(); runCode(false); }
    });

    return { open };
  })();

  /* ==========================================================
     CONFETTI
     ========================================================== */
  const Confetti = (() => {
    const c = $("#confetti"), g = c.getContext("2d");
    let bits = [], raf = 0;
    const COLORS = ["#9d6bff", "#e05cff", "#f0c5ff", "#ffffff", "#6ee7b7", "#ffbf73", "#7c3aed"];
    function size() { const d = Math.min(devicePixelRatio || 1, 2); c.width = innerWidth * d; c.height = innerHeight * d; g.setTransform(d, 0, 0, d, 0, 0); }
    function burst() {
      if (reduceMotion) return;
      size();
      const make = (x, dir) => Array.from({ length: 110 }, () => ({
        x, y: innerHeight * 0.75, vx: dir * (4 + Math.random() * 9), vy: -(10 + Math.random() * 12),
        w: 6 + Math.random() * 7, h: 3 + Math.random() * 5, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)], life: 0
      }));
      bits = [...make(0, 1), ...make(innerWidth, -1), ...Array.from({ length: 70 }, () => ({
        x: Math.random() * innerWidth, y: -20 - Math.random() * 200, vx: (Math.random() - 0.5) * 2, vy: 2 + Math.random() * 3,
        w: 6 + Math.random() * 6, h: 3 + Math.random() * 4, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)], life: 0
      }))];
      cancelAnimationFrame(raf);
      const tick = () => {
        g.clearRect(0, 0, innerWidth, innerHeight);
        bits.forEach(b => {
          b.life++; b.vy += 0.32; b.vx *= 0.985; b.vy = Math.min(b.vy, 7); b.x += b.vx; b.y += b.vy; b.r += b.vr;
          g.save(); g.translate(b.x, b.y); g.rotate(b.r); g.scale(1, Math.abs(Math.cos(b.life * 0.12)) + 0.15);
          g.fillStyle = b.color; g.fillRect(-b.w / 2, -b.h / 2, b.w, b.h); g.restore();
        });
        bits = bits.filter(b => b.y < innerHeight + 40);
        if (bits.length) raf = requestAnimationFrame(tick); else g.clearRect(0, 0, innerWidth, innerHeight);
      };
      raf = requestAnimationFrame(tick);
    }
    return { burst };
  })();

  /* ---------- open the Instructor View in a second window: Alt + I */
  document.addEventListener("keydown", e => {
    if (e.altKey && (e.key === "i" || e.key === "I" || e.code === "KeyI")) {
      e.preventDefault();
      window.open("instructor.html", "hiamanda-instructor", "width=1100,height=900");
      setTimeout(broadcast, 800);
    }
  });

  document.addEventListener("DOMContentLoaded", boot);
})();
