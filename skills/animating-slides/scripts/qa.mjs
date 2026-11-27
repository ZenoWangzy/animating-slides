#!/usr/bin/env node
// QA sweep for a Animating Slides. Fails (exit 1) on any overlap finding, console error or uncaught exception.
//   node qa.mjs <deck-dir> [--out <dir>] [--port <cdp-port>]
// 1. Every step frozen at its end state (__seek): overlap audit (__audit) + a screenshot <out>/NN-<scene>-<step>.png.
// 2. A live tour with real key presses, forward through every step and back: a shot 0.3 s after each forward turn
//    (<out>/tour-NN.png), texts must not overlap during the turn (MID), the deck must land on the expected step each time, and every step
//    must still be moving when nobody touches it (STILL).
// Without --port it starts its own headless Chrome (blank profile; set CHROME=/path if it is not found).
// With --port it opens one tab in an already running Chrome (--remote-debugging-port) and closes it when done.
// The deck is opened with ?qa, which mutes it.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf('--' + name); return i >= 0 ? args.splice(i, 2)[1] : def; };
const outDir = path.resolve(opt('out', 'qa')), attachPort = opt('port', null);
const deckDir = args[0];
if (!deckDir || !fs.existsSync(path.join(deckDir, 'index.html'))) { console.error('usage: node qa.mjs <deck-dir> [--out dir] [--port 9222]'); process.exit(2); }
const url = 'file://' + path.resolve(deckDir, 'index.html') + '?qa';
fs.mkdirSync(outDir, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));

let chrome = null, port = attachPort, profile = null;
if (!port) {
  const mac = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const bins = [process.env.CHROME, 'google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', mac].filter(Boolean);
  profile = fs.mkdtempSync(path.join(os.tmpdir(), 'animating-slides-qa-'));
  for (const bin of bins) {
    try {
      chrome = spawn(bin, ['--headless=new', '--remote-debugging-port=0', '--user-data-dir=' + profile, '--no-first-run', '--no-default-browser-check', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
      await new Promise((ok, bad) => { chrome.once('error', bad); setTimeout(ok, 300); });
      break;
    } catch { chrome = null; }
  }
  if (!chrome) { console.error('no Chrome found; set CHROME=/path/to/chrome or pass --port'); process.exit(2); }
  for (let i = 0; i < 100 && !port; i++) { try { port = fs.readFileSync(path.join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0]; } catch { await sleep(100); } }
}
const base = 'http://127.0.0.1:' + port;
const target = await (await fetch(base + '/json/new?about:blank', { method: 'PUT' })).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
let seq = 0; const pend = new Map(), errors = [];
ws.onmessage = e => {
  const m = JSON.parse(e.data);
  if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); return; }
  if (m.method === 'Runtime.exceptionThrown') errors.push('exception: ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push('console.error: ' + m.params.args.map(a => a.value ?? a.description).join(' '));
  if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') errors.push('log: ' + m.params.entry.text + (m.params.entry.url ? ' ' + m.params.entry.url : ''));
};
await new Promise(r => (ws.onopen = r));
const send = (method, params = {}) => new Promise((ok, bad) => { const id = ++seq; pend.set(id, m => (m.error ? bad(new Error(method + ': ' + m.error.message)) : ok(m.result))); ws.send(JSON.stringify({ id, method, params })); });
const js = async expr => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(expr + ': ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text)); return r.result.value; };
const frames = () => js('new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => r(1))))');
const grab = async () => (await send('Page.captureScreenshot', { format: 'png' })).data;
const shot = async file => fs.writeFileSync(path.join(outDir, file), Buffer.from(await grab(), 'base64'));
// alive when idle: two frames 0.8 s apart with no input must differ
const idle = async (name, still) => { const a = await grab(); await sleep(800); if (a === (await grab())) still.push(name); };
const key = async k => { const code = { ArrowRight: 39, ArrowLeft: 37 }[k]; for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key: k, code: k, windowsVirtualKeyCode: code, nativeVirtualKeyCode: code }); };

