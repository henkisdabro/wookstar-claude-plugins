#!/usr/bin/env bash
# Upgrade from wookstar-claude-plugins 6.x to 7.0.0. See MIGRATION.md.
set -uo pipefail

usage() {
  cat <<'EOF'
Upgrade from wookstar-claude-plugins 6.x to 7.0.0.

Uninstalls the retired plugins you have, installs the official replacement for
each, fills in the settings that credential plugins now ask for (reusing your
old shell variables where it finds them), and lists suggestions for plugins
that lost components. See MIGRATION.md.

Usage: upgrade-v7.sh [--dry-run] [--no-install]
  --dry-run     print what would happen without changing anything
  --no-install  uninstall retired plugins only; install and configure nothing

Piped from curl, pass options after `bash -s --`:
  curl -fsSL <url>/upgrade-v7.sh | bash -s -- --dry-run
EOF
}

MP=wookstar-claude-plugins
DRY=0
INSTALL=1
for arg in "$@"; do
  case $arg in
    --dry-run) DRY=1 ;;
    --no-install) INSTALL=0 ;;
    -h | --help) usage; exit 0 ;;
    *) echo "Unknown option: $arg" >&2; usage >&2; exit 2 ;;
  esac
done

for bin in claude jq; do
  command -v "$bin" >/dev/null || { echo "Needs '$bin' on PATH." >&2; exit 1; }
done

FAILED=0
# Run a state-changing command. stdin comes from /dev/null so nothing can
# swallow the rest of this script when it arrives through `curl | bash`.
run() {
  echo "+ $*"
  [ "$DRY" = 1 ] && return 0
  "$@" </dev/null || { echo "  ! failed: $*" >&2; FAILED=1; return 1; }
}

# Retired plugin -> official replacement (empty: none).
replacement() {
  case $1 in
    codex) echo "codex@openai-codex" ;;
    mcp-notion) echo "notion@claude-plugins-official" ;;
    mcp-cloudflare) echo "cloudflare@claude-plugins-official" ;;
  esac
}

no_replacement_note() {
  case $1 in
    gemini | mcp-gemini-bridge) echo "Gemini CLI stopped serving individual accounts on 2026-06-18 and there is no official Gemini plugin for Claude Code." ;;
    mcp-fetch) echo "the built-in WebFetch tool in Claude Code covers it - nothing to install." ;;
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

# Shell variable that 6.x read for a userConfig option, if any.
legacy_var() {
  case $1 in
    n8n_api_key) echo N8N_API_KEY ;;
    n8n_api_url) echo N8N_API_URL ;;
    coingecko_demo_api_key) echo COINGECKO_DEMO_API_KEY ;;
    perplexity_api_key) echo PERPLEXITY_API_KEY ;;
    mikrotik_host) echo MIKROTIK_HOST ;;
    mikrotik_username) echo MIKROTIK_USER ;;
    mikrotik_password) echo MIKROTIK_PASSWORD ;;
    google_oauth_client_id) echo GOOGLE_OAUTH_CLIENT_ID ;;
    google_oauth_client_secret) echo GOOGLE_OAUTH_CLIENT_SECRET ;;
  esac
}

has_marketplace() {
  claude plugin marketplace list --json </dev/null | jq -e --arg n "$1" 'any(.[]; .name == $n)' >/dev/null
}

ensure_marketplace() {
  has_marketplace "$1" || run claude plugin marketplace add "$(marketplace_source "$1")"
}

have_tty() { (: </dev/tty) 2>/dev/null; }

if ! has_marketplace "$MP"; then
  echo "The $MP marketplace is not registered here - nothing to migrate."
  exit 0
fi

# Snapshot before refreshing, so nothing the refresh changes hides an install.
installed=$(claude plugin list --json </dev/null)
# "<name> <scope>" for every plugin installed from this marketplace.
ours=$(jq -r --arg mp "$MP" '.[] | select(.id | endswith("@" + $mp)) | "\(.id | split("@")[0]) \(.scope)"' <<<"$installed")
has_plugin() { awk -v n="$1" '$1 == n { found = 1 } END { exit !found }' <<<"$ours"; }

echo "== Refreshing the $MP marketplace"
run claude plugin marketplace update "$MP" || true

to_install=""
other_scope=""
echo
echo "== Removing retired plugins"
any=0
for name in codex gemini mcp-gemini-bridge mcp-notion mcp-cloudflare mcp-fetch; do
  scopes=$(awk -v n="$name" '$1 == n { print $2 }' <<<"$ours")
  [ -z "$scopes" ] && continue
  any=1
  rep=$(replacement "$name")
  [ -z "$rep" ] && echo "  $name: $(no_replacement_note "$name")"
  for scope in $scopes; do
    if [ "$scope" = user ]; then
      run claude plugin uninstall "$name@$MP" --scope user && [ -n "$rep" ] && to_install+="$rep "
    else
      other_scope+="  claude plugin uninstall $name@$MP --scope $scope"$'\n'
      [ -n "$rep" ] && other_scope+="  claude plugin install $rep --scope $scope"$'\n'
    fi
  done
