#!/usr/bin/env bash
# Renamed to upgrade.sh, which handles every release. Kept so old links work.
set -uo pipefail
src=${BASH_SOURCE[0]:-}
if [ -n "$src" ] && [ -f "$(dirname "$src")/upgrade.sh" ]; then
  exec bash "$(dirname "$src")/upgrade.sh" "$@"
fi
curl -fsSL https://raw.githubusercontent.com/henkisdabro/wookstar-claude-plugins/main/scripts/upgrade.sh | bash -s -- "$@"
