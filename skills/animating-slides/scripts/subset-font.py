#!/usr/bin/env python3
"""Embed a font in a deck, cut down to the characters the deck uses, so the venue PC renders it exactly.

  pip install fonttools brotli
  python3 subset-font.py <font.ttf|otf|ttc> <family-name> <deck-dir> [--weight 800] [--index N]

Writes <deck-dir>/fonts/<family>-<weight>.woff2 and prints the @font-face rule to paste into index.html.
Characters: everything in the deck's .html and .js files, plus printable ASCII and common punctuation.
Re-run it after you change the words on screen. --index picks a face inside a .ttc collection.
The font's license must allow embedding (OFL fonts such as Noto, Inter or Source Han do).
"""
import pathlib, sys
from fontTools import subset

args = sys.argv[1:]
def opt(name, default):
    if name in args:
        i = args.index(name); v = args[i + 1]; del args[i:i + 2]; return v
    return default
weight, index = opt('--weight', '400'), int(opt('--index', '0'))
if len(args) != 3:
    sys.exit(__doc__)
font, family, deck = pathlib.Path(args[0]), args[1], pathlib.Path(args[2])
chars = set(chr(c) for c in range(0x20, 0x7f)) | set('\u2014\u2013\u2026\u2018\u2019\u201c\u201d\u00b7\u00d7\u2192\u2190\u3001\u3002\uff0c\uff01\uff1f\uff1a\uff1b\u300c\u300d')
for f in list(deck.rglob('*.js')) + list(deck.rglob('*.html')):
    chars |= set(f.read_text(encoding='utf-8'))
opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = ['*']; opts.font_number = index
f = subset.load_font(str(font), opts)
s = subset.Subsetter(opts); s.populate(text=''.join(chars)); s.subset(f)
out = deck / 'fonts' / f'{family}-{weight}.woff2'
out.parent.mkdir(exist_ok=True)
subset.save_font(f, str(out), opts)
print(f'{out} ({out.stat().st_size // 1024} KB)')
print(f'@font-face {{ font-family: "{family}"; font-weight: {weight}; src: url(fonts/{family}-{weight}.woff2) format("woff2"); }}')
