/* horizon.dev — sound. Every sound is made live with the Web Audio API,
   so there are no audio files to download or license. */
(function () {
  const KEY = "hi.sound";
  let enabled = true;
  try { enabled = localStorage.getItem(KEY) !== "off"; } catch (e) {}
  let ctx = null, master = null, ambient = null;

  function ensure() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = enabled ? 1 : 0;
    master.connect(ctx.destination);
    return ctx;
  }

  function tone({ freq = 440, type = "sine", start = 0, dur = 0.2, gain = 0.15, attack = 0.005, slideTo = null, filter = null }) {
    if (!ensure()) return;
    const t = ctx.currentTime + start;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let node = o;
    if (filter) {
      const f = ctx.createBiquadFilter();
      f.type = "lowpass"; f.frequency.value = filter;
      o.connect(f); node = f;
    }
    node.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.05);
  }

  function noise({ start = 0, dur = 0.6, gain = 0.12, from = 400, to = 4000 }) {
    if (!ensure()) return;
    const t = ctx.currentTime + start;
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.Q.value = 1.2;
    f.frequency.setValueAtTime(from, t); f.frequency.exponentialRampToValueAtTime(to, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + dur * 0.35);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t); src.stop(t + dur);
  }

  function startAmbient() {
    if (!ensure() || ambient) return;
    const out = ctx.createGain(); out.gain.value = 0;
    out.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 4);
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 520; lp.Q.value = 3;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.06;
    const lfoGain = ctx.createGain(); lfoGain.gain.value = 260;
    lfo.connect(lfoGain); lfoGain.connect(lp.frequency);
    const oscs = [55, 82.41, 110.3, 164.8].map((f, i) => {
      const o = ctx.createOscillator();
      o.type = i % 2 ? "triangle" : "sawtooth";
      o.frequency.value = f; o.detune.value = (i - 1.5) * 6;
      const g = ctx.createGain(); g.gain.value = i < 2 ? 0.5 : 0.18;
      o.connect(g); g.connect(lp); o.start();
      return o;
    });
    lp.connect(out); out.connect(master); lfo.start();
    ambient = { out, oscs, lfo };
  }

  function setEnabled(on) {
    enabled = on;
    try { localStorage.setItem(KEY, on ? "on" : "off"); } catch (e) {}
    if (ctx) master.gain.setTargetAtTime(on ? 1 : 0, ctx.currentTime, 0.08);
    document.querySelectorAll("[data-sound-toggle]").forEach(b => {
      b.querySelector("use").setAttribute("href", on ? "#i-sound" : "#i-mute");
      b.setAttribute("aria-label", on ? "Turn sound off" : "Turn sound on");
      b.title = on ? "Sound on" : "Sound off";
    });
  }

  const S = {
    get enabled() { return enabled; },
    unlock() { ensure(); if (ctx && ctx.state === "suspended") ctx.resume(); startAmbient(); },
    toggle() { setEnabled(!enabled); if (enabled) S.click(); },
    sync() { setEnabled(enabled); },
    ambient(level) { if (ambient && ctx) ambient.out.gain.setTargetAtTime(level, ctx.currentTime, 0.6); },
    hover() { tone({ freq: 1900, type: "sine", dur: 0.04, gain: 0.025 }); },
    click() { tone({ freq: 620, type: "triangle", dur: 0.09, gain: 0.08, slideTo: 880 }); },
    start() {
      noise({ dur: 1.1, gain: 0.16, from: 200, to: 5200 });
      tone({ freq: 110, type: "sawtooth", dur: 1.2, gain: 0.07, slideTo: 440, filter: 1200 });
      tone({ freq: 880, type: "sine", start: 0.75, dur: 0.6, gain: 0.06 });
    },
    open() { tone({ freq: 330, type: "triangle", dur: 0.25, gain: 0.07, slideTo: 660 }); tone({ freq: 990, start: 0.1, dur: 0.35, gain: 0.04 }); },
    dock() { tone({ freq: 700, type: "sine", dur: 0.18, gain: 0.05, slideTo: 420 }); },
    run() { tone({ freq: 520, type: "square", dur: 0.06, gain: 0.03, filter: 1800 }); tone({ freq: 780, type: "square", start: 0.06, dur: 0.06, gain: 0.03, filter: 1800 }); },
    success() {
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone({ freq: f, type: "triangle", start: i * 0.08, dur: 0.45, gain: 0.09 }));
      tone({ freq: 2093, type: "sine", start: 0.32, dur: 0.6, gain: 0.03 });
    },
    error() { tone({ freq: 220, type: "triangle", dur: 0.18, gain: 0.09 }); tone({ freq: 175, type: "triangle", start: 0.14, dur: 0.28, gain: 0.08 }); },
    hint() { tone({ freq: 880, type: "sine", dur: 0.2, gain: 0.05 }); tone({ freq: 1320, start: 0.08, dur: 0.3, gain: 0.04 }); },
    complete() {
      noise({ dur: 1.4, gain: 0.1, from: 600, to: 7000 });
      const seq = [392, 523.25, 659.25, 783.99, 1046.5, 1318.5];
      seq.forEach((f, i) => tone({ freq: f, type: "triangle", start: 0.1 + i * 0.09, dur: 0.8, gain: 0.08 }));
      [523.25, 659.25, 783.99].forEach(f => tone({ freq: f, type: "sawtooth", start: 0.7, dur: 1.6, gain: 0.03, filter: 2400 }));
    }
  };
  window.Sound = S;
  document.addEventListener("DOMContentLoaded", () => {
    S.sync();
    document.querySelectorAll("[data-sound-toggle]").forEach(b => b.addEventListener("click", (e) => { e.stopPropagation(); S.unlock(); S.toggle(); }));
  });
})();
