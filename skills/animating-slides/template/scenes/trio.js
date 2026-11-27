// One metaphor for the whole scene: three ingredients rise one beat apart, then flow into one talk.
(function () {
  const ITEMS = [
    ['Story', 'a point and a source for every beat'],
    ['Scene', 'one picture per idea, clear with the sound off'],
    ['Sound', 'a track per act, a click per entrance'],
  ];
  Deck.scene({
    id: 'trio', steps: 2, act: 'calm',
    notes: {
      1: 'Three things make a talk deck. Hover a card to talk about it.',
      2: 'They only work together: everything flows into the one talk.',
    },
    cues: { 1: [[0, 'pop', 0], [1, 'pop', 4], [2, 'pop', 7]], 2: [[.3, 'shimmer', 0], [1.6, 'stamp']] },
    build(root, k) {
      const C = Parts.PAL, col = [C.tomato, C.cobalt, C.mint];
      this.bl = k.aurora(root, C.paper, [C.sun, C.mint, C.cobalt], .26);
      this.head = Parts.heading(root, 'What a talk deck is made of', C.ink);
      this.cards = ITEMS.map(([t, s], i) => {
        const c = k.div(root, { left: 120 + i * 580 + 'px', top: '240px', width: '520px', height: '420px', borderRadius: '36px', background: '#fff', boxShadow: '0 30px 70px rgba(20,20,23,.12)', overflow: 'hidden' });
        k.div(c, { left: 0, top: 0, width: '520px', height: '14px', background: col[i] });
        const icon = k.div(c, { left: '48px', top: '64px', width: '140px', height: '110px' });
        if (i === 0) [0, 1, 2, 3].forEach(n => k.div(icon, { left: 0, top: n * 28 + 'px', width: [140, 110, 130, 70][n] + 'px', height: '12px', borderRadius: '6px', background: col[i] }));
        if (i === 1) { k.div(icon, { left: 0, top: 0, width: '140px', height: '100px', borderRadius: '14px', border: '10px solid ' + col[i] }); k.div(icon, { left: '50px', top: '30px', width: '40px', height: '40px', borderRadius: '50%', background: col[i] }); }
        const wave = i === 2 ? [0, 1, 2, 3, 4, 5].map(n => k.div(icon, { left: n * 24 + 'px', top: '10px', width: '14px', height: '90px', borderRadius: '7px', background: col[i], transformOrigin: '50% 50%' })) : [];
        k.div(c, { left: '48px', top: '200px', font: '800 72px var(--display)', color: C.ink, whiteSpace: 'nowrap' }, t);
        k.div(c, { left: '48px', top: '300px', width: '430px', font: '500 32px/1.35 var(--sans)', color: C.ink2 }, s);
        return { c, wave, h: 0 };
      });
      const s = k.svg(root);
      this.flows = [[380, 660, 'M380 660 C380 790 860 760 930 840'], [960, 660, 'M960 660 L960 830'], [1540, 660, 'M1540 660 C1540 790 1060 760 990 840']].map(([, , d], i) => {
        const p = k.path(s, d, col[i], 8); const len = p.getTotalLength(); p.style.strokeDasharray = len;
        return { p, len };
      });
      this.disc = k.div(root, { left: '860px', top: '820px', width: '200px', height: '200px', borderRadius: '50%', background: C.ink, color: '#fff', font: '800 38px/200px var(--display)', textAlign: 'center', whiteSpace: 'nowrap' }, 'Your talk');
    },
    render(st, k) {
      k.drift(this.bl, st);
      const s1 = st.at(1), s2 = st.at(2), e = st.enter;
      k.rise(this.head, k.outExpo(e / .8), 50);
      const hov = st.hoverY > 240 && st.hoverY < 660 ? Math.floor((st.hoverX - 120) / 580) : -1;
      this.cards.forEach((r, i) => {
        r.h += ((hov === i ? 1 : 0) - r.h) * st.ease(10);
        const g = k.spring((s1 - i) * st.beat, 1.6, .5), dim = hov >= 0 && hov !== i ? 1 : 0;
        r.c.style.opacity = s1 < i ? 0 : 1 - .35 * dim;
        r.c.style.transform = k.tr(-st.mx * 10, (1 - g) * 160 - 14 * r.h) + ' scale(' + (1 + .03 * r.h) + ')';
        r.wave.forEach((b, n) => { b.style.transform = 'scaleY(' + (.35 + .65 * Math.abs(Math.sin(st.clock * 3 + n * .9))) + ')'; });
      });
      this.flows.forEach((f, i) => { f.p.style.strokeDashoffset = f.len * (1 - k.outExpo((s2 - .2 - i * .15) / 1.2)); f.p.style.opacity = s2 < 0 ? 0 : 1; });
      const d = k.spring((s2 - 1.4) * st.beat, 1.8, .4), pulse = s2 > 2 ? .04 * Math.sin(st.clock * 2.2) : 0;
      this.disc.style.transform = 'scale(' + Math.max(0, d * (1 + pulse)) + ')';
    },
  });
})();
