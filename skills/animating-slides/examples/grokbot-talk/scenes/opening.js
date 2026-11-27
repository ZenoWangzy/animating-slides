// The opening scenes of the talk: cover, the three people Grok Bot learned from, and the software factory.
// They use the helpers that scenes/talk.js exports on window.Talk.
(function () {
  const k = Deck.kit, T = window.Talk, { COL, BEAT, mascot } = T;
  const { div, tr, rise, near, botFace, look, chip, svg, path, aurora, drift, friends, floatFriends, pokeFriends, PINK, ORANGE, TEAL } = T;
  const { cl, outExpo, inCubic, inOut, spring, hop } = k;

  // ---- cover: complete on load; the cast floats, leans from the pointer, hops when poked
  Deck.scene({
    id: 'cover', steps: 1, act: 'bed',
    build(root) {
      this.bl = aurora(root, COL.cream, [COL.purple, COL.green, COL.blue, ORANGE], .22);
      this.badge = botFace(root, 64); this.badge.b.style.left = '120px'; this.badge.b.style.top = '70px';
      this.meet = div(root, { left: '204px', top: '86px', font: '700 30px DeckMono,monospace', color: COL.ink, letterSpacing: '.12em', whiteSpace: 'nowrap' }, 'GROK BOT MEETUP');
      this.lines = ['我用 Grok Bot', '赚钱'].map((t, i) => { const m = div(root, { left: '120px', top: 220 + i * 150 + 'px', width: '1000px', height: '150px', overflow: 'hidden' }); return div(m, { left: 0, top: 0, fontSize: '124px', fontWeight: 700, lineHeight: 1.12, color: COL.purple, whiteSpace: 'nowrap' }, t); });
      this.who = div(root, { left: '124px', top: '560px', fontSize: '44px', fontWeight: 700, color: COL.ink, whiteSpace: 'nowrap' }, 'Zeno 王泽宇');
      this.role = div(root, { left: '124px', top: '624px', fontSize: '32px', color: '#55555c', whiteSpace: 'nowrap' }, '熵算智能 Founder · 企业 AI 转型咨询专家');
      this.hint = div(root, { left: '124px', top: '960px', font: '700 26px DeckMono,monospace', color: '#8a8a92', letterSpacing: '.14em', whiteSpace: 'nowrap' }, '按 → 开始');
      this.cast = friends(root, [['purple', 420, 1180, 420], ['blue', 220, 1560, 120], ['pink', 170, 1230, 170], ['green', 170, 1500, 860], ['teal', 110, 1080, 860], ['orange', 150, 1700, 520]]);
    },
    render(st) {
      drift(this.bl, st); floatFriends(this.cast, st); look(this.badge, st);
      const e = st.enter;
      this.lines.forEach((l, i) => { l.style.transform = 'translateY(' + (1 - outExpo((e - .1 - i * .3) / 1.1)) * 110 + '%)'; });
      rise(this.who, outExpo((e - .9) / .9), 30); rise(this.role, outExpo((e - 1.2) / .9), 30);
      this.hint.style.opacity = e < 2.4 ? 0 : .5 + .3 * Math.sin(st.clock * 2.4);
      this.cast.forEach((f, i) => { f.m.style.opacity = outExpo((e - .2 - i * .15) / .6); });
    },
    poke(st, x, y) { return pokeFriends(this.cast, st, x, y); },
  });

  // ---- learn: three people in thirds; then Grok Bot drops in and what it learns flows into it
  const PEOPLE = [
    { ini: 'MP', name: 'Matt Pocock', handle: '@mattpocockuk', bg: COL.purple, items: ['mattpocock/skills 开源技能包', '先拷问需求，再动手写', '需求写成规格，拆成小票'] },
    { ini: 'LT', name: 'poteto', handle: 'Lauren Tan · @poteto', bg: COL.green, items: ['pstack 开源技能包', '把 Bot 当工程团队来管', '少写代码，写好代码'] },
    { ini: 'AO', name: 'Addy Osmani', handle: '@addyosmani', bg: COL.blue, items: ['agent-skills 开源技能包', '想法打磨：发散、收敛、落地', '多层自动验证，人只管把关'] },
  ];
  Deck.scene({
    id: 'learn', steps: 2, act: 'learn', dark: true,
    cues: { 1: [[.8, 'pop', 0], [1.8, 'pop', 4], [2.8, 'pop', 8]], 2: [[0, 'pop', -5], [.6, 'card', 7], [1.2, 'shimmer', 0]] },
    build(root) {
      root.style.background = COL.ink;
      this.panels = PEOPLE.map((m, i) => {
        const p = div(root, { left: i * 640 + 'px', top: 0, width: '640px', height: '1080px', overflow: 'hidden', background: m.bg });
        // photo slot: a big monogram on soft rings, drawn so the example ships no third-party photos
        const ph = div(p, { left: 0, top: 0, width: '640px', height: '560px', overflow: 'hidden', background: 'rgba(0,0,0,.12)' });
        const art = div(ph, { left: 0, top: 0, width: '640px', height: '560px' });
        [420, 300, 180].forEach((r, n) => div(art, { left: 320 - r + 'px', top: 280 - r + 'px', width: 2 * r + 'px', height: 2 * r + 'px', borderRadius: '50%', border: '3px solid rgba(255,255,255,' + (.12 + n * .08) + ')' }));
        div(art, { left: 0, top: '150px', width: '640px', textAlign: 'center', font: '700 220px/260px DeckSans,sans-serif', color: 'rgba(255,255,255,.92)' }, m.ini);
        const nm = div(p, { left: '56px', top: '584px', width: '560px', height: '150px', overflow: 'hidden', color: '#fff' });
        const b = div(nm, { left: 0, top: 0, fontSize: '66px', fontWeight: 700, whiteSpace: 'nowrap', lineHeight: 1.1 }, m.name);
        const hd = div(nm, { left: '2px', top: '86px', font: '700 28px DeckMono,monospace', opacity: .85, whiteSpace: 'nowrap' }, m.handle);
        const items = m.items.map((t, n) => { const row = div(p, { left: '56px', top: 716 + n * 44 + 'px', width: '560px', height: '44px', overflow: 'hidden' }); div(row, { left: 0, top: '18px', width: '8px', height: '8px', borderRadius: '50%', background: COL.cream }); return div(row, { left: '22px', top: 0, fontSize: '27px', lineHeight: '44px', color: '#fff', whiteSpace: 'nowrap' }, t); });
        return { p, art, b, hd, items, h: 0 };
      });
      this.hls = [639, 1279].map(x => div(root, { left: x + 'px', top: 0, width: '3px', height: '1080px', background: COL.cream, transformOrigin: '50% 0' }));
      const s = svg(root);
      this.flows = ['M320 872 C320 925 820 905 932 942', 'M960 872 L960 930', 'M1600 872 C1600 925 1100 905 988 942'].map(dd => {
        const p = path(s, dd, COL.cream, 4); const len = p.getTotalLength(); p.style.strokeDasharray = len;
        const dots = [0, 1, 2].map(() => { const c = document.createElementNS(T.NS, 'circle'); c.setAttribute('r', '9'); c.setAttribute('fill', COL.cream); s.appendChild(c); return c; });
        return { p, len, dots };
      });
      this.bot = botFace(root, 140); this.bot.b.style.left = '890px'; this.bot.b.style.top = '905px'; this.bot.b.style.boxShadow = '0 0 0 4px ' + COL.cream;
      this.lab = div(root, { left: '1052px', top: '944px', padding: '10px 22px', borderRadius: '30px', background: COL.ink, font: '700 30px DeckMono,monospace', color: '#fff', whiteSpace: 'nowrap' }, 'Grok Bot 学 agent coding 实践');
    },
    render(st) {
      const s1 = st.at(1), s2 = st.at(2);
      const hov = st.hoverY > 0 && st.hoverY < 860 ? Math.floor(st.hoverX / 640) : -1;
      this.hls.forEach((h, i) => { h.style.transform = 'scaleY(' + outExpo((s1 - i * .2) / .8) + ')'; });
      this.panels.forEach((pn, i) => {
        const ti = .8 + i, e = outExpo((s1 - ti) / .9);
        pn.h += ((hov === i ? 1 : 0) - pn.h) * st.ease(8);
        const other = hov >= 0 && hov !== i ? 1 : 0;
        pn.p.style.clipPath = 'inset(' + 100 * (1 - e) + '% 0 0 0)';
        const sp = spring((s1 - ti) * BEAT, 1.6, .6), kb = 1.06 + .025 * Math.sin(st.clock * .35 + i * 2.1);
        pn.art.style.transform = tr(-st.mx * 14, -st.my * 10) + ' scale(' + Math.max(1, 1.3 - .3 * sp) * (kb + .06 * pn.h) + ')';
        pn.p.style.filter = 'saturate(' + (1 - .35 * other * (1 - pn.h)) + ') brightness(' + (1 - .12 * other) + ')';
        pn.b.style.transform = 'translateY(' + (1 - outExpo((s1 - ti - .35) / .9)) * 110 + '%) translateX(' + 8 * pn.h + 'px)';
        pn.hd.style.transform = 'translateY(' + (1 - outExpo((s1 - ti - .6) / .9)) * 140 + 'px)';
        pn.items.forEach((it, n) => { it.parentElement.style.transform = 'translateX(' + 10 * pn.h * (n + 1) / 3 + 'px)'; it.style.transform = 'translateY(' + (1 - outExpo((s1 - ti - 1 - n * .3) / .9)) * 120 + '%)'; });
      });
      const bs = s2 < 0 ? 0 : spring(s2 * BEAT, 1.8, .38), pulse = s2 > 2 ? .06 * Math.exp(-((s2 % 1) * 5)) : 0;
      this.bot.b.style.transform = 'scale(' + bs * (1 + .025 * Math.sin(st.clock * 2.2) + pulse) + ')'; look(this.bot, st);
      this.lab.style.opacity = s2 < 0 ? 0 : cl((s2 - .6) / .5); this.lab.style.transform = 'translateX(' + (1 - outExpo((s2 - .6) / .8)) * -30 + 'px)';
      this.flows.forEach((f, i) => {
        f.p.style.strokeDashoffset = f.len * (1 - (s2 < 0 ? 0 : outExpo((s2 - .5 - i * .15) / 1.2))); f.p.style.opacity = s2 < 0 ? 0 : .55 + .35 * (hov === i ? 1 : 0);
        f.dots.forEach((c, n) => { const u = ((Math.max(0, s2 - 1.2)) * .5 + n / 3 + st.clock * .2) % 1, pt = f.p.getPointAtLength(u * f.len); c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y); c.style.opacity = s2 > 1.2 ? Math.sin(Math.PI * u) : 0; });
      });
    },
  });

  // ---- factory: two belts with stations, tasks flowing; then the numbers, with the factory still on screen
  const DAYS = [6,4,23,60,47,31,39,30,37,27,18,25,20,5,18,4,3,0,6,12,30,29,21,93,43,38,18,34,58,53,29,0,25,77,23,66,64]; // changes shipped per day, 2026-10-01 to 11-06
  const MAXDAY = Math.max(...DAYS);
  const RA = 430, RB = 840, XL = 250, XR = 1730, DROP = RB - RA, LEN = (XR - XL) * 2 + DROP;
  const along = u => { u = ((u % LEN) + LEN) % LEN; if (u < XR - XL) return [XL + u, RA]; u -= XR - XL; if (u < DROP) return [XR, RA + u]; u -= DROP; return [XR - u, RB]; };
  const ST = [['pink', '看需求', RA, 470], ['teal', '拆成小活', RA, 770], ['blue', '问清楚', RA, 1070], ['green', '发新版', RA, 1370],
    ['blue', '写代码', RB, 1600], ['pink', '检查', RB, 1390], ['teal', '再检查', RB, 1180], ['orange', '改错', RB, 970], ['green', '自动测试', RB, 760], ['purple', '上线', RB, 550], ['pink', '收尾', RB, 340]];
  const TKC = [COL.ink, PINK, TEAL, COL.blue, COL.green, ORANGE, COL.purple];
  Deck.scene({
    id: 'factory', steps: 2, act: 'engine',
    cues: { 1: [...ST.map((_, i) => [.6 + i * .18, 'pop', i * 2]), [2.6, 'clunk'], [3, 'shimmer', 0]], 2: [[1, 'pop', 7], [1.1, 'count', 'tick', 3], [1.4, 'card', 0], [2, 'card', 2], [2.6, 'card', 4]] },
    build(root) {
      this.bl = aurora(root, COL.cream, [COL.purple, COL.blue, COL.green], .14);
      this.title = div(root, { left: '120px', top: '60px', width: '1000px', height: '170px', overflow: 'hidden' });
      this.tt = div(this.title, { left: 0, top: 0, width: '1000px' });
      div(this.tt, { position: 'relative', fontSize: '96px', fontWeight: 700, color: COL.purple, lineHeight: 1.1 }, 'ZenoForge');
      div(this.tt, { position: 'relative', fontSize: '38px', color: '#1b1b1f', marginTop: '4px', whiteSpace: 'nowrap' }, '产品迭代的引擎：两条流水线，24 小时不停');
      this.world = div(root, { left: 0, top: 0, width: '1920px', height: '1080px', transformOrigin: '0 0' });
      const belt = (css, origin) => div(this.world, Object.assign({ borderRadius: '11px', background: '#1b1b1f', transformOrigin: origin }, css));
      this.beltA = belt({ left: XL + 'px', top: RA + 'px', width: XR - XL + 'px', height: '22px' }, '0 50%');
      this.beltD = belt({ left: XR - 11 + 'px', top: RA + 'px', width: '22px', height: DROP + 22 + 'px' }, '50% 0');
      this.beltB = belt({ left: XL + 'px', top: RB + 'px', width: XR - XL + 'px', height: '22px' }, '100% 50%');
      [['接活', '每 5 分钟转一圈', RA], ['干活', '每 2 分钟转一圈', RB]].forEach(([a, b, y]) => { div(this.world, { left: '60px', top: y - 34 + 'px', fontSize: '44px', fontWeight: 700, color: '#1b1b1f', whiteSpace: 'nowrap' }, a); div(this.world, { left: '60px', top: y + 22 + 'px', fontSize: '22px', color: '#77777f', whiteSpace: 'nowrap' }, b); });
      this.st = ST.map(([id, name, row, x], i) => {
        const w = div(this.world, { left: x + 'px', top: row - 150 + 'px', width: 0, height: 0 });
        const body = div(w, { left: '-90px', top: 0, width: '180px', height: '150px', transformOrigin: '50% 100%' });
        const m = mascot(id, id === 'purple' ? 104 : 116, body); m.style.left = 90 - parseFloat(m.style.width) / 2 + 'px'; m.style.top = 150 - parseFloat(m.style.height) + 'px';
        const lab = div(w, { left: '-100px', top: '182px', width: '200px', height: '52px', overflow: 'hidden', textAlign: 'center' });
        const lb = div(lab, { left: 0, top: 0, width: '200px', fontSize: '32px', fontWeight: 700, color: '#1b1b1f' }, name);
        return { x, row, body, lab: lb, h: 0, pokeAt: -99 };
      });
      const s = svg(this.world);
      this.loop = path(s, 'M970 ' + (RB - 175) + ' C990 ' + (RB - 300) + ' 1370 ' + (RB - 300) + ' 1390 ' + (RB - 175), COL.purple, 5, '14 12');
      this.loopL = div(this.world, { left: '1080px', top: '510px', width: '200px', textAlign: 'center', fontSize: '24px', fontWeight: 700, color: COL.purple }, '改完再查一遍');
      this.tk = Array.from({ length: 10 }, (_, i) => { const t = div(this.world, { left: 0, top: 0, width: '100px', height: '62px', borderRadius: '12px', background: '#fff', boxShadow: '0 8px 22px rgba(27,27,31,.14)', overflow: 'hidden' }); div(t, { left: 0, top: 0, width: '100px', height: '12px', background: TKC[i % TKC.length] }); div(t, { left: 0, top: '20px', width: '100px', textAlign: 'center', fontSize: '24px', fontWeight: 700, color: '#1b1b1f' }, '任务'); return t; });
      this.foreman = botFace(this.world, 110); this.foreman.b.style.left = '100px'; this.foreman.b.style.top = '270px';
      // step 2: the numbers, each turned into something a non-engineer can feel
      this.bars = div(root, { left: '150px', top: '690px', width: '1640px', height: '300px' });
      this.br = DAYS.map((n, i) => ({ b: div(this.bars, { left: i * 44 + 'px', top: 300 - 300 * n / MAXDAY + 'px', width: '32px', height: 300 * n / MAXDAY + 'px', borderRadius: '8px 8px 0 0', background: [COL.purple, COL.blue, COL.green, ORANGE][i % 4], transformOrigin: '50% 100%' }), n, h: 0,
        lab: div(this.bars, { left: i * 44 - 44 + 'px', top: 300 - 300 * n / MAXDAY - 40 + 'px', width: '120px', textAlign: 'center', fontSize: '24px', fontWeight: 700, color: '#1b1b1f', opacity: 0 }, n + ' 个') }));
      this.cap = div(root, { left: '150px', top: '1006px', fontSize: '26px', color: '#77777f', whiteSpace: 'nowrap' }, '每天做完上线的改动（10 月 1 日 – 11 月 6 日）');
      this.big = div(root, { left: '1000px', top: '80px', width: '860px', color: '#1b1b1f' });
      div(this.big, { position: 'relative', fontSize: '52px', fontWeight: 700 }, '37 天，做完并上线');
      this.bigN = div(this.big, { position: 'relative', font: '700 200px DeckMono,monospace', color: COL.purple, lineHeight: 1 }, '1,116');
      div(this.big, { position: 'relative', fontSize: '52px', fontWeight: 700 }, '个改动');
      this.stats = [['新写代码', '52.6 万行', '改动了 16,107 个文件'], ['相当于', '81 个程序员', '按行业最快一档：每人每周 2.6 个'], ['效率', '27–54 倍', '对比同期普通开发团队']].map(([a, b, c], i) => {
        const dd = div(root, { left: 120 + i * 580 + 'px', top: '500px', width: '540px', height: '130px', borderLeft: '6px solid ' + COL.purple, paddingLeft: '28px', color: '#1b1b1f' });
        div(dd, { position: 'relative', fontSize: '26px', color: '#77777f' }, a); div(dd, { position: 'relative', fontSize: '58px', fontWeight: 700, lineHeight: 1.15, whiteSpace: 'nowrap' }, b); div(dd, { position: 'relative', fontSize: '24px', color: '#77777f', whiteSpace: 'nowrap' }, c);
        return dd;
      });
    },
    render(st) {
      drift(this.bl, st);
      const a = st.enter, s2 = st.at(2), fw = st.step === 2 ? inOut(s2 / 1.2) : 0;
      this.tt.style.transform = 'translateY(' + (1 - outExpo(a / 1)) * 120 + '%)'; this.title.style.opacity = 1 - fw;
      this.beltA.style.transform = 'scaleX(' + outExpo((a - .3) / 1) + ')'; this.beltD.style.transform = 'scaleY(' + outExpo((a - 1) / .6) + ')'; this.beltB.style.transform = 'scaleX(' + outExpo((a - 1.4) / 1) + ')';
      const run = Math.max(0, a - 2.5) + st.clock * .4;
      const pos = this.tk.map((t, i) => { const [x, y] = along(run * 150 + i * LEN / this.tk.length); t.style.transform = tr(x - 50, y - 66); t.style.opacity = a > 2.4 ? 1 : 0; return [x, y]; });
      this.st.forEach((s, i) => {
        const on = spring((a - .6 - i * .18) * BEAT, 1.7, .4);
        s.h += ((near(st, (s.x - 90) * (1 - .5 * fw), (s.row - 150) * (1 - .5 * fw), (s.x + 90) * (1 - .5 * fw), (s.row + 40) * (1 - .5 * fw)) ? 1 : 0) - s.h) * st.ease(10);
        const dd = Math.min(...pos.map(([x, y]) => y === s.row ? Math.abs(x - s.x) : 999)), work = a > 2.4 ? cl(1 - dd / 60) : 0;
        const pk = hop(st.T - s.pokeAt), bob = Math.sin(st.clock * 2.4 + i) * 3;
        s.body.style.transform = 'translateY(' + (-20 * work - 12 * s.h + pk.y + bob) + 'px) scale(' + on * (1 + .08 * work + pk.sq) + ',' + on * (1 - .06 * work - pk.sq) + ')';
        s.lab.style.transform = 'translateY(' + (1 - outExpo((a - 1 - i * .18) / .8)) * 100 + '%)'; s.lab.style.color = s.h > .5 ? COL.purple : '#1b1b1f';
      });
      this.loop.style.strokeDashoffset = -st.clock * 40; this.loop.style.opacity = cl((a - 3) / .8); this.loopL.style.opacity = cl((a - 3.2) / .8);
      this.foreman.b.style.transform = 'scale(' + Math.max(0, spring((a - .2) * BEAT, 1.8, .4)) + ') translateY(' + Math.sin(st.clock * 2) * 5 + 'px)'; look(this.foreman, st);
      this.world.style.transform = tr(-10 * fw, -10 * fw) + ' scale(' + (1 - .5 * fw) + ')';
      const hb = s2 > 0 && st.hoverY > 640 ? Math.floor((st.hoverX - 150) / 44) : -1;
      this.br.forEach((r, i) => { r.h += ((hb === i ? 1 : 0) - r.h) * st.ease(12); r.b.style.transform = 'scaleY(' + outExpo((s2 - .8 - i * .05) / 1) + ')'; r.b.style.filter = 'brightness(' + (1 + .25 * r.h) + ')'; r.lab.style.opacity = r.h; });
      this.bars.style.opacity = s2 < 0 ? 0 : 1; this.cap.style.opacity = s2 < 0 ? 0 : cl((s2 - 2) / .6);
      this.bigN.textContent = Math.round(1116 * outExpo(cl((s2 - 1.1) / 3))).toLocaleString('en-US');
      this.big.style.opacity = s2 < 0 ? 0 : cl((s2 - 1) / .6); this.big.style.transform = 'translateY(' + (1 - outExpo((s2 - 1) / 1)) * 40 + 'px)'; // waits for the factory to shrink out of its way
      this.stats.forEach((dd, i) => { const g = s2 < 0 ? 0 : outExpo((s2 - 1.4 - i * .6) / .9); dd.style.opacity = g; dd.style.transform = 'translateX(' + (1 - g) * 60 + 'px)'; });
    },
    poke(st, x, y) {
      if (st.step !== 1) return false;
      const s = this.st.find(s => x > s.x - 90 && x < s.x + 90 && y > s.row - 150 && y < s.row + 40);
      if (s) { s.pokeAt = st.T; return true; }
      return false;
    },
  });
})();
