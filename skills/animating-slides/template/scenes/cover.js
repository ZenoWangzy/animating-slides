// Cover: complete the moment it opens (no black screen). Title lines rise out of masks, characters float.
Deck.scene({
  id: 'cover', steps: 1, act: 'calm',
  notes: { 1: 'The cover is up before you speak. The first key only starts the music; the next one turns the page.' },
  cues: { 1: [[.2, 'pop', 0], [.5, 'pop', 4], [.9, 'card', 7]] },
  build(root, k) {
    const C = Parts.PAL;
    this.bl = k.aurora(root, C.paper, [C.tomato, C.cobalt, C.mint, C.sun], .32);
    this.lines = ['Slides', 'that move.'].map((t, i) => {
      const mask = k.div(root, { left: '120px', top: 250 + i * 200 + 'px', width: '1500px', height: '210px', overflow: 'hidden' });
      return k.div(mask, { left: 0, top: 0, font: '800 170px/1.1 var(--display)', color: i ? C.tomato : C.ink, whiteSpace: 'nowrap' }, t);
    });
    this.sub = k.div(root, { left: '126px', top: '700px', font: '500 42px var(--sans)', color: C.ink2, whiteSpace: 'nowrap' }, 'A talk deck where every beat is timed');
    this.hint = k.div(root, { left: '126px', top: '950px', font: '600 26px var(--mono)', color: C.ink2, letterSpacing: '.14em', whiteSpace: 'nowrap' }, 'PRESS → OR CLICK');
    this.cs = [
      { kind: 'circle', size: 280, color: C.tomato, x: 1340, y: 400, depth: 34 },
      { kind: 'square', size: 190, color: C.cobalt, x: 1560, y: 170, depth: 22 },
      { kind: 'pill', size: 150, color: C.mint, x: 1500, y: 770, depth: 28 },
      { kind: 'circle', size: 110, color: C.sun, x: 1300, y: 150, depth: 18 },
    ].map(o => Parts.critter(root, o));
  },
  render(st, k) {
    k.drift(this.bl, st);
    const e = st.enter;
    this.lines.forEach((l, i) => { l.style.transform = 'translateY(' + (1 - k.outExpo((e - .1 - i * .3) / 1.1)) * 110 + '%)'; });
    k.rise(this.sub, k.outExpo((e - .9) / 1), 40);
    this.hint.style.opacity = e < 2.4 ? 0 : .45 + .3 * Math.sin(st.clock * 2.4);
    this.cs.forEach((c, i) => Parts.draw(c, st, i, k.spring((e - .2 - i * .3) * st.beat, 1.8, .45)));
  },
  poke(st, x, y) { return Parts.poke(this.cs, st, x, y); },
});
