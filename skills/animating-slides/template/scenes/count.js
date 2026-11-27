// A number people can feel: the bars are the data (one bar per day), then the total counts up and is
// turned into something an audience can picture. Hover a bar to read it.
(function () {
  // sample data, labelled as such on screen. In a real deck this comes from your data file, never invented.
  const DAYS = [212, 260, 241, 305, 288, 190, 176, 330, 356, 349, 402, 371, 240, 228, 395, 420, 461, 437, 512, 318, 296, 488, 530, 566, 541, 610, 402, 377, 598, 655];
  const MAX = Math.max(...DAYS), TOTAL = DAYS.reduce((a, b) => a + b, 0);
  const PER_MIN = Math.round(24 * 60 * DAYS.length / TOTAL * 10) / 10; // minutes between two visitors, round the clock
  Deck.scene({
    id: 'count', steps: 2, act: 'drive', dark: true,
    notes: {
      1: 'Thirty days, one bar a day. Let the bars land before you talk.',
      2: 'The total, then what it means: someone new every few minutes, day and night.',
    },
    cues: { 1: [[0, 'card', 0], [1.2, 'riser']], 2: [[.2, 'pop', 7], [.4, 'count', 'tick', 3], [2.4, 'card', 4]] },
    build(root, k) {
      const C = Parts.PAL;
      this.bl = k.aurora(root, C.ink, [C.cobalt, C.mint, C.tomato], .28);
      this.head = Parts.heading(root, 'Thirty days of visitors', '#fff');
      this.tag = k.div(root, { left: '124px', top: '190px', padding: '6px 18px', borderRadius: '20px', background: C.sun, color: C.ink, font: '700 24px var(--mono)', letterSpacing: '.1em', whiteSpace: 'nowrap' }, 'SAMPLE DATA');
      const box = k.div(root, { left: '120px', top: '560px', width: '1680px', height: '380px' });
      this.bars = DAYS.map((n, i) => {
        const b = k.div(box, { left: i * 56 + 'px', bottom: 0, top: 'auto', width: '40px', height: 380 * n / MAX + 'px', borderRadius: '10px 10px 0 0', background: [C.cobalt, C.mint, C.tomato, C.sun][i % 4], transformOrigin: '50% 100%' });
        const lab = k.div(box, { left: i * 56 - 40 + 'px', top: 380 - 380 * n / MAX - 52 + 'px', width: '120px', textAlign: 'center', font: '700 28px var(--mono)', color: '#fff', opacity: 0 }, String(n));
        return { b, lab, h: 0 };
      });
      this.axis = k.div(root, { left: '120px', top: '960px', font: '500 26px var(--sans)', color: 'rgba(255,255,255,.6)', whiteSpace: 'nowrap' }, 'Day 1 → Day 30');
      this.big = k.div(root, { left: '120px', top: '250px', font: '800 200px/1 var(--display)', color: '#fff', whiteSpace: 'nowrap' }, '0');
      this.unit = k.div(root, { left: '120px', top: '460px', font: '600 44px var(--sans)', color: C.sun, whiteSpace: 'nowrap' }, 'visitors — one every ' + PER_MIN + ' minutes, day and night');
    },
    render(st, k) {
      k.drift(this.bl, st);
      const e = st.enter, s1 = st.at(1), s2 = st.at(2);
      k.rise(this.head, k.outExpo(e / .8), 50); k.rise(this.tag, k.outExpo((e - .3) / .8), 30);
      // hover reads a bar: it brightens and shows its value
      const hb = st.hoverY > 520 && st.hoverY < 960 ? Math.floor((st.hoverX - 120) / 56) : -1;
      this.bars.forEach((r, i) => {
        r.h += ((hb === i ? 1 : 0) - r.h) * st.ease(12);
        r.b.style.transform = 'scaleY(' + k.outExpo((s1 - .3 - i * .05) / .9) + ')';
        r.b.style.filter = 'brightness(' + (1 + .3 * r.h) + ')';
        r.lab.style.opacity = r.h;
      });
      this.axis.style.opacity = k.cl((s1 - 1.5) / .6) * .9;
      const g = s2 < 0 ? 0 : k.outExpo(k.cl((s2 - .4) / 3));
      this.big.textContent = Math.round(TOTAL * g).toLocaleString('en-US');
      k.rise(this.big, k.outExpo((s2 - .2) / .8), 40);
      k.rise(this.unit, k.outExpo((s2 - 2.4) / .9), 30);
    },
  });
})();
