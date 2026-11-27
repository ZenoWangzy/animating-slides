// The scenes of a real 20-minute meetup talk ("我用 Grok Bot 赚钱", https://zenowangzy.github.io/grokbot-talk/),
// kept as they were given on stage. Only the third-party art is swapped: the characters are drawn shapes here, and the
// speaker's photo and QR code are empty slots. Use it to see how a full talk is built; replace the story with yours.
// Each scene is the engine contract: { id, steps, act, dark, cues, build(root), render(st), poke(st, x, y) }.
(function () {
const kit = Deck.kit;
const BEAT = 60 / 96; // must match bpm in deck.js
const COL = { purple: '#A97EFE', green: '#00C972', blue: '#1084FE', cream: '#FFFBF5', ink: '#0b0b0f' };
const el = (tag, attrs, parent) => { const e = document.createElement(tag); Object.assign(e, attrs || {}); parent.appendChild(e); return e; };
// a cast of drawn characters: [colour, width / height, border-radius]
const SHAPES = { purple: [COL.purple, 1, '50%'], blue: [COL.blue, 1.15, '30%'], pink: ['#FF309B', 1, '50% 50% 42% 42%'], green: [COL.green, 1.5, '999px'], teal: ['#00BCA6', 1, '50%'], orange: ['#FF9800', 1, '50% 50% 50% 10%'] };
function mascot(id, h, parent) {
  const [c, wr, br] = SHAPES[id] || SHAPES.purple, w = h * wr;
  const d = el('div', {}, parent); Object.assign(d.style, { width: w + 'px', height: h + 'px' });
  const b = el('div', {}, d); Object.assign(b.style, { left: 0, top: 0, width: w + 'px', height: h + 'px', borderRadius: br, background: c, boxShadow: '0 10px 24px rgba(27,27,31,.16)' });
  // round eyes with dark pupils and a small smile, so the cast reads as its own and not as the meetup template's characters
  [0, 1].forEach(i => { const e = el('div', {}, b); Object.assign(e.style, { left: w / 2 - h * .24 + i * h * .28 + 'px', top: h * .26 + 'px', width: h * .2 + 'px', height: h * .2 + 'px', borderRadius: '50%', background: '#fff' }); const p = el('div', {}, e); Object.assign(p.style, { left: h * .06 + 'px', top: h * .06 + 'px', width: h * .09 + 'px', height: h * .09 + 'px', borderRadius: '50%', background: COL.ink }); });
  const m = el('div', {}, b); Object.assign(m.style, { left: w / 2 - h * .09 + 'px', top: h * .52 + 'px', width: h * .18 + 'px', height: h * .09 + 'px', borderBottom: Math.max(2, h * .03) + 'px solid ' + COL.ink, borderRadius: '0 0 50% 50% / 0 0 100% 100%' });
  return d;
}
const out = window.Talk = { COL, BEAT, mascot, el };
// The rest of the talk (cover, learn and factory are in opening.js): each scene builds its own layer and draws it from (step, beats, clock).
// Every page must read for non-engineers, with the sound off.
// Changes completed per hour of each day, Asia/Shanghai, 2026-10-01..11-06 (from the speaker's repository history; 1,116 total, 390 between 0 and 8).
const HOURS = [[0,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0],[1,1,0,0,0,0,0,0,0,0,1,0,0,2,1,2,1,0,1,2,2,3,2,4],[4,5,4,6,4,4,3,5,0,1,0,0,3,1,0,3,0,2,0,2,5,4,4,0],[3,0,0,1,7,2,0,0,0,1,4,1,6,4,0,2,1,3,4,1,1,3,3,0],[3,4,2,1,0,0,0,0,0,0,0,0,1,2,4,2,1,1,3,3,2,1,1,0],[1,0,6,2,4,3,2,1,1,1,2,0,2,2,3,0,1,6,2,0,0,0,0,0],[0,5,1,0,1,1,0,0,1,1,1,1,5,1,2,2,1,2,0,2,1,1,0,1],[2,1,0,1,0,2,2,6,3,1,1,1,2,1,1,1,6,3,0,0,2,0,1,0],[2,2,3,1,1,1,1,2,2,0,3,1,2,0,0,1,0,0,1,1,2,1,0,0],[0,2,0,0,1,0,2,1,1,1,2,1,3,1,1,1,0,0,0,0,1,0,0,0],[0,0,0,0,0,0,0,0,2,4,3,4,0,0,0,3,0,1,3,2,1,0,1,1],[0,3,3,0,0,1,1,1,0,0,2,4,2,0,0,0,0,0,1,2,0,0,0,0],[0,1,1,1,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,2,1,2,1,2,0,1,1,0,1,0,0,0,0,1,2,0,2,0,0,1,1],[0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0,0],[0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,1,0],[0,0,0,0,0,0,0,1,1,0,0,0,3,1,1,1,1,1,1,0,0,0,0,1],[1,2,2,0,1,0,0,1,1,0,2,0,0,2,2,2,4,1,3,1,0,3,0,2],[0,2,1,0,1,1,0,1,1,2,2,0,3,3,0,0,1,1,0,3,4,2,1,0],[1,1,1,2,0,0,0,1,3,5,4,1,0,0,0,0,0,0,0,0,2,0,0,0],[5,7,0,0,0,0,0,0,0,0,0,20,3,12,4,2,2,7,7,7,7,5,3,2],[2,3,9,4,2,4,2,1,1,3,1,1,1,0,0,1,0,1,1,2,1,1,0,2],[0,3,1,4,0,3,3,4,0,0,1,0,0,5,0,2,4,1,3,1,0,2,0,1],[0,1,1,0,0,2,0,0,0,0,0,0,0,3,2,1,1,0,1,0,3,1,0,2],[0,4,0,0,0,0,0,12,4,0,8,4,0,2,0,0,0,0,0,0,0,0,0,0],[0,1,0,2,1,1,3,2,2,1,1,1,0,0,0,2,10,7,3,6,2,6,4,3],[6,4,4,11,5,2,0,4,1,2,0,0,1,2,1,0,0,1,1,3,1,1,1,2],[5,1,2,0,0,0,0,1,0,0,2,0,0,0,0,0,3,2,3,1,3,4,0,2],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,1,0,0,0,0,0,1,1,2,0,0,1,1,6,1,5,5,1],[0,2,6,3,2,4,3,5,4,3,3,2,4,3,2,6,2,1,2,0,9,2,4,5],[2,1,0,2,2,1,0,0,0,0,0,0,0,0,0,0,2,1,0,2,0,4,3,3],[1,2,4,4,7,6,2,5,1,2,3,2,4,4,0,4,2,4,1,2,1,0,4,1],[2,0,3,1,1,2,6,5,6,7,6,3,2,0,1,3,1,1,0,0,3,4,4,3]];

function makeScenes(k) {
  const { el, img, mascot, COL, cl, outExpo, inCubic, inOut, spring, hop, BEAT } = k;
  const PINK = '#FF309B', ORANGE = '#FF9800', TEAL = '#00BCA6', GOLD = '#FFD66B', RED = '#d6453d';
  const PAL = [COL.purple, COL.green, COL.blue, ORANGE, PINK, TEAL];
  const div = (parent, css, text) => { const d = el('div', text != null ? { textContent: text } : {}, parent); Object.assign(d.style, css); return d; };
  const tr = (x, y) => 'translate(' + x + 'px,' + y + 'px)';
  const rise = (e, g, dist = 60) => { e.style.opacity = g; e.style.transform = 'translateY(' + (1 - g) * dist + 'px)'; };
  const at = (st, n) => (st.step > n ? 99 : st.step === n ? st.tb : -1); // beats since step n began
  const rgba = (h, a) => 'rgba(' + [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)).join(',') + ',' + a + ')';
  const blink = st => ((st.clock % 3.7) < .12 ? .15 : 1);
  const near = (st, x0, y0, x1, y1) => st.hoverX >= x0 && st.hoverX <= x1 && st.hoverY >= y0 && st.hoverY <= y1;
  const person = (parent, color, size) => {
    const p = div(parent, { width: size + 'px', height: size * 1.3 + 'px' });
    div(p, { left: size * .28 + 'px', top: 0, width: size * .44 + 'px', height: size * .44 + 'px', borderRadius: '50%', background: color });
    div(p, { left: size * .08 + 'px', top: size * .5 + 'px', width: size * .84 + 'px', height: size * .8 + 'px', borderRadius: size * .4 + 'px ' + size * .4 + 'px ' + size * .12 + 'px ' + size * .12 + 'px', background: color });
    return p;
  };
  const botFace = (parent, size) => {
    const b = div(parent, { width: size + 'px', height: size + 'px', borderRadius: size * .3 + 'px', background: COL.ink });
    const eyes = div(b, { left: size * .3 + 'px', top: size * .28 + 'px', width: size * .4 + 'px', height: size * .44 + 'px' });
    [0, 1].forEach(e => div(eyes, { left: e * size * .25 + 'px', top: size * .06 + 'px', width: size * .15 + 'px', height: size * .15 + 'px', borderRadius: '50%', background: '#fff' }));
    div(b, { left: size * .38 + 'px', top: size * .56 + 'px', width: size * .24 + 'px', height: size * .1 + 'px', borderBottom: Math.max(2, size * .04) + 'px solid #fff', borderRadius: '0 0 50% 50% / 0 0 100% 100%' });
    return { b, eyes, size };
  };
  const look = (f, st) => { f.eyes.style.transform = tr(st.mx * f.size * .05, st.my * f.size * .04) + ' scaleY(' + blink(st) + ')'; };
  const heading = (root, text, color = COL.purple) => div(root, { left: '120px', top: '64px', fontSize: '80px', fontWeight: 700, color, whiteSpace: 'nowrap' }, text);
  const chip = (parent, text, color, css = {}) => div(parent, Object.assign({ left: '0', top: '0', padding: '8px 22px', borderRadius: '28px', background: color, color: '#fff', fontSize: '30px', fontWeight: 700, whiteSpace: 'nowrap' }, css), text);
  const NS = 'http://www.w3.org/2000/svg';
  const svg = (parent, css = {}) => { const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 1920 1080'); Object.assign(s.style, { position: 'absolute', left: 0, top: 0, width: '1920px', height: '1080px', overflow: 'visible', pointerEvents: 'none' }, css); parent.appendChild(s); return s; };
  const path = (s, d, color, w, dash) => { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke', color); p.setAttribute('stroke-width', w); p.setAttribute('stroke-linecap', 'round'); if (dash) p.setAttribute('stroke-dasharray', dash); s.appendChild(p); return p; };

  // soft colour fields that drift on their own and lean away from the pointer: the page is never one flat colour
  function aurora(root, base, cols, alpha = .5) {
    root.style.background = base;
    const spots = [[260, 220], [1640, 240], [980, 940], [240, 900], [1600, 860], [960, 300]];
    return cols.map((c, i) => {
      const r = 380 + (i % 3) * 110, e = div(root, { left: 0, top: 0, width: 2 * r + 'px', height: 2 * r + 'px', borderRadius: '50%', background: 'radial-gradient(circle, ' + rgba(c, alpha) + ' 0%, ' + rgba(c, 0) + ' 68%)' });
      return { e, r, x: spots[i % 6][0], y: spots[i % 6][1], sp: .16 + i * .05, ph: i * 1.7, d: .5 + (i % 3) * .35 };
    });
  }
  const drift = (bl, st) => bl.forEach(b => { b.e.style.transform = tr(b.x - b.r + Math.sin(st.clock * b.sp + b.ph) * 150 - st.mx * 50 * b.d, b.y - b.r + Math.cos(st.clock * b.sp * 1.3 + b.ph) * 110 - st.my * 36 * b.d); });
  // template characters that float around a page; hover lifts them, a click makes them hop
  function friends(parent, list) { return list.map(([id, h, x, y], i) => { const m = mascot(id, h, parent); Object.assign(m.style, { left: x + 'px', top: y + 'px' }); return { m, x, y, h, i, pokeAt: -99, hv: 0 }; }); }
  function floatFriends(fs, st) {
    fs.forEach(f => {
      const over = near(st, f.x, f.y, f.x + f.h * 1.2, f.y + f.h) ? 1 : 0; f.hv += (over - f.hv) * st.ease(10);
      const pk = hop(st.T - f.pokeAt), w = st.clock * (1.1 + f.i * .17) + f.i * 2;
      f.m.style.transform = tr(-st.mx * (14 + f.i * 6), Math.sin(w) * 10 - st.my * 10 - 14 * f.hv + pk.y) + ' rotate(' + Math.sin(w * .6) * 6 + 'deg) scale(' + (1 + .06 * f.hv + pk.sq) + ',' + (1 + .06 * f.hv - pk.sq) + ')';
    });
  }
  const pokeFriends = (fs, st, x, y) => { const f = fs.find(f => x >= f.x && x <= f.x + f.h * 1.2 && y >= f.y && y <= f.y + f.h); if (f) { f.pokeAt = st.T; return true; } };

  // ---- the ledger card, used at the start and again at the end
  function ledgerCard(root) {
    const card = div(root, { left: '410px', top: '190px', width: '1100px', height: '700px', background: COL.cream, borderRadius: '36px', boxShadow: '0 40px 90px rgba(40,20,90,.28)', overflow: 'hidden' });
    const shine = div(card, { left: '-400px', top: 0, width: '300px', height: '700px', background: 'linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,.55), rgba(255,255,255,0))' });
    div(card, { left: '80px', top: '60px', font: '700 30px DeckMono,monospace', color: '#8a8a92', letterSpacing: '.2em' }, 'MY LEDGER · 我的一页账本');
    const rows = [['支出', '每月 500 美元'], ['收入', '50 万'], ['员工', '1 个人']].map(([a, b], i) => {
      const r = div(card, { left: '80px', top: 150 + i * 160 + 'px', width: '940px', height: '130px', overflow: 'hidden', borderBottom: '3px solid #ece6dc' });
      const ra = div(r, { left: 0, top: '38px', fontSize: '48px', color: '#77777f' }, a);
      const rb = div(r, { right: 0, left: 'auto', top: '6px', fontSize: '96px', fontWeight: 700, color: COL.ink, whiteSpace: 'nowrap' }, b);
      return { r, ra, rb, h: 0 };
    });
    const extra = div(card, { left: '80px', top: '615px', fontSize: '44px', fontWeight: 700, color: COL.purple, whiteSpace: 'nowrap' }, '+ 一群 Grok Bot');
    return { card, rows, extra, shine };
  }
  function drawCard(L, st) {
    L.card.style.transform = 'perspective(1600px) rotateY(' + st.mx * 7 + 'deg) rotateX(' + -st.my * 6 + 'deg) translateY(' + Math.sin(st.clock * 1.1) * 8 + 'px) rotate(-1.5deg)';
    L.shine.style.transform = 'translateX(' + ((st.clock * 260) % 2600) + 'px)';
    L.rows.forEach((r, i) => { r.h += ((near(st, 410, 340 + i * 160, 1510, 470 + i * 160) ? 1 : 0) - r.h) * st.ease(10); r.rb.style.color = r.h > .5 ? COL.purple : COL.ink; r.ra.style.color = r.h > .5 ? COL.purple : '#77777f'; });
  }
  const LEDGER_FRIENDS = [['pink', 130, 1440, 110], ['green', 120, 200, 700], ['blue', 120, 1580, 780], ['teal', 90, 290, 170]];

  // ---- S1 ledger: the three words are there from the start, each number waits for a click
  const ledger = {
    id: 'ledger', steps: 4,
    // sfx on entrances: [beat since the step began, sound, arg, count length in beats]; mirrors the timings in render
    cues: { 2: [[0, 'pop', 0]], 3: [[0, 'pop', 4], [0, 'count', 'coin', 1.6]], 4: [[0, 'pop', 7]] },
    build(root) {
      this.bl = aurora(root, '#F5F0FF', [COL.purple, COL.green, COL.blue, ORANGE, PINK, TEAL], .42);
      this.fr = friends(root, LEDGER_FRIENDS);
      this.L = ledgerCard(root); this.L.extra.style.display = 'none';
    },
    render(st) {
      drift(this.bl, st); floatFriends(this.fr, st); drawCard(this.L, st);
      this.L.card.style.transform += ' scale(' + (.92 + .08 * outExpo(st.enter / 1.2)) + ')';
      this.L.rows.forEach((r, i) => {
        const on = at(st, i + 2);
        rise(r.rb, outExpo(on / .9), 120);
        if (i === 1 && on >= 0) r.rb.textContent = Math.round(50 * outExpo(cl(on / 1.6))) + ' 万';
      });
    },
    poke(st, x, y) { return pokeFriends(this.fr, st, x, y); },
  };

  // ---- S2 the boss's problem: three pains, each one keeps moving
  const problem = {
    id: 'problem', steps: 4,
    // sfx on entrances: [beat since the step began, sound, arg, count length in beats]; mirrors the timings in render
    cues: { 1: [[0, 'card', 0]], 2: [[0, 'card', 3]], 3: [[0, 'card', 7]], 4: [[0.3, 'pop', 0], [1.1, 'strike'], [1.6, 'pop', 3], [3, 'pop', 7], [4.2, 'whoosh', 0], [5.2, 'bubble', 7]] },
    build(root) {
      this.bl = aurora(root, COL.cream, [COL.purple, ORANGE, COL.blue, PINK], .16);
      this.head = heading(root, '老板的难题');
      this.cols = [0, 1, 2].map(i => div(root, { left: 120 + i * 580 + 'px', top: '260px', width: '540px', height: '740px', borderRadius: '32px', background: '#fff', boxShadow: '0 20px 60px rgba(27,27,31,.08)', overflow: 'hidden' }));
      this.tags = ['痛点 1：规格乱', '痛点 2：等', '痛点 3：纯手工'].map((t, i) => chip(root, t, [COL.purple, COL.blue, ORANGE][i], { left: 120 + i * 580 + 'px', top: '196px' }));
      // 1: one fruit, sold by the box, the head, the case or the gram, and the supermarket keeps asking for changes
      const c0 = this.cols[0];
      this.fruit = div(c0, { left: '200px', top: '120px', width: '140px', height: '140px' });
      [[30, 10], [78, 18], [10, 58], [56, 62], [96, 66], [36, 100], [80, 104]].forEach(([x, y]) => { const b = div(this.fruit, { left: x + 'px', top: y + 'px', width: '46px', height: '46px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #8d92ff, #3b3fae 70%)' }); div(b, { left: '18px', top: '6px', width: '10px', height: '6px', borderRadius: '3px', background: '#2b2e80' }); });
      this.specs = ['按盒', '按头', '按箱', '按克'].map((t, i) => chip(c0, t, PAL[i], { fontSize: '30px' }));
      this.market = chip(c0, '商超：规格要改！', RED, { left: '300px', top: '2px', fontSize: '24px' });
      this.loss = div(c0, { left: '40px', top: '360px', font: '700 30px DeckMono,monospace', color: '#77777f', whiteSpace: 'nowrap' }, '损耗：？');
      div(c0, { left: '40px', top: '440px', width: '470px', fontSize: '40px', fontWeight: 700, color: COL.ink, lineHeight: 1.3 }, '同一种水果，按盒、按头、按箱、按克卖，还要跟着商超改');
      div(c0, { left: '40px', top: '620px', width: '470px', fontSize: '32px', fontWeight: 700, color: RED, lineHeight: 1.4 }, '现成系统管不住，损耗也算不清');
      // 2: the boss asks; the calendar keeps turning while finance works it out
      const c1 = this.cols[1];
      chip(c1, '「10 月哪种货最赚钱？」', COL.purple, { left: '40px', top: '50px', borderRadius: '26px 26px 26px 6px', fontSize: '32px', padding: '18px 26px' });
      this.reply = div(c1, { left: '250px', top: '140px', padding: '12px 22px', borderRadius: '22px 22px 6px 22px', background: '#eee8f8', color: '#55555c', fontSize: '26px', fontWeight: 700, whiteSpace: 'nowrap' }, '财务：在算了…');
      this.cal = div(c1, { left: '150px', top: '210px', width: '240px', height: '220px', borderRadius: '24px', background: '#fff', border: '4px solid ' + COL.ink, overflow: 'hidden' });
      div(this.cal, { left: 0, top: 0, width: '240px', height: '50px', background: COL.ink });
      this.calN = div(this.cal, { left: 0, top: '60px', width: '240px', textAlign: 'center', font: '700 120px DeckMono,monospace', color: COL.ink });
      this.calDay = div(this.cal, { left: 0, top: '8px', width: '240px', textAlign: 'center', fontSize: '26px', fontWeight: 700, color: '#fff' }, '第 1 天');
      this.bar = div(c1, { left: '120px', top: '460px', width: '300px', height: '14px', borderRadius: '7px', background: '#eee' });
      this.barIn = div(this.bar, { left: 0, top: 0, width: '300px', height: '14px', borderRadius: '7px', background: COL.blue, transformOrigin: '0 50%' });
      div(c1, { left: '40px', top: '520px', width: '470px', fontSize: '46px', fontWeight: 700, color: COL.ink, lineHeight: 1.3 }, '老板要一个数，财务要算 3 天');
      // 3: everything by hand: paper slips, a spreadsheet filled cell by cell, and an inspector who finds it backward
      const c2 = this.cols[2];
      this.grid = div(c2, { left: '150px', top: '40px', width: '350px', height: '210px', background: '#fff', border: '3px solid #cfd8cf', borderRadius: '8px', overflow: 'hidden' });
      this.cells = [];
      for (let r = 0; r < 6; r++) for (let c = 0; c < 5; c++) { const cell = div(this.grid, { left: c * 70 + 'px', top: r * 35 + 'px', width: '70px', height: '35px', borderRight: '1px solid #dfe7df', borderBottom: '1px solid #dfe7df' }); this.cells.push(div(cell, { left: '10px', top: '13px', width: 30 + ((r * 7 + c * 3) % 4) * 6 + 'px', height: '9px', borderRadius: '4px', background: '#2f8a4b' })); }
      div(this.grid, { left: 0, top: 0, width: '350px', height: '35px', background: 'rgba(47,138,75,.15)' });
      div(c2, { left: '400px', top: '256px', fontSize: '22px', fontWeight: 700, color: '#2f8a4b' }, '手工 Excel');
      this.slips = [0, 1, 2].map(i => { const s = div(c2, { left: 28 + i * 14 + 'px', top: 70 + i * 26 + 'px', width: '110px', height: '140px', background: '#fffdf6', borderRadius: '6px', boxShadow: '0 6px 16px rgba(0,0,0,.12)', transformOrigin: '50% 100%' }); [0, 1, 2, 3].forEach(l => div(s, { left: '14px', top: 22 + l * 26 + 'px', width: 80 - l * 10 + 'px', height: '8px', borderRadius: '4px', background: '#c9c3ba' })); return s; });
      div(c2, { left: '30px', top: '256px', fontSize: '22px', fontWeight: 700, color: '#8a7a5a' }, '手工单据');
      this.lens = div(c2, { left: 0, top: 0, width: '96px', height: '96px', borderRadius: '50%', border: '9px solid ' + COL.ink, background: 'rgba(255,255,255,.35)' });
      div(this.lens, { left: '72px', top: '76px', width: '50px', height: '14px', borderRadius: '7px', background: COL.ink, transform: 'rotate(45deg)', transformOrigin: '0 50%' });
      this.stamp = div(c2, { left: '330px', top: '280px', padding: '6px 18px', border: '5px solid ' + RED, borderRadius: '12px', color: RED, fontSize: '34px', fontWeight: 700, whiteSpace: 'nowrap' }, '太落后了');
      div(c2, { left: '40px', top: '410px', width: '470px', fontSize: '44px', fontWeight: 700, color: COL.ink, lineHeight: 1.3 }, '手工单据，手工 Excel');
      div(c2, { left: '40px', top: '540px', width: '470px', fontSize: '30px', fontWeight: 700, color: RED, lineHeight: 1.4 }, '管理单位来检查，觉得特别落后');
      div(c2, { left: '40px', top: '610px', fontSize: '27px', color: '#55555c', whiteSpace: 'nowrap' }, '财务将近 20 人，一周上 6 天班');
      this.week = '一二三四五六日'.split('').map((d, i) => div(c2, { left: 40 + i * 52 + 'px', top: '665px', width: '44px', height: '44px', borderRadius: '10px', textAlign: 'center', lineHeight: '44px', fontSize: '22px', fontWeight: 700, color: '#fff', background: i < 6 ? COL.ink : '#ddd' }, d));
      // 4: the bridge to learning: no system to buy, so build one; but I am not a programmer
      this.br = div(root, { left: 0, top: 0, width: '1920px', height: '1080px' });
      this.brL = ['没有现成的系统能买', '那就只能自己造一套', '可我不是程序员，也没有技术团队'].map((t, i) => div(this.br, { left: '0', top: 230 + i * 150 + 'px', width: '1920px', textAlign: 'center', fontSize: i === 2 ? '72px' : '64px', fontWeight: 700, color: [ '#77777f', COL.ink, COL.purple][i], whiteSpace: 'nowrap' }, t));
      this.brStrike = div(this.br, { left: '650px', top: '270px', width: '620px', height: '8px', borderRadius: '4px', background: RED, transformOrigin: '0 50%' });
      this.brBot = botFace(this.br, 150); this.brBot.b.style.left = '885px'; this.brBot.b.style.top = '760px';
      this.brSay = chip(this.br, '那就让 Grok Bot 先去学高手怎么做', COL.ink, { left: '1060px', top: '790px', fontSize: '34px', padding: '16px 28px', borderRadius: '30px 30px 30px 6px' });
    },
    render(st) {
      drift(this.bl, st);
      const s4 = at(st, 4), dim = s4 < 0 ? 0 : inOut(s4 / .8);
      this.cols.forEach((c, i) => {
        const on = at(st, i + 1), g = outExpo(on / 1), hv = near(st, 120 + i * 580, 260, 660 + i * 580, 1000) && s4 < 0 ? 1 : 0;
        c.style.opacity = g * (1 - .96 * dim); c.style.transform = 'translateY(' + ((1 - g) * 80 - 10 * hv) + 'px) rotate(' + (1 - g) * (i - 1) * 3 + 'deg) scale(' + (1 - .1 * dim) + ')';
        c.style.boxShadow = hv ? '0 30px 70px rgba(27,27,31,.16)' : '0 20px 60px rgba(27,27,31,.08)';
        this.tags[i].style.opacity = outExpo((on - .3) / .8) * (1 - .96 * dim);
      });
      this.head.style.opacity = 1 - .96 * dim;
      const b = st.clock / BEAT;
      // card 1: specs orbit and swap every beat; when the supermarket asks, they scramble
      const ask = ((b % 8) + 8) % 8, scramble = ask < 1.2 ? 3 : 1;
      this.specs.forEach((t, i) => { const a = (i / 4 + Math.floor(b) * .25 * scramble + .25 * inOut(b % 1)) * Math.PI * 2; t.style.transform = tr(270 + Math.cos(a) * 200 - 48, 190 + Math.sin(a) * 120 - 26); });
      this.fruit.style.transform = 'rotate(' + Math.sin(st.clock * 2) * 4 + 'deg) scale(' + (1 + .03 * Math.sin(st.clock * 3)) + ')';
      const ms = ask < 2.4 ? spring(ask * BEAT, 2.4, .4) : 1 - cl((ask - 2.4) / .4);
      this.market.style.transform = 'scale(' + Math.max(0, ms) + ')'; this.market.style.opacity = ask < 2.8 ? 1 : 0;
      this.loss.textContent = '损耗：' + (Math.floor(b * 2) % 3 === 0 ? '？' : Math.floor(b * 2) % 3 === 1 ? '？？' : '算不清');
      // card 2: never stops turning
      const d = Math.floor(b / 2) % 3, ph = (b / 2) % 1;
      this.calN.textContent = String(d + 1); this.calDay.textContent = '第 ' + (d + 1) + ' 天';
      this.calN.style.transform = 'rotateX(' + (ph < .18 ? 70 * (1 - ph / .18) : 0) + 'deg)';
      this.barIn.style.transform = 'scaleX(' + ((b / 6) % 1) + ')';
      this.reply.textContent = '财务：在算了' + '…'.repeat(1 + Math.floor(b) % 3);
      this.cal.style.transform = 'rotate(' + Math.sin(st.clock * 1.5) * 2 + 'deg)';
      // card 3: a cell at a time, slips shuffle, the inspector's lens roams and stamps
      const filled = Math.floor(b * 2) % (this.cells.length + 6);
      this.cells.forEach((c, i) => { c.style.opacity = i < filled ? 1 : 0; });
      this.slips.forEach((s, i) => { s.style.transform = 'rotate(' + ((i - 1) * 8 + Math.sin(st.clock * 1.7 + i) * 3) + 'deg)'; });
      const la = st.clock * .7;
      this.lens.style.transform = tr(250 + Math.cos(la) * 120, 90 + Math.sin(la * 1.3) * 60);
      const sp = (b % 6) / 6;
      this.stamp.style.opacity = sp > .5 ? 1 : 0; this.stamp.style.transform = 'rotate(-12deg) scale(' + (sp > .5 ? 1 + .8 * Math.exp(-(sp - .5) * 30) : 1) + ')';
      // bridge
      this.br.style.display = s4 < 0 ? 'none' : '';
      this.brL.forEach((l, i) => rise(l, outExpo((s4 - [0.3, 1.6, 3][i]) / .9), 40));
      this.brStrike.style.transform = 'scaleX(' + outExpo((s4 - 1.1) / .6) + ')';
      const bb = spring((s4 - 4.2) * BEAT, 1.8, .4);
      this.brBot.b.style.transform = tr((1 - outExpo((s4 - 4.2) / 1.2)) * 900, Math.sin(st.clock * 2.4) * 6) + ' scale(' + Math.max(0, bb) + ') rotate(' + (1 - outExpo((s4 - 4.2) / 1.2)) * 300 + 'deg)';
      look(this.brBot, st);
      this.brSay.style.opacity = outExpo((s4 - 5.2) / .6); this.brSay.style.transform = 'scale(' + Math.max(0, spring((s4 - 5.2) * BEAT, 2.2, .45)) + ')';
    },
  };

  // ---- night: a city of real data. Flat, it is a 37-day x 24-hour sheet; tilted, every hour of work becomes a tower
  const CW = 56, CH = 26, GW = 24 * CW, GH = 37 * CH, MAXH = 20;
  const night = {
    id: 'night', steps: 3, dark: true,
    // sfx on entrances: [beat since the step began, sound, arg, count length in beats]; mirrors the timings in render
    cues: { 1: [[0.2, 'count', 'tick', 1], [0.3, 'pop', 0], [1.6, 'riser']], 2: [[0, 'bubble', 3], [0.67, 'bubble', 7], [1.33, 'bubble', 3], [2, 'bubble', 7], [2.67, 'bubble', 3], [3.33, 'bubble', 7], [4, 'bubble', 3], [4.67, 'bubble', 7], [5.33, 'bubble', 3]], 3: [[0, 'whoosh', 1], [0.3, 'pop', -5], [1.8, 'scribble'], [3.1, 'scribble'], [4.4, 'stamp'], [4.5, 'shimmer', 0]] },
    build(root) {
      root.style.background = 'radial-gradient(ellipse at 55% 35%, #2b2257 0%, #141028 55%, #07060d 100%)';
      this.stars = Array.from({ length: 90 }, (_, i) => { const x = (i * 977) % 1920, y = (i * 563) % 1080, s = 1 + (i % 3); return div(root, { left: x + 'px', top: y + 'px', width: s + 'px', height: s + 'px', borderRadius: '50%', background: '#fff' }); });
      this.bl = aurora(root, root.style.background, [COL.purple, COL.blue, PINK], .18); root.style.background = 'radial-gradient(ellipse at 55% 35%, #2b2257 0%, #141028 55%, #07060d 100%)';
      this.world = div(root, { left: 0, top: 0, width: '1920px', height: '1080px', perspective: '1700px', perspectiveOrigin: '50% 30%' });
      this.ground = div(this.world, { left: 0, top: 0, width: GW + 'px', height: GH + 'px', transformStyle: 'preserve-3d', transformOrigin: '50% 50%', background: 'rgba(255,255,255,.03)', borderRadius: '10px' });
      div(this.ground, { left: 0, top: 0, width: 8 * CW + 'px', height: GH + 'px', background: 'rgba(169,126,254,.16)' });
      this.towers = []; this.cells = [];
      HOURS.forEach((row, d) => row.forEach((n, h) => {
        if (!n) return;
        const isN = h < 8, x = h * CW + 4, y = d * CH + 3;
        const c = div(this.ground, { left: x + 'px', top: y + 'px', width: CW - 8 + 'px', height: CH - 6 + 'px', borderRadius: '4px', background: isN ? rgba(GOLD, .35 + .65 * n / MAXH) : rgba('#7d86ff', .18 + .5 * n / MAXH) });
        this.cells.push({ c, h });
        const H = 14 + n * 15;
        const t = div(this.ground, { left: x + 'px', top: y + CH - 6 - H + 'px', width: CW - 8 + 'px', height: H + 'px', transformOrigin: '50% 100%', borderRadius: '3px 3px 0 0', background: isN ? 'linear-gradient(to top, ' + rgba(GOLD, .95) + ', ' + rgba('#ffb36b', .7) + ')' : 'linear-gradient(to top, ' + rgba('#6c74e8', .7) + ', ' + rgba('#3a3f9a', .35) + ')', boxShadow: isN ? '0 0 18px ' + rgba(GOLD, .55) : 'none' });
        this.towers.push({ t, d, h });
      }));
      [0, 3, 6, 9, 12, 15, 18, 21].forEach(h => div(this.ground, { left: h * CW + 'px', top: '-46px', font: '700 26px DeckMono,monospace', color: h < 8 ? GOLD : '#8e88a8', whiteSpace: 'nowrap' }, h + '点'));
      div(this.ground, { left: '-120px', top: '-6px', font: '700 24px DeckMono,monospace', color: '#8e88a8' }, '10/1');
      div(this.ground, { left: '-120px', top: GH - 26 + 'px', font: '700 24px DeckMono,monospace', color: '#8e88a8' }, '11/6');
      div(this.ground, { left: '10px', top: GH + 14 + 'px', fontSize: '28px', fontWeight: 700, color: GOLD, whiteSpace: 'nowrap' }, '半夜 0–8 点');
      this.n1 = div(root, { left: '110px', top: '90px', width: '760px', color: '#fff' });
      div(this.n1, { position: 'relative', fontSize: '40px', fontWeight: 700, color: '#bdb6d8' }, '37 天里，半夜 0 点到早上 8 点做完的');
      div(this.n1, { position: 'relative', font: '700 210px DeckMono,monospace', color: GOLD, lineHeight: 1.02, textShadow: '0 0 40px ' + rgba(GOLD, .45) }, '35%');
      div(this.n1, { position: 'relative', fontSize: '44px', fontWeight: 700, lineHeight: 1.4 }, '三分之一的活是半夜干的，加班费是 0');
      this.cap = div(root, { left: '110px', top: '1000px', fontSize: '24px', color: '#8e88a8', whiteSpace: 'nowrap' }, '每一格是一小时，越高这一小时做完的越多（10 月 1 日 – 11 月 6 日，共 1,116 个）');
      // 2: "why so slow?" said 18 times
      this.chat = div(root, { left: '1060px', top: '100px', width: '760px', height: '880px', overflow: 'hidden' });
      this.bubs = Array.from({ length: 18 }, (_, i) => div(this.chat, { left: (i % 2) * 70 + 'px', top: '0', padding: '18px 30px', borderRadius: '26px 26px 6px 26px', background: COL.green, color: '#fff', fontSize: '36px', fontWeight: 700, whiteSpace: 'nowrap', boxShadow: '0 10px 30px rgba(0,0,0,.35)' }, '为什么这么久？'));
      this.cnt = div(root, { left: '1500px', top: '780px', font: '700 140px DeckMono,monospace', color: '#fff' }, '×18');
      this.cntL = div(root, { left: '1340px', top: '950px', fontSize: '32px', color: '#bdb6d8', whiteSpace: 'nowrap' }, '我对 Grok Bot 说得最多的一句话');
      // 3: the bill. 81 people stand on a floor; a receipt prints: their work, one month, 500 dollars
      this.bill = div(root, { left: 0, top: 0, width: '1920px', height: '1080px' });
      this.billT = div(this.bill, { left: '110px', top: '80px', fontSize: '64px', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }, '这支队伍一个月多少钱？');
      const cw = div(this.bill, { left: 0, top: 0, width: '1100px', height: '1080px', perspective: '1400px', perspectiveOrigin: '50% 20%' });
      this.floor = div(cw, { left: '170px', top: '330px', width: '720px', height: '720px', transformStyle: 'preserve-3d', transformOrigin: '50% 50%', background: 'radial-gradient(circle, rgba(169,126,254,.35), rgba(169,126,254,0) 70%)', borderRadius: '50%' });
      this.crowd = Array.from({ length: 81 }, (_, i) => { const p = person(this.floor, PAL[i % 4], 46); Object.assign(p.style, { left: 60 + (i % 9) * 70 + 'px', top: 60 + Math.floor(i / 9) * 70 + 'px', transformOrigin: '50% 100%' }); return p; });
      this.crowdL = div(this.bill, { left: '114px', top: '180px', fontSize: '40px', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }, '81 个程序员的活');
      this.slot = div(this.bill, { left: '1180px', top: '170px', width: '600px', height: '34px', borderRadius: '17px', background: '#2a2547', boxShadow: 'inset 0 4px 10px rgba(0,0,0,.6)' });
      this.paperW = div(this.bill, { left: '1220px', top: '187px', width: '520px', height: '0px', overflow: 'hidden', transformOrigin: '50% 0' });
      this.paper = div(this.paperW, { left: 0, top: 0, width: '520px', height: '640px', background: '#fffdf7', clipPath: 'polygon(0 0,100% 0,100% 97%,95% 100%,90% 97%,85% 100%,80% 97%,75% 100%,70% 97%,65% 100%,60% 97%,55% 100%,50% 97%,45% 100%,40% 97%,35% 100%,30% 97%,25% 100%,20% 97%,15% 100%,10% 97%,5% 100%,0 97%)' });
      const line = (y, a, b, css = {}) => { div(this.paper, Object.assign({ left: '40px', top: y + 'px', font: '700 28px DeckMono,monospace', color: COL.ink, whiteSpace: 'nowrap' }, css), a); if (b != null) div(this.paper, Object.assign({ right: '40px', left: 'auto', top: y + 'px', font: '700 28px DeckMono,monospace', color: COL.ink, whiteSpace: 'nowrap' }, css), b); };
      line(40, 'ZENOFORGE · 月账单', null, { color: '#77777f', fontSize: '26px' });
      div(this.paper, { left: '40px', top: '96px', width: '440px', borderTop: '3px dashed #c9c3ba' });
      line(130, '81 个程序员的活', '✓', { fontFamily: 'DeckSans,sans-serif' });
      line(190, '37 天 1,116 个改动', '✓', { fontFamily: 'DeckSans,sans-serif' });
      line(250, '半夜干的 35%', '加班费 0', { fontFamily: 'DeckSans,sans-serif' });
      line(310, '招聘、社保、工位', '0', { fontFamily: 'DeckSans,sans-serif', color: '#77777f' });
      div(this.paper, { left: '40px', top: '380px', width: '440px', borderTop: '3px dashed #c9c3ba' });
      line(420, '合计（每月）', null, { fontFamily: 'DeckSans,sans-serif', fontSize: '34px' });
      this.total = div(this.paper, { left: '40px', top: '470px', width: '440px', textAlign: 'right', font: '700 120px DeckMono,monospace', color: COL.purple }, '$500');
    },
    render(st) {
      drift(this.bl, st);
      this.stars.forEach((s, i) => { s.style.opacity = .3 + .7 * Math.abs(Math.sin(st.clock * (.6 + (i % 5) * .2) + i)); });
      const s1 = at(st, 1), s2 = at(st, 2), s3 = at(st, 3);
      // pose: 0 = flat sheet, 1 = tilted city. Flat first, then it stands up; the chat lays it flat again
      const p = st.step === 1 ? inOut((s1 - 1.6) / 2.2) : st.step === 2 ? 1 - inOut(s2 / 1.4) : 0;
      const cx = 1300 + (1320 - 1300) * p, cy = 600 + (520 - 600) * p, sc = .6 + (.68 - .6) * p;
      const rx = (58 + st.my * 4) * p, rz = (-30 + Math.sin(st.clock * .18) * 5 + st.mx * 5) * p;
      this.ground.style.transform = tr(cx - GW / 2, cy - GH / 2) + ' rotateX(' + rx + 'deg) rotateZ(' + rz + 'deg) scale(' + sc + ')';
      this.world.style.opacity = st.step === 3 ? 0 : st.step === 2 ? .3 + .7 * (1 - cl(s2 / 1.4)) : 1;
      this.world.style.display = st.step === 3 ? 'none' : '';
      const N = this.towers.length;
      if (st.step < 3) {
        this.cells.forEach(c => { c.c.style.opacity = outExpo((s1 - .2 - c.h / 24 * .8) / .6); });
        this.towers.forEach((t, i) => { const g = st.step === 1 ? outExpo((s1 - 2.4 - (t.d / 37) * 1.4) / .9) : 1 - cl(s2 / 1); t.t.style.transform = 'rotateX(-90deg) scaleY(' + Math.max(.001, g) + ')'; t.t.style.opacity = g > .01 ? 1 : 0; });
      }
      rise(this.n1, outExpo((s1 - .3) / 1) * (st.step === 1 ? 1 : 0), 50);
      this.n1.style.display = st.step === 1 ? '' : 'none';
      this.cap.style.opacity = st.step === 1 ? outExpo((s1 - 1) / 1) * (1 - p) : 0;
      this.chat.style.display = this.cnt.style.display = this.cntL.style.display = st.step === 2 ? '' : 'none';
      const shown = Math.min(18, Math.floor(cl(s2 / 6) * 18 + (s2 > 0 ? 1 : 0)));
      this.bubs.forEach((b, i) => { const age = shown - 1 - i; b.style.opacity = i < shown ? cl((780 - age * 80 + 60) / 80) : 0; b.style.transform = 'translateY(' + (780 - age * 80) + 'px) scale(' + (i === shown - 1 ? spring((s2 - i / 3) * BEAT, 2, .4) : 1) + ')'; });
      this.cnt.textContent = '×' + shown;
      // bill
      this.bill.style.display = st.step === 3 ? '' : 'none';
      if (st.step === 3) {
        rise(this.billT, outExpo(s3 / .8), 30);
        this.floor.style.transform = 'rotateX(' + (60 + st.my * 5) + 'deg) rotateZ(' + (-18 + st.mx * 10 + Math.sin(st.clock * .3) * 4) + 'deg)';
        this.crowd.forEach((p, i) => { const g = outExpo((s3 - .3 - i * .015) / .6), wave = Math.max(0, Math.sin(st.clock * 3 - (i % 9) * .5 - Math.floor(i / 9) * .5)) * 10; p.style.transform = 'rotateX(-90deg) translateY(' + (-(1 - g) * 400 - wave) + 'px)'; p.style.opacity = g; });
        this.crowdL.style.opacity = outExpo((s3 - 1.2) / .8);
        const pr = outExpo((s3 - 1.8) / 2.6);
        this.paperW.style.height = 640 * pr + 'px'; this.paper.style.transform = 'translateY(' + (640 * pr - 640) + 'px)';
        this.paperW.style.transform = 'perspective(1200px) rotateX(' + (6 - st.my * 6) + 'deg) rotateY(' + st.mx * 10 + 'deg) rotate(' + Math.sin(st.clock * 1.3) * 1 + 'deg)';
        this.total.style.transform = 'scale(' + (s3 > 4.4 ? 1 + .25 * Math.exp(-(s3 - 4.4) * 3) * Math.cos((s3 - 4.4) * 9) : 1) + ')';
      }
    },
  };

  // ---- brain: it reads the paperwork, builds the business picture, and answers each of the boss's three pains
  const NODES = ['商品', '规格', '批次', '库存', '订单', '客户', '财务'];
  const DOMAINS = [['贸易', COL.purple], ['物流', COL.blue], ['工厂加工', ORANGE], ['供应链', COL.green], ['财务', PINK]];
  const brain = {
    id: 'brain', steps: 4, dark: step => step >= 3,
    // sfx on entrances: [beat since the step began, sound, arg, count length in beats]; mirrors the timings in render
    cues: { 1: [[0, 'pop', -5], [1.2, 'bubble', 0], [1.45, 'bubble', 2], [1.7, 'bubble', 4], [1.95, 'bubble', 6], [2.2, 'bubble', 8], [2.45, 'bubble', 10], [2.7, 'bubble', 12]], 2: [[0, 'card', 0], [0.6, 'strike'], [1.1, 'card', 3], [1.7, 'strike'], [2.2, 'card', 7], [2.8, 'strike']], 3: [[0, 'whoosh', 1], [0.5, 'pop', 0], [1.6, 'pop', 2], [1.95, 'pop', 4], [2.3, 'pop', 6], [2.65, 'pop', 8], [3, 'pop', 10], [3, 'shimmer', 0]], 4: [[0, 'card', -5], [0.6, 'count', 'coin', 1.4], [1.6, 'scribble'], [3, 'stamp'], [3.4, 'shimmer', 5]] },
    build(root) {
      this.bl = aurora(root, COL.cream, [COL.green, COL.blue, COL.purple, ORANGE], .22);
      this.head = heading(root, '企业大脑：Agent Native 智能中台');
      this.theory = div(root, { left: '124px', top: '180px', fontSize: '28px', color: '#55555c', whiteSpace: 'nowrap' }, '一群 Grok Bot 住在系统里干活 · 底层 Ontology 本体 · 上层经营决策分析');
      this.BC = [640, 560];
      this.links = svg(root);
      this.nodes = NODES.map((t, i) => { const n = chip(root, t, PAL[i % 6], { fontSize: '30px' }); n.style.zIndex = 2; return { n, a: i / NODES.length * Math.PI * 2 - Math.PI / 2, p: path(this.links, 'M0 0', rgba(PAL[i % 6], .6), 3, '6 8') }; });
      this.docs = ['入库单', '翻箱单', '出库单', '调拨单'].map((t, i) => { const d = div(root, { left: '0', top: '0', width: '150px', height: '190px', borderRadius: '14px', background: '#fff', boxShadow: '0 12px 30px rgba(27,27,31,.14)' }); div(d, { left: '18px', top: '20px', width: '114px', height: '12px', borderRadius: '6px', background: PAL[i] }); [0, 1, 2, 3].forEach(r => div(d, { left: '18px', top: 52 + r * 24 + 'px', width: 114 - r * 16 + 'px', height: '9px', borderRadius: '5px', background: '#e6e1d8' })); div(d, { left: 0, top: '150px', width: '150px', textAlign: 'center', fontSize: '26px', fontWeight: 700, color: COL.ink }, t); return d; });
      this.core = botFace(root, 200); this.core.b.style.left = this.BC[0] - 100 + 'px'; this.core.b.style.top = this.BC[1] - 100 + 'px';
      this.cap1 = div(root, { left: '120px', top: '950px', width: '1100px', fontSize: '38px', fontWeight: 700, color: COL.ink }, '单据进来，它按本体读懂货、规格和钱，连成生意的全貌');
      // 2: three answers, one per pain
      const ANS = [['痛点 1：规格乱，损耗算不清', '规格怎么变，都能换算', '盘点表哪几行对不上，它直接指出来', COL.purple], ['痛点 2：老板要个数，财务算 3 天', '问一句，马上出数', '「10 月哪种货最赚钱？」', COL.blue], ['痛点 3：手工单据，手工 Excel', '拍张照，自动进账', '不用再一张张手抄', ORANGE]];
      this.cards = ANS.map(([old, nw, sub, c], i) => {
        const d = div(root, { left: '1080px', top: 200 + i * 255 + 'px', width: '740px', height: '225px', borderRadius: '28px', background: '#fff', boxShadow: '0 18px 50px rgba(27,27,31,.1)', borderLeft: '12px solid ' + c, overflow: 'hidden' });
        const o = div(d, { left: '40px', top: '26px', fontSize: '28px', fontWeight: 700, color: '#999', whiteSpace: 'nowrap' }, old);
        const strike = div(d, { left: '36px', top: '46px', width: o.textContent.length * 28 + 8 + 'px', height: '4px', background: RED, transformOrigin: '0 50%' });
        div(d, { left: '40px', top: '74px', fontSize: '56px', fontWeight: 700, color: COL.ink, whiteSpace: 'nowrap' }, nw);
        div(d, { left: '40px', top: '156px', fontSize: '30px', color: c, fontWeight: 700, whiteSpace: 'nowrap' }, sub);
        return { d, strike, y: 200 + i * 255, h: 0, p: path(this.links, 'M0 0', rgba(c, .5), 4, '2 12') };
      });
      // 3: the delivered whole: one brain wired through five departments, on a business vocabulary of its own
      this.chain = div(root, { left: 0, top: 0, width: '1920px', height: '1080px', zIndex: 5, background: 'radial-gradient(ellipse at 50% 55%, #1c2150 0%, #0d0f26 60%, #06060f 100%)' });
      this.cbl = aurora(this.chain, 'radial-gradient(ellipse at 50% 55%, #1c2150 0%, #0d0f26 60%, #06060f 100%)', [COL.purple, COL.green, COL.blue, PINK, ORANGE], .2);
      this.chain.style.background = 'radial-gradient(ellipse at 50% 55%, #1c2150 0%, #0d0f26 60%, #06060f 100%)';
      this.cT = div(this.chain, { left: '120px', top: '60px', fontSize: '68px', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }, '交付：完整的企业大脑（智能中台）');
      this.cS = div(this.chain, { left: '120px', top: '160px', fontSize: '36px', color: '#c9c6e8', whiteSpace: 'nowrap' }, '贸易、物流、工厂加工、供应链、财务，全链路打通');
      this.cw = div(this.chain, { left: 0, top: 0, width: '1920px', height: '1080px', perspective: '1600px' });
      this.plane = div(this.cw, { left: 0, top: 0, width: '1920px', height: '1080px', transformStyle: 'preserve-3d', transformOrigin: '960px 600px' });
      this.cl = svg(this.plane);
      this.ring = path(this.cl, 'M0 0', 'rgba(255,255,255,.25)', 3, '4 10');
      this.sem = div(this.plane, { left: '760px', top: '400px', width: '400px', height: '400px', borderRadius: '50%', border: '3px dashed rgba(255,255,255,.35)' });
      this.semL = chip(this.plane, '业务语义', 'rgba(255,255,255,.14)', { left: '885px', top: '370px', fontSize: '26px', border: '1px solid rgba(255,255,255,.4)' });
      this.hub = botFace(this.plane, 190); this.hub.b.style.left = '865px'; this.hub.b.style.top = '505px'; this.hub.b.style.boxShadow = '0 0 80px rgba(169,126,254,.6)';
      this.hubL = div(this.plane, { left: '760px', top: '712px', width: '400px', textAlign: 'center', fontSize: '30px', fontWeight: 700, color: '#fff' }, '企业大脑');
      this.doms = DOMAINS.map(([t, c], i) => {
        const a = -Math.PI / 2 + i / 5 * Math.PI * 2, x = 960 + Math.cos(a) * 560, y = 600 + Math.sin(a) * 300;
        const n = div(this.plane, { left: x - 85 + 'px', top: y - 85 + 'px', width: '170px', height: '170px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, ' + rgba(c, 1) + ', ' + rgba(c, .7) + ')', boxShadow: '0 0 50px ' + rgba(c, .55), color: '#fff', fontSize: '34px', fontWeight: 700, textAlign: 'center', lineHeight: '170px', cursor: 'pointer' }, t);
        return { n, x, y, c, h: 0, spoke: path(this.cl, 'M960 600 L' + x + ' ' + y, rgba(c, .7), 4), dots: [0, 1].map(() => div(this.plane, { left: 0, top: 0, width: '14px', height: '14px', borderRadius: '50%', background: '#fff', boxShadow: '0 0 14px ' + c })) };
      });
      this.ring.setAttribute('d', this.doms.map((d, i) => (i ? 'L' : 'M') + d.x + ' ' + d.y).join(' ') + ' Z');
      // 4: the contract
      this.deal = div(this.chain, { left: '640px', top: '250px', width: '640px', height: '600px', background: '#fffdf7', borderRadius: '20px', boxShadow: '0 40px 100px rgba(0,0,0,.5)' });
      div(this.deal, { left: '50px', top: '40px', font: '700 28px DeckMono,monospace', color: '#77777f', letterSpacing: '.2em' }, 'CONTRACT · 合同');
      div(this.deal, { left: '50px', top: '100px', fontSize: '40px', fontWeight: 700, color: COL.ink }, '企业大脑 · 全链路交付');
      ['贸易 · 物流 · 工厂加工', '供应链 · 财务 · 业务语义'].forEach((t, i) => div(this.deal, { left: '50px', top: 170 + i * 46 + 'px', fontSize: '30px', color: '#55555c' }, t));
      this.dealN = div(this.deal, { left: '50px', top: '270px', font: '700 150px DeckMono,monospace', color: COL.purple, lineHeight: 1 }, '50 万');
      const sg = document.createElementNS(NS, 'svg'); sg.setAttribute('viewBox', '0 0 400 120'); Object.assign(sg.style, { position: 'absolute', left: '50px', top: '450px', width: '400px', height: '120px', overflow: 'visible' }); this.deal.appendChild(sg);
      this.sign = path(sg, 'M10 80 C40 20 70 20 70 70 C70 100 100 40 130 50 C160 60 150 95 190 70 C220 50 240 40 260 70 C280 95 320 60 380 55', COL.ink, 5);
      this.signLen = 600; this.sign.style.strokeDasharray = this.signLen;
      div(this.deal, { left: '50px', top: '560px', width: '380px', borderTop: '2px solid #c9c3ba' });
      this.stamp = div(this.deal, { left: '420px', top: '410px', width: '200px', height: '200px', borderRadius: '50%', border: '10px solid ' + PINK, color: PINK, fontSize: '64px', fontWeight: 700, textAlign: 'center', lineHeight: '180px' }, '签单');
      this.under = [...root.children].filter(c => c !== this.chain); // the cream layer the dark chain covers
      this.dealT = div(this.chain, { left: '0', top: '900px', width: '1920px', textAlign: 'center', fontSize: '44px', fontWeight: 700, color: '#fff' }, '老板的难题，真的解决了');
    },
    render(st) {
      drift(this.bl, st);
      const s1 = at(st, 1), s2 = at(st, 2), s3 = at(st, 3), s4 = at(st, 4);
      const [bx, by] = this.BC;
      const loop = (st.clock / BEAT / 4) % 1;
      this.docs.forEach((d, i) => { const u = (loop + i / 4) % 1, x = 120 + (bx - 75 - 120) * u, y = 300 + i * 90 + (by - 95 - 300 - i * 90) * u - Math.sin(u * Math.PI) * 120; const g = st.step === 1 ? outExpo((s1 - i * .3) / .8) : 0; d.style.opacity = g * (u < .85 ? 1 : (1 - u) / .15); d.style.transform = tr(x, y) + ' rotate(' + (1 - u) * (i - 1.5) * 10 + 'deg) scale(' + (1 - u * .6) + ')'; });
      const pulse = Math.exp(-((st.clock / BEAT) % 1) * 4);
      this.core.b.style.transform = 'scale(' + outExpo(st.enter / 1) * (1 + .04 * pulse) + ')'; this.core.b.style.boxShadow = '0 0 0 ' + 30 * pulse + 'px rgba(169,126,254,' + .3 * pulse + ')';
      look(this.core, st);
      const rot = st.clock * .12;
      this.nodes.forEach((n, i) => { const a = n.a + rot, x = bx + Math.cos(a) * 330, y = by + Math.sin(a) * 250, g = outExpo((s1 - 1.2 - i * .25) / .8); n.n.style.transform = tr(x - 48, y - 26) + ' scale(' + g + ')'; n.p.setAttribute('d', 'M' + bx + ' ' + by + ' L' + x + ' ' + y); n.p.style.opacity = g; n.p.style.strokeDashoffset = -st.clock * 30; });
      rise(this.head, outExpo(st.enter / .8), 30);
      rise(this.theory, st.step === 1 ? outExpo((st.enter - .5) / .8) : 0, 20);
      this.cap1.style.opacity = st.step === 1 ? outExpo((s1 - 2.6) / .8) : 0;
      this.cards.forEach((c, i) => {
        const g = outExpo((s2 - i * 1.1) / .9); c.h += ((near(st, 1080, c.y, 1820, c.y + 225) ? 1 : 0) - c.h) * st.ease(10);
        c.d.style.opacity = g; c.d.style.transform = 'translateX(' + ((1 - g) * 120 - 12 * c.h) + 'px)';
        c.strike.style.transform = 'scaleX(' + outExpo((s2 - i * 1.1 - .6) / .5) + ')';
        c.p.setAttribute('d', 'M' + (bx + 100) + ' ' + by + ' C' + (bx + 300) + ' ' + by + ' 900 ' + (c.y + 112) + ' 1080 ' + (c.y + 112)); c.p.style.opacity = g; c.p.style.strokeDashoffset = -st.clock * 40;
      });
      // the whole chain
      this.chain.style.display = s3 < 0 ? 'none' : '';
      const covered = s3 >= 0 && outExpo(s3 / 1.2) * 2300 > 1400; // the circle has passed the far corner
      this.under.forEach(u => { u.style.visibility = covered ? 'hidden' : ''; });
      if (s3 >= 0) {
        this.chain.style.clipPath = 'circle(' + outExpo(s3 / 1.2) * 2300 + 'px at ' + bx + 'px ' + by + 'px)';
        drift(this.cbl, st);
        const dealOn = s4 >= 0 ? inOut(s4 / 1) : 0;
        this.plane.style.transform = 'rotateX(' + (18 + st.my * 10 + Math.sin(st.clock * .5) * 3) + 'deg) rotateY(' + (st.mx * 14) + 'deg) scale(' + (1 - .12 * dealOn) + ')';
        this.plane.style.opacity = s4 >= 0 ? 1 - .7 * outExpo(s4 / .3) : 1;
        rise(this.cT, outExpo((s3 - .4) / .8), 30); rise(this.cS, outExpo((s3 - .8) / .8), 30);
        this.cT.style.opacity *= 1 - dealOn; this.cS.style.opacity *= 1 - dealOn;
        this.sem.style.transform = 'rotate(' + st.clock * 12 + 'deg) scale(' + outExpo((s3 - 1) / 1) + ')';
        this.semL.style.opacity = outExpo((s3 - 1.4) / .6);
        this.hub.b.style.transform = 'scale(' + Math.max(0, spring((s3 - .5) * BEAT, 1.8, .45)) * (1 + .04 * pulse) + ')'; look(this.hub, st); this.hubL.style.opacity = outExpo((s3 - 1) / .6);
        this.ring.style.strokeDashoffset = -st.clock * 40; this.ring.style.opacity = outExpo((s3 - 3) / 1);
        this.doms.forEach((d, i) => {
          const g = outExpo((s3 - 1.6 - i * .35) / .8), over = s4 < 0 && near(st, d.x - 100, d.y - 100, d.x + 100, d.y + 100) ? 1 : 0;
          d.h += (over - d.h) * st.ease(10);
          d.n.style.transform = 'translateY(' + Math.sin(st.clock * 1.6 + i) * 8 + 'px) scale(' + g * (1 + .14 * d.h) + ')';
          d.n.style.boxShadow = '0 0 ' + (50 + 50 * d.h) + 'px ' + rgba(d.c, .55 + .3 * d.h);
          d.spoke.style.opacity = g; d.spoke.style.strokeWidth = 4 + 4 * d.h;
          d.dots.forEach((dt, k) => { const u = ((st.clock * .45 + k * .5 + i * .13) % 1); dt.style.transform = tr(960 + (d.x - 960) * u - 7, 600 + (d.y - 600) * u - 7); dt.style.opacity = g * Math.sin(Math.PI * u); });
        });
        this.deal.style.display = s4 < 0 ? 'none' : '';
        if (s4 >= 0) {
          const g = outExpo(s4 / 1); this.deal.style.opacity = cl(s4 / .4);
          this.deal.style.transform = 'perspective(1400px) translateY(' + (1 - g) * 500 + 'px) rotateX(' + (1 - g) * 30 + 'deg) rotateY(' + st.mx * 8 + 'deg) rotate(' + (-3 + Math.sin(st.clock) * .6) + 'deg)';
          this.dealN.textContent = Math.round(50 * outExpo(cl((s4 - .6) / 1.4))) + ' 万';
          this.sign.style.strokeDashoffset = this.signLen * (1 - outExpo((s4 - 1.6) / 1.4));
          const sp = spring((s4 - 3) * BEAT, 2.2, .35);
          this.stamp.style.opacity = s4 < 3 ? 0 : 1; this.stamp.style.transform = 'scale(' + (s4 < 3 ? 0 : 2.2 - 1.2 * sp) + ') rotate(-14deg)';
          rise(this.dealT, outExpo((s4 - 3.4) / .8), 30);
        } else this.dealT.style.opacity = 0;
      }
    },
  };


  // ---- masters: before the three people, three companies = the theory; click 2 shows what their big customers pay
  const MASTER_CARDS = [
    { name: 'Anthropic', sys: '工程实践', c: ORANGE, l: '先找最简单的办法，需要时才加复杂\n最成功的团队，用简单、可组合的小模式',
      nodes: [['拆步', 50, 110], ['分流', 170, 110], ['并行', 290, 110], ['互检', 410, 110]], edges: [[0, 1], [1, 2], [2, 3]],
      pre: '约 250 家客户，每家一年付它超过', n: 1000, unit: ' 万美元', src: '出处：Anthropic 上市文件 S-1/A，2026-11-17' },
    { name: 'Palantir', sys: 'Ontology 本体', c: COL.blue, l: '数据连到真实世界：工厂、货品、订单\n对象 + 关系 + 动作 = 公司的数字孪生',
      nodes: [['本体', 240, 112], ['工厂', 60, 40], ['货品', 420, 40], ['订单', 60, 185], ['交易', 420, 185]], edges: [[0, 1], [0, 2], [0, 3], [0, 4], [1, 2], [3, 4]],
      pre: '前 20 大客户，平均每家一年付它', n: 9390, unit: ' 万美元', src: '出处：Palantir 2025 年报（10-K）' },
    { name: 'o9 Solutions', sys: '经营决策分析', c: COL.green, l: '需求、供应、收入、财务连成一张图\n感知、计划、决策，一条龙',
      nodes: [['决策', 240, 112], ['需求', 70, 45], ['供应', 410, 45], ['收入', 70, 180], ['财务', 410, 180]], edges: [[1, 2], [2, 4], [4, 3], [3, 1], [0, 1], [0, 2], [0, 3], [0, 4]],
      pre: '不公开；第三方估算年费（美元）', txt: '50–200 万+', src: '出处：Supply Chain Desk 评测，2026-10-20' },
  ];
  const masters = {
    id: 'masters', steps: 2, dark: true,
    // sfx on entrances: [beat since the step began, sound, arg, count length in beats]; mirrors the timings in render
    cues: { 1: [[0.6, 'card', 0], [1.1, 'card', 3], [1.6, 'card', 7], [2.8, 'shimmer', 0]], 2: [[0.2, 'card', 0], [0.4, 'count', 'coin', 1.6], [0.8, 'card', 3], [1, 'count', 'coin', 1.6], [1.4, 'card', 7], [2.4, 'shimmer', 0]] },
    build(root) {
      div(root, { inset: 0, background: 'radial-gradient(120% 90% at 50% 0%, #2a2350 0%, #141230 55%, #0b0a1c 100%)' });
      this.bl = aurora(root, 'transparent', [ORANGE, COL.blue, COL.green, COL.purple], .22);
      this.head = heading(root, '先学大公司：理论体系', '#fff');
      this.sub = div(root, { left: '124px', top: '180px', fontSize: '32px', color: 'rgba(255,255,255,.72)', whiteSpace: 'nowrap' }, 'Grok Bot 帮我读它们公开的方法');
      this.bot = botFace(root, 110); this.bot.b.style.left = '1660px'; this.bot.b.style.top = '70px';
      this.cards = MASTER_CARDS.map((m, i) => {
        const x = 120 + i * 580;
        const d = div(root, { left: x + 'px', top: '240px', width: '540px', height: '540px', borderRadius: '30px', background: 'linear-gradient(160deg,' + rgba(m.c, .22) + ', rgba(255,255,255,.05))', border: '2px solid ' + rgba(m.c, .55), color: '#fff', overflow: 'hidden' });
        div(d, { left: '40px', top: '30px', fontSize: '56px', fontWeight: 700, whiteSpace: 'nowrap' }, m.name);
        chip(d, m.sys, m.c, { left: '40px', top: '112px', fontSize: '28px' });
        const g = document.createElementNS(NS, 'svg'); g.setAttribute('viewBox', '0 0 480 225'); Object.assign(g.style, { position: 'absolute', left: '30px', top: '180px', width: '480px', height: '225px', overflow: 'visible' }); d.appendChild(g);
        m.edges.forEach(([a, b]) => path(g, 'M' + m.nodes[a][1] + ' ' + m.nodes[a][2] + ' L' + m.nodes[b][1] + ' ' + m.nodes[b][2], rgba(m.c, .7), 3, '6 7'));
        const nodes = m.nodes.map(([t, nx, ny], k) => { const n = chip(d, t, k === 0 && m.nodes.length > 4 ? '#fff' : rgba(m.c, .9), { left: 30 + nx + 'px', top: 180 + ny + 'px', fontSize: '24px', color: k === 0 && m.nodes.length > 4 ? COL.ink : '#fff' }); return n; });
        const dots = m.edges.map(() => div(d, { left: 0, top: 0, width: '12px', height: '12px', borderRadius: '50%', background: '#fff', boxShadow: '0 0 12px ' + m.c }));
        div(d, { left: '40px', top: '420px', width: '470px', fontSize: '26px', lineHeight: 1.5, color: 'rgba(255,255,255,.88)', whiteSpace: 'pre-line' }, m.l);
        const p = div(root, { left: x + 'px', top: '810px', width: '540px', height: '210px', borderRadius: '26px', background: '#fff', color: COL.ink, overflow: 'hidden', boxShadow: '0 20px 50px ' + rgba(m.c, .35) });
        div(p, { left: 0, top: 0, width: '10px', height: '210px', background: m.c });
        div(p, { left: '36px', top: '22px', fontSize: '26px', color: '#55555c', whiteSpace: 'nowrap' }, m.pre);
        const num = div(p, { left: '36px', top: '62px', font: '700 72px DeckMono,DeckSans,monospace', color: m.c, whiteSpace: 'nowrap' }, m.txt || '0' + m.unit);
        div(p, { left: '36px', top: '160px', fontSize: '20px', color: '#8a8a92', whiteSpace: 'nowrap' }, m.src);
        const shine = div(p, { left: 0, top: 0, width: '160px', height: '210px', background: 'linear-gradient(100deg, transparent, rgba(255,255,255,.7), transparent)' });
        return { m, d, nodes, dots, p, num, shine, h: 0, x };
      });
    },
    render(st) {
      drift(this.bl, st);
      const s1 = at(st, 1), s2 = at(st, 2);
      rise(this.head, outExpo(s1 / .8), 40); rise(this.sub, outExpo((s1 - .4) / .8), 30);
      const bs = spring((s1 - .8) * BEAT, 2, .4); this.bot.b.style.transform = 'scale(' + Math.max(0, bs) + ') translateY(' + Math.sin(st.clock * 2.2) * 5 + 'px)'; look(this.bot, st);
      this.cards.forEach((c, i) => {
        const g = outExpo((s1 - .6 - i * .5) / 1), over = near(st, c.x, 240, c.x + 540, 1020) ? 1 : 0;
        c.h += (over - c.h) * st.ease(10);
        c.d.style.opacity = g;
        c.d.style.transform = 'translateY(' + ((1 - g) * 120 - 14 * c.h + Math.sin(st.clock * 1.1 + i * 2) * 4) + 'px) perspective(1200px) rotateY(' + (st.mx * (4 + 6 * c.h)) + 'deg) rotateX(' + (-st.my * (3 + 4 * c.h)) + 'deg)';
        c.d.style.boxShadow = '0 0 ' + (30 + 40 * c.h) + 'px ' + rgba(c.m.c, .25 + .35 * c.h);
        c.nodes.forEach((n, k) => { const sp = spring((s1 - 1.2 - i * .5 - k * .15) * BEAT, 2, .45); n.style.transform = 'translate(-50%,-50%) scale(' + Math.max(0, sp) * (1 + .08 * c.h) + ') translateY(' + Math.sin(st.clock * 1.8 + k + i) * 3 + 'px)'; });
        c.dots.forEach((dt, k) => { const [a, b] = c.m.edges[k], A = c.m.nodes[a], B = c.m.nodes[b], u = (st.clock * .35 + k * .37) % 1; dt.style.transform = tr(30 + A[1] + (B[1] - A[1]) * u - 6, 180 + A[2] + (B[2] - A[2]) * u - 6); dt.style.opacity = s1 > 2 + i * .5 ? Math.sin(Math.PI * u) : 0; });
        const g2 = outExpo((s2 - .2 - i * .6) / .8);
        c.p.style.opacity = g2; c.p.style.transform = 'translateY(' + ((1 - g2) * 80 - 8 * c.h) + 'px) scale(' + (.92 + .08 * g2) + ')';
        if (!c.m.txt) c.num.textContent = Math.round(c.m.n * outExpo(cl((s2 - .4 - i * .6) / 1.6))).toLocaleString('en-US') + c.m.unit;
        const sw = ((st.clock * .25 + i * .3) % 1); c.shine.style.transform = tr(-200 + sw * 900, 0); c.shine.style.opacity = s2 > 0 ? .8 : 0;
      });
    },
  };
  // ---- copy: one page, three kinds of money, and the third one copies itself to the next company
  const copy = {
    id: 'copy', steps: 1,
    // sfx on entrances: [beat since the step began, sound, arg, count length in beats]; mirrors the timings in render
    cues: { 1: [[0.3, 'card', 0], [1.5, 'card', 3], [1.7, 'pop', 7], [1.8, 'count', 'coin', 1.6], [2.7, 'card', 7], [2.7, 'pop', 0], [3.5, 'pop', 4], [4.3, 'pop', 7]] },
    build(root) {
      this.bl = aurora(root, COL.cream, [COL.purple, COL.green, COL.blue], .2);
      this.head = heading(root, '同一套 Grok Bot，三笔钱');
      const C = [['1', '省下的', '81 个程序员，一个都没招', COL.purple], ['2', '赚到的', '咨询 + 实施，一单 50 万', COL.green], ['3', '卖产品', '同一个行业，复制给下一家', COL.blue]];
      this.cards = C.map(([n, a, b, c], i) => {
        const d = div(root, { left: 120 + i * 580 + 'px', top: '210px', width: '540px', height: '800px', borderRadius: '32px', background: c, color: '#fff', overflow: 'hidden', boxShadow: '0 24px 60px ' + rgba(c, .35) });
        div(d, { left: '44px', top: '36px', font: '700 90px DeckMono,monospace', opacity: .9 }, n);
        div(d, { left: '44px', top: '560px', fontSize: '60px', fontWeight: 700 }, a);
        div(d, { left: '44px', top: '650px', width: '460px', fontSize: '38px', fontWeight: 700, lineHeight: 1.35 }, b);
        const stage = div(d, { left: '30px', top: '150px', width: '480px', height: '390px', borderRadius: '24px', background: 'rgba(255,255,255,.16)', overflow: 'hidden' });
        return { d, stage, h: 0 };
      });
      // 1: 81 desks you never had to fill: grey people, one of them is me, plus the bots
      this.ppl = Array.from({ length: 81 }, (_, i) => { const p = person(this.cards[0].stage, 'rgba(255,255,255,.9)', 30); Object.assign(p.style, { left: 26 + (i % 9) * 50 + 'px', top: 20 + Math.floor(i / 9) * 40 + 'px' }); return p; });
      this.me = div(this.cards[0].stage, { left: '150px', top: '100px', width: '180px', height: '180px', borderRadius: '50%', overflow: 'hidden', border: '6px solid #fff', boxShadow: '0 10px 30px rgba(0,0,0,.25)' });
      div(this.me, { inset: 0, background: COL.purple, color: '#fff', textAlign: 'center', font: '700 96px/168px DeckSans,sans-serif' }, '我'); // photo slot: put your own picture here
      this.meL = div(this.cards[0].stage, { left: '0', top: '300px', width: '480px', textAlign: 'center', fontSize: '30px', fontWeight: 700 }, '我 + 一群 Grok Bot');
      // 2: the contract
      const st2 = this.cards[1].stage;
      this.paper = div(st2, { left: '110px', top: '40px', width: '260px', height: '320px', borderRadius: '14px', background: '#fff', boxShadow: '0 16px 40px rgba(0,0,0,.2)' });
      [0, 1, 2, 3].forEach(r => div(this.paper, { left: '28px', top: 40 + r * 30 + 'px', width: 200 - r * 30 + 'px', height: '10px', borderRadius: '5px', background: '#e6e1d8' }));
      this.pN = div(this.paper, { left: '28px', top: '170px', font: '700 64px DeckMono,monospace', color: COL.green }, '50 万');
      this.coins = Array.from({ length: 6 }, (_, i) => div(st2, { left: 60 + i * 64 + 'px', top: '0', width: '44px', height: '44px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #fff3b0, ' + GOLD + ')', boxShadow: '0 4px 10px rgba(0,0,0,.2)' }));
      // 3: a row of fruit companies; the brain copies itself from one to the next
      const st3 = this.cards[2].stage;
      this.shops = ['第一家', '下一家', '再下一家'].map((t, i) => { const s = div(st3, { left: 30 + i * 150 + 'px', top: '150px', width: '130px', height: '150px' }); div(s, { left: '10px', top: '40px', width: '110px', height: '110px', borderRadius: '10px', background: '#fff' }); div(s, { left: '0', top: '20px', width: '130px', height: '34px', borderRadius: '10px', background: 'rgba(255,255,255,.75)' }); div(s, { left: '0', top: '160px', width: '130px', textAlign: 'center', fontSize: '24px', fontWeight: 700 }, t); const f = botFace(s, 64); f.b.style.left = '33px'; f.b.style.top = '64px'; return { s, f }; });
      this.beam = div(st3, { left: 0, top: '0', width: '26px', height: '26px', borderRadius: '50%', background: '#fff', boxShadow: '0 0 20px #fff' });
    },
    render(st) {
      drift(this.bl, st);
      const s = at(st, 1);
      rise(this.head, outExpo(s / .8), 30);
      this.cards.forEach((c, i) => { const g = outExpo((s - .3 - i * 1.2) / 1), over = near(st, 120 + i * 580, 210, 660 + i * 580, 1010) ? 1 : 0; c.h += (over - c.h) * st.ease(10); c.d.style.opacity = g; c.d.style.transform = 'translateY(' + ((1 - g) * 120 - 14 * c.h) + 'px) rotate(' + ((1 - g) * (i - 1) * 4) + 'deg) perspective(1200px) rotateY(' + (c.h * st.mx * 6) + 'deg)'; });
      // 1: the 81 fade back, I step forward
      const s1 = s - .3;
      this.ppl.forEach((p, i) => { p.style.opacity = .9 - .7 * outExpo((s1 - 1 - (i % 9) * .03) / .8); });
      const mg = spring((s1 - 1.4) * BEAT, 2, .45); this.me.style.transform = 'scale(' + Math.max(0, mg) + ') translateY(' + Math.sin(st.clock * 2) * 4 + 'px)'; this.meL.style.opacity = outExpo((s1 - 1.8) / .6);
      // 2: coins rain into the contract, the number counts up
      const s2 = s - 1.5;
      this.pN.textContent = Math.round(50 * outExpo(cl((s2 - .3) / 1.6))) + ' 万';
      this.coins.forEach((c, i) => { const u = ((st.clock * .5 + i / 6) % 1); c.style.transform = tr(0, -60 + u * 380) + ' rotateY(' + u * 720 + 'deg)'; c.style.opacity = s2 > 0 ? Math.sin(Math.PI * u) : 0; });
      this.paper.style.transform = 'rotate(' + Math.sin(st.clock * 1.2) * 3 + 'deg)';
      // 3: the brain hops from shop to shop and lights each one up
      const s3 = s - 2.7, u = ((st.clock / BEAT) / 6) % 1, seg = Math.floor(u * 3), su = (u * 3) % 1;
      this.shops.forEach((sh, i) => { const lit = s3 > 0 && (i <= seg || s3 > 6) ? 1 : 0; sh.f.b.style.transform = 'scale(' + (s3 > i * .8 ? spring((s3 - i * .8) * BEAT, 2, .4) : 0) + ')'; look(sh.f, st); sh.s.style.opacity = .55 + .45 * lit; });
      const x0 = 30 + seg * 150 + 52, x1 = 30 + Math.min(2, seg + 1) * 150 + 52;
      this.beam.style.transform = tr(x0 + (x1 - x0) * su, 120 - Math.sin(Math.PI * su) * 80); this.beam.style.opacity = s3 > 0 && seg < 2 ? 1 : 0;
    },
  };

  // ---- end: back to the ledger, the third line gets its missing half; then the invitation
  const end = {
    id: 'end', steps: 3, dark: false,
    // sfx on entrances: [beat since the step began, sound, arg, count length in beats]; mirrors the timings in render
    cues: { 2: [[0, 'pop', 0], [0.6, 'bubble', 0], [0.85, 'bubble', 2], [1.1, 'bubble', 4], [1.35, 'bubble', 6], [1.6, 'bubble', 8]], 3: [[0, 'whoosh', 0], [0.4, 'shimmer', 0], [1.6, 'pop', 7]] },
    build(root) {
      this.bl = aurora(root, '#F5F0FF', [COL.purple, COL.green, COL.blue, ORANGE, PINK, TEAL], .42);
      this.fr = friends(root, LEDGER_FRIENDS);
      this.L = ledgerCard(root);
      this.bots = ['pink', 'blue', 'green', 'teal', 'purple'].map((id, i) => { const m = mascot(id, 70, this.L.card); Object.assign(m.style, { left: 520 + i * 86 + 'px', top: '600px' }); return m; });
      this.fin = div(root, { left: '0', top: '0', width: '1920px', height: '1080px' });
      this.fbl = aurora(this.fin, COL.cream, [COL.purple, COL.green, COL.blue, PINK, ORANGE], .3);
      this.fT = div(this.fin, { left: '120px', top: '110px', fontSize: '112px', fontWeight: 700, color: COL.purple, whiteSpace: 'nowrap' }, '一起用 Grok Bot 赚钱');
      this.fS = div(this.fin, { left: '124px', top: '260px', fontSize: '52px', fontWeight: 700, color: COL.ink, whiteSpace: 'nowrap' }, '欢迎交流');
      this.photo = div(this.fin, { left: '120px', top: '400px', width: '400px', height: '432px', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 30px 70px rgba(40,20,90,.25)' });
      div(this.photo, { inset: 0, background: 'linear-gradient(160deg,' + COL.purple + ',' + COL.blue + ')', color: '#fff', textAlign: 'center', font: '700 200px/432px DeckSans,sans-serif' }, '我'); // photo slot
      div(this.fin, { left: '580px', top: '560px', fontSize: '60px', fontWeight: 700, color: COL.ink, whiteSpace: 'nowrap' }, 'Zeno 王泽宇');
      div(this.fin, { left: '584px', top: '650px', fontSize: '32px', color: '#55555c', whiteSpace: 'nowrap' }, '熵算智能 Founder · 企业 AI 转型咨询专家');
      this.oss = chip(this.fin, 'ZenoForge 已开源', COL.ink, { left: '584px', top: '730px', fontSize: '32px', padding: '12px 28px' });
      this.qr = div(this.fin, { left: '1330px', top: '330px', width: '470px', height: '560px', borderRadius: '32px', background: '#fff', boxShadow: '0 30px 70px rgba(40,20,90,.2)' });
      div(this.qr, { left: '35px', top: '35px', width: '400px', height: '400px', borderRadius: '20px', border: '4px dashed #c9c3ba', color: '#8a8a92', textAlign: 'center', font: '700 40px/392px DeckSans,sans-serif' }, '你的二维码'); // QR slot
      div(this.qr, { left: 0, top: '462px', width: '470px', textAlign: 'center', fontSize: '40px', fontWeight: 700, color: COL.ink }, '扫码加我微信');
      this.ffr = friends(this.fin, [['pink', 90, 1560, 930], ['teal', 80, 1220, 900], ['green', 100, 820, 860], ['blue', 100, 1700, 60]]);
    },
    render(st) {
      const s2 = at(st, 2), s3 = at(st, 3);
      if (s3 < 1.3) {
        drift(this.bl, st); floatFriends(this.fr, st); drawCard(this.L, st);
        this.L.rows.forEach(r => { r.rb.style.opacity = r.ra.style.opacity = 1; r.rb.style.transform = 'none'; });
        rise(this.L.extra, outExpo(s2 / .8), 30);
        this.bots.forEach((m, i) => { const g = spring((s2 - .6 - i * .25) * BEAT, 2, .35); m.style.transform = 'scale(' + Math.max(0, g) + ') translateY(' + (Math.sin(st.clock * 3 + i) * 5 - Math.max(0, Math.sin(st.clock * 4 + i * 1.3)) * 10) + 'px)'; });
      }
      this.fin.style.display = s3 < 0 ? 'none' : '';
      if (s3 >= 0) {
        this.fin.style.clipPath = 'circle(' + outExpo(s3 / 1.2) * 2300 + 'px at 960px 540px)';
        drift(this.fbl, st); floatFriends(this.ffr, st);
        rise(this.fT, outExpo((s3 - .4) / .9), 50); rise(this.fS, outExpo((s3 - .9) / .9), 40);
        this.photo.style.transform = 'perspective(1200px) rotateY(' + st.mx * 10 + 'deg) rotateX(' + -st.my * 8 + 'deg) translateY(' + Math.sin(st.clock * 1.2) * 6 + 'px)';
        const qh = near(st, 1330, 330, 1800, 890) ? 1.04 : 1;
        this.qr.style.transform = 'perspective(1200px) rotateY(' + st.mx * -8 + 'deg) rotateX(' + -st.my * 6 + 'deg) scale(' + qh + ') translateY(' + Math.sin(st.clock * 1.2 + 1) * 6 + 'px)';
        this.oss.style.opacity = outExpo((s3 - 1.6) / .6);
      }
    },
    poke(st, x, y) { return at(st, 3) >= 0 ? pokeFriends(this.ffr, st, x, y) : pokeFriends(this.fr, st, x, y); },
  };
  Object.assign(k.out, { div, tr, rise, at, rgba, near, person, botFace, look, heading, chip, svg, path, aurora, drift, friends, floatFriends, pokeFriends, PAL, PINK, ORANGE, TEAL, GOLD, RED, NS });
  return [ledger, problem, masters, night, brain, copy, end];
}

makeScenes({ el, img: null, mascot, COL, cl: kit.cl, outExpo: kit.outExpo, inCubic: kit.inCubic, inOut: kit.inOut, spring: kit.spring, hop: kit.hop, BEAT, out })
  .forEach(s => Deck.scene(Object.assign(s, { act: { ledger: 'bed', problem: 'pain', masters: 'learn', brain: 'learn', night: 'engine', copy: 'bed', end: 'bed' }[s.id] })));
})();
