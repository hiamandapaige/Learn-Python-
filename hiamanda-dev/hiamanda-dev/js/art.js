/* horizon.dev — artwork for each project world, drawn as SVG. Original, no image files.
   Each scene is 400 x 220 and keeps its subject on the right, so text can sit on the left. */
(function () {
  let uid = 0;
  function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  const svg = (inner, defs = "") => `<svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>${defs}</defs>${inner}</svg>`;
  const blur = (id, d = 3) => `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${d}" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;

  /* ---------------- Spin Cycle: an all-night laundromat ---------------- */
  function laundromat(id) {
    const r = rng(3);
    let s = "";
    const defs = `
      <linearGradient id="wall${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#06201c"/><stop offset="1" stop-color="#0b2e29"/></linearGradient>
      <radialGradient id="lamp${id}" cx=".72" cy="0" r=".9"><stop offset="0" stop-color="#bdfff0" stop-opacity=".35"/><stop offset="1" stop-color="#bdfff0" stop-opacity="0"/></radialGradient>
      <radialGradient id="glass${id}" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#d7fff2"/><stop offset=".35" stop-color="#4fe3b5"/><stop offset="1" stop-color="#0b5e4d"/></radialGradient>
      <linearGradient id="body${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9f4f1"/><stop offset="1" stop-color="#a9c4be"/></linearGradient>
      ${blur("g" + id, 2.5)}`;
    s += `<rect width="400" height="220" fill="url(#wall${id})"/>`;
    // tiled floor
    for (let i = 0; i < 12; i++) for (let j = 0; j < 3; j++) s += `<rect x="${i * 36 - (j % 2) * 18}" y="${180 + j * 14}" width="36" height="14" fill="${(i + j) % 2 ? "#0b2b27" : "#0f3a34"}"/>`;
    s += `<rect width="400" height="220" fill="url(#lamp${id})"/>`;
    // neon sign
    s += `<g filter="url(#g${id})"><rect x="232" y="18" width="128" height="30" rx="15" fill="none" stroke="#ffb3d1" stroke-width="2.4"/>
      <text x="296" y="39" text-anchor="middle" font-family="Fredoka, Sora, sans-serif" font-weight="600" font-size="17" textLength="96" lengthAdjust="spacingAndGlyphs" fill="#ffd6e7">open 24 hrs</text></g>`;
    // three front-loading washers
    [170, 248, 326].forEach((x, k) => {
      s += `<rect x="${x}" y="72" width="70" height="108" rx="8" fill="url(#body${id})"/>`;
      s += `<rect x="${x}" y="72" width="70" height="20" rx="8" fill="#d2e4e0"/><rect x="${x}" y="84" width="70" height="8" fill="#d2e4e0"/>`;
      s += `<circle cx="${x + 12}" cy="82" r="3" fill="${k === 1 ? "#ff7aa8" : "#19b48f"}"/><rect x="${x + 36}" y="78" width="26" height="7" rx="2" fill="#0b2b27"/>`;
      s += `<text x="${x + 49}" y="84" text-anchor="middle" font-family="monospace" font-size="5.5" fill="#8ff5d2">${["12:40", "08:15", "00:52"][k]}</text>`;
      const cx = x + 35, cy = 134;
      s += `<circle cx="${cx}" cy="${cy}" r="27" fill="#8fa9a3"/><circle cx="${cx}" cy="${cy}" r="22" fill="url(#glass${id})"/>`;
      // tumbling laundry inside the glass
      const cols = ["#ff7aa8", "#ffd27a", "#7ac6ff", "#ffffff"];
      for (let i = 0; i < 4; i++) {
        const a = r() * Math.PI * 2, rr = 7 + r() * 9;
        s += `<path d="M ${cx + Math.cos(a) * rr} ${cy + Math.sin(a) * rr} q ${6 - r() * 12} ${-6 + r() * 12} ${10 - r() * 20} ${4 - r() * 8}" stroke="${cols[(i + k) % 4]}" stroke-width="${3 + r() * 2}" stroke-linecap="round" fill="none" opacity=".9"/>`;
      }
      s += `<path d="M ${cx - 14} ${cy - 10} a 17 17 0 0 1 16 -8" stroke="#fff" stroke-width="2.5" stroke-linecap="round" fill="none" opacity=".7"/>`;
    });
    // bubbles
    for (let i = 0; i < 22; i++) {
      const bx = 150 + r() * 250, by = 10 + r() * 150, br = 2 + r() * 7;
      s += `<circle cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="${br.toFixed(1)}" fill="#d7fff2" fill-opacity=".08" stroke="#d7fff2" stroke-opacity=".55" stroke-width="1"/>`;
      s += `<circle cx="${(bx - br * .35).toFixed(1)}" cy="${(by - br * .35).toFixed(1)}" r="${(br * .22).toFixed(1)}" fill="#fff" fill-opacity=".7"/>`;
    }
    return svg(s, defs);
  }

  /* ---------------- Bean Counter: a coffee shop back office ---------------- */
  function coffee(id) {
    const defs = `
      <radialGradient id="pend${id}" cx=".78" cy=".1" r=".75"><stop offset="0" stop-color="#ffd9a8" stop-opacity=".45"/><stop offset=".5" stop-color="#c97b34" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
      <linearGradient id="board${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1f2a24"/><stop offset="1" stop-color="#141c18"/></linearGradient>
      <linearGradient id="wood${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6e3d17"/><stop offset="1" stop-color="#3b1f0b"/></linearGradient>
      <linearGradient id="cup${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff6ea"/><stop offset="1" stop-color="#d9c5ad"/></linearGradient>
      ${blur("g" + id, 2)}`;
    let s = `<rect width="400" height="220" fill="#1b110c"/>`;
    for (let x = 0; x < 400; x += 22) s += `<rect x="${x}" y="0" width="1" height="220" fill="#000" opacity=".25"/>`;
    s += `<rect width="400" height="220" fill="url(#pend${id})"/>`;
    // pendant lamp
    s += `<line x1="320" y1="0" x2="320" y2="22" stroke="#000" stroke-width="2"/><path d="M 302 34 L 338 34 L 330 22 L 310 22 Z" fill="#2a1a10"/><ellipse cx="320" cy="35" rx="9" ry="3" fill="#ffe2b8" filter="url(#g${id})"/>`;
    // chalkboard with a hand-drawn bar chart
    s += `<rect x="168" y="44" width="150" height="98" rx="4" fill="#5a3418"/><rect x="174" y="50" width="138" height="86" rx="2" fill="url(#board${id})"/>`;
    s += `<text x="182" y="66" font-family="Fraunces, Georgia, serif" font-style="italic" font-size="11" fill="#f5ebe0" opacity=".9">sales by month</text>`;
    const v = [28, 36, 31, 44, 50, 58];
    v.forEach((h, i) => {
      const x = 186 + i * 19, y = 126 - h;
      s += `<path d="M ${x} 126 L ${x} ${y} L ${x + 12} ${y + 1} L ${x + 12} 126" fill="none" stroke="#f5ebe0" stroke-width="1.4" stroke-linejoin="round" opacity=".85"/>`;
      for (let k = y + 4; k < 126; k += 4) s += `<line x1="${x + 1}" y1="${k}" x2="${x + 11}" y2="${k - 3}" stroke="#e8a45b" stroke-width=".8" opacity=".55"/>`;
    });
    s += `<path d="M 184 126.5 L 304 126.5" stroke="#f5ebe0" stroke-width="1.2" opacity=".7"/>`;
    s += `<path d="M 190 96 C 220 92, 250 84, 296 62" fill="none" stroke="#ffd9a8" stroke-width="1.4" stroke-dasharray="3 3"/>`;
    // counter
    s += `<rect x="0" y="168" width="400" height="52" fill="url(#wood${id})"/><rect x="0" y="166" width="400" height="4" fill="#a0642c"/>`;
    // cup and saucer with steam
    s += `<ellipse cx="350" cy="172" rx="34" ry="6" fill="#d9c5ad"/>`;
    s += `<path d="M 326 128 L 374 128 L 368 168 Q 350 174 332 168 Z" fill="url(#cup${id})"/>`;
    s += `<path d="M 373 136 q 16 2 12 16 q -3 9 -14 8" fill="none" stroke="#e7d6c1" stroke-width="5"/>`;
    s += `<ellipse cx="350" cy="128" rx="24" ry="5" fill="#3b1f0b"/><ellipse cx="348" cy="127" rx="10" ry="2" fill="#8a5428"/>`;
    [338, 350, 362].forEach((x, i) => s += `<path d="M ${x} 118 c -8 -10 8 -16 0 -28 c -6 -9 6 -14 2 -24" fill="none" stroke="#fbe8d0" stroke-width="2.4" stroke-linecap="round" opacity="${.5 - i * .1}"/>`);
    // a few beans on the counter
    [[250, 186, 20], [266, 192, -30], [236, 194, 60], [282, 184, 10]].forEach(([x, y, a]) => s += `<g transform="rotate(${a} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="7" ry="5" fill="#3a1d0c"/><path d="M ${x - 6} ${y} q 6 -3 12 0" stroke="#7a4a24" stroke-width="1.2" fill="none"/></g>`);
    return svg(s, defs);
  }

  /* ---------------- Skywatch: a weather station at night ---------------- */
  function radar(id) {
    const r = rng(9);
    const defs = `
      <linearGradient id="sky${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#030712"/><stop offset=".7" stop-color="#0a1a3a"/><stop offset="1" stop-color="#123063"/></linearGradient>
      <radialGradient id="scope${id}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#0f3550"/><stop offset="1" stop-color="#06142a"/></radialGradient>
      <linearGradient id="sweep${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4fc3ff" stop-opacity="0"/><stop offset="1" stop-color="#4fc3ff" stop-opacity=".55"/></linearGradient>
      ${blur("g" + id, 2)}`;
    let s = `<rect width="400" height="220" fill="url(#sky${id})"/>`;
    for (let i = 0; i < 50; i++) s += `<circle cx="${(r() * 400).toFixed(0)}" cy="${(r() * 120).toFixed(0)}" r="${(r() * 1.1 + .3).toFixed(1)}" fill="#d9f3ff" opacity="${(r() * .6 + .2).toFixed(2)}"/>`;
    // clouds
    const cloud = (x, y, k, o) => `<g opacity="${o}" fill="#1b3560"><ellipse cx="${x}" cy="${y}" rx="${34 * k}" ry="${12 * k}"/><ellipse cx="${x - 16 * k}" cy="${y - 7 * k}" rx="${16 * k}" ry="${12 * k}"/><ellipse cx="${x + 10 * k}" cy="${y - 11 * k}" rx="${20 * k}" ry="${15 * k}"/></g>`;
    s += cloud(170, 60, 1.2, .8) + cloud(380, 40, 1, .7);
    // hills and a radio mast
    s += `<path d="M 0 190 Q 90 160 180 182 T 400 170 L 400 220 L 0 220 Z" fill="#050d1e"/>`;
    s += `<path d="M 196 186 L 206 96 L 216 186 M 199 160 L 213 160 M 201 135 L 211 135 M 203 112 L 209 112 M 199 160 L 211 135 M 213 160 L 201 135" stroke="#3b5a86" stroke-width="1.6" fill="none"/>`;
    s += `<circle cx="206" cy="94" r="3" fill="#ff6b6b" filter="url(#g${id})"/>`;
    // radar scope
    const cx = 312, cy = 120, R = 62;
    s += `<circle cx="${cx}" cy="${cy}" r="${R + 6}" fill="#0b1a33" stroke="#1e3354" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#scope${id})"/>`;
    [R * .33, R * .66, R].forEach(rr => s += `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="none" stroke="#4fc3ff" stroke-opacity=".3"/>`);
    s += `<line x1="${cx - R}" y1="${cy}" x2="${cx + R}" y2="${cy}" stroke="#4fc3ff" stroke-opacity=".25"/><line x1="${cx}" y1="${cy - R}" x2="${cx}" y2="${cy + R}" stroke="#4fc3ff" stroke-opacity=".25"/>`;
    s += `<path d="M ${cx} ${cy} L ${cx + R} ${cy} A ${R} ${R} 0 0 0 ${cx + R * Math.cos(-0.9)} ${cy + R * Math.sin(-0.9)} Z" fill="url(#sweep${id})"/>`;
    s += `<line x1="${cx}" y1="${cy}" x2="${cx + R}" y2="${cy}" stroke="#a8f0ff" stroke-width="1.6" filter="url(#g${id})"/>`;
    // weather blobs and blips
    s += `<ellipse cx="${cx + 26}" cy="${cy - 22}" rx="14" ry="9" fill="#4fc3ff" opacity=".35"/><ellipse cx="${cx + 30}" cy="${cy - 24}" rx="6" ry="4" fill="#ffd479" opacity=".7"/>`;
    s += `<ellipse cx="${cx - 24}" cy="${cy + 20}" rx="18" ry="8" fill="#4fc3ff" opacity=".25"/>`;
    [[cx + 40, cy + 12], [cx - 12, cy - 34], [cx + 8, cy + 40]].forEach(([x, y]) => s += `<circle cx="${x}" cy="${y}" r="2.4" fill="#d9f3ff" filter="url(#g${id})"/>`);
    // light rain on the left
    for (let i = 0; i < 26; i++) { const x = 110 + r() * 120, y = 70 + r() * 100; s += `<line x1="${x}" y1="${y}" x2="${x - 3}" y2="${y + 9}" stroke="#94dcff" stroke-opacity=".4"/>`; }
    return svg(s, defs);
  }

  /* ---------------- Double Take: a theater box office ---------------- */
  function tickets(id) {
    const defs = `
      <radialGradient id="spot${id}" cx=".72" cy=".2" r=".8"><stop offset="0" stop-color="#ff5d6c" stop-opacity=".45"/><stop offset=".6" stop-color="#7a1020" stop-opacity=".15"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
      <linearGradient id="tix${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe9c7"/><stop offset="1" stop-color="#f3c98a"/></linearGradient>
      ${blur("g" + id, 2)}`;
    let s = `<rect width="400" height="220" fill="#160609"/>`;
    // velvet curtain folds
    for (let x = 0; x < 400; x += 20) s += `<rect x="${x}" y="0" width="20" height="220" fill="${(x / 20) % 2 ? "#2a0a10" : "#200810"}"/>`;
    s += `<rect width="400" height="220" fill="url(#spot${id})"/>`;
    // marquee frame with bulbs
    s += `<rect x="168" y="16" width="216" height="40" rx="4" fill="#3a0d17" stroke="#ffd36b" stroke-opacity=".6"/>`;
    for (let i = 0; i < 18; i++) s += `<circle cx="${176 + i * 11.8}" cy="21" r="2.4" fill="#ffd36b" filter="url(#g${id})"/><circle cx="${176 + i * 11.8}" cy="51" r="2.4" fill="#ffd36b" filter="url(#g${id})"/>`;
    s += `<text x="276" y="44" text-anchor="middle" font-family="'Bebas Neue', Impact, sans-serif" font-size="20" textLength="176" lengthAdjust="spacingAndGlyphs" fill="#fff0ec">NOW SHOWING · TWICE</text>`;
    // two identical tickets: the original and its duplicate
    const ticket = (x, y, rot, shade) => {
      const w = 120, h = 58;
      let t = `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})">`;
      t += `<path d="M ${x} ${y} h ${w} v ${h * .35} a 7 7 0 0 0 0 ${h * .3} v ${h * .35} h ${-w} v ${-h * .35} a 7 7 0 0 0 0 ${-h * .3} Z" fill="url(#tix${id})"${shade ? ` opacity="${shade}"` : ""}/>`;
      t += `<line x1="${x + 84}" y1="${y + 5}" x2="${x + 84}" y2="${y + h - 5}" stroke="#c1873b" stroke-dasharray="3 3"/>`;
      t += `<text x="${x + 42}" y="${y + 27}" text-anchor="middle" font-family="'Bebas Neue', Impact, sans-serif" font-size="19" textLength="64" lengthAdjust="spacingAndGlyphs" fill="#7a1020">ADMIT ONE</text>`;
      t += `<text x="${x + 42}" y="${y + 42}" text-anchor="middle" font-family="monospace" font-size="7" fill="#9a4b2a">ROW F · SEAT 12</text>`;
      t += `<text x="${x + 102}" y="${y + 33}" text-anchor="middle" font-family="monospace" font-size="8" fill="#7a1020" transform="rotate(-90 ${x + 102} ${y + 30})">No. 0417</text>`;
      return t + `</g>`;
    };
    s += ticket(200, 86, -8, .55);
    s += ticket(236, 104, 6, 0);
    // "same" stamp
    s += `<g transform="rotate(-14 330 168)"><rect x="300" y="154" width="64" height="26" rx="4" fill="none" stroke="#ff5d6c" stroke-width="2.5"/><text x="332" y="173" text-anchor="middle" font-family="'Bebas Neue', Impact, sans-serif" font-size="19" textLength="46" lengthAdjust="spacingAndGlyphs" fill="#ff5d6c">SAME?</text></g>`;
    return svg(s, defs);
  }

  /* ---------------- Paws & Keys: a vet clinic records room ---------------- */
  function clinic(id) {
    const r = rng(21);
    const defs = `
      <radialGradient id="warm${id}" cx=".7" cy=".3" r=".8"><stop offset="0" stop-color="#ffd43b" stop-opacity=".22"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
      <linearGradient id="paper${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffdf3"/><stop offset="1" stop-color="#efe7cc"/></linearGradient>`;
    let s = `<rect width="400" height="220" fill="#1a1810"/>`;
    // pegboard dots
    for (let x = 6; x < 400; x += 14) for (let y = 6; y < 220; y += 14) s += `<circle cx="${x}" cy="${y}" r="1.2" fill="#2d2a1d"/>`;
    s += `<rect width="400" height="220" fill="url(#warm${id})"/>`;
    // three record cards linked by string: owners -> pets -> visits
    const card = (x, y, rot, title, lines) => {
      let c = `<g transform="rotate(${rot} ${x + 45} ${y + 30})"><rect x="${x}" y="${y}" width="90" height="62" rx="3" fill="url(#paper${id})"/>`;
      c += `<rect x="${x}" y="${y}" width="90" height="14" rx="3" fill="#ffd43b"/><rect x="${x}" y="${y + 8}" width="90" height="6" fill="#ffd43b"/>`;
      c += `<text x="${x + 7}" y="${y + 11}" font-family="Caveat, cursive" font-weight="700" font-size="13" fill="#3a2f05">${title}</text>`;
      lines.forEach((w, i) => c += `<rect x="${x + 7}" y="${y + 22 + i * 10}" width="${w}" height="3" rx="1.5" fill="#b9ae88"/>`);
      c += `<circle cx="${x + 45}" cy="${y - 2}" r="3.5" fill="#e0533d"/></g>`;
      return c;
    };
    s += `<path d="M 233 52 C 262 68, 268 92, 300 100" stroke="#e0533d" stroke-width="1.6" fill="none"/>`;
    s += `<path d="M 330 128 C 320 150, 284 150, 262 156" stroke="#e0533d" stroke-width="1.6" fill="none"/>`;
    s += card(176, 24, -4, "owners", [60, 44, 52, 38]);
    s += card(288, 70, 5, "pets", [40, 58, 46, 30]);
    s += card(196, 134, -2, "visits", [64, 50, 58, 42]);
    // paw print trail
    const paw = (x, y, k, a, o) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${k})" fill="#ffd43b" opacity="${o}"><ellipse cx="0" cy="4" rx="6" ry="5"/><ellipse cx="-6" cy="-4" rx="2.4" ry="3"/><ellipse cx="-2" cy="-7.5" rx="2.4" ry="3"/><ellipse cx="2.5" cy="-7.5" rx="2.4" ry="3"/><ellipse cx="6.5" cy="-4" rx="2.4" ry="3"/></g>`;
    [[150, 200, -20], [176, 186, 10], [140, 170, -25], [165, 154, 5], [128, 138, -30]].forEach(([x, y, a], i) => s += paw(x, y, 1, a, .25 + i * .1));
    // a key on a tag (primary keys)
    s += `<g transform="rotate(18 350 186)"><circle cx="330" cy="186" r="9" fill="none" stroke="#ffe57a" stroke-width="3"/><rect x="338" y="184" width="34" height="5" rx="2" fill="#ffe57a"/><rect x="362" y="189" width="4" height="6" fill="#ffe57a"/><rect x="368" y="189" width="4" height="8" fill="#ffe57a"/></g>`;
    for (let i = 0; i < 8; i++) s += `<circle cx="${r() * 400}" cy="${r() * 220}" r="1" fill="#fff1a8" opacity=".3"/>`;
    return svg(s, defs);
  }

  const SCENES = { laundromat, coffee, radar, tickets, clinic };
  // the color at each scene's left edge, used to extend it for wide banners
  const EDGE = { laundromat: "#082622", coffee: "#1b110c", radar: "#0a1733", tickets: "#1d070c", clinic: "#1a1810" };
  window.Art = {
    project(type, opts) {
      uid++;
      const key = SCENES[type] ? type : "laundromat";
      const scene = SCENES[key]("a" + uid);
      if (!(opts && opts.wide)) return scene;
      // wide banners: keep the scene whole on the right and extend its edge color to the left
      const inner = scene.replace("<svg ", '<svg x="0" y="0" width="400" height="220" ');
      const e = EDGE[key], f = "f" + uid;
      return `<svg viewBox="-580 0 980 220" preserveAspectRatio="xMaxYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs><linearGradient id="${f}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${e}"/><stop offset="1" stop-color="${e}" stop-opacity="0"/></linearGradient></defs>
        <rect x="-580" y="0" width="582" height="220" fill="${e}"/>${inner}<rect x="0" y="0" width="150" height="220" fill="url(#${f})"/></svg>`;
    }
  };
})();
