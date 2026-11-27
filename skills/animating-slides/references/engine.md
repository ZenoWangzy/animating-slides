# Engine reference

`engine.js` is a classic script (no modules, no build). The deck opens from `file://` by double-click. Load order in `index.html`: `engine.js`, shared parts, one `<script>` per scene file, then `deck.js`. A new scene file needs its own `<script>` line; `Deck.start` throws if a scene in `order` never registered.

## Deck.start(options)

| option | default | meaning |
|---|---|---|
| `order` | required | scene ids in running order |
| `bpm` | 96 | the timing grid; `st.tb` and cue times are in beats of this tempo |
| `music` | `{}` | `{ act: 'media/music/x.mp3' }`, one looping track per act (see sound.md) |
| `musicVolume` | .7 | volume of the playing track |
| `transitionBeats` | 1.2 | length of the circle transition between scenes |
| `firstInputStartsAudio` | true | the first key or click on the first page starts the music and doesn't turn the page |
| `accent` | `#ff5a36` | click ripple colour on light scenes |
| `mark` | `''` | SVG or HTML shown top right on every page; use `currentColor` so it flips on dark scenes |

## Deck.scene(definition)

```js
Deck.scene({
  id: 'count',            // unique; also the URL hash: #count-2
  steps: 2,               // clicks inside this scene, numbered 1..steps
  act: 'drive',           // which music track plays (optional)
  dark: true,             // or step => boolean: flips the mark and ripple to white
  notes: { 1: '...', 2: '...' },                        // speaker notes per step (key N)
  cues: { 1: [[0, 'card', 0]], 2: [[.4, 'count', 'tick', 3]] }, // sound on entrances, see sound.md
  build(root, k) { /* create DOM once, inside root (1920x1080). Keep handles on this. */ },
  render(st, k) { /* every frame: set styles from st. No timers, no state machines. */ },
  poke(st, x, y) { /* optional: a click at stage x,y; return true if it hit something alive */ },
});
```

`#stage *` is `position:absolute`. Place everything with `left`/`top` in stage pixels.

### st (what render gets)

| field | meaning |
|---|---|
| `step` | current step of this scene |
| `tb` | beats since the current step began |
| `at(n)` | beats since step n began while step n is current; -1 while an earlier step is current; 99 once a later step is current (so step n's animation shows finished). Drive each step's animation from `at(n)`. |
| `enter` | beats since the scene was entered: use it for the scene's own entrance |
| `beat` | seconds per beat. Use it to convert for `spring`, which takes seconds. |
| `clock` | seconds, for idle motion. It is a constant while frozen, so stills are deterministic. |
| `mx`, `my` | eased pointer, -1..1 from the centre. Use them for parallax and tilt. |
| `hoverX`, `hoverY` | pointer in stage px, or -1 when there is no pointer or the frame is frozen |
| `ease(rate)` | per-frame smoothing factor: `h += (target - h) * st.ease(10)` |
| `T` | now in seconds. Compare it with a stored `pokeAt`. It is huge while frozen, so pokes are over. |
| `frozen` | true during `__seek` |

The pattern: `progress = k.outExpo((st.at(2) - delay) / duration)`, with delay and duration in beats. Staggers are fractions of a beat.

### k (the kit, also `Deck.kit`)

- Easing: `cl`, `outExpo`, `inCubic`, `inOut`.
- `spring(seconds, hz, damping)`: the closed-form damped spring.
- `hop(secondsSincePoke)`: returns `{y, sq}`, a jump with a squash.
- DOM: `div(parent, css, text)`, `svg(parent)` (full-stage overlay), `path(svg, d, color, width, dash)`. `dash` is an SVG dash string such as `'12 10'`; to draw a line in, set `strokeDasharray` to its `getTotalLength()` and animate `strokeDashoffset`.
- Motion: `rise(el, g, dist)` fades in while it rises. `tr(x, y)` builds a translate. `rgba(hex, a)` converts a colour.
- Backgrounds: `aurora(root, base, colours, alpha)` builds drifting colour fields, and `drift(fields, st)` moves them every frame.
- `near(st, x0, y0, x1, y1)` tells you whether the pointer is inside a box.

## Keys and URL

- → ↓ space Enter PageDown or a click: next. ← ↑ Backspace PageUp: back. Home and End jump to the first and last step.
- M mutes. N shows the notes. F goes full screen. After the last step, the next click goes back to the cover.
- `#scene-step` deep-links to a step. `?mute` or `?qa` starts muted.

## Hooks for tools

- `__deck.steps` lists every step as `id-step`.
- `__deck.state()` returns `{scene, step, index}`.
- `__deck.audioLog` records every music change and sfx, even while muted. `__deck.tracks` holds the music `<audio>` elements by act.
- `__seek(id, step, beats)` freezes a moment, and `__seek(null)` releases it.
- `__audit()` returns the overlap findings for the current scene: TXT (texts overlap), OBS (text under an image) and CUT (text cut off by a mask, a box or the stage edge).

## Gotchas

These bugs were found the hard way.

- **`file://` audio.** Routing an `<audio>` element into Web Audio (`createMediaElementSource`) plays silence from `file://`. Crossfade music with `audio.volume` only. The engine does this for you.
- **Fallback fonts are wider.** The venue PC may lack your font, and its fallback can be 10% wider. Give masks and boxes slack, or embed the font with `subset-font.py`. The CUT audit catches text that is cut off.
- **Measure while visible.** Scenes are built while their root is displayed and hidden afterwards, so `getTotalLength()` and text sizes return real values in `build`.
- **Back is a cut.** Going back skips the transition and the scene entrance; only the step replays. A presenter going back wants speed.
- **Late cues are dropped.** A cue whose time has already passed when its step starts is skipped, never fired late, so there are no stray sounds after fast clicking.
- **Never black.** The cover renders on load. Browsers need a gesture before sound, so the first input starts the music.
- **Mail filters drop `.js` inside zips.** `offline.sh` inlines every script into `index.html`.

## Going further

- **Video:** put a `<video>` in a scene, play it when `st.at(n) >= 0`, and pause it when the step changes. Keep the files in `media/`. `offline.sh` copies them, so watch the size budget.
- **Real 3D:** bundle Three.js with esbuild into one classic script (`--format=iife`). Render into a canvas inside the scene root and drive the camera and objects from `st` like everything else. Keep a 2D fallback for PCs without WebGL.
