/* =====================================================================
   horizon.dev — project worlds
   Each project is its own stand-alone entry with its own setting, colors,
   typeface, editor colors, celebration and artwork (drawn in js/art.js).
   The launcher (welcome + picker) keeps the horizon.dev purple.
   ===================================================================== */
(function () {
  const hexRgb = h => { const n = parseInt(h.slice(1), 16); return `${n >> 16 & 255}, ${n >> 8 & 255}, ${n & 255}`; };

  const WORLDS = {
    "clean-csv": {
      name: "Spin Cycle",
      place: "Suds & Sons Laundromat · open 24 hours",
      doneLine: "Load complete",
      art: "laundromat",
      font: "'Fredoka', 'Sora', sans-serif", weight: 600, track: "0",
      confetti: { shape: "bubble", colors: ["#8ff5d2", "#4fe3b5", "#ffffff", "#ffb3d1", "#bdf7ff"] },
      c: {
        void: "#04100f", ink1: "#071816", ink2: "#0b201e", ink3: "#112b28", ink4: "#183834", line: "#1f4440", lineSoft: "#14302d",
        a100: "#d7fff2", a300: "#8ff5d2", a400: "#4fe3b5", a500: "#19b48f", a700: "#0b5e4d", plasma: "#bdfff0", glowHi: "#e9fff8",
        text: "#e6fbf5", dim: "#9cc4bb", faint: "#5f8a82", card: "#0a1d1b", cardDeep: "#071513", editor: "#061412",
        btnTop: "#5ff0c2", btnBot: "#22c49c", btnBorder: "#8ff5d2", onAccent: "#03201a"
      },
      ed: { kw: "4FE3B5", str: "FFB3D1", num: "FFD27A", com: "4F7A72", fn: "9AD8FF", text: "E3F7F1", lineNo: "2A4D47", sel: "19B48F55", cur: "8FF5D2", hl: "0B201E" }
    },

    "sales-sql": {
      name: "Bean Counter",
      place: "Brew & Bean Coffee · the back office",
      doneLine: "Order up",
      art: "coffee",
      font: "'Fraunces', Georgia, serif", weight: 600, track: "-0.01em",
      confetti: { shape: "bean", colors: ["#6e3d17", "#a0642c", "#e8a45b", "#f2c58f", "#fbe8d0"] },
      c: {
        void: "#0d0806", ink1: "#140c08", ink2: "#1b110c", ink3: "#251812", ink4: "#31211a", line: "#3d2a20", lineSoft: "#2a1c15",
        a100: "#fbe8d0", a300: "#f2c58f", a400: "#e8a45b", a500: "#c97b34", a700: "#6e3d17", plasma: "#ffd9a8", glowHi: "#fff2df",
        text: "#f5ebe0", dim: "#c4ab95", faint: "#8a705c", card: "#1a100b", cardDeep: "#140c08", editor: "#110a07",
        btnTop: "#efb26a", btnBot: "#cf8540", btnBorder: "#f2c58f", onAccent: "#221006"
      },
      ed: { kw: "E8A45B", str: "B7D68A", num: "F2C58F", com: "7A6252", fn: "F0D7B8", text: "F2E6DA", lineNo: "4A3528", sel: "C97B3455", cur: "F2C58F", hl: "1B110C" }
    },

    "weather-api": {
      name: "Skywatch",
      place: "Weather Station 7 · night shift",
      doneLine: "Forecast delivered",
      art: "radar",
      font: "'Chakra Petch', 'Sora', sans-serif", weight: 600, track: "0.01em",
      confetti: { shape: "drop", colors: ["#4fc3ff", "#94dcff", "#d9f3ff", "#ffd479", "#ffffff"] },
      c: {
        void: "#030712", ink1: "#060c1a", ink2: "#0a1324", ink3: "#101c33", ink4: "#172742", line: "#1e3354", lineSoft: "#142440",
        a100: "#d9f3ff", a300: "#94dcff", a400: "#4fc3ff", a500: "#1f8fd9", a700: "#0d4f86", plasma: "#a8f0ff", glowHi: "#e8fbff",
        text: "#e6f1ff", dim: "#94aecb", faint: "#6a84a6", card: "#081226", cardDeep: "#060d1c", editor: "#050b18",
        btnTop: "#5ccbff", btnBot: "#2196e0", btnBorder: "#94dcff", onAccent: "#021526"
      },
      ed: { kw: "4FC3FF", str: "FFD479", num: "FF9D6E", com: "4D6487", fn: "B6F2C8", text: "E0ECFF", lineNo: "24395C", sel: "1F8FD955", cur: "94DCFF", hl: "0A1324" }
    },

    "duplicates": {
      name: "Double Take",
      place: "The Rialto box office · two shows tonight",
      doneLine: "That's a wrap",
      art: "tickets",
      font: "'Bebas Neue', 'Sora', sans-serif", weight: 400, track: "0.03em",
      confetti: { shape: "ticket", colors: ["#ffd36b", "#ff5d6c", "#fff0ec", "#ff9aa5", "#ffb347"] },
      c: {
        void: "#0e0306", ink1: "#160609", ink2: "#1e0a0e", ink3: "#2a0f15", ink4: "#38151d", line: "#4a1c26", lineSoft: "#301118",
        a100: "#ffe1e4", a300: "#ff9aa5", a400: "#ff5d6c", a500: "#d9273d", a700: "#7a1020", plasma: "#ffd36b", glowHi: "#fff4d6",
        text: "#fff0ec", dim: "#d1a3a3", faint: "#a06e72", card: "#1c080c", cardDeep: "#150609", editor: "#120407",
        btnTop: "#d42a40", btnBot: "#a8152a", btnBorder: "#ff8593", onAccent: "#ffffff"
      },
      ed: { kw: "FF5D6C", str: "FFD36B", num: "FFB08A", com: "7D4A50", fn: "FFC2CB", text: "FBE6E3", lineNo: "52222C", sel: "D9273D55", cur: "FFD36B", hl: "1E0A0E" }
    },

    "relational-db": {
      name: "Paws & Keys",
      place: "Maple Street Vet · the records room",
      doneLine: "All patients seen",
      art: "clinic",
      font: "'Caveat', 'Sora', cursive", weight: 700, track: "0",
      titleScale: 1.3,
      confetti: { shape: "paw", colors: ["#ffd43b", "#fff1a8", "#ffab70", "#9fe0b0", "#f7f3e6"] },
      c: {
        void: "#0c0b07", ink1: "#13120c", ink2: "#1a1810", ink3: "#242116", ink4: "#302c1e", line: "#3d3826", lineSoft: "#29261a",
        a100: "#fff6cc", a300: "#ffe57a", a400: "#ffd43b", a500: "#d9a710", a700: "#6e5406", plasma: "#fff1a8", glowHi: "#fffbe6",
        text: "#f7f3e6", dim: "#bdb59a", faint: "#7f7860", card: "#18160e", cardDeep: "#13120b", editor: "#100f09",
        btnTop: "#ffd84d", btnBot: "#e6b01c", btnBorder: "#ffe57a", onAccent: "#1f1800"
      },
      ed: { kw: "FFD43B", str: "9FE0B0", num: "FFAB70", com: "6F6950", fn: "A9D4FF", text: "F2EEDF", lineNo: "45402C", sel: "D9A71055", cur: "FFE57A", hl: "1A1810" }
    }
  };

  // CSS custom properties for a world, so any element can take on its look
  function vars(w) {
    const c = w.c;
    return {
      "--void": c.void, "--ink-1": c.ink1, "--ink-2": c.ink2, "--ink-3": c.ink3, "--ink-4": c.ink4,
      "--line": c.line, "--line-soft": c.lineSoft,
      "--violet-100": c.a100, "--violet-300": c.a300, "--violet-400": c.a400, "--violet-500": c.a500, "--violet-700": c.a700,
      "--plasma": c.plasma, "--glow-hi": c.glowHi,
      "--a400-rgb": hexRgb(c.a400), "--a500-rgb": hexRgb(c.a500), "--a700-rgb": hexRgb(c.a700), "--plasma-rgb": hexRgb(c.plasma),
      "--void-rgb": hexRgb(c.void), "--card-rgb": hexRgb(c.card),
      "--card-bg": c.card, "--card-deep": c.cardDeep, "--editor-bg": c.editor,
      "--text": c.text, "--text-dim": c.dim, "--text-faint": c.faint,
      "--btn-top": c.btnTop, "--btn-bot": c.btnBot, "--btn-border": c.btnBorder, "--on-accent": c.onAccent,
      "--font-world": w.font, "--world-weight": String(w.weight), "--world-track": w.track, "--world-scale": String(w.titleScale || 1),
      "--tok-kw": "#" + w.ed.kw, "--tok-str": "#" + w.ed.str, "--tok-num": "#" + w.ed.num, "--tok-com": "#" + w.ed.com, "--tok-fn": "#" + w.ed.fn
    };
  }
  const ALL_KEYS = Object.keys(vars(WORLDS["clean-csv"]));

  window.Worlds = {
    get(id) { return WORLDS[id]; },
    vars,
    apply(el, world) {
      ALL_KEYS.forEach(k => el.style.removeProperty(k));
      if (!world) { el.removeAttribute("data-world"); return; }
      const v = vars(world);
      Object.keys(v).forEach(k => el.style.setProperty(k, v[k]));
      el.setAttribute("data-world", world.art);
    },
    styleAttr(world) {
      const v = vars(world);
      return Object.keys(v).map(k => `${k}:${v[k]}`).join(";").replace(/"/g, "&quot;");
    }
  };

  (window.PROJECTS || []).forEach(p => { p.world = WORLDS[p.id]; });
})();
