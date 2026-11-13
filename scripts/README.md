# Scripts

Helper scripts that sit beside the wookstar-claude-plugins marketplace rather than inside it.

## upgrade.sh

**Purpose:** Brings an existing install up to the current release, from 6.x or 7.x. It updates the plugins you keep, uninstalls the retired ones and installs the official replacement where one exists, fills in the settings that credential plugins ask for (reusing old shell variables it finds), and lists suggestions for plugins that lost components. It only acts on what is still outstanding, so it is safe to run again. See [MIGRATION.md](../MIGRATION.md).

Preview first, then run for real:

```bash
curl -fsSL https://raw.githubusercontent.com/henkisdabro/wookstar-claude-plugins/main/scripts/upgrade.sh | bash -s -- --dry-run
curl -fsSL https://raw.githubusercontent.com/henkisdabro/wookstar-claude-plugins/main/scripts/upgrade.sh | bash
```

Options: `--dry-run` prints what would happen without changing anything; `--no-install` only updates kept plugins and uninstalls retired ones. Needs `claude` and `jq` on `PATH`.

`upgrade-v7.sh` is the old name, kept as a wrapper so links in earlier release notes still work.
