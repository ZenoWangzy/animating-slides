// The running order of the talk. The scenes register themselves in scenes/talk.js and scenes/opening.js.
Deck.start({
  order: ['cover', 'ledger', 'problem', 'masters', 'learn', 'brain', 'factory', 'night', 'copy', 'end'],
  bpm: 96, // must match BEAT in scenes/talk.js
  // one recorded track per act (bed, pain, learn, engine); bring your own files, see the template's media/music/README.md
  music: {
    // bed: 'media/music/bed.mp3',
    // pain: 'media/music/pain.mp3',
    // learn: 'media/music/learn.mp3',
    // engine: 'media/music/engine.mp3',
  },
  accent: Talk.COL.purple,
  mark: '<svg viewBox="0 0 48 48"><rect x="6" y="26" width="9" height="16" rx="3" fill="currentColor"/><rect x="19.5" y="16" width="9" height="26" rx="3" fill="currentColor"/><rect x="33" y="6" width="9" height="36" rx="3" fill="#A97EFE"/></svg>',
});
