/* Animating Slides engine (MIT). Classic script, no build step: the deck opens from file:// by double-click.
 * A fixed 1920x1080 stage. A deck is an ordered list of scenes; each scene has numbered steps (1..steps).
 * Choreography is a pure function of (step, beats since the step began), so __seek(id, step, beats) can
 * freeze any moment for screenshots and audits. The hand is not: pointer follow, hover and pokes ease per frame.
 */
(function () {
  'use strict';
  const W = 1920, H = 1080;

  // ---- kit: small helpers every scene gets as its second argument
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const outExpo = x => (x = cl(x), x === 1 ? 1 : 1 - Math.pow(2, -10 * x));
  const inCubic = x => (x = cl(x), x * x * x);
  const inOut = x => (x = cl(x), x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  // closed-form step response of a damped spring: x in seconds, f in Hz, z damping ratio
  function spring(x, f = 2.4, z = .45) {
    if (x <= 0) return 0;
    const w = 2 * Math.PI * f, wd = w * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w * x) * (Math.cos(wd * x) + (z * w / wd) * Math.sin(wd * x));
  }
  // a poke: hop up and land with a wobble. x in seconds since the poke; y in px, sq is squash
  function hop(x) {
    if (x < 0 || x > 1.6) return { y: 0, sq: 0 };
    const air = .42;
    if (x < air) { const u = x / air; return { y: -90 * 4 * u * (1 - u), sq: -.06 * Math.sin(Math.PI * u) }; }
    const v = x - air; return { y: 0, sq: .16 * Math.exp(-7 * v) * Math.cos(18 * v) };
  }
  const tr = (x, y) => 'translate(' + x + 'px,' + y + 'px)';
  const rgba = (h, a) => 'rgba(' + [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)).join(',') + ',' + a + ')';
  function div(parent, css, text) {
    const d = document.createElement('div');
    if (text != null) d.textContent = text;
    Object.assign(d.style, css || {}); parent.appendChild(d); return d;
  }
  const NS = 'http://www.w3.org/2000/svg';
  function svg(parent, css) {
    const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    Object.assign(s.style, { left: 0, top: 0, width: W + 'px', height: H + 'px', overflow: 'visible', pointerEvents: 'none' }, css || {});
    parent.appendChild(s); return s;
  }
  function path(s, d, color, width, dash) {
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke', color); p.setAttribute('stroke-width', width); p.setAttribute('stroke-linecap', 'round');
    if (dash) p.setAttribute('stroke-dasharray', dash);
    s.appendChild(p); return p;
  }
  // g: 0..1 progress; the element fades in while rising dist px
  const rise = (e, g, dist = 60) => { e.style.opacity = g; e.style.transform = 'translateY(' + (1 - g) * dist + 'px)'; };
  // soft colour fields that drift on their own and lean away from the pointer: a page is never one flat colour
  function aurora(root, base, cols, alpha = .45) {
    root.style.background = base;
    const spots = [[260, 220], [1640, 240], [980, 940], [240, 900], [1600, 860], [960, 300]];
    return cols.map((c, i) => {
      const r = 380 + (i % 3) * 110;
      const e = div(root, { left: 0, top: 0, width: 2 * r + 'px', height: 2 * r + 'px', borderRadius: '50%', background: 'radial-gradient(circle, ' + rgba(c, alpha) + ' 0%, ' + rgba(c, 0) + ' 68%)' });
      return { e, r, x: spots[i % 6][0], y: spots[i % 6][1], sp: .16 + i * .05, ph: i * 1.7, d: .5 + (i % 3) * .35 };
    });
  }
  const drift = (bl, st) => bl.forEach(b => { b.e.style.transform = tr(b.x - b.r + Math.sin(st.clock * b.sp + b.ph) * 150 - st.mx * 50 * b.d, b.y - b.r + Math.cos(st.clock * b.sp * 1.3 + b.ph) * 110 - st.my * 36 * b.d); });
  const near = (st, x0, y0, x1, y1) => st.hoverX >= x0 && st.hoverX <= x1 && st.hoverY >= y0 && st.hoverY <= y1;
  const kit = { W, H, cl, outExpo, inCubic, inOut, spring, hop, tr, rgba, div, svg, path, rise, aurora, drift, near };

  const now = () => performance.now() / 1000;
  let opts, BEAT, list, stage, mark, notesEl, S, lastT = now(), frozen = null, started = false, timers = [];
  const scenes = {}, ripples = [], P = { x: W / 2, y: H / 2, sx: W / 2, sy: H / 2, inside: false };

  // ---- sound. Music: one recorded track per act, crossfaded on the scene change.
  // Volume only on the <audio> elements: routing a file:// <audio> into Web Audio plays silence in Chrome.
  const tracks = {}, audioLog = [];
  let act = null, actx = null, bus = null, noiseBuf = null, muted = false;
  const logA = (...a) => { audioLog.push([+now().toFixed(2), ...a]); if (audioLog.length > 500) audioLog.shift(); };
  function initAudio() {
    for (const k in opts.music) if (!tracks[k]) { const a = tracks[k] = new Audio(opts.music[k]); a.loop = true; a.volume = 0; }
    if (!actx) { try { actx = new (window.AudioContext || window.webkitAudioContext)(); bus = actx.createGain(); bus.connect(actx.destination); } catch (e) { /* sound is optional */ } }
    if (actx && actx.state === 'suspended') actx.resume();
    playAct();
  }
  function playAct() { const a = tracks[act]; if (a && a.paused && started && !muted) { if (a.volume < .01) a.currentTime = 0; a.play().catch(() => {}); } }
  function setAct(k) { k = k || opts.defaultAct; if (k === act) return; act = k; logA('music', k); playAct(); }
  function musicVolume() {
    for (const k in tracks) {
      const a = tracks[k], target = muted || k !== act ? 0 : opts.musicVolume;
      a.volume = cl(a.volume + (target - a.volume) * (target ? .03 : .06));
      if (!target && a.volume < .003 && !a.paused) { a.volume = 0; a.pause(); }
    }
  }
  // sfx: soft synthesized one-shots on entrances only (cards land, numbers count), never on idle loops.
  // Peaks stay at or under .045; no compressor (its makeup gain makes quiet sounds louder).
  function env(g, t, peak, a, d) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }
  function tone(f, peak, d, o = {}) {
    const t = actx.currentTime + (o.at || 0), osc = actx.createOscillator(), g = actx.createGain();
    osc.type = o.type || 'sine'; osc.frequency.setValueAtTime(f, t);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + (o.glide || d));
    env(g, t, peak, .006, d); osc.connect(g); g.connect(bus); osc.start(t); osc.stop(t + d + .05);
  }
  function noise(peak, d, o = {}) {
    if (!noiseBuf) { noiseBuf = actx.createBuffer(1, actx.sampleRate * 2, actx.sampleRate); const x = noiseBuf.getChannelData(0); for (let i = 0; i < x.length; i++) x[i] = Math.random() * 2 - 1; }
    const a = o.a || .01, t = actx.currentTime + (o.at || 0), s = actx.createBufferSource(), f = actx.createBiquadFilter(), g = actx.createGain();
    s.buffer = noiseBuf; f.type = o.type || 'bandpass'; f.Q.value = o.q || .8;
    f.frequency.setValueAtTime(o.f0 || 800, t); f.frequency.exponentialRampToValueAtTime(o.f1 || o.f0 || 800, t + a + d);
    env(g, t, peak, a, d); s.connect(f); f.connect(g); g.connect(bus); s.start(t); s.stop(t + a + d + .05);
  }
  const NT = n => 880 * Math.pow(2, n / 12); // n semitones above A5
  const SFX = {
    tap: (n = 0) => { tone(NT(n), .04, .5); tone(NT(n) * 2.01, .012, .5); },
    pop: (n = 0) => { tone(NT(n - 12), .04, .22, { to: NT(n), glide: .05 }); tone(NT(n), .012, .3); },
    card: (n = 0) => { noise(.03, .2, { f0: 900, f1: 3200, a: .02 }); tone(NT(n - 19), .03, .2); },
    whoosh: dark => noise(.03, .55, { f0: dark ? 220 : 380, f1: dark ? 1100 : 2400, a: .28 }),
    riser: () => noise(.022, .15, { f0: 300, f1: 3400, a: 1.1, q: 1.4 }),
    stamp: () => { tone(150, .045, .32, { to: 45 }); noise(.025, .12, { type: 'lowpass', f0: 700 }); },
    shimmer: (n = 0) => [12, 16, 19, 24].forEach((k, i) => tone(NT(n + k), .011, .9, { at: i * .07 })),
    tick: (n = 0) => tone(NT(12 + n), .014, .05),
    coin: (n = 0) => { tone(NT(19 + n % 3), .016, .12); tone(NT(26 + n % 3), .012, .28, { at: .04 }); },
    bubble: (n = 0) => tone(NT(n - 14), .028, .1, { to: NT(n - 5) }),
    strike: () => noise(.026, .26, { f0: 1800, f1: 600, a: .02, q: 1.2 }),
    clunk: () => { tone(95, .035, .2, { to: 60 }); noise(.02, .1, { type: 'lowpass', f0: 420 }); },
  };
  function sfx(name, arg) { logA('sfx', name); if (!actx || muted || !SFX[name]) return; SFX[name](arg); }
  // cues: { step: [[beat, sound, arg], [beat, 'count', sound, lengthInBeats]] }. Timers start from the step start;
  // a cue already past on entry is dropped, not fired late.
  function cueStep(id, step) {
    const cues = ((scenes[id].cues || {})[step]) || [], off = (now() - S.at) / BEAT;
    const at = (b, name, arg) => { const ms = (b - off) * BEAT * 1000; if (ms > -60) timers.push(setTimeout(() => sfx(name, arg), Math.max(0, ms))); };
    cues.forEach(([b, name, arg, len]) => {
      if (name !== 'count') return at(b, name, arg);
      // a count eases out (outExpo over len beats): one tick each time it passes another eighth of the way, >=120 ms apart
      let last = -1;
      for (let k = 1; k < 8; k++) { const x = b + len * -Math.log2(1 - k / 8) / 10; if ((x - last) * BEAT > .12) { at(x, arg, k); last = x; } }
    });
  }

  // ---- state and render
  const isDark = (id, step) => { const d = scenes[id].dark; return typeof d === 'function' ? !!d(step) : !!d; };
  function mkState(step, tb, enter, clock, mx, my, ease, T) {
    const hv = P.inside && frozen == null;
    const st = { step, tb, enter, beat: BEAT, clock, mx, my, ease, T, frozen: frozen != null, hoverX: hv ? P.sx : -1, hoverY: hv ? P.sy : -1 };
    st.at = n => (st.step > n ? 99 : st.step === n ? st.tb : -1); // beats since step n began; -1 before it, 99 after it
    return st;
  }
  function render() {
    const T = now(), dt = Math.min(.05, T - lastT); lastT = T;
    const ease = r => 1 - Math.exp(-dt * r);
    if (frozen != null) { P.sx = W / 2; P.sy = H / 2; } else { P.sx += (P.x - P.sx) * ease(5); P.sy += (P.y - P.sy) * ease(5); }
    const clock = frozen != null ? 3.3 : T, mx = (P.sx - W / 2) / (W / 2), my = (P.sy - H / 2) / (H / 2);
    const Tst = frozen != null ? 1e9 : T; // frozen: every poke is long over
    musicVolume();
    const [id, step] = list[S.i], cur = scenes[id];
    const tb = frozen != null ? frozen : (T - S.at) / BEAT;
    const since = frozen != null ? (step === 1 ? frozen : 99) : (T - S.enterAt) / BEAT;
    const TR = opts.transitionBeats;
    // the new scene grows out of the old one: a circle opens from where you clicked, the old scene holds underneath
    const from = S.from && S.from !== id && since < TR ? scenes[S.from] : null;
    for (const k of opts.order) {
      const s = scenes[k], show = s === cur || s === from;
      s.root.style.display = show ? '' : 'none'; // display, not visibility: scene children set their own visibility
      if (!show) continue;
      if (s === cur) {
        s.root.style.zIndex = 2;
        s.root.style.clipPath = from ? 'circle(' + outExpo(since / TR) * 2300 + 'px at ' + S.ox + 'px ' + S.oy + 'px)' : 'none';
        s.lastSt = mkState(step, tb, since, clock, mx, my, ease, Tst);
      } else { s.root.style.zIndex = 1; s.root.style.clipPath = 'none'; s.lastSt = mkState(s.steps || 1, 99, 99, clock, mx, my, ease, Tst); }
      s.render(s.lastSt, kit);
    }
    if (mark) mark.style.color = isDark(id, step) ? '#fff' : '#111';
    ripples.forEach(rp => {
      const a = frozen != null ? 9 : T - rp.at, u = cl(a / .7);
      rp.e.style.opacity = a < .7 ? 1 - u : 0;
      rp.e.style.transform = tr(rp.x - 60, rp.y - 60) + ' scale(' + (.2 + 1.3 * outExpo(u)) + ')';
      rp.e.style.borderColor = isDark(id, step) ? '#fff' : opts.accent;
    });
  }
  function loop() { render(); requestAnimationFrame(loop); }

  function go(i, dir) {
    timers.forEach(clearTimeout); timers = [];
    const fromId = list[S.i][0], [id, step] = list[i];
    S = Object.assign({}, S, { i, at: now(), dir });
    // forward into a new scene: transition from the pointer. Backward: cut, scene already entered, only the step replays
    if (id !== fromId) Object.assign(S, { from: fromId, enterAt: dir > 0 ? now() : now() - 99, ox: P.x, oy: P.y });
    history.replaceState(null, '', '#' + id + '-' + step);
    setAct(scenes[id].act);
    if (id !== fromId && dir > 0) sfx('whoosh', isDark(id, step));
    cueStep(id, step);
    renderNotes();
  }
  const next = () => go((S.i + 1) % list.length, 1); // the last step loops back to the start
  const prev = () => { if (S.i > 0) go(S.i - 1, -1); };
  function renderNotes() {
    const [id, step] = list[S.i], n = (scenes[id].notes || {})[step] || '';
    notesEl.textContent = id + ' ' + step + '/' + (scenes[id].steps || 1) + '  ·  ' + (S.i + 1) + '/' + list.length + (n ? '\n' + n : '');
  }

  // ---- input. The very first input on the first page only starts the music (browsers need a gesture for sound).
  function gate() {
    if (frozen != null) frozen = null;
    if (started) { initAudio(); return false; }
    started = true; initAudio();
    return opts.firstInputStartsAudio && S.i === 0;
  }
  function toStage(e) { const r = stage.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; }
  function bind() {
    addEventListener('keydown', e => {
      const k = e.key;
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k)) { e.preventDefault(); if (!gate()) next(); }
      else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); gate(); prev(); }
      else if (k === 'Home') { gate(); go(0, -1); }
      else if (k === 'End') { gate(); go(list.length - 1, -1); }
      else if (k === 'm' || k === 'M') { muted = !muted; logA('mute', muted); playAct(); }
      else if (k === 'n' || k === 'N') notesEl.classList.toggle('on');
      else if (k === 'f' || k === 'F') { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {}); }
    });
    addEventListener('pointermove', e => { [P.x, P.y] = toStage(e); P.inside = true; });
    document.addEventListener('pointerleave', () => { P.x = W / 2; P.y = H / 2; P.inside = false; });
    addEventListener('pointerdown', e => {
      if (e.button !== 0 || notesEl.contains(e.target)) return;
      const gated = gate();
      [P.x, P.y] = toStage(e); P.inside = true;
      const rp = ripples[ripples.n = ((ripples.n || 0) + 1) % ripples.length]; rp.x = P.x; rp.y = P.y; rp.at = now();
      // a click on something alive pokes it (it hops) and does not turn the page; anywhere else turns the page
      const cur = scenes[list[S.i][0]];
      if (cur.poke && cur.lastSt && cur.poke(Object.assign({}, cur.lastSt, { T: now() }), P.x, P.y)) { sfx('tap', 5); return; }
      if (!gated) next();
    });
    addEventListener('resize', fit);
  }
  function fit() { stage.style.transform = 'translate(-50%,-50%) scale(' + Math.min(innerWidth / W, innerHeight / H) + ')'; }

  // ---- seek and audit, for screenshots and QA (scripts/qa.mjs)
  function seek(id, step = 1, beats = 99) {
    if (id == null) { frozen = null; return; }
    const i = list.findIndex(([a, s]) => a === id && s === step);
    if (i < 0) throw new Error('no step ' + id + '-' + step);
    timers.forEach(clearTimeout); timers = [];
    S = { i, at: now(), enterAt: now(), from: null, dir: 1, ox: W / 2, oy: H / 2 };
    frozen = beats; render();
  }
  // TXT: two texts overlap; OBS: text under an image; CUT: text cut off (by a mask, a box or the stage edge).
  // Only the current scene is checked. Run it on end states (__seek(id, step, 99)): entrances clip text on purpose.
  function audit() {
    const sr = stage.getBoundingClientRect(), k = sr.width / W, top = scenes[list[S.i][0]].root;
    const toS = r => ({ x: (r.left - sr.left) / k, y: (r.top - sr.top) / k, w: r.width / k, h: r.height / k });
    const clipR = (el, r) => {
      for (let e = el.parentElement; e && e !== stage; e = e.parentElement) {
        if (getComputedStyle(e).overflow === 'visible') continue;
        const c = toS(e.getBoundingClientRect()), x0 = Math.max(r.x, c.x), y0 = Math.max(r.y, c.y), x1 = Math.min(r.x + r.w, c.x + c.w), y1 = Math.min(r.y + r.h, c.y + c.h);
        r = { x: x0, y: y0, w: Math.max(0, x1 - x0), h: Math.max(0, y1 - y0) };
      }
      return r;
    };
    const opacity = el => { let o = 1; for (let e = el; e && e !== stage.parentElement; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return 0; o *= +cs.opacity; } return o; };
    const texts = [], imgs = [], cut = [], walker = document.createTreeWalker(top, NodeFilter.SHOW_TEXT);
    for (let n; (n = walker.nextNode());) {
      const t = n.textContent.trim(), el = n.parentElement; if (!t || opacity(el) < .35) continue;
      const rg = document.createRange(); rg.selectNodeContents(n);
      [...rg.getClientRects()].filter(r => r.width > 2).forEach(r => {
        const g = toS(r), raw = { x: g.x, y: g.y + g.h * .18, w: g.w, h: g.h * .64 }, s = clipR(el, raw); // glyph body, not line box
        if (s.w < raw.w - 4 || s.h < raw.h - 4) cut.push('CUT ' + t.slice(0, 24));
        if (s.w * s.h > 4) texts.push({ t: t.slice(0, 24), el, r: s });
      });
    }
    top.querySelectorAll('img').forEach(el => { const r = toS(el.getBoundingClientRect()); if (r.w > 1500 || r.w < 1 || opacity(el) < .35) return; const c = clipR(el, r); if (c.w * c.h > 4) imgs.push({ t: 'img:' + (el.getAttribute('src') || '').split('/').pop(), el, r: c }); });
    const ix = (a, b) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
    const out = cut;
    texts.forEach((a, i) => {
      for (let j = i + 1; j < texts.length; j++) { const b = texts[j]; if (a.el !== b.el && ix(a.r, b.r) > .2 * Math.min(a.r.w * a.r.h, b.r.w * b.r.h)) out.push('TXT ' + a.t + ' x ' + b.t); }
      imgs.forEach(b => { if (!b.el.contains(a.el) && ix(a.r, b.r) > .25 * a.r.w * a.r.h) out.push('OBS ' + a.t + ' x ' + b.t); });
    });
    return [...new Set(out)];
  }

  // ---- public API
  function start(o) {
    opts = Object.assign({ bpm: 96, music: {}, musicVolume: .7, transitionBeats: 1.2, firstInputStartsAudio: true, accent: '#ff5a36', mark: '' }, o);
    opts.defaultAct = opts.defaultAct || Object.keys(opts.music)[0];
    BEAT = 60 / opts.bpm;
    stage = document.getElementById('stage');
    list = opts.order.flatMap(id => {
      const s = scenes[id]; if (!s) throw new Error('Deck.start: no scene "' + id + '" (did its <script> load?)');
      return Array.from({ length: s.steps || 1 }, (_, i) => [id, i + 1]);
    });
    opts.order.forEach(id => { const s = scenes[id]; s.root = div(stage, { left: 0, top: 0, width: W + 'px', height: H + 'px', overflow: 'hidden' }); s.root.className = 'scene'; s.root.dataset.scene = id; s.build(s.root, kit); s.root.style.display = 'none'; }); // built visible, so SVG lengths and text sizes measure
    if (opts.mark) { mark = div(stage, { right: '34px', top: '30px', left: 'auto', width: '48px', height: '48px', zIndex: 5 }); mark.id = 'mark'; mark.innerHTML = opts.mark; }
    for (let i = 0; i < 4; i++) { const e = div(stage, { left: 0, top: 0, width: '120px', height: '120px', borderRadius: '50%', border: '3px solid', opacity: 0, pointerEvents: 'none', zIndex: 5 }); ripples.push({ e, at: -99, x: 0, y: 0 }); }
    notesEl = document.createElement('div'); notesEl.id = 'notes'; document.body.appendChild(notesEl);
    if (/[?&](mute|qa)\b/.test(location.search)) muted = true;
    const h = decodeURIComponent(location.hash.slice(1)), i0 = Math.max(0, list.findIndex(([id, s]) => id + '-' + s === h));
    S = { i: i0, at: now(), enterAt: now(), from: null, dir: 1, ox: W / 2, oy: H / 2 };
    setAct(scenes[list[i0][0]].act); renderNotes();
    window.__deck = { steps: list.map(([id, s]) => id + '-' + s), audioLog, tracks, transitionMs: opts.transitionBeats * BEAT * 1000, state: () => ({ scene: list[S.i][0], step: list[S.i][1], index: S.i }) };
    window.__seek = seek; window.__audit = audit;
    bind(); fit(); loop();
    Promise.all([...document.images].map(im => im.decode().catch(() => {}))).then(() => document.body.classList.add('ready'));
  }
  window.Deck = { scene: def => (scenes[def.id] = def), start, kit };
})();
