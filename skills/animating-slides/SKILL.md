---
name: animating-slides
description: Build talk decks that move, as full-screen animated HTML slides with timed choreography, music and sound effects, speaker notes, an overlap audit and an offline package. Use when someone wants slides for a keynote, meetup or conference talk, wants animated or cinematic slides, or asks to make a deck that feels like a film rather than a document.
---

# Animating Slides

You build a talk deck: a folder that opens by double-click in Chrome or Edge. It has a fixed 1920×1080 stage made of scenes, and each scene has numbered steps. The speaker clicks through the steps and every step plays its own choreography. Each moment is a pure function of the step and the beats since the step began, so any frame can be frozen, screenshotted and audited.

The engine, an example deck and the tools are in this skill's folder. Below, `<skill>` means that folder, for example `~/.claude/skills/animating-slides`:

- `template/`: `engine.js`, an example deck (`deck.js` and `scenes/*.js`) and an example `storyline.md`.
- `scripts/check-storyline.py` checks that every beat has words, a point and a source.
- `scripts/qa.mjs` runs the overlap audit, takes a screenshot of every step and makes a live tour with real key presses.
- `scripts/offline.sh` packs the deck into one zip for the venue PC.
- `scripts/subset-font.py` embeds fonts.
- `references/` holds the reference files that the phases below point to.

Work in five phases. Each phase ends on something the speaker approves, so a wrong turn costs one phase, not the whole deck.

## Phase 1: Storyline (no visuals yet)

1. Ask everything in one message:
   - who the audience is and what they care about;
   - the speaker's name and title, for the cover;
   - how long the talk is;
   - the one thing people should leave with;
   - the real material: numbers, stories, files, photos, videos, links;
   - anything that must not be said.
2. Read [references/talk-craft.md](references/talk-craft.md). Write `storyline.md` in the deck folder in the format of `template/storyline.md`: one throughline sentence, then one `## <scene>-<step>` beat per click, each with `Say`, `Point` and `Source`.
3. Every fact and number has a source the speaker gave you. When the story needs a fact you don't have, ask for it. A plausible line you made up is the most expensive bug in a talk, because the speaker says it on stage.
4. Run `python3 <skill>/scripts/check-storyline.py storyline.md`.

Done when the check prints OK and the speaker has approved the storyline.

## Phase 2: Scene plan

1. Group the beats into scenes. A scene is one metaphor played over several steps; a 20-minute talk is about 8 to 12 scenes.
2. For each scene, write the metaphor in one sentence. Then make one rough still: build the scene's end state, freeze it with `__seek(id, step, 99)` and take a screenshot (`qa.mjs` makes all of them).
3. Show the speaker the sentence and the still for each scene, and wait for a yes before you animate it.

Done when every scene has an approved metaphor and an approved still.

## Phase 3: Build

Copy `<skill>/template/` to the deck folder and keep `engine.js` as it is. Replace the example scenes, and list your scene files in `index.html` (one `<script src="scenes/...">` each) and their ids in `deck.js` `order`. The first scene is a cover with the title and the speaker, however short the deck. Read [references/engine.md](references/engine.md) for the scene contract and the gotchas, and [references/sound.md](references/sound.md) before you add music or cues.

Hold every scene to this bar:

- **Readable with the sound off.** Someone who hears nothing gets the beat's Point from the picture alone. Put 1 to 4 short phrases on screen; everything else goes in the speaker notes (`notes`, key N).
- **Plain words, felt numbers.** Use no jargon on screen. Turn every number into something people can picture, such as "someone new every 4 minutes" or "enough to fill a football stadium".
- **Drawn data equals spoken data.** If the speaker says 30 days, draw 30 bars. If they say 60%, fill 60% of the dial.
- **Alive when idle.** Every page keeps moving slowly with drifting colour fields, floating characters or breathing. The speaker may talk over one page for two minutes.
- **Answers the hand.** The pointer tilts the layers. Hover lifts or reveals. A click on a character makes it hop without turning the page, and every click leaves a ripple.
- **Few clicks.** The choreography inside a step chains itself on the beat grid. One click is one idea, not one element.
- **Transitions grow out of the last scene.** Open the next scene with a circle from the click, or with a shape that floods the frame, instead of a cross-fade.
- **The picture fills the frame.** The main visual takes most of the stage; words sit beside it, not above empty space.
- **Every step changes the picture.** A step that only swaps the caption is a wasted click. Let the picture itself show the change, such as a bar refilling, an object turning or a crowd growing.
- **Never one flat colour.** Use layered colour fields, depth and shadow on every background.
- **The frame of the talk.** The cover is complete the moment the file opens. A brand mark sits on every page. The last click returns to the cover.

Done when `python3 <skill>/scripts/check-storyline.py storyline.md --deck .` prints OK, and every scene has idle motion, a response to the pointer and at least one hover or poke.

## Phase 4: QA

1. Run `node <skill>/scripts/qa.mjs <deck> --out <deck>/qa`. It starts its own headless Chrome; add `--port 9222` to open one tab in a Chrome that is already running with `--remote-debugging-port=9222`. It must print `OK`. Besides overlaps and console errors, it fails any step that stays still for 0.8 s with nobody touching it (`STILL`). Fix the deck, not the audit: a finding is real until a screenshot proves otherwise.
2. Open every `qa/NN-<scene>-<step>.png`. For each one, write one sentence about what the picture says, then compare it with that beat's Point. A mismatch means the scene changes; the Point stays.
3. Open the `qa/tour-NN.png` frames from the live tour. Look for a layer that moves out of the frame and for an empty frame. `qa.mjs` already fails text that overlaps during a turn (`MID`).
4. Check what the audit can't catch: move the pointer to each corner, hover each interactive thing, and poke each character. Remember that the first key or click on the cover only starts the music; the second one turns the page.

Done when `qa.mjs` prints OK and every still says its Point.

## Phase 5: Package

1. Embed the fonts first if any text on screen isn't Latin (Chinese, Japanese and so on), because the venue PC may have no font for it: `<skill>/scripts/subset-font.py`, then paste the `@font-face` lines it prints into `index.html`.
2. Run `<skill>/scripts/offline.sh <deck> <name>.zip`. It inlines the scripts and fonts into `index.html` and copies `media/`. The zip opens on a PC with no network.
3. Unzip it into a temporary folder and run `qa.mjs` on that copy.
4. Send the zip. It carries a `README.txt` with the keys: arrows, space or click to step; N for notes; M for mute; F for full screen.

Done when the unzipped copy passes `qa.mjs`.
