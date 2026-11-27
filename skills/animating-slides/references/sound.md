# Sound

Sound sets the pace of a talk deck. It should be steady and quiet under the speaker's voice.

## Music: one recorded track per act

- Group scenes into 3 or 4 acts by mood, such as opening, problem, build-up and close. Give each act one recorded track (`Deck.start({ music })`, and `act` on each scene). On a scene change into another act, the old track fades out and the new one fades in from its start.
- Use real recordings. Tones synthesized in the browser sound like a motor hum under a voice.
- Pick calm tracks with a small dynamic range, and normalise them to about -24 LUFS. Recipe and licence notes: `template/media/music/README.md`.
- The opening and the close share a track, so the end echoes the start.
- A browser plays no sound until the first gesture. On the cover, the first key or click starts the music and doesn't turn the page.

## Sound effects: one per entrance

- A sound belongs to a visual event: a card lands, a number counts, a stamp hits, a scene opens. Write it in the scene's `cues`, at the same beat as the animation in `render`:
  `cues: { 2: [[0.2, 'pop', 7], [0.4, 'count', 'tick', 3]] }` means: in step 2, play a pop at beat 0.2, then count ticks for 3 beats from beat 0.4.
- A `count` cue follows an `outExpo` number over `len` beats. It ticks each time the number passes another eighth of the way, at least 120 ms apart. Use `'coin'` for money and `'tick'` for other numbers.
- Leave idle loops silent. A floating character that clicks every second becomes noise within a minute.
- Built-in sounds: `tap pop card whoosh riser stamp shimmer tick coin bubble strike clunk`. `tap pop card shimmer tick coin bubble` take a pitch in semitones as their argument, `whoosh` takes `true` for the darker version, and the rest take no argument. Peaks stay at or under 0.045. Leave out the compressor, because its makeup gain makes quiet sounds louder.
- Every scene change plays `whoosh`, darker on dark scenes. A poke plays `tap`.

## Checking sound without listening

`__deck.audioLog` records every music change and sfx, even while muted. A muted tour (`?qa`) can assert that each step fires the cues it should.
