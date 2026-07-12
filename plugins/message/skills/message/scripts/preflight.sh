#!/usr/bin/env bash
# Preflight / doctor for the `message` skill.
#
# Verifies - and where possible installs - everything needed to build and serve
# fragment previews on a fresh clone, on macOS or Linux. Run it once on a new
# machine (or any time the preview fails to start):
#
#   bash .claude/skills/message/scripts/preflight.sh
#
# It resolves bun without assuming an install location, installs the runtime
# dependency, and runs an end-to-end build self-test. Every unrecoverable
# problem FAILS LOUDLY with the exact command to fix it, so a Claude Code agent
# in another environment can repair the box and re-run. Exit 0 = ready.
set -uo pipefail  # deliberately not -e: we handle each failure with its own message.

# Resolve this script's own directory - no hardcoded paths, works from any cwd.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -t 1 ]; then C_OK=$'\033[32m'; C_WARN=$'\033[33m'; C_ERR=$'\033[31m'; C_RST=$'\033[0m'
else C_OK=''; C_WARN=''; C_ERR=''; C_RST=''; fi
ok(){   printf '  %s✓%s %s\n' "$C_OK" "$C_RST" "$1"; }
warn(){ printf '  %s!%s %s\n' "$C_WARN" "$C_RST" "$1"; }
die(){  printf '  %s✗ %s%s\n' "$C_ERR" "$1" "$C_RST" >&2; [ -n "${2:-}" ] && printf '     -> %s\n' "$2" >&2; exit 1; }

echo "message skill preflight  (platform: $(uname -s) $(uname -m))"

# 1. Resolve bun: PATH first, then bun's default install dir. Install if absent.
find_bun(){
  if command -v bun >/dev/null 2>&1; then command -v bun; return 0; fi
  [ -x "$HOME/.bun/bin/bun" ] && { echo "$HOME/.bun/bin/bun"; return 0; }
  return 1
}
BUN="$(find_bun || true)"
if [ -z "$BUN" ]; then
  warn "bun not found - installing via https://bun.sh/install"
  command -v curl >/dev/null 2>&1 || die "curl is required to install bun" "Install curl (Debian/Ubuntu: apt-get install -y curl; Fedora: dnf install -y curl) then re-run."
  if [ "$(uname -s)" = "Linux" ]; then
    command -v unzip >/dev/null 2>&1 || die "unzip is required by the bun installer" "Install unzip (apt-get install -y unzip / dnf install -y unzip) then re-run."
  fi
  curl -fsSL https://bun.sh/install | bash >/dev/null 2>&1 || die "bun install failed" "Install bun manually: https://bun.sh/docs/installation"
  BUN="$(find_bun || true)"
  [ -n "$BUN" ] || die "bun still not on PATH after install" "Add \$HOME/.bun/bin to PATH (the installer edits your shell rc; open a new shell) or install bun manually."
fi
ok "bun: $BUN ($("$BUN" --version 2>/dev/null || echo '?'))"

# 2. Runtime dependency (marked). Install if the tree is missing.
if [ ! -d "$SCRIPT_DIR/node_modules" ]; then
  warn "node_modules missing - running bun install"
  ( cd "$SCRIPT_DIR" && "$BUN" install ) || die "bun install failed" "Run: cd '$SCRIPT_DIR' && bun install"
fi
[ -d "$SCRIPT_DIR/node_modules/marked" ] || die "dependency 'marked' not installed" "Run: cd '$SCRIPT_DIR' && bun install"
ok "dependencies installed (marked)"

# 3. End-to-end self-test: build a throwaway fragment (offline; exercises
#    parse -> transform -> assemble). Proves the pipeline actually runs here.
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
FRAG="$TMP/preflight.fragment.md"
printf '%s\n' '---' 'to: test@example.com' 'subject: preflight' '---' '' '# Hello' '' 'Body with **bold** text.' > "$FRAG"
if "$BUN" run "$SCRIPT_DIR/serve.ts" "$FRAG" --build-only >/dev/null 2>"$TMP/err"; then
  ok "build self-test passed"
else
  die "build self-test failed" "$(head -3 "$TMP/err" 2>/dev/null)"
fi

echo
ok "ready. Serve a fragment with:"
printf '     %s run %s <path/to/name.fragment.md>\n' "$BUN" "$SCRIPT_DIR/serve.ts"
