// Parts shared by this deck's scenes: the palette and a small character that floats, looks at the pointer,
// lifts on hover and hops when poked. Replace both with your own deck's look.
window.Parts = (function () {
  const k = Deck.kit;
  const PAL = { paper: '#F3EEE4', ink: '#141417', ink2: '#5d5a55', tomato: '#FF5A36', cobalt: '#2F5BEA', mint: '#16C79A', sun: '#FFC53D' };
  // kind: 'circle' | 'square' | 'pill'; x, y: top-left on the stage; depth: how far it leans from the pointer
  function critter(parent, { kind = 'circle', size = 160, color = PAL.tomato, x = 0, y = 0, depth = 20 }) {
    const w = kind === 'pill' ? size * 1.8 : size;
    const d = k.div(parent, { left: x + 'px', top: y + 'px', width: w + 'px', height: size + 'px', background: color, borderRadius: kind === 'square' ? size * .28 + 'px' : size / 2 + 'px', transformOrigin: '50% 100%', boxShadow: '0 24px 50px rgba(20,20,23,.18)' });
    const eyes = k.div(d, { left: w / 2 - size * .2 + 'px', top: size * .28 + 'px', width: size * .4 + 'px', height: size * .3 + 'px' });
    [0, 1].forEach(i => k.div(eyes, { left: i * size * .27 + 'px', top: 0, width: size * .13 + 'px', height: size * .26 + 'px', borderRadius: size + 'px', background: '#fff' }));
    return { d, eyes, x, y, w, h: size, depth, hv: 0, pokeAt: -99 };
  }
  function animate(c, st, i) {
    c.hv += ((k.near(st, c.x, c.y, c.x + c.w, c.y + c.h) ? 1 : 0) - c.hv) * st.ease(10);
    const pk = k.hop(st.T - c.pokeAt), w = st.clock * (1 + i * .13) + i * 1.7;
    return { x: -st.mx * c.depth, y: Math.sin(w) * 10 - st.my * c.depth * .6 - 16 * c.hv + pk.y, r: Math.sin(w * .5) * 4, s: 1 + .05 * c.hv, sq: pk.sq,
      look: () => { c.eyes.style.transform = k.tr(st.mx * c.h * .04, st.my * c.h * .03) + ' scaleY(' + ((st.clock + i * .7) % 3.7 < .12 ? .15 : 1) + ')'; } };
  }
  // place a critter: on 0..1 is its entrance, extra transform appended
  function draw(c, st, i, on = 1, extra = '') {
    const a = animate(c, st, i);
    c.d.style.transform = k.tr(a.x, a.y) + ' rotate(' + a.r + 'deg) scale(' + on * a.s * (1 + a.sq) + ',' + on * a.s * (1 - a.sq) + ')' + extra;
    a.look();
  }
  const poke = (cs, st, x, y) => { const c = cs.find(c => x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h); if (c) { c.pokeAt = st.T; return true; } return false; };
  const heading = (root, text, color, css) => k.div(root, Object.assign({ left: '120px', top: '80px', font: '800 84px/1.1 var(--display)', color, whiteSpace: 'nowrap' }, css || {}), text);
  return { PAL, critter, draw, poke, heading };
})();
