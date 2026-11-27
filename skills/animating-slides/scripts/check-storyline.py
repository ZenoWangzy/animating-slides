#!/usr/bin/env python3
"""Check a deck's storyline.md: every beat has Say, Point and Source; nothing is invented.

  python3 check-storyline.py <storyline.md> [--deck <deck-dir>]

A beat is a "## <scene>-<step>" heading followed by:
  - Say: what the speaker says (the speaker's own words; quotes from people go in quotation marks)
  - Point: the one thing a viewer must get from the screen with the sound off
  - Source: where every fact and number in this beat comes from (a person's words, a file, a URL)
Rules:
  1. All three fields are present and non-empty.
  2. Source names a real source. "assistant", "agent", "model", "AI", "guess" and "invented" are not sources.
  3. Quoted text in Point ("...", “...”, 「...」) appears word for word in Say.
  4. With --deck: every step of the deck has a beat, and every beat is a step of the deck.
Exit 1 on any failure.
"""
import pathlib, re, sys

args = sys.argv[1:]
deck = None
if '--deck' in args:
    i = args.index('--deck'); deck = pathlib.Path(args[i + 1]); del args[i:i + 2]
if len(args) != 1:
    sys.exit(__doc__)
text = pathlib.Path(args[0]).read_text(encoding='utf-8')

beats, cur = {}, None
for line in text.splitlines():
    m = re.match(r'^##\s+([\w-]+-\d+)\s*$', line)
    if m:
        cur = beats.setdefault(m.group(1), {})
        continue
    m = re.match(r'^-\s*(Say|Point|Source)\s*:\s*(.*)$', line)
    if m and cur is not None:
        cur[m.group(1)] = (cur.get(m.group(1), '') + ' ' + m.group(2)).strip()

bad = []
# the whole field names the writer instead of a source; "Stanford AI Index 2025" or "model card v2" are fine
NOT_SOURCE = re.compile(r'^\W*(the |an? )?(assistant|agent|model|llm|ai|claude|chatgpt|guess(ed)?|invented|made up|none|n/?a|tbd)\W*$', re.I)
QUOTE = re.compile(r'"([^"]+)"|\u201c([^\u201d]+)\u201d|\u300c([^\u300d]+)\u300d')
for key, b in beats.items():
    for f in ('Say', 'Point', 'Source'):
        if not b.get(f):
            bad.append(f'{key}: no {f}')
    src = b.get('Source', '')
    if src and NOT_SOURCE.search(src):
        bad.append(f'{key}: Source "{src}" is not a source (name the person, file or URL)')
    for q in QUOTE.findall(b.get('Point', '')):
        q = next(x for x in q if x)
        if q not in b.get('Say', ''):
            bad.append(f'{key}: Point quotes "{q}", which is not in Say')

if deck:
    order = re.search(r'order\s*:\s*\[([^\]]*)\]', (deck / 'deck.js').read_text(encoding='utf-8'))
    ids = re.findall(r"['\"]([\w-]+)['\"]", order.group(1)) if order else []
    steps = {}
    for f in (deck / 'scenes').glob('*.js'):
        src = f.read_text(encoding='utf-8')
        for m in re.finditer(r"id\s*:\s*['\"]([\w-]+)['\"]\s*,\s*(?:steps\s*:\s*(\d+))?", src):
            steps[m.group(1)] = int(m.group(2) or 1)
    want = {f'{i}-{n}' for i in ids for n in range(1, steps.get(i, 1) + 1)}
    bad += [f'{k}: step in the deck, no beat in the storyline' for k in sorted(want - beats.keys())]
    bad += [f'{k}: beat in the storyline, no such step in the deck' for k in sorted(beats.keys() - want)]

for b in bad:
    print(b)
print(('FAIL' if bad else 'OK') + f': {len(beats)} beats checked')
sys.exit(1 if bad else 0)
