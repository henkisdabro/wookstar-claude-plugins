#!/usr/bin/env bash
# PostToolUse hook: auto-builds and serves .fragment.md files written by Claude.
# Fires on every Write tool call; exits silently for non-fragment files.
#
# State files written into ${CLAUDE_PROJECT_DIR}/.claude/:
#   .message-preview-url       — URL of the most recently served fragment (quick read)
#   .message-previews.json     — map of {absoluteFragmentPath: url} for all live servers

set -euo pipefail

INPUT=$(cat)

# Extract file_path — try jq first, fall back to python3
FILE_PATH=$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null \
    || printf '%s' "$INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('tool_input', {}).get('file_path', ''))
except Exception:
    print('')
" 2>/dev/null || true)

# Only handle .fragment.md files
case "$FILE_PATH" in
    *.fragment.md) ;;
    *) exit 0 ;;
esac

# Normalise to absolute path so map keys are stable across cwd changes
if [[ "$FILE_PATH" != /* ]]; then
    FILE_PATH="${CLAUDE_PROJECT_DIR}/${FILE_PATH}"
fi

SCRIPTS_DIR="${CLAUDE_PLUGIN_ROOT}/skills/message/scripts"
PREVIEWS_FILE="${CLAUDE_PROJECT_DIR}/.claude/.message-previews.json"
LATEST_FILE="${CLAUDE_PROJECT_DIR}/.claude/.message-preview-url"

# Ensure state directory exists (new projects may not have .claude/ yet)
mkdir -p "$(dirname "$PREVIEWS_FILE")"

_write_state() {
    local url="$1"
    python3 -c "
import json, sys, os
f, k, v = sys.argv[1], sys.argv[2], sys.argv[3]
d = {}
if os.path.exists(f):
    try: d = json.load(open(f))
    except: pass
d[k] = v
json.dump(d, open(f, 'w'), indent=2)
" "$PREVIEWS_FILE" "$FILE_PATH" "$url" 2>/dev/null || true
    echo "$url" > "$LATEST_FILE"
}

_open_browser() {
    local url="$1"
    case "$(uname -s)" in
        Darwin) open "$url" 2>/dev/null || true ;;
        Linux)  xdg-open "$url" 2>/dev/null || true ;;
    esac
}

# Check if a server is already running for this fragment
EXISTING_URL=""
if [[ -f "$PREVIEWS_FILE" ]]; then
    EXISTING_URL=$(jq -r --arg k "$FILE_PATH" '.[$k] // empty' "$PREVIEWS_FILE" 2>/dev/null || true)
fi

if [[ -n "$EXISTING_URL" ]]; then
    if curl -sf --max-time 1 "$EXISTING_URL" >/dev/null 2>&1; then
        _write_state "$EXISTING_URL"
        _open_browser "$EXISTING_URL"
        exit 0
    fi
fi

# Locate bun, installing automatically if not found
BUN=$(command -v bun 2>/dev/null || echo "$HOME/.bun/bin/bun")
if [[ ! -x "$BUN" ]]; then
    curl -fsSL https://bun.sh/install | bash >/dev/null 2>&1 || true
    BUN="$HOME/.bun/bin/bun"
    if [[ ! -x "$BUN" ]]; then
        exit 0
    fi
fi

# Install dependencies on first use
if [[ ! -d "$SCRIPTS_DIR/node_modules" ]]; then
    "$BUN" install --cwd "$SCRIPTS_DIR" --silent 2>/dev/null || exit 0
fi

# Launch server with nohup so it survives hook exit and stays alive for hours.
# MESSAGE_NO_OPEN=1 suppresses serve.ts's own browser open; the hook controls
# when the browser fires (only after the URL is confirmed ready).
TMPFILE=$(mktemp /tmp/msg-serve-XXXXXX)
trap 'rm -f "$TMPFILE"' EXIT
MESSAGE_NO_OPEN=1 nohup "$BUN" run "$SCRIPTS_DIR/serve.ts" "$FILE_PATH" >"$TMPFILE" 2>/dev/null &

# serve.ts prints: line 1 = output HTML path, line 2 = http://127.0.0.1:PORT/
# Poll up to 3 s for line 2 to appear.
URL=""
for _ in {1..30}; do
    sleep 0.1
    URL=$(awk 'NR==2{print;exit}' "$TMPFILE")
    [[ -n "$URL" ]] && break
done

[[ -z "$URL" ]] && exit 0

_write_state "$URL"
_open_browser "$URL"