let failed = false;
try {
  await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
  await Promise.all([send('Page.enable'), send('Runtime.enable'), send('Log.enable')]);
  const open = async () => { await send('Page.navigate', { url }); for (let i = 0; i < 100; i++) { if (await js('!!(window.__deck && document.body.classList.contains("ready"))').catch(() => false)) return; await sleep(100); } throw new Error('deck did not start: window.__deck missing (check the console errors below)'); };
  await open(); await js('document.fonts.ready.then(() => 1)'); await sleep(500);
  const steps = await js('__deck.steps');
  const findings = {};
  // 1. frozen end state of every step
  for (const [n, s] of steps.entries()) {
    const cut = s.lastIndexOf('-'), id = s.slice(0, cut), step = +s.slice(cut + 1);
    await js('__seek(' + JSON.stringify(id) + ', ' + step + ', 99)'); await frames();
    const f = await js('__audit()');
    if (f.length) findings[s] = f;
    await shot(String(n).padStart(2, '0') + '-' + s + '.png');
  }
  // 2. live tour with real keys (reload so nothing is frozen; the first key only starts the music)
  await open(); await sleep(800); await key('ArrowRight'); await sleep(200);
  const tour = [], still = [], mid = [];
  await idle(steps[0], still);
  // mid-turn: the shot lands early in the scene transition; texts of two steps must never overlap on the way (CUT is
  // ignored here, because entrances clip on purpose)
  const early = Math.max(60, Math.round((Number(await js('__deck.transitionMs')) || 750) * .12)) /* 750: decks on an older engine */, midAudit = async i => (await frames(), await js('__audit()')).filter(f => !f.startsWith('CUT')).forEach(f => mid.push(steps[i] + ': ' + f));
  for (let i = 1; i < steps.length; i++) {
    // audits first: a screenshot can take a second, by then the turn is over
    await key('ArrowRight'); const t0 = Date.now(); await sleep(early); await midAudit(i);
    await sleep(Math.max(0, 350 - (Date.now() - t0))); await midAudit(i);
    await shot('tour-' + String(i).padStart(2, '0') + '.png'); await sleep(Math.max(0, 1000 - (Date.now() - t0)));
    const at = await js('__deck.state().index'); if (at !== i) tour.push('forward: expected step ' + steps[i] + ', deck is at ' + steps[at]);
    await idle(steps[i], still);
  }
  for (let i = steps.length - 2; i >= 0; i--) {
    await key('ArrowLeft'); await sleep(250);
    const at = await js('__deck.state().index'); if (at !== i) tour.push('back: expected step ' + steps[i] + ', deck is at ' + steps[at]);
  }
  await sleep(300);
  const report = { url, steps: steps.length, findings, mid, tour, still, errors };
  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2));
  for (const [s, f] of Object.entries(findings)) console.log('AUDIT ' + s + ': ' + f.join(' | '));
  [...new Set(mid)].forEach(m => console.log('MID ' + m + ' (during the turn)'));
  tour.forEach(t => console.log('TOUR ' + t));
  still.forEach(s => console.log('STILL ' + s + ': nothing moves when idle'));
  errors.forEach(e => console.log('ERROR ' + e));
  failed = Object.keys(findings).length > 0 || mid.length > 0 || tour.length > 0 || still.length > 0 || errors.length > 0;
  console.log((failed ? 'FAIL' : 'OK') + ': ' + steps.length + ' steps, ' + Object.keys(findings).length + ' with overlaps, ' + new Set(mid).size + ' overlaps mid-turn, ' + tour.length + ' tour problems, ' + still.length + ' still pages, ' + errors.length + ' console errors. Shots in ' + outDir);
} catch (e) { console.error('qa crashed: ' + e.message); errors.forEach(x => console.error('ERROR ' + x)); failed = true; }
finally {
  await fetch(base + '/json/close/' + target.id).catch(() => {});
  ws.close();
  if (chrome) { chrome.kill(); await sleep(300); fs.rmSync(profile, { recursive: true, force: true }); }
}
process.exit(failed ? 1 : 0);
