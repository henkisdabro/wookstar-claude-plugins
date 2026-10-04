#!/usr/bin/env bash
# Upgrade from wookstar-claude-plugins 6.x to 7.0.0.
#
# Uninstalls the retired plugins you have installed, installs the official
# replacement for each, and lists suggestions for plugins that lost components.
# See MIGRATION.md for the full mapping.
#
# Usage: scripts/upgrade-v7.sh [--dry-run] [--no-install]
#   --dry-run     print the commands without running them
#   --no-install  uninstall retired plugins only; install nothing
set -euo pipefail

MP=wookstar-claude-plugins
DRY=0
INSTALL=1
for arg in "$@"; do
  case $arg in
    --dry-run) DRY=1 ;;
    --no-install) INSTALL=0 ;;
    -h | --help) sed -n '2,12p' "$0"; exit 0 ;;
    *) echo "Unknown option: $arg" >&2; exit 2 ;;
  esac
done

for bin in claude jq; do
  command -v "$bin" >/dev/null || { echo "Needs '$bin' on PATH." >&2; exit 1; }
done

run() {
  echo "+ $*"
  [ "$DRY" = 1 ] || "$@"
}

# Retired plugin -> official replacement (empty: none).
replacement() {
  case $1 in
    codex) echo "codex@openai-codex" ;;
    mcp-notion) echo "notion@claude-plugins-official" ;;
    mcp-cloudflare) echo "cloudflare@claude-plugins-official" ;;
    *) echo "" ;;
  esac
}

# Why a retired plugin has no replacement.
no_replacement_note() {
  case $1 in
    gemini | mcp-gemini-bridge) echo "Gemini CLI stopped serving individual accounts on 2026-06-18 and there is no official Gemini plugin for Claude Code." ;;
    mcp-fetch) echo "Claude Code's built-in WebFetch tool covers it - nothing to install." ;;
  esac
}

# Kept plugin -> official plugins that replace the components it lost.
suggestions() {
  case $1 in
    developer) echo "chrome-devtools-mcp@claude-plugins-official playwright@claude-plugins-official context7@claude-plugins-official firecrawl@claude-plugins-official microsoft-docs@claude-plugins-official example-skills@anthropic-agent-skills" ;;
    documents) echo "document-skills@anthropic-agent-skills" ;;
    shopify-developer) echo "shopify-ai-toolkit@claude-plugins-official" ;;
  esac
}

marketplace_source() {
  case $1 in
    claude-plugins-official) echo "anthropics/claude-plugins-official" ;;
    anthropic-agent-skills) echo "anthropics/skills" ;;
    openai-codex) echo "openai/codex-plugin-cc" ;;
  esac
}

ensure_marketplace() {
  local name=$1
  if ! claude plugin marketplace list --json | jq -e --arg n "$name" 'any(.[]; .name == $n)' >/dev/null; then
    run claude plugin marketplace add "$(marketplace_source "$name")"
  fi
}

echo "== Refreshing the $MP marketplace"
run claude plugin marketplace update "$MP"

installed=$(claude plugin list --json)
# "<name> <scope>" for every plugin installed from this marketplace.
ours=$(jq -r --arg mp "$MP" '.[] | select(.id | endswith("@" + $mp)) | "\(.id | split("@")[0]) \(.scope)"' <<<"$installed")

to_install=""
other_scope=""
echo
echo "== Removing retired plugins"
for name in codex gemini mcp-gemini-bridge mcp-notion mcp-cloudflare mcp-fetch; do
  scopes=$(awk -v n="$name" '$1 == n { print $2 }' <<<"$ours")
  [ -z "$scopes" ] && continue
  rep=$(replacement "$name")
  [ -z "$rep" ] && echo "  $name: $(no_replacement_note "$name")"
  for scope in $scopes; do
    if [ "$scope" = user ]; then
      run claude plugin uninstall "$name@$MP" --scope user
      [ -n "$rep" ] && to_install+="$rep "
    else
      other_scope+="  claude plugin uninstall $name@$MP --scope $scope"$'\n'
      [ -n "$rep" ] && other_scope+="  claude plugin install $rep --scope $scope"$'\n'
    fi
  done
done

if [ "$INSTALL" = 1 ] && [ -n "$to_install" ]; then
  echo
  echo "== Installing official replacements"
  for rep in $to_install; do
    if jq -e --arg id "$rep" 'any(.[]; .id == $id)' <<<"$installed" >/dev/null; then
      echo "  $rep already installed"
      continue
    fi
    ensure_marketplace "${rep#*@}"
    run claude plugin install "$rep"
  done
fi

if [ -n "$other_scope" ]; then
  echo
  echo "== Project or local installs - run these from the project directory"
  printf '%s' "$other_scope"
fi

echo
echo "== Suggestions for plugins you kept"
any=0
for name in developer documents shopify-developer; do
  awk -v n="$name" '$1 == n { found = 1 } END { exit !found }' <<<"$ours" || continue
  any=1
  echo "  $name lost components to official plugins. Install the ones you use:"
  for s in $(suggestions "$name"); do
    echo "    claude plugin install $s"
  done
done
[ "$any" = 0 ] && echo "  none"

echo
echo "Done. Restart Claude Code to load the changes. Plugins that now prompt for"
echo "API keys (mcp-coingecko, mcp-perplexity, mcp-n8n, mcp-mikrotik,"
echo "mcp-google-workspace) ask on next enable - see MIGRATION.md."
