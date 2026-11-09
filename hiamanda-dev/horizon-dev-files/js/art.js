/* horizon.dev — generated project artwork (SVG). Original, no image files. */
(function () {
  function rng(seed) {
    let s = seed >>> 0;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }
  let uid = 0;

  function frame(inner, id, focusX = 300) {
    return `<svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id="bg${id}" cx="${focusX / 400}" cy=".45" r=".75">
          <stop offset="0" stop-color="#3b157a"/><stop offset=".45" stop-color="#160a2b"/><stop offset="1" stop-color="#050309"/>
        </radialGradient>
        <radialGradient id="hot${id}" cx=".5" cy=".5" r=".5">
          <stop offset="0" stop-color="#fff"/><stop offset=".18" stop-color="#f5c8ff"/><stop offset=".42" stop-color="#e05cff"/><stop offset=".75" stop-color="#7c3aed" stop-opacity=".5"/><stop offset="1" stop-color="#7c3aed" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="bar${id}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#f0c5ff"/><stop offset=".25" stop-color="#b47bff"/><stop offset="1" stop-color="#4c1d95" stop-opacity=".2"/>
        </linearGradient>
        <filter id="glow${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect width="400" height="220" fill="url(#bg${id})"/>
      ${inner}
    </svg>`;
  }

  const motifs = {
    grid(id) {
      const r = rng(11); let s = "";
      const cols = 16, rows = 9, w = 18, h = 12, gx = 118, gy = 50;
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        const ordered = x > 7;
        const px = gx + x * (w + 4) + (ordered ? 0 : (r() - .5) * 26);
        const py = gy + y * (h + 4) + (ordered ? 0 : (r() - .5) * 22);
        const rot = ordered ? 0 : (r() - .5) * 50;
        const a = ordered ? (0.35 + (y === 2 ? .5 : 0)) : 0.12 + r() * .35;
        const fill = ordered ? (y === 2 ? "#e9c6ff" : "#9d6bff") : "#7c3aed";
        s += `<rect x="${px.toFixed(1)}" y="${py.toFixed(1)}" width="${w}" height="${h}" rx="2" fill="${fill}" fill-opacity="${a.toFixed(2)}" transform="rotate(${rot.toFixed(1)} ${px + w / 2} ${py + h / 2})"/>`;
      }
      s += `<rect x="${gx + 8 * 22 - 4}" y="${gy - 8}" width="2" height="${rows * 16 + 12}" fill="#e05cff" filter="url(#glow${id})"/>`;
      return frame(s, id, 290);
    },
    bars(id) {
      const vals = [.32, .5, .41, .66, .58, .84, .73, .95];
      let s = "", pts = [];
      vals.forEach((v, i) => {
        const x = 150 + i * 28, hgt = v * 140, y = 190 - hgt;
        s += `<rect x="${x}" y="${y}" width="18" height="${hgt}" rx="3" fill="url(#bar${id})"/>`;
        pts.push(`${x + 9},${y - 10}`);
      });
      s += `<polyline points="${pts.join(" ")}" fill="none" stroke="#f0c5ff" stroke-width="2" filter="url(#glow${id})"/>`;
      pts.forEach(p => { const [x, y] = p.split(","); s += `<circle cx="${x}" cy="${y}" r="3" fill="#fff"/>`; });
      s += `<line x1="140" y1="190.5" x2="380" y2="190.5" stroke="#9d6bff" stroke-opacity=".4"/>`;
      return frame(s, id, 300);
    },
    orbit(id) {
      const cx = 290, cy = 112; let s = "";
      s += `<circle cx="${cx}" cy="${cy}" r="58" fill="#12082a" stroke="#9d6bff" stroke-opacity=".6"/>`;
      [-.6, -.25, .15, .5].forEach(k => s += `<ellipse cx="${cx}" cy="${cy + k * 58}" rx="${58 * Math.sqrt(1 - k * k)}" ry="${10 * Math.sqrt(1 - k * k)}" fill="none" stroke="#9d6bff" stroke-opacity=".3"/>`);
      [0, 30, 60].forEach(d => s += `<ellipse cx="${cx}" cy="${cy}" rx="${58 * Math.cos(d * Math.PI / 180) || 1}" ry="58" fill="none" stroke="#9d6bff" stroke-opacity=".25"/>`);
      s += `<ellipse cx="${cx}" cy="${cy}" rx="112" ry="30" fill="none" stroke="#e05cff" stroke-opacity=".7" transform="rotate(-18 ${cx} ${cy})" filter="url(#glow${id})"/>`;
      s += `<circle cx="${cx - 104}" cy="${cy + 40}" r="5" fill="#fff" filter="url(#glow${id})"/>`;
      [26, 44, 62].forEach((rr, i) => s += `<path d="M ${150 - rr * .2} ${70 - rr * .8} a ${rr} ${rr} 0 0 1 ${rr * 1.1} ${rr * .25}" fill="none" stroke="#bb98ff" stroke-opacity="${.8 - i * .22}" stroke-width="2.2" stroke-linecap="round"/>`);
      s += `<circle cx="146" cy="74" r="4" fill="#f0c5ff"/>`;
      return frame(s, id, 290);
    },
    twins(id) {
      let s = ""; const r = rng(5);
      for (let i = 0; i < 7; i++) {
        const y = 28 + i * 25, x = 160 + (i % 2) * 14, w = 150 + r() * 60;
        const hot = i === 1 || i === 4;
        s += `<rect x="${x}" y="${y}" width="${w.toFixed(0)}" height="16" rx="8" fill="${hot ? "#e05cff" : "#7c3aed"}" fill-opacity="${hot ? .85 : .22}" ${hot ? `filter="url(#glow${id})"` : ""}/>`;
        s += `<circle cx="${x + 10}" cy="${y + 8}" r="4" fill="${hot ? "#fff" : "#bb98ff"}" fill-opacity="${hot ? 1 : .5}"/>`;
      }
      s += `<path d="M 154 61 C 120 61 120 136 154 136" fill="none" stroke="#f0c5ff" stroke-width="2" stroke-dasharray="4 4"/>`;
      s += `<circle cx="126" cy="98" r="11" fill="#140a26" stroke="#f0c5ff"/><text x="126" y="102" text-anchor="middle" font-family="monospace" font-size="11" fill="#f0c5ff">=</text>`;
      return frame(s, id, 280);
    },
    nodes(id) {
      let s = "";
      const t = [[150, 38, "owners"], [282, 92, "pets"], [168, 146, "visits"]];
      s += `<path d="M 238 62 C 262 62 262 100 282 104" fill="none" stroke="#e05cff" stroke-width="2" filter="url(#glow${id})"/>`;
      s += `<path d="M 282 128 C 262 150 262 168 256 170" fill="none" stroke="#e05cff" stroke-width="2" filter="url(#glow${id})"/>`;
      t.forEach(([x, y, n], i) => {
        s += `<rect x="${x}" y="${y}" width="88" height="62" rx="6" fill="#120a24" stroke="#9d6bff" stroke-opacity=".7"/>`;
        s += `<rect x="${x}" y="${y}" width="88" height="16" rx="6" fill="#7c3aed" fill-opacity=".7"/>`;
        s += `<text x="${x + 8}" y="${y + 12}" font-family="monospace" font-size="9" fill="#fff">${n}</text>`;
        for (let k = 0; k < 3; k++) s += `<rect x="${x + 8}" y="${y + 24 + k * 12}" width="${[52, 38, 60][(k + i) % 3]}" height="5" rx="2" fill="#bb98ff" fill-opacity="${k === 0 ? .8 : .3}"/>`;
      });
      return frame(s, id, 250);
    }
  };

  window.Art = {
    project(type) { uid++; return (motifs[type] || motifs.grid)("a" + uid); }
  };
})();
