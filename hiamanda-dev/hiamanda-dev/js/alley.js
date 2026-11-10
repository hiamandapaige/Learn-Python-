/* horizon.dev — the welcome screen's back alley, painted live on a canvas.
   An original scene: no image files. The still parts are painted once per resize;
   the neon flicker, steam, rain and fog animate every frame. */
(function () {
  "use strict";
  let geo = null, base = null;

  function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  const clamp = v => Math.max(0, Math.min(255, Math.round(v)));

  function geometry(W, H) {
    const narrow = W < 860;
    const vpX = narrow ? W * 0.5 : W * 0.7;
    const vpY = narrow ? H * 0.22 : H * 0.46;
    const F = narrow ? H * 0.5 : H * 0.82;
    const camY = 1.7, L = narrow ? -2.6 : -4.6, R = narrow ? 2.6 : 2.4, TOP = 16, FAR = 46;
    const P = (x, y, z) => { const s = F / (z + 1.2); return [vpX + x * s, vpY + (camY - y) * s]; };
    const S = z => F / (z + 1.2);
    const signA = { x0: R - 1.35, x1: R - 0.12, y0: 3.3, y1: 5.5, z: 7 };      // "</>" sign on the right wall
    const signB = { x0: L + 0.12, x1: L + 0.95, y0: 3.4, y1: 7.2, z: 22 };     // "DEV" sign deeper on the left
    const orb = P((L + R) / 2, 3.4, FAR);
    return { W, H, narrow, vpX, vpY, F, camY, L, R, TOP, FAR, P, S, signA, signB, orb };
  }

  function poly(g, pts) { g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); }

  // light reaching a point: purple from the far end, amber from sign A, magenta from sign B
  function light(gm, x, y, z) {
    const ip = Math.pow(z / gm.FAR, 2) * 0.72 + 0.015;
    const a = gm.signA, b = gm.signB;
    const da = Math.hypot(x - (a.x0 + a.x1) / 2, y - (a.y0 + a.y1) / 2, z - a.z);
    const db = Math.hypot(x - (b.x0 + b.x1) / 2, y - (b.y0 + b.y1) / 2, z - b.z);
    return { ip, ia: 0.85 * Math.exp(-da * da / 9), im: 0.7 * Math.exp(-db * db / 14) };
  }
  function shade(l, k) {
    return `rgb(${clamp((6 + 72 * l.ip + 190 * l.ia + 110 * l.im) * k)}, ${clamp((4 + 30 * l.ip + 92 * l.ia + 24 * l.im) * k)}, ${clamp((12 + 140 * l.ip + 34 * l.ia + 130 * l.im) * k)})`;
  }

  function paintWall(g, gm, x, r) {
    const { P, TOP, FAR } = gm;
    g.fillStyle = "#030206";
    poly(g, [P(x, 0, 0), P(x, 0, FAR), P(x, TOP, FAR), P(x, TOP, 0)]); g.fill();
    const bh = 0.3, bl = 0.78;
    for (let row = 0, y = 0; y < TOP; row++, y += bh) {
      const off = row % 2 ? bl / 2 : 0;
      for (let z = -off; z < FAR; z += bl) {
        const z0 = Math.max(0, z + 0.03), z1 = Math.min(FAR, z + bl - 0.03);
        if (z1 <= z0) continue;
        const k = 0.72 + r() * 0.42;
        g.fillStyle = shade(light(gm, x, y + bh / 2, (z0 + z1) / 2), k);
        poly(g, [P(x, y + 0.035, z0), P(x, y + 0.035, z1), P(x, y + bh, z1), P(x, y + bh, z0)]); g.fill();
      }
    }
    // grime: darker toward the top and near the camera
    const [nx] = P(x, 0, 0), [fx] = P(x, 0, FAR);
    const gr = g.createLinearGradient(nx, 0, fx, 0);
    gr.addColorStop(0, "rgba(2, 1, 4, .82)"); gr.addColorStop(0.55, "rgba(2, 1, 4, .35)"); gr.addColorStop(1, "rgba(2, 1, 4, 0)");
    g.fillStyle = gr;
    poly(g, [P(x, 0, 0), P(x, 0, FAR), P(x, TOP, FAR), P(x, TOP, 0)]); g.fill();
    const vg = g.createLinearGradient(0, P(x, TOP, FAR)[1], 0, P(x, 0, FAR)[1]);
    vg.addColorStop(0, "rgba(2, 1, 4, .7)"); vg.addColorStop(1, "rgba(2, 1, 4, 0)");
    g.fillStyle = vg;
    poly(g, [P(x, 0, 0), P(x, 0, FAR), P(x, TOP, FAR), P(x, TOP, 0)]); g.fill();
  }

  function paintBase(gm, dpr) {
    const c = document.createElement("canvas");
    c.width = Math.ceil(gm.W * dpr); c.height = Math.ceil(gm.H * dpr);
    const g = c.getContext("2d"); g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const { P, S, L, R, TOP, FAR, W, H } = gm;
    const r = rng(42);

    g.fillStyle = "#030205"; g.fillRect(0, 0, W, H);

    // the far end: hazy violet street, distant buildings, a strip of night sky
    const end = [P(L, 0, FAR), P(R, 0, FAR), P(R, TOP, FAR), P(L, TOP, FAR)];
    let gr = g.createLinearGradient(0, end[2][1], 0, end[0][1]);
    gr.addColorStop(0, "#07030f"); gr.addColorStop(0.55, "#2c1158"); gr.addColorStop(0.85, "#7a34cc"); gr.addColorStop(1, "#c77bff");
    g.fillStyle = gr; poly(g, end); g.fill();
    g.save(); poly(g, end); g.clip();
    for (let i = 0; i < 9; i++) {
      const bx = L + (R - L) * (i / 8) - 0.4, bw = 0.7 + r() * 0.9, bhgt = 4 + r() * 9;
      const a = P(bx, 0, FAR + 30), b = P(bx + bw, bhgt, FAR + 30);
      g.fillStyle = `rgba(14, 7, 28, ${0.75 + r() * 0.2})`;
      g.fillRect(a[0], b[1], b[0] - a[0], a[1] - b[1]);
      for (let w = 0; w < 6; w++) if (r() < 0.5) {
        g.fillStyle = r() < 0.5 ? "rgba(255, 190, 120, .55)" : "rgba(220, 170, 255, .45)";
        g.fillRect(a[0] + r() * (b[0] - a[0] - 2), b[1] + r() * (a[1] - b[1] - 2), 1.5, 1.5);
      }
    }
    g.restore();

    paintWall(g, gm, L, r);
    paintWall(g, gm, R, r);

    // wet floor
    const floor = [P(L, 0, 0), P(R, 0, 0), P(R, 0, FAR), P(L, 0, FAR)];
    gr = g.createLinearGradient(0, H, 0, P(0, 0, FAR)[1]);
    gr.addColorStop(0, "#020104"); gr.addColorStop(0.6, "#08040f"); gr.addColorStop(1, "#2a1252");
    g.fillStyle = gr; poly(g, floor); g.fill();
    g.save(); poly(g, floor); g.clip();
    g.strokeStyle = "rgba(0, 0, 0, .55)"; g.lineWidth = 1;
    for (let z = 2; z < FAR; z += 2.6 + r()) { const a = P(L, 0, z), b = P(R, 0, z); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
    [-0.9, 0.9].forEach(x => { const a = P(x, 0, 0), b = P(x, 0, FAR); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); });
    // reflection of the glowing street at the far end
    g.globalCompositeOperation = "lighter";
    const [ox] = gm.orb, [, fy] = P(0, 0, FAR);
    gr = g.createLinearGradient(0, fy, 0, H);
    gr.addColorStop(0, "rgba(200, 120, 255, .5)"); gr.addColorStop(0.35, "rgba(124, 58, 237, .16)"); gr.addColorStop(1, "rgba(124, 58, 237, 0)");
    g.fillStyle = gr;
    g.beginPath(); g.moveTo(ox - S(FAR) * 0.9, fy); g.lineTo(ox + S(FAR) * 0.9, fy); g.lineTo(ox + W * 0.09, H); g.lineTo(ox - W * 0.09, H); g.closePath(); g.fill();
    // puddles
    for (let i = 0; i < 7; i++) {
      const pz = 4 + r() * 26, px = L + 0.8 + r() * (R - L - 1.6), rw = 0.3 + r() * 0.7, rd = 0.25 + r() * 0.6;
      g.beginPath();
      for (let a = 0; a <= Math.PI * 2 + 0.01; a += Math.PI / 16) {
        const p = P(px + Math.cos(a) * rw, 0, pz + Math.sin(a) * rd);
        a ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]);
      }
      const l = light(gm, px, 0.5, pz);
      g.fillStyle = `rgba(${clamp(60 + 120 * l.ia + 80 * l.im)}, ${clamp(30 + 50 * l.ia)}, ${clamp(120 + 60 * l.im)}, ${0.1 + l.ip * 0.35 + l.ia * 0.4})`;
      g.fill();
    }
    g.globalCompositeOperation = "source-over";
    g.restore();

    // light spill from the signs and the far end, onto walls and floor
    g.globalCompositeOperation = "lighter";
    const spill = (x, y, z, rad, rgba) => {
      const [sx, sy] = P(x, y, z), rr = rad * S(z);
      const sg = g.createRadialGradient(sx, sy, 0, sx, sy, rr);
      sg.addColorStop(0, rgba); sg.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = sg; g.fillRect(sx - rr, sy - rr, rr * 2, rr * 2);
    };
    const a = gm.signA, b = gm.signB;
    spill((a.x0 + a.x1) / 2, 4.2, a.z, 4.2, "rgba(255, 150, 70, .22)");
    spill((a.x0 + a.x1) / 2, 0.2, a.z, 3.2, "rgba(255, 150, 70, .14)");
    spill((b.x0 + b.x1) / 2, 5, b.z, 5, "rgba(224, 92, 255, .2)");
    spill((L + R) / 2, 3, FAR, 12, "rgba(150, 80, 255, .2)");
    g.globalCompositeOperation = "source-over";

    // props: dark silhouettes with a thin rim of light
    const ink = "#07040c";
    const rim = (z) => `rgba(${clamp(120 + 80 * (z / FAR))}, ${clamp(70 + 40 * (z / FAR))}, 255, ${0.25 + 0.5 * (z / FAR)})`;
    const line = (p, q, w, color) => { g.strokeStyle = color; g.lineWidth = Math.max(1, w); g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.stroke(); };

    // pipes on the left wall
    [2.4, 10.5, 19, 31].forEach(z => {
      const w = 0.16 * S(z);
      line(P(L + 0.18, 0, z), P(L + 0.18, TOP, z), w, ink);
      line(P(L + 0.18, 0, z).map((v, i) => i ? v : v + w * 0.32), P(L + 0.18, TOP, z).map((v, i) => i ? v : v + w * 0.32), Math.max(1, w * 0.12), rim(z));
    });
    const hp = (y, color, t) => { g.fillStyle = color; poly(g, [P(L + 0.15, y - t, 0), P(L + 0.15, y - t, FAR), P(L + 0.15, y + t, FAR), P(L + 0.15, y + t, 0)]); g.fill(); };
    hp(2.6, ink, 0.09); hp(2.66, "rgba(150, 90, 255, .25)", 0.012);

    // a lit window high on the left wall
    const win = [P(L + 0.02, 6.1, 13), P(L + 0.02, 6.1, 15.4), P(L + 0.02, 7.9, 15.4), P(L + 0.02, 7.9, 13)];
    gr = g.createLinearGradient(win[0][0], 0, win[1][0], 0);
    gr.addColorStop(0, "rgba(255, 170, 90, .75)"); gr.addColorStop(1, "rgba(255, 120, 60, .5)");
    g.fillStyle = gr; poly(g, win); g.fill();
    for (let i = 1; i < 6; i++) { const y = 6.1 + i * 0.3; line(P(L + 0.03, y, 13), P(L + 0.03, y, 15.4), 1, "rgba(60, 20, 10, .55)"); }
    line(P(L + 0.03, 6.1, 14.2), P(L + 0.03, 7.9, 14.2), 1.4, "rgba(40, 14, 8, .8)");

    // fire escape on the right wall
    const fe0 = 14, fe1 = 23, out = 1.15;
    [3.6, 6.8, 10].forEach((y, i) => {
      g.fillStyle = ink;
      poly(g, [P(R, y, fe0), P(R - out, y, fe0), P(R - out, y, fe1), P(R, y, fe1)]); g.fill();
      line(P(R - out, y, fe0), P(R - out, y, fe1), 1.2, rim(18));
      line(P(R - out, y + 1, fe0), P(R - out, y + 1, fe1), 1.4, ink);
      for (let z = fe0; z <= fe1; z += 1.5) line(P(R - out, y, z), P(R - out, y + 1, z), 1, ink);
      line(P(R - out, y + 1, fe0), P(R, y + 1, fe0), 1.4, ink);
      if (i < 2) line(P(R - out * 0.5, y, fe1 - 1), P(R - out * 0.5, y + 3.2, fe0 + 2.5), 1.6, ink);
    });

    // dumpster near the right wall
    const dx0 = R - 1.25, dx1 = R - 0.05, dz0 = 9.5, dz1 = 11.6, dh = 1.15;
    g.fillStyle = "#0b0712"; poly(g, [P(dx0, 0, dz0), P(dx0, 0, dz1), P(dx0, dh, dz1), P(dx0, dh, dz0)]); g.fill();
    g.fillStyle = "#06030b"; poly(g, [P(dx0, 0, dz0), P(dx1, 0, dz0), P(dx1, dh, dz0), P(dx0, dh, dz0)]); g.fill();
    g.fillStyle = "#140a22"; poly(g, [P(dx0, dh, dz0), P(dx1, dh, dz0), P(dx1, dh + 0.12, dz1), P(dx0, dh + 0.12, dz1)]); g.fill();
    line(P(dx0, dh, dz0), P(dx1, dh, dz0), 1.5, "rgba(255, 160, 90, .45)");
    line(P(dx0, dh, dz0), P(dx0, dh + 0.12, dz1), 1.2, "rgba(255, 160, 90, .3)");

    // boxes and bags along the left wall, near the camera
    [[L + 0.1, 0.9, 2.6, 1.1], [L + 0.1, 0.6, 4.4, 0.9], [L + 0.1, 0.7, 8.8, 0.8]].forEach(([x, h, z, d]) => {
      g.fillStyle = "#08050e";
      poly(g, [P(x + d, 0, z), P(x + d, 0, z + d), P(x + d, h, z + d), P(x + d, h, z)]); g.fill();
      g.fillStyle = "#05030a";
      poly(g, [P(x, 0, z), P(x + d, 0, z), P(x + d, h, z), P(x, h, z)]); g.fill();
      line(P(x, h, z), P(x + d, h, z), 1, rim(z));
    });

    // cables strung across the alley
    [[5, 9.5, 9], [11, 8.6, 9.2], [20, 9.4, 8.2], [33, 8, 8.4]].forEach(([z, y1, y2]) => {
      const a = P(L, y1, z), b = P(R, y2, z), sag = 1.6 * S(z);
      g.strokeStyle = "#05030a"; g.lineWidth = Math.max(1, 0.035 * S(z));
      g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo((a[0] + b[0]) / 2, Math.max(a[1], b[1]) + sag, b[0], b[1]); g.stroke();
    });

    // brackets that hold the signs
    line(P(R, a.y1 + 0.25, a.z), P(a.x0 - 0.05, a.y1 + 0.25, a.z), 0.06 * S(a.z), ink);
    line(P(L, b.y1 + 0.2, b.z), P(b.x1 + 0.05, b.y1 + 0.2, b.z), 0.05 * S(b.z), ink);

    // steam grate
    const gx = 0.4, gz = 6.5;
    g.fillStyle = "#0a0612"; poly(g, [P(gx - 0.5, 0, gz - 0.4), P(gx + 0.5, 0, gz - 0.4), P(gx + 0.5, 0, gz + 0.4), P(gx - 0.5, 0, gz + 0.4)]); g.fill();
    for (let i = -4; i <= 4; i++) line(P(gx + i * 0.11, 0, gz - 0.4), P(gx + i * 0.11, 0, gz + 0.4), 1, "rgba(120, 80, 200, .35)");

    // readability: darken the left side behind the title, and the edges
    if (!gm.narrow) {
      gr = g.createLinearGradient(0, 0, W * 0.62, 0);
      gr.addColorStop(0, "rgba(3, 2, 5, .82)"); gr.addColorStop(0.65, "rgba(3, 2, 5, .45)"); gr.addColorStop(1, "rgba(3, 2, 5, 0)");
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
    } else {
      gr = g.createLinearGradient(0, H * 0.35, 0, H);
      gr.addColorStop(0, "rgba(3, 2, 5, 0)"); gr.addColorStop(0.35, "rgba(3, 2, 5, .8)"); gr.addColorStop(1, "rgba(3, 2, 5, .92)");
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
    }
    gr = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.78);
    gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(0,0,0,.85)");
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
    // overall darkness, so the orb and the neon carry the light
    g.fillStyle = "rgba(1, 0, 3, .22)"; g.fillRect(0, 0, W, H);
    return c;
  }

  /* ---------- animated layer */
  let steam = [], rain = [], splashes = [], splashDebt = 0, flick = { a: 1, b: 1, nextA: 0, nextB: 0 };
  // three depths of rain: far (fine and slow), middle, and near (long, fast streaks)
  const RAIN_LAYERS = [
    { n: 170, len: [6, 11], v: [0.7, 0.95], a: 0.09, w: 1 },
    { n: 110, len: [15, 26], v: [1.25, 1.6], a: 0.15, w: 1.1 },
    { n: 34, len: [48, 90], v: [2.4, 3.1], a: 0.2, w: 1.6 }
  ];
  const WIND = 0.17;
  function seedAnim(gm) {
    steam = Array.from({ length: 16 }, (_, i) => ({ t: i / 16, drift: (Math.random() - 0.5) * 0.6, size: 0.7 + Math.random() * 0.8 }));
    rain = [];
    RAIN_LAYERS.forEach(L => {
      const n = Math.round(L.n * (gm.narrow ? 0.5 : 1));
      for (let i = 0; i < n; i++) rain.push({
        x: Math.random() * 1.2, y: Math.random(), layer: L,
        v: L.v[0] + Math.random() * (L.v[1] - L.v[0]), l: L.len[0] + Math.random() * (L.len[1] - L.len[0])
      });
    });
    splashes = [];
  }

  function neonSign(g, gm, s, text, tube, glow, level, vertical) {
    const { P } = gm;
    const [x0, y0] = P(s.x0, s.y1, s.z), [x1, y1] = P(s.x1, s.y0, s.z);
    const w = x1 - x0, h = y1 - y0, rr = Math.min(w, h) * 0.12;
    g.save();
    g.fillStyle = "rgba(8, 4, 12, .92)";
    g.beginPath(); g.roundRect(x0, y0, w, h, rr); g.fill();
    g.globalAlpha = level;
    g.shadowColor = glow; g.shadowBlur = Math.max(8, w * 0.35);
    g.strokeStyle = tube; g.lineWidth = Math.max(1.4, w * 0.035);
    g.beginPath(); g.roundRect(x0 + w * 0.08, y0 + h * 0.06, w * 0.84, h * 0.88, rr); g.stroke();
    g.fillStyle = "#fff4e6"; g.textAlign = "center"; g.textBaseline = "middle";
    if (vertical) {
      const fs = h / (text.length + 1.2);
      g.font = `600 ${fs}px "Sora", sans-serif`;
      [...text].forEach((ch, i) => g.fillText(ch, x0 + w / 2, y0 + h * 0.1 + fs * (i + 0.95)));
    } else {
      g.font = `600 ${h * 0.42}px "JetBrains Mono", monospace`;
      g.fillText(text, x0 + w / 2, y0 + h / 2);
    }
    g.restore();
  }

  window.Alley = {
    resize(W, H, dpr) { geo = geometry(W, H); base = paintBase(geo, dpr); seedAnim(geo); return geo; },
    get geo() { return geo; },
    drawBack(g, time) {
      if (!base) return;
      g.drawImage(base, 0, 0, geo.W, geo.H);
    },
    drawFront(g, time, dt, still) {
      if (!geo) return;
      const { P, S, W, H } = geo;
      // neon flicker: mostly steady, with an occasional stutter
      if (!still) {
        if (time > flick.nextA) { flick.a = Math.random() < 0.5 ? 0.25 : 0.7; flick.nextA = time + (flick.a < 1 ? 0.06 + Math.random() * 0.1 : 0); if (Math.random() < 0.35) { flick.a = 1; flick.nextA = time + 2 + Math.random() * 5; } }
        if (time > flick.nextB) { flick.b = 1; flick.nextB = time + 3 + Math.random() * 6; if (Math.random() < 0.3) { flick.b = 0.35; flick.nextB = time + 0.12; } }
      }
      neonSign(g, geo, geo.signA, "</>", "#ff9a4d", "rgba(255, 140, 60, .95)", still ? 1 : flick.a, false);
      neonSign(g, geo, geo.signB, "DEV", "#e05cff", "rgba(224, 92, 255, .95)", still ? 1 : flick.b, true);

      // steam rising from the grate
      g.save(); g.globalCompositeOperation = "lighter";
      steam.forEach(p => {
        if (!still) { p.t += dt * 0.07; if (p.t > 1) { p.t -= 1; p.drift = (Math.random() - 0.5) * 0.6; } }
        const y = 0.2 + p.t * 5.5, x = 0.4 + p.drift * p.t * 3, z = 6.5;
        const [sx, sy] = P(x, y, z), rad = (0.5 + p.t * 1.8) * p.size * S(z);
        const a = Math.sin(p.t * Math.PI) * 0.09;
        const gr = g.createRadialGradient(sx, sy, 0, sx, sy, rad);
        gr.addColorStop(0, `rgba(200, 160, 255, ${a})`); gr.addColorStop(1, "rgba(200, 160, 255, 0)");
        g.fillStyle = gr; g.fillRect(sx - rad, sy - rad, rad * 2, rad * 2);
      });
      // low fog along the ground
      const fy = P(0, 0.8, 10)[1];
      const fg = g.createLinearGradient(0, fy - H * 0.12, 0, H);
      fg.addColorStop(0, "rgba(124, 58, 237, 0)"); fg.addColorStop(0.5, "rgba(124, 58, 237, .05)"); fg.addColorStop(1, "rgba(60, 20, 120, .08)");
      g.fillStyle = fg; g.fillRect(0, fy - H * 0.12, W, H);
      // rain: brighter where it passes through the orb's glow or the amber sign's light
      const [ox, oy] = geo.orb;
      const sa = geo.signA, [ax, ay] = P((sa.x0 + sa.x1) / 2, (sa.y0 + sa.y1) / 2, sa.z);
      const glowR = H * 0.38, ambR = H * 0.22;
      g.globalCompositeOperation = "lighter"; g.lineCap = "round";
      rain.forEach(d => {
        if (!still) { d.y += d.v * dt; if (d.y > 1.08) { d.y = -0.08 - Math.random() * 0.1; d.x = Math.random() * 1.2; } }
        const x = d.x * W, y = d.y * H, dx = -d.l * WIND;
        const mx = x + dx / 2, my = y + d.l / 2;
        const bo = Math.max(0, 1 - Math.hypot(mx - ox, my - oy) / glowR);
        const ba = Math.max(0, 1 - Math.hypot(mx - ax, my - ay) / ambR);
        const alpha = Math.min(0.75, d.layer.a * (1 + bo * bo * 4 + ba * ba * 3));
        g.strokeStyle = ba > bo ? `rgba(255, 196, 140, ${alpha})` : `rgba(214, 196, 255, ${alpha})`;
        g.lineWidth = d.layer.w;
        g.beginPath(); g.moveTo(x, y); g.lineTo(x + dx, y + d.l); g.stroke();
      });
      // splashes on the wet ground
      if (!still) {
        splashDebt += dt * (geo.narrow ? 30 : 55);
        while (splashDebt >= 1) {
          splashDebt -= 1;
          splashes.push({ x: geo.L + 0.25 + Math.random() * (geo.R - geo.L - 0.5), z: 0.8 + Math.pow(Math.random(), 0.7) * 34, t: 0 });
        }
      }
      splashes = splashes.filter(sp => (sp.t += still ? 0 : dt) < 0.42);
      splashes.forEach(sp => {
        const p = sp.t / 0.42, [sx, sy] = P(sp.x, 0, sp.z), sc = S(sp.z);
        const rx = (0.04 + 0.2 * p) * sc, a = 0.4 * (1 - p) * (0.45 + sp.z / geo.FAR);
        g.strokeStyle = `rgba(215, 195, 255, ${a})`; g.lineWidth = Math.max(0.6, sc * 0.012);
        g.beginPath(); g.ellipse(sx, sy, rx, rx * 0.26, 0, 0, Math.PI * 2); g.stroke();
        if (p < 0.35) {
          const up = (0.05 + p * 0.5) * sc * 0.4;
          g.fillStyle = `rgba(230, 215, 255, ${a})`;
          g.fillRect(sx - rx * 0.6, sy - up, 1.2, 1.2); g.fillRect(sx + rx * 0.5, sy - up * 0.8, 1.2, 1.2);
        }
      });
      g.restore();
    }
  };
})();
