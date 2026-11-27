// The close: one line, the characters come back, and one more click returns to the cover.
Deck.scene({
  id: 'end', steps: 1, act: 'calm', dark: true,
  notes: { 1: 'Close on one line and stop talking. One more click goes back to the cover.' },
  cues: { 1: [[.3, 'pop', 0], [.9, 'shimmer', 0]] },
  build(root, k) {
    const C = Parts.PAL;
    this.bl = k.aurora(root, C.ink, [C.tomato, C.sun, C.cobalt], .3);
    const mask = k.div(root, { left: '120px', top: '360px', width: '1500px', height: '230px', overflow: 'hidden' });
    this.line = k.div(mask, { left: 0, top: 0, font: '800 200px/1.1 var(--display)', color: '#fff', whiteSpace: 'nowrap' }, 'Your turn.');
    this.sub = k.div(root, { left: '126px', top: '640px', font: '500 40px var(--sans)', color: 'rgba(255,255,255,.7)', whiteSpace: 'nowrap' }, 'One more click and we start over');
    this.cs = [
      { kind: 'circle', size: 170, color: C.tomato, x: 1450, y: 720, depth: 30 },
      { kind: 'square', size: 120, color: C.cobalt, x: 1680, y: 600, depth: 20 },
      { kind: 'pill', size: 110, color: C.mint, x: 1260, y: 860, depth: 26 },
    ].map(o => Parts.critter(root, o));
  },
  render(st, k) {
    k.drift(this.bl, st);
    const e = st.enter;
    this.line.style.transform = 'translateY(' + (1 - k.outExpo((e - .2) / 1.1)) * 110 + '%)';
    k.rise(this.sub, k.outExpo((e - 1) / 1), 30);
    this.cs.forEach((c, i) => Parts.draw(c, st, i, k.spring((e - .4 - i * .25) * st.beat, 1.8, .45)));
  },
  poke(st, x, y) { return Parts.poke(this.cs, st, x, y); },
});
