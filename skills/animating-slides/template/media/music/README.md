# Music

One recorded track per act, quiet and steady. Put the files here and list them in `deck.js` under `music`;
each scene picks its act with `act: '<name>'`. A deck with no music still plays its sound effects.

- Use tracks whose license lets you play them in public and ship them inside your deck. Many free
  libraries (for example Mixkit, Pixabay Music, the YouTube Audio Library) allow both; read the terms
  of each track. Don't commit tracks to a public repo unless their license allows redistribution.
- Pick calm tracks with little dynamic range: a track that swells and drops fights the speaker.
- Normalise loudness to about -24 LUFS, fade in over 2 s and out over 4 s, and encode at 96 kbps, e.g.
  `ffmpeg -i in.mp3 -af "loudnorm=I=-24:TP=-2,afade=t=in:d=2" -b:a 96k calm.mp3`
