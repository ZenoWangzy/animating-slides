# Example: a full 20-minute talk

This is the deck behind a real meetup talk, "我用 Grok Bot 赚钱" (how I make money with Grok Bot), given in Chinese in November 2026. The published version is at https://zenowangzy.github.io/grokbot-talk/. Where `template/` shows the engine in four small scenes, this folder shows what a whole talk looks like: 10 scenes, 26 clicks, four acts.

Open `index.html` by double-click, or check it:

```bash
node <skill>/scripts/qa.mjs <skill>/examples/grokbot-talk --out /tmp/qa
```

## Scenes and the technique each one shows

| Scene | Steps | What it says | Technique to borrow |
|---|---|---|---|
| `cover` | 1 | title and speaker | complete on load; the cast floats, leans toward the pointer and hops when poked |
| `ledger` | 4 | one page of the speaker's own books | a document that fills in line by line, with a counting total |
| `problem` | 4 | a customer's three problems | three cards side by side, each with its own small animation: a loss that reads "?", a calendar counting days, a stamp |
| `masters` | 2 | first learn the big companies' published methods | a dark stage that builds in two steps |
| `learn` | 2 | three people's public practice flows into the bot | split panels with hover focus, then paths drawn into one face |
| `brain` | 4 | the product: answers to each pain, then the whole chain, then the contract | an opaque layer that opens as a circle over the previous picture; a 3D-tilted diagram that follows the pointer; a signature that draws itself and a stamp on a spring |
| `factory` | 2 | the software factory and its output | two belts with stations that react as tasks pass; the factory shrinks into a corner to make room for the numbers |
| `night` | 3 | when the work happens, and what it costs | a heat map of 37 days by hour; a pile of chat bubbles counting up; a bill |
| `copy` | 1 | the same bots earn three ways | three cards with one shared cast |
| `end` | 3 | the close and the contact | the opening cast returns, so the end echoes the start; a placeholder for the QR code |

The code is in `scenes/talk.js` (shared helpers, then most scenes) and `scenes/opening.js` (cover, learn and factory). Both use the same engine as the template; `engine.js` here is an identical copy.

## What was changed for publishing

- The speaker's script and notes are not included, so N shows no notes here. See `template/storyline.md` for the format a talk's script takes.
- The talk used photos of the speaker and of the three people it credits. Here they are drawn monograms and coloured placeholders, so the repository ships no third-party photos.
- The QR code on the last page is a dashed placeholder box.
- The meetup template's mascots are replaced by plain shapes with eyes, drawn in code.
- No music is included. `deck.js` lists the four acts; add your own tracks as the template's `media/music/README.md` describes.

The numbers on screen (1,116 changes in 37 days, 52.6 万 lines, the 50 万 contract) are the speaker's own figures as of November 2026. Replace them with yours: the deck is a model of how to stage numbers, not a source for them.

## Licence

The same as the rest of this repository: PolyForm Noncommercial 1.0.0.
