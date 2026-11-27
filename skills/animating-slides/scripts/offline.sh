#!/usr/bin/env bash
# Pack a deck for a venue PC: one index.html with every local script and font inlined, plus media/.
# Opens by double-click, needs no network. Inlining also gets the zip past mail filters that block .js files.
# Usage: offline.sh <deck-dir> <out.zip> [budget MB, default 20]
set -euo pipefail
[ $# -ge 2 ] || { echo "usage: offline.sh <deck-dir> <out.zip> [budget MB]" >&2; exit 2; }
DECK=$(cd "$1" && pwd); OUT="$(cd "$(dirname "$2")" && pwd)/$(basename "$2")"; BUDGET=${3:-20}
NAME=$(basename "${OUT%.zip}")
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
PKG="$TMP/$NAME"; mkdir -p "$PKG"
if [ -d "$DECK/media" ]; then cp -r "$DECK/media" "$PKG/"; fi
node - "$DECK" "$PKG/index.html" <<'JS'
const fs = require('fs'), path = require('path');
const [deck, out] = process.argv.slice(2);
let html = fs.readFileSync(path.join(deck, 'index.html'), 'utf8');
const local = src => !/^([a-z]+:)?\/\//i.test(src) && !src.startsWith('data:');
const read = rel => { const f = path.join(deck, rel.split(/[?#]/)[0]); if (!fs.existsSync(f)) { console.error('missing: ' + rel); process.exit(1); } return fs.readFileSync(f); };
let n = 0;
html = html.replace(/<script src="([^"]+)"><\/script>/g, (tag, src) => local(src) ? (n++, '<script>' + read(src).toString('utf8').replace(/<\/script/gi, '<\\/script') + '</script>') : tag);
const mime = { '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf' };
html = html.replace(/url\((['"]?)([^'")]+\.(woff2|woff|ttf|otf))\1\)/g, (m, q, src) => local(src) ? (n++, 'url(data:' + mime[path.extname(src)] + ';base64,' + read(src).toString('base64') + ')') : m);
fs.writeFileSync(out, html);
console.error('inlined ' + n + ' files');
JS
grep -q '@font-face' "$DECK/index.html" || echo "warning: no @font-face in index.html: the venue PC will use its own fonts (embed them with subset-font.py, a must for Chinese or Japanese text)" >&2
printf 'Open index.html in Chrome or Edge.\nKeys: arrows, space or click to step; N speaker notes; M mute; F full screen.\n' > "$PKG/README.txt"
rm -f "$OUT"; (cd "$TMP" && zip -qr "$OUT" "$NAME")
size=$(wc -c < "$OUT")
if [ "$size" -gt $((BUDGET * 1000000)) ]; then echo "$OUT is $size bytes, over the ${BUDGET} MB budget (mail limits are about 25 MB)" >&2; exit 1; fi
echo "$OUT $size"
