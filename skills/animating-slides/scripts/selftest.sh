#!/usr/bin/env bash
# Self-test for the checkers: the example deck passes, a broken storyline fails for the right reasons.
set -euo pipefail
here=$(cd "$(dirname "$0")" && pwd); tpl="$here/../template"; tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT
python3 "$here/check-storyline.py" "$tpl/storyline.md" --deck "$tpl" >/dev/null
sed -e 's/^- Source: the speaker$/- Source: assistant/' -e 's/"Your turn."/"See you"/' -e 's/^- Source: this skill.s SKILL.md$/- Source: Stanford AI Index 2025/' "$tpl/storyline.md" > "$tmp/bad.md"
out=$(python3 "$here/check-storyline.py" "$tmp/bad.md" --deck "$tpl" || true)
grep -q 'cover-1: Source "assistant" is not a source' <<<"$out"
grep -q 'end-1: Point quotes "See you"' <<<"$out"
! grep -q 'trio' <<<"$out"   # a real source that mentions AI passes
cmp -s "$tpl/engine.js" "$here/../examples/grokbot-talk/engine.js" || { echo "examples/grokbot-talk/engine.js differs from template/engine.js"; exit 1; }
node --check "$here/../examples/grokbot-talk/scenes/talk.js"; node --check "$here/../examples/grokbot-talk/scenes/opening.js"
bash -n "$here/offline.sh"
node --check "$here/qa.mjs"
echo "selftest OK"
