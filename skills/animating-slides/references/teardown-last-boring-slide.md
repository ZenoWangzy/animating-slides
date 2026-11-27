# Teardown: The Last Boring Slide

[The Last Boring Slide](https://claude.ai/artifact/Cy2d8Vn63CnzCtonA1LSah) is a public Claude artifact: a talk about how fast AI is improving, told in 13 scenes rendered with Three.js and hand-written shaders. It is the strongest animated talk deck we have studied, and parts of this skill's method came from reading it.

It carries no licence, so nothing from it is in this repository: no code, no text, no images. This file describes its techniques in our own words, and says how to get the same effect with this skill's engine. Open the link to see each one in motion.

## One clock per scene

Every scene is a list of beats, each with a duration. Everything on screen (positions, colours, camera, the volume of the ambient sound) is computed from how far the current beat has run. There is no separate animation timeline to keep in sync, so a beat that runs long keeps the whole picture consistent.

Here: the same idea is the engine's core. `render(st)` reads `st.at(n)` and `st.enter` and sets every property from them. See [engine.md](engine.md).

## A number that keeps growing

A large counter sits on every beat and grows through the talk, from small to astronomically large to infinity, then drops back to one at the end. The audience feels the talk accelerating without being told.

Here: a running number is a few lines in a scene. Use a `count` cue so the ticks follow it ([sound.md](sound.md)), and let it end somewhere the talk returns to.

## Growth made physical

Each abstract claim about exponential growth becomes an object you can measure with your eye: a row of dominoes where each one is a fixed multiple of the last; a year of calendar days whose widths grow with progress; a wall that looks flat because you are standing at its foot.

Here: this is the "numbers people can feel" rule in [talk-craft.md](talk-craft.md). Pick a thing whose size the audience already knows, and let the data set its size.

## Data drawn exactly

The chart scene plots published data points and joins them with a monotone curve in log space, so the line never overshoots a measured point. The extrapolated part is drawn differently from the measured part.

Here: draw from the same array the narration quotes, so drawn data equals spoken data (a rule in SKILL.md). Mark projections visibly.

## A boring start that breaks

The first scene imitates the dullest possible default slide, and the speaker reads it flatly. Then the slide starts editing itself. The contrast makes every scene after it land harder.

Here: the cover must be complete on load (SKILL.md), but nothing stops scene two from opening as a plain slide that comes apart.

## Each scene enters its own way

Every scene names its entrance: a fade, a portal, a fold, a page tear, a slam, a daybreak and so on. Each entrance has its own synthesized sound, and the outgoing scene's last frame is kept so the new one can grow out of it.

Here: the engine's default entrance is a circle that opens from the click point. A scene can stage its own entrance in `render` from `st.enter`, as the `brain` scene in `examples/grokbot-talk` does with a second layer.

## Sound that belongs to the picture

Each scene has an ambient bed (wind, water, hum, tension) with its own amount of reverb, and its parameters follow the camera. Short sounds land on visual events: paper on a page turn, a creak when something tilts, a domino click whose pitch rises with each step.

Here: one recorded track per act, plus cues on entrances. A rising pitch per item is the `arg` of `pop`, `tap` or `card`. See [sound.md](sound.md).

## Speaker notes out of sight

Notes per beat sit in a hidden strip at the bottom and can open in a second window. Stage directions are written in brackets inside the notes, so the speaker knows how to say a line, not only what to say.

Here: `notes` per step, shown with N. Put stage directions in brackets the same way.

## What we chose not to copy

- **WebGL for everything.** A venue PC may have no GPU acceleration, and some shared browsers have WebGL turned off. This skill draws with the DOM and SVG, and keeps WebGL as an option ([engine.md](engine.md), "Going further").
- **Text drawn into the 3D scene.** Text rendered to a texture cannot be checked by an overlap audit. This skill keeps text in the DOM so `qa.mjs` can find text hidden behind a picture.
- **A 2 MB bundle.** This skill's decks are plain scripts that open by double-click and pack into a small offline zip.
