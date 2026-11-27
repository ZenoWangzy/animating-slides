// The running order and the deck-wide settings. Scenes register themselves in scenes/*.js.
Deck.start({
  order: ['cover', 'count', 'trio', 'end'],
  bpm: 96, // the timing grid: every scene times its choreography in beats of this tempo
  // one recorded track per act, crossfaded on the scene change; a scene picks its act with `act`.
  // Bring your own files (see media/music/README.md). Leave this empty for a silent deck: sfx still play.
  music: {
    // calm: 'media/music/calm.mp3',
    // drive: 'media/music/drive.mp3',
  },
  accent: Parts.PAL.tomato, // click ripples
  // a brand mark on every page, top right; it uses currentColor, so it turns white on dark scenes
  mark: '<svg viewBox="0 0 48 48"><rect x="4" y="4" width="40" height="40" rx="12" fill="currentColor"/><circle cx="18" cy="22" r="4" fill="#ff5a36"/><circle cx="30" cy="22" r="4" fill="#ff5a36"/></svg>',
});
