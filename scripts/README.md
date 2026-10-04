# Scripts

Helper scripts that sit beside the wookstar-claude-plugins marketplace rather than inside it.

## install-claude-plugins.sh

**Purpose:** Adds a set of Claude Code marketplaces and installs selected plugins on a fresh Linux machine. It reflects henkisdabro's own setup, so read the lists before running it.

### What it does

1. Checks that `claude` is on `PATH` and creates `~/.claude` if missing.
2. Removes the retired 5.x plugins (`productivity`, `marketing`, `utilities`) and their leftover folders, and warns about stale references in `~/.claude/settings.json`.
3. Adds each marketplace, or updates it when it is already there.
4. Installs every entry in `PLUGINS_TO_ENABLE`.

**Marketplaces** (`MARKETPLACES` array):

| Name | Source |
|------|--------|
| `claude-plugins-official` | `anthropics/claude-plugins-official` |
| `wookstar-claude-plugins` | `henkisdabro/wookstar-claude-plugins` (this repo) |
| `claude-scientific-skills` | `K-Dense-AI/claude-scientific-skills` |
| `claude-skills` | `secondsky/claude-skills` |

**Plugins** (`PLUGINS_TO_ENABLE` array):

- From `claude-plugins-official`: `agent-sdk-dev`, `commit-commands`, `feature-dev`, `frontend-design`, `code-review`, `security-guidance`, `plugin-dev`.
- From `wookstar-claude-plugins`: every 7.0.0 plugin is listed but commented out - uncomment the ones you want.
- From `claude-scientific-skills` and `claude-skills`: none. The marketplaces are added so their plugins are available to install by hand; the commented-out `claude-skills` bundles are marked broken in the script.

### Usage

```bash
./scripts/install-claude-plugins.sh

# or straight from GitHub
curl -fsSL https://raw.githubusercontent.com/henkisdabro/wookstar-claude-plugins/main/scripts/install-claude-plugins.sh | bash
```

### Requirements

- Claude Code on `PATH`, installed with the native installer: `curl -fsSL https://claude.ai/install.sh | bash` (see the [setup docs](https://code.claude.com/docs/en/setup))
- Linux (tested on WSL2/Ubuntu)

### Customisation

Edit the `MARKETPLACES` and `PLUGINS_TO_ENABLE` arrays in the script.

## upgrade-v7.sh

**Purpose:** Moves an existing 6.x install to 7.0.0. It updates the plugins you keep, uninstalls the retired ones and installs the official replacement where one exists, fills in the settings that credential plugins now ask for (reusing old shell variables it finds), and lists suggestions for plugins that lost components. See [MIGRATION.md](../MIGRATION.md).

Preview first, then run for real:

```bash
curl -fsSL https://raw.githubusercontent.com/henkisdabro/wookstar-claude-plugins/main/scripts/upgrade-v7.sh | bash -s -- --dry-run
curl -fsSL https://raw.githubusercontent.com/henkisdabro/wookstar-claude-plugins/main/scripts/upgrade-v7.sh | bash
```

Options: `--dry-run` prints what would happen without changing anything; `--no-install` only updates kept plugins and uninstalls retired ones. Needs `claude` and `jq` on `PATH`.
