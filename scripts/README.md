# Scripts

This directory contains utility scripts that are **personal tools** and not part of the wookstar-claude-plugins marketplace itself.

## install-claude-plugins.sh

**Purpose:** Automated installation of Claude Code marketplaces and plugins for fresh Linux installations.

**Note:** This is a personal convenience script maintained by Henrik Soederlund. It installs plugins from multiple marketplaces (not just wookstar) and represents personal preferences for a development environment setup.

### What It Installs

**Marketplaces:**
- `claude-code-plugins` - Official Anthropic plugins
- `wookstar-claude-plugins` - This marketplace
- `claude-scientific-skills` - K-Dense AI scientific skills
- `claude-skills` - jezweb community skills

**Plugins:**
- Official Anthropic plugins (agent-sdk-dev, commit-commands, feature-dev, etc.)
- Selected wookstar plugins
- Scientific skills
- Individual working plugins from claude-skills (avoiding buggy bundled plugins)

### Usage

```bash
# Make executable (if needed)
chmod +x install-claude-plugins.sh

# Run the script
./install-claude-plugins.sh
```

### Requirements

- Claude Code installed and in PATH (`npm install -g @anthropic-ai/claude-code`)
- Linux environment (tested on WSL2/Ubuntu)

### Known Issues

The `claude-skills` marketplace has some bundled plugins with bugs (missing skill files). This script installs individual plugins that work correctly, avoiding:
- `cloudflare-skills` (bundle)
- `frontend-skills` (bundle)
- `tooling-skills` (bundle)

### Customisation

Edit the `PLUGINS_TO_ENABLE` array in the script to add/remove plugins according to your preferences.

---

**Author:** Henrik Soederlund
**Not for redistribution** - This is a personal utility script.