done
[ "$any" = 0 ] && echo "  none installed"

if [ "$INSTALL" = 1 ] && [ -n "$to_install" ]; then
  echo
  echo "== Installing official replacements"
  for rep in $to_install; do
    if jq -e --arg id "$rep" 'any(.[]; .id == $id and .scope == "user")' <<<"$installed" >/dev/null; then
      echo "  $rep already installed"
      continue
    fi
    ensure_marketplace "${rep#*@}" && run claude plugin install "$rep" --scope user
  done
fi

if [ "$INSTALL" = 1 ]; then
  echo
  echo "== Settings for credential plugins"
  any=0
  for name in mcp-n8n mcp-coingecko mcp-perplexity mcp-mikrotik mcp-google-workspace; do
    has_plugin "$name" || continue
    any=1
    id="$name@$MP"
    info=$(claude plugin configure "$id" --json </dev/null 2>/dev/null) || { echo "  $name: could not read its options - run: claude plugin configure $id"; continue; }
    missing=$(jq -r '.unconfigured[]?' <<<"$info")
    if [ -z "$missing" ]; then echo "  $name: already configured"; continue; fi
    values='{}'
    for key in $missing; do
      title=$(jq -r --arg k "$key" '.schema[$k].title // $k' <<<"$info")
      sensitive=$(jq -r --arg k "$key" '.schema[$k].sensitive // false' <<<"$info")
      var=$(legacy_var "$key")
      val=""
      if [ -n "$var" ] && [ -n "${!var:-}" ]; then
        val=${!var}
        echo "  $name: $title - using \$$var from your environment"
      elif have_tty && [ "$DRY" = 0 ]; then
        if [ "$sensitive" = true ]; then
          read -r -s -p "  $name: $title (blank to skip): " val </dev/tty; echo
        else
          read -r -p "  $name: $title (blank to skip): " val </dev/tty
        fi
      fi
      [ -n "$val" ] && values=$(jq --arg k "$key" --arg v "$val" '. + {($k): $v}' <<<"$values")
    done
    if [ "$values" = '{}' ]; then
      echo "  $name: still needs $(tr '\n' ' ' <<<"$missing")- run: claude plugin configure $id"
    elif [ "$DRY" = 1 ]; then
      echo "+ claude plugin configure $id --values-stdin   # $(jq -r 'keys | join(", ")' <<<"$values")"
      left=$(jq -rn --argjson v "$values" --arg m "$missing" '$m | split("\n") | map(select(. as $k | $k != "" and ($v | has($k) | not))) | join(", ")')
      [ -n "$left" ] && echo "  $name: would still need $left"
    else
      echo "+ claude plugin configure $id --values-stdin"
      if claude plugin configure "$id" --values-stdin <<<"$values" >/dev/null; then
        left=$(claude plugin configure "$id" --json </dev/null 2>/dev/null | jq -r '.unconfigured | join(", ")')
        [ -n "$left" ] && echo "  $name: still needs $left - run: claude plugin configure $id"
      else
        echo "  ! failed - run: claude plugin configure $id" >&2
        FAILED=1
      fi
    fi
  done
  for name in mcp-alphavantage google-tagmanager; do
    has_plugin "$name" || continue
    any=1
    echo "  $name: now signs in with OAuth - in Claude Code run /mcp and pick its server"
  done
  [ "$any" = 0 ] && echo "  none installed"
fi

if [ -n "$other_scope" ]; then
  echo
  echo "== Project or local installs - run these from the project directory"
  printf '%s' "$other_scope"
fi

echo
echo "== Suggestions for plugins you kept"
any=0
added=""
for name in developer documents shopify-developer; do
  has_plugin "$name" || continue
  any=1
  echo "  $name moved some components to official plugins. Install the ones you use:"
  for s in $(suggestions "$name"); do
    mkt=${s#*@}
    if ! has_marketplace "$mkt" && [[ " $added " != *" $mkt "* ]]; then
      echo "    claude plugin marketplace add $(marketplace_source "$mkt")"
      added+="$mkt "
    fi
    echo "    claude plugin install $s"
  done
done
[ "$any" = 0 ] && echo "  none"

echo
if [ "$FAILED" = 1 ]; then
  echo "Finished with errors - see the lines marked '!' above. MIGRATION.md has the manual steps."
  exit 1
fi
echo "Done. Restart Claude Code to load the changes."
